import { describe, expect, it } from 'vitest';

import { FrameworkCatalogService } from '../framework/framework-catalog.service';
import type { Assessment } from '../models/ai-maturity.models';
import { AssessmentScoringService } from './assessment-scoring.service';

function createAssessment(scoreByQuestion: Record<string, number>): Assessment {
  return {
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
      Array.from({ length: 44 }, (_, index) => {
        const code = `Q${index + 1}`;
        return [
          code,
          {
            score: scoreByQuestion[code] ?? 0,
            evidence: scoreByQuestion[code] >= 3 ? 'Evidencia' : '',
            toolIds: []
          }
        ];
      })
    )
  };
}

describe('AssessmentScoringService', () => {
  const catalog = new FrameworkCatalogService().getCatalog();
  const service = new AssessmentScoringService();

  it('calculates weighted score and advanced level when thresholds are met', () => {
    const assessment = createAssessment(
      Object.fromEntries(Array.from({ length: 44 }, (_, index) => [`Q${index + 1}`, 4]))
    );

    const result = service.calculateResult(catalog, assessment);

    expect(result.overallScore).toBe(4);
    expect(result.level.level).toBe('N5');
    expect(result.gatingReasons).toHaveLength(0);
  });

  it('caps the final level at N2 when D4 is below 2.0', () => {
    const allMax = Object.fromEntries(
      Array.from({ length: 44 }, (_, index) => [`Q${index + 1}`, 4])
    );

    const assessment = createAssessment({
      ...allMax,
      Q21: 0,
      Q22: 0,
      Q23: 1,
      Q24: 0,
      Q25: 0,
      Q26: 1
    });

    const result = service.calculateResult(catalog, assessment);

    expect(result.rawLevel.level).toBe('N4');
    expect(result.level.level).toBe('N2');
    expect(result.structuralRisks).toEqual(['Q21', 'Q22', 'Q24', 'Q25']);
  });
});
