export interface CertificateMock {
  id: string;
  title: string;
  issuer: string;
  verified: boolean;
  tiltDeg: number;
  thumbnail: string;
}

export const CERTIFICATES: readonly CertificateMock[] = [
  {
    id: "cert-aws",
    title: "AWS Solutions Architect",
    issuer: "Amazon Web Services",
    verified: true,
    tiltDeg: -2,
    thumbnail: "/images/certificates/aws-sa.webp",
  },
  {
    id: "cert-gcp",
    title: "Google Cloud Professional",
    issuer: "Google Cloud",
    verified: false,
    tiltDeg: 1.5,
    thumbnail: "/images/certificates/gcp-pro.webp",
  },
  {
    id: "cert-k8s",
    title: "Certified Kubernetes Admin",
    issuer: "Cloud Native Computing Foundation",
    verified: true,
    tiltDeg: 3,
    thumbnail: "/images/certificates/cka.webp",
  },
  {
    id: "cert-azure",
    title: "Azure Developer Associate",
    issuer: "Microsoft",
    verified: false,
    tiltDeg: -1,
    thumbnail: "/images/certificates/azure-dev.webp",
  },
] as const;
