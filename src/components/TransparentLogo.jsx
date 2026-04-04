import { useEffect, useRef, useState } from 'react';

/**
 * Renders a logo image with white background removed via canvas.
 * Converts white/near-white pixels to transparent in real-time.
 */
export default function TransparentLogo({ src, alt, className, style }) {
  const canvasRef = useRef(null);
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Remove white/near-white/light-gray pixels aggressively
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = (r + g + b) / 3;
        const maxDiff = Math.max(r, g, b) - Math.min(r, g, b);

        // If pixel is light AND low-saturation (grayish/white), make transparent
        if (brightness > 180 && maxDiff < 40) {
          // Fully transparent for very white pixels
          if (brightness > 220) {
            data[i + 3] = 0;
          } else {
            // Smooth fade for gray border pixels
            const alpha = Math.max(0, Math.round((220 - brightness) * (255 / 40)));
            data[i + 3] = Math.min(data[i + 3], alpha);
          }
        }
        // Also catch pure white with slight color cast
        if (r > 200 && g > 200 && b > 200 && maxDiff < 30) {
          const avgWhite = (r + g + b) / 3;
          if (avgWhite > 230) {
            data[i + 3] = 0;
          } else if (avgWhite > 200) {
            data[i + 3] = Math.min(data[i + 3], Math.round((230 - avgWhite) * 8));
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setDataUrl(canvas.toDataURL('image/png'));
    };
    img.src = src;
  }, [src]);

  if (!dataUrl) {
    // Fallback: show original with blend mode while processing
    return <img src={src} alt={alt} className={className} style={{ ...style, mixBlendMode: 'screen' }} />;
  }

  return <img src={dataUrl} alt={alt} className={className} style={style} />;
}
