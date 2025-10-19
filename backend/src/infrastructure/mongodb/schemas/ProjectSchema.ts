// MongoDB Schema for Project

import { Schema } from 'mongoose';

export const ProjectSchema = new Schema({
  originalImageUrl: { type: String, required: true },
  generatedImageUrl: { type: String, default: null },
  analysisData: {
    type: {
      surface_estimee_m2: Number,
      type_batiment: { type: String, enum: ['facade', 'toiture', 'mixte'] },
      orientation: { type: String, enum: ['nord', 'sud', 'est', 'ouest'] },
      materiaux_visibles: [String],
      obstacles: [String],
      vegetation_actuelle: Boolean,
      densite_recommandee: { type: String, enum: ['faible', 'moyenne', 'dense'] },
      especes_suggerees: [String],
    },
    default: null,
  },
  estimation: {
    type: {
      surface_m2: Number,
      type_batiment: { type: String, enum: ['facade', 'toiture', 'mixte'] },
      prix_base_min: Number,
      prix_base_max: Number,
      prix_total_min: Number,
      prix_total_max: Number,
      prix_m2_min: Number,
      prix_m2_max: Number,
      localisation: String,
      aides_financieres: {
        credit_impot_30_min: Number,
        credit_impot_30_max: Number,
        cout_net_min: Number,
        cout_net_max: Number,
      },
    },
    default: null,
  },
  userDescription: { type: String, default: null, maxlength: 200 },
  leadEmail: { type: String, default: null, lowercase: true },
  status: {
    type: String,
    enum: ['uploaded', 'analyzing', 'analyzed', 'generating', 'generated', 'unlocked', 'error'],
    default: 'uploaded',
    required: true,
  },
  metadata: {
    userAgent: String,
    device: String,
    source: String,
    utm_source: String,
    utm_campaign: String,
    ip: String,
  },
  errorMessage: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Indexes for performance
ProjectSchema.index({ createdAt: -1 });
ProjectSchema.index({ leadEmail: 1 });
ProjectSchema.index({ status: 1 });
