// MongoDB Schema for Lead

import { Schema } from 'mongoose';

export const LeadSchema = new Schema({
  email: { type: String, required: true, lowercase: true, index: true },
  projectId: { type: Schema.Types.ObjectId, required: true, ref: 'Project', index: true },
  metadata: {
    source: String,
    utm_source: String,
    utm_campaign: String,
    utm_medium: String,
    utm_term: String,
    utm_content: String,
  },
  emailSent: { type: Boolean, default: false },
  emailSentAt: { type: Date, default: null },
  calendlyClicked: { type: Boolean, default: false },
  calendlyClickedAt: { type: Date, default: null },
  pdfDownloaded: { type: Boolean, default: false },
  pdfDownloadedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

// Indexes
LeadSchema.index({ email: 1, projectId: 1 }, { unique: true });
LeadSchema.index({ createdAt: -1 });
