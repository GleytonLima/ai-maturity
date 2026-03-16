import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceDir = path.resolve(__dirname, '..');
const appDir = path.join(workspaceDir, 'ai-maturity');
const assetsDir = path.join(appDir, 'src', 'assets', 'framework', 'v1');
const generatedDir = path.join(
  appDir,
  'src',
  'app',
  'core',
  'framework',
  'generated'
);

const levelThresholds = [
  { min: 0, max: 0.9, level: 'N1', label: 'Ad-hoc' },
  { min: 1, max: 1.9, level: 'N2', label: 'Assistido' },
  { min: 2, max: 2.9, level: 'N3', label: 'Padronizado' },
  { min: 3, max: 3.6, level: 'N4', label: 'Otimizado' },
  { min: 3.7, max: 4, level: 'N5', label: 'IA-nativo' }
];

const questions = [
  {
    dimensionCode: 'D1',
    dimensionTitle: 'Cobertura do SDLC',
    weight: 1.0,
    capacityCode: 'D1C1',
    capacityTitle: 'Uso pre-codigo',
    code: 'Q1',
    prompt:
      'A squad usa IA em discovery, pesquisa, ideacao ou entendimento do problema?'
  },
  {
    dimensionCode: 'D1',
    dimensionTitle: 'Cobertura do SDLC',
    weight: 1.0,
    capacityCode: 'D1C1',
    capacityTitle: 'Uso pre-codigo',
    code: 'Q2',
    prompt:
      'A squad usa IA para refinar requisitos, criterios de aceitacao ou reduzir ambiguidades?'
  },
  {
    dimensionCode: 'D1',
    dimensionTitle: 'Cobertura do SDLC',
    weight: 1.0,
    capacityCode: 'D1C1',
    capacityTitle: 'Uso pre-codigo',
    code: 'Q3',
    prompt:
      'A squad usa IA para apoiar design e decisoes de arquitetura, incluindo alternativas e trade-offs?'
  },
  {
    dimensionCode: 'D1',
    dimensionTitle: 'Cobertura do SDLC',
    weight: 1.0,
    capacityCode: 'D1C2',
    capacityTitle: 'Uso em delivery e run',
    code: 'Q4',
    prompt:
      'A squad usa IA para geracao, manutencao, priorizacao ou analise de testes e QA?'
  },
  {
    dimensionCode: 'D1',
    dimensionTitle: 'Cobertura do SDLC',
    weight: 1.0,
    capacityCode: 'D1C2',
    capacityTitle: 'Uso em delivery e run',
    code: 'Q5',
    prompt:
      'A squad usa IA em documentacao tecnica, documentacao de release ou artefatos operacionais?'
  },
  {
    dimensionCode: 'D1',
    dimensionTitle: 'Cobertura do SDLC',
    weight: 1.0,
    capacityCode: 'D1C2',
    capacityTitle: 'Uso em delivery e run',
    code: 'Q6',
    prompt:
      'A squad usa IA em operacao, observabilidade, incidentes, troubleshooting ou runbooks?'
  },
  {
    dimensionCode: 'D2',
    dimensionTitle: 'Integracao no fluxo',
    weight: 1.1,
    capacityCode: 'D2C1',
    capacityTitle: 'Integracao com toolchain',
    code: 'Q7',
    prompt:
      'A IA esta integrada ao IDE ou ambiente principal de desenvolvimento de forma recorrente?'
  },
  {
    dimensionCode: 'D2',
    dimensionTitle: 'Integracao no fluxo',
    weight: 1.1,
    capacityCode: 'D2C1',
    capacityTitle: 'Integracao com toolchain',
    code: 'Q8',
    prompt:
      'A IA esta integrada ao fluxo de PR, code review, backlog, issue tracking ou wiki?'
  },
  {
    dimensionCode: 'D2',
    dimensionTitle: 'Integracao no fluxo',
    weight: 1.1,
    capacityCode: 'D2C1',
    capacityTitle: 'Integracao com toolchain',
    code: 'Q9',
    prompt:
      'A IA esta integrada ao pipeline de CI/CD, automacoes de qualidade ou gates tecnicos?'
  },
  {
    dimensionCode: 'D2',
    dimensionTitle: 'Integracao no fluxo',
    weight: 1.1,
    capacityCode: 'D2C2',
    capacityTitle: 'Automacao e agentes',
    code: 'Q10',
    prompt:
      'A squad possui playbooks, biblioteca de prompts, templates ou padroes reutilizaveis para uso de IA?'
  },
  {
    dimensionCode: 'D2',
    dimensionTitle: 'Integracao no fluxo',
    weight: 1.1,
    capacityCode: 'D2C2',
    capacityTitle: 'Automacao e agentes',
    code: 'Q11',
    prompt:
      'A squad utiliza automacoes com IA no fluxo de trabalho, alem de uso manual em chat?'
  },
  {
    dimensionCode: 'D2',
    dimensionTitle: 'Integracao no fluxo',
    weight: 1.1,
    capacityCode: 'D2C2',
    capacityTitle: 'Automacao e agentes',
    code: 'Q12',
    prompt:
      'A squad utiliza agentes ou assistentes com autonomia delimitada e supervisao humana?'
  },
  {
    dimensionCode: 'D3',
    dimensionTitle: 'Qualidade em alta velocidade',
    weight: 1.3,
    capacityCode: 'D3C1',
    capacityTitle: 'Controles de qualidade',
    code: 'Q13',
    prompt:
      'Outputs gerados com IA passam por revisao humana explicita, com criterios adaptados para IA?'
  },
  {
    dimensionCode: 'D3',
    dimensionTitle: 'Qualidade em alta velocidade',
    weight: 1.3,
    capacityCode: 'D3C1',
    capacityTitle: 'Controles de qualidade',
    code: 'Q14',
    prompt:
      'Mudancas geradas com IA passam por testes automatizados, validacoes e gates confiaveis?'
  },
  {
    dimensionCode: 'D3',
    dimensionTitle: 'Qualidade em alta velocidade',
    weight: 1.3,
    capacityCode: 'D3C1',
    capacityTitle: 'Controles de qualidade',
    code: 'Q15',
    prompt:
      'A squad consegue usar IA sem aumentar de forma relevante retrabalho, defeitos ou instabilidade?'
  },
  {
    dimensionCode: 'D3',
    dimensionTitle: 'Qualidade em alta velocidade',
    weight: 1.3,
    capacityCode: 'D3C2',
    capacityTitle: 'Sustentabilidade tecnica',
    code: 'Q16',
    prompt:
      'A squad controla o impacto da IA em complexidade, manutenibilidade e divida tecnica?'
  },
  {
    dimensionCode: 'D3',
    dimensionTitle: 'Qualidade em alta velocidade',
    weight: 1.3,
    capacityCode: 'D3C2',
    capacityTitle: 'Sustentabilidade tecnica',
    code: 'Q17',
    prompt:
      'A squad mantem pequenos lotes, disciplina de versionamento e clareza de autoria ao usar IA?'
  },
  {
    dimensionCode: 'D3',
    dimensionTitle: 'Qualidade em alta velocidade',
    weight: 1.3,
    capacityCode: 'D3C2',
    capacityTitle: 'Sustentabilidade tecnica',
    code: 'Q18',
    prompt:
      'A squad monitora o comportamento de mudancas assistidas por IA apos merge ou deploy?'
  },
  {
    dimensionCode: 'D4',
    dimensionTitle: 'Seguranca, privacidade, IP e compliance',
    weight: 1.5,
    capacityCode: 'D4C1',
    capacityTitle: 'Governanca e politica',
    code: 'Q19',
    prompt:
      'Existe politica clara sobre ferramentas de IA permitidas, usos proibidos e tipos de dados restritos?'
  },
  {
    dimensionCode: 'D4',
    dimensionTitle: 'Seguranca, privacidade, IP e compliance',
    weight: 1.5,
    capacityCode: 'D4C1',
    capacityTitle: 'Governanca e politica',
    code: 'Q20',
    prompt:
      'A squad entende e aplica regras sobre privacidade, segredos, dados sensiveis e vazamento de informacao?'
  },
  {
    dimensionCode: 'D4',
    dimensionTitle: 'Seguranca, privacidade, IP e compliance',
    weight: 1.5,
    capacityCode: 'D4C1',
    capacityTitle: 'Governanca e politica',
    code: 'Q21',
    prompt:
      'A squad considera riscos de IP, licenciamento, direitos autorais e origem do conteudo gerado por IA?'
  },
  {
    dimensionCode: 'D4',
    dimensionTitle: 'Seguranca, privacidade, IP e compliance',
    weight: 1.5,
    capacityCode: 'D4C2',
    capacityTitle: 'Controles de risco no fluxo',
    code: 'Q22',
    prompt:
      'Existe trilha de auditoria ou registro minimo do uso de IA em artefatos relevantes?'
  },
  {
    dimensionCode: 'D4',
    dimensionTitle: 'Seguranca, privacidade, IP e compliance',
    weight: 1.5,
    capacityCode: 'D4C2',
    capacityTitle: 'Controles de risco no fluxo',
    code: 'Q23',
    prompt:
      'A squad incorpora riscos de IA no threat modeling do produto e/ou do fluxo de engenharia (quando aplicavel), incluindo prompt injection, overreliance e supply chain?'
  },
  {
    dimensionCode: 'D4',
    dimensionTitle: 'Seguranca, privacidade, IP e compliance',
    weight: 1.5,
    capacityCode: 'D4C2',
    capacityTitle: 'Controles de risco no fluxo',
    code: 'Q24',
    prompt:
      'Existem controles operacionais ou tecnicos para prevenir uso inseguro de IA no fluxo de desenvolvimento?'
  },
  {
    dimensionCode: 'D5',
    dimensionTitle: 'Dados e conhecimento acessiveis a IA',
    weight: 1.1,
    capacityCode: 'D5C1',
    capacityTitle: 'Conhecimento encontravel',
    code: 'Q25',
    prompt:
      'A documentacao e o conhecimento interno sao encontraveis, atualizados e uteis para humanos e IA?'
  },
  {
    dimensionCode: 'D5',
    dimensionTitle: 'Dados e conhecimento acessiveis a IA',
    weight: 1.1,
    capacityCode: 'D5C1',
    capacityTitle: 'Conhecimento encontravel',
    code: 'Q26',
    prompt:
      'A squad documenta decisoes importantes de forma que o conhecimento possa ser reutilizado posteriormente?'
  },
  {
    dimensionCode: 'D5',
    dimensionTitle: 'Dados e conhecimento acessiveis a IA',
    weight: 1.1,
    capacityCode: 'D5C1',
    capacityTitle: 'Conhecimento encontravel',
    code: 'Q27',
    prompt:
      'A squad consegue responder duvidas tecnicas relevantes com rapidez usando base interna e contexto confiavel?'
  },
  {
    dimensionCode: 'D5',
    dimensionTitle: 'Dados e conhecimento acessiveis a IA',
    weight: 1.1,
    capacityCode: 'D5C2',
    capacityTitle: 'Contexto seguro para IA',
    code: 'Q28',
    prompt:
      'A squad oferece a IA acesso a contexto interno seguro, como docs, codigo, padroes e historico relevante?'
  },
  {
    dimensionCode: 'D5',
    dimensionTitle: 'Dados e conhecimento acessiveis a IA',
    weight: 1.1,
    capacityCode: 'D5C2',
    capacityTitle: 'Contexto seguro para IA',
    code: 'Q29',
    prompt:
      'Esse acesso a contexto interno possui controle de acesso, rastreabilidade e protecao adequada?'
  },
  {
    dimensionCode: 'D5',
    dimensionTitle: 'Dados e conhecimento acessiveis a IA',
    weight: 1.1,
    capacityCode: 'D5C2',
    capacityTitle: 'Contexto seguro para IA',
    code: 'Q30',
    prompt:
      'A qualidade, atualizacao e ownership dos dados e conhecimento sao tratadas como fundamento para uso eficaz da IA?'
  },
  {
    dimensionCode: 'D6',
    dimensionTitle: 'Pessoas e cultura',
    weight: 1.0,
    capacityCode: 'D6C1',
    capacityTitle: 'Habilidades e confianca',
    code: 'Q31',
    prompt:
      'A squad recebeu treinamento minimo sobre como usar IA, avaliar respostas e reconhecer limites e riscos?'
  },
  {
    dimensionCode: 'D6',
    dimensionTitle: 'Pessoas e cultura',
    weight: 1.0,
    capacityCode: 'D6C1',
    capacityTitle: 'Habilidades e confianca',
    code: 'Q32',
    prompt:
      'O uso de IA esta distribuido no time, em vez de concentrado em poucos power users?'
  },
  {
    dimensionCode: 'D6',
    dimensionTitle: 'Pessoas e cultura',
    weight: 1.0,
    capacityCode: 'D6C1',
    capacityTitle: 'Habilidades e confianca',
    code: 'Q33',
    prompt:
      'A squad sabe explicitar quando nao usar IA ou quando exigir revisao reforcada?'
  },
  {
    dimensionCode: 'D6',
    dimensionTitle: 'Pessoas e cultura',
    weight: 1.0,
    capacityCode: 'D6C2',
    capacityTitle: 'Colaboracao e aprendizado',
    code: 'Q34',
    prompt:
      'O time compartilha boas praticas, prompts, exemplos, aprendizados e padroes de uso de IA?'
  },
  {
    dimensionCode: 'D6',
    dimensionTitle: 'Pessoas e cultura',
    weight: 1.0,
    capacityCode: 'D6C2',
    capacityTitle: 'Colaboracao e aprendizado',
    code: 'Q35',
    prompt:
      'A lideranca e o ambiente da squad favorecem experimentacao segura, com clareza e seguranca psicologica?'
  },
  {
    dimensionCode: 'D6',
    dimensionTitle: 'Pessoas e cultura',
    weight: 1.0,
    capacityCode: 'D6C2',
    capacityTitle: 'Colaboracao e aprendizado',
    code: 'Q36',
    prompt:
      'A squad realiza retrospectivas, revisoes ou ciclos de aprendizado especificos sobre uso de IA?'
  },
  {
    dimensionCode: 'D7',
    dimensionTitle: 'Medicao de valor e feedback loops',
    weight: 1.2,
    capacityCode: 'D7C1',
    capacityTitle: 'Telemetria e outcomes',
    code: 'Q37',
    prompt:
      'A squad mede adocao e intensidade de uso de IA por meio de telemetria ou dados objetivos?'
  },
  {
    dimensionCode: 'D7',
    dimensionTitle: 'Medicao de valor e feedback loops',
    weight: 1.2,
    capacityCode: 'D7C1',
    capacityTitle: 'Telemetria e outcomes',
    code: 'Q38',
    prompt:
      'A squad mede impacto em fluxo de engenharia, como review speed, lead time, throughput ou cycle time?'
  },
  {
    dimensionCode: 'D7',
    dimensionTitle: 'Medicao de valor e feedback loops',
    weight: 1.2,
    capacityCode: 'D7C1',
    capacityTitle: 'Telemetria e outcomes',
    code: 'Q39',
    prompt:
      'A squad mede impacto em qualidade e estabilidade, como defeitos, incidentes, retrabalho ou debt?'
  },
  {
    dimensionCode: 'D7',
    dimensionTitle: 'Medicao de valor e feedback loops',
    weight: 1.2,
    capacityCode: 'D7C2',
    capacityTitle: 'Aprendizado orientado a dados',
    code: 'Q40',
    prompt:
      'A squad compara percepcoes sobre ganho com IA com resultados observaveis, evitando metricas de vaidade?'
  },
  {
    dimensionCode: 'D7',
    dimensionTitle: 'Medicao de valor e feedback loops',
    weight: 1.2,
    capacityCode: 'D7C2',
    capacityTitle: 'Aprendizado orientado a dados',
    code: 'Q41',
    prompt:
      'A squad usa essas metricas para priorizar onde expandir, limitar ou ajustar o uso de IA?'
  },
  {
    dimensionCode: 'D7',
    dimensionTitle: 'Medicao de valor e feedback loops',
    weight: 1.2,
    capacityCode: 'D7C2',
    capacityTitle: 'Aprendizado orientado a dados',
    code: 'Q42',
    prompt:
      'A squad mantem feedback loops continuos para revisar praticas, ferramentas, controles e treinamento?'
  }
];

