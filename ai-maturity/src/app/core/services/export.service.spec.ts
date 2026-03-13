import { describe, expect, it } from 'vitest';

import { FrameworkCatalogService } from '../framework/framework-catalog.service';
import type { Assessment, PersistedState, Team } from '../models/ai-maturity.models';
import { AssessmentScoringService } from './assessment-scoring.service';
import { ExportService } from './export.service';

describe('ExportService', () => {
  const exportService = new ExportService();
  const catalog = new FrameworkCatalogService().getCatalog();
  const scoringService = new AssessmentScoringService();

  it('serializes state to JSON', () => {
    const state: PersistedState = {
      version: 'v2',
      selectedTeamId: 'team-1',
      teams: [],
      tools: [],
      assessments: []
    };

    expect(exportService.buildJsonBackup(state)).toContain('"version": "v2"');
  });

  it('builds CSV rows for finalized assessments', () => {
    const team: Team = {
      id: 'team-1',
      name: 'Plataforma',
      sector: 'Engenharia',
      description: '',
      createdAt: '2026-03-12T00:00:00.000Z',
      updatedAt: '2026-03-12T00:00:00.000Z'
    };
    const assessment: Assessment = {
      id: 'assessment-1',
      teamId: 'team-1',
      frameworkVersion: 'v1',
      assessor: 'Tester',
      summary: '',
      status: 'finalized',
      createdAt: '2026-03-12T00:00:00.000Z',
      updatedAt: '2026-03-12T00:00:00.000Z',
      finalizedAt: '2026-03-12T00:00:00.000Z',
      responses: Object.fromEntries(
        Array.from({ length: 42 }, (_, index) => [
          `Q${index + 1}`,
          { score: 3, evidence: 'Evidencia', toolIds: [] }
        ])
      )
    };

    const csv = exportService.buildCsvRows([{ ...team }], [
      {
        assessment,
        result: scoringService.calculateResult(catalog, assessment)
      }
    ]);

    expect(csv).toContain('team,assessment_id,status,date,dimension,capability');
    expect(csv).toContain('Plataforma');
    expect(csv.split('\n').length).toBeGreaterThan(2);
  });
});
