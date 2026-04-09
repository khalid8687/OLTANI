import { useState, useEffect, useRef } from 'react';
import {
  collection, addDoc, getDocs, updateDoc, deleteDoc,
  doc, serverTimestamp, orderBy, query,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged,
} from 'firebase/auth';
import { db, auth } from '../firebase';
import { FaTrash, FaEdit, FaSave, FaTimes, FaPlus, FaSignOutAlt, FaMusic, FaImage, FaCloud } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import logo from '../assets/logo.webp';
import './AdminPanel.css';

// ── Cloudinary config (unsigned upload — safe for frontend) ──
const CLOUD_NAME = 'dgucoutmf';
const UPLOAD_PRESET = 'ml_default';

/**
 * Upload a file to Cloudinary using unsigned upload preset.
 * resourceType: 'image' for images, 'video' for audio/video files.
 */
const uploadToCloudinary = (file, resourceType, onProgress) =>
  new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve(data.secure_url);
      } else {
        let msg = `Upload failed (${xhr.status})`;
        try { msg = JSON.parse(xhr.responseText)?.error?.message || msg; } catch {}
        reject(new Error(msg));
      }
    };

    xhr.onerror = () => reject(new Error('Network error — check your internet connection'));
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`);
    xhr.send(formData);
  });

// ── Upload progress bar ────────────────────────────────────────
function UploadProgress({ pct, label }) {
  return (
    <div className="adm-upload-wrap">
      <span className="adm-upload-label">{label}</span>
      <div className="adm-upload-bar">
        <div className="adm-upload-fill" style={{ width: `${pct}%` }} />
        <span>{Math.round(pct)}%</span>
      </div>
    </div>
  );
}

// ── Login screen ───────────────────────────────────────────────
function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm-login">
      <div className="adm-login__box">
        <div className="adm-login__logo">
          <img src={logo} alt="OLTANI" />
          <span>
            <span className="text-blue">OLT</span>
            <span className="text-orange">ANI</span>
          </span>
        </div>
        <h2>Leda Tube Admin</h2>
        <form onSubmit={handleSubmit} className="adm-login__form">
          <input
            type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} required
            className="adm-input"
          />
          <input
            type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} required
            className="adm-input"
          />
          {error && <p className="adm-error">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Add / Edit Post Modal ──────────────────────────────────────
function PostModal({ editPost, onClose, onSaved }) {
  const [title, setTitle] = useState(editPost?.title || '');
  const [caption, setCaption] = useState(editPost?.caption || '');
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(editPost?.imageUrl || '');
  const [imgPct, setImgPct] = useState(0);
  const [audPct, setAudPct] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploadStage, setUploadStage] = useState(''); // 'image' | 'audio' | 'saving'
  const [error, setError] = useState('');

  const audioInputRef = useRef();
  const imageInputRef = useRef();

  const handleImage = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required'); return; }
    if (!editPost && !audioFile) { setError('Audio file is required'); return; }
    setSaving(true);
    setError('');

    try {
      let imageUrl = editPost?.imageUrl || '';
      let audioUrl = editPost?.audioUrl || '';

      // 1. Upload image to Cloudinary
      if (imageFile) {
        setUploadStage('image');
        setImgPct(0);
        imageUrl = await uploadToCloudinary(imageFile, 'image', setImgPct);
      }

      // 2. Upload audio to Cloudinary (resource_type = 'video' handles audio too)
      if (audioFile) {
        setUploadStage('audio');
        setAudPct(0);
        audioUrl = await uploadToCloudinary(audioFile, 'video', setAudPct);
      }

      // 3. Save to Firestore
      setUploadStage('saving');
      if (editPost) {
        await updateDoc(doc(db, 'posts', editPost.id), {
          title: title.trim(),
          caption: caption.trim(),
          imageUrl,
          audioUrl,
        });
      } else {
        await addDoc(collection(db, 'posts'), {
          title: title.trim(),
          caption: caption.trim(),
          imageUrl,
          audioUrl,
          plays: 0,
          createdAt: serverTimestamp(),
        });
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setSaving(false);
      setUploadStage('');
    }
  };

  const uploadStatusLabel = {
    image: 'Uploading image…',
    audio: 'Uploading audio…',
    saving: 'Saving post…',
    '': '',
  }[uploadStage];

  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal__header">
          <h3>{editPost ? 'Edit Post' : 'New Post'}</h3>
          <button className="adm-icon-btn" onClick={onClose} disabled={saving}><FaTimes /></button>
        </div>

        <form onSubmit={handleSave} className="adm-modal__body">
          {/* Title */}
          <label className="adm-label">Title *</label>
          <input
            className="adm-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            maxLength={120}
            disabled={saving}
          />

          {/* Caption */}
          <label className="adm-label">Caption</label>
          <textarea
            className="adm-input adm-textarea"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption…"
            rows={4}
            disabled={saving}
          />

          {/* Image upload */}
          <label className="adm-label">Cover Image {editPost?.imageUrl ? '(leave empty to keep current)' : '(optional)'}</label>
          <div className="adm-file-row">
            <button
              type="button"
              className="adm-file-btn"
              onClick={() => imageInputRef.current.click()}
              disabled={saving}
            >
              <FaImage /> {imageFile ? imageFile.name : 'Choose Image'}
            </button>
            <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImage} hidden />
            {imagePreview && <img src={imagePreview} alt="" className="adm-img-thumb" />}
          </div>
          {uploadStage === 'image' && imgPct > 0 && (
            <UploadProgress pct={imgPct} label="Uploading image to Cloudinary…" />
          )}

          {/* Audio upload */}
          <label className="adm-label">Audio File {editPost ? '(leave empty to keep current)' : '*'}</label>
          <div className="adm-file-row">
            <button
              type="button"
              className="adm-file-btn"
              onClick={() => audioInputRef.current.click()}
              disabled={saving}
            >
              <FaMusic /> {audioFile ? audioFile.name : 'Choose Audio (.mp3, .m4a, .wav…)'}
            </button>
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*,.mp3,.m4a,.wav,.aac,.ogg,.flac"
              onChange={(e) => setAudioFile(e.target.files[0])}
              hidden
            />
          </div>
          {uploadStage === 'audio' && audPct > 0 && (
            <UploadProgress pct={audPct} label="Uploading audio to Cloudinary…" />
          )}

          {/* Status badge while saving */}
          {saving && uploadStatusLabel && (
            <div className="adm-saving-badge">
              <div className="adm-spinner" />
              <span>{uploadStatusLabel}</span>
            </div>
          )}

          {error && <p className="adm-error">{error}</p>}

          <div className="adm-modal__footer">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <FaSave /> {saving ? uploadStatusLabel || 'Processing…' : 'Save Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Admin Panel ───────────────────────────────────────────
export default function AdminPanel() {
  const [user, setUser] = useState(undefined); // undefined = checking auth
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u ?? null));
    return unsub;
  }, []);

  useEffect(() => {
    if (user) fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleDelete = async (post) => {
    if (!window.confirm(`Delete "${post.title}"?`)) return;
    setDeleting(post.id);
    try {
      await deleteDoc(doc(db, 'posts', post.id));
      // Note: Cloudinary files remain (can be cleaned from Cloudinary dashboard)
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  // ── Auth loading ─────────────────────────────────────────────
  if (user === undefined) {
    return (
      <div className="adm-loading">
        <div className="adm-spinner" />
      </div>
    );
  }

  // ── Login screen ─────────────────────────────────────────────
  if (!user) return <LoginScreen />;

  // ── Dashboard ────────────────────────────────────────────────
  return (
    <div className="admin-panel">
      {/* Topbar */}
      <header className="adm-topbar">
        <div className="adm-topbar__brand">
          <img src={logo} alt="OLTANI" />
          <span>
            <span className="text-blue">OLT</span><span className="text-orange">ANI</span>
          </span>
          <span className="adm-topbar__sep">|</span>
          <span className="adm-topbar__name"><HiSparkles /> Leda Tube Admin</span>
        </div>
        <div className="adm-topbar__actions">
          <span className="adm-cloud-badge"><FaCloud /> Cloudinary</span>
          <span className="adm-user-email">{user.email}</span>
          <button className="adm-icon-btn adm-signout" onClick={() => signOut(auth)} title="Sign Out">
            <FaSignOutAlt />
          </button>
        </div>
      </header>

      <div className="adm-body container">
        {/* Stats */}
        <div className="adm-stats">
          <div className="adm-stat">
            <span className="adm-stat__num">{posts.length}</span>
            <span className="adm-stat__label">Total Posts</span>
          </div>
          <div className="adm-stat">
            <span className="adm-stat__num">{posts.reduce((a, p) => a + (p.plays || 0), 0)}</span>
            <span className="adm-stat__label">Total Plays</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="adm-toolbar">
          <h2 className="adm-section-title">Audio Posts</h2>
          <button
            className="btn btn-primary"
            onClick={() => { setEditPost(null); setShowModal(true); }}
          >
            <FaPlus /> New Post
          </button>
        </div>

        {/* Posts list */}
        {loadingPosts
          ? <div className="adm-loading-inline"><div className="adm-spinner" /></div>
          : posts.length === 0
            ? (
              <div className="adm-empty">
                <FaMusic size={48} />
                <p>No posts yet. Create your first one!</p>
              </div>
            )
            : (
              <div className="adm-posts-grid">
                {posts.map((post) => (
                  <div key={post.id} className="adm-post-card">
                    {post.imageUrl
                      ? <img src={post.imageUrl} alt={post.title} className="adm-post-card__img" loading="lazy" />
                      : <div className="adm-post-card__img adm-post-card__img--placeholder"><FaMusic /></div>
                    }
                    <div className="adm-post-card__body">
                      <h4 className="adm-post-card__title">{post.title}</h4>
                      {post.caption && (
                        <p className="adm-post-card__caption">
                          {post.caption.length > 80 ? post.caption.slice(0, 80) + '…' : post.caption}
                        </p>
                      )}
                      <div className="adm-post-card__meta">
                        <span>▶ {post.plays || 0} plays</span>
                        {post.createdAt?.toDate && (
                          <span>{post.createdAt.toDate().toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="adm-post-card__actions">
                      <button
                        className="adm-icon-btn adm-edit-btn"
                        onClick={() => { setEditPost(post); setShowModal(true); }}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="adm-icon-btn adm-del-btn"
                        onClick={() => handleDelete(post)}
                        disabled={deleting === post.id}
                        title="Delete"
                      >
                        {deleting === post.id ? <div className="adm-spinner adm-spinner--xs" /> : <FaTrash />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
        }
      </div>

      {/* Modal */}
      {showModal && (
        <PostModal
          editPost={editPost}
          onClose={() => { setShowModal(false); setEditPost(null); }}
          onSaved={fetchPosts}
        />
      )}
    </div>
  );
}
