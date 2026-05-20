"use client";

import { useState } from "react";

const WHATSAPP_NUMBER = "51999999999"; // ← Cambia por tu número real
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hola, estoy interesado en las clases de Virtuoso Academy. ¿Me pueden dar más información?"
);

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Contactar por WhatsApp"
      className="whatsapp-float-btn"
    >
      {/* Pulse rings */}
      <span className="wa-ring wa-ring-1" />
      <span className="wa-ring wa-ring-2" />

      {/* Tooltip */}
      <span
        className="wa-tooltip"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateX(0)" : "translateX(8px)",
        }}
      >
        ¡Escríbenos!
      </span>

      {/* WhatsApp SVG icon */}
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="wa-icon"
      >
        <circle cx="16" cy="16" r="16" fill="#25D366" />
        <path
          d="M23.472 8.527A10.41 10.41 0 0016.003 5.5C10.764 5.5 6.5 9.764 6.5 15.003c0 1.72.449 3.4 1.302 4.88L6.5 26.5l6.762-1.775a10.46 10.46 0 004.737 1.136h.004c5.235 0 9.497-4.264 9.497-9.503 0-2.54-.988-4.926-2.028-5.831zm-7.469 14.61h-.003a8.692 8.692 0 01-4.43-1.215l-.318-.19-3.29.863.879-3.207-.207-.329a8.65 8.65 0 01-1.33-4.656c0-4.782 3.89-8.672 8.676-8.672 2.317 0 4.492.902 6.129 2.54a8.62 8.62 0 012.541 6.14c-.002 4.783-3.892 8.675-8.647 8.675v-.149zm4.757-6.496c-.26-.13-1.543-.762-1.782-.85-.238-.087-.412-.13-.585.13-.174.26-.672.85-.824 1.025-.151.173-.302.195-.562.065-.26-.13-1.098-.405-2.09-1.29-.773-.688-1.294-1.537-1.446-1.797-.152-.26-.016-.4.113-.53.116-.115.26-.303.39-.454.13-.152.174-.26.26-.433.087-.174.044-.325-.022-.454-.065-.13-.585-1.41-.803-1.93-.211-.506-.425-.438-.585-.446l-.498-.009a.954.954 0 00-.693.325c-.238.26-.908.888-.908 2.167s.93 2.513 1.06 2.685c.13.174 1.83 2.795 4.431 3.919.62.268 1.104.428 1.48.548.622.198 1.188.17 1.635.103.499-.075 1.537-.628 1.754-1.235.217-.606.217-1.126.152-1.235-.065-.108-.238-.174-.498-.303z"
          fill="white"
        />
      </svg>
    </a>
  );
}
