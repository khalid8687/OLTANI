import { useLang } from '../context/LanguageContext';
import { FaVideo, FaLaptopCode, FaBullhorn, FaNetworkWired, FaServer, FaWhatsapp } from 'react-icons/fa';
import { HiCheckCircle } from 'react-icons/hi';
import serviceVideo from '../assets/service-video.png';
import serviceSoftware from '../assets/service-software.png';
import serviceSocial from '../assets/service-social.png';
import serviceIntegration from '../assets/service-integration.png';
import serviceNetwork from '../assets/service-network.png';
import './Services.css';

export default function Services() {
  const { t, lang } = useLang();

  const services = [
    { icon: <FaVideo />, ...t.services.s1, image: serviceVideo, accent: 'blue' },
    { icon: <FaLaptopCode />, ...t.services.s2, image: serviceSoftware, accent: 'orange' },
    { icon: <FaBullhorn />, ...t.services.s3, image: serviceSocial, accent: 'blue' },
    { icon: <FaNetworkWired />, ...t.services.s4, image: serviceIntegration, accent: 'orange' },
    { icon: <FaServer />, ...t.services.s5, image: serviceNetwork, accent: 'blue' },
  ];

  return (
    <div className="services-page" id="services-page">
      {/* Hero Banner */}
      <section className="services-hero">
        <div className="services-hero__bg" />
        <div className="services-hero__particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="services-hero__particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }} />
          ))}
        </div>
        <div className="container services-hero__content">
          <h1 className="services-hero__title">{t.services.pageTitle}</h1>
          <p className="section-subtitle">{t.services.pageSubtitle}</p>
        </div>
      </section>

      {/* Service Sections */}
      {services.map((service, i) => (
        <section
          key={i}
          className={`service-section ${i % 2 !== 0 ? 'service-section--reverse' : ''}`}
          id={`service-${i + 1}`}
        >
          <div className={`service-section__glow service-section__glow--${service.accent}`} />
          <div className="container">
            <div className="service-section__grid">
              {/* Image */}
              <div className="service-section__image-wrap">
                <div className={`service-section__image-glow service-section__image-glow--${service.accent}`} />
                <img src={service.image} alt={service.title} className="service-section__image" />
                <div className="service-section__image-border" />
              </div>

              {/* Content */}
              <div className="service-section__content">
                <div className={`service-section__icon service-section__icon--${service.accent}`}>
                  {service.icon}
                </div>
                <h2 className="service-section__title">{service.title}</h2>
                <p className="service-section__desc">{service.desc}</p>

                <div className="service-section__features">
                  {service.features.map((f, j) => (
                    <div key={j} className="service-section__feature">
                      <HiCheckCircle className={`service-section__check service-section__check--${service.accent}`} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="https://wa.me/201002194451"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary service-section__cta"
                >
                  <FaWhatsapp />
                  {t.services.cta}
                </a>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
