// Page 2 - Result with Email Modal + Before/After Slider

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { projectService, ProjectGetResponse } from '../services/projectService';
import { BeforeAfterSlider } from '../components/ui/BeforeAfterSlider';
import { EmailModal } from '../components/modals/EmailModal';
import '../styles/Result.css';

export function Result() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectGetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    if (!id) return;

    try {
      const data = await projectService.get(id);
      setProject(data);
      setShowModal(!data.isUnlocked); // Afficher la modal si pas unlock
      setLoading(false);
    } catch (err) {
      setError('Projet non trouvé');
      setLoading(false);
    }
  };

  const handleUnlock = async (email: string) => {
    if (!id) return;

    try {
      const response = await projectService.unlock(id, email);
      setProject(response.project);
      setShowModal(false);
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Erreur lors du déblocage');
    }
  };

  const handleCalendlyClick = () => {
    if (id) {
      projectService.track(id, 'calendly');
    }
    window.open('https://calendly.com/demetair/rdv-gratuit', '_blank');
  };

  if (loading) {
    return (
      <div className="result-page loading">
        <div className="loader">Chargement...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="result-page error">
        <h2>{error}</h2>
      </div>
    );
  }

  const estimation = project.estimation;
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={`result-page ${!project.isUnlocked ? 'blurred' : ''}`}>
      {/* Image de fond (floutée si non unlock) */}
      <div className="background-container">
        {project.generatedImageUrl && (
          <img
            src={project.generatedImageUrl}
            alt="Visualisation végétalisée"
            className={!project.isUnlocked ? 'blurred-image' : ''}
          />
        )}
        {!project.isUnlocked && <div className="blur-overlay" />}
      </div>

      {/* Modal Email (non fermable) */}
      {showModal && (
        <EmailModal
          onSubmit={handleUnlock}
          estimation={estimation}
        />
      )}

      {/* Contenu principal (visible uniquement si unlocked) */}
      {project.isUnlocked && (
        <div className="result-content">
          <header className="result-header">
            <h1 className="logo">🌿 DEMET'AIR</h1>
          </header>

          {/* Slider Avant/Après */}
          {project.originalImageUrl && project.generatedImageUrl && (
            <BeforeAfterSlider
              beforeImage={project.originalImageUrl}
              afterImage={project.generatedImageUrl}
            />
          )}

          {/* Bloc Estimation */}
          {estimation && (
            <div className="estimation-block">
              <h2>📊 Votre estimation personnalisée</h2>
              <div className="estimation-grid">
                <div className="estimation-item">
                  <span className="label">📏 Surface détectée</span>
                  <span className="value">~{estimation.surface_m2} m²</span>
                </div>
                <div className="estimation-item">
                  <span className="label">📍 Localisation</span>
                  <span className="value">{estimation.localisation}</span>
                </div>
                <div className="estimation-item">
                  <span className="label">🏢 Type</span>
                  <span className="value">
                    {estimation.type_batiment === 'facade' ? 'Façade résidentielle' :
                     estimation.type_batiment === 'toiture' ? 'Toiture' : 'Façade + Toiture'}
                  </span>
                </div>
                <div className="estimation-item highlight">
                  <span className="label">💰 Prix total</span>
                  <span className="value">
                    {formatPrice(estimation.prix_total_min)} - {formatPrice(estimation.prix_total_max)} TTC
                  </span>
                </div>
                <div className="estimation-item">
                  <span className="label">📐 Prix au m²</span>
                  <span className="value">
                    {estimation.prix_m2_min}€ - {estimation.prix_m2_max}€/m²
                  </span>
                </div>
              </div>

              <div className="aides-block">
                <h3>💚 Après aides financières</h3>
                <p className="aide-detail">
                  ✅ Crédit d'impôt 30% :
                  {' '}-{formatPrice(estimation.aides_financieres.credit_impot_30_min)}
                  {' '}à{' '}
                  -{formatPrice(estimation.aides_financieres.credit_impot_30_max)}
                </p>
                <p className="cout-net">
                  🎉 Coût net estimé :
                  {' '}{formatPrice(estimation.aides_financieres.cout_net_min)}
                  {' '}-{' '}
                  {formatPrice(estimation.aides_financieres.cout_net_max)}
                </p>
              </div>
            </div>
          )}

          {/* Ce qui est inclus */}
          <div className="inclus-block">
            <h3>🌿 CE QUI EST INCLUS</h3>
            <ul>
              <li>✅ Substrat VGHolz® 100% biosourcé</li>
              <li>✅ Végétaux adaptés au climat {estimation?.localisation.toLowerCase()}</li>
              <li>✅ Installation par professionnel certifié</li>
              <li>✅ Garantie décennale 10 ans</li>
              <li>✅ Suivi IoT monitoring</li>
              <li>✅ Conformité réglementaire RE2020</li>
            </ul>
          </div>

          {/* CTAs */}
          <div className="cta-container">
            <button className="btn-primary large" onClick={handleCalendlyClick}>
              📅 PRENDRE RENDEZ-VOUS GRATUIT
            </button>
            <button className="btn-tertiary small" onClick={() => window.location.href = '/'}>
              🔄 Générer une autre version
            </button>
            <a href="#portfolio" className="link-discrete">
              👀 Voir nos 30+ projets réalisés
            </a>
          </div>

          {/* Confirmation collecte */}
          {project.leadEmail && (
            <p className="email-confirmation">
              ✅ Merci ! Votre demande a été enregistrée.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
