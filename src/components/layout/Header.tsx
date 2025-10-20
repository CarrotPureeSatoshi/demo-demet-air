// Header Navigation Component - Démet'Air Demo

import { useState } from 'react';
import '../../styles/Header.css';

export function Header() {
  const [showSearchModal, setShowSearchModal] = useState(false);

  return (
    <>
      <header className="demo-header">
        {/* Top bar avec email et téléphone */}
        <div className="top-bar">
          <div className="top-bar-content">
            <a href="mailto:bonjour@demetair-vegetalisation.com" className="contact-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              bonjour@demetair-vegetalisation.com
            </a>
            <a href="tel:0641485034" className="contact-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              06 41 48 50 34
            </a>
          </div>
        </div>

        {/* Main navigation */}
        <nav className="main-nav">
          <div className="nav-content">
            {/* Logo */}
            <div className="logo-container">
              <img 
                src="https://www.demet-air.fr/wp-content/themes/tiria-child/assets/img/logo.png" 
                alt="Démet'Air Végétalisation" 
                className="logo"
              />
            </div>

            {/* Navigation items */}
            <ul className="nav-items">
              <li>
                <button className="nav-link" disabled title="Démo uniquement">
                  ACCUEIL
                </button>
              </li>
              <li>
                <button className="nav-link" disabled title="Démo uniquement">
                  QUI SOMMES-NOUS ?
                </button>
              </li>
              <li>
                <button className="nav-link" disabled title="Démo uniquement">
                  NOS SOLUTIONS
                </button>
              </li>
              <li>
                <button className="nav-link" disabled title="Démo uniquement">
                  NOS RÉALISATIONS
                </button>
              </li>
              <li>
                <button className="nav-link" disabled title="Démo uniquement">
                  DOCUMENTATION
                </button>
              </li>
            </ul>

            {/* Actions */}
            <div className="nav-actions">
              <button 
                className="search-btn" 
                onClick={() => setShowSearchModal(true)}
                title="Rechercher (non disponible en démo)"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
              <button className="contact-btn" disabled title="Démo uniquement">
                CONTACT
              </button>
            </div>
          </div>
        </nav>

        {/* Demo notice */}
        <div className="demo-notice">
          ⚠️ <strong>Mode Démo :</strong> Cette interface est une démonstration. Les liens de navigation sont désactivés.
        </div>
      </header>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="search-modal-overlay" onClick={() => setShowSearchModal(false)}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowSearchModal(false)}>
              ✕
            </button>
            <h3>Recherche</h3>
            <p className="modal-notice">Cette fonctionnalité n'est pas disponible en mode démo.</p>
          </div>
        </div>
      )}
    </>
  );
}
