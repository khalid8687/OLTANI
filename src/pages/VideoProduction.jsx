import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { FaVideo, FaWhatsapp } from 'react-icons/fa';
import { HiArrowLeft, HiSparkles } from 'react-icons/hi';
import AnimatedCounter from '../components/AnimatedCounter';
import videoCorporate from '../assets/services/video_corporate.png';
import videoSocial from '../assets/services/video_social_viral.png';
import video3d from '../assets/services/video_3d_cartoon.png';
import videoReels from '../assets/services/video_reels.png';
import './ServiceDetail.css';

const images = [videoCorporate, videoSocial, video3d, videoReels];

export default function VideoProduction() {
  const { t, lang } = useLang();
  const d = t.serviceDetails.video;

  return (
    <div className="services-page" id="video-production-page">
      {/* Hero */}
      <section className="sd-hero">
        <div className="sd-hero__bg">
          <img src={videoCorporate} alt="" aria-hidden="true" />
        </div>
        <div className="sd-hero__overlay" />
        <div className="sd-hero__content container">
          <Link to="/services" className="sd-back">
            <HiArrowLeft /> {t.services.backToServices}
          </Link>
          <div className="sd-hero__icon sd-hero__icon--blue">
            <FaVideo />
          </div>
          <h1 className="sd-hero__title">{t.services.s1.title}</h1>
          <p className="sd-hero__desc">{d.heroDesc}</p>
        </div>
      </section>

      {/* Stats */}
      <div className="container">
        <div className="sd-stats">
          <div className="sd-stat">
            <span className="sd-stat__number"><AnimatedCounter end={500} suffix="+" /></span>
            <span className="sd-stat__label">{lang === 'ar' ? 'فيديو منتج' : 'Videos Produced'}</span>
          </div>
          <div className="sd-stat">
            <span className="sd-stat__number"><AnimatedCounter end={50} suffix="M+" /></span>
            <span className="sd-stat__label">{lang === 'ar' ? 'مشاهدة' : 'Total Views'}</span>
          </div>
          <div className="sd-stat">
            <span className="sd-stat__number"><AnimatedCounter end={98} suffix="%" /></span>
            <span className="sd-stat__label">{lang === 'ar' ? 'رضا العملاء' : 'Client Satisfaction'}</span>
          </div>
        </div>
      </div>

      {/* Sub-Services */}
      <section className="sd-section">
        <div className="container">
          <div className="sd-section__header">
            <h2 className="sd-section__title">
              <HiSparkles style={{ color: 'var(--blue-400)' }} /> {t.serviceDetails.exploreTitle}
            </h2>
            <p className="sd-section__subtitle">{t.serviceDetails.exploreSubtitle}</p>
          </div>

          <div className="sd-grid sd-grid--2col">
            {d.items.map((item, i) => (
              <div key={i} className="sd-card" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="sd-card__image">
                  <img src={images[i]} alt={item.title} />
                  <div className="sd-card__image-overlay" />
                </div>
                <div className="sd-card__body">
                  <h3 className="sd-card__title">
                    <FaVideo className="sd-card__title-icon" />
                    {item.title}
                  </h3>
                  <p className="sd-card__desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sd-cta">
        <div className="sd-cta__bg" />
        <div className="sd-cta__content container">
          <h2 className="sd-cta__title">{t.serviceDetails.ctaTitle}</h2>
          <p className="sd-cta__subtitle">{t.serviceDetails.ctaSubtitle}</p>
          <a
            href="https://wa.me/201098125573"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
          >
            <FaWhatsapp /> {t.serviceDetails.ctaBtn}
          </a>
        </div>
      </section>
    </div>
  );
}
