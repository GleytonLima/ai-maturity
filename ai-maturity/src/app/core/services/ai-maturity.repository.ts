import { computed, Injectable, signal } from '@angular/core';

import type {
  Assessment,
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

function createDefaultState(): PersistedState {
  return {
    version: 'v2',
    selectedTeamId: null,
    teams: [],
    tools: [],
    assessments: []
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
    const selectedTeamId =
      this.state().selectedTeamId === teamId ? teams[0]?.id ?? null : this.state().selectedTeamId;

    this.patchState({ teams, assessments, selectedTeamId });
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

    this.patchState({ assessments });
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

    return {
      ...createDefaultState(),
      ...parsedState,
      version: 'v2',
      selectedTeamId,
      teams,
      tools: normalizeTools(parsedState.tools ?? []),
      assessments: normalizeAssessments(parsedState.assessments ?? [])
    };
  }
}
