// Domain Entity - Project (Aggregate Root)

export type ProjectStatus = 'uploaded' | 'analyzing' | 'analyzed' | 'generating' | 'generated' | 'unlocked' | 'error';

export type BuildingType = 'facade' | 'toiture' | 'mixte';
export type Orientation = 'nord' | 'sud' | 'est' | 'ouest';
export type Density = 'faible' | 'moyenne' | 'dense';

export interface AnalysisData {
  surface_estimee_m2: number;
  type_batiment: BuildingType;
  orientation: Orientation;
  materiaux_visibles: string[];
  obstacles: string[];
  vegetation_actuelle: boolean;
  densite_recommandee: Density;
  especes_suggerees: string[];
}

export interface EstimationData {
  surface_m2: number;
  type_batiment: BuildingType;
  prix_base_min: number;
  prix_base_max: number;
  prix_total_min: number;
  prix_total_max: number;
  prix_m2_min: number;
  prix_m2_max: number;
  localisation: string;
  aides_financieres: {
    credit_impot_30_min: number;
    credit_impot_30_max: number;
    cout_net_min: number;
    cout_net_max: number;
  };
}

export interface ProjectMetadata {
  userAgent?: string;
  device?: string;
  source?: string;
  utm_source?: string;
  utm_campaign?: string;
  ip?: string;
}

export class Project {
  constructor(
    public readonly id: string,
    public originalImageUrl: string,
    public generatedImageUrl: string | null,
    public analysisData: AnalysisData | null,
    public estimation: EstimationData | null,
    public userDescription: string | null,
    public leadEmail: string | null,
    public status: ProjectStatus,
    public metadata: ProjectMetadata,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public errorMessage?: string
  ) {}

  // Business logic methods
  markAsAnalyzing(): void {
    this.status = 'analyzing';
    this.updatedAt = new Date();
  }

  completeAnalysis(analysisData: AnalysisData): void {
    this.analysisData = analysisData;
    this.status = 'analyzed';
    this.updatedAt = new Date();
  }

  markAsGenerating(): void {
    this.status = 'generating';
    this.updatedAt = new Date();
  }

  completeGeneration(generatedImageUrl: string, estimation: EstimationData): void {
    this.generatedImageUrl = generatedImageUrl;
    this.estimation = estimation;
    this.status = 'generated';
    this.updatedAt = new Date();
  }

  unlock(email: string): void {
    this.leadEmail = email;
    this.status = 'unlocked';
    this.updatedAt = new Date();
  }

  markAsError(errorMessage: string): void {
    this.status = 'error';
    this.errorMessage = errorMessage;
    this.updatedAt = new Date();
  }

  isUnlocked(): boolean {
    return this.status === 'unlocked' && this.leadEmail !== null;
  }

  canBeUnlocked(): boolean {
    return this.status === 'generated' && this.generatedImageUrl !== null;
  }
}
