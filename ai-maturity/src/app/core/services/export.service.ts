import { Injectable } from '@angular/core';

import type {
  AssessmentViewModel,
  PersistedState,
  Team
} from '../models/ai-maturity.models';

@Injectable({ providedIn: 'root' })
export class ExportService {
  buildJsonBackup(state: PersistedState): string {
    return JSON.stringify(state, null, 2);
  }

  buildCsvRows(teams: Team[], assessments: AssessmentViewModel[]): string {
    const header = [
      'team',
      'assessment_id',
      'status',
      'date',
      'dimension',
      'capability',
      'score',
      'overall_score',
      'level',
      'structural_risk',
      'quality_risk'
    ];

    const rows = assessments.flatMap(({ assessment, result }) => {
      const teamName = teams.find((team) => team.id === assessment.teamId)?.name ?? 'Time removido';

      return result.dimensionScores.flatMap((dimension) =>
        dimension.capabilities.map((capability) =>
          [
            teamName,
            assessment.id,
            assessment.status,
            assessment.finalizedAt ?? assessment.updatedAt,
            dimension.title,
            capability.title,
            capability.value.toFixed(2),
            result.overallScore.toFixed(2),
            result.level.label,
            result.structuralRisks.join('|'),
            result.qualityRisks.join('|')
          ].map((value) => this.escapeCsv(value)).join(',')
        )
      );
    });

    return [header.join(','), ...rows].join('\n');
  }

  downloadFile(filename: string, contents: string, contentType: string): void {
    if (typeof document === 'undefined' || typeof URL === 'undefined') {
      return;
    }

    const blob = new Blob([contents], { type: contentType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private escapeCsv(value: string): string {
    const serialized = String(value ?? '');
    if (serialized.includes(',') || serialized.includes('"') || serialized.includes('\n')) {
      return `"${serialized.replaceAll('"', '""')}"`;
    }

    return serialized;
  }
}
