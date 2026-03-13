import { Injectable } from '@angular/core';

import { FRAMEWORK_CATALOG } from './generated/framework-catalog.data';
import type { FrameworkCatalog } from '../models/ai-maturity.models';

@Injectable({ providedIn: 'root' })
export class FrameworkCatalogService {
  getCatalog(): FrameworkCatalog {
    return FRAMEWORK_CATALOG;
  }
}
