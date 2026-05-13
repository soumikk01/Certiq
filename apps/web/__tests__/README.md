# Property-Based Tests

This directory contains property-based tests (PBT) using [fast-check](https://github.com/dubzzz/fast-check).

## Replaying a Failing Seed

When a property test fails, fast-check reports the seed that produced the counterexample. To replay the exact same run:

```bash
FAST_CHECK_SEED=<n> pnpm test
```

For example, if the failure log shows `seed: 42`:

```bash
FAST_CHECK_SEED=42 pnpm test
```

This sets a deterministic seed so the same random inputs are generated, making failures reproducible.

## Configuration

Shared PBT parameters live in `fast-check.config.ts`:

- **numRuns**: 200 iterations per property (default).
- **seed**: Controlled via the `FAST_CHECK_SEED` environment variable for reproducibility.

Use `pbtAssert` from `fast-check.config.ts` instead of calling `fc.assert` directly — it automatically logs the failing seed on error.

## Regressions

The `__fixtures__/regressions/` folder is reserved for storing regression test data (counterexamples that should always be re-checked).
