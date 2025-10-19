// MongoDB Model for Lead

import mongoose from 'mongoose';
import { LeadSchema } from '../schemas/LeadSchema.js';

export const LeadModel = mongoose.model('Lead', LeadSchema);
