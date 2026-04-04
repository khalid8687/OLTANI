import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { HiPaperAirplane } from 'react-icons/hi';
import './Contact.css';

export default function Contact() {
  const { t } = useLang();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Build WhatsApp message
    const msg = encodeURIComponent(
      `Hello OLTANI!%0A%0AName: ${formData.name}%0AEmail: ${formData.email}%0AMessage: ${formData.message}`
    );
    window.open(`https://wa.me/201002194451?text=${msg}`, '_blank');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="contact-page" id="contact-page">
      {/* Hero */}
      <section className="contact-hero">
        <div className="contact-hero__bg" />
        <div className="container contact-hero__content">
          <h1 className="section-title">{t.contact.pageTitle}</h1>
          <p className="section-subtitle">{t.contact.pageSubtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* WhatsApp Card */}
            <div className="contact-whatsapp glass-card">
              <div className="contact-whatsapp__icon">
                <FaWhatsapp size={40} />
              </div>
              <h2>{t.contact.whatsappTitle}</h2>
              <p>{t.contact.whatsappDesc}</p>
              <a
                href="https://wa.me/201002194451"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp contact-whatsapp__btn"
                id="contact-whatsapp-btn"
              >
                <FaWhatsapp />
                {t.contact.whatsappBtn}
              </a>
            </div>

            {/* Contact Form */}
            <div className="contact-form glass-card">
              <h2>{t.contact.formTitle}</h2>
              <form onSubmit={handleSubmit} id="contact-form">
                <div className="contact-form__group">
                  <input
                    type="text"
                    placeholder={t.contact.name}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    id="contact-name"
                  />
                </div>
                <div className="contact-form__group">
                  <input
                    type="email"
                    placeholder={t.contact.email}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    id="contact-email"
                  />
                </div>
                <div className="contact-form__group">
                  <textarea
                    placeholder={t.contact.message}
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    id="contact-message"
                  />
                </div>
                <button type="submit" className={`btn btn-primary contact-form__submit ${submitted ? 'submitted' : ''}`} id="contact-submit">
                  {submitted ? '✓' : (
                    <>
                      <HiPaperAirplane />
                      {t.contact.send}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="contact-info">
            <div className="contact-info__card glass-card">
              <FaPhone className="contact-info__icon" />
              <h4>{t.contact.phone}</h4>
              <a href="tel:+201002194451">+20 100 219 4451</a>
            </div>
            <div className="contact-info__card glass-card">
              <FaWhatsapp className="contact-info__icon" style={{ color: '#25d366' }} />
              <h4>WhatsApp</h4>
              <a href="https://wa.me/201002194451" target="_blank" rel="noopener noreferrer">+20 100 219 4451</a>
            </div>
            <div className="contact-info__card glass-card">
              <FaMapMarkerAlt className="contact-info__icon" />
              <h4>Egypt</h4>
              <span>Cairo, Egypt</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
