import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { useLang } from '../context/LanguageContext';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import {
  FaPlay, FaPause, FaVolumeUp, FaVolumeMute,
  FaShareAlt, FaWhatsapp, FaFacebook, FaLink,
  FaHeadphones,
} from 'react-icons/fa';
import logo from '../assets/logo.webp';
import './AudioPost.css';

function formatTime(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function AudioPost() {
  const { id } = useParams();
  const { lang } = useLang();
  const navigate = useNavigate();
  const isRtl = lang === 'ar';

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Audio player state
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [buffered, setBuffered] = useState(0);

  // Share state
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const ref = doc(db, 'posts', id);
        const snap = await getDoc(ref);
        if (!snap.exists()) { setNotFound(true); return; }
        setPost({ id: snap.id, ...snap.data() });
        // Increment play count (fire-and-forget)
        updateDoc(ref, { plays: increment(1) }).catch(() => {});
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) { a.pause(); } else { a.play(); }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    const a = audioRef.current;
    if (!a) return;
    setCurrentTime(a.currentTime);
    if (a.buffered.length) setBuffered(a.buffered.end(a.buffered.length - 1));
  };

  const handleSeek = (e) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    a.currentTime = ratio * duration;
  };

  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    setMuted(v === 0);
  };

  const toggleMute = () => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !muted;
    setMuted(!muted);
  };

  const shareUrl = `${window.location.origin}${window.location.pathname.replace(/\/post\/.*/, '')}/post/${id}`;

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(shareUrl); } catch { }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareWhatsApp = () =>
    window.open(`https://wa.me/?text=${encodeURIComponent((post?.title || '') + '\n' + shareUrl)}`, '_blank');

  const shareFacebook = () =>
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');

  if (loading) return (
    <div className="audio-post-page ap-loading" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="ap-spinner" />
    </div>
  );

  if (notFound) return (
    <div className="audio-post-page ap-not-found" dir={isRtl ? 'rtl' : 'ltr'}>
      <FaHeadphones size={60} />
      <h2>{isRtl ? 'المقطع غير موجود' : 'Post not found'}</h2>
      <Link to="/leda" className="btn btn-primary">{isRtl ? 'العودة' : 'Go Back'}</Link>
    </div>
  );

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const bufferedPct = duration ? (buffered / duration) * 100 : 0;

  return (
    <div className="audio-post-page" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Background blur from cover */}
      {post.imageUrl && (
        <div className="ap-bg-blur" style={{ backgroundImage: `url(${post.imageUrl})` }} />
      )}
      <div className="ap-bg-overlay" />

      {/* Header */}
      <header className="ap-header container">
        <Link to="/leda" className="ap-back">
          {isRtl ? <HiArrowRight /> : <HiArrowLeft />}
          <span>{isRtl ? 'ليدا تيوب' : 'Leda Tube'}</span>
        </Link>
        <Link to="/" className="ap-logo">
          <img src={logo} alt="OLTANI" />
          <span className="ap-logo-text">
            <span className="text-blue">OLT</span><span className="text-orange">ANI</span>
          </span>
        </Link>
      </header>

      {/* Main content */}
      <main className="ap-main container">
        {/* Cover art */}
        <div className="ap-cover-wrap">
          {post.imageUrl
            ? <img src={post.imageUrl} alt={post.title} className="ap-cover" />
            : <div className="ap-cover-placeholder"><FaHeadphones size={60} /></div>
          }
          <div className="ap-cover-glow" />
        </div>

        {/* Info */}
        <div className="ap-info">
          <h1 className="ap-title">{post.title}</h1>

          {/* Audio element */}
          <audio
            ref={audioRef}
            src={post.audioUrl}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => { setIsPlaying(false); setCurrentTime(0); }}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
            preload="metadata"
          />

          {/* Player UI */}
          <div className="ap-player">
            {/* Progress bar */}
            <div className="ap-progress-wrap" onClick={handleSeek} role="slider" aria-label="seek">
              <div className="ap-progress-buffered" style={{ width: `${bufferedPct}%` }} />
              <div className="ap-progress-fill" style={{ width: `${progress}%` }} />
              <div className="ap-progress-thumb" style={{ left: `${progress}%` }} />
            </div>

            {/* Time */}
            <div className="ap-times">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            {/* Controls */}
            <div className="ap-controls">
              <div className="ap-volume">
                <button className="ap-vol-btn" onClick={toggleMute} aria-label="mute">
                  {muted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                <input
                  type="range" min="0" max="1" step="0.05"
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="ap-volume-slider"
                  aria-label="volume"
                />
              </div>

              <button
                className="ap-play-btn"
                onClick={togglePlay}
                aria-label={isPlaying ? 'pause' : 'play'}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>

              <div className="ap-share-wrap">
                <button
                  className="ap-share-btn"
                  onClick={() => setShowShare(!showShare)}
                  aria-label="share"
                >
                  <FaShareAlt />
                </button>
                {showShare && (
                  <div className="ap-share-menu">
                    <button onClick={copyLink} className="ap-share-item">
                      <FaLink />
                      <span>{copied ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ الرابط' : 'Copy Link')}</span>
                    </button>
                    <button onClick={shareWhatsApp} className="ap-share-item ap-share-wa">
                      <FaWhatsapp />
                      <span>WhatsApp</span>
                    </button>
                    <button onClick={shareFacebook} className="ap-share-item ap-share-fb">
                      <FaFacebook />
                      <span>Facebook</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Caption */}
          {post.caption && (
            <div className="ap-caption">
              <p>{post.caption}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
