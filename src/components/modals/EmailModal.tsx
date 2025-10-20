// Modal Email avec HubSpot Form (non fermable, obligatoire)

import { useEffect } from 'react';
import '../../styles/EmailModal.css';

interface EmailModalProps {
  onSubmit: (email: string) => Promise<void>;
  estimation: any;
}

export function EmailModal({ onSubmit, estimation }: EmailModalProps) {
  useEffect(() => {
    // Charger le script HubSpot
    const script = document.createElement('script');
    script.src = '//js-eu1.hsforms.net/forms/embed/v2.js';
    script.charset = 'utf-8';
    script.type = 'text/javascript';
    script.async = true;

    script.onload = () => {
      // @ts-ignore
      if (window.hbspt) {
        // @ts-ignore
        window.hbspt.forms.create({
          portalId: '144452458',
          formId: '3db0b61d-feba-400e-be7a-039cf1d4420b',
          region: 'eu1',
          target: '#hubspot-form-container',
          onFormSubmitted: async (_$form: any, data: any) => {
            console.log('🎉 HubSpot form submitted!', data);

            // Récupérer l'email soumis (submissionValues est un objet, pas un array)
            const email = data.submissionValues?.email || data.submissionValues?.Email;

            console.log('📧 Email extracted:', email);

            if (email) {
              // Appeler l'API unlock
              onSubmit(email).catch((error) => {
                console.error('❌ Error unlocking project:', error);
              });

              console.log('✅ Form submitted, API called');
            } else {
              console.error('❌ No email found in submission. Data:', data);
            }
          },
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup
      document.body.removeChild(script);
    };
  }, [onSubmit]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="email-modal-overlay">
      <div className="email-modal">
        <h2>🎉 VOTRE PROJET EST PRÊT !</h2>

        {estimation && (
          <div className="teasing-info">
            <p className="teasing-item">
              💰 Estimation : {formatPrice(estimation.prix_total_min)} - {formatPrice(estimation.prix_total_max)}
            </p>
            <p className="teasing-item">
              📏 Surface détectée : ~{estimation.surface_m2} m²
            </p>
            <p className="teasing-item">
              📍 Localisation : {estimation.localisation}
            </p>
          </div>
        )}

        <div className="separator" />

        <p className="modal-instruction">
          Pour débloquer votre visualisation et prendre rendez-vous :
        </p>

        {/* HubSpot Form Container */}
        <div id="hubspot-form-container" className="hubspot-form"></div>

        <div className="reassurance">
          <p>✅ Gratuit et sans engagement</p>
          <p>✅ Possibilité de prendre RDV après</p>
          <p>✅ Vos données sont sécurisées</p>
        </div>
      </div>
    </div>
  );
}
