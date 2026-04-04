import { useEffect, useRef, useState } from 'react';

/**
 * Renders a logo image with white background removed via canvas.
 * Converts white/near-white pixels to transparent.
 * Brightens dark-colored pixels (like dark blue "OLT") so they're visible on dark backgrounds.
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

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = (r + g + b) / 3;
        const maxDiff = Math.max(r, g, b) - Math.min(r, g, b);

        // Remove white/near-white/light-gray pixels
        if (brightness > 180 && maxDiff < 40) {
          if (brightness > 220) {
            data[i + 3] = 0;
          } else {
            const alpha = Math.max(0, Math.round((220 - brightness) * (255 / 40)));
            data[i + 3] = Math.min(data[i + 3], alpha);
          }
          continue;
        }

        // Catch pure white with slight color cast
        if (r > 200 && g > 200 && b > 200 && maxDiff < 30) {
          const avgWhite = (r + g + b) / 3;
          if (avgWhite > 230) {
            data[i + 3] = 0;
          } else if (avgWhite > 200) {
            data[i + 3] = Math.min(data[i + 3], Math.round((230 - avgWhite) * 8));
          }
          continue;
        }

        // Brighten dark pixels so they're visible on dark backgrounds
        // This fixes dark blue "OLT" letters being invisible
        if (brightness < 100 && data[i + 3] > 0) {
          const boost = 1.8; // brightness multiplier
          const minBrightness = 120;
          data[i] = Math.min(255, Math.max(minBrightness, Math.round(r * boost)));
          data[i + 1] = Math.min(255, Math.max(minBrightness, Math.round(g * boost)));
          data[i + 2] = Math.min(255, Math.max(minBrightness, Math.round(b * boost)));
        } else if (brightness < 150 && data[i + 3] > 0) {
          const boost = 1.4;
          data[i] = Math.min(255, Math.round(r * boost));
          data[i + 1] = Math.min(255, Math.round(g * boost));
          data[i + 2] = Math.min(255, Math.round(b * boost));
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setDataUrl(canvas.toDataURL('image/png'));
    };
    img.src = src;
  }, [src]);

  if (!dataUrl) {
    return <img src={src} alt={alt} className={className} style={{ ...style, mixBlendMode: 'screen' }} />;
  }

  return <img src={dataUrl} alt={alt} className={className} style={style} />;
}
