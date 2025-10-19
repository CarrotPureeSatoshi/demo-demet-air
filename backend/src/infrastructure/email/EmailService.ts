// Service - Envoi d'emails

import nodemailer, { Transporter } from 'nodemailer';
import { config } from '../../config/index.js';
import { Project } from '../../domain/entities/Project.js';

export class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_PORT === 465, // true for 465, false for other ports
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
      },
    });
  }

  async sendProjectResult(email: string, project: Project): Promise<void> {
    if (!project.estimation || !project.generatedImageUrl) {
      throw new Error('Project must have estimation and generated image');
    }

    const estimation = project.estimation;
    const priceRange = `${this.formatPrice(estimation.prix_total_min)} - ${this.formatPrice(estimation.prix_total_max)}`;
    const netPriceRange = `${this.formatPrice(estimation.aides_financieres.cout_net_min)} - ${this.formatPrice(estimation.aides_financieres.cout_net_max)}`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Votre projet de végétalisation DEMET'AIR</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2d5016;">🌿 DEMET'AIR</h1>
    <h2 style="color: #4a7c25;">Votre projet végétalisé est prêt !</h2>
  </div>

  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h3>📊 Votre estimation personnalisée</h3>
    <ul style="list-style: none; padding: 0;">
      <li>📏 <strong>Surface :</strong> ${estimation.surface_m2} m²</li>
      <li>📍 <strong>Localisation :</strong> ${estimation.localisation}</li>
      <li>🏢 <strong>Type :</strong> ${this.formatBuildingType(estimation.type_batiment)}</li>
      <li>💰 <strong>Prix total :</strong> ${priceRange} TTC</li>
      <li>📐 <strong>Prix au m² :</strong> ${estimation.prix_m2_min}€ - ${estimation.prix_m2_max}€/m²</li>
    </ul>
  </div>

  <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h3>💚 Après aides financières</h3>
    <p>✅ <strong>Crédit d'impôt 30% :</strong> -${this.formatPrice(estimation.aides_financieres.credit_impot_30_min)} à -${this.formatPrice(estimation.aides_financieres.credit_impot_30_max)}</p>
    <p style="font-size: 18px; font-weight: bold; color: #2d5016;">🎉 Coût net estimé : ${netPriceRange}</p>
  </div>

  <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h3>🌿 Ce qui est inclus</h3>
    <ul>
      <li>✅ Substrat VGHolz® 100% biosourcé</li>
      <li>✅ Végétaux adaptés à votre climat</li>
      <li>✅ Installation par professionnel certifié</li>
      <li>✅ Garantie décennale 10 ans</li>
      <li>✅ Suivi IoT monitoring</li>
      <li>✅ Conformité réglementaire RE2020</li>
    </ul>
  </div>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${config.CALENDLY_URL}" style="display: inline-block; background: #2d5016; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
      📅 PRENDRE RENDEZ-VOUS GRATUIT
    </a>
  </div>

  <div style="text-align: center; margin: 20px 0;">
    <a href="${config.CORS_ORIGIN}/result/${project.id}" style="color: #4a7c25;">
      👀 Voir votre projet en ligne
    </a>
  </div>

  <div style="border-top: 2px solid #e0e0e0; padding-top: 20px; margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
    <p>DEMET'AIR - Végétalisation innovante pour bâtiments durables</p>
    <p>Questions ? Contactez-nous : <a href="mailto:contact@demetair.fr">contact@demetair.fr</a></p>
  </div>
</body>
</html>
    `;

    const textContent = `
Bonjour,

Votre projet de végétalisation DEMET'AIR est prêt !

ESTIMATION PERSONNALISÉE
========================
Surface : ${estimation.surface_m2} m²
Localisation : ${estimation.localisation}
Type : ${this.formatBuildingType(estimation.type_batiment)}
Prix total : ${priceRange} TTC
Prix au m² : ${estimation.prix_m2_min}€ - ${estimation.prix_m2_max}€/m²

APRÈS AIDES FINANCIÈRES
========================
Crédit d'impôt 30% : -${this.formatPrice(estimation.aides_financieres.credit_impot_30_min)} à -${this.formatPrice(estimation.aides_financieres.credit_impot_30_max)}
Coût net estimé : ${netPriceRange}

CE QUI EST INCLUS
==================
✅ Substrat VGHolz® 100% biosourcé
✅ Végétaux adaptés à votre climat
✅ Installation par professionnel certifié
✅ Garantie décennale 10 ans
✅ Suivi IoT monitoring
✅ Conformité réglementaire RE2020

PROCHAINES ÉTAPES
==================
Prenez rendez-vous gratuitement : ${config.CALENDLY_URL}
Voir votre projet en ligne : ${config.CORS_ORIGIN}/result/${project.id}

À bientôt,
L'équipe DEMET'AIR
    `;

    await this.transporter.sendMail({
      from: `${config.EMAIL_FROM_NAME} <${config.EMAIL_FROM}>`,
      to: email,
      subject: '🌿 Votre projet de végétalisation DEMET\'AIR',
      text: textContent,
      html: htmlContent,
    });
  }

  private formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  private formatBuildingType(type: string): string {
    const types: Record<string, string> = {
      facade: 'Façade résidentielle',
      toiture: 'Toiture',
      mixte: 'Façade + Toiture',
    };
    return types[type] || type;
  }
}
