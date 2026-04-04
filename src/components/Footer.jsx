import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { FaWhatsapp, FaHeart } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import TransparentLogo from './TransparentLogo';
import logo from '../assets/logo.png';
import './Footer.css';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="footer" id="footer">
      <div className="footer__glow" />
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <TransparentLogo src={logo} alt="OLTANI" />
              <span>
                <span className="text-blue">OLT</span>
                <span className="text-orange">ANI</span>
              </span>
            </Link>
            <p className="footer__tagline">{t.footer.tagline}</p>
            <p className="footer__full-name">Open Link Technologies &<br />Artificial Network Intelligence</p>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4>{t.footer.quickLinks}</h4>
            <Link to="/">{t.nav.home}</Link>
            <Link to="/services">{t.nav.services}</Link>
            <Link to="/about">{t.nav.about}</Link>
            <Link to="/leda">{t.nav.leda}</Link>
          </div>

          {/* Services */}
          <div className="footer__col">
            <h4>{t.footer.services}</h4>
            <Link to="/services">{t.services.s1.short}</Link>
            <Link to="/services">{t.services.s2.short}</Link>
            <Link to="/services">{t.services.s3.short}</Link>
            <Link to="/services">{t.services.s4.short}</Link>
            <Link to="/services">{t.services.s5.short}</Link>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4>{t.footer.getInTouch}</h4>
            <a href="https://wa.me/201002194451" target="_blank" rel="noopener noreferrer" className="footer__whatsapp">
              <FaWhatsapp /> WhatsApp
            </a>
            <Link to="/contact">{t.nav.contact}</Link>
          </div>
        </div>

        <div className="footer__divider" />

        <div className="footer__bottom">
          <p>{t.footer.rights}</p>
          <p className="footer__built">
            {t.footer.builtWith} <HiSparkles className="footer__icon" />
          </p>
        </div>
      </div>
    </footer>
  );
}
