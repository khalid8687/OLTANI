import { useState, useEffect, useRef } from 'react';
import {
  collection, addDoc, getDocs, updateDoc, deleteDoc,
  doc, serverTimestamp, orderBy, query,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged,
} from 'firebase/auth';
import { db, auth } from '../firebase';
import {
  FaTrash, FaEdit, FaSave, FaTimes, FaPlus, FaSignOutAlt,
  FaMusic, FaImage, FaLink, FaPlay, FaExternalLinkAlt,
  FaEnvelope, FaEye, FaCheck,
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import logo from '../assets/logo.webp';
import './AdminPanel.css';

// ── Cloudinary config (images only — small bandwidth) ────────
const CLOUD_NAME = 'dgucoutmf';
const UPLOAD_PRESET = 'ml_default';

const uploadImageToCloudinary = (file, onProgress) =>
  new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText).secure_url);
      } else {
        reject(new Error('Image upload failed'));
      }
    };
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
    xhr.send(formData);
  });

// ── Upload progress bar ────────────────────────────────────────
function UploadProgress({ pct, label }) {
  return (
    <div className="adm-upload-wrap">
      {label && <span className="adm-upload-label">{label}</span>}
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
  const [audioUrl, setAudioUrl] = useState(editPost?.audioUrl || '');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(editPost?.imageUrl || '');
  const [imgPct, setImgPct] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploadStage, setUploadStage] = useState('');
  const [error, setError] = useState('');
  const [testingAudio, setTestingAudio] = useState(false);
  const testAudioRef = useRef(null);

  const imageInputRef = useRef();

  const handleImage = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  // Test if audio URL is valid & playable
  const testAudio = () => {
    if (!audioUrl.trim()) return;
    setTestingAudio(true);
    if (testAudioRef.current) {
      testAudioRef.current.pause();
      testAudioRef.current = null;
    }
    const a = new Audio(audioUrl.trim());
    testAudioRef.current = a;
    a.oncanplay = () => {
      a.play().catch(() => {});
      setTestingAudio(false);
    };
    a.onerror = () => {
      setError('Audio URL is invalid or not accessible. Make sure it is a direct link to an audio file.');
      setTestingAudio(false);
    };
    setTimeout(() => setTestingAudio(false), 8000);
  };

  // Cleanup test audio on unmount
  useEffect(() => {
    return () => {
      if (testAudioRef.current) {
        testAudioRef.current.pause();
        testAudioRef.current = null;
      }
    };
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required'); return; }
    if (!audioUrl.trim() && !editPost?.audioUrl) { setError('Audio URL is required'); return; }
    setSaving(true);
    setError('');

    try {
      let imageUrl = editPost?.imageUrl || '';

      // Upload image to Cloudinary (small file — no bandwidth issue)
      if (imageFile) {
        setUploadStage('image');
        setImgPct(0);
        imageUrl = await uploadImageToCloudinary(imageFile, setImgPct);
      }

      // Save to Firestore
      setUploadStage('saving');
      const postData = {
        title: title.trim(),
        caption: caption.trim(),
        imageUrl,
        audioUrl: audioUrl.trim() || editPost?.audioUrl || '',
      };

      if (editPost) {
        await updateDoc(doc(db, 'posts', editPost.id), postData);
      } else {
        await addDoc(collection(db, 'posts'), {
          ...postData,
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

          {/* Cover Image (Cloudinary) */}
          <label className="adm-label">
            Cover Image {editPost?.imageUrl ? '(leave empty to keep current)' : '(optional)'}
          </label>
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
            <UploadProgress pct={imgPct} label="Uploading image…" />
          )}

          {/* Audio URL (external link — archive.org, Google Drive, etc.) */}
          <label className="adm-label">
            Audio URL * {editPost?.audioUrl ? '(leave empty to keep current)' : ''}
          </label>
          <div className="adm-help-text">
            Upload your audio to <a href="https://archive.org/create" target="_blank" rel="noopener noreferrer">archive.org</a> and paste the direct link here.
            The audio will play inside your OLTANI website.
          </div>
          <div className="adm-url-row">
            <div className="adm-url-input-wrap">
              <FaLink className="adm-url-icon" />
              <input
                className="adm-input adm-url-input"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                placeholder="https://archive.org/download/your-item/audio.mp3"
                disabled={saving}
                type="url"
              />
            </div>
            <button
              type="button"
              className="adm-test-btn"
              onClick={testAudio}
              disabled={saving || testingAudio || !audioUrl.trim()}
              title="Test if audio plays"
            >
              {testingAudio ? <div className="adm-spinner adm-spinner--xs" /> : <FaPlay />}
              <span>Test</span>
            </button>
          </div>
          {editPost?.audioUrl && !audioUrl.trim() && (
            <div className="adm-current-url">
              <FaLink /> Current: <span>{editPost.audioUrl.length > 60 ? editPost.audioUrl.slice(0, 60) + '…' : editPost.audioUrl}</span>
            </div>
          )}

          {/* Archive.org guide */}
          <details className="adm-guide">
            <summary><HiSparkles /> How to get a free audio URL from Archive.org</summary>
            <ol className="adm-guide-steps">
              <li>Go to <a href="https://archive.org/create" target="_blank" rel="noopener noreferrer">archive.org/create <FaExternalLinkAlt /></a></li>
              <li>Create a free account (if you don't have one)</li>
              <li>Click <strong>"Upload Files"</strong> and select your audio</li>
              <li>Fill in a title and click <strong>"Upload"</strong></li>
              <li>After upload, on the item page, <strong>right-click</strong> on the audio file → <strong>"Copy link address"</strong></li>
              <li>Paste the link in the Audio URL field above ✅</li>
            </ol>
            <p className="adm-guide-tip">
              💡 The link should look like: <code>https://archive.org/download/item-name/file.mp3</code>
            </p>
          </details>

          {/* Status */}
          {saving && (
            <div className="adm-saving-badge">
              <div className="adm-spinner" />
              <span>{uploadStage === 'image' ? 'Uploading image…' : 'Saving post…'}</span>
            </div>
          )}

          {error && <p className="adm-error">{error}</p>}

          <div className="adm-modal__footer">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <FaSave /> {saving ? 'Saving…' : 'Save Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Admin Panel ───────────────────────────────────────────
export default function AdminPanel() {
  const [user, setUser] = useState(undefined);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [deleting, setDeleting] = useState(null);

  // Messages state
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'messages'
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u ?? null));
    return unsub;
  }, []);

  useEffect(() => {
    if (user) { fetchPosts(); fetchMessages(); }
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
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  // ── Messages CRUD ──
  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const markAsRead = async (msg) => {
    try {
      await updateDoc(doc(db, 'messages', msg.id), { read: true });
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, read: true } : m));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const deleteMessage = async (msg) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await deleteDoc(doc(db, 'messages', msg.id));
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  // Auth loading
  if (user === undefined) {
    return <div className="adm-loading"><div className="adm-spinner" /></div>;
  }

  // Login
  if (!user) return <LoginScreen />;

  // Dashboard
  return (
    <div className="admin-panel">
      <header className="adm-topbar">
        <div className="adm-topbar__brand">
          <img src={logo} alt="OLTANI" />
          <span>
            <span className="text-blue">OLT</span><span className="text-orange">ANI</span>
          </span>
          <span className="adm-topbar__sep">|</span>
          <span className="adm-topbar__name"><HiSparkles /> OLTANI Admin</span>
        </div>
        <div className="adm-topbar__actions">
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
          <div className="adm-stat">
            <span className="adm-stat__num">{messages.length}</span>
            <span className="adm-stat__label">Messages</span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="adm-tabs">
          <button
            className={`adm-tab ${activeTab === 'posts' ? 'adm-tab--active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            <FaMusic /> Audio Posts
          </button>
          <button
            className={`adm-tab ${activeTab === 'messages' ? 'adm-tab--active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <FaEnvelope /> Messages
            {unreadCount > 0 && <span className="adm-tab-badge">{unreadCount}</span>}
          </button>
        </div>

        {/* ─── Posts Tab ─── */}
        {activeTab === 'posts' && (
          <>
        <div className="adm-toolbar">
          <h2 className="adm-section-title">Audio Posts</h2>
          <button
            className="btn btn-primary"
            onClick={() => { setEditPost(null); setShowModal(true); }}
          >
            <FaPlus /> New Post
          </button>
        </div>

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
          </>
        )}

        {/* ─── Messages Tab ─── */}
        {activeTab === 'messages' && (
          <>
            <div className="adm-toolbar">
              <h2 className="adm-section-title">Contact Messages</h2>
              <button className="btn btn-outline" onClick={fetchMessages}>
                Refresh
              </button>
            </div>

            {loadingMessages
              ? <div className="adm-loading-inline"><div className="adm-spinner" /></div>
              : messages.length === 0
                ? (
                  <div className="adm-empty">
                    <FaEnvelope size={48} />
                    <p>No messages yet.</p>
                  </div>
                )
                : (
                  <div className="adm-messages-list">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`adm-msg-card ${msg.read ? '' : 'adm-msg-card--unread'}`}>
                        <div className="adm-msg-card__header">
                          <div className="adm-msg-card__sender">
                            {!msg.read && <span className="adm-msg-dot" />}
                            <strong>{msg.name}</strong>
                            <span className="adm-msg-email">{msg.email}</span>
                          </div>
                          <span className="adm-msg-date">
                            {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleString() : '—'}
                          </span>
                        </div>
                        <p className="adm-msg-card__body">{msg.message}</p>
                        <div className="adm-msg-card__actions">
                          {!msg.read && (
                            <button className="adm-icon-btn adm-read-btn" onClick={() => markAsRead(msg)} title="Mark as read">
                              <FaCheck />
                            </button>
                          )}
                          <a href={`mailto:${msg.email}`} className="adm-icon-btn adm-reply-btn" title="Reply by email">
                            <FaEnvelope />
                          </a>
                          <button className="adm-icon-btn adm-del-btn" onClick={() => deleteMessage(msg)} title="Delete">
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
            }
          </>
        )}
      </div>

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
