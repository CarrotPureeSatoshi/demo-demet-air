// Domain Entity - Lead

export interface LeadMetadata {
  source?: string;
  utm_source?: string;
  utm_campaign?: string;
  utm_medium?: string;
  utm_term?: string;
  utm_content?: string;
}

export class Lead {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly projectId: string,
    public readonly metadata: LeadMetadata,
    public readonly createdAt: Date,
    public emailSent: boolean = false,
    public emailSentAt: Date | null = null,
    public calendlyClicked: boolean = false,
    public calendlyClickedAt: Date | null = null,
    public pdfDownloaded: boolean = false,
    public pdfDownloadedAt: Date | null = null
  ) {}

  // Business logic methods
  markEmailSent(): void {
    this.emailSent = true;
    this.emailSentAt = new Date();
  }

  markCalendlyClicked(): void {
    this.calendlyClicked = true;
    this.calendlyClickedAt = new Date();
  }

  markPdfDownloaded(): void {
    this.pdfDownloaded = true;
    this.pdfDownloadedAt = new Date();
  }
}
