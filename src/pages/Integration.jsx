import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { FaNetworkWired, FaWhatsapp } from 'react-icons/fa';
import { HiArrowLeft, HiSparkles } from 'react-icons/hi';
import AnimatedCounter from '../components/AnimatedCounter';
import imgCross from '../assets/services/integration_cross.webp';
import imgApi from '../assets/services/integration_api.webp';
import imgMigration from '../assets/services/integration_migration.webp';
import imgMulti from '../assets/services/integration_multiplatform.webp';
import imgMiddleware from '../assets/services/integration_middleware.webp';
import imgIndustry from '../assets/services/integration_industry.webp';
import './ServiceDetail.css';

const images = [imgCross, imgApi, imgMigration, imgMulti, imgMiddleware, imgIndustry];

export default function Integration() {
  const { t, lang } = useLang();
  const d = t.serviceDetails.integration;

  return (
    <div className="services-page" id="integration-page">
      <section className="sd-hero">
        <div className="sd-hero__bg">
          <img src={imgCross} alt="" aria-hidden="true" />
        </div>
        <div className="sd-hero__overlay" />
        <div className="sd-hero__content container">
          <Link to="/services" className="sd-back">
            <HiArrowLeft /> {t.services.backToServices}
          </Link>
          <div className="sd-hero__icon sd-hero__icon--orange">
            <FaNetworkWired />
          </div>
          <h1 className="sd-hero__title">{t.services.s4.title}</h1>
          <p className="sd-hero__desc">{d.heroDesc}</p>
        </div>
      </section>

      <div className="container">
        <div className="sd-stats">
          <div className="sd-stat">
            <span className="sd-stat__number"><AnimatedCounter end={80} suffix="+" /></span>
            <span className="sd-stat__label">{lang === 'ar' ? 'تكامل منجز' : 'Integrations Done'}</span>
          </div>
          <div className="sd-stat">
            <span className="sd-stat__number"><AnimatedCounter end={50} suffix="+" /></span>
            <span className="sd-stat__label">{lang === 'ar' ? 'API مبني' : 'APIs Built'}</span>
          </div>
          <div className="sd-stat">
            <span className="sd-stat__number"><AnimatedCounter end={100} suffix="%" /></span>
            <span className="sd-stat__label">{lang === 'ar' ? 'نجاح الترحيل' : 'Migration Success'}</span>
          </div>
        </div>
      </div>

      <section className="sd-section">
        <div className="container">
          <div className="sd-section__header">
            <h2 className="sd-section__title">
              <HiSparkles style={{ color: 'var(--orange-500)' }} /> {t.serviceDetails.exploreTitle}
            </h2>
            <p className="sd-section__subtitle">{t.serviceDetails.exploreSubtitle}</p>
          </div>

          <div className="sd-grid">
            {d.items.map((item, i) => (
              <div key={i} className="sd-card" style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="sd-card__image">
                  <img src={images[i]} alt={item.title} />
                  <div className="sd-card__image-overlay" />
                </div>
                <div className="sd-card__body">
                  <h3 className="sd-card__title">
                    <FaNetworkWired className="sd-card__title-icon sd-card__title-icon--orange" />
                    {item.title}
                  </h3>
                  <p className="sd-card__desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sd-cta">
        <div className="sd-cta__bg" />
        <div className="sd-cta__content container">
          <h2 className="sd-cta__title">{t.serviceDetails.ctaTitle}</h2>
          <p className="sd-cta__subtitle">{t.serviceDetails.ctaSubtitle}</p>
          <a href="https://wa.me/201098125573" target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
            <FaWhatsapp /> {t.serviceDetails.ctaBtn}
          </a>
        </div>
      </section>
    </div>
  );
}
