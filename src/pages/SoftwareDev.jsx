import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { FaLaptopCode, FaWhatsapp } from 'react-icons/fa';
import { HiArrowLeft, HiSparkles } from 'react-icons/hi';
import AnimatedCounter from '../components/AnimatedCounter';
import imgCrm from '../assets/services/software_crm_erp.png';
import imgFinance from '../assets/services/software_finance.png';
import imgClinic from '../assets/services/software_clinic.png';
import imgRestaurant from '../assets/services/software_restaurant.png';
import imgRetail from '../assets/services/software_retail.png';
import imgChatbot from '../assets/services/software_chatbot.png';
import './ServiceDetail.css';

const images = [imgCrm, imgFinance, imgClinic, imgRestaurant, imgRetail, imgChatbot];

export default function SoftwareDev() {
  const { t, lang } = useLang();
  const d = t.serviceDetails.software;

  return (
    <div className="services-page" id="software-dev-page">
      <section className="sd-hero">
        <div className="sd-hero__bg">
          <img src={imgCrm} alt="" aria-hidden="true" />
        </div>
        <div className="sd-hero__overlay" />
        <div className="sd-hero__content container">
          <Link to="/services" className="sd-back">
            <HiArrowLeft /> {t.services.backToServices}
          </Link>
          <div className="sd-hero__icon sd-hero__icon--orange">
            <FaLaptopCode />
          </div>
          <h1 className="sd-hero__title">{t.services.s2.title}</h1>
          <p className="sd-hero__desc">{d.heroDesc}</p>
        </div>
      </section>

      <div className="container">
        <div className="sd-stats">
          <div className="sd-stat">
            <span className="sd-stat__number"><AnimatedCounter end={120} suffix="+" /></span>
            <span className="sd-stat__label">{lang === 'ar' ? 'تطبيق مبني' : 'Apps Built'}</span>
          </div>
          <div className="sd-stat">
            <span className="sd-stat__number"><AnimatedCounter end={99} suffix=".9%" /></span>
            <span className="sd-stat__label">{lang === 'ar' ? 'وقت التشغيل' : 'Uptime'}</span>
          </div>
          <div className="sd-stat">
            <span className="sd-stat__number"><AnimatedCounter end={24} suffix="/7" /></span>
            <span className="sd-stat__label">{lang === 'ar' ? 'دعم فني' : 'Support'}</span>
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
                    <FaLaptopCode className="sd-card__title-icon sd-card__title-icon--orange" />
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
