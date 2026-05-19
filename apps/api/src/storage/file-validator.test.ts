import { describe, it, expect } from 'vitest';
import { BadRequestException } from '@nestjs/common';
import { validateFile, getExtensionFromMime } from './file-validator.js';

function createMockFile(overrides: Partial<Express.Multer.File> = {}): Express.Multer.File {
  return {
    fieldname: 'file',
    originalname: 'test.png',
    encoding: '7bit',
    mimetype: 'image/png',
    size: 1024,
    buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    destination: '',
    filename: '',
    path: '',
    stream: null as any,
    ...overrides,
  };
}

describe('validateFile', () => {
  it('should pass for a valid PNG file', () => {
    const file = createMockFile();
    expect(() => validateFile(file)).not.toThrow();
  });

  it('should pass for a valid JPEG file', () => {
    const file = createMockFile({
      mimetype: 'image/jpeg',
      buffer: Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]),
    });
    expect(() => validateFile(file)).not.toThrow();
  });

  it('should pass for a valid WebP file', () => {
    const file = createMockFile({
      mimetype: 'image/webp',
      buffer: Buffer.from([0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00]),
    });
    expect(() => validateFile(file)).not.toThrow();
  });

  it('should pass for a valid PDF file', () => {
    const file = createMockFile({
      mimetype: 'application/pdf',
      buffer: Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e]),
    });
    expect(() => validateFile(file)).not.toThrow();
  });

  it('should throw FILE_REQUIRED when file is null', () => {
    try {
      validateFile(null as any);
      expect.fail('Should have thrown');
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      const response = (e as BadRequestException).getResponse() as any;
      expect(response.code).toBe('FILE_REQUIRED');
    }
  });

  it('should throw FILE_TOO_LARGE when file exceeds max size', () => {
    const file = createMockFile({ size: 10 * 1024 * 1024 }); // 10MB
    try {
      validateFile(file);
      expect.fail('Should have thrown');
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      const response = (e as BadRequestException).getResponse() as any;
      expect(response.code).toBe('FILE_TOO_LARGE');
    }
  });

  it('should throw INVALID_FILE_TYPE for disallowed mime type', () => {
    const file = createMockFile({ mimetype: 'text/plain' });
    try {
      validateFile(file);
      expect.fail('Should have thrown');
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      const response = (e as BadRequestException).getResponse() as any;
      expect(response.code).toBe('INVALID_FILE_TYPE');
    }
  });

  it('should throw INVALID_FILE when magic bytes do not match', () => {
    const file = createMockFile({
      mimetype: 'image/png',
      buffer: Buffer.from([0xff, 0xd8, 0xff, 0xe0]), // JPEG bytes with PNG mimetype
    });
    try {
      validateFile(file);
      expect.fail('Should have thrown');
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      const response = (e as BadRequestException).getResponse() as any;
      expect(response.code).toBe('INVALID_FILE');
      expect(response.message).toContain('magic byte mismatch');
    }
  });
});

describe('getExtensionFromMime', () => {
  it('should return png for image/png', () => {
    expect(getExtensionFromMime('image/png')).toBe('png');
  });

  it('should return jpg for image/jpeg', () => {
    expect(getExtensionFromMime('image/jpeg')).toBe('jpg');
  });

  it('should return webp for image/webp', () => {
    expect(getExtensionFromMime('image/webp')).toBe('webp');
  });

  it('should return pdf for application/pdf', () => {
    expect(getExtensionFromMime('application/pdf')).toBe('pdf');
  });

  it('should return bin for unknown mime types', () => {
    expect(getExtensionFromMime('text/plain')).toBe('bin');
    expect(getExtensionFromMime('application/octet-stream')).toBe('bin');
  });
});
