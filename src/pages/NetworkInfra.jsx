import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { FaServer, FaWhatsapp } from 'react-icons/fa';
import { HiArrowLeft, HiSparkles } from 'react-icons/hi';
import AnimatedCounter from '../components/AnimatedCounter';
import imgDesign from '../assets/services/network_design.png';
import imgHardware from '../assets/services/network_hardware.png';
import imgBranch from '../assets/services/network_branch.png';
import imgInfra from '../assets/services/network_infrastructure.png';
import imgMonitor from '../assets/services/network_monitoring.png';
import imgGlobal from '../assets/services/network_global.png';
import imgBranchInter from '../assets/services/network_branch_inter.png';
import imgVoip from '../assets/services/network_voip.png';
import imgCyber from '../assets/services/network_cybersecurity.png';
import imgDomains from '../assets/services/network_domains.png';
import imgBackup from '../assets/services/network_backup.png';
import './ServiceDetail.css';

const images = [
  imgDesign, imgHardware, imgBranch, imgInfra, imgMonitor, imgGlobal,
  imgBranchInter, imgVoip, imgCyber, imgDomains, imgBackup,
];

export default function NetworkInfra() {
  const { t, lang } = useLang();
  const d = t.serviceDetails.network;

  return (
    <div className="services-page" id="network-infra-page">
      <section className="sd-hero">
        <div className="sd-hero__bg">
          <img src={imgHardware} alt="" aria-hidden="true" />
        </div>
        <div className="sd-hero__overlay" />
        <div className="sd-hero__content container">
          <Link to="/services" className="sd-back">
            <HiArrowLeft /> {t.services.backToServices}
          </Link>
          <div className="sd-hero__icon sd-hero__icon--blue">
            <FaServer />
          </div>
          <h1 className="sd-hero__title">{t.services.s5.title}</h1>
          <p className="sd-hero__desc">{d.heroDesc}</p>
        </div>
      </section>

      <div className="container">
        <div className="sd-stats">
          <div className="sd-stat">
            <span className="sd-stat__number"><AnimatedCounter end={300} suffix="+" /></span>
            <span className="sd-stat__label">{lang === 'ar' ? 'شبكة منفذة' : 'Networks Deployed'}</span>
          </div>
          <div className="sd-stat">
            <span className="sd-stat__number"><AnimatedCounter end={12} suffix="+" /></span>
            <span className="sd-stat__label">{lang === 'ar' ? 'دولة' : 'Countries'}</span>
          </div>
          <div className="sd-stat">
            <span className="sd-stat__number"><AnimatedCounter end={99} suffix=".9%" /></span>
            <span className="sd-stat__label">{lang === 'ar' ? 'وقت التشغيل' : 'Uptime'}</span>
          </div>
          <div className="sd-stat">
            <span className="sd-stat__number"><AnimatedCounter end={24} suffix="/7" /></span>
            <span className="sd-stat__label">{lang === 'ar' ? 'مراقبة' : 'Monitoring'}</span>
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
              <div key={i} className="sd-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="sd-card__image">
                  <img src={images[i]} alt={item.title} />
                  <div className="sd-card__image-overlay" />
                </div>
                <div className="sd-card__body">
                  <h3 className="sd-card__title">
                    <FaServer className="sd-card__title-icon" />
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
          <a href="https://wa.me/201002194451" target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
            <FaWhatsapp /> {t.serviceDetails.ctaBtn}
          </a>
        </div>
      </section>
    </div>
  );
}
