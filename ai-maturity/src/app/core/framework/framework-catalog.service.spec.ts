import { describe, expect, it } from 'vitest';

import { FrameworkCatalogService } from './framework-catalog.service';

describe('FrameworkCatalogService', () => {
  it('returns the v1 catalog with 7 dimensions and 44 questions', () => {
    const service = new FrameworkCatalogService();
    const catalog = service.getCatalog();
    const questionCount = catalog.dimensions.reduce(
      (sum, dimension) =>
        sum +
        dimension.capacities.reduce(
          (capacitySum, capacity) => capacitySum + capacity.questions.length,
          0
        ),
      0
    );

    expect(catalog.version).toBe('v1');
    expect(catalog.dimensions).toHaveLength(7);
    expect(questionCount).toBe(44);
  });
});
