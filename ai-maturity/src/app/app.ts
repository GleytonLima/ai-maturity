import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FrameworkCatalogService } from './core/framework/framework-catalog.service';
import type {
  Assessment,
  AssessmentAnswer,
  AssessmentResult,
  AssessmentViewModel,
  FrameworkCatalog,
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

function createDraftId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `assessment-${crypto.randomUUID()}`;
  }

  return `assessment-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    MatToolbarModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly catalogService = inject(FrameworkCatalogService);
  private readonly repository = inject(AiMaturityRepository);
  private readonly scoringService = inject(AssessmentScoringService);
  private readonly exportService = inject(ExportService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly catalog = signal<FrameworkCatalog>(this.catalogService.getCatalog());
  protected readonly activeView = signal<'teams' | 'tools' | 'assessment' | 'results'>('teams');
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
  protected readonly feedback = signal<string>('Selecione um time para iniciar.');
  protected readonly tabIndex = computed(() => this.viewToIndex(this.activeView()));
  protected readonly teamCrudMode = signal<'list' | 'form'>('list');
  protected readonly toolCrudMode = signal<'list' | 'form'>('list');
  protected readonly assessmentViewMode = signal<'list' | 'form'>('list');
  protected readonly assessmentFormStep = signal<'metadata' | 'questions'>('metadata');
  protected readonly resultViewMode = signal<'list' | 'detail'>('list');
  protected readonly selectedResultAssessmentId = signal<string | null>(null);
  protected readonly teamPageIndex = signal(0);
  protected readonly teamPageSize = signal(5);
  protected readonly toolPageIndex = signal(0);
  protected readonly toolPageSize = signal(5);
  protected readonly displayedTeamColumns = [
    'name',
    'sector',
    'assessments',
    'updatedAt',
    'actions'
  ];
  protected readonly displayedToolColumns = [
    'name',
    'category',
    'status',
    'usage',
    'updatedAt',
    'actions'
  ];
  protected readonly displayedAssessmentColumns = [
    'team',
    'status',
    'updatedAt',
    'level',
    'score',
    'actions'
  ];
  protected readonly displayedResultColumns = [
    'team',
    'finalizedAt',
    'level',
    'score',
    'actions'
  ];

  protected readonly selectedTeam = computed(
    () =>
      this.teams().find((team) => team.id === this.selectedTeamId()) ?? null
  );
  protected readonly draftTeam = computed(
    () => this.teams().find((team) => team.id === this.draft().teamId) ?? null
  );
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
  protected readonly currentResultDetail = computed(() => {
    const assessmentId = this.selectedResultAssessmentId();
    return this.finalizedAssessments().find(
      ({ assessment }) => assessment.id === assessmentId
    ) ?? null;
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
      return response && response.score !== null && response.score >= 3 && !response.evidence.trim();
    }).length;
  });
  protected readonly completionPercent = computed(() => {
    const total = this.getAllQuestions(this.catalog()).length;
    if (total === 0) {
      return 0;
    }

    return Math.round(((total - this.unansweredCount()) / total) * 100);
  });
  protected readonly scoreOptions = computed(() => {
    const { labels, hints } = this.catalog().manifest.scale;
    return Object.entries(labels)
      .map(([value, label]) => ({
        value: Number(value),
        label,
        hint: hints[value] ?? ''
      }))
      .sort((left, right) => left.value - right.value);
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

  protected setActiveView(view: 'teams' | 'tools' | 'assessment' | 'results'): void {
    this.activeView.set(view);
  }

  protected onTabChange(event: MatTabChangeEvent): void {
    const view = this.indexToView(event.index);
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

  protected onTeamPageChange(event: PageEvent): void {
    this.teamPageIndex.set(event.pageIndex);
    this.teamPageSize.set(event.pageSize);
  }

  protected onToolPageChange(event: PageEvent): void {
    this.toolPageIndex.set(event.pageIndex);
    this.toolPageSize.set(event.pageSize);
  }

  protected getAssessmentCountForTeam(teamId: string): number {
    return this.repository.getAssessmentsForTeam(teamId).length;
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
  }

  protected backToAssessmentList(): void {
    this.assessmentViewMode.set('list');
  }

  protected backToResultsList(): void {
    this.resultViewMode.set('list');
    this.selectedResultAssessmentId.set(null);
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

  protected exportCsv(): void {
    const now = new Date().toISOString().slice(0, 10);
    const csv = this.exportService.buildCsvRows(
      this.teams(),
      this.assessmentViewModels().filter(
        ({ assessment }) => assessment.status === 'finalized'
      )
    );
    this.exportService.downloadFile(`aimaturity-results-${now}.csv`, csv, 'text/csv');
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
        { score: null, evidence: '', toolIds: [] }
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
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  private viewToIndex(view: 'teams' | 'tools' | 'assessment' | 'results'): number {
    switch (view) {
      case 'teams':
        return 0;
      case 'tools':
        return 1;
      case 'assessment':
        return 2;
      case 'results':
        return 3;
    }
  }

  private indexToView(index: number): 'teams' | 'tools' | 'assessment' | 'results' {
    switch (index) {
      case 1:
        return 'tools';
      case 2:
        return 'assessment';
      case 3:
        return 'results';
      default:
        return 'teams';
    }
  }
}
