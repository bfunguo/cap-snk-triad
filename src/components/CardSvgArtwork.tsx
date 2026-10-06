import React from 'react';
import { Card } from '../types/game';

interface CardArtworkProps {
  card: Card;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Udon Street Fighter graphic novel illustration renderer.
 * Matches the exact visual language of the reference comic art:
 * - Front 3/4 view cropped shoulders-up
 * - Heavy, bold black comic ink contours with chisel-tip line weight
 * - Volumetric multi-stop cel-shading with deep anatomical shadows
 * - Saturated glowing energy rim lighting along character silhouettes
 * - Dark smoky graphic novel background with swirling energy aura & combat embers
 */
export const CardSvgArtwork: React.FC<CardArtworkProps> = ({ card, className = '' }) => {
  const { id, signatureColor, accentColor } = card;

  const renderFighterIllustration = () => {
    switch (id) {
      case 'dhalsim':
        return (
          <g>
            <path d="M10 120 L26 84 L46 88 L58 88 L76 84 L96 120 Z" fill="#d97706" stroke="#090712" strokeWidth="3.5" />
            <circle cx="38" cy="95" r="4.5" fill="#f8fafc" stroke="#090712" strokeWidth="2" />
            <circle cx="50" cy="100" r="5" fill="#f8fafc" stroke="#090712" strokeWidth="2" />
            <circle cx="62" cy="95" r="4.5" fill="#f8fafc" stroke="#090712" strokeWidth="2" />
            <path d="M42 66 L42 90 L58 90 L58 66 Z" fill="url(#skinDarkGrad)" stroke="#090712" strokeWidth="2.5" />
            <path d="M34 44 C32 58 38 72 49 74 C60 72 66 58 66 44 C66 30 58 22 50 22 C38 22 34 30 34 44 Z" fill="url(#skinDarkGrad)" stroke="#090712" strokeWidth="3" />
            {/* Forehead Stripes */}
            <line x1="43" y1="24" x2="43" y2="40" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="23" x2="50" y2="41" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
            <line x1="57" y1="24" x2="57" y2="40" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
            <circle cx="32" cy="50" r="3.5" fill="none" stroke="#facc15" strokeWidth="2.5" />
            <circle cx="68" cy="50" r="3.5" fill="none" stroke="#facc15" strokeWidth="2.5" />
            {/* Piercing Ascetic Eyes with Fire Glow */}
            <ellipse cx="43.5" cy="48" rx="3" ry="1.8" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="43.5" cy="48" r="1.3" fill="#f97316" />
            <ellipse cx="56.5" cy="47" rx="3" ry="1.8" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="56.5" cy="47" r="1.3" fill="#f97316" />
            <line x1="46" y1="62" x2="54" y2="62" stroke="#090712" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );

      case 'e-honda':
        return (
          <g>
            <path d="M8 120 L24 82 L48 86 L56 86 L78 82 L96 120 Z" fill="url(#clothGrad)" stroke="#090712" strokeWidth="3.5" />
            <path d="M22 84 L46 88 L42 120 L12 120 Z" fill="#0284c7" stroke="#090712" strokeWidth="2.5" />
            <path d="M38 66 L38 90 L62 90 L62 66 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="2.5" />
            <path d="M33 44 C31 60 37 72 49 75 C61 73 67 60 67 48 C67 34 59 26 50 26 C37 26 33 34 33 44 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="3.2" />
            {/* Bold Kabuki Kumadori Face Paint */}
            <path d="M35 44 L44 48 L37 60" stroke="#dc2626" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M65 44 L56 48 L63 60" stroke="#dc2626" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <ellipse cx="43.5" cy="48" rx="3.5" ry="2" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="44" cy="48" r="1.5" fill="#090712" />
            <ellipse cx="56.5" cy="47" rx="3.5" ry="2" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="56" cy="47" r="1.5" fill="#090712" />
            <line x1="45" y1="64" x2="55" y2="64" stroke="#090712" strokeWidth="2.8" strokeLinecap="round" />
            {/* Oiled Chonmage Topknot */}
            <path d="M34 34 C34 20 48 14 64 18 C67 28 67 38 67 38 Z" fill="#090b14" stroke="#090712" strokeWidth="2.5" />
            <ellipse cx="50" cy="13" rx="7" ry="4.5" fill="#090b14" stroke="#090712" strokeWidth="2" />
          </g>
        );

      case 'blanka':
        return (
          <g>
            {/* Feral Green Skin with Orange Electric Mane */}
            <path d="M10 120 L26 84 L46 88 L58 88 L76 84 L96 120 Z" fill="#15803d" stroke="#090712" strokeWidth="3.5" />
            <path d="M42 68 L42 90 L58 90 L58 68 Z" fill="#16a34a" stroke="#090712" strokeWidth="2.5" />
            <path d="M34 44 C32 60 38 72 49 74 C60 72 66 60 66 48 C66 34 58 26 50 26 C38 26 34 34 34 44 Z" fill="#22c55e" stroke="#090712" strokeWidth="3" />
            {/* Feral Glowing Eyes & Fangs */}
            <ellipse cx="43.5" cy="48" rx="3" ry="1.8" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="43.5" cy="48" r="1.5" fill="#eab308" />
            <ellipse cx="56.5" cy="47" rx="3" ry="1.8" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="56.5" cy="47" r="1.5" fill="#eab308" />
            <path d="M42 60 Q50 68 58 60 Z" fill="#090712" />
            <polygon points="45,60 47,64 49,60" fill="#ffffff" />
            <polygon points="51,60 53,64 55,60" fill="#ffffff" />
            {/* Wild Spiky Orange Mane */}
            <path d="M28 42 C18 18 42 6 52 4 C62 6 82 18 72 42 Z" fill="#ea580c" stroke="#090712" strokeWidth="3.2" />
            <path d="M44 14 L50 2 L56 14 Z" fill="#f97316" />
          </g>
        );

      case 'vega':
        return (
          <g>
            <path d="M10 120 L26 84 L46 88 L58 88 L76 84 L96 120 Z" fill="#7e22ce" stroke="#090712" strokeWidth="3.5" />
            <path d="M42 68 L42 90 L58 90 L58 68 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="2" />
            {/* Ceramic Spanish Mask with Eyeslits */}
            <path d="M35 44 C33 58 39 68 49 71 C59 70 66 60 67 48 C67 38 61 30 50 30 C37 30 35 38 35 44 Z" fill="#f8fafc" stroke="#090712" strokeWidth="3" />
            <line x1="41" y1="46" x2="47" y2="46" stroke="#090712" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="53" y1="46" x2="59" y2="46" stroke="#090712" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="56" cy="46" r="1.3" fill="#38bdf8" />
            {/* Long Golden Hair */}
            <path d="M32 38 C30 18 46 12 62 14 C70 24 68 44 68 44 Z" fill="url(#hairBlondeGrad)" stroke="#090712" strokeWidth="2.5" />
          </g>
        );

      case 'cammy':
        return (
          <g>
            <path d="M14 120 L28 86 L46 90 L56 90 L74 86 L94 120 Z" fill="#047857" stroke="#090712" strokeWidth="3.5" />
            <path d="M43 68 L43 88 L57 88 L57 68 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="2" />
            <path d="M36 44 C35 56 41 66 49 68 C57 66 64 56 65 46 C65 38 59 32 50 32 C39 32 36 38 36 44 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="3" />
            <line x1="40" y1="52" x2="43" y2="60" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="44" cy="48" rx="2.5" ry="1.8" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="44" cy="48" r="1.3" fill="#059669" />
            <ellipse cx="55" cy="47" rx="2.5" ry="1.8" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="55" cy="47" r="1.3" fill="#059669" />
            <line x1="47" y1="60" x2="53" y2="60" stroke="#090712" strokeWidth="2" strokeLinecap="round" />
            {/* Red Delta Red Beret */}
            <path d="M30 38 Q50 18 70 32 Q50 26 30 38 Z" fill="#dc2626" stroke="#090712" strokeWidth="2.8" />
            <circle cx="42" cy="28" r="2.5" fill="#facc15" />
            {/* Blonde Braids */}
            <path d="M26 42 Q14 62 20 84" stroke="#facc15" strokeWidth="5.5" fill="none" strokeLinecap="round" />
            <path d="M72 42 Q82 62 76 84" stroke="#facc15" strokeWidth="5.5" fill="none" strokeLinecap="round" />
          </g>
        );

      case 'fei-long':
        return (
          <g>
            <path d="M10 120 L26 84 L46 88 L58 88 L76 84 L96 120 Z" fill="#1e293b" stroke="#090712" strokeWidth="3.5" />
            <path d="M42 68 L42 90 L58 90 L58 68 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="2" />
            <path d="M35 44 C33 58 39 68 49 71 C59 70 66 60 67 48 C67 38 61 30 50 30 C37 30 35 38 35 44 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="3" />
            <path d="M39 44 L47 45" stroke="#090712" strokeWidth="3" strokeLinecap="round" />
            <path d="M53 45 L61 44" stroke="#090712" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="44" cy="48" rx="2.5" ry="1.6" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="44" cy="48" r="1.4" fill="#090712" />
            <ellipse cx="56" cy="47" rx="2.5" ry="1.6" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="56" cy="47" r="1.4" fill="#090712" />
            <line x1="46" y1="62" x2="54" y2="61" stroke="#090712" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M32 38 C30 18 46 12 62 14 C70 24 68 44 68 44 Z" fill="#090b14" stroke="#090712" strokeWidth="2.5" />
          </g>
        );

      case 'dee-jay':
        return (
          <g>
            <path d="M10 120 L26 84 L46 88 L58 88 L76 84 L96 120 Z" fill="#ea580c" stroke="#090712" strokeWidth="3.5" />
            <path d="M42 68 L42 90 L58 90 L58 68 Z" fill="url(#skinDarkGrad)" stroke="#090712" strokeWidth="2" />
            <path d="M35 44 C33 58 39 68 49 71 C59 70 66 60 67 48 C67 38 61 30 50 30 C37 30 35 38 35 44 Z" fill="url(#skinDarkGrad)" stroke="#090712" strokeWidth="3" />
            <ellipse cx="44" cy="48" rx="2.8" ry="1.8" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="44" cy="48" r="1.4" fill="#090712" />
            <ellipse cx="56" cy="47" rx="2.8" ry="1.8" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="56" cy="47" r="1.4" fill="#090712" />
            <path d="M43 60 Q50 67 57 60 Z" fill="#ffffff" stroke="#090712" strokeWidth="1.8" />
            <path d="M34 38 C32 18 46 14 62 16 C68 28 66 44 66 44 Z" fill="#090b14" stroke="#090712" strokeWidth="2.5" />
            <line x1="38" y1="24" x2="42" y2="34" stroke="#facc15" strokeWidth="1.8" />
            <line x1="44" y1="24" x2="48" y2="34" stroke="#facc15" strokeWidth="1.8" />
          </g>
        );

      case 'dan-hibiki':
        return (
          <g>
            <path d="M10 120 L26 84 L44 88 L52 108 L66 86 L88 95 L96 120 Z" fill="#db2777" stroke="#090712" strokeWidth="3.5" />
            <path d="M44 88 L52 106 L60 88" fill="#9d174d" stroke="#090712" strokeWidth="2" />
            <path d="M42 68 L42 90 L58 90 L58 68 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="2" />
            <path d="M35 44 C33 58 39 68 49 71 C59 70 66 60 67 48 C67 38 61 30 50 30 C37 30 35 38 35 44 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="3" />
            <ellipse cx="44" cy="48" rx="2.5" ry="1.8" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="44" cy="48" r="1.3" fill="#090712" />
            <ellipse cx="56" cy="47" rx="2.5" ry="1.8" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="56" cy="47" r="1.3" fill="#090712" />
            <path d="M43 60 Q50 67 57 60 Z" fill="#ffffff" stroke="#090712" strokeWidth="1.8" />
            <path d="M34 38 C32 18 46 14 62 16 C68 28 66 44 66 44 Z" fill="#451a03" stroke="#090712" strokeWidth="2.5" />
            <path d="M60 20 Q74 8 76 2" stroke="#451a03" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          </g>
        );

      case 'guy':
        return (
          <g>
            <path d="M10 120 L26 84 L44 88 L58 88 L76 84 L96 120 Z" fill="#b91c1c" stroke="#090712" strokeWidth="3.5" />
            <path d="M40 68 L40 92 L60 92 L60 68 Z" fill="#090712" stroke="#090712" strokeWidth="2.5" />
            <path d="M35 44 C33 58 39 68 49 71 C59 70 66 60 67 48 C67 38 61 30 50 30 C37 30 35 38 35 44 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="3" />
            <ellipse cx="43.5" cy="47" rx="2.5" ry="1.6" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="43.5" cy="47" r="1.3" fill="#090712" />
            <ellipse cx="55.5" cy="47" rx="2.5" ry="1.6" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="55.5" cy="47" r="1.3" fill="#090712" />
            <line x1="46" y1="61" x2="53" y2="61" stroke="#090712" strokeWidth="2" strokeLinecap="round" />
            <path d="M34 38 C32 18 48 12 62 14 C68 26 66 46 66 46 Z" fill="#090b14" stroke="#090712" strokeWidth="2.5" />
            <path d="M44 24 L48 40 L52 24" fill="#090b14" />
          </g>
        );

      case 'rose':
        return (
          <g>
            <path d="M12 120 L28 86 L46 90 L56 90 L74 86 L94 120 Z" fill="#7e22ce" stroke="#090712" strokeWidth="3.5" />
            <path d="M26 86 Q50 102 74 86" stroke="#facc15" strokeWidth="5" fill="none" />
            <path d="M43 68 L43 88 L57 88 L57 68 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="2" />
            <path d="M36 44 C35 56 41 66 49 68 C57 66 64 56 65 46 C65 38 59 32 50 32 C39 32 36 38 36 44 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="3" />
            <ellipse cx="44" cy="48" rx="2.5" ry="1.8" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="44" cy="48" r="1.3" fill="#7e22ce" />
            <ellipse cx="55" cy="47" rx="2.5" ry="1.8" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="55" cy="47" r="1.3" fill="#7e22ce" />
            <path d="M46 60 Q50 63 55 60" stroke="#f43f5e" strokeWidth="2" fill="none" />
            {/* Wavy Purple Hair */}
            <path d="M32 38 C28 14 48 8 64 12 C76 22 74 44 74 44 Z" fill="#581c87" stroke="#090712" strokeWidth="2.5" />
          </g>
        );

      case 'gen':
        return (
          <g>
            <path d="M10 120 L26 84 L46 88 L58 88 L76 84 L96 120 Z" fill="#374151" stroke="#090712" strokeWidth="3.5" />
            <path d="M42 68 L42 90 L58 90 L58 68 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="2" />
            <path d="M35 44 C33 58 39 68 49 71 C59 70 66 60 67 48 C67 36 59 28 50 28 C37 28 35 36 35 44 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="3" />
            <line x1="39" y1="46" x2="47" y2="47" stroke="#090712" strokeWidth="3" strokeLinecap="round" />
            <line x1="53" y1="47" x2="61" y2="46" stroke="#090712" strokeWidth="3" strokeLinecap="round" />
            {/* Long Wispy White Mustache & Beard */}
            <path d="M43 56 Q34 68 32 86" stroke="#f8fafc" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M55 56 Q64 68 66 86" stroke="#f8fafc" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M44 68 C41 88 57 88 54 68 Z" fill="#f8fafc" stroke="#090712" strokeWidth="1.5" />
            <path d="M34 42 C32 30 46 22 58 22 C66 30 66 42 66 42 Z" fill="url(#skinGrad)" />
            <path d="M30 46 Q24 58 30 68" stroke="#f8fafc" strokeWidth="3.5" fill="none" />
            <path d="M68 46 Q74 58 68 68" stroke="#f8fafc" strokeWidth="3.5" fill="none" />
          </g>
        );

      case 'rolento':
        return (
          <g>
            <path d="M10 120 L26 84 L44 88 L58 88 L76 84 L96 120 Z" fill="#4d7c0f" stroke="#090712" strokeWidth="3.5" />
            <path d="M44 86 L50 108 L58 86 Z" fill="#eab308" stroke="#090712" strokeWidth="2" />
            <path d="M42 68 L42 90 L58 90 L58 68 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="2" />
            <path d="M35 44 C33 58 39 68 49 71 C59 70 66 60 67 48 C67 38 61 30 50 30 C37 30 35 38 35 44 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="3" />
            <line x1="41" y1="38" x2="47" y2="64" stroke="#dc2626" strokeWidth="2.5" />
            <ellipse cx="43.5" cy="48" rx="3" ry="2" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="43.5" cy="48" r="1.5" fill="#090712" />
            <ellipse cx="55.5" cy="47" rx="3" ry="2" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="55.5" cy="47" r="1.5" fill="#090712" />
            <line x1="45" y1="62" x2="54" y2="61" stroke="#090712" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M28 38 Q50 16 72 30 Q50 24 28 38 Z" fill="#eab308" stroke="#090712" strokeWidth="3" />
            <circle cx="52" cy="28" r="3" fill="#dc2626" />
          </g>
        );

      case 'sakura':
        return (
          <g>
            <path d="M10 120 L26 84 L46 88 L52 106 L62 88 L88 95 L96 120 Z" fill="#0284c7" stroke="#090712" strokeWidth="3.5" />
            <path d="M48 88 L52 108 L56 88" fill="#f43f5e" stroke="#090712" strokeWidth="2" />
            <path d="M43 68 L43 88 L57 88 L57 68 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="2" />
            <path d="M36 44 C35 56 41 66 49 68 C57 66 64 56 65 46 C65 38 59 32 50 32 C39 32 36 38 36 44 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="3" />
            <ellipse cx="44" cy="48" rx="2.5" ry="1.8" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="44" cy="48" r="1.3" fill="#78350f" />
            <ellipse cx="55" cy="47" rx="2.5" ry="1.8" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="55" cy="47" r="1.3" fill="#78350f" />
            <path d="M46 59 Q50 63 54 59 Z" fill="#e11d48" stroke="#090712" strokeWidth="1.5" />
            <path d="M34 40 C32 24 46 18 58 20 C68 28 66 44 66 44 Z" fill="#78350f" stroke="#090712" strokeWidth="2" />
            <rect x="36" y="34" width="30" height="5" fill="#f8fafc" stroke="#090712" strokeWidth="1.5" />
          </g>
        );

      case 'cody':
        return (
          <g>
            <path d="M10 120 L26 84 L44 88 L58 88 L74 84 L96 120 Z" fill="#f1f5f9" stroke="#090712" strokeWidth="3.5" />
            <line x1="18" y1="96" x2="35" y2="98" stroke="#090712" strokeWidth="3.5" />
            <line x1="65" y1="98" x2="82" y2="96" stroke="#090712" strokeWidth="3.5" />
            <path d="M42 68 L42 90 L58 90 L58 68 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="2" />
            <path d="M35 44 C33 58 39 68 49 71 C59 70 66 60 67 48 C67 38 61 30 50 30 C37 30 35 38 35 44 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="3" />
            <ellipse cx="43.5" cy="48" rx="2.5" ry="1.6" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="43.5" cy="48" r="1.3" fill="#090712" />
            <ellipse cx="55.5" cy="47" rx="2.5" ry="1.6" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="55.5" cy="47" r="1.3" fill="#090712" />
            <line x1="46" y1="62" x2="53" y2="61" stroke="#090712" strokeWidth="2" strokeLinecap="round" />
            <path d="M32 40 C30 18 48 12 62 14 C68 26 66 48 66 48 Z" fill="url(#hairBlondeGrad)" stroke="#090712" strokeWidth="2.5" />
          </g>
        );

      case 'karin':
        return (
          <g>
            <path d="M10 120 L26 84 L46 88 L54 106 L64 88 L88 95 L96 120 Z" fill="#b91c1c" stroke="#090712" strokeWidth="3.5" />
            <rect x="20" y="84" width="12" height="7" rx="2" fill="#fbbf24" stroke="#090712" strokeWidth="2" />
            <rect x="70" y="86" width="12" height="7" rx="2" fill="#fbbf24" stroke="#090712" strokeWidth="2" />
            <path d="M43 68 L43 88 L57 88 L57 68 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="2" />
            <path d="M36 44 C35 56 41 66 49 68 C57 66 64 56 65 46 C65 38 59 32 50 32 C39 32 36 38 36 44 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="3" />
            <ellipse cx="44" cy="48" rx="2.5" ry="1.8" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="44" cy="48" r="1.3" fill="#1e3a8a" />
            <ellipse cx="55" cy="47" rx="2.5" ry="1.8" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="55" cy="47" r="1.3" fill="#1e3a8a" />
            <path d="M46 60 Q50 64 56 59" stroke="#e11d48" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M34 38 C32 18 48 12 62 14 C70 22 68 44 68 44 Z" fill="url(#hairBlondeGrad)" stroke="#090712" strokeWidth="2.5" />
            <path d="M24 44 Q16 66 24 88 Q30 76 24 64" fill="url(#hairBlondeGrad)" stroke="#090712" strokeWidth="2.2" />
            <path d="M74 44 Q82 66 74 88 Q68 76 74 64" fill="url(#hairBlondeGrad)" stroke="#090712" strokeWidth="2.2" />
          </g>
        );

      case 'alex':
        return (
          <g>
            <path d="M10 120 L26 84 L46 88 L58 88 L76 84 L96 120 Z" fill="#d97706" stroke="#090712" strokeWidth="3.5" />
            <line x1="28" y1="88" x2="34" y2="120" stroke="#dc2626" strokeWidth="4" />
            <line x1="68" y1="88" x2="62" y2="120" stroke="#dc2626" strokeWidth="4" />
            <path d="M42 68 L42 90 L58 90 L58 68 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="2" />
            <path d="M35 44 C33 58 39 68 49 71 C59 70 66 60 67 48 C67 38 61 30 50 30 C37 30 35 38 35 44 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="3" />
            <path d="M35 50 L65 50 L63 56 L37 56 Z" fill="#dc2626" />
            <ellipse cx="43.5" cy="48" rx="2.5" ry="1.6" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="43.5" cy="48" r="1.3" fill="#090712" />
            <ellipse cx="55.5" cy="47" rx="2.5" ry="1.6" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="55.5" cy="47" r="1.3" fill="#090712" />
            <path d="M32 38 C30 18 46 12 62 14 C70 24 68 48 68 48 Z" fill="url(#hairBlondeGrad)" stroke="#090712" strokeWidth="2.5" />
            <rect x="34" y="34" width="32" height="5" fill="#15803d" stroke="#090712" strokeWidth="1.5" />
          </g>
        );

      case 'dudley':
        return (
          <g>
            <path d="M10 120 L26 84 L46 88 L54 106 L64 88 L88 95 L96 120 Z" fill="#047857" stroke="#090712" strokeWidth="3.5" />
            <circle cx="34" cy="94" r="4" fill="#dc2626" stroke="#090712" strokeWidth="1.5" />
            <rect x="46" y="86" width="10" height="5" rx="1" fill="#090712" />
            <path d="M43 68 L43 88 L57 88 L57 68 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="2" />
            <path d="M35 44 C33 58 39 68 49 71 C59 70 66 60 67 48 C67 38 61 30 50 30 C37 30 35 38 35 44 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="3" />
            <path d="M38 58 Q48 54 54 58 Q59 53 57 63 Q48 60 38 63 Z" fill="#090712" stroke="#090712" strokeWidth="1.8" />
            <ellipse cx="43.5" cy="48" rx="2.5" ry="1.6" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="43.5" cy="48" r="1.3" fill="#090712" />
            <ellipse cx="55.5" cy="47" rx="2.5" ry="1.6" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="55.5" cy="47" r="1.3" fill="#090712" />
            <path d="M34 38 C32 20 48 16 64 20 C68 30 66 44 66 44 Z" fill="#090b14" stroke="#090712" strokeWidth="2.5" />
          </g>
        );

      case 'ibuki':
        return (
          <g>
            <path d="M12 120 L28 86 L46 90 L56 90 L74 86 L94 120 Z" fill="#78716c" stroke="#090712" strokeWidth="3.5" />
            <path d="M36 44 C34 58 40 68 49 71 C58 70 65 60 66 48 C66 38 60 30 50 30 C38 30 36 38 36 44 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="2.5" />
            <path d="M36 52 C36 68 44 72 50 72 C58 72 65 64 65 52 Z" fill="#78716c" stroke="#090712" strokeWidth="2" />
            <ellipse cx="43.5" cy="48" rx="2.5" ry="1.6" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="43.5" cy="48" r="1.3" fill="#090712" />
            <ellipse cx="55.5" cy="47" rx="2.5" ry="1.6" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="55.5" cy="47" r="1.3" fill="#090712" />
            <path d="M45 28 L50 4 L55 28 Z" fill="#090b14" stroke="#090712" strokeWidth="2.5" />
          </g>
        );

      case 'yun':
        return (
          <g>
            <path d="M12 120 L28 86 L46 90 L56 90 L74 86 L94 120 Z" fill="#2563eb" stroke="#090712" strokeWidth="3.5" />
            <path d="M43 68 L43 88 L57 88 L57 68 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="2" />
            <path d="M36 44 C35 56 41 66 49 68 C57 66 64 56 65 46 C65 38 59 32 50 32 C39 32 36 38 36 44 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="3" />
            <ellipse cx="44" cy="48" rx="2.5" ry="1.6" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="44" cy="48" r="1.3" fill="#090712" />
            <ellipse cx="55" cy="47" rx="2.5" ry="1.6" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="55" cy="47" r="1.3" fill="#090712" />
            <path d="M32 38 Q50 20 68 34 Q50 26 32 38 Z" fill="#facc15" stroke="#090712" strokeWidth="2.5" />
            <path d="M34 38 L68 38 L62 42 L40 42 Z" fill="#eab308" />
          </g>
        );

      case 'yang':
        return (
          <g>
            <path d="M12 120 L28 86 L46 90 L56 90 L74 86 L94 120 Z" fill="#0284c7" stroke="#090712" strokeWidth="3.5" />
            <path d="M46 88 L52 106 L58 88" fill="#f8fafc" stroke="#090712" strokeWidth="2" />
            <path d="M43 68 L43 88 L57 88 L57 68 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="2" />
            <path d="M36 44 C35 56 41 66 49 68 C57 66 64 56 65 46 C65 38 59 32 50 32 C39 32 36 38 36 44 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="3" />
            <ellipse cx="44" cy="48" rx="2.5" ry="1.6" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="44" cy="48" r="1.3" fill="#090712" />
            <ellipse cx="55" cy="47" rx="2.5" ry="1.6" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="55" cy="47" r="1.3" fill="#090712" />
            <line x1="46" y1="60" x2="53" y2="60" stroke="#090712" strokeWidth="2" strokeLinecap="round" />
            <path d="M34 38 C32 18 48 12 62 14 C68 26 66 46 66 46 Z" fill="#090b14" stroke="#090712" strokeWidth="2.5" />
            <path d="M48 18 Q30 32 36 60" stroke="#090b14" strokeWidth="7" fill="none" strokeLinecap="round" />
          </g>
        );

      case 'elena':
        return (
          <g>
            <path d="M12 120 L28 86 L46 90 L56 90 L74 86 L94 120 Z" fill="#0d9488" stroke="#090712" strokeWidth="3.5" />
            <line x1="42" y1="72" x2="58" y2="72" stroke="#facc15" strokeWidth="2.5" />
            <line x1="42" y1="78" x2="58" y2="78" stroke="#ef4444" strokeWidth="2.5" />
            <line x1="42" y1="84" x2="58" y2="84" stroke="#facc15" strokeWidth="2.5" />
            <path d="M43 68 L43 88 L57 88 L57 68 Z" fill="url(#skinDarkGrad)" stroke="#090712" strokeWidth="2" />
            <path d="M36 44 C35 56 41 66 49 68 C57 66 64 56 65 46 C65 38 59 32 50 32 C39 32 36 38 36 44 Z" fill="url(#skinDarkGrad)" stroke="#090712" strokeWidth="3" />
            <ellipse cx="44" cy="48" rx="2.5" ry="1.6" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="44" cy="48" r="1.3" fill="#0d9488" />
            <ellipse cx="55" cy="47" rx="2.5" ry="1.6" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="55" cy="47" r="1.3" fill="#0d9488" />
            <path d="M46 60 Q50 64 54 60 Z" fill="#ffffff" stroke="#090712" strokeWidth="1.5" />
            <path d="M34 38 C32 18 48 12 62 14 C70 24 68 44 68 44 Z" fill="#f8fafc" stroke="#090712" strokeWidth="2.5" />
          </g>
        );

      case 'sean':
        return (
          <g>
            <path d="M10 120 L26 84 L46 88 L56 88 L74 84 L96 120 Z" fill="#eab308" stroke="#090712" strokeWidth="3.5" />
            <line x1="26" y1="86" x2="32" y2="120" stroke="#16a34a" strokeWidth="4" />
            <line x1="72" y1="86" x2="66" y2="120" stroke="#16a34a" strokeWidth="4" />
            <path d="M42 68 L42 90 L58 90 L58 68 Z" fill="url(#skinDarkGrad)" stroke="#090712" strokeWidth="2" />
            <path d="M35 44 C33 58 39 68 49 71 C59 70 66 60 67 48 C67 38 61 30 50 30 C37 30 35 38 35 44 Z" fill="url(#skinDarkGrad)" stroke="#090712" strokeWidth="3" />
            <ellipse cx="44" cy="48" rx="2.5" ry="1.8" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="44" cy="48" r="1.4" fill="#090712" />
            <ellipse cx="56" cy="47" rx="2.5" ry="1.8" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="56" cy="47" r="1.4" fill="#090712" />
            <path d="M44 61 Q50 66 56 60" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M34 38 C32 18 46 14 62 16 C68 26 66 44 66 44 Z" fill="#090b14" stroke="#090712" strokeWidth="2.5" />
          </g>
        );

      case 'gill':
        return (
          <g>
            <path d="M10 120 L26 84 L50 88 L50 120 Z" fill="#ef4444" stroke="#090712" strokeWidth="3" />
            <path d="M50 88 L74 84 L96 120 L50 120 Z" fill="#0284c7" stroke="#090712" strokeWidth="3" />
            <path d="M42 68 L42 90 L50 90 L50 68 Z" fill="#ef4444" stroke="#090712" strokeWidth="2" />
            <path d="M50 68 L50 90 L58 90 L58 68 Z" fill="#0284c7" stroke="#090712" strokeWidth="2" />
            <path d="M35 44 C33 58 39 68 49 71 L49 30 C37 30 35 38 35 44 Z" fill="#ef4444" stroke="#090712" strokeWidth="2.5" />
            <path d="M50 30 L50 71 C59 70 66 60 67 48 C67 38 61 30 50 30 Z" fill="#0284c7" stroke="#090712" strokeWidth="2.5" />
            <ellipse cx="43.5" cy="48" rx="2.5" ry="1.8" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="43.5" cy="48" r="1.4" fill="#ffffff" />
            <ellipse cx="55.5" cy="47" rx="2.5" ry="1.8" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="55.5" cy="47" r="1.4" fill="#ffffff" />
            <path d="M30 36 C24 10 48 4 64 8 C78 14 82 46 76 68" stroke="#facc15" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M26 44 Q16 66 22 88" stroke="#facc15" strokeWidth="5" fill="none" strokeLinecap="round" />
          </g>
        );

      case 'q':
        return (
          <g>
            {/* Fedora Hat & Iron Mask */}
            <path d="M10 120 L26 84 L46 88 L58 88 L76 84 L96 120 Z" fill="#475569" stroke="#090712" strokeWidth="3.5" />
            <path d="M42 68 L42 90 L58 90 L58 68 Z" fill="#334155" stroke="#090712" strokeWidth="2" />
            <path d="M35 44 C33 58 39 68 49 71 C59 70 66 60 67 48 C67 38 61 30 50 30 C37 30 35 38 35 44 Z" fill="#94a3b8" stroke="#090712" strokeWidth="3" />
            <ellipse cx="44" cy="48" rx="2.8" ry="1.8" fill="#eab308" />
            <ellipse cx="56" cy="47" rx="2.8" ry="1.8" fill="#eab308" />
            {/* Fedora Brim */}
            <path d="M24 36 Q50 24 76 34 L72 26 Q50 18 28 28 Z" fill="#334155" stroke="#090712" strokeWidth="2.5" />
          </g>
        );

      default:
        return (
          <g>
            <path d="M10 120 L26 84 L44 88 L52 108 L66 86 L88 95 L96 120 Z" fill="url(#clothGrad)" stroke="#090712" strokeWidth="3.5" />
            <path d="M44 88 L52 106 L60 88" fill={accentColor} stroke="#090712" strokeWidth="2" />
            <path d="M42 68 L42 90 L58 90 L58 68 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="2" />
            <path d="M35 44 C33 58 39 68 49 71 C59 70 66 60 67 48 C67 38 61 30 50 30 C37 30 35 38 35 44 Z" fill="url(#skinGrad)" stroke="#090712" strokeWidth="3" />
            <ellipse cx="43.5" cy="48" rx="2.5" ry="1.8" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="43.5" cy="48" r="1.4" fill="#090712" />
            <ellipse cx="55.5" cy="47" rx="2.5" ry="1.8" fill="#ffffff" stroke="#090712" strokeWidth="1" />
            <circle cx="55.5" cy="47" r="1.4" fill="#090712" />
            <line x1="45" y1="62" x2="54" y2="61" stroke="#090712" strokeWidth="2" strokeLinecap="round" />
            <path d="M34 38 C30 18 46 12 58 14 C68 16 72 28 70 42 Z" fill="#090b14" stroke="#090712" strokeWidth="2.5" />
            <path d="M34 38 L68 36 L67 42 L34 44 Z" fill={accentColor} stroke="#090712" strokeWidth="2" />
          </g>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 100 120"
      preserveAspectRatio="xMidYMid slice"
      className={`w-full h-full select-none ${className}`}
      aria-label={card.name}
    >
      <defs>
        {/* Multi-Stop Skin Gradient */}
        <linearGradient id="skinGrad" x1="80%" y1="15%" x2="20%" y2="85%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="35%" stopColor="#fed7aa" />
          <stop offset="70%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#9a3412" />
        </linearGradient>

        {/* Deep / Dark Skin Gradient */}
        <linearGradient id="skinDarkGrad" x1="80%" y1="15%" x2="20%" y2="85%">
          <stop offset="0%" stopColor="#fed7aa" />
          <stop offset="35%" stopColor="#c2410c" />
          <stop offset="80%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>

        {/* Hair Blonde Gradient */}
        <linearGradient id="hairBlondeGrad" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>

        {/* Cloth Gradient */}
        <linearGradient id="clothGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accentColor} />
          <stop offset="60%" stopColor={signatureColor} />
          <stop offset="100%" stopColor="#08070e" />
        </linearGradient>

        {/* Dark Graphic Novel Background Radial Glow */}
        <radialGradient id={`bg-glow-${id}`} cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor={signatureColor} stopOpacity="0.85" />
          <stop offset="50%" stopColor={signatureColor} stopOpacity="0.35" />
          <stop offset="100%" stopColor="#06050b" stopOpacity="0.98" />
        </radialGradient>
      </defs>

      {/* Dark Smoky Graphic Novel Background */}
      <rect width="100" height="120" fill="#07050d" />
      <rect width="100" height="120" fill={`url(#bg-glow-${id})`} />

      {/* Swirling Smoke / Energy Clouds */}
      <g opacity="0.25">
        <path d="M0 120 Q30 70 50 120 Q70 60 100 120 Z" fill={signatureColor} />
        <path d="M0 0 Q40 40 10 70 Q60 50 100 20 Z" fill="#000000" />
      </g>

      {/* Action Speed / Aura Streaks */}
      <g stroke={accentColor} strokeWidth="0.8" opacity="0.2">
        <line x1="50" y1="45" x2="2" y2="2" />
        <line x1="50" y1="45" x2="98" y2="2" />
        <line x1="50" y1="45" x2="2" y2="118" />
        <line x1="50" y1="45" x2="98" y2="118" />
      </g>

      {/* Floating Combat Embers */}
      <circle cx="18" cy="35" r="1" fill={accentColor} opacity="0.6" />
      <circle cx="82" cy="25" r="1.2" fill={accentColor} opacity="0.7" />
      <circle cx="88" cy="85" r="0.9" fill={signatureColor} opacity="0.5" />
      <circle cx="12" cy="95" r="1.1" fill={signatureColor} opacity="0.5" />

      {/* Fighter Illustration */}
      {renderFighterIllustration()}

      {/* Dramatic Energy Rim Lighting Contour matching the Akuma Reference */}
      <path
        d="M12 120 L28 85 L44 88 L52 108 L66 86 L88 95 L95 120"
        stroke={accentColor}
        strokeWidth="2.2"
        fill="none"
        opacity="0.8"
      />

      {/* Dark Heavy Comic Inked Border */}
      <rect x="1" y="1" width="98" height="118" fill="none" stroke="#090712" strokeWidth="2.5" />
    </svg>
  );
};
