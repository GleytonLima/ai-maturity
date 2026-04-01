import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FrameworkCatalogService } from './core/framework/framework-catalog.service';
import type {
  Assessment,
  AssessmentAnswer,
  AssessmentResult,
  AssessmentViewModel,
  CapabilityCard,
  CapabilityCardAiUsageType,
  CapabilityFlowMapRow,
  CapabilityToBeFlowRow,
  FrameworkCatalog,
  FrameworkDimension,
  FrameworkQuestion,
  Team,
  Tool,
  ToolStatus
} from './core/models/ai-maturity.models';
import { AiMaturityRepository } from './core/services/ai-maturity.repository';
import { AssessmentScoringService } from './core/services/assessment-scoring.service';
import { ExportService } from './core/services/export.service';

interface TeamFormState {
  name: string;
  sector: string;
  description: string;
}

interface ToolFormState {
  name: string;
  vendor: string;
  category: string;
  status: ToolStatus;
  description: string;
}

interface AssessmentDraftState {
  id: string | null;
  assessor: string;
  summary: string;
  teamId: string | null;
  responses: Record<string, AssessmentAnswer>;
}

interface ToolUsageSummary {
  toolId: string;
  name: string;
  count: number;
  teams: string[];
  questionCodes: string[];
}

export interface PaginatorEvent {
  pageIndex: number;
  pageSize: number;
}

