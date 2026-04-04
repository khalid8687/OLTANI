import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { FaBullhorn, FaWhatsapp } from 'react-icons/fa';
import { HiArrowLeft, HiSparkles } from 'react-icons/hi';
import AnimatedCounter from '../components/AnimatedCounter';
import imgBranding from '../assets/services/social_branding.png';
import imgContent from '../assets/services/social_content.png';
import imgAds from '../assets/services/social_ads.png';
import imgGrowth from '../assets/services/social_growth.png';
import imgAnalytics from '../assets/services/social_analytics.png';
import imgSales from '../assets/services/social_sales.png';
import './ServiceDetail.css';

const images = [imgBranding, imgContent, imgAds, imgGrowth, imgAnalytics, imgSales];

export default function SocialMedia() {
  const { t, lang } = useLang();
  const d = t.serviceDetails.social;

  return (
    <div className="services-page" id="social-media-page">
      <section className="sd-hero">
        <div className="sd-hero__bg">
          <img src={imgBranding} alt="" aria-hidden="true" />
        </div>
        <div className="sd-hero__overlay" />
        <div className="sd-hero__content container">
          <Link to="/services" className="sd-back">
            <HiArrowLeft /> {t.services.backToServices}
          </Link>
          <div className="sd-hero__icon sd-hero__icon--blue">
            <FaBullhorn />
          </div>
          <h1 className="sd-hero__title">{t.services.s3.title}</h1>
          <p className="sd-hero__desc">{d.heroDesc}</p>
        </div>
      </section>

      <div className="container">
        <div className="sd-stats">
          <div className="sd-stat">
            <span className="sd-stat__number"><AnimatedCounter end={200} suffix="+" /></span>
            <span className="sd-stat__label">{lang === 'ar' ? 'صفحة مدارة' : 'Pages Managed'}</span>
          </div>
          <div className="sd-stat">
            <span className="sd-stat__number"><AnimatedCounter end={10} suffix="M+" /></span>
            <span className="sd-stat__label">{lang === 'ar' ? 'متابع مكتسب' : 'Followers Gained'}</span>
          </div>
          <div className="sd-stat">
            <span className="sd-stat__number"><AnimatedCounter end={300} suffix="%" /></span>
            <span className="sd-stat__label">{lang === 'ar' ? 'زيادة المبيعات' : 'Sales Increase'}</span>
          </div>
        </div>
      </div>

      <section className="sd-section">
        <div className="container">
          <div className="sd-section__header">
            <h2 className="sd-section__title">
              <HiSparkles style={{ color: 'var(--blue-400)' }} /> {t.serviceDetails.exploreTitle}
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
                    <FaBullhorn className="sd-card__title-icon" />
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
