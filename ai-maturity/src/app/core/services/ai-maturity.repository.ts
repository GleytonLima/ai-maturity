import { computed, Injectable, signal } from '@angular/core';

import type {
  Assessment,
  CapabilityCard,
  CapabilityCardAiUsageType,
  CapabilityFlowMapRow,
  CapabilityToBeFlowRow,
  PersistedState,
  Team,
  Tool
} from '../models/ai-maturity.models';

const STORAGE_KEY = 'aimaturity.v1';

function createId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const AI_USAGE_TYPES: CapabilityCardAiUsageType[] = [
  'geracao',
  'analise',
  'automacao',
  'sugestao'
];

function isAiUsageType(value: unknown): value is CapabilityCardAiUsageType {
  return typeof value === 'string' && (AI_USAGE_TYPES as string[]).includes(value);
}

function createDefaultState(): PersistedState {
  return {
    version: 'v2',
    selectedTeamId: null,
    teams: [],
    tools: [],
    assessments: [],
    capabilityCards: []
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeTools(tools: Tool[]): Tool[] {
  const usedIds = new Set<string>();

  return tools.map((tool) => {
    const normalizedId =
      tool.id && !usedIds.has(tool.id)
        ? tool.id
        : createId('tool');

    usedIds.add(normalizedId);

    return {
      ...tool,
      id: normalizedId,
      vendor: tool.vendor ?? '',
      category: tool.category ?? '',
      status: tool.status ?? 'experimental',
      description: tool.description ?? ''
    };
  });
}

function normalizeFlowMapRow(raw: unknown, index: number): CapabilityFlowMapRow {
  const row = isRecord(raw) ? raw : {};
  return {
    step: index + 1,
    description: typeof row['description'] === 'string' ? row['description'] : '',
    responsible: typeof row['responsible'] === 'string' ? row['responsible'] : '',
    duration: typeof row['duration'] === 'string' ? row['duration'] : '',
    problem: typeof row['problem'] === 'string' ? row['problem'] : ''
  };
}

function normalizeToBeRow(raw: unknown, index: number): CapabilityToBeFlowRow {
  const row = isRecord(raw) ? raw : {};
  return {
    step: index + 1,
    descriptionWithAi:
      typeof row['descriptionWithAi'] === 'string' ? row['descriptionWithAi'] : '',
    change: typeof row['change'] === 'string' ? row['change'] : '',
    risk: typeof row['risk'] === 'string' ? row['risk'] : ''
  };
}

function normalizeCapabilityCards(raw: unknown): CapabilityCard[] {
  const cards = Array.isArray(raw) ? raw : [];
  const usedIds = new Set<string>();

  return cards.map((item) => {
    const card = isRecord(item) ? item : {};
    const rawId = card['id'];
    const normalizedId =
      typeof rawId === 'string' && rawId && !usedIds.has(rawId) ? rawId : createId('capcard');

    usedIds.add(normalizedId);

    const flowMapRaw = Array.isArray(card['flowMap']) ? card['flowMap'] : [];
    const flowMap =
      flowMapRaw.length > 0
        ? flowMapRaw.map((row, i) => normalizeFlowMapRow(row, i))
        : [{ step: 1, description: '', responsible: '', duration: '', problem: '' }];

    const toBeRaw = Array.isArray(card['toBeFlow']) ? card['toBeFlow'] : [];
    const toBeFlow =
      toBeRaw.length > 0
        ? toBeRaw.map((row, i) => normalizeToBeRow(row, i))
        : [{ step: 1, descriptionWithAi: '', change: '', risk: '' }];

    const aiHypothesisRecord = isRecord(card['aiHypothesis']) ? card['aiHypothesis'] : {};
    const usageRaw = Array.isArray(aiHypothesisRecord['usageTypes'])
      ? aiHypothesisRecord['usageTypes']
      : [];
    const usageTypes = usageRaw.filter(isAiUsageType);

    const ctx = isRecord(card['context']) ? card['context'] : {};
    const asIs = isRecord(card['asIs']) ? card['asIs'] : {};
    const aiH = aiHypothesisRecord;
    const risks = isRecord(card['risksControls']) ? card['risksControls'] : {};
    const exp = isRecord(card['experiment']) ? card['experiment'] : {};
    const eq = isRecord(card['evidenceQuantitative']) ? card['evidenceQuantitative'] : {};
    const evQ = isRecord(card['evidenceQualitative']) ? card['evidenceQualitative'] : {};
    const mat = isRecord(card['maturityUpdate']) ? card['maturityUpdate'] : {};
    const rec = isRecord(card['recommendation']) ? card['recommendation'] : {};

    const impactVal = card['impact'];
    const reliabilityVal = card['reliability'];

    return {
      id: normalizedId,
      assessmentId: typeof card['assessmentId'] === 'string' ? card['assessmentId'] : '',
      teamId: typeof card['teamId'] === 'string' ? card['teamId'] : '',
      createdAt:
        typeof card['createdAt'] === 'string' ? card['createdAt'] : new Date().toISOString(),
      updatedAt:
        typeof card['updatedAt'] === 'string' ? card['updatedAt'] : new Date().toISOString(),
      context: {
        squad: typeof ctx['squad'] === 'string' ? ctx['squad'] : '',
        storyAnalyzed: typeof ctx['storyAnalyzed'] === 'string' ? ctx['storyAnalyzed'] : '',
        dimensionCode: typeof ctx['dimensionCode'] === 'string' ? ctx['dimensionCode'] : '',
        questionCode: typeof ctx['questionCode'] === 'string' ? ctx['questionCode'] : ''
      },
      asIs: {
        flowDescription:
          typeof asIs['flowDescription'] === 'string' ? asIs['flowDescription'] : '',
        stepCount: typeof asIs['stepCount'] === 'string' ? asIs['stepCount'] : '',
        toolIds: Array.isArray(asIs['toolIds'])
          ? asIs['toolIds'].filter((x): x is string => typeof x === 'string')
          : [],
        toolsUsedOther:
          typeof asIs['toolsUsedOther'] === 'string'
            ? asIs['toolsUsedOther']
            : typeof asIs['toolsUsed'] === 'string'
              ? asIs['toolsUsed']
              : '',
        avgTime: typeof asIs['avgTime'] === 'string' ? asIs['avgTime'] : '',
        frequency: typeof asIs['frequency'] === 'string' ? asIs['frequency'] : '',
        mainPains: typeof asIs['mainPains'] === 'string' ? asIs['mainPains'] : ''
      },
      flowMap,
      aiHypothesis: {
        impactedStages:
          typeof aiH['impactedStages'] === 'string' ? aiH['impactedStages'] : '',
        usageTypes,
        inputNeeded: typeof aiH['inputNeeded'] === 'string' ? aiH['inputNeeded'] : '',
        expectedOutput: typeof aiH['expectedOutput'] === 'string' ? aiH['expectedOutput'] : ''
      },
      toBeFlow,
      risksControls: {
        hallucinationRisk:
          typeof risks['hallucinationRisk'] === 'string' ? risks['hallucinationRisk'] : '',
        securityRisk: typeof risks['securityRisk'] === 'string' ? risks['securityRisk'] : '',
        qualityRisk: typeof risks['qualityRisk'] === 'string' ? risks['qualityRisk'] : '',
        humanValidationNeed:
          typeof risks['humanValidationNeed'] === 'string' ? risks['humanValidationNeed'] : ''
      },
      experiment: {
        executedBy: typeof exp['executedBy'] === 'string' ? exp['executedBy'] : '',
        iterations: typeof exp['iterations'] === 'string' ? exp['iterations'] : '',
        realOrSimulated:
          typeof exp['realOrSimulated'] === 'string' ? exp['realOrSimulated'] : '',
        variationsTested:
          typeof exp['variationsTested'] === 'string' ? exp['variationsTested'] : ''
      },
      evidenceQuantitative: {
        timeBefore: typeof eq['timeBefore'] === 'string' ? eq['timeBefore'] : '',
        timeAfter: typeof eq['timeAfter'] === 'string' ? eq['timeAfter'] : '',
        reductionPercent:
          typeof eq['reductionPercent'] === 'string' ? eq['reductionPercent'] : '',
        reworkCount: typeof eq['reworkCount'] === 'string' ? eq['reworkCount'] : '',
        bugs: typeof eq['bugs'] === 'string' ? eq['bugs'] : ''
      },
      evidenceQualitative: {
        teamConfidence:
          typeof evQ['teamConfidence'] === 'string' ? evQ['teamConfidence'] : '',
        easeOfUse: typeof evQ['easeOfUse'] === 'string' ? evQ['easeOfUse'] : '',
        outputClarity: typeof evQ['outputClarity'] === 'string' ? evQ['outputClarity'] : ''
      },
      impact:
        impactVal === 'baixo' || impactVal === 'medio' || impactVal === 'alto'
          ? impactVal
          : null,
      reliability:
        reliabilityVal === 'baixa' ||
        reliabilityVal === 'media' ||
        reliabilityVal === 'alta'
          ? reliabilityVal
          : null,
      impactRationale:
        typeof card['impactRationale'] === 'string' ? card['impactRationale'] : '',
      reliabilityRationale:
        typeof card['reliabilityRationale'] === 'string' ? card['reliabilityRationale'] : '',
      maturityUpdate: {
        levelBefore: typeof mat['levelBefore'] === 'string' ? mat['levelBefore'] : '',
        levelAfter: typeof mat['levelAfter'] === 'string' ? mat['levelAfter'] : '',
        evidenceJustification:
          typeof mat['evidenceJustification'] === 'string'
            ? mat['evidenceJustification']
            : ''
      },
      recommendation: {
        verdict:
          rec['verdict'] === 'adotar' ||
          rec['verdict'] === 'testar_mais' ||
          rec['verdict'] === 'descartar'
            ? rec['verdict']
            : null,
        adjustments: typeof rec['adjustments'] === 'string' ? rec['adjustments'] : '',
        externalDeps: typeof rec['externalDeps'] === 'string' ? rec['externalDeps'] : ''
      }
    } satisfies CapabilityCard;
  });
}

function emptyCapabilityCard(
  id: string,
  assessmentId: string,
  teamId: string,
  context: CapabilityCard['context']
): CapabilityCard {
  const now = new Date().toISOString();
  return {
    id,
    assessmentId,
    teamId,
    createdAt: now,
    updatedAt: now,
    context,
    asIs: {
      flowDescription: '',
      stepCount: '',
      toolIds: [],
      toolsUsedOther: '',
      avgTime: '',
      frequency: '',
      mainPains: ''
    },
    flowMap: [{ step: 1, description: '', responsible: '', duration: '', problem: '' }],
    aiHypothesis: {
      impactedStages: '',
      usageTypes: [],
      inputNeeded: '',
      expectedOutput: ''
    },
    toBeFlow: [{ step: 1, descriptionWithAi: '', change: '', risk: '' }],
    risksControls: {
      hallucinationRisk: '',
      securityRisk: '',
      qualityRisk: '',
      humanValidationNeed: ''
    },
    experiment: {
      executedBy: '',
      iterations: '',
      realOrSimulated: '',
      variationsTested: ''
    },
    evidenceQuantitative: {
      timeBefore: '',
      timeAfter: '',
      reductionPercent: '',
      reworkCount: '',
      bugs: ''
    },
    evidenceQualitative: {
      teamConfidence: '',
      easeOfUse: '',
      outputClarity: ''
    },
    impact: null,
    reliability: null,
    impactRationale: '',
    reliabilityRationale: '',
    maturityUpdate: {
      levelBefore: '',
      levelAfter: '',
      evidenceJustification: ''
    },
    recommendation: {
      verdict: null,
      adjustments: '',
      externalDeps: ''
    }
  };
}

function normalizeAssessments(assessments: Assessment[]): Assessment[] {
  const usedIds = new Set<string>();

  return assessments.map((assessment) => {
    const normalizedId =
      assessment.id && !usedIds.has(assessment.id)
        ? assessment.id
        : createId('assessment');

    usedIds.add(normalizedId);

    return {
      ...assessment,
      id: normalizedId,
      responses: Object.fromEntries(
        Object.entries(assessment.responses ?? {}).map(([questionCode, response]) => [
          questionCode,
          {
            score: response?.score ?? null,
            practiceDetails:
              typeof response?.practiceDetails === 'string' ? response.practiceDetails : '',
            evidence: response?.evidence ?? '',
            toolIds: Array.from(new Set(response?.toolIds ?? []))
          }
        ])
      )
    };
  });
}

@Injectable({ providedIn: 'root' })
export class AiMaturityRepository {
  private readonly state = signal<PersistedState>(this.readState());

  readonly teams = computed(() => this.state().teams);
  readonly tools = computed(() => this.state().tools);
  readonly assessments = computed(() => this.state().assessments);
  readonly selectedTeamId = computed(() => this.state().selectedTeamId);
  readonly capabilityCards = computed(() => this.state().capabilityCards ?? []);

  selectTeam(teamId: string | null): void {
    this.patchState({ selectedTeamId: teamId });
  }

  upsertTeam(input: Pick<Team, 'name' | 'sector' | 'description'>, teamId?: string): Team {
    const now = new Date().toISOString();
    const existing = teamId
      ? this.state().teams.find((team) => team.id === teamId) ?? null
      : null;
    const team: Team = existing
      ? { ...existing, ...input, updatedAt: now }
      : {
          id: createId('team'),
          ...input,
          createdAt: now,
          updatedAt: now
        };

    const teams = existing
      ? this.state().teams.map((currentTeam) =>
          currentTeam.id === team.id ? team : currentTeam
        )
      : [...this.state().teams, team];

    this.patchState({
      teams,
      selectedTeamId: this.state().selectedTeamId ?? team.id
    });

    return team;
  }

  deleteTeam(teamId: string): void {
    const teams = this.state().teams.filter((team) => team.id !== teamId);
    const assessments = this.state().assessments.filter(
      (assessment) => assessment.teamId !== teamId
    );
    const capabilityCards = (this.state().capabilityCards ?? []).filter(
      (card) => card.teamId !== teamId
    );
    const selectedTeamId =
      this.state().selectedTeamId === teamId ? teams[0]?.id ?? null : this.state().selectedTeamId;

    this.patchState({ teams, assessments, capabilityCards, selectedTeamId });
  }

  upsertTool(
    input: Pick<Tool, 'name' | 'vendor' | 'category' | 'status' | 'description'>,
    toolId?: string
  ): Tool {
    const now = new Date().toISOString();
    const existing = toolId
      ? this.state().tools.find((tool) => tool.id === toolId) ?? null
      : null;
    const tool: Tool = existing
      ? { ...existing, ...input, updatedAt: now }
      : {
          id: createId('tool'),
          ...input,
          createdAt: now,
          updatedAt: now
        };

    const tools = existing
      ? this.state().tools.map((currentTool) =>
          currentTool.id === tool.id ? tool : currentTool
        )
      : [...this.state().tools, tool];

    this.patchState({ tools });

    return tool;
  }

  deleteTool(toolId: string): void {
    const tools = this.state().tools.filter((tool) => tool.id !== toolId);
    const assessments = this.state().assessments.map((assessment) => ({
      ...assessment,
      responses: Object.fromEntries(
        Object.entries(assessment.responses).map(([questionCode, response]) => [
          questionCode,
          {
            ...response,
            toolIds: response.toolIds.filter((currentToolId) => currentToolId !== toolId)
          }
        ])
      )
    }));

    this.patchState({ tools, assessments });
  }

  saveAssessment(input: Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Assessment {
    const now = new Date().toISOString();
    const current = input.id
      ? this.state().assessments.find((assessment) => assessment.id === input.id) ?? null
      : null;
    const assessment: Assessment = current
      ? { ...current, ...input, updatedAt: now }
      : {
          id: createId('assessment'),
          createdAt: now,
          updatedAt: now,
          ...input
        };

    const assessments = current
      ? this.state().assessments.map((item) =>
          item.id === assessment.id ? assessment : item
        )
      : [...this.state().assessments, assessment];

    this.patchState({ assessments });

    return assessment;
  }

  deleteAssessment(assessmentId: string): void {
    const assessments = this.state().assessments.filter(
      (assessment) => assessment.id !== assessmentId
    );
    const capabilityCards = (this.state().capabilityCards ?? []).filter(
      (card) => card.assessmentId !== assessmentId
    );

    this.patchState({ assessments, capabilityCards });
  }

  createCapabilityCardSkeleton(params: {
    assessmentId: string;
    teamId: string;
    squad: string;
    dimensionCode: string;
    questionCode: string;
  }): CapabilityCard {
    return emptyCapabilityCard(createId('capcard'), params.assessmentId, params.teamId, {
      squad: params.squad,
      storyAnalyzed: '',
      dimensionCode: params.dimensionCode,
      questionCode: params.questionCode
    });
  }

  saveCapabilityCard(card: CapabilityCard): CapabilityCard {
    const now = new Date().toISOString();
    const list = [...(this.state().capabilityCards ?? [])];
    const idx = list.findIndex((c) => c.id === card.id);
    const createdAt =
      idx >= 0 ? list[idx].createdAt : card.createdAt || now;
    const next: CapabilityCard = {
      ...card,
      createdAt,
      updatedAt: now
    };

    if (idx >= 0) {
      list[idx] = next;
    } else {
      list.push(next);
    }

    this.patchState({ capabilityCards: list });
    return next;
  }

  deleteCapabilityCard(cardId: string): void {
    const capabilityCards = (this.state().capabilityCards ?? []).filter(
      (card) => card.id !== cardId
    );
    this.patchState({ capabilityCards });
  }

  getAssessmentsForTeam(teamId: string): Assessment[] {
    return this.state()
      .assessments.filter((assessment) => assessment.teamId === teamId)
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  }

  exportState(): PersistedState {
    return this.state();
  }

  importState(rawState: unknown): void {
    if (!isRecord(rawState)) {
      throw new Error('Invalid backup format');
    }

    const normalizedState = this.normalizeState(rawState as Partial<PersistedState>);
    this.state.set(normalizedState);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedState));
    }
  }

  private readState(): PersistedState {
    if (typeof localStorage === 'undefined') {
      return createDefaultState();
    }

    const rawState = localStorage.getItem(STORAGE_KEY);
    if (!rawState) {
      return createDefaultState();
    }

    try {
      const parsedState = JSON.parse(rawState) as Partial<PersistedState>;
      const normalizedState = this.normalizeState(parsedState);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedState));

      return normalizedState;
    } catch {
      return createDefaultState();
    }
  }

  private patchState(partial: Partial<PersistedState>): void {
    const nextState = { ...this.state(), ...partial };
    this.state.set(nextState);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    }
  }

  private normalizeState(parsedState: Partial<PersistedState>): PersistedState {
    const teams = parsedState.teams ?? [];
    const selectedTeamId = teams.some((team) => team.id === parsedState.selectedTeamId)
      ? (parsedState.selectedTeamId ?? null)
      : (teams[0]?.id ?? null);
    const tools = normalizeTools(parsedState.tools ?? []);
    const assessments = normalizeAssessments(parsedState.assessments ?? []);
    const teamIds = new Set(teams.map((t) => t.id));
    const assessmentIds = new Set(assessments.map((a) => a.id));
    const capabilityCards = normalizeCapabilityCards(parsedState.capabilityCards).filter(
      (card) => teamIds.has(card.teamId) && assessmentIds.has(card.assessmentId)
    );

    return {
      ...createDefaultState(),
      ...parsedState,
      version: 'v2',
      selectedTeamId,
      teams,
      tools,
      assessments,
      capabilityCards
    };
  }
}
