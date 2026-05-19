import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { BadRequestException } from '@nestjs/common';

import { validateFile, getExtensionFromMime } from '../storage/file-validator.js';
import { generateObjectKey } from '../storage/storage.service.js';
import { CACHE_KEYS, CACHE_TTL } from '../cache/cache.service.js';

/**
 * Property-based tests for certificates module.
 *
 * These tests verify pure function contracts for object key generation,
 * ownership isolation via cache keys, cache TTL correctness, and file
 * validation without requiring external services.
 *
 * **Validates: Requirements 5.1–5.5, 6.1–6.8**
 */

// --- Generators ---

/** Generates valid MongoDB-style ObjectId strings (24 hex chars) */
const userIdArb = fc.hexaString({ minLength: 24, maxLength: 24 });

/** Generates valid file extensions from the allowed set */
const validExtensionArb = fc.constantFrom('png', 'jpg', 'webp', 'pdf');

/** Generates valid MIME types from the allowed set */
const validMimeTypeArb = fc.constantFrom(
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/pdf',
);

/** Generates invalid MIME types that are not in the allowed set */
const invalidMimeTypeArb = fc.constantFrom(
  'text/plain',
  'text/html',
  'application/json',
  'application/xml',
  'image/gif',
  'image/bmp',
  'image/svg+xml',
  'video/mp4',
  'audio/mpeg',
);

/** Magic bytes for each allowed MIME type */
const MAGIC_BYTES_MAP: Record<string, number[]> = {
  'image/png': [0x89, 0x50, 0x4e, 0x47],
  'image/jpeg': [0xff, 0xd8, 0xff],
  'image/webp': [0x52, 0x49, 0x46, 0x46],
  'application/pdf': [0x25, 0x50, 0x44, 0x46],
};

/** Generates a valid file with correct magic bytes for a given MIME type */
function createValidFile(mimetype: string, size: number = 1024): Express.Multer.File {
  const magicBytes = MAGIC_BYTES_MAP[mimetype] ?? [0x00];
  const padding = Buffer.alloc(Math.max(0, size - magicBytes.length));
  const buffer = Buffer.concat([Buffer.from(magicBytes), padding]);

  return {
    fieldname: 'file',
    originalname: 'test-file',
    encoding: '7bit',
    mimetype,
    size: buffer.length,
    buffer,
    destination: '',
    filename: '',
    path: '',
    stream: null as any,
  };
}

/** Generates random bytes that do NOT match any valid magic byte signature */
const invalidMagicBytesArb = fc
  .uint8Array({ minLength: 8, maxLength: 64 })
  .filter((bytes) => {
    // Ensure the bytes don't accidentally match any valid magic signature
    const buf = Buffer.from(bytes);
    const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
    const jpegMagic = Buffer.from([0xff, 0xd8, 0xff]);
    const webpMagic = Buffer.from([0x52, 0x49, 0x46, 0x46]);
    const pdfMagic = Buffer.from([0x25, 0x50, 0x44, 0x46]);

    return (
      !buf.subarray(0, 4).equals(pngMagic) &&
      !buf.subarray(0, 3).equals(jpegMagic) &&
      !buf.subarray(0, 4).equals(webpMagic) &&
      !buf.subarray(0, 4).equals(pdfMagic)
    );
  });

// UUID v4 pattern: 8-4-4-4-12 hex chars
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

// --- Tests ---

