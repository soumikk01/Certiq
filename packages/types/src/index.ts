/**
 * @certiq/types — Shared TypeScript types
 * 
 * Export all shared types from here. These types are shared across
 * apps/web, apps/dashboard, and apps/api.
 */

// ─── Auth ────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

// ─── Certificates ─────────────────────────────────────────────────────────────
export interface Certificate {
  id: string;
  userId: string;
  title: string;
  issuer: string;
  objectKey?: string;
  credUrl?: string;
  verified: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateCertificatePayload = Pick<Certificate, 'title' | 'issuer' | 'credUrl'>;
export type UpdateCertificatePayload = Partial<Pick<Certificate, 'title' | 'issuer' | 'credUrl' | 'verified'>>;

// ─── Resumes ──────────────────────────────────────────────────────────────────
export interface Resume {
  id: string;
  userId: string;
  title: string;
  templateId: string;
  content: Record<string, unknown>;
  published: boolean;
  shareSlug?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateResumePayload = Partial<Pick<Resume, 'title' | 'templateId' | 'content'>>;
export type UpdateResumePayload = Partial<Pick<Resume, 'title' | 'templateId' | 'content' | 'published'>>;

// ─── API Response ─────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}
