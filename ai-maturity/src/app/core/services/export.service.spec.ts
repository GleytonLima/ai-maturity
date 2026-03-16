import { describe, expect, it } from 'vitest';

import type { PersistedState } from '../models/ai-maturity.models';
import { ExportService } from './export.service';

describe('ExportService', () => {
  const exportService = new ExportService();

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
});
