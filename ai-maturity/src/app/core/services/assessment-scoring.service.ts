import { Injectable } from '@angular/core';

import type {
  Assessment,
  AssessmentResult,
  FrameworkCatalog,
  LevelCode,
  LevelThreshold
} from '../models/ai-maturity.models';

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function roundScore(value: number): number {
  return Math.round(value * 100) / 100;
}

function levelOrder(level: LevelCode): number {
  return ['N1', 'N2', 'N3', 'N4', 'N5'].indexOf(level);
}

@Injectable({ providedIn: 'root' })
export class AssessmentScoringService {
  calculateResult(catalog: FrameworkCatalog, assessment: Assessment): AssessmentResult {
    const dimensionScores = catalog.dimensions.map((dimension) => {
      const capabilities = dimension.capacities.map((capacity) => {
        const questionScores = capacity.questions.map((question) => {
          const response = assessment.responses[question.code];
          return response?.score ?? 0;
        });

        return {
          code: capacity.code,
          title: capacity.title,
          value: roundScore(average(questionScores))
        };
      });

      const dimensionValue = roundScore(
        average(capabilities.map((capability) => capability.value))
      );

      return {
        code: dimension.code,
        title: dimension.title,
        weight: dimension.weight,
        value: dimensionValue,
        level: this.resolveLevel(catalog.manifest.levelThresholds, dimensionValue),
        capabilities
      };
    });

    const totalWeight = dimensionScores.reduce(
      (sum, dimension) => sum + dimension.weight,
      0
    );
    const weightedScore =
      dimensionScores.reduce(
        (sum, dimension) => sum + dimension.value * dimension.weight,
        0
      ) / totalWeight;
    const overallScore = roundScore(weightedScore);
    const rawLevel = this.resolveLevel(catalog.manifest.levelThresholds, overallScore);
    const dimensionMap = Object.fromEntries(
      dimensionScores.map((dimension) => [dimension.code, dimension.value])
    );

    const gatingReasons: string[] = [];
    let finalLevelCode = rawLevel.level;

    for (const rule of catalog.manifest.gating.maxLevelIfBelow) {
      const value = dimensionMap[rule.dimensionCode];
      if (value < rule.threshold && levelOrder(finalLevelCode) > levelOrder(rule.level)) {
        finalLevelCode = rule.level;
        gatingReasons.push(rule.reason);
      }
    }

    const blocksAdvancedLevel =
      levelOrder(rawLevel.level) >= levelOrder('N4') &&
      catalog.manifest.gating.requiredForAdvancedLevels.some(
        (rule) => dimensionMap[rule.dimensionCode] < rule.threshold
      );

    if (blocksAdvancedLevel && levelOrder(finalLevelCode) > levelOrder('N3')) {
      finalLevelCode = 'N3';
      gatingReasons.push(
        'Niveis N4 e N5 exigem D3 >= 3.0, D4 >= 3.0 e D7 >= 2.5.'
      );
    }

    const structuralRisks = catalog.manifest.alerts.structuralRisk.filter(
      (questionCode) => assessment.responses[questionCode]?.score === 0
    );
    const qualityRisks = catalog.manifest.alerts.qualityRisk.filter(
      (questionCode) => assessment.responses[questionCode]?.score === 0
    );

    return {
      level: this.resolveLevel(catalog.manifest.levelThresholds, overallScore, finalLevelCode),
      rawLevel,
      overallScore,
      dimensionScores,
      structuralRisks,
      qualityRisks,
      gatingReasons
    };
  }

  private resolveLevel(
    thresholds: LevelThreshold[],
    score: number,
    forcedLevel?: LevelCode
  ): LevelThreshold {
    if (forcedLevel) {
      const exactMatch = thresholds.find((threshold) => threshold.level === forcedLevel);
      if (exactMatch) {
        return exactMatch;
      }
    }

    return (
      thresholds.find((threshold) => score >= threshold.min && score <= threshold.max) ??
      thresholds[thresholds.length - 1]
    );
  }
}
