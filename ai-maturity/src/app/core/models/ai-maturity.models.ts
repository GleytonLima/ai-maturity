export type LevelCode = 'N1' | 'N2' | 'N3' | 'N4' | 'N5';
export type AssessmentStatus = 'draft' | 'finalized';
export type ToolStatus = 'approved' | 'experimental' | 'restricted';

export interface FrameworkQuestion {
  code: string;
  prompt: string;
  hint: string;
  scoreProfile?: string;
}

export interface FrameworkCapacity {
  code: string;
  title: string;
  questions: FrameworkQuestion[];
}

export interface FrameworkDimension {
  code: string;
  title: string;
  weight: number;
  capacities: FrameworkCapacity[];
}

export interface LevelThreshold {
  min: number;
  max: number;
  level: LevelCode;
  label: string;
  description: string;
  example: string;
  evolution: string[];
}

export interface FrameworkCatalog {
  version: string;
  title: string;
  manifest: {
    version: string;
    title: string;
    weights: Record<string, number>;
    scale: {
      min: number;
      max: number;
      labels: Record<string, string>;
      hints: Record<string, string>;
      defaultProfile?: string;
      profiles?: Record<string, {
        labels: Record<string, string>;
        hints: Record<string, string>;
      }>;
    };
    scoring: {
      question: string;
      capability: string;
      dimension: string;
      overall: string;
    };
    levelThresholds: LevelThreshold[];
    gating: {
      maxLevelIfBelow: Array<{
        dimensionCode: string;
        threshold: number;
        level: LevelCode;
        reason: string;
      }>;
      requiredForAdvancedLevels: Array<{
        dimensionCode: string;
        threshold: number;
      }>;
    };
    alerts: {
      structuralRisk: string[];
      qualityRisk: string[];
    };
  };
  dimensions: FrameworkDimension[];
}

export interface Team {
  id: string;
  name: string;
  sector: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tool {
  id: string;
  name: string;
  vendor: string;
  category: string;
  status: ToolStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentAnswer {
  score: number | null;
  /** Detalhes opcionais sobre como a prática se aplica na squad (qualquer nota). */
  practiceDetails: string;
  evidence: string;
  toolIds: string[];
}

export interface Assessment {
  id: string;
  teamId: string;
  frameworkVersion: string;
  assessor: string;
  summary: string;
  status: AssessmentStatus;
  createdAt: string;
  updatedAt: string;
  finalizedAt: string | null;
  responses: Record<string, AssessmentAnswer>;
}

/** Tipos de uso de IA na hipótese (Seção 4 da Ficha de Capacidade). */
export type CapabilityCardAiUsageType = 'geracao' | 'analise' | 'automacao' | 'sugestao';

/** Recomendação final (Seção 11). */
export type CapabilityCardVerdict = 'adotar' | 'testar_mais' | 'descartar';

/** Escala de impacto / confiabilidade (Seção 9). */
export type CapabilityCardImpactScale = 'baixo' | 'medio' | 'alto';
export type CapabilityCardReliabilityScale = 'baixa' | 'media' | 'alta';

/** Linha da tabela "Mapeamento do Fluxo" (AS-IS). */
export interface CapabilityFlowMapRow {
  /** Ordem do passo na tabela (1, 2, 3…); sempre derivada da posição da linha. */
  step: number;
  description: string;
  responsible: string;
  duration: string;
  problem: string;
}

/** Linha da tabela "Novo Fluxo (TO-BE)". */
export interface CapabilityToBeFlowRow {
  /** Ordem do passo na tabela (1, 2, 3…); sempre derivada da posição da linha. */
  step: number;
  descriptionWithAi: string;
  change: string;
  risk: string;
}

/** Ficha de Capacidade: operacionalização de uma pergunta com experimento e evidências. */
export interface CapabilityCard {
  id: string;
  assessmentId: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
  context: {
    squad: string;
    storyAnalyzed: string;
    dimensionCode: string;
    questionCode: string;
  };
  asIs: {
    flowDescription: string;
    stepCount: string;
    /** Ferramentas selecionadas do cadastro (IDs). */
    toolIds: string[];
    /** Texto livre para ferramentas não cadastradas ou notas (migra `toolsUsed` legado). */
    toolsUsedOther: string;
    avgTime: string;
    frequency: string;
    mainPains: string;
  };
  flowMap: CapabilityFlowMapRow[];
  aiHypothesis: {
    impactedStages: string;
    usageTypes: CapabilityCardAiUsageType[];
    inputNeeded: string;
    expectedOutput: string;
  };
  toBeFlow: CapabilityToBeFlowRow[];
  risksControls: {
    hallucinationRisk: string;
    securityRisk: string;
    qualityRisk: string;
    humanValidationNeed: string;
  };
  experiment: {
    executedBy: string;
    iterations: string;
    realOrSimulated: string;
    variationsTested: string;
  };
  evidenceQuantitative: {
    timeBefore: string;
    timeAfter: string;
    reductionPercent: string;
    reworkCount: string;
    bugs: string;
  };
  evidenceQualitative: {
    teamConfidence: string;
    easeOfUse: string;
    outputClarity: string;
  };
  impact: CapabilityCardImpactScale | null;
  reliability: CapabilityCardReliabilityScale | null;
  /** Justificativa explícita da escala de impacto (âncoras, evidências, limitações). */
  impactRationale: string;
  /** Justificativa explícita da escala de confiabilidade (reprodutibilidade, controles). */
  reliabilityRationale: string;
  maturityUpdate: {
    levelBefore: string;
    levelAfter: string;
    evidenceJustification: string;
  };
  recommendation: {
    verdict: CapabilityCardVerdict | null;
    adjustments: string;
    externalDeps: string;
  };
}

export interface PersistedState {
  version: string;
  selectedTeamId: string | null;
  teams: Team[];
  tools: Tool[];
  assessments: Assessment[];
  /** Fichas de capacidade vinculadas a assessments finalizados (diagnóstico → ação). */
  capabilityCards?: CapabilityCard[];
}

export interface CapabilityScore {
  code: string;
  title: string;
  value: number;
}

export interface DimensionScore {
  code: string;
  title: string;
  weight: number;
  value: number;
  level: LevelThreshold;
  capabilities: CapabilityScore[];
}

export interface AssessmentResult {
  level: LevelThreshold;
  rawLevel: LevelThreshold;
  overallScore: number;
  dimensionScores: DimensionScore[];
  structuralRisks: string[];
  qualityRisks: string[];
  gatingReasons: string[];
}

export interface AssessmentViewModel {
  assessment: Assessment;
  result: AssessmentResult;
}
