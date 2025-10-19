// MongoDB Implementation of Lead Repository

import { ILeadRepository } from '../../domain/repositories/ILeadRepository.js';
import { Lead } from '../../domain/entities/Lead.js';
import { LeadModel } from '../mongodb/models/LeadModel.js';

export class LeadRepository implements ILeadRepository {
  async create(lead: Lead): Promise<Lead> {
    const doc = new LeadModel({
      _id: lead.id,
      email: lead.email,
      projectId: lead.projectId,
      metadata: lead.metadata,
      emailSent: lead.emailSent,
      emailSentAt: lead.emailSentAt,
      calendlyClicked: lead.calendlyClicked,
      calendlyClickedAt: lead.calendlyClickedAt,
      pdfDownloaded: lead.pdfDownloaded,
      pdfDownloadedAt: lead.pdfDownloadedAt,
      createdAt: lead.createdAt,
    });

    await doc.save();
    return this.toDomain(doc);
  }

  async findById(id: string): Promise<Lead | null> {
    const doc = await LeadModel.findById(id);
    return doc ? this.toDomain(doc) : null;
  }

  async findByEmail(email: string): Promise<Lead[]> {
    const docs = await LeadModel.find({ email }).sort({ createdAt: -1 });
    return docs.map(doc => this.toDomain(doc));
  }

  async findByProjectId(projectId: string): Promise<Lead | null> {
    const doc = await LeadModel.findOne({ projectId });
    return doc ? this.toDomain(doc) : null;
  }

  async update(lead: Lead): Promise<Lead> {
    const doc = await LeadModel.findByIdAndUpdate(
      lead.id,
      {
        email: lead.email,
        projectId: lead.projectId,
        metadata: lead.metadata,
        emailSent: lead.emailSent,
        emailSentAt: lead.emailSentAt,
        calendlyClicked: lead.calendlyClicked,
        calendlyClickedAt: lead.calendlyClickedAt,
        pdfDownloaded: lead.pdfDownloaded,
        pdfDownloadedAt: lead.pdfDownloadedAt,
      },
      { new: true }
    );

    if (!doc) {
      throw new Error(`Lead ${lead.id} not found`);
    }

    return this.toDomain(doc);
  }

  async findAll(limit = 50, offset = 0): Promise<Lead[]> {
    const docs = await LeadModel.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);
    return docs.map(doc => this.toDomain(doc));
  }

  async countTotal(): Promise<number> {
    return await LeadModel.countDocuments();
  }

  private toDomain(doc: any): Lead {
    return new Lead(
      doc._id.toString(),
      doc.email,
      doc.projectId.toString(),
      doc.metadata || {},
      doc.createdAt,
      doc.emailSent,
      doc.emailSentAt,
      doc.calendlyClicked,
      doc.calendlyClickedAt,
      doc.pdfDownloaded,
      doc.pdfDownloadedAt
    );
  }
}
