import { beforeEach, describe, expect, it } from 'vitest';

import { AiMaturityRepository } from './ai-maturity.repository';

describe('AiMaturityRepository', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('normalizes duplicate assessment ids loaded from localStorage', () => {
    localStorage.setItem(
      'aimaturity.v1',
      JSON.stringify({
        version: 'v1',
        selectedTeamId: 'team-1',
        teams: [],
        tools: [],
        assessments: [
          {
            id: 'assessment-1',
            teamId: 'team-1',
            frameworkVersion: 'v1',
            assessor: 'João',
            summary: 'Primeiro',
            status: 'draft',
            createdAt: '2026-03-13T00:00:00.000Z',
            updatedAt: '2026-03-13T00:00:00.000Z',
            finalizedAt: null,
            responses: {}
          },
          {
            id: 'assessment-1',
            teamId: 'team-1',
            frameworkVersion: 'v1',
            assessor: 'Maria',
            summary: 'Segundo',
            status: 'draft',
            createdAt: '2026-03-13T00:00:00.000Z',
            updatedAt: '2026-03-13T00:00:00.000Z',
            finalizedAt: null,
            responses: {}
          }
        ]
      })
    );

    const repository = new AiMaturityRepository();
    const ids = repository.assessments().map((assessment) => assessment.id);

    expect(new Set(ids).size).toBe(2);
  });

  it('deletes only the selected assessment after normalization', () => {
    localStorage.setItem(
      'aimaturity.v1',
      JSON.stringify({
        version: 'v1',
        selectedTeamId: 'team-1',
        teams: [],
        tools: [],
        assessments: [
          {
            id: 'assessment-1',
            teamId: 'team-1',
            frameworkVersion: 'v1',
            assessor: 'João',
            summary: 'Primeiro',
            status: 'draft',
            createdAt: '2026-03-13T00:00:00.000Z',
            updatedAt: '2026-03-13T00:00:00.000Z',
            finalizedAt: null,
            responses: {}
          },
          {
            id: 'assessment-1',
            teamId: 'team-1',
            frameworkVersion: 'v1',
            assessor: 'Maria',
            summary: 'Segundo',
            status: 'draft',
            createdAt: '2026-03-13T00:00:00.000Z',
            updatedAt: '2026-03-13T00:00:00.000Z',
            finalizedAt: null,
            responses: {}
          }
        ]
      })
    );

    const repository = new AiMaturityRepository();
    const [firstAssessment] = repository.assessments();

    repository.deleteAssessment(firstAssessment.id);

    expect(repository.assessments()).toHaveLength(1);
  });

  it('removes tool references from assessments when deleting a tool', () => {
    localStorage.setItem(
      'aimaturity.v1',
      JSON.stringify({
        version: 'v2',
        selectedTeamId: 'team-1',
        teams: [],
        tools: [
          {
            id: 'tool-1',
            name: 'ChatGPT',
            vendor: 'OpenAI',
            category: 'Assistente',
            status: 'approved',
            description: '',
            createdAt: '2026-03-13T00:00:00.000Z',
            updatedAt: '2026-03-13T00:00:00.000Z'
          }
        ],
        assessments: [
          {
            id: 'assessment-1',
            teamId: 'team-1',
            frameworkVersion: 'v1',
            assessor: 'João',
            summary: 'Primeiro',
            status: 'draft',
            createdAt: '2026-03-13T00:00:00.000Z',
            updatedAt: '2026-03-13T00:00:00.000Z',
            finalizedAt: null,
            responses: {
              Q1: {
                score: 2,
                practiceDetails: '',
                evidence: '',
                toolIds: ['tool-1']
              }
            }
          }
        ]
      })
    );

    const repository = new AiMaturityRepository();

    repository.deleteTool('tool-1');

    expect(repository.tools()).toHaveLength(0);
    expect(repository.assessments()[0].responses['Q1'].toolIds).toEqual([]);
  });

  it('removes capability cards when deleting an assessment', () => {
    localStorage.setItem(
      'aimaturity.v1',
      JSON.stringify({
        version: 'v2',
        selectedTeamId: 'team-1',
        teams: [
          {
            id: 'team-1',
            name: 'Squad A',
            sector: '',
            description: '',
            createdAt: '2026-03-13T00:00:00.000Z',
            updatedAt: '2026-03-13T00:00:00.000Z'
          }
        ],
        tools: [],
        assessments: [
          {
            id: 'assessment-1',
            teamId: 'team-1',
            frameworkVersion: 'v1',
            assessor: '',
            summary: '',
            status: 'finalized',
            createdAt: '2026-03-13T00:00:00.000Z',
            updatedAt: '2026-03-13T00:00:00.000Z',
            finalizedAt: '2026-03-13T00:00:00.000Z',
            responses: {}
          }
        ],
        capabilityCards: [
          {
            id: 'cap-1',
            assessmentId: 'assessment-1',
            teamId: 'team-1'
          }
        ]
      })
    );

    const repository = new AiMaturityRepository();

    expect(repository.capabilityCards()).toHaveLength(1);

    repository.deleteAssessment('assessment-1');

    expect(repository.assessments()).toHaveLength(0);
    expect(repository.capabilityCards()).toHaveLength(0);
  });

  it('imports a backup state and normalizes selected team', () => {
    const repository = new AiMaturityRepository();

    repository.importState({
      version: 'v2',
      selectedTeamId: 'missing-team',
      teams: [
        {
          id: 'team-10',
          name: 'Time Importado',
          sector: 'Engenharia',
          description: '',
          createdAt: '2026-03-13T00:00:00.000Z',
          updatedAt: '2026-03-13T00:00:00.000Z'
        }
      ],
      tools: [],
      assessments: []
    });

    expect(repository.teams()).toHaveLength(1);
    expect(repository.selectedTeamId()).toBe('team-10');
  });
});
