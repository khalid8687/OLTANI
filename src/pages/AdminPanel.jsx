import { useState, useEffect, useRef } from 'react';
import {
  collection, addDoc, getDocs, updateDoc, deleteDoc,
  doc, serverTimestamp, orderBy, query,
} from 'firebase/firestore';
import {
  ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject,
} from 'firebase/storage';
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged,
} from 'firebase/auth';
import { db, storage, auth } from '../firebase';
import { FaTrash, FaEdit, FaSave, FaTimes, FaPlus, FaSignOutAlt, FaMusic, FaImage } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import logo from '../assets/logo.webp';
import './AdminPanel.css';

// ─── Upload helper ───────────────────────────────────────────
function UploadProgress({ pct }) {
  return (
    <div className="adm-upload-bar">
      <div className="adm-upload-fill" style={{ width: `${pct}%` }} />
      <span>{Math.round(pct)}%</span>
    </div>
  );
}

// ─── Login screen ─────────────────────────────────────────────
function LoginScreen({ onLogin }) {
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
      onLogin();
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

// ─── Add / Edit Post Modal ────────────────────────────────────
function PostModal({ editPost, onClose, onSaved }) {
  const [title, setTitle] = useState(editPost?.title || '');
  const [caption, setCaption] = useState(editPost?.caption || '');
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(editPost?.imageUrl || '');
  const [imgPct, setImgPct] = useState(0);
  const [audPct, setAudPct] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const audioInputRef = useRef();
  const imageInputRef = useRef();

  const handleImage = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  const uploadFile = (file, path, onProgress) =>
    new Promise((resolve, reject) => {
      const sRef = storageRef(storage, path);
      const task = uploadBytesResumable(sRef, file);
      task.on(
        'state_changed',
        (snap) => onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
        reject,
        async () => resolve(await getDownloadURL(task.snapshot.ref)),
      );
    });

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required'); return; }
    if (!editPost && !audioFile) { setError('Audio file is required'); return; }
    setSaving(true);
    setError('');
    try {
      let imageUrl = editPost?.imageUrl || '';
      let audioUrl = editPost?.audioUrl || '';

      if (imageFile) {
        imageUrl = await uploadFile(
          imageFile,
          `posts/${Date.now()}_${imageFile.name}`,
          setImgPct,
        );
      }
      if (audioFile) {
        audioUrl = await uploadFile(
          audioFile,
          `audio/${Date.now()}_${audioFile.name}`,
          setAudPct,
        );
      }

      if (editPost) {
        await updateDoc(doc(db, 'posts', editPost.id), {
          title, caption, imageUrl, audioUrl,
        });
      } else {
        await addDoc(collection(db, 'posts'), {
          title, caption, imageUrl, audioUrl,
          plays: 0,
          createdAt: serverTimestamp(),
        });
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Upload failed');
      setSaving(false);
    }
  };

  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal__header">
          <h3>{editPost ? 'Edit Post' : 'New Post'}</h3>
          <button className="adm-icon-btn" onClick={onClose}><FaTimes /></button>
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
          />

          {/* Caption */}
          <label className="adm-label">Caption</label>
          <textarea
            className="adm-input adm-textarea"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption…"
            rows={4}
          />

          {/* Image upload */}
          <label className="adm-label">Cover Image {!editPost?.imageUrl && '(optional)'}</label>
          <div className="adm-file-row">
            <button type="button" className="adm-file-btn" onClick={() => imageInputRef.current.click()}>
              <FaImage /> {imageFile ? imageFile.name : 'Choose Image'}
            </button>
            <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImage} hidden />
            {imagePreview && <img src={imagePreview} alt="" className="adm-img-thumb" />}
          </div>
          {imgPct > 0 && imgPct < 100 && <UploadProgress pct={imgPct} />}

          {/* Audio upload */}
          <label className="adm-label">Audio File {editPost ? '(leave empty to keep current)' : '*'}</label>
          <div className="adm-file-row">
            <button type="button" className="adm-file-btn" onClick={() => audioInputRef.current.click()}>
              <FaMusic /> {audioFile ? audioFile.name : 'Choose Audio'}
            </button>
            <input ref={audioInputRef} type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files[0])} hidden />
          </div>
          {audPct > 0 && audPct < 100 && <UploadProgress pct={audPct} />}

          {error && <p className="adm-error">{error}</p>}

          <div className="adm-modal__footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <FaSave /> {saving ? 'Saving…' : 'Save Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Admin Panel ─────────────────────────────────────────
export default function AdminPanel() {
  const [user, setUser] = useState(undefined); // undefined = loading
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
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleDelete = async (post) => {
    if (!window.confirm(`Delete "${post.title}"?`)) return;
    setDeleting(post.id);
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'posts', post.id));
      // Best-effort delete files from storage
      const tryDelete = (url) => {
        if (!url) return;
        try {
          const sRef = storageRef(storage, url);
          deleteObject(sRef).catch(() => {});
        } catch { }
      };
      tryDelete(post.imageUrl);
      tryDelete(post.audioUrl);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    } finally {
      setDeleting(null);
    }
  };

  // ── Auth loading ────────────────────────────────────────────
  if (user === undefined) {
    return (
      <div className="adm-loading">
        <div className="adm-spinner" />
      </div>
    );
  }

  // ── Login screen ────────────────────────────────────────────
  if (!user) return <LoginScreen onLogin={() => {}} />;

  // ── Dashboard ───────────────────────────────────────────────
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
          <span className="adm-user-email">{user.email}</span>
          <button className="adm-icon-btn adm-signout" onClick={() => signOut(auth)} title="Sign Out">
            <FaSignOutAlt />
          </button>
        </div>
      </header>

      <div className="adm-body container">
        {/* Stats bar */}
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

        {/* Add post button */}
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
                      ? <img src={post.imageUrl} alt={post.title} className="adm-post-card__img" />
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
                        {deleting === post.id ? '…' : <FaTrash />}
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
