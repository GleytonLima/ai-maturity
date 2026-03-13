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
      Array.from({ length: 42 }, (_, index) => {
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
      Object.fromEntries(Array.from({ length: 42 }, (_, index) => [`Q${index + 1}`, 4]))
    );

    const result = service.calculateResult(catalog, assessment);

    expect(result.overallScore).toBe(4);
    expect(result.level.level).toBe('N5');
    expect(result.gatingReasons).toHaveLength(0);
  });

  it('caps the final level at N2 when D4 is below 2.0', () => {
    const assessment = createAssessment({
      Q19: 0,
      Q20: 0,
      Q21: 1,
      Q22: 0,
      Q23: 0,
      Q24: 1,
      Q1: 4,
      Q2: 4,
      Q3: 4,
      Q4: 4,
      Q5: 4,
      Q6: 4,
      Q7: 4,
      Q8: 4,
      Q9: 4,
      Q10: 4,
      Q11: 4,
      Q12: 4,
      Q13: 4,
      Q14: 4,
      Q15: 4,
      Q16: 4,
      Q17: 4,
      Q18: 4,
      Q25: 4,
      Q26: 4,
      Q27: 4,
      Q28: 4,
      Q29: 4,
      Q30: 4,
      Q31: 4,
      Q32: 4,
      Q33: 4,
      Q34: 4,
      Q35: 4,
      Q36: 4,
      Q37: 4,
      Q38: 4,
      Q39: 4,
      Q40: 4,
      Q41: 4,
      Q42: 4
    });

    const result = service.calculateResult(catalog, assessment);

    expect(result.rawLevel.level).toBe('N4');
    expect(result.level.level).toBe('N2');
    expect(result.structuralRisks).toEqual(['Q19', 'Q20', 'Q22', 'Q23']);
  });
});
