import type { Certificate, CreateCertificatePayload, UpdateCertificatePayload, Resume, CreateResumePayload, UpdateResumePayload, User } from '@certiq/types';

/**
 * @certiq/api-client
 * 
 * Typed HTTP client for the Certiq REST API.
 * Used by both apps/web and apps/dashboard.
 * 
 * Usage:
 *   const client = createApiClient({ baseUrl: process.env.NEXT_PUBLIC_API_URL! });
 *   const certs  = await client.certificates.list();
 */

export interface ApiClientConfig {
  baseUrl: string;
  /** Defaults to `include` for cookie-based auth */
  credentials?: RequestCredentials;
}

async function request<T>(
  baseUrl: string,
  path: string,
  init?: RequestInit,
  credentials: RequestCredentials = 'include',
): Promise<T> {
  const res = await fetch(`${baseUrl}/api${path}`, {
    ...init,
    credentials,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw Object.assign(new Error(err.message ?? 'API Error'), { status: res.status });
  }

  return res.json() as Promise<T>;
}

export function createApiClient({ baseUrl, credentials = 'include' }: ApiClientConfig) {
  const r = <T>(path: string, init?: RequestInit) =>
    request<T>(baseUrl, path, init, credentials);

  return {
    /** Health */
    health: {
      check: () => r<{ status: string }>('/health'),
    },

    /** Users */
    users: {
      me: () => r<User>('/users/me'),
      update: (data: Partial<User>) =>
        r<User>('/users/me', { method: 'PATCH', body: JSON.stringify(data) }),
    },

    /** Certificates */
    certificates: {
      list: () => r<Certificate[]>('/certificates'),
      get: (id: string) => r<Certificate>(`/certificates/${id}`),
      update: (id: string, data: UpdateCertificatePayload) =>
        r<Certificate>(`/certificates/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) =>
        r<{ deleted: boolean }>(`/certificates/${id}`, { method: 'DELETE' }),
      upload: (data: CreateCertificatePayload, file: File) => {
        const form = new FormData();
        form.append('file', file);
        Object.entries(data).forEach(([k, v]) => v != null && form.append(k, String(v)));
        return request<Certificate>(baseUrl, '/certificates/upload', {
          method: 'POST',
          body: form,
          // No Content-Type header — browser sets multipart boundary automatically
          headers: {},
        }, credentials);
      },
    },

    /** Resumes */
    resumes: {
      list: () => r<Resume[]>('/resumes'),
      get: (id: string) => r<Resume>(`/resumes/${id}`),
      create: (data: CreateResumePayload) =>
        r<Resume>('/resumes', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: UpdateResumePayload) =>
        r<Resume>(`/resumes/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id: string) =>
        r<{ deleted: boolean }>(`/resumes/${id}`, { method: 'DELETE' }),
    },
  };
}

export type CertiqApiClient = ReturnType<typeof createApiClient>;
