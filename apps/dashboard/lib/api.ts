import { insforge } from './insforge';

/**
 * API client for the Certiq backend.
 *
 * All requests include the InsForge access token for authentication.
 * The backend validates the token and identifies the user.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:12500/api';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data } = await insforge.auth.getCurrentUser();
  // The SDK stores the access token internally — we need to get it from the HTTP client
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Get the token from the SDK's internal state
  // The insforge client exposes headers with the auth token
  const sdkHeaders = (insforge as any).http?.getHeaders?.();
  if (sdkHeaders?.Authorization) {
    headers['Authorization'] = sdkHeaders.Authorization;
  }

  return headers;
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string, string> ?? {}),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message ?? `API error: ${response.status}`);
  }

  return response.json();
}

// ─── User ───────────────────────────────────────────────────────────────────

export async function syncUser() {
  return apiRequest<{
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    provider: string;
  }>('/users/me');
}

// ─── Resumes ────────────────────────────────────────────────────────────────

export interface Resume {
  id: string;
  userId: string;
  title: string;
  templateId: string;
  content: any;
  published: boolean;
  shareSlug: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function listResumes(): Promise<Resume[]> {
  return apiRequest<Resume[]>('/resumes');
}

export async function getResume(id: string): Promise<Resume> {
  return apiRequest<Resume>(`/resumes/${id}`);
}

export async function createResume(data: { title?: string; templateId?: string; content?: any }): Promise<Resume> {
  return apiRequest<Resume>('/resumes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateResume(id: string, data: { title?: string; templateId?: string; content?: any; published?: boolean }): Promise<Resume> {
  return apiRequest<Resume>(`/resumes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteResume(id: string): Promise<{ deleted: boolean }> {
  return apiRequest<{ deleted: boolean }>(`/resumes/${id}`, {
    method: 'DELETE',
  });
}

// ─── Certificates ───────────────────────────────────────────────────────────

export interface Certificate {
  id: string;
  userId: string;
  title: string;
  issuer: string;
  imageUrl: string | null;
  credUrl: string | null;
  verified: boolean;
  createdAt: string;
}

export async function listCertificates(): Promise<Certificate[]> {
  return apiRequest<Certificate[]>('/certificates');
}

export async function getCertificate(id: string): Promise<Certificate> {
  return apiRequest<Certificate>(`/certificates/${id}`);
}

export async function createCertificate(data: { title: string; issuer: string; imageUrl?: string; credUrl?: string }): Promise<Certificate> {
  return apiRequest<Certificate>('/certificates', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCertificate(id: string, data: { title?: string; issuer?: string; imageUrl?: string; credUrl?: string; verified?: boolean }): Promise<Certificate> {
  return apiRequest<Certificate>(`/certificates/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteCertificate(id: string): Promise<{ deleted: boolean }> {
  return apiRequest<{ deleted: boolean }>(`/certificates/${id}`, {
    method: 'DELETE',
  });
}
