import { useLang } from '../context/LanguageContext';
import AnimatedCounter from '../components/AnimatedCounter';
import { HiLightningBolt, HiStar, HiUsers, HiCurrencyDollar } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import founderImg from '../assets/founder.png';
import heroBg from '../assets/hero-bg.png';
import './About.css';

export default function About() {
  const { t } = useLang();

  const values = [
    { icon: <HiLightningBolt />, ...t.about.v1 },
    { icon: <HiStar />, ...t.about.v2 },
    { icon: <HiUsers />, ...t.about.v3 },
    { icon: <HiCurrencyDollar />, ...t.about.v4 },
  ];

  return (
    <div className="about-page" id="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero__bg">
          <img src={heroBg} alt="" aria-hidden="true" />
        </div>
        <div className="about-hero__overlay" />
        <div className="container about-hero__content">
          <h1 className="section-title">{t.about.pageTitle}</h1>
          <p className="section-subtitle">{t.about.pageSubtitle}</p>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div className="about-story">
            <p className="about-story__text">{t.about.story}</p>
          </div>

          {/* Mission & Vision */}
          <div className="about-mv">
            <div className="about-mv__card glass-card">
              <div className="about-mv__icon-wrap about-mv__icon-wrap--blue">
                <HiLightningBolt size={28} />
              </div>
              <h3>{t.about.mission}</h3>
              <p>{t.about.missionText}</p>
            </div>
            <div className="about-mv__card glass-card">
              <div className="about-mv__icon-wrap about-mv__icon-wrap--orange">
                <HiStar size={28} />
              </div>
              <h3>{t.about.vision}</h3>
              <p>{t.about.visionText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="about-stats">
        <div className="container">
          <div className="about-stats__grid">
            <div className="about-stats__item">
              <span className="about-stats__number"><AnimatedCounter end={150} suffix="+" /></span>
              <span className="about-stats__label">{t.hero.statsProjects}</span>
            </div>
            <div className="about-stats__item">
              <span className="about-stats__number"><AnimatedCounter end={80} suffix="+" /></span>
              <span className="about-stats__label">{t.hero.statsClients}</span>
            </div>
            <div className="about-stats__item">
              <span className="about-stats__number"><AnimatedCounter end={12} suffix="+" /></span>
              <span className="about-stats__label">{t.hero.statsCountries}</span>
            </div>
            <div className="about-stats__item">
              <span className="about-stats__number"><AnimatedCounter end={5} /></span>
              <span className="about-stats__label">{t.about.values}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Founder — Full visual section */}
      <section className="section about-founder-section">
        <div className="container">
          <div className="about-founder-grid">
            <div className="about-founder__image-wrap">
              <div className="about-founder__image-glow" />
              <img src={founderImg} alt={t.about.founderName} className="about-founder__image" />
              <div className="about-founder__image-border" />
            </div>
            <div className="about-founder__info">
              <span className="about-founder__role">{t.about.founder}</span>
              <h2 className="about-founder__name">{t.about.founderName}</h2>
              <p className="about-founder__desc">{t.about.founderDesc}</p>
              <a
                href="https://wa.me/201002194451"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                <FaWhatsapp /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t.about.values}</h2>
          </div>
          <div className="about-values__grid">
            {values.map((v, i) => (
              <div key={i} className="about-value glass-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="about-value__icon">{v.icon}</div>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
