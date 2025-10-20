// Page 2 - Result with Email Modal + Before/After Slider

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { projectService, ProjectGetResponse } from '../services/projectService';
import { BeforeAfterSlider } from '../components/ui/BeforeAfterSlider';
import { EmailModal } from '../components/modals/EmailModal';
import { Header } from '../components/layout/Header';
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
    if (!id) {
      setError('ID de projet manquant');
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 Loading project:', id);
      const data = await projectService.get(id);
      console.log('✅ Project loaded:', data);
      setProject(data);
      setShowModal(!data.isUnlocked); // Afficher la modal si pas unlock
      setLoading(false);
    } catch (err: any) {
      console.error('❌ Error loading project:', err);
      const errorMessage = err.response?.status === 404 
        ? 'Projet non trouvé. Il a peut-être expiré.' 
        : 'Erreur lors du chargement du projet';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleUnlock = async (email: string) => {
    if (!id) return;

    try {
      console.log('📤 Calling unlock API with email:', email);
      const response = await projectService.unlock(id, email);
      console.log('✅ Unlock API response:', response);
      setProject(response.project);
      setShowModal(false);
      console.log('🚪 Modal should be closed now');
    } catch (err: any) {
      console.error('❌ Unlock API failed:', err);
      // Fermer quand même la modale après 2 secondes et recharger le projet
      setTimeout(() => {
        console.log('⏰ Closing modal after timeout, reloading project...');
        setShowModal(false);
        loadProject();
      }, 2000);
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
        <div className="error-container">
          <h2>❌ {error}</h2>
          <p>Le projet demandé n'existe pas ou a expiré.</p>
          <button 
            className="btn-primary" 
            onClick={() => window.location.href = '/'}
          >
            ← Retour à l'accueil
          </button>
        </div>
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

      <Header />

      {/* Contenu principal (toujours visible, mais non interactif si non unlocked) */}
      <div className={`result-content ${!project.isUnlocked ? 'locked-content' : ''}`}>
          {/* Layout 2 colonnes : Image (67%) à gauche + Devis (33%) à droite */}
          <div className="two-column-layout">
            {/* Colonne gauche : Image avant/après */}
            <div className="left-column">
              {project.originalImageUrl && project.generatedImageUrl && (
                <BeforeAfterSlider
                  beforeImage={project.originalImageUrl}
                  afterImage={project.generatedImageUrl}
                />
              )}
            </div>

            {/* Colonne droite : CTA + Devis */}
            <div className="right-column">
              {/* CTAs en premier */}
              <div className="cta-container">
                <button className="btn-primary large" onClick={handleCalendlyClick}>
                  <svg style={{display: 'inline', width: '18px', height: '18px', marginRight: '8px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  PRENDRE RENDEZ-VOUS GRATUIT
                </button>
                <button className="btn-tertiary small" onClick={() => window.location.href = '/'}>
                  <svg style={{display: 'inline', width: '16px', height: '16px', marginRight: '6px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                  Générer une autre version
                </button>
                <a href="#portfolio" className="link-discrete">
                  <svg style={{display: 'inline', width: '16px', height: '16px', marginRight: '6px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  Voir nos 30+ projets réalisés
                </a>
              </div>

              {/* Confirmation collecte */}
              {project.leadEmail && (
                <p className="email-confirmation">
                  <svg style={{display: 'inline', width: '16px', height: '16px', marginRight: '6px', color: '#4a7c25'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Merci ! Votre demande a été enregistrée.
                </p>
              )}

              {/* Bloc Estimation */}
              {estimation && (
                <div className="estimation-block">
              <h2>
                <svg style={{display: 'inline', width: '20px', height: '20px', marginRight: '8px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                Votre estimation personnalisée
              </h2>
              <div className="estimation-grid">
                <div className="estimation-item">
                  <span className="label">
                    <svg style={{display: 'inline', width: '14px', height: '14px', marginRight: '4px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
                    Surface détectée
                  </span>
                  <span className="value">~{estimation.surface_m2} m²</span>
                </div>
                <div className="estimation-item">
                  <span className="label">
                    <svg style={{display: 'inline', width: '14px', height: '14px', marginRight: '4px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    Localisation
                  </span>
                  <span className="value">{estimation.localisation}</span>
                </div>
                <div className="estimation-item">
                  <span className="label">
                    <svg style={{display: 'inline', width: '14px', height: '14px', marginRight: '4px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>
                    Type
                  </span>
                  <span className="value">
                    {estimation.type_batiment === 'facade' ? 'Façade résidentielle' :
                     estimation.type_batiment === 'toiture' ? 'Toiture' : 'Façade + Toiture'}
                  </span>
                </div>
                <div className="estimation-item highlight">
                  <span className="label">
                    <svg style={{display: 'inline', width: '14px', height: '14px', marginRight: '4px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    Prix total
                  </span>
                  <span className="value">
                    {formatPrice(estimation.prix_total_min)} - {formatPrice(estimation.prix_total_max)} TTC
                  </span>
                </div>
                <div className="estimation-item">
                  <span className="label">
                    <svg style={{display: 'inline', width: '14px', height: '14px', marginRight: '4px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                    Prix au m²
                  </span>
                  <span className="value">
                    {estimation.prix_m2_min}€ - {estimation.prix_m2_max}€/m²
                  </span>
                </div>
              </div>

              <div className="aides-block">
                <h3>
                  <svg style={{display: 'inline', width: '18px', height: '18px', marginRight: '6px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  Après aides financières
                </h3>
                <p className="aide-detail">
                  <svg style={{display: 'inline', width: '14px', height: '14px', marginRight: '4px', color: '#4a7c25'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Crédit d'impôt 30% :
                  {' '}-{formatPrice(estimation.aides_financieres.credit_impot_30_min)}
                  {' '}à{' '}
                  -{formatPrice(estimation.aides_financieres.credit_impot_30_max)}
                </p>
                <p className="cout-net">
                  <svg style={{display: 'inline', width: '16px', height: '16px', marginRight: '6px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>
                  Coût net estimé :
                  {' '}{formatPrice(estimation.aides_financieres.cout_net_min)}
                  {' '}-{' '}
                  {formatPrice(estimation.aides_financieres.cout_net_max)}
                </p>
                </div>
              </div>
            )}

              {/* Ce qui est inclus */}
              <div className="inclus-block">
            <h3>
              <svg style={{display: 'inline', width: '18px', height: '18px', marginRight: '6px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M12 11v11"/><path d="M16 19a4 4 0 0 1-8 0"/></svg>
              CE QUI EST INCLUS
            </h3>
            <ul>
              <li><svg style={{display: 'inline', width: '16px', height: '16px', marginRight: '6px', color: '#4a7c25'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>Substrat VGHolz® 100% biosourcé</li>
              <li><svg style={{display: 'inline', width: '16px', height: '16px', marginRight: '6px', color: '#4a7c25'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>Végétaux adaptés au climat {estimation?.localisation.toLowerCase()}</li>
              <li><svg style={{display: 'inline', width: '16px', height: '16px', marginRight: '6px', color: '#4a7c25'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>Installation par professionnel certifié</li>
              <li><svg style={{display: 'inline', width: '16px', height: '16px', marginRight: '6px', color: '#4a7c25'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>Garantie décennale 10 ans</li>
              <li><svg style={{display: 'inline', width: '16px', height: '16px', marginRight: '6px', color: '#4a7c25'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>Suivi IoT monitoring</li>
              <li><svg style={{display: 'inline', width: '16px', height: '16px', marginRight: '6px', color: '#4a7c25'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>Conformité réglementaire RE2020</li>
            </ul>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