const dimensions = Object.values(
  questions.reduce((accumulator, question) => {
    const dimension =
      accumulator[question.dimensionCode] ??
      (accumulator[question.dimensionCode] = {
        code: question.dimensionCode,
        title: question.dimensionTitle,
        weight: question.weight,
        capacities: {}
      });

    const capacity =
      dimension.capacities[question.capacityCode] ??
      (dimension.capacities[question.capacityCode] = {
        code: question.capacityCode,
        title: question.capacityTitle,
        questions: []
      });

    capacity.questions.push({
      code: question.code,
      prompt: question.prompt
    });

    return accumulator;
  }, {})
).map((dimension) => ({
  code: dimension.code,
  title: dimension.title,
  weight: dimension.weight,
  capacities: Object.values(dimension.capacities)
}));

const manifest = {
  version: 'v1',
  title: 'Modelo de Maturidade de IA para Squads de Engenharia',
  weights: Object.fromEntries(dimensions.map((dimension) => [dimension.code, dimension.weight])),
  scale: {
    min: 0,
    max: 4,
    labels: {
      '0': 'Inexistente ou proibido',
      '1': 'Ad-hoc e isolado',
      '2': 'Parcial',
      '3': 'Padronizado com evidencia',
      '4': 'Medido e otimizado'
    }
  },
  scoring: {
    question: 'score direto de 0 a 4',
    capability: 'media simples de 3 perguntas',
    dimension: 'media simples de 2 capacidades',
    overall: 'media ponderada das 7 dimensoes'
  },
  levelThresholds,
  gating: {
    maxLevelIfBelow: [
      { dimensionCode: 'D3', threshold: 2.0, level: 'N2', reason: 'Qualidade abaixo do minimo para escalar o uso de IA.' },
      { dimensionCode: 'D4', threshold: 2.0, level: 'N2', reason: 'Seguranca abaixo do minimo para escalar o uso de IA.' }
    ],
    requiredForAdvancedLevels: [
      { dimensionCode: 'D3', threshold: 3.0 },
      { dimensionCode: 'D4', threshold: 3.0 },
      { dimensionCode: 'D7', threshold: 2.5 }
    ]
  },
  alerts: {
    structuralRisk: ['Q19', 'Q20', 'Q22', 'Q23'],
    qualityRisk: ['Q13', 'Q14', 'Q16']
  }
};

