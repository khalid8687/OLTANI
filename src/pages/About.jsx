import { useLang } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import AnimatedCounter from '../components/AnimatedCounter';
import {
  HiLightningBolt, HiStar, HiUsers, HiCurrencyDollar,
  HiCheckCircle, HiSparkles, HiClock, HiGlobeAlt,
} from 'react-icons/hi';
import { FaWhatsapp, FaQuoteLeft, FaAward, FaRocket, FaHeadset, FaBrain } from 'react-icons/fa';
import founderImg from '../assets/founder.webp';
import heroBg from '../assets/hero-bg.webp';
import officeImg from '../assets/about-office.webp';
import whyUsImg from '../assets/about-whyus.webp';
import './About.css';

export default function About() {
  const { t, lang } = useLang();

  const values = [
    { icon: <HiLightningBolt />, ...t.about.v1 },
    { icon: <HiStar />, ...t.about.v2 },
    { icon: <HiUsers />, ...t.about.v3 },
    { icon: <HiCurrencyDollar />, ...t.about.v4 },
  ];

  const whyIcons = [<HiClock />, <FaBrain />, <FaRocket />, <HiGlobeAlt />, <FaAward />, <FaHeadset />];

  const clientLogos = [
    'Microsoft', 'Google', 'Amazon', 'Meta', 'IBM', 'Oracle',
    'Samsung', 'Vodafone', 'Orange', 'Etisalat',
  ];

  return (
    <div className="about-page" id="about-page">
      {/* Cinematic Hero */}
      <section className="about-hero">
        <div className="about-hero__bg">
          <img src={officeImg} alt="" aria-hidden="true" fetchpriority="high" />
        </div>
        <div className="about-hero__overlay" />
        <div className="about-hero__particles">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="about-hero__particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }} />
          ))}
        </div>
        <div className="container about-hero__content">
          <span className="about-hero__since">{t.about.since}</span>
          <h1 className="about-hero__title">{t.about.pageTitle}</h1>
          <p className="about-hero__tagline">{t.about.heroTagline}</p>
          <p className="about-hero__subtitle">{t.about.pageSubtitle}</p>
        </div>
      </section>

      {/* Story Section with Image */}
      <section className="section about-story-section">
        <div className="container">
          <div className="about-story-grid">
            <div className="about-story__text-wrap">
              <span className="about-story__label"><HiSparkles /> {lang === 'ar' ? 'قصتنا' : 'Our Story'}</span>
              <p className="about-story__text">{t.about.story}</p>
              <p className="about-story__text about-story__text--sub">{t.about.story2}</p>
            </div>
            <div className="about-story__image-wrap">
              <div className="about-story__image-glow" />
              <img src={officeImg} alt="OLTANI Office" className="about-story__image" loading="lazy" />
              <div className="about-story__image-badge">
                <span className="about-story__badge-number">25+</span>
                <span className="about-story__badge-label">{lang === 'ar' ? 'سنة خبرة' : 'Years'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section about-mv-section">
        <div className="container">
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
              <span className="about-stats__number"><AnimatedCounter end={25} suffix="+" /></span>
              <span className="about-stats__label">{lang === 'ar' ? 'سنة خبرة' : 'Years Experience'}</span>
            </div>
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
          </div>
        </div>
      </section>

      {/* Why Choose OLTANI */}
      <section className="section about-why-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t.about.whyTitle}</h2>
            <p className="section-subtitle">{t.about.whySubtitle}</p>
          </div>
          <div className="about-why__grid">
            {t.about.why.map((item, i) => (
              <div key={i} className="about-why__card glass-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`about-why__icon ${i % 2 === 0 ? 'about-why__icon--blue' : 'about-why__icon--orange'}`}>
                  {whyIcons[i]}
                </div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="section about-founder-section">
        <div className="container">
          <div className="about-founder-grid">
            <div className="about-founder__image-wrap">
              <div className="about-founder__image-glow" />
              <img src={founderImg} alt={t.about.founderName} className="about-founder__image" loading="lazy" />
              <div className="about-founder__image-border" />
            </div>
            <div className="about-founder__info">
              <span className="about-founder__role">{t.about.founder}</span>
              <h2 className="about-founder__name">{t.about.founderName}</h2>
              <p className="about-founder__desc">{t.about.founderDesc}</p>
              <div className="about-founder__quote">
                <FaQuoteLeft className="about-founder__quote-icon" />
                <blockquote>{t.about.founderQuote}</blockquote>
              </div>
              <a href="https://wa.me/201098125573" target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                <FaWhatsapp /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="section about-process-section">
        <div className="about-process__bg">
          <img src={whyUsImg} alt="" aria-hidden="true" loading="lazy" />
        </div>
        <div className="about-process__overlay" />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-header">
            <h2 className="section-title">{t.about.processTitle}</h2>
            <p className="section-subtitle">{t.about.processSubtitle}</p>
          </div>
          <div className="about-process__grid">
            {t.about.process.map((step, i) => (
              <div key={i} className="about-process__step" style={{ animationDelay: `${i * 0.2}s` }}>
                <div className="about-process__step-number">{step.step}</div>
                <div className="about-process__step-line" />
                <h4 className="about-process__step-title">{step.title}</h4>
                <p className="about-process__step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Logos */}
      <section className="section about-clients-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t.about.clientsTitle}</h2>
            <p className="section-subtitle">{t.about.clientsSubtitle}</p>
          </div>
          <div className="about-clients__grid">
            {clientLogos.map((name, i) => (
              <div key={i} className="about-clients__logo glass-card">
                <span>{name}</span>
              </div>
            ))}
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

      {/* CTA */}
      <section className="about-cta">
        <div className="about-cta__bg" />
        <div className="about-cta__content container">
          <h2 className="about-cta__title">{t.about.ctaTitle}</h2>
          <p className="about-cta__desc">{t.about.ctaDesc}</p>
          <div className="about-cta__actions">
            <a href="https://wa.me/201098125573" target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
              <FaWhatsapp /> {t.hero.cta2}
            </a>
            <Link to="/services" className="btn btn-outline">
              {t.hero.cta1}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
