export class UpdateCertificateDto {
  /** Certificate title (1-200 characters if provided) */
  title?: string;

  /** Certificate issuer (1-200 characters if provided) */
  issuer?: string;

  /** Optional credential URL */
  credUrl?: string;
}
