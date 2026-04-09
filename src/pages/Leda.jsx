import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useLang } from '../context/LanguageContext';
import { FaFacebook, FaQuoteLeft, FaHeadphones, FaPlay } from 'react-icons/fa';
import { HiArrowRight, HiSparkles } from 'react-icons/hi';
import leda from '../assets/leda.webp';
import './Leda.css';

// ── Post card ────────────────────────────────────────────────
function PostCard({ post }) {
  return (
    <Link to={`/leda/post/${post.id}`} className="lt-card" id={`post-${post.id}`}>
      <div className="lt-card__image-wrap">
        {post.imageUrl
          ? <img src={post.imageUrl} alt={post.title} className="lt-card__image" loading="lazy" />
          : (
            <div className="lt-card__image lt-card__image--placeholder">
              <FaHeadphones size={40} />
            </div>
          )
        }
        <div className="lt-card__play-overlay">
          <span className="lt-card__play-btn"><FaPlay /></span>
        </div>
        {post.plays > 0 && (
          <span className="lt-card__plays">▶ {post.plays}</span>
        )}
      </div>
      <div className="lt-card__body">
        <h3 className="lt-card__title">{post.title}</h3>
        {post.caption && (
          <p className="lt-card__caption">
            {post.caption.length > 90 ? post.caption.slice(0, 90) + '…' : post.caption}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function Leda() {
  const { t, lang } = useLang();

  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch {
        // silently fail — user sees empty section
      } finally {
        setLoadingPosts(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="leda-page" id="leda-page">

      {/* ── Hero Banner ── */}
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

      {/* ── Leda Tube Section ── */}
      <section className="lt-section section" id="leda-tube">
        <div className="container">
          <div className="lt-header">
            <div className="lt-header__text">
              <span className="lt-header__label"><HiSparkles /> Leda Tube</span>
              <h2 className="lt-header__title">
                {lang === 'ar' ? 'أحدث المقاطع الصوتية' : 'Latest Audio Clips'}
              </h2>
            </div>
          </div>

          {loadingPosts ? (
            <div className="lt-loading">
              <div className="lt-spinner" />
            </div>
          ) : posts.length === 0 ? (
            <div className="lt-empty">
              <FaHeadphones size={56} />
              <p>{lang === 'ar' ? 'لا يوجد مقاطع بعد' : 'No clips yet. Check back soon!'}</p>
            </div>
          ) : (
            <div className="lt-grid">
              {posts.map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── Ambassador Content (original) ── */}
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
              <img src={leda} alt="Leda" loading="lazy" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
