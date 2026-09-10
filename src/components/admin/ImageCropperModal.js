'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './ImageCropperModal.module.css';

export default function ImageCropperModal({ imageSrc, onSave, onCancel }) {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // Crop & Transform state
  const [aspectRatio, setAspectRatio] = useState('1:1'); // '1:1' | '4:3' | '16:9'
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Dragging state
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const pinchStartDistRef = useRef(null);
  const pinchStartZoomRef = useRef(1);

  const [isProcessing, setIsProcessing] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Load Image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setRotation(0);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Determine viewport canvas dimensions
  const getCanvasDimensions = useCallback(() => {
    const maxW = 340;
    if (aspectRatio === '1:1') return { width: maxW, height: maxW };
    if (aspectRatio === '4:3') return { width: maxW, height: Math.round((maxW * 3) / 4) };
    if (aspectRatio === '16:9') return { width: maxW, height: Math.round((maxW * 9) / 16) };
    return { width: maxW, height: maxW };
  }, [aspectRatio]);

  // Render to canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !imageLoaded) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = getCanvasDimensions();

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(width / 2 + offset.x, height / 2 + offset.y);
    ctx.rotate((rotation * Math.PI) / 180);

    const isRotated = rotation % 180 !== 0;
    const imgW = isRotated ? img.height : img.width;
    const imgH = isRotated ? img.width : img.height;

    const scaleX = width / imgW;
    const scaleY = height / imgH;
    const baseScale = Math.max(scaleX, scaleY);
    const finalScale = baseScale * zoom;

    ctx.scale(finalScale, finalScale);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();

    // Draw subtle rule-of-thirds grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 3, 0);
    ctx.lineTo(width / 3, height);
    ctx.moveTo((width / 3) * 2, 0);
    ctx.lineTo((width / 3) * 2, height);
    ctx.moveTo(0, height / 3);
    ctx.lineTo(width, height / 3);
    ctx.moveTo(0, (height / 3) * 2);
    ctx.lineTo(width, (height / 3) * 2);
    ctx.stroke();
  }, [imageLoaded, offset, zoom, rotation, getCanvasDimensions]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Mouse handlers
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * -0.002;
    setZoom((prev) => Math.min(Math.max(prev + zoomDelta, 0.8), 4));
  };

  // Touch handlers (phone support with 1-finger pan and 2-finger pinch-to-zoom)
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      isDraggingRef.current = false;
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchStartDistRef.current = dist;
      pinchStartZoomRef.current = zoom;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isDraggingRef.current) {
      const dx = e.touches[0].clientX - lastMousePosRef.current.x;
      const dy = e.touches[0].clientY - lastMousePosRef.current.y;
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    } else if (e.touches.length === 2 && pinchStartDistRef.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / pinchStartDistRef.current;
      setZoom(Math.min(Math.max(pinchStartZoomRef.current * ratio, 0.8), 4));
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    pinchStartDistRef.current = null;
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setOffset({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  const handleConfirm = async () => {
    const img = imageRef.current;
    if (!img) return;
    setIsProcessing(true);

    try {
      const exportW = 900;
      let exportH = 900;
      if (aspectRatio === '4:3') exportH = 675;
      if (aspectRatio === '16:9') exportH = 506;

      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = exportW;
      exportCanvas.height = exportH;
      const ctx = exportCanvas.getContext('2d');

      const { width: previewW } = getCanvasDimensions();
      const scaleMultiplier = exportW / previewW;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.save();
      ctx.translate(exportW / 2 + offset.x * scaleMultiplier, exportH / 2 + offset.y * scaleMultiplier);
      ctx.rotate((rotation * Math.PI) / 180);

      const isRotated = rotation % 180 !== 0;
      const imgW = isRotated ? img.height : img.width;
      const imgH = isRotated ? img.width : img.height;

      const scaleX = exportW / imgW;
      const scaleY = exportH / imgH;
      const baseScale = Math.max(scaleX, scaleY);
      const finalScale = baseScale * zoom;

      ctx.scale(finalScale, finalScale);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      exportCanvas.toBlob(
        (blob) => {
          if (blob) {
            onSave(blob);
          } else {
            alert('Błąd generowania przyciętego zdjęcia.');
            setIsProcessing(false);
          }
        },
        'image/jpeg',
        0.88
      );
    } catch (err) {
      alert('Błąd obróbki zdjęcia: ' + err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={() => !isProcessing && onCancel()}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span>✂️</span> Przytnij i wykadruj zdjęcie
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onCancel}
            disabled={isProcessing}
            aria-label="Zamknij"
          >
            ✕
          </button>
        </div>

        {/* Canvas Area */}
        <div
          className={styles.canvasWrapper}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <canvas ref={canvasRef} className={styles.canvas} />
        </div>
        <div className={styles.hintText}>
          👆 Przesuwaj palcem lub myszką, aby wyśrodkować produkt w kadrze
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          {/* Format / Proporcje */}
          <div className={styles.ratioRow}>
            <span className={styles.ratioLabel}>Format kadru:</span>
            <div className={styles.ratioButtons}>
              <button
                type="button"
                className={[styles.ratioBtn, aspectRatio === '1:1' ? styles.ratioBtnActive : ''].join(' ')}
                onClick={() => setAspectRatio('1:1')}
              >
                1:1 Kwadrat (zalecany)
              </button>
              <button
                type="button"
                className={[styles.ratioBtn, aspectRatio === '4:3' ? styles.ratioBtnActive : ''].join(' ')}
                onClick={() => setAspectRatio('4:3')}
              >
                4:3 Standard
              </button>
            </div>
          </div>

          {/* Przybliżenie Zoom */}
          <div className={styles.sliderRow}>
            <button
              type="button"
              className={styles.sliderBtn}
              onClick={() => setZoom((z) => Math.max(z - 0.2, 0.8))}
              title="Oddal"
            >
              −
            </button>
            <input
              type="range"
              className={styles.slider}
              min="0.8"
              max="3.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
            />
            <button
              type="button"
              className={styles.sliderBtn}
              onClick={() => setZoom((z) => Math.min(z + 0.2, 3.5))}
              title="Przybliż"
            >
              +
            </button>
          </div>

          {/* Narzędzia dodatkowe: Obrót i Reset */}
          <div className={styles.extraTools}>
            <button
              type="button"
              className={styles.toolBtn}
              onClick={handleRotate}
            >
              <span>🔄</span> Obróć o 90°
            </button>
            <button
              type="button"
              className={styles.toolBtn}
              onClick={handleReset}
            >
              <span>↺</span> Wyśrodkuj
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onCancel}
            disabled={isProcessing}
          >
            Anuluj
          </button>
          <button
            type="button"
            className={styles.saveBtn}
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? 'Zapisywanie...' : '✓ Zastosuj i wgraj zdjęcie'}
          </button>
        </div>
      </div>
    </div>
  );
}
