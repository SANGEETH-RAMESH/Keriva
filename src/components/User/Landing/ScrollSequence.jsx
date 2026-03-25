import React, { useRef, useEffect, useState } from 'react';

const ScrollSequence = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [images, setImages] = useState([]);
  const frameCount = 120; // ezgif-frame-001.png to ezgif-frame-120.png

  useEffect(() => {
    const loadedImages = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const index = i.toString().padStart(3, '0');
      img.src = `/assets/ezgif-frame-${index}.png`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          // Trigger initial draw once all are finished loading
          drawFrame(1, loadedImages);
        }
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  const drawFrame = (frameIndex, imagesArray = images) => {
    if (!canvasRef.current || imagesArray.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imagesArray[frameIndex - 1];
    if (!img) return;

    // Cover behavior style using fixed aspect ratio
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      const scrollTop = -top;

      // Calculate scroll fraction based on how far we scrolled past the top of the container
      const maxScroll = height - window.innerHeight;
      let scrollFraction = scrollTop / maxScroll;

      // Clamp between 0 and 1
      scrollFraction = Math.max(0, Math.min(1, scrollFraction));

      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
      );

      window.requestAnimationFrame(() => drawFrame(frameIndex + 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [images]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;

        if (images.length === frameCount) {
          const { top, height } = containerRef.current?.getBoundingClientRect() || { top: 0, height: window.innerHeight * 4 };
          const maxScroll = height - window.innerHeight;
          let scrollFraction = -top / maxScroll;
          scrollFraction = Math.max(0, Math.min(1, scrollFraction));
          const frameIndex = Math.min(frameCount - 1, Math.floor(scrollFraction * frameCount));
          drawFrame(frameIndex + 1);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [images]);

  return (
    <div ref={containerRef} className="relative h-[400vh]">
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-black">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />


      </div>
    </div>
  );
};

export default ScrollSequence;
