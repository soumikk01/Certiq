import { BadRequestException } from '@nestjs/common';

const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5MB

const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/pdf',
];

const MAGIC_BYTES = new Map<string, Buffer>([
  ['image/png', Buffer.from([0x89, 0x50, 0x4e, 0x47])],
  ['image/jpeg', Buffer.from([0xff, 0xd8, 0xff])],
  ['image/webp', Buffer.from([0x52, 0x49, 0x46, 0x46])],
  ['application/pdf', Buffer.from([0x25, 0x50, 0x44, 0x46])],
]);

export function validateFile(file: Express.Multer.File): void {
  if (!file) {
    throw new BadRequestException({ code: 'FILE_REQUIRED', message: 'File is required' });
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new BadRequestException({
      code: 'FILE_TOO_LARGE',
      message: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    });
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new BadRequestException({
      code: 'INVALID_FILE_TYPE',
      message: `Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`,
    });
  }

  const expectedMagic = MAGIC_BYTES.get(file.mimetype);
  if (!expectedMagic) {
    throw new BadRequestException({ code: 'INVALID_FILE', message: 'Unsupported file type' });
  }

  const fileHeader = file.buffer.subarray(0, expectedMagic.length);
  if (!fileHeader.equals(expectedMagic)) {
    throw new BadRequestException({
      code: 'INVALID_FILE',
      message: 'File content does not match declared type (magic byte mismatch)',
    });
  }
}

export function getExtensionFromMime(mimetype: string): string {
  const map: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
    'application/pdf': 'pdf',
  };
  return map[mimetype] ?? 'bin';
}
