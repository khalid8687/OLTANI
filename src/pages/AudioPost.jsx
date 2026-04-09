import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { useLang } from '../context/LanguageContext';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import {
  FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaVolumeDown,
  FaShareAlt, FaWhatsapp, FaFacebook, FaLink, FaHeadphones,
  FaDownload, FaRedo, FaStepBackward, FaStepForward,
} from 'react-icons/fa';
import { MdSpeed, MdReplay, MdSpeed as MdSpeedOff } from 'react-icons/md';
import logo from '../assets/logo.webp';
import mosqueBg from '../assets/leda-mosque.jpeg';
import './AudioPost.css';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const SKIP = 15; // seconds

function formatTime(s) {
  if (!s || isNaN(s) || !isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function AudioPost() {
  const { id } = useParams();
  const { lang } = useLang();
  const isRtl = lang === 'ar';

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Player state
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const isDragging = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(2); // index 2 = 1x
  const [isLooping, setIsLooping] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(true);

  // Share state
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Fetch post
  useEffect(() => {
    async function fetchPost() {
      try {
        const ref = doc(db, 'posts', id);
        const snap = await getDoc(ref);
        if (!snap.exists()) { setNotFound(true); return; }
        setPost({ id: snap.id, ...snap.data() });
        updateDoc(ref, { plays: increment(1) }).catch(() => {});
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  // Sync audio settings
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = volume;
    a.loop = isLooping;
    a.playbackRate = SPEEDS[speedIdx];
  }, [volume, isLooping, speedIdx]);

  // Close share menu on outside click
  useEffect(() => {
    if (!showShare) return;
    const close = (e) => {
      if (!e.target.closest('.ap-share-wrap')) setShowShare(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [showShare]);

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) a.pause();
    else a.play().catch(() => {});
  }, [isPlaying]);

  const skip = (sec) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.max(0, Math.min(a.duration || 0, a.currentTime + sec));
  };

  const handleTimeUpdate = () => {
    const a = audioRef.current;
    if (!a || isDragging.current) return;
    setCurrentTime(a.currentTime);
    if (a.buffered.length > 0) {
      setBuffered(a.buffered.end(a.buffered.length - 1));
    }
  };

  // Progress bar — click OR drag
  const seekTo = (e) => {
    const a = audioRef.current;
    const bar = progressRef.current;
    if (!a || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    a.currentTime = ratio * duration;
    setCurrentTime(a.currentTime);
  };

  const onMouseDown = (e) => { isDragging.current = true; seekTo(e); };
  const onMouseMove = (e) => { if (isDragging.current) seekTo(e); };
  const onMouseUp = () => { isDragging.current = false; };

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onMouseMove, { passive: false });
    window.addEventListener('touchend', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [duration]);

  // Volume icon
  const VolumeIcon = muted || volume === 0 ? FaVolumeMute
    : volume < 0.5 ? FaVolumeDown : FaVolumeUp;

  // Speed cycling
  const cycleSpeed = () => setSpeedIdx((i) => (i + 1) % SPEEDS.length);
  const currentSpeed = SPEEDS[speedIdx];

  // Download
  const handleDownload = async () => {
    if (!post?.audioUrl || downloading) return;
    setDownloading(true);
    try {
      const res = await fetch(post.audioUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${post.title || 'audio'}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback — open in new tab
      window.open(post.audioUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  // Share
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname.split('#')[0]}#/leda/post/${id}`
    : '';

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(shareUrl); } catch { }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareWhatsApp = () =>
    window.open(`https://wa.me/?text=${encodeURIComponent((post?.title || '') + '\n' + shareUrl)}`, '_blank');

  const shareFacebook = () =>
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');

  // — Render states —
  if (loading) return (
    <div className="audio-post-page ap-state-screen" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="ap-spinner-ring" />
      <p>{isRtl ? 'جارٍ التحميل…' : 'Loading…'}</p>
    </div>
  );

  if (notFound) return (
    <div className="audio-post-page ap-state-screen" dir={isRtl ? 'rtl' : 'ltr'}>
      <FaHeadphones size={64} style={{ color: 'var(--gray-600)' }} />
      <h2 style={{ margin: 0, color: 'var(--gray-300)' }}>
        {isRtl ? 'المقطع غير موجود' : 'Post not found'}
      </h2>
      <Link to="/leda" className="btn btn-primary">
        {isRtl ? 'العودة لليدا تيوب' : 'Back to Leda Tube'}
      </Link>
    </div>
  );

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const bufferedPct = duration ? (buffered / duration) * 100 : 0;

  return (
    <div className="audio-post-page" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Mosque background */}
      <div className="ap-bg-mosque" style={{ backgroundImage: `url(${mosqueBg})` }} />
      <div className="ap-bg-overlay" />

      {/* Header */}
      <header className="ap-header container">
        <Link to="/leda" className="ap-back">
          {isRtl ? <HiArrowRight /> : <HiArrowLeft />}
          <span>{isRtl ? 'ليدا تيوب' : 'Leda Tube'}</span>
        </Link>
        <Link to="/" className="ap-logo-link">
          <img src={logo} alt="OLTANI" className="ap-logo-img" />
          <span className="ap-logo-text">
            <span className="text-blue">OLT</span><span className="text-orange">ANI</span>
          </span>
        </Link>
      </header>

      {/* Content */}
      <main className="ap-main container">
        {/* Cover art */}
        <div className="ap-cover-wrap">
          {post.imageUrl
            ? <img src={post.imageUrl} alt={post.title} className="ap-cover" />
            : (
              <div className="ap-cover ap-cover--placeholder">
                <FaHeadphones size={72} />
              </div>
            )
          }
          <div className="ap-cover-glow" />

          {/* Spinning ring while loading audio */}
          {isAudioLoading && (
            <div className="ap-cover-loading">
              <div className="ap-spinner-ring ap-spinner-ring--sm" />
            </div>
          )}
        </div>

        {/* Player panel */}
        <div className="ap-panel">
          <h1 className="ap-title">{post.title}</h1>

          {/* Hidden audio element */}
          <audio
            ref={audioRef}
            src={post.audioUrl}
            preload="auto"
            loop={isLooping}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => { if (!isLooping) setIsPlaying(false); }}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => {
              setDuration(audioRef.current?.duration || 0);
              setIsAudioLoading(false);
            }}
            onWaiting={() => setIsAudioLoading(true)}
            onCanPlay={() => setIsAudioLoading(false)}
            onError={() => setIsAudioLoading(false)}
          />

          {/* Progress bar */}
          <div className="ap-progress-section">
            <div
              className="ap-progress-track"
              ref={progressRef}
              onMouseDown={onMouseDown}
              onTouchStart={onMouseDown}
              role="slider"
              aria-label="seek"
              aria-valuemin={0}
              aria-valuemax={duration}
              aria-valuenow={currentTime}
            >
              <div className="ap-progress-buffered" style={{ width: `${bufferedPct}%` }} />
              <div className="ap-progress-fill" style={{ width: `${progress}%` }} />
              <div className="ap-progress-thumb" style={{ left: `${progress}%` }} />
            </div>
            <div className="ap-times">
              <span>{formatTime(currentTime)}</span>
              <span className="ap-duration">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main controls row */}
          <div className="ap-controls-row">
            {/* Skip back */}
            <button className="ap-ctrl-btn ap-ctrl-skip" onClick={() => skip(-SKIP)} title={`-${SKIP}s`}>
              <FaStepBackward />
              <span className="ap-skip-label">{SKIP}</span>
            </button>

            {/* Play / Pause */}
            <button
              className={`ap-play-btn ${isAudioLoading ? 'ap-play-btn--loading' : ''}`}
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isAudioLoading
                ? <div className="ap-btn-spinner" />
                : isPlaying ? <FaPause /> : <FaPlay />
              }
            </button>

            {/* Skip forward */}
            <button className="ap-ctrl-btn ap-ctrl-skip" onClick={() => skip(SKIP)} title={`+${SKIP}s`}>
              <FaStepForward />
              <span className="ap-skip-label">{SKIP}</span>
            </button>
          </div>

          {/* Secondary controls row */}
          <div className="ap-secondary-row">
            {/* Volume */}
            <div className="ap-volume-group">
              <button
                className="ap-sm-btn"
                onClick={() => {
                  const newMuted = !muted;
                  setMuted(newMuted);
                  if (audioRef.current) audioRef.current.muted = newMuted;
                }}
                aria-label="toggle mute"
              >
                <VolumeIcon />
              </button>
              <input
                type="range" min="0" max="1" step="0.02"
                value={muted ? 0 : volume}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setVolume(v);
                  setMuted(v === 0);
                  if (audioRef.current) { audioRef.current.volume = v; audioRef.current.muted = false; }
                }}
                className="ap-volume-slider"
                aria-label="volume"
              />
            </div>

            {/* Right group: speed, repeat, download, share */}
            <div className="ap-right-group">
              {/* Speed */}
              <button
                className={`ap-sm-btn ap-speed-btn ${currentSpeed !== 1 ? 'ap-sm-btn--active' : ''}`}
                onClick={cycleSpeed}
                title="Playback speed"
                aria-label={`Speed: ${currentSpeed}x`}
              >
                {currentSpeed === 1 ? '1×' : `${currentSpeed}×`}
              </button>

              {/* Repeat */}
              <button
                className={`ap-sm-btn ${isLooping ? 'ap-sm-btn--active' : ''}`}
                onClick={() => {
                  const next = !isLooping;
                  setIsLooping(next);
                  if (audioRef.current) audioRef.current.loop = next;
                }}
                title={isLooping ? 'Repeat On' : 'Repeat Off'}
                aria-label="toggle repeat"
              >
                <FaRedo />
              </button>

              {/* Download */}
              <button
                className="ap-sm-btn"
                onClick={handleDownload}
                title="Download"
                aria-label="download"
                disabled={downloading}
              >
                {downloading ? <div className="ap-btn-spinner ap-btn-spinner--sm" /> : <FaDownload />}
              </button>

              {/* Share */}
              <div className="ap-share-wrap">
                <button
                  className="ap-sm-btn"
                  onClick={() => setShowShare(!showShare)}
                  title="Share"
                  aria-label="share"
                >
                  <FaShareAlt />
                </button>
                {showShare && (
                  <div className="ap-share-menu">
                    <button onClick={copyLink} className="ap-share-item">
                      <FaLink />
                      <span>{copied ? (isRtl ? '✓ تم النسخ' : '✓ Copied!') : (isRtl ? 'نسخ الرابط' : 'Copy Link')}</span>
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
