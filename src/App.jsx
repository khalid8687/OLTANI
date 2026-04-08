import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import './App.css';

// Lazy-load all pages except Home for fast initial load
const Services = lazy(() => import('./pages/Services'));
const VideoProduction = lazy(() => import('./pages/VideoProduction'));
const SoftwareDev = lazy(() => import('./pages/SoftwareDev'));
const SocialMedia = lazy(() => import('./pages/SocialMedia'));
const Integration = lazy(() => import('./pages/Integration'));
const NetworkInfra = lazy(() => import('./pages/NetworkInfra'));
const About = lazy(() => import('./pages/About'));
const Leda = lazy(() => import('./pages/Leda'));
const Contact = lazy(() => import('./pages/Contact'));

// Minimal loading spinner
function PageLoader() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: 40, height: 40,
        border: '3px solid rgba(255,255,255,0.1)',
        borderTop: '3px solid #2980b9',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Navbar />
      <main className="main-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/video-production" element={<VideoProduction />} />
            <Route path="/services/software" element={<SoftwareDev />} />
            <Route path="/services/social-media" element={<SocialMedia />} />
            <Route path="/services/integration" element={<Integration />} />
            <Route path="/services/network" element={<NetworkInfra />} />
            <Route path="/about" element={<About />} />
            <Route path="/leda" element={<Leda />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default App;
