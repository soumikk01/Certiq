export interface CertificateMock {
  id: string;
  title: string;
  issuer: string;
  verified: boolean;
  tiltDeg: number;
}

export const CERTIFICATES: readonly CertificateMock[] = [
  {
    id: "cert-aws",
    title: "AWS Solutions Architect",
    issuer: "Amazon Web Services",
    verified: true,
    tiltDeg: -2,
  },
  {
    id: "cert-gcp",
    title: "Google Cloud Professional",
    issuer: "Google Cloud",
    verified: false,
    tiltDeg: 1.5,
  },
  {
    id: "cert-k8s",
    title: "Certified Kubernetes Admin",
    issuer: "Cloud Native Computing Foundation",
    verified: true,
    tiltDeg: 3,
  },
  {
    id: "cert-azure",
    title: "Azure Developer Associate",
    issuer: "Microsoft",
    verified: false,
    tiltDeg: -1,
  },
] as const;
