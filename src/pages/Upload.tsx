// Page 1 - Upload & Generation

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import '../styles/Upload.css';

export function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const progressMessages = [
    'Analyse de votre façade...',
    'Sélection des végétaux adaptés...',
    'Génération du rendu...',
    'Finalisation...',
  ];

  const handleFileSelect = (selectedFile: File) => {
    setError('');

    // Vérifier le type
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(selectedFile.type)) {
      setError('Format non supporté. Utilisez JPG ou PNG.');
      return;
    }

    // Vérifier la taille
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Fichier trop volumineux. Maximum 10 MB.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleGenerate = async () => {
    if (!file) return;

    setIsGenerating(true);
    setProgress(0);
    setError('');

    try {
      // Étape 1: Upload et création du projet (10%)
      setProgressMessage(progressMessages[0]);
      setProgress(10);

      const createResponse = await projectService.create(file, description || undefined);

      // Étape 2: Génération (10% -> 90%)
      let currentMessageIndex = 1;
      const messageInterval = setInterval(() => {
        if (currentMessageIndex < progressMessages.length) {
          setProgressMessage(progressMessages[currentMessageIndex]);
          setProgress(10 + (currentMessageIndex * 25));
          currentMessageIndex++;
        }
      }, 3000);

      const generateResponse = await projectService.generate(createResponse.id);

      clearInterval(messageInterval);

      // Étape 3: Terminé (100%)
      setProgress(100);
      setProgressMessage('Terminé !');

      // Rediriger vers la page résultat
      setTimeout(() => {
        navigate(`/result/${generateResponse.id}`);
      }, 500);
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.response?.data?.error || 'Une erreur est survenue. Réessayez.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="upload-page">
      <header className="header">
        <h1 className="logo">🌿 DEMET'AIR</h1>
      </header>

      <main className="upload-main">
        <h2 className="title">Visualisez votre projet végétalisé en 30 secondes</h2>

        {!file ? (
          <div
            className={`dropzone ${isDragging ? 'dragging' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="dropzone-icon">📷</div>
            <p className="dropzone-text">Glissez votre photo ici ou cliquez pour parcourir</p>
            <p className="dropzone-hint">JPG, PNG • Max 10 MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          <div className="file-preview">
            <div className="file-info">
              <span className="file-name">{file.name}</span>
              <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <div className="file-actions">
              <button onClick={() => setFile(null)} className="btn-secondary">Supprimer</button>
              <button onClick={() => fileInputRef.current?.click()} className="btn-secondary">
                Changer
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
          </div>
        )}

        <div className="description-container">
          <label htmlFor="description">Décrivez votre vision (optionnel)</label>
          <input
            id="description"
            type="text"
            placeholder="Dense avec plantes grimpantes"
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 200))}
            maxLength={200}
            disabled={isGenerating}
          />
          <span className="char-count">{description.length}/200</span>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          className={`btn-primary ${file && !isGenerating ? 'active' : ''}`}
          onClick={handleGenerate}
          disabled={!file || isGenerating}
        >
          {isGenerating ? '⏳ Génération en cours...' : file ? '✨ GÉNÉRER MON PROJET VÉGÉTALISÉ ✨' : 'GÉNÉRER MON PROJET'}
        </button>

        {file && !isGenerating && (
          <p className="generation-time">⏱️ Génération en ~20 secondes</p>
        )}

        <div className="tips">
          <p>💡 Prenez une photo de jour, face à votre bâtiment</p>
          <p className="social-proof">✨ Déjà 127 propriétaires ont visualisé leur projet cette semaine</p>
        </div>
      </main>

      {/* Overlay de génération */}
      {isGenerating && (
        <div className="generation-overlay">
          <div className="generation-modal">
            <h3>🎨 Végétalisation de votre bâtiment en cours...</h3>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="progress-message">{progressMessage}</p>
            <p className="progress-percent">{progress}%</p>
          </div>
        </div>
      )}
    </div>
  );
}
