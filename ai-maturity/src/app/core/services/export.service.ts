import { Injectable } from '@angular/core';

import type { PersistedState } from '../models/ai-maturity.models';

@Injectable({ providedIn: 'root' })
export class ExportService {
  buildJsonBackup(state: PersistedState): string {
    return JSON.stringify(state, null, 2);
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
}
