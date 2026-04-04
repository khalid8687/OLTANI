import { FaWhatsapp } from 'react-icons/fa';
import './WhatsAppButton.css';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/201098125573"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      id="whatsapp-fab"
      aria-label="Contact us on WhatsApp"
    >
      <FaWhatsapp size={28} />
      <span className="whatsapp-float__pulse" />
    </a>
  );
}
