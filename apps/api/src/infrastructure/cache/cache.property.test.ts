import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { CACHE_KEYS, CACHE_TTL } from './cache.service.js';

/**
 * Property-based tests for cache degradation contract.
 *
 * These tests verify the cache key and TTL contracts that ensure
 * graceful degradation when Redis is unavailable — the system can
 * still function correctly from MongoDB/R2 because cache keys are
 * deterministic and TTL values are properly configured.
 *
 * **Validates: Requirements 5.6**
 */
describe('Cache degradation properties', () => {
  it('CACHE_KEYS produce unique keys for different inputs', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), fc.string({ minLength: 1 }), (a, b) => {
        if (a !== b) {
          expect(CACHE_KEYS.certificate(a)).not.toBe(CACHE_KEYS.certificate(b));
          expect(CACHE_KEYS.certificateList(a)).not.toBe(CACHE_KEYS.certificateList(b));
        }
      }),
    );
  });

  it('CACHE_KEYS are deterministic', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (input) => {
        expect(CACHE_KEYS.certificate(input)).toBe(CACHE_KEYS.certificate(input));
        expect(CACHE_KEYS.certificateList(input)).toBe(CACHE_KEYS.certificateList(input));
        expect(CACHE_KEYS.presignedUrl(input)).toBe(CACHE_KEYS.presignedUrl(input));
      }),
    );
  });

  it('all TTL values are positive integers', () => {
    Object.values(CACHE_TTL).forEach(ttl => {
      expect(ttl).toBeGreaterThan(0);
      expect(Number.isInteger(ttl)).toBe(true);
    });
  });

  it('presigned URL cache TTL is less than actual URL expiry (3600s)', () => {
    expect(CACHE_TTL.presignedUrl).toBeLessThan(3600);
  });
});
