import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import ParticleNetwork from '../components/ParticleNetwork';
import AnimatedCounter from '../components/AnimatedCounter';
import TransparentLogo from '../components/TransparentLogo';
import { FaWhatsapp, FaVideo, FaLaptopCode, FaBullhorn, FaNetworkWired, FaServer } from 'react-icons/fa';
import { HiArrowRight, HiSparkles } from 'react-icons/hi';
import logo from '../assets/logo.png';
import banner from '../assets/banner.png';
import heroBg from '../assets/hero-bg.png';
import serviceVideo from '../assets/service-video.png';
import serviceSoftware from '../assets/service-software.png';
import serviceSocial from '../assets/service-social.png';
import serviceIntegration from '../assets/service-integration.png';
import serviceNetwork from '../assets/service-network.png';
import './Home.css';

export default function Home() {
  const { t, lang } = useLang();

  const services = [
    { icon: <FaVideo />, title: t.services.s1.short, desc: t.services.s1.title, image: serviceVideo },
    { icon: <FaLaptopCode />, title: t.services.s2.short, desc: t.services.s2.title, image: serviceSoftware },
    { icon: <FaBullhorn />, title: t.services.s3.short, desc: t.services.s3.title, image: serviceSocial },
    { icon: <FaNetworkWired />, title: t.services.s4.short, desc: t.services.s4.title, image: serviceIntegration },
    { icon: <FaServer />, title: t.services.s5.short, desc: t.services.s5.title, image: serviceNetwork },
  ];

  return (
    <div className="home" id="home-page">
      {/* Hero */}
      <section className="hero" id="hero-section">
        <div className="hero__bg-image">
          <img src={heroBg} alt="" aria-hidden="true" />
        </div>
        <ParticleNetwork />
        <div className="hero__overlay" />
        <div className="hero__content container">
          <div className="hero__badge">
            <HiSparkles />
            <span>{t.hero.badge}</span>
          </div>

          <TransparentLogo src={logo} alt="OLTANI" className="hero__logo" />

          <h1 className="hero__title">
            {t.hero.title1}{' '}
            <span className="hero__title-highlight">{t.hero.titleHighlight}</span>
          </h1>

          <p className="hero__subtitle">{t.hero.subtitle}</p>

          <div className="hero__ctas">
            <Link to="/services" className="btn btn-primary" id="hero-cta-services">
              {t.hero.cta1}
              <HiArrowRight className={lang === 'ar' ? 'flip-icon' : ''} />
            </Link>
            <a
              href="https://wa.me/201002194451"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
              id="hero-cta-whatsapp"
            >
              <FaWhatsapp />
              {t.hero.cta2}
            </a>
          </div>

          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-number">
                <AnimatedCounter end={150} suffix="+" />
              </span>
              <span className="hero__stat-label">{t.hero.statsProjects}</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-number">
                <AnimatedCounter end={80} suffix="+" />
              </span>
              <span className="hero__stat-label">{t.hero.statsClients}</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-number">
                <AnimatedCounter end={12} suffix="+" />
              </span>
              <span className="hero__stat-label">{t.hero.statsCountries}</span>
            </div>
          </div>
        </div>
        <div className="hero__scroll-indicator">
          <div className="hero__scroll-mouse">
            <div className="hero__scroll-dot" />
          </div>
        </div>
      </section>

      {/* Services Preview with Images */}
      <section className="home-services section" id="home-services">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t.services.pageTitle}</h2>
            <p className="section-subtitle">{t.services.pageSubtitle}</p>
          </div>

          <div className="home-services__grid">
            {services.map((s, i) => (
              <Link to="/services" key={i} className="home-service-card" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="home-service-card__image">
                  <img src={s.image} alt={s.title} />
                  <div className="home-service-card__image-overlay" />
                </div>
                <div className="home-service-card__body">
                  <div className="home-service-card__icon">{s.icon}</div>
                  <h3 className="home-service-card__title">{s.title}</h3>
                  <p className="home-service-card__desc">{s.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="home-services__cta">
            <Link to="/services" className="btn btn-primary">
              {t.hero.cta1}
              <HiArrowRight className={lang === 'ar' ? 'flip-icon' : ''} />
            </Link>
          </div>
        </div>
      </section>

      {/* Banner Showcase */}
      <section className="home-banner" id="home-banner">
        <div className="home-banner__bg">
          <img src={banner} alt="OLTANI Services" />
        </div>
        <div className="home-banner__overlay" />
        <div className="home-banner__content container">
          <h2 className="home-banner__title">
            <span className="text-blue">OLTANI:</span>{' '}
            <span className="text-orange">Accelerating Your Success</span>
          </h2>
          <Link to="/contact" className="btn btn-primary home-banner__btn">
            <FaWhatsapp />
            {t.hero.cta2}
          </Link>
        </div>
      </section>
    </div>
  );
}
