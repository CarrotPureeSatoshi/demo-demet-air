// Composant Slider Avant/Après interactif

import { useState, useRef, useEffect } from 'react';
import '../../styles/BeforeAfterSlider.css';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

export function BeforeAfterSlider({ beforeImage, afterImage }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [imageRatio, setImageRatio] = useState<string>('16 / 9'); // Ratio par défaut
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || e.touches.length === 0) return;
    handleMove(e.touches[0].clientX);
  };

  // Détecter les dimensions de l'image "Avant" et adapter le conteneur
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const ratio = `${img.width} / ${img.height}`;
      setImageRatio(ratio);
      console.log('Image ratio detected:', ratio, `(${img.width}x${img.height})`);
    };
    img.src = beforeImage;
  }, [beforeImage]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="before-after-container" ref={containerRef}>
      <div
        className="before-after-wrapper"
        style={{ aspectRatio: imageRatio }}
      >
        {/* Image APRÈS (végétalisée) en arrière-plan complet */}
        <div className="image-container after-base">
          <img src={afterImage} alt="Après" />
        </div>

        {/* Image AVANT (originale) clippée par dessus */}
        <div
          className="image-container before-overlay"
          style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
        >
          <img src={beforeImage} alt="Avant" />
        </div>

        {/* Badges - affichés selon la position du slider */}
        {sliderPosition > 10 && (
          <div className="label label-after">APRÈS</div>
        )}
        {sliderPosition < 90 && (
          <div className="label label-before">AVANT</div>
        )}

        {/* Slider handle */}
        <div
          className="slider-handle"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <div className="handle-line" />
          <div className="handle-circle">
            <span>←</span>
            <span>→</span>
          </div>
        </div>
      </div>

      <p className="slider-instruction">← Glissez pour comparer →</p>
    </div>
  );
}
