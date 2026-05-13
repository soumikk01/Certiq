import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Runs axe-core accessibility analysis on the given page, targeting
 * WCAG 2.0 A/AA and WCAG 2.1 A/AA rule sets.
 *
 * Returns only violations with "serious" or "critical" impact.
 */
export async function runAxe(
  page: Page,
  options?: { disableRules?: string[] },
) {
  let builder = new AxeBuilder({ page }).withTags([
    'wcag2a',
    'wcag2aa',
    'wcag21a',
    'wcag21aa',
  ]);

  if (options?.disableRules?.length) {
    builder = builder.disableRules(options.disableRules);
  }

  const results = await builder.analyze();

  const violations = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  );

  return violations;
}

/**
 * Asserts that the page has no serious or critical accessibility violations.
 * If violations are found, the assertion message lists the offending rule IDs.
 */
export async function expectNoSeriousA11yViolations(page: Page) {
  const violations = await runAxe(page);

  const violationIds = violations.map((v) => v.id).join(', ');
  const message = violations.length
    ? `Expected no serious/critical a11y violations but found ${violations.length}: [${violationIds}]`
    : '';

  expect(violations, message).toHaveLength(0);
}
