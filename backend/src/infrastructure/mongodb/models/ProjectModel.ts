// MongoDB Model for Project

import mongoose from 'mongoose';
import { ProjectSchema } from '../schemas/ProjectSchema.js';

export const ProjectModel = mongoose.model('Project', ProjectSchema);