const catalog = {
  version: manifest.version,
  title: manifest.title,
  manifest,
  dimensions
};

async function ensureDir(targetDir) {
  await mkdir(targetDir, { recursive: true });
}

async function writeJson(targetPath, payload) {
  await writeFile(targetPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

async function generateAssets() {
  await ensureDir(assetsDir);
  await ensureDir(path.join(assetsDir, 'dimensions'));
  await ensureDir(path.join(assetsDir, 'questions'));

  await writeJson(path.join(assetsDir, 'manifest.json'), manifest);

  for (const dimension of dimensions) {
    await writeJson(
      path.join(assetsDir, 'dimensions', `${dimension.code}.json`),
      dimension
    );

    const questionDir = path.join(
      assetsDir,
      'questions',
      dimension.code.toLowerCase()
    );
    await ensureDir(questionDir);

    for (const capacity of dimension.capacities) {
      for (const question of capacity.questions) {
        await writeJson(path.join(questionDir, `${question.code}.json`), {
          ...question,
          dimensionCode: dimension.code,
          capacityCode: capacity.code
        });
      }
    }
  }
}

async function generateModule() {
  await ensureDir(generatedDir);

  const moduleSource = `import type { FrameworkCatalog } from '../../models/ai-maturity.models';

export const FRAMEWORK_CATALOG: FrameworkCatalog = ${JSON.stringify(catalog, null, 2)} as const;
`;

  await writeFile(
    path.join(generatedDir, 'framework-catalog.data.ts'),
    `${moduleSource}\n`,
    'utf8'
  );
}

await Promise.all([generateAssets(), generateModule()]);
