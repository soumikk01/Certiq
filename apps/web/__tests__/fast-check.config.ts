import fc from "fast-check";

/**
 * Shared property-based testing parameters.
 *
 * Set the FAST_CHECK_SEED env var to replay a specific failing seed:
 *   FAST_CHECK_SEED=12345 pnpm test
 */
const seedValue = process.env.FAST_CHECK_SEED
  ? Number(process.env.FAST_CHECK_SEED)
  : Date.now();

export const pbtParams: fc.Parameters<unknown> = {
  numRuns: 200,
  seed: seedValue,
};

/**
 * Wrapper around `fc.assert` that logs the seed on failure for easy replay.
 */
export async function pbtAssert<T>(
  property: fc.IAsyncProperty<T> | fc.IProperty<T>,
  params?: fc.Parameters<T>,
): Promise<void> {
  const mergedParams = { ...pbtParams, ...params } as fc.Parameters<T>;

  try {
    await fc.assert(property, mergedParams);
  } catch (error) {
    if (error instanceof Error) {
      const seedMatch = error.message.match(/seed:\s*(\d+)/i);
      const seed = seedMatch?.[1] ?? mergedParams.seed ?? "unknown";
      console.error(
        `\n[fast-check] Property failed! Replay with:\n  FAST_CHECK_SEED=${seed} pnpm test\n`,
      );
    }
    throw error;
  }
}
