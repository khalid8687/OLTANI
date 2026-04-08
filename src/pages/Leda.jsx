import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { FaFacebook, FaQuoteLeft } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';
import leda from '../assets/leda.webp';
import './Leda.css';

export default function Leda() {
  const { t, lang } = useLang();

  return (
    <div className="leda-page" id="leda-page">
      {/* Hero Banner */}
      <section className="leda-hero">
        <div className="leda-hero__bg">
          <img src={leda} alt="Leda - OLTANI Brand Ambassador" />
        </div>
        <div className="leda-hero__overlay" />
        <div className="container leda-hero__content">
          <span className="leda-hero__label">{t.leda.pageTitle}</span>
          <h1 className="leda-hero__name">{t.leda.name}</h1>
          <p className="leda-hero__role">{t.leda.role}</p>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container">
          <div className="leda-content">
            <div className="leda-content__main">
              <div className="leda-quote glass-card">
                <FaQuoteLeft className="leda-quote__icon" />
                <blockquote>{t.leda.quote}</blockquote>
                <cite>— {t.leda.name}</cite>
              </div>

              <p className="leda-content__desc">{t.leda.desc}</p>

              <div className="leda-content__actions">
                <a
                  href="https://www.facebook.com/ledahanem"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  id="leda-facebook-btn"
                >
                  <FaFacebook />
                  {t.leda.followCta}
                </a>
                <Link to="/services" className="btn btn-outline" id="leda-services-btn">
                  {t.leda.learnMore}
                  <HiArrowRight className={lang === 'ar' ? 'flip-icon' : ''} />
                </Link>
              </div>
            </div>

            <div className="leda-content__image">
              <div className="leda-content__image-glow" />
              <img src={leda} alt="Leda" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
