import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Services from './pages/Services';
import VideoProduction from './pages/VideoProduction';
import SoftwareDev from './pages/SoftwareDev';
import SocialMedia from './pages/SocialMedia';
import Integration from './pages/Integration';
import NetworkInfra from './pages/NetworkInfra';
import About from './pages/About';
import Leda from './pages/Leda';
import Contact from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Navbar />
      <main className="main-content">
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
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default App;
