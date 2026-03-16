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

export interface PersistedState {
  version: string;
  selectedTeamId: string | null;
  teams: Team[];
  tools: Tool[];
  assessments: Assessment[];
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