function createDraftId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `assessment-${crypto.randomUUID()}`;
  }

  return `assessment-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/** Mensagem de erro ou null se o valor for vazio ou válido. */
function validateAsIsStepCount(value: string): string | null {
  const t = value.trim();
  if (!t) {
    return null;
  }
  if (!/^\d+$/.test(t)) {
    return 'Use apenas números inteiros (ex.: 5).';
  }
  const n = parseInt(t, 10);
  if (n < 1) {
    return 'O número de passos deve ser pelo menos 1.';
  }
  if (n > 9999) {
    return 'Valor muito alto; confira o número de passos.';
  }
  return null;
}

/** Aceita durações com algarismos ou palavras comuns (hora, minuto, dia…). */
function validateAsIsAvgTime(value: string): string | null {
  const t = value.trim();
  if (!t) {
    return null;
  }
  if (/\d/.test(t)) {
    return null;
  }
  if (
    /hora|horas|minuto|minutos|\bmin\b|dia|dias|semana|semanas|mês|meses|segundo|segundos/i.test(
      t
    )
  ) {
    return null;
  }
  return 'Indique uma duração com números ou palavras como hora, minuto ou dia (ex.: 45 min, 2 h, 1 dia útil).';
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly catalogService = inject(FrameworkCatalogService);
  private readonly repository = inject(AiMaturityRepository);
  private readonly scoringService = inject(AssessmentScoringService);
  private readonly exportService = inject(ExportService);

  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  protected readonly catalog = signal<FrameworkCatalog>(this.catalogService.getCatalog());
  protected readonly activeView = signal<
    'teams' | 'tools' | 'assessment' | 'results' | 'capability-cards'
  >('teams');
  protected readonly teams = this.repository.teams;
  protected readonly tools = this.repository.tools;
  protected readonly selectedTeamId = this.repository.selectedTeamId;
  protected readonly teamForm = signal<TeamFormState>({
    name: '',
    sector: '',
    description: ''
  });
  protected readonly toolForm = signal<ToolFormState>({
    name: '',
    vendor: '',
    category: '',
    status: 'experimental',
    description: ''
  });
  protected readonly editingTeamId = signal<string | null>(null);
  protected readonly editingToolId = signal<string | null>(null);
  protected readonly draft = signal<AssessmentDraftState>(this.createEmptyDraft());
  protected readonly feedback = signal<string>('');
  /** Painel de ajuda dos níveis (substitui MatDialog). */
  protected readonly levelsHelpOpen = signal(false);
  /** Dimensões expandidas no formulário de perguntas (substitui MatAccordion). */
  protected readonly expandedDimensionCodes = signal<Set<string>>(new Set());
  /** Seções expandidas no formulário de ficha de capacidade. */
  protected readonly expandedCapabilitySections = signal<Set<string>>(
    new Set(['cap-ctx', 'cap-asis', 'cap-flow'])
  );

  /** Textos do botão (?) na seção AS-IS da ficha de capacidade. */
  protected readonly asIsFieldHints = {
    flowDescription:
      'Objetivo: descrever o fluxo real hoje, de ponta a ponta (quem faz o quê e em que ordem). Ex.: "O analista recebe o pedido por e-mail, abre a planilha de controle, copia os dados manualmente para o Jira e envia o PDF ao cliente."',
    stepCount:
      'Objetivo: quantificar quantos passos distintos existem no processo (macro ou detalhado — mantenha o mesmo critério no restante da ficha). Ex.: 4 ou 12.',
    avgTime:
      'Objetivo: tempo médio para concluir a etapa ou o fluxo que você está descrevendo. Ex.: "45 min", "2 h", "1 dia útil", "cerca de 3 dias".',
    toolsUsed:
      'Marque as ferramentas do cadastro da aplicação usadas neste AS-IS. Use "Outras" só para itens ainda não cadastrados ou observações curtas. Ideal: manter o catálogo atualizado e preferir seleção a texto livre.',
    frequency:
      'Objetivo: deixar claro com que ritmo o trabalho se repete. Ex.: "diário", "120 vezes por mês", "a cada sprint", "sob demanda".',
    mainPains:
      'Objetivo: registrar gargalos, retrabalho, riscos ou frustrações relatadas pelo time. Ex.: "erros ao copiar dados entre sistemas", "falta de padrão entre squads", "demora na aprovação".'
  } as const;

  /** Dicas (?) e definições da ficha de capacidade (fora da seção AS-IS). */
  protected readonly capCardHints = {
    ctxSquad:
      'Squad ou célula à qual o caso real se refere. Pode coincidir com o time cadastrado no app ou detalhar subárea. Ex.: "Squad Pagamentos B2B".',
    ctxDimension:
      'Código da dimensão do framework (ex.: D1, D3) vinculado à pergunta. Delimita o constructo teórico em que a evidência será interpretada.',
    ctxStory:
      'Identificador rastreável do caso: épico, issue, ID de backlog ou descrição sucinta auditável. Ex.: "OPS-4412 — Conciliação manual de NF-e".',
    ctxQuestionCode:
      'Código canônico da pergunta (ex.: D2-C01-Q03). Ancora esta ficha ao diagnóstico; o enunciado completo é exibido abaixo.',
    flowSection:
      'Cada linha é um passo do AS-IS, coerente com a seção 2. Mantenha a ordem operacional. Use as colunas para deixar explícitos papel, duração e falha do passo.',
    flowDesc:
      'O que acontece neste passo: ação, decisão ou handoff. Redija de modo que um revisor externo reconstrua o fluxo sem ambiguidade.',
    flowResp:
      'Papel humano (cargo/squad), sistema ou fila responsável pela execução. Ex.: "Analista fiscal", "ServiceNow", "Fila N2".',
    flowTime:
      'Duração típica ou espera deste passo (mesma convenção da seção 2). Ex.: "15 min", "2 h de fila", "1 dia útil".',
    flowProblem:
      'Falha, atrito ou risco observado neste passo: retrabalho, erro manual, SLA perdido, dependência frágil. Ex.: "Reenvio de planilha em 30% dos casos".',
    tobeSection:
      'Fluxo alvo com IA. Para cada passo, descreva o comportamento futuro, o delta em relação ao AS-IS e o risco residual.',
    tobeDesc:
      'Passo no estado futuro: entrada da IA, supervisão humana, saída esperada e critérios de sucesso observáveis.',
    tobeChange:
      'Delta explícito versus AS-IS: o que deixa de ser manual, que SLAs mudam, que custo/qualidade se altera.',
    tobeRisk:
      'Risco do passo TO-BE: alucinação, privacidade, conformidade, lock-in de fornecedor, drift, necessidade de retreino.',
    aiStages:
      'Referência aos passos numerados do AS-IS/TO-BE ou subetapas atingidas. Ex.: "Passos 2–4" ou "após validação fiscal".',
    aiTypes:
      'Classificação do modo de uso: Geração, Análise, Automação, Sugestão. Selecione todas as modalidades que se aplicam à hipótese (toque ou clique para marcar/desmarcar).',
    aiInput:
      'Dados, permissões, contexto e formatos mínimos para operação segura. Ex.: "Pedido em JSON + política de frete v4 + sem PII de terceiros".',
    aiOutput:
      'Artefato ou decisão esperada, verificável. Ex.: "Rascunho de resposta + etiquetas de risco + justificativa em 3 bullets".',
    riskHallu:
      'Cenários de conteúdo incorreto ou inventado; severidade; detecção (amostragem, golden set, revisão por especialista).',
    riskSec:
      'Dados sensíveis, fluxo de dados, retenção, LGPD/GDPR, injeção de prompt, dependência de APIs de terceiros.',
    riskQual:
      'Risco a precisão, consistência com políticas internas, tom regulatório, fairness quando aplicável.',
    riskHuman:
      'Pontos de checagem obrigatórios, papéis aprovadores, SLAs de revisão, playbooks quando o modelo falha.',
    expBy:
      'Quem conduziu o experimento (nomes e papéis), para rastreabilidade e revisão metodológica. Evite campos genéricos sem identificação.',
    expIter:
      'Quantidade de ciclos relevantes: execuções, lotes, sprints ou sessões. Distingue piloto único de campanha repetida.',
    expCtx:
      'Se usou dados reais (anonimizados), réplica, sandbox ou simulação; limitações de fidelidade e viés de contexto.',
    expVar:
      'Variações de prompt, modelo, temperatura, ferramenta ou política; critério para escolher a variante reportada nas evidências.',
    evQTimeBefore:
      'Medida de tempo ou esforço pré-intervenção; use a mesma unidade que em "Tempo depois" (ex.: minutos por caso, horas-homem por lote).',
    evQTimeAfter:
      'Medida correspondente pós-intervenção, com protocolo de medição alinhado ao "antes" sempre que possível.',
    evQRed:
      'Ganho ou redução percentual; indique base (média, mediana) e tamanho amostral ou período.',
    evQRw:
      'Retrabalho, retrys ou reprovações antes/depois, em contagem ou taxa, se aplicável ao caso.',
    evQBugs:
      'Defeitos de software, regressões, incidentes de pipeline ou falhas de integração observadas no período.',
    evLConf:
      'Síntese da confiança percebida pelo time (entrevista curta, escala informal). Complementa métricas, não as substitui.',
    evLEase:
      'Atrito de uso, curva de aprendizado, necessidade de suporte ou documentação adicional.',
    evLClar:
      'Se o output foi compreensível, acionável e aderente ao especificado na hipótese (seção 4).',
    impactDefinitionShort:
      'Magnitude e relevância do efeito sobre processo ou resultado de negócio, dado o objetivo da hipótese e as evidências das seções 7–8.',
    reliabilityDefinitionShort:
      'Estabilidade do efeito e do comportamento do sistema entre execuções e condições declaradas; qualidade metodológica da evidência e reprodutibilidade.',
    impactGuidance:
      'Discrimine impacto (quanto mudou e para quem) de confiabilidade (com que solidez metodológica essa mudança é defensável). Escalas altas exigem justificativa explícita nos campos de texto.',
    impactLevel:
      'Rubrica — Baixo: efeito marginal ou muito localizado; pequenos ganhos em tempo/custo/qualidade; generalização limitada ao recorte testado. Médio: efeito claro em parte relevante do fluxo ou métrica; evidência convergente com limitações de amostra, duração ou contexto. Alto: efeito substancial em resultado operacional ou de negócio, plausivelmente atribuível à intervenção; evidência forte com limitações explicitadas.',
    reliabilityLevel:
      'Rubrica — Baixa: alta variância entre tentativas; condições frágeis; dados esparsos ou fortemente dependentes de ajuste manual. Média: desempenho estável nas condições testadas; validação humana e mitigações documentadas; falhas residuais conhecidas. Alta: reprodutibilidade entre sessões ou equipes análogas; monitoração ou critérios de aceite; limites de uso explícitos.',
    impactRationaleField:
      'Cite evidências (seções 7–8), baseline/comparador, pressupostos, ameaças à validade interna e externa e por que o nível escolhido é o mais conservador defensável.',
    reliabilityRationaleField:
      'Explique variância observada, reprodutibilidade, controles (revisão humana, A/B, monitoração) e aderência entre protocolo de teste e uso pretendido.',
    matBefore:
      'Nível de maturidade em IA (N0–N4) antes da intervenção, coerente com o assessment vinculado a esta ficha.',
    matAfter:
      'Nível após a intervenção. Eleve apenas se as evidências documentadas sustentarem a mudança de forma auditável.',
    matJustify:
      'Ligação explícita entre artefatos do experimento, métricas e decisões registradas nas seções anteriores.',
    recVerdict:
      'Adotar: caminho para produção com governo. Testar mais: sinal positivo, porém lacunas metodológicas ou de risco. Descartar: benefício insuficiente frente a custo/risco ou evidência negativa consistente.',
    recAdj:
      'Pré-requisitos para escala: dados, mudança de processo, engenharia, treinamento, políticas ou orçamento.',
    recDeps:
      'APIs, fornecedores, jurídico, segurança, infraestrutura, licenças ou squads externas necessárias ao próximo passo.'
  } as const;

  protected readonly tabIndex = computed(() => this.viewToIndex(this.activeView()));
  protected readonly teamCrudMode = signal<'list' | 'form'>('list');
  protected readonly toolCrudMode = signal<'list' | 'form'>('list');
  protected readonly assessmentViewMode = signal<'list' | 'form'>('list');
  protected readonly assessmentFormStep = signal<'metadata' | 'questions'>('metadata');
  protected readonly resultViewMode = signal<'list' | 'detail'>('list');
  protected readonly selectedResultAssessmentId = signal<string | null>(null);
  protected readonly resultsSort = signal<{
    active: 'finalizedAt' | 'level' | 'score';
    direction: 'asc' | 'desc';
  }>({
    active: 'finalizedAt',
    direction: 'desc'
  });
  protected readonly teamPageIndex = signal(0);
  protected readonly teamPageSize = signal(5);
  protected readonly toolPageIndex = signal(0);
  protected readonly toolPageSize = signal(20);

  protected readonly selectedTeam = computed(
    () =>
      this.teams().find((team) => team.id === this.selectedTeamId()) ?? null
  );
  protected readonly draftTeam = computed(
    () => this.teams().find((team) => team.id === this.draft().teamId) ?? null
  );
  protected readonly teamPageCount = computed(() => {
    const n = this.teams().length;
    if (n === 0) return 1;
    return Math.ceil(n / this.teamPageSize());
  });
  protected readonly toolPageCount = computed(() => {
    const n = this.tools().length;
    if (n === 0) return 1;
    return Math.ceil(n / this.toolPageSize());
  });
  protected readonly assessmentsForSelectedTeam = computed(() => {
    const teamId = this.selectedTeamId();
    return teamId ? this.repository.getAssessmentsForTeam(teamId) : [];
  });
  protected readonly assessmentViewModels = computed<AssessmentViewModel[]>(() => {
    const catalog = this.catalog();
    return this.repository
      .assessments()
      .map((assessment) => ({
        assessment,
        result: this.scoringService.calculateResult(catalog, assessment)
      }))
      .sort((left, right) =>
        right.assessment.updatedAt.localeCompare(left.assessment.updatedAt)
      );
  });
  protected readonly selectedTeamAssessmentViewModels = computed(() =>
    this.assessmentViewModels().filter(
      ({ assessment }) => assessment.teamId === this.selectedTeamId()
    )
  );
  protected readonly latestFinalizedAssessment = computed(() => {
    return (
      this.assessmentViewModels().find(
        ({ assessment }) =>
          assessment.teamId === this.selectedTeamId() &&
          assessment.status === 'finalized'
      ) ?? null
    );
  });
  protected readonly liveResult = computed<AssessmentResult | null>(() => {
    const team = this.selectedTeam();
    if (!team || !this.allQuestionsAnswered()) {
      return null;
    }

    const now = new Date().toISOString();

    return this.scoringService.calculateResult(
      this.catalog(),
      {
        ...this.buildAssessmentPayload(team.id, 'draft'),
        id: this.draft().id ?? 'preview',
        createdAt: now,
        updatedAt: now
      }
    );
  });
  protected readonly comparisonRows = computed(() =>
    this.teams()
      .map((team) => {
        const latestAssessment = this.assessmentViewModels().find(
          ({ assessment }) =>
            assessment.teamId === team.id && assessment.status === 'finalized'
        );

        return latestAssessment
          ? {
              team,
              result: latestAssessment.result,
              assessment: latestAssessment.assessment
            }
          : null;
      })
      .filter((row): row is NonNullable<typeof row> => row !== null)
  );
  protected readonly finalizedAssessments = computed(() =>
    this.assessmentViewModels().filter(
      ({ assessment }) => assessment.status === 'finalized'
    )
  );
  protected readonly sortedFinalizedAssessments = computed(() => {
    const items = [...this.finalizedAssessments()];
    const sort = this.resultsSort();
    const direction = sort.direction === 'asc' ? 1 : -1;

    return items.sort((left, right) => {
      if (sort.active === 'score') {
        return (left.result.overallScore - right.result.overallScore) * direction;
      }

      if (sort.active === 'level') {
        const leftLevel = Number(left.result.level.level.replace('N', ''));
        const rightLevel = Number(right.result.level.level.replace('N', ''));
        return (leftLevel - rightLevel) * direction;
      }

      const leftDate = left.assessment.finalizedAt ?? left.assessment.updatedAt;
      const rightDate = right.assessment.finalizedAt ?? right.assessment.updatedAt;
      return leftDate.localeCompare(rightDate) * direction;
    });
  });
  protected readonly currentResultDetail = computed(() => {
    const assessmentId = this.selectedResultAssessmentId();
    return this.finalizedAssessments().find(
      ({ assessment }) => assessment.id === assessmentId
    ) ?? null;
  });
  protected readonly resultDetailSearch = signal('');
  protected readonly resultDetailDimensionFilter = signal<string>('');
  protected readonly resultDetailQuestionRows = computed(() => {
    const detail = this.currentResultDetail();
    const catalog = this.catalog();
    const search = this.resultDetailSearch().trim().toLowerCase();
    const dimensionCode = this.resultDetailDimensionFilter();
    if (!detail) return [];
    const rows: Array<{
      question: FrameworkQuestion;
      response: AssessmentAnswer | undefined;
      dimensionCode: string;
      dimensionTitle: string;
    }> = [];
    for (const dimension of catalog.dimensions) {
      if (dimensionCode && dimension.code !== dimensionCode) continue;
      for (const capacity of dimension.capacities) {
        for (const question of capacity.questions) {
          const response = detail.assessment.responses[question.code];
          const inPractice = response?.practiceDetails?.toLowerCase().includes(search) ?? false;
          if (
            search &&
            !question.code.toLowerCase().includes(search) &&
            !question.prompt.toLowerCase().includes(search) &&
            !inPractice
          ) {
            continue;
          }
          rows.push({
            question,
            response,
            dimensionCode: dimension.code,
            dimensionTitle: dimension.title
          });
        }
      }
    }
    return rows;
  });
  protected readonly questionRowsSort = signal<{
    active: 'dimension' | 'code' | 'prompt' | 'score';
    direction: 'asc' | 'desc';
  }>({ active: 'code', direction: 'asc' });
  protected readonly capabilityCardViewMode = signal<'list' | 'form'>('list');
  protected readonly capabilityCardDraft = signal<CapabilityCard | null>(null);
  protected readonly capabilityCardFilterTeamId = signal<string>('');
  /** Novo: assessment (finalizado) e pergunta escolhidos antes de abrir o formulário. */
  protected readonly capNewAssessmentId = signal<string>('');
  protected readonly capNewQuestionCode = signal<string>('');
  protected readonly sortedResultDetailQuestionRows = computed(() => {
    const rows = [...this.resultDetailQuestionRows()];
    const sort = this.questionRowsSort();
    const dir = sort.direction === 'asc' ? 1 : -1;
    return rows.sort((a, b) => {
      if (sort.active === 'score') {
        const va = a.response?.score ?? -1;
        const vb = b.response?.score ?? -1;
        return (va - vb) * dir;
      }
      if (sort.active === 'dimension') {
        const cmp = a.dimensionCode.localeCompare(b.dimensionCode) || a.question.code.localeCompare(b.question.code);
        return cmp * dir;
      }
      if (sort.active === 'code') {
        const na = this.parseQuestionCodeNumber(a.question.code);
        const nb = this.parseQuestionCodeNumber(b.question.code);
        if (na !== null && nb !== null) return (na - nb) * dir;
        return a.question.code.localeCompare(b.question.code) * dir;
      }
      if (sort.active === 'prompt') {
        return a.question.prompt.localeCompare(b.question.prompt) * dir;
      }
      return 0;
    });
  });
  protected readonly unansweredCount = computed(() => {
    const catalog = this.catalog();
    return this.getAllQuestions(catalog).filter((question) => {
      return this.draft().responses[question.code]?.score === null;
    }).length;
  });
  protected readonly evidencePendingCount = computed(() => {
    const catalog = this.catalog();
    return this.getAllQuestions(catalog).filter((question) => {
      const response = this.draft().responses[question.code];
      return response && response.score !== null && response.score >= 3 && !(response.evidence?.trim());
    }).length;
  });
  /** Conta perguntas com nota e, quando nota >= 3, evidencia preenchida. */
  protected readonly fullyCompleteCount = computed(() => {
    const catalog = this.catalog();
    const responses = this.draft().responses;
    return this.getAllQuestions(catalog).filter((question) => {
      const response = responses[question.code];
      if (!response || response.score == null) return false;
      if (response.score >= 3) return Boolean(response.evidence?.trim());
      return true;
    }).length;
  });
  protected readonly completionPercent = computed(() => {
    const total = this.getAllQuestions(this.catalog()).length;
    if (total === 0) return 0;
    return Math.round((this.fullyCompleteCount() / total) * 100);
  });
  protected readonly pagedTeams = computed(() => {
    const start = this.teamPageIndex() * this.teamPageSize();
    return this.teams().slice(start, start + this.teamPageSize());
  });
  protected readonly pagedTools = computed(() => {
    const start = this.toolPageIndex() * this.toolPageSize();
    return this.tools().slice(start, start + this.toolPageSize());
  });
  protected readonly isEditingAssessment = computed(() =>
    this.repository.assessments().some((assessment) => assessment.id === this.draft().id)
  );
  protected readonly toolStatusOptions: ToolStatus[] = ['approved', 'experimental', 'restricted'];
  protected readonly portfolioToolSummary = computed(() =>
    this.buildToolUsageSummary(this.finalizedAssessments().map(({ assessment }) => assessment))
  );
  protected readonly finalizedAssessmentOptions = computed(() =>
    this.assessmentViewModels().filter(({ assessment }) => assessment.status === 'finalized')
  );
  protected readonly capabilityCardsList = computed(() => {
    const teamFilter = this.capabilityCardFilterTeamId();
    return this.repository
      .capabilityCards()
      .filter((c) => !teamFilter || c.teamId === teamFilter)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  });
  protected readonly capabilityCardAiUsageOptions: Array<{
    value: CapabilityCardAiUsageType;
    label: string;
  }> = [
    { value: 'geracao', label: 'Geração' },
    { value: 'analise', label: 'Análise' },
    { value: 'automacao', label: 'Automação' },
    { value: 'sugestao', label: 'Sugestão' }
  ];
  protected readonly portfolioToolSummaryByDimension = computed(() =>
    this.catalog().dimensions
      .map((dimension) => ({
        dimension,
        tools: this.buildToolUsageSummary(
          this.finalizedAssessments().map(({ assessment }) => assessment),
          new Set(
            dimension.capacities.flatMap((capacity) =>
              capacity.questions.map((question) => question.code)
            )
          )
        )
      }))
      .filter(({ tools }) => tools.length > 0)
  );
  protected readonly currentResultToolSummary = computed(() => {
    const item = this.currentResultDetail();
    return item ? this.buildToolUsageSummary([item.assessment]) : [];
  });

  constructor() {
    const firstTeamId = this.teams()[0]?.id ?? null;
    if (!this.selectedTeamId() && firstTeamId) {
      this.repository.selectTeam(firstTeamId);
    }

    this.resetDraftFromSelection();
  }

  protected setActiveView(
    view: 'teams' | 'tools' | 'assessment' | 'results' | 'capability-cards'
  ): void {
    this.activeView.set(view);
  }

  protected selectTab(index: number): void {
    const view = this.indexToView(index);
    this.activeView.set(view);

    if (view === 'tools') {
      this.toolCrudMode.set('list');
    }

    if (view === 'assessment') {
      this.assessmentViewMode.set('list');
    }

    if (view === 'results') {
      this.resultViewMode.set('list');
      this.selectedResultAssessmentId.set(null);
    }

    if (view === 'capability-cards') {
      this.capabilityCardViewMode.set('list');
      this.capabilityCardDraft.set(null);
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscapeCloseHelp(): void {
    if (this.levelsHelpOpen()) {
      this.closeLevelsHelp();
    }
  }

  protected closeLevelsHelp(): void {
    this.levelsHelpOpen.set(false);
  }

  protected onLevelsHelpBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeLevelsHelp();
    }
  }

  protected isDimensionExpanded(code: string): boolean {
    return this.expandedDimensionCodes().has(code);
  }

  protected toggleDimensionPanel(code: string): void {
    this.expandedDimensionCodes.update((set) => {
      const next = new Set(set);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  }

  protected isCapabilitySectionExpanded(id: string): boolean {
    return this.expandedCapabilitySections().has(id);
  }

  protected toggleCapabilitySection(id: string): void {
    this.expandedCapabilitySections.update((set) => {
      const next = new Set(set);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  private resetCapabilityAccordion(): void {
    this.expandedCapabilitySections.set(new Set(['cap-ctx', 'cap-asis', 'cap-flow']));
  }

  protected startNewTeam(): void {
    this.teamCrudMode.set('form');
    this.editingTeamId.set(null);
    this.teamForm.set({ name: '', sector: '', description: '' });
  }

  protected updateTeamField<K extends keyof TeamFormState>(field: K, value: TeamFormState[K]): void {
    this.teamForm.update((state) => ({ ...state, [field]: value }));
  }

  protected startNewTool(): void {
    this.toolCrudMode.set('form');
    this.editingToolId.set(null);
    this.toolForm.set({
      name: '',
      vendor: '',
      category: '',
      status: 'experimental',
      description: ''
    });
  }

  protected editTool(tool: Tool): void {
    this.toolCrudMode.set('form');
    this.editingToolId.set(tool.id);
    this.toolForm.set({
      name: tool.name,
      vendor: tool.vendor,
      category: tool.category,
      status: tool.status,
      description: tool.description
    });
    this.activeView.set('tools');
  }

  protected updateToolField<K extends keyof ToolFormState>(field: K, value: ToolFormState[K]): void {
    this.toolForm.update((state) => ({ ...state, [field]: value }));
  }

  protected saveTool(): void {
    const form = this.toolForm();
    if (!form.name.trim()) {
      this.announce('Informe pelo menos o nome da ferramenta.');
      return;
    }

    this.repository.upsertTool(
      {
        name: form.name.trim(),
        vendor: form.vendor.trim(),
        category: form.category.trim(),
        status: form.status,
        description: form.description.trim()
      },
      this.editingToolId() ?? undefined
    );

    this.editingToolId.set(null);
    this.toolCrudMode.set('list');
    this.toolForm.set({
      name: '',
      vendor: '',
      category: '',
      status: 'experimental',
      description: ''
    });
    this.announce('Ferramenta salva com sucesso.');
  }

  protected cancelToolForm(): void {
    this.toolCrudMode.set('list');
    this.editingToolId.set(null);
    this.toolForm.set({
      name: '',
      vendor: '',
      category: '',
      status: 'experimental',
      description: ''
    });
  }

  protected deleteTool(toolId: string): void {
    this.repository.deleteTool(toolId);
    this.draft.update((draft) => ({
      ...draft,
      responses: Object.fromEntries(
        Object.entries(draft.responses).map(([questionCode, response]) => [
          questionCode,
          {
            ...response,
            toolIds: response.toolIds.filter((currentToolId) => currentToolId !== toolId)
          }
        ])
      )
    }));
    this.announce('Ferramenta removida.');
  }

  protected updateDraftField(field: 'assessor' | 'summary', value: string): void {
    this.draft.update((state) => ({ ...state, [field]: value }));
  }

  protected selectAssessmentTeam(teamId: string): void {
    this.repository.selectTeam(teamId);
    this.draft.update((state) => ({ ...state, teamId }));
  }

  protected editTeam(team: Team): void {
    this.teamCrudMode.set('form');
    this.editingTeamId.set(team.id);
    this.teamForm.set({
      name: team.name,
      sector: team.sector,
      description: team.description
    });
    this.activeView.set('teams');
  }

  protected saveTeam(): void {
    const form = this.teamForm();
    if (!form.name.trim()) {
      this.announce('Informe pelo menos o nome do time.');
      return;
    }

    const team = this.repository.upsertTeam(
      {
        name: form.name.trim(),
        sector: form.sector.trim(),
        description: form.description.trim()
      },
      this.editingTeamId() ?? undefined
    );

    this.repository.selectTeam(team.id);
    this.editingTeamId.set(null);
    this.teamCrudMode.set('list');
    this.teamForm.set({ name: '', sector: '', description: '' });
    this.resetDraftFromSelection();
    this.announce('Time salvo com sucesso.');
  }

  protected deleteTeam(teamId: string): void {
    this.repository.deleteTeam(teamId);
    this.resetDraftFromSelection();
    this.announce('Time removido.');
  }

  protected selectTeam(teamId: string): void {
    this.repository.selectTeam(teamId);
    this.resetDraftFromSelection();
    this.announce('Time selecionado.');
  }

  protected createFreshDraft(): void {
    this.assessmentViewMode.set('form');
    this.assessmentFormStep.set('metadata');
    this.draft.set(this.createEmptyDraft());
    this.activeView.set('assessment');
  }

  protected createAssessmentForTeam(teamId: string): void {
    this.repository.selectTeam(teamId);
    this.createFreshDraft();
  }

  protected openNewAssessmentForm(): void {
    const teamId = this.selectedTeamId() ?? this.teams()[0]?.id ?? null;
    if (teamId) {
      this.repository.selectTeam(teamId);
    }

    this.assessmentViewMode.set('form');
    this.assessmentFormStep.set('metadata');
    this.draft.set({
      ...this.createEmptyDraft(),
      teamId
    });
  }

  protected cancelAssessmentForm(): void {
    this.assessmentViewMode.set('list');
    this.assessmentFormStep.set('metadata');
    this.draft.set(this.createEmptyDraft());
  }

  protected continueToQuestions(): void {
    if (!this.draft().teamId) {
      this.announce('Selecione um time para continuar.');
      return;
    }

    this.assessmentFormStep.set('questions');
  }

  protected backToAssessmentMetadata(): void {
    this.assessmentFormStep.set('metadata');
  }

  protected cancelTeamForm(): void {
    this.teamCrudMode.set('list');
    this.editingTeamId.set(null);
    this.teamForm.set({ name: '', sector: '', description: '' });
  }

  protected onTeamPageChange(event: PaginatorEvent): void {
    this.teamPageIndex.set(event.pageIndex);
    this.teamPageSize.set(event.pageSize);
  }

  protected teamPageGoPrev(): void {
    this.teamPageIndex.update((i) => Math.max(0, i - 1));
  }

  protected teamPageGoNext(): void {
    const max = Math.max(0, this.teamPageCount() - 1);
    this.teamPageIndex.update((i) => Math.min(max, i + 1));
  }

  protected setTeamPageSize(size: number): void {
    this.teamPageSize.set(size);
    this.teamPageIndex.set(0);
  }

  protected onToolPageChange(event: PaginatorEvent): void {
    this.toolPageIndex.set(event.pageIndex);
    this.toolPageSize.set(event.pageSize);
  }

  protected toolPageGoPrev(): void {
    this.toolPageIndex.update((i) => Math.max(0, i - 1));
  }

  protected toolPageGoNext(): void {
    const max = Math.max(0, this.toolPageCount() - 1);
    this.toolPageIndex.update((i) => Math.min(max, i + 1));
  }

  protected setToolPageSize(size: number): void {
    this.toolPageSize.set(size);
    this.toolPageIndex.set(0);
  }

  protected getAssessmentCountForTeam(teamId: string): number {
    return this.repository.getAssessmentsForTeam(teamId).length;
  }

  protected getDimensionCompletion(dimension: FrameworkDimension): {
    answered: number;
    total: number;
    percent: number;
    evidencePending: number;
  } {
    const questions = dimension.capacities.flatMap((c) => c.questions);
    const total = questions.length;
    const responses = this.draft().responses;
    let answered = 0;
    let evidencePending = 0;
    for (const q of questions) {
      const response = responses[q.code];
      if (!response || response.score == null) continue;
      if (response.score >= 3) {
        if (response.evidence?.trim()) answered += 1;
        else evidencePending += 1;
      } else {
        answered += 1;
      }
    }
    const percent = total ? Math.round((answered / total) * 100) : 0;
    return { answered, total, percent, evidencePending };
  }

  protected toggleAllDimensions(): void {
    const codes = this.catalog().dimensions.map((d) => d.code);
    const current = this.expandedDimensionCodes();
    const allExpanded =
      codes.length > 0 && codes.every((c) => current.has(c));
    if (allExpanded) {
      this.expandedDimensionCodes.set(new Set());
    } else {
      this.expandedDimensionCodes.set(new Set(codes));
    }
  }

  protected get allDimensionsExpanded(): boolean {
    const codes = this.catalog().dimensions.map((d) => d.code);
    const current = this.expandedDimensionCodes();
    return codes.length > 0 && codes.every((c) => current.has(c));
  }

  protected getCompletionBadgeStyle(percent: number): Record<string, string> {
    const hue = (percent / 100) * 120;
    return {
      background: `hsl(${hue}, 75%, 92%)`,
      color: `hsl(${hue}, 55%, 25%)`
    };
  }

  protected getScoreOptionsForQuestion(question: FrameworkQuestion): Array<{
    value: number;
    label: string;
    hint: string;
  }> {
    const scale = this.catalog().manifest.scale;
    const profileKey = question.scoreProfile ?? scale.defaultProfile ?? 'default';
    const profile = scale.profiles?.[profileKey];
    const labels = profile?.labels ?? scale.labels;
    const hints = profile?.hints ?? scale.hints;

    return Object.entries(labels)
      .map(([value, label]) => ({
        value: Number(value),
        label,
        hint: hints[value] ?? ''
      }))
      .sort((left, right) => left.value - right.value);
  }

  protected getToolUsageCount(toolId: string): number {
    return this.repository
      .assessments()
      .reduce((total, assessment) => {
        const assessmentCount = Object.values(assessment.responses).reduce(
          (questionTotal, response) =>
            questionTotal + (response.toolIds.includes(toolId) ? 1 : 0),
          0
        );

        return total + assessmentCount;
      }, 0);
  }

  protected getTeamName(teamId: string): string {
    return this.teams().find((team) => team.id === teamId)?.name ?? 'Time removido';
  }

  protected getToolName(toolId: string): string {
    return this.tools().find((tool) => tool.id === toolId)?.name ?? 'Ferramenta removida';
  }

  protected getQuestionPrompt(questionCode: string): string {
    const catalog = this.catalog();
    for (const dimension of catalog.dimensions) {
      for (const capacity of dimension.capacities) {
        const question = capacity.questions.find((q) => q.code === questionCode);
        if (question) return question.prompt;
      }
    }
    return questionCode;
  }

  protected getToolOptionLabel(tool: Tool): string {
    return tool.vendor ? `${tool.name} - ${tool.vendor}` : tool.name;
  }

  protected deleteAssessment(assessmentId: string): void {
    this.repository.deleteAssessment(assessmentId);

    if (this.draft().id === assessmentId) {
      this.draft.set(this.createEmptyDraft());
      this.assessmentViewMode.set('list');
    }

    if (this.selectedResultAssessmentId() === assessmentId) {
      this.backToResultsList();
    }

    this.announce('Assessment removido.');
  }

  protected updateScore(questionCode: string, score: number | null): void {
    this.draft.update((draft) => ({
      ...draft,
      responses: {
        ...draft.responses,
        [questionCode]: {
          ...draft.responses[questionCode],
          score
        }
      }
    }));
    this.persistDraftIfReady();
  }

  protected updateEvidence(questionCode: string, evidence: string): void {
    this.draft.update((draft) => ({
      ...draft,
      responses: {
        ...draft.responses,
        [questionCode]: {
          ...draft.responses[questionCode],
          evidence
        }
      }
    }));
  }

  protected updatePracticeDetails(questionCode: string, practiceDetails: string): void {
    this.draft.update((draft) => ({
      ...draft,
      responses: {
        ...draft.responses,
        [questionCode]: {
          ...draft.responses[questionCode],
          practiceDetails
        }
      }
    }));
    this.persistDraftIfReady();
  }

  protected updateQuestionTools(questionCode: string, toolIds: string[]): void {
    this.draft.update((draft) => ({
      ...draft,
      responses: {
        ...draft.responses,
        [questionCode]: {
          ...draft.responses[questionCode],
          toolIds: Array.from(new Set(toolIds))
        }
      }
    }));
  }

  protected saveDraft(): void {
    const team = this.draftTeam();
    if (!team) {
      this.announce('Crie ou selecione um time antes de salvar.');
      return;
    }

    const assessment = this.repository.saveAssessment(this.buildAssessmentPayload(team.id, 'draft'));
    this.draft.update((draft) => ({ ...draft, id: assessment.id }));
    this.announce('Rascunho salvo em localStorage.');
  }

  private persistDraftIfReady(): void {
    const team = this.draftTeam();
    if (!team) return;

    const assessment = this.repository.saveAssessment(this.buildAssessmentPayload(team.id, 'draft'));
    this.draft.update((draft) => ({ ...draft, id: assessment.id }));
  }

  protected finalizeAssessment(): void {
    const team = this.draftTeam();
    if (!team) {
      this.announce('Crie ou selecione um time antes de finalizar.');
      return;
    }

    if (!this.canFinalize()) {
      this.announce(
        'Finalize apenas quando todas as respostas estiverem preenchidas e toda nota 3 ou 4 tiver evidencia.'
      );
      return;
    }

    const assessment = this.repository.saveAssessment(
      this.buildAssessmentPayload(team.id, 'finalized')
    );
    this.draft.update((draft) => ({ ...draft, id: assessment.id }));
    this.selectedResultAssessmentId.set(assessment.id);
    this.resultViewMode.set('detail');
    this.activeView.set('results');
    this.announce('Assessment finalizado.');
  }

  protected loadAssessment(assessment: Assessment): void {
    this.repository.selectTeam(assessment.teamId);
    this.assessmentViewMode.set('form');
    this.assessmentFormStep.set('questions');
    this.draft.set({
      id: assessment.id,
      assessor: assessment.assessor,
      summary: assessment.summary,
      teamId: assessment.teamId,
      responses: this.cloneResponses(assessment.responses)
    });
    this.activeView.set('assessment');
    this.announce('Assessment carregado para revisao.');
  }

  protected openResultDetail(assessmentId: string): void {
    this.selectedResultAssessmentId.set(assessmentId);
    this.resultViewMode.set('detail');
    this.activeView.set('results');
  }

  protected toggleResultsSort(column: 'finalizedAt' | 'level' | 'score'): void {
    this.resultsSort.update((cur) => {
      if (cur.active === column) {
        return {
          active: column,
          direction: cur.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return {
        active: column,
        direction: column === 'finalizedAt' ? 'desc' : 'asc'
      };
    });
  }

  protected resultsSortArrow(column: 'finalizedAt' | 'level' | 'score'): string {
    const s = this.resultsSort();
    if (s.active !== column) {
      return '';
    }
    return s.direction === 'asc' ? '↑' : '↓';
  }

  protected toggleQuestionRowsSort(column: 'dimension' | 'code' | 'prompt' | 'score'): void {
    this.questionRowsSort.update((cur) => {
      if (cur.active === column) {
        return {
          active: column,
          direction: cur.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return {
        active: column,
        direction: 'asc'
      };
    });
  }

  protected questionRowsSortArrow(column: 'dimension' | 'code' | 'prompt' | 'score'): string {
    const s = this.questionRowsSort();
    if (s.active !== column) {
      return '';
    }
    return s.direction === 'asc' ? '↑' : '↓';
  }

  private parseQuestionCodeNumber(code: string): number | null {
    const match = code.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  }

  protected backToAssessmentList(): void {
    this.assessmentViewMode.set('list');
  }

  protected backToResultsList(): void {
    this.resultViewMode.set('list');
    this.selectedResultAssessmentId.set(null);
    this.resultDetailSearch.set('');
    this.resultDetailDimensionFilter.set('');
    this.questionRowsSort.set({ active: 'code', direction: 'asc' });
  }

  protected getScoreLabel(question: FrameworkQuestion, score: number | null): string {
    if (score === null) return '—';
    const options = this.getScoreOptionsForQuestion(question);
    const opt = options.find((o) => o.value === score);
    return opt ? `${opt.value} - ${opt.label}` : String(score);
  }

  protected openLevelsHelp(): void {
    this.levelsHelpOpen.set(true);
  }

  protected getLevelColor(level: string): string {
    const colors: Record<string, string> = {
      N1: '#ef5350',
      N2: '#ff9800',
      N3: '#42a5f5',
      N4: '#66bb6a',
      N5: '#26a69a'
    };
    return colors[level] ?? '#9e9e9e';
  }

  // ── Fichas de capacidade (diagnóstico → experimento → evidência) ──

  protected setCapabilityCardFilterTeamId(teamId: string): void {
    this.capabilityCardFilterTeamId.set(teamId);
  }

  protected setCapNewAssessmentId(id: string): void {
    this.capNewAssessmentId.set(id ?? '');
  }

  protected setCapNewQuestionCode(code: string): void {
    this.capNewQuestionCode.set(code ?? '');
  }

  protected getAllQuestionsFlat(): FrameworkQuestion[] {
    return this.getAllQuestions(this.catalog());
  }

  protected startCapabilityCardCreate(): void {
    const assessmentId = this.capNewAssessmentId().trim();
    const questionCode = this.capNewQuestionCode().trim();
    if (!assessmentId || !questionCode) {
      this.announce('Selecione um assessment finalizado e uma pergunta (capacidade) para a ficha.');
      return;
    }

    const assessment = this.repository.assessments().find((a) => a.id === assessmentId);
    if (!assessment || assessment.status !== 'finalized') {
      this.announce('Use apenas assessments finalizados como base do diagnóstico.');
      return;
    }

    const team = this.teams().find((t) => t.id === assessment.teamId);
    const dimensionCode = this.findDimensionCodeForQuestion(questionCode);
    const card = this.repository.createCapabilityCardSkeleton({
      assessmentId,
      teamId: assessment.teamId,
      squad: team?.name ?? '',
      dimensionCode,
      questionCode
    });
    this.capabilityCardDraft.set(card);
    this.capabilityCardViewMode.set('form');
    this.resetCapabilityAccordion();
  }

  protected editCapabilityCard(card: CapabilityCard): void {
    this.capabilityCardDraft.set({
      ...card,
      impactRationale: card.impactRationale ?? '',
      reliabilityRationale: card.reliabilityRationale ?? '',
      flowMap: card.flowMap.map((r, i) => ({ ...r, step: i + 1 })),
      toBeFlow: card.toBeFlow.map((r, i) => ({ ...r, step: i + 1 })),
      aiHypothesis: {
        ...card.aiHypothesis,
        usageTypes: [...card.aiHypothesis.usageTypes]
      }
    });
    this.capabilityCardViewMode.set('form');
    this.resetCapabilityAccordion();
  }

  protected cancelCapabilityCardForm(): void {
    this.capabilityCardDraft.set(null);
    this.capabilityCardViewMode.set('list');
  }

  protected saveCapabilityCardDraft(): void {
    const draft = this.capabilityCardDraft();
    if (!draft) {
      return;
    }

    const stepErr = validateAsIsStepCount(draft.asIs.stepCount);
    const timeErr = validateAsIsAvgTime(draft.asIs.avgTime);
    if (stepErr || timeErr) {
      this.expandedCapabilitySections.update((set) => {
        const next = new Set(set);
        next.add('cap-asis');
        return next;
      });
      const parts = [stepErr, timeErr].filter(Boolean) as string[];
      this.announce(`Corrija a seção Estado atual (AS-IS): ${parts.join(' ')}`);
      return;
    }

    const saved = this.repository.saveCapabilityCard(draft);
    this.capabilityCardDraft.set(null);
    this.capabilityCardViewMode.set('list');
    this.capNewAssessmentId.set('');
    this.capNewQuestionCode.set('');
    this.announce(`Ficha ${saved.context.questionCode} salva.`);
  }

  protected deleteCapabilityCardRow(cardId: string): void {
    this.repository.deleteCapabilityCard(cardId);
    if (this.capabilityCardDraft()?.id === cardId) {
      this.cancelCapabilityCardForm();
    }
    this.announce('Ficha removida.');
  }

  protected exportCurrentCapabilityCardMarkdown(): void {
    const draft = this.capabilityCardDraft();
    if (!draft) {
      return;
    }

    const prompt = this.getQuestionPrompt(draft.context.questionCode);
    const md = this.exportService.buildCapabilityCardMarkdown(draft, prompt, this.tools());
    const safe = draft.context.questionCode.replace(/[^a-zA-Z0-9_-]+/g, '_');
    this.exportService.downloadFile(`ficha-capacidade-${safe}.md`, md, 'text/markdown;charset=utf-8');
    this.announce('Markdown da ficha baixado.');
  }

  protected patchCapabilityCard(mapper: (card: CapabilityCard) => CapabilityCard): void {
    this.capabilityCardDraft.update((d) => (d ? mapper(d) : d));
  }

  protected updateCardContext<K extends keyof CapabilityCard['context']>(
    key: K,
    value: CapabilityCard['context'][K]
  ): void {
    this.patchCapabilityCard((c) => ({
      ...c,
      context: { ...c.context, [key]: value }
    }));
  }

  protected updateCardAsIs<K extends keyof CapabilityCard['asIs']>(
    key: K,
    value: CapabilityCard['asIs'][K]
  ): void {
    this.patchCapabilityCard((c) => ({
      ...c,
      asIs: { ...c.asIs, [key]: value }
    }));
  }

  protected getAsIsStepCountError(): string | null {
    const card = this.capabilityCardDraft();
    return card ? validateAsIsStepCount(card.asIs.stepCount) : null;
  }

  protected getAsIsAvgTimeError(): string | null {
    const card = this.capabilityCardDraft();
    return card ? validateAsIsAvgTime(card.asIs.avgTime) : null;
  }

  protected updateAiHypothesis<K extends keyof CapabilityCard['aiHypothesis']>(
    key: K,
    value: CapabilityCard['aiHypothesis'][K]
  ): void {
    this.patchCapabilityCard((c) => ({
      ...c,
      aiHypothesis: { ...c.aiHypothesis, [key]: value }
    }));
  }

  protected toggleAsIsToolId(toolId: string, selected: boolean): void {
    this.patchCapabilityCard((c) => {
      const next = new Set(c.asIs.toolIds);
      if (selected) {
        next.add(toolId);
      } else {
        next.delete(toolId);
      }
      return { ...c, asIs: { ...c.asIs, toolIds: [...next] } };
    });
  }

  protected toggleAiUsageType(usage: CapabilityCardAiUsageType): void {
    this.patchCapabilityCard((c) => {
      const usageTypes = [...c.aiHypothesis.usageTypes];
      const idx = usageTypes.indexOf(usage);
      if (idx >= 0) {
        usageTypes.splice(idx, 1);
      } else {
        usageTypes.push(usage);
      }
      return { ...c, aiHypothesis: { ...c.aiHypothesis, usageTypes } };
    });
  }

  protected updateRisks<K extends keyof CapabilityCard['risksControls']>(
    key: K,
    value: CapabilityCard['risksControls'][K]
  ): void {
    this.patchCapabilityCard((c) => ({
      ...c,
      risksControls: { ...c.risksControls, [key]: value }
    }));
  }

  protected updateExperiment<K extends keyof CapabilityCard['experiment']>(
    key: K,
    value: CapabilityCard['experiment'][K]
  ): void {
    this.patchCapabilityCard((c) => ({
      ...c,
      experiment: { ...c.experiment, [key]: value }
    }));
  }

  protected updateEvidenceQuant<K extends keyof CapabilityCard['evidenceQuantitative']>(
    key: K,
    value: CapabilityCard['evidenceQuantitative'][K]
  ): void {
    this.patchCapabilityCard((c) => ({
      ...c,
      evidenceQuantitative: { ...c.evidenceQuantitative, [key]: value }
    }));
  }

  protected updateEvidenceQual<K extends keyof CapabilityCard['evidenceQualitative']>(
    key: K,
    value: CapabilityCard['evidenceQualitative'][K]
  ): void {
    this.patchCapabilityCard((c) => ({
      ...c,
      evidenceQualitative: { ...c.evidenceQualitative, [key]: value }
    }));
  }

  protected updateMaturity<K extends keyof CapabilityCard['maturityUpdate']>(
    key: K,
    value: CapabilityCard['maturityUpdate'][K]
  ): void {
    this.patchCapabilityCard((c) => ({
      ...c,
      maturityUpdate: { ...c.maturityUpdate, [key]: value }
    }));
  }

  protected updateRecommendation<K extends keyof CapabilityCard['recommendation']>(
    key: K,
    value: CapabilityCard['recommendation'][K]
  ): void {
    this.patchCapabilityCard((c) => ({
      ...c,
      recommendation: { ...c.recommendation, [key]: value }
    }));
  }

  protected setImpactLevel(value: CapabilityCard['impact']): void {
    this.patchCapabilityCard((c) => ({ ...c, impact: value }));
  }

  protected setReliabilityLevel(value: CapabilityCard['reliability']): void {
    this.patchCapabilityCard((c) => ({ ...c, reliability: value }));
  }

  protected updateImpactRationale(value: string): void {
    this.patchCapabilityCard((c) => ({ ...c, impactRationale: value }));
  }

  protected updateReliabilityRationale(value: string): void {
    this.patchCapabilityCard((c) => ({ ...c, reliabilityRationale: value }));
  }

  protected setImpactLevelFromSelect(value: string): void {
    this.setImpactLevel(
      value === '' ? null : (value as NonNullable<CapabilityCard['impact']>)
    );
  }

  protected setReliabilityLevelFromSelect(value: string): void {
    this.setReliabilityLevel(
      value === '' ? null : (value as NonNullable<CapabilityCard['reliability']>)
    );
  }

  protected setVerdictFromSelect(value: string): void {
    this.updateRecommendation(
      'verdict',
      value === '' ? null : (value as NonNullable<CapabilityCard['recommendation']['verdict']>)
    );
  }

  protected updateFlowMapRow(index: number, patch: Partial<CapabilityFlowMapRow>): void {
    this.patchCapabilityCard((c) => {
      const flowMap = c.flowMap.map((row, i) =>
        i === index ? { ...row, ...patch, step: i + 1 } : { ...row, step: i + 1 }
      );
      return { ...c, flowMap };
    });
  }

  protected addFlowMapRow(): void {
    this.patchCapabilityCard((c) => {
      const step = c.flowMap.length + 1;
      return {
        ...c,
        flowMap: [
          ...c.flowMap,
          { step, description: '', responsible: '', duration: '', problem: '' }
        ]
      };
    });
  }

  protected removeFlowMapRow(index: number): void {
    this.patchCapabilityCard((c) => {
      const flowMap = c.flowMap.filter((_, i) => i !== index).map((row, i) => ({
        ...row,
        step: i + 1
      }));
      return {
        ...c,
        flowMap:
          flowMap.length > 0
            ? flowMap
            : [{ step: 1, description: '', responsible: '', duration: '', problem: '' }]
      };
    });
  }

  protected updateToBeRow(index: number, patch: Partial<CapabilityToBeFlowRow>): void {
    this.patchCapabilityCard((c) => {
      const toBeFlow = c.toBeFlow.map((row, i) =>
        i === index ? { ...row, ...patch, step: i + 1 } : { ...row, step: i + 1 }
      );
      return { ...c, toBeFlow };
    });
  }

  protected addToBeRow(): void {
    this.patchCapabilityCard((c) => {
      const step = c.toBeFlow.length + 1;
      return {
        ...c,
        toBeFlow: [
          ...c.toBeFlow,
          { step, descriptionWithAi: '', change: '', risk: '' }
        ]
      };
    });
  }

  protected removeToBeRow(index: number): void {
    this.patchCapabilityCard((c) => {
      const toBeFlow = c.toBeFlow.filter((_, i) => i !== index).map((row, i) => ({
        ...row,
        step: i + 1
      }));
      return {
        ...c,
        toBeFlow:
          toBeFlow.length > 0
            ? toBeFlow
            : [{ step: 1, descriptionWithAi: '', change: '', risk: '' }]
      };
    });
  }

  protected getAssessmentSummaryLine(id: string): string {
    const a = this.repository.assessments().find((x) => x.id === id);
    if (!a) return id;
    const d = a.finalizedAt ?? a.updatedAt;
    return `${a.summary || 'Sem resumo'} · ${d.slice(0, 10)}`;
  }

  private findDimensionCodeForQuestion(questionCode: string): string {
    for (const dimension of this.catalog().dimensions) {
      for (const capacity of dimension.capacities) {
        if (capacity.questions.some((q) => q.code === questionCode)) {
          return dimension.code;
        }
      }
    }
    return '';
  }

  protected exportJson(): void {
    const now = new Date().toISOString().slice(0, 10);
    const json = this.exportService.buildJsonBackup(this.repository.exportState());
    this.exportService.downloadFile(
      `aimaturity-backup-${now}.json`,
      json,
      'application/json'
    );
  }

  protected async importJsonFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const payload = JSON.parse(text) as unknown;

      this.repository.importState(payload);
      this.resetDraftFromSelection();
      this.assessmentViewMode.set('list');
      this.resultViewMode.set('list');
      this.selectedResultAssessmentId.set(null);
      this.announce('Backup JSON importado com sucesso.');
    } catch {
      this.announce('Falha ao importar JSON. Verifique se o arquivo e um backup valido.');
    } finally {
      if (input) {
        input.value = '';
      }
    }
  }

  protected canFinalize(): boolean {
    return this.allQuestionsAnswered() && this.evidencePendingCount() === 0;
  }

  protected trackByCode(index: number, item: { code: string }): string {
    return item.code;
  }

  private allQuestionsAnswered(): boolean {
    return this.unansweredCount() === 0;
  }

  private buildAssessmentPayload(teamId: string, status: 'draft' | 'finalized') {
    const draft = this.draft();
    return {
      id: draft.id ?? undefined,
      teamId,
      frameworkVersion: this.catalog().version,
      assessor: draft.assessor.trim(),
      summary: draft.summary.trim(),
      status,
      finalizedAt: status === 'finalized' ? new Date().toISOString() : null,
      responses: this.cloneResponses(draft.responses)
    };
  }

  private resetDraftFromSelection(): void {
    const latestDraft = this.assessmentsForSelectedTeam().find(
      (assessment) => assessment.status === 'draft'
    );

    if (latestDraft) {
      this.loadAssessment(latestDraft);
      return;
    }

    this.draft.set({
      ...this.createEmptyDraft(),
      teamId: this.selectedTeamId()
    });
  }

  private createEmptyDraft(): AssessmentDraftState {
    const responses = Object.fromEntries(
      this.getAllQuestions(this.catalog()).map((question) => [
        question.code,
        { score: null, practiceDetails: '', evidence: '', toolIds: [] }
      ])
    );

    return {
      id: createDraftId(),
      assessor: '',
      summary: '',
      teamId: this.selectedTeamId(),
      responses
    };
  }

  private cloneResponses(
    responses: Record<string, AssessmentAnswer>
  ): Record<string, AssessmentAnswer> {
    return Object.fromEntries(
      Object.entries(responses).map(([questionCode, response]) => [
        questionCode,
        {
          score: response.score,
          practiceDetails: response.practiceDetails ?? '',
          evidence: response.evidence,
          toolIds: [...response.toolIds]
        }
      ])
    );
  }

  private buildToolUsageSummary(
    assessments: Assessment[],
    questionFilter?: Set<string>
  ): ToolUsageSummary[] {
    const summaryMap = new Map<string, ToolUsageSummary>();

    for (const assessment of assessments) {
      for (const [questionCode, response] of Object.entries(assessment.responses)) {
        if (questionFilter && !questionFilter.has(questionCode)) {
          continue;
        }

        for (const toolId of response.toolIds) {
          const current = summaryMap.get(toolId);
          const nextQuestionCodes = current
            ? Array.from(new Set([...current.questionCodes, questionCode]))
            : [questionCode];
          const nextTeams = current
            ? Array.from(new Set([...current.teams, assessment.teamId]))
            : [assessment.teamId];

          summaryMap.set(toolId, {
            toolId,
            name: this.getToolName(toolId),
            count: (current?.count ?? 0) + 1,
            teams: nextTeams,
            questionCodes: nextQuestionCodes
          });
        }
      }
    }

    return Array.from(summaryMap.values()).sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }

      return left.name.localeCompare(right.name);
    });
  }

  private getAllQuestions(catalog: FrameworkCatalog) {
    return catalog.dimensions.flatMap((dimension) =>
      dimension.capacities.flatMap((capacity) => capacity.questions)
    );
  }

  private announce(message: string): void {
    this.feedback.set(message);
    if (this.toastTimer != null) {
      clearTimeout(this.toastTimer);
    }
    this.toastTimer = setTimeout(() => {
      this.feedback.set('');
      this.toastTimer = null;
    }, 4000);
  }

  protected dismissFeedback(): void {
    if (this.toastTimer != null) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
    this.feedback.set('');
  }

  private viewToIndex(view: 'teams' | 'tools' | 'assessment' | 'results' | 'capability-cards'): number {
    switch (view) {
      case 'teams':
        return 0;
      case 'tools':
        return 1;
      case 'assessment':
        return 2;
      case 'results':
        return 3;
      case 'capability-cards':
        return 4;
    }
  }

  private indexToView(
    index: number
  ): 'teams' | 'tools' | 'assessment' | 'results' | 'capability-cards' {
    switch (index) {
      case 1:
        return 'tools';
      case 2:
        return 'assessment';
      case 3:
        return 'results';
      case 4:
        return 'capability-cards';
      default:
        return 'teams';
    }
  }
}
