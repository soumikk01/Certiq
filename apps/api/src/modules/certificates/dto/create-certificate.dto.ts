export class CreateCertificateDto {
  /** Certificate title (1-200 characters) */
  title!: string;

  /** Certificate issuer (1-200 characters) */
  issuer!: string;

  /** Optional credential URL */
  credUrl?: string;
}
