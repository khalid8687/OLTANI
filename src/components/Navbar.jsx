import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { HiMenu, HiX } from 'react-icons/hi';
import { TbLanguage } from 'react-icons/tb';
import TransparentLogo from './TransparentLogo';
import logo from '../assets/logo.png';
import './Navbar.css';

export default function Navbar() {
  const { t, toggleLang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const links = [
    { to: '/', label: t.nav.home },
    { to: '/services', label: t.nav.services },
    { to: '/about', label: t.nav.about },
    { to: '/leda', label: t.nav.leda },
    { to: '/contact', label: t.nav.contact },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="main-navbar">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo" id="nav-logo">
          <TransparentLogo src={logo} alt="OLTANI" />
          <span className="navbar__logo-text">
            <span className="text-blue">OLT</span>
            <span className="text-orange">ANI</span>
          </span>
        </Link>

        <div className={`navbar__links ${isOpen ? 'navbar__links--open' : ''}`}>
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar__link ${location.pathname === link.to ? 'navbar__link--active' : ''}`}
            >
              {link.label}
              <span className="navbar__link-indicator" />
            </Link>
          ))}
          <button className="navbar__lang" onClick={toggleLang} id="lang-toggle" aria-label="Toggle language">
            <TbLanguage size={20} />
            <span>{t.nav.langToggle}</span>
          </button>
        </div>

        <div className="navbar__actions">
          <button className="navbar__lang navbar__lang--desktop" onClick={toggleLang} id="lang-toggle-desktop" aria-label="Toggle language">
            <TbLanguage size={20} />
            <span>{t.nav.langToggle}</span>
          </button>
          <button
            className="navbar__burger"
            onClick={() => setIsOpen(!isOpen)}
            id="nav-burger"
            aria-label="Toggle menu"
          >
            {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