describe('Certificate Property Tests', () => {
  describe('Property 6: Object key generation', () => {
    /**
     * **Validates: Requirements 6.1**
     *
     * generateObjectKey always produces keys matching the pattern
     * `certificates/{userId}/{uuid}.{ext}` for any valid userId and extension.
     */
    it('generated keys always match certificates/{userId}/{uuid}.{ext} pattern', () => {
      fc.assert(
        fc.property(userIdArb, validExtensionArb, (userId, ext) => {
          const key = generateObjectKey(userId, ext);

          // Must start with certificates/
          expect(key.startsWith('certificates/')).toBe(true);

          // Parse the key structure
          const parts = key.split('/');
          expect(parts).toHaveLength(3);
          expect(parts[0]).toBe('certificates');
          expect(parts[1]).toBe(userId);

          // Filename must be {uuid}.{ext}
          const filename = parts[2]!;
          const dotIndex = filename.lastIndexOf('.');
          expect(dotIndex).toBeGreaterThan(0);

          const uuidPart = filename.substring(0, dotIndex);
          const extPart = filename.substring(dotIndex + 1);

          // UUID must be valid v4 format
          expect(uuidPart).toMatch(UUID_PATTERN);
          // Extension must match input
          expect(extPart).toBe(ext);
        }),
        { numRuns: 200 },
      );
    });

    it('generated keys never contain user-provided filenames', () => {
      fc.assert(
        fc.property(
          userIdArb,
          validExtensionArb,
          fc.string({ minLength: 1, maxLength: 50 }),
          (userId, ext, userFilename) => {
            const key = generateObjectKey(userId, ext);
            // The filename portion should be a UUID, not user-provided
            const filename = key.split('/')[2]!;
            const uuidPart = filename.substring(0, filename.lastIndexOf('.'));
            // UUID format ensures it's system-generated, not user input
            expect(uuidPart).toMatch(UUID_PATTERN);
          },
        ),
        { numRuns: 100 },
      );
    });

    it('each call produces a unique key (no collisions)', () => {
      fc.assert(
        fc.property(userIdArb, validExtensionArb, (userId, ext) => {
          const key1 = generateObjectKey(userId, ext);
          const key2 = generateObjectKey(userId, ext);
          // Two calls with same inputs should produce different keys (different UUIDs)
          expect(key1).not.toBe(key2);
        }),
        { numRuns: 100 },
      );
    });
  });

  describe('Property 7: Ownership isolation', () => {
    /**
     * **Validates: Requirements 5.1, 5.4**
     *
     * Cache keys include userId, ensuring that one user's cached data
     * cannot be accessed by another user's cache lookup.
     */
    it('certificate list cache keys include userId for isolation', () => {
      fc.assert(
        fc.property(userIdArb, (userId) => {
          const cacheKey = CACHE_KEYS.certificateList(userId);
          // Cache key must contain the userId
          expect(cacheKey).toContain(userId);
          // Must follow the cert-list:{userId} pattern
          expect(cacheKey).toBe(`cert-list:${userId}`);
        }),
        { numRuns: 200 },
      );
    });

    it('different users always get different certificate list cache keys', () => {
      fc.assert(
        fc.property(
          userIdArb,
          userIdArb.filter((id) => id.length === 24),
          (userId1, userId2) => {
            fc.pre(userId1 !== userId2);
            const key1 = CACHE_KEYS.certificateList(userId1);
            const key2 = CACHE_KEYS.certificateList(userId2);
            expect(key1).not.toBe(key2);
          },
        ),
        { numRuns: 200 },
      );
    });

    it('object keys include userId for storage-level isolation', () => {
      fc.assert(
        fc.property(userIdArb, validExtensionArb, (userId, ext) => {
          const objectKey = generateObjectKey(userId, ext);
          // Object key must contain the userId in the path
          expect(objectKey).toContain(`/${userId}/`);
        }),
        { numRuns: 100 },
      );
    });
  });

  describe('Property 8: Cache key uniqueness', () => {
    /**
     * **Validates: Requirements 5.1, 5.2, 5.3**
     *
     * Different IDs always produce different cache keys across all
     * cache key functions.
     */
    it('different certificate IDs produce different cache keys', () => {
      fc.assert(
        fc.property(userIdArb, userIdArb, (id1, id2) => {
          fc.pre(id1 !== id2);
          const key1 = CACHE_KEYS.certificate(id1);
          const key2 = CACHE_KEYS.certificate(id2);
          expect(key1).not.toBe(key2);
        }),
        { numRuns: 200 },
      );
    });

    it('different object keys produce different presigned URL cache keys', () => {
      fc.assert(
        fc.property(
          userIdArb,
          userIdArb,
          validExtensionArb,
          validExtensionArb,
          (userId1, userId2, ext1, ext2) => {
            const objectKey1 = generateObjectKey(userId1, ext1);
            const objectKey2 = generateObjectKey(userId2, ext2);
            // Since UUIDs are unique, object keys are always different
            const cacheKey1 = CACHE_KEYS.presignedUrl(objectKey1);
            const cacheKey2 = CACHE_KEYS.presignedUrl(objectKey2);
            expect(cacheKey1).not.toBe(cacheKey2);
          },
        ),
        { numRuns: 100 },
      );
    });

    it('cache key functions produce keys with correct prefixes', () => {
      fc.assert(
        fc.property(userIdArb, (id) => {
          expect(CACHE_KEYS.certificate(id)).toMatch(/^cert:/);
          expect(CACHE_KEYS.certificateList(id)).toMatch(/^cert-list:/);
          expect(CACHE_KEYS.presignedUrl(id)).toMatch(/^presigned:/);
        }),
        { numRuns: 100 },
      );
    });
  });

  describe('Property 9: Cache TTL', () => {
    /**
     * **Validates: Requirements 5.2, 5.3**
     *
     * The presigned URL cache TTL (3300s) is always less than the actual
     * URL expiry (3600s), ensuring cached URLs are never served after expiry.
     */
    it('presigned URL cache TTL is strictly less than URL expiry (3600s)', () => {
      const URL_EXPIRY_SECONDS = 3600;
      expect(CACHE_TTL.presignedUrl).toBeLessThan(URL_EXPIRY_SECONDS);
    });

    it('presigned URL cache TTL provides a safety margin of at least 60 seconds', () => {
      const URL_EXPIRY_SECONDS = 3600;
      const margin = URL_EXPIRY_SECONDS - CACHE_TTL.presignedUrl;
      expect(margin).toBeGreaterThanOrEqual(60);
    });

    it('certificate cache TTL is positive and reasonable', () => {
      expect(CACHE_TTL.certificate).toBeGreaterThan(0);
      expect(CACHE_TTL.certificate).toBeLessThanOrEqual(3600); // max 1 hour
    });

    it('certificate list cache TTL is positive and shorter than individual cert TTL', () => {
      expect(CACHE_TTL.certificateList).toBeGreaterThan(0);
      expect(CACHE_TTL.certificateList).toBeLessThanOrEqual(CACHE_TTL.certificate);
    });

    it('all TTL values are positive integers', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(
            CACHE_TTL.certificate,
            CACHE_TTL.certificateList,
            CACHE_TTL.presignedUrl,
          ),
          (ttl) => {
            expect(ttl).toBeGreaterThan(0);
            expect(Number.isInteger(ttl)).toBe(true);
          },
        ),
        { numRuns: 10 },
      );
    });
  });

  describe('Property 10: File validation', () => {
    /**
     * **Validates: Requirements 6.7, 6.8**
     *
     * Files with wrong magic bytes are always rejected.
     * Files with correct magic bytes and valid MIME types always pass.
     */
    it('files with valid magic bytes and allowed MIME types always pass validation', () => {
      fc.assert(
        fc.property(
          validMimeTypeArb,
          fc.integer({ min: 100, max: 5 * 1024 * 1024 }),
          (mimetype, size) => {
            const file = createValidFile(mimetype, size);
            // Should not throw
            expect(() => validateFile(file)).not.toThrow();
          },
        ),
        { numRuns: 100 },
      );
    });

    it('files with wrong magic bytes are always rejected', () => {
      fc.assert(
        fc.property(
          validMimeTypeArb,
          invalidMagicBytesArb,
          (mimetype, wrongBytes) => {
            const file: Express.Multer.File = {
              fieldname: 'file',
              originalname: 'test-file',
              encoding: '7bit',
              mimetype,
              size: wrongBytes.length,
              buffer: Buffer.from(wrongBytes),
              destination: '',
              filename: '',
              path: '',
              stream: null as any,
            };

            expect(() => validateFile(file)).toThrow(BadRequestException);
          },
        ),
        { numRuns: 200 },
      );
    });

    it('files with invalid MIME types are always rejected regardless of content', () => {
      fc.assert(
        fc.property(
          invalidMimeTypeArb,
          fc.uint8Array({ minLength: 8, maxLength: 64 }),
          (mimetype, bytes) => {
            const file: Express.Multer.File = {
              fieldname: 'file',
              originalname: 'test-file',
              encoding: '7bit',
              mimetype,
              size: bytes.length,
              buffer: Buffer.from(bytes),
              destination: '',
              filename: '',
              path: '',
              stream: null as any,
            };

            expect(() => validateFile(file)).toThrow(BadRequestException);
          },
        ),
        { numRuns: 100 },
      );
    });

    it('files exceeding 5MB are always rejected', () => {
      fc.assert(
        fc.property(
          validMimeTypeArb,
          fc.integer({ min: 5 * 1024 * 1024 + 1, max: 20 * 1024 * 1024 }),
          (mimetype, size) => {
            const magicBytes = MAGIC_BYTES_MAP[mimetype]!;
            // Create a file object with size > 5MB (we only need the size field to exceed)
            const file: Express.Multer.File = {
              fieldname: 'file',
              originalname: 'large-file',
              encoding: '7bit',
              mimetype,
              size,
              buffer: Buffer.from(magicBytes),
              destination: '',
              filename: '',
              path: '',
              stream: null as any,
            };

            expect(() => validateFile(file)).toThrow(BadRequestException);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('getExtensionFromMime always returns correct extension for allowed types', () => {
      fc.assert(
        fc.property(validMimeTypeArb, (mimetype) => {
          const ext = getExtensionFromMime(mimetype);
          const expectedMap: Record<string, string> = {
            'image/png': 'png',
            'image/jpeg': 'jpg',
            'image/webp': 'webp',
            'application/pdf': 'pdf',
          };
          expect(ext).toBe(expectedMap[mimetype]);
        }),
        { numRuns: 20 },
      );
    });

    it('getExtensionFromMime returns "bin" for unknown MIME types', () => {
      fc.assert(
        fc.property(invalidMimeTypeArb, (mimetype) => {
          const ext = getExtensionFromMime(mimetype);
          expect(ext).toBe('bin');
        }),
        { numRuns: 50 },
      );
    });
  });
});
