import { useRef, useState } from 'react';
import './ServiceCard.css';

export default function ServiceCard({ icon, title, description, features, index, cta, onCtaClick }) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform('');
  };

  return (
    <div
      ref={cardRef}
      className="service-card glass-card"
      style={{
        transform,
        animationDelay: `${index * 0.1}s`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      id={`service-card-${index}`}
    >
      <div className="service-card__icon">{icon}</div>
      <h3 className="service-card__title">{title}</h3>
      <p className="service-card__desc">{description}</p>
      <ul className="service-card__features">
        {features.map((f, i) => (
          <li key={i}>
            <span className="service-card__bullet" />
            {f}
          </li>
        ))}
      </ul>
      <a
        href="https://wa.me/201002194451"
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary service-card__cta"
      >
        {cta}
      </a>
    </div>
  );
}
