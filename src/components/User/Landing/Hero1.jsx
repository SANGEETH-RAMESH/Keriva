import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import './Hero.css';

const frameCount = 130;

const currentFrame = (index) =>
  new URL(
    `../../../assets/images/ezgif-frame-${index.toString().padStart(3, '0')}.png`,
    import.meta.url
  ).href;

const Hero = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);

  // FIX 3: define drawScaledImage before it's used in useEffect
  const drawScaledImage = useCallback((ctx, img, width, height) => {
    const hRatio = width / img.width;
    const vRatio = height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (width - img.width * ratio) / 2;
    const centerShift_y = (height - img.height * ratio) / 2;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(
      img,
      0, 0, img.width, img.height,
      centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
    );
  }, []);

  useEffect(() => {
    const loadedImages = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loadedCount++;
        if (i === 1 && canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
            drawScaledImage(ctx, img, canvasRef.current.width, canvasRef.current.height);
          }
        }
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);

    const handleResize = () => {
      if (canvasRef.current && loadedImages[0]?.complete) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) drawScaledImage(ctx, loadedImages[0], canvasRef.current.width, canvasRef.current.height);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawScaledImage]);

  // FIX 1: track scroll on the container, which now has overflow-y: scroll
  const { scrollYProgress } = useScroll({ container: containerRef });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!canvasRef.current || images.length === 0) return;
    const ctx = canvasRef.current.getContext('2d');
    const frameIndex = Math.min(frameCount - 1, Math.max(0, Math.floor(latest * frameCount)));
    const img = images[frameIndex];
    if (img?.complete && ctx) {
      drawScaledImage(ctx, img, canvasRef.current.width, canvasRef.current.height);
    }
  });

  const opacity1 = useTransform(scrollYProgress, [0.05, 0.15, 0.25, 0.35], [0, 1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0.05, 0.2, 0.35], [50, 0, -50]);

  const opacity2 = useTransform(scrollYProgress, [0.4, 0.5, 0.6, 0.7], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.4, 0.5, 0.7], [50, 0, -50]);

  const opacity3 = useTransform(scrollYProgress, [0.75, 0.85, 0.95, 1], [0, 1, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.75, 0.85, 1], [50, 0, -50]);

  return (
    // FIX 1+2: container must have fixed height + overflow to scroll
    <div ref={containerRef} className="hero-scroll-container">
      
      {/* FIX 2: tall spacer creates scroll distance inside the container */}
      <div style={{ height: '500vh' }} />

      {/* Canvas stays fixed in view while user scrolls through spacer */}
      <div className="hero-sticky-canvas">
        <canvas ref={canvasRef} className="hero-canvas" />
      </div>

      <div className="hero-features-overlay">
        <motion.div className="hero-feature-text" style={{ opacity: opacity1, y: y1, top: '35%' }}>
          <h2>Unprecedented Power.</h2>
          <p>Every interaction feels instantly responsive, fluid, and brilliantly alive.</p>
        </motion.div>

        <motion.div className="hero-feature-text right" style={{ opacity: opacity2, y: y2, top: '45%' }}>
          <h2>Flawless Design.</h2>
          <p>Crafted to perfection. Smooth imagery intertwined with motion.</p>
        </motion.div>

        <motion.div className="hero-feature-text center" style={{ opacity: opacity3, y: y3, top: '55%' }}>
          <h2>The future is here.</h2>
          <p>Explore the unbelievable limits of tomorrow.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;