import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, ChevronRight, Calculator, Play, ArrowRight, 
  Sparkles, CheckCircle2, Factory, Video
} from 'lucide-react';
import { HERO_IMAGE_PATH } from '../data';

interface HeroProps {
  onOpenQuoteCalculator: () => void;
  onExploreServices: () => void;
  onPlayVideo: () => void;
  onOpenIndustrialGallery: () => void;
  title?: string;
  subtitle?: string;
}

// Imagem 5 agora na primeira posição (#1) e Imagem 1 na posição 5 (#5) conforme solicitado
const BANNER_IMAGES = [
  { id: 5, src: '/capa/5.jpg', alt: 'GPA Angola Capa Principal' },
  { id: 2, src: '/capa/2.jpg', alt: 'GPA Angola Capa 2' },
  { id: 3, src: '/capa/3.png', alt: 'GPA Angola Capa 3' },
  { id: 4, src: '/capa/4.png', alt: 'GPA Angola Capa 4' },
  { id: 1, src: '/capa/1.png', alt: 'GPA Angola Capa 5' },
  { id: 6, src: '/capa/6.jpg', alt: 'GPA Angola Capa 6' },
  { id: 7, src: '/capa/7.jpg', alt: 'GPA Angola Capa 7' },
  { id: 8, src: '/capa/8.png', alt: 'GPA Angola Capa 8' },
  { id: 9, src: '/capa/9.jpg', alt: 'GPA Angola Capa 9' },
  { id: 10, src: '/capa/10.jpg', alt: 'GPA Angola Capa 10' },
  { id: 11, src: '/capa/11.jpg', alt: 'GPA Angola Capa 11' },
  { id: 12, src: '/capa/12.jpg', alt: 'GPA Angola Capa 12' },
];

export default function Hero({ 
  onOpenQuoteCalculator, 
  onExploreServices, 
  onPlayVideo, 
  onOpenIndustrialGallery,
  title,
  subtitle
}: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? BANNER_IMAGES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % BANNER_IMAGES.length);
  };

  return (
    <div id="home" className="w-full">
      {/* ===================================================================
          1. POYTARA BANNER SLIDER (Full Width & Proporção Completa sem Cortar)
          =================================================================== */}
      <section 
        className="banner-slider relative w-full overflow-hidden bg-black"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Contêiner com proporção 16:9 que exibe a imagem 100% completa de ponta a ponta */}
        <div className="relative w-full aspect-[16/9] max-h-[88vh] overflow-hidden flex items-center justify-center bg-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="w-full h-full flex items-center justify-center cursor-pointer"
              onClick={nextSlide}
            >
              <img 
                src={BANNER_IMAGES[currentSlide].src} 
                alt={BANNER_IMAGES[currentSlide].alt}
                className="w-full h-full object-contain sm:object-cover object-center select-none"
                style={{ imageRendering: 'auto' }}
                loading="eager"
              />
            </motion.div>
          </AnimatePresence>

          {/* Seta Esquerda */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-13 sm:h-13 bg-slate-900/80 hover:bg-[#0B63E5] text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-2xl cursor-pointer border border-white/25 hover:scale-110"
            aria-label="Capa Anterior"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>

          {/* Seta Direita */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-13 sm:h-13 bg-slate-900/80 hover:bg-[#0B63E5] text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-2xl cursor-pointer border border-white/25 hover:scale-110"
            aria-label="Próxima Capa"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>

          {/* Marcadores / Dots das 12 imagens */}
          <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/70 backdrop-blur-md border border-white/15">
            {BANNER_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(idx);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentSlide === idx 
                    ? 'w-6 sm:w-8 h-2 sm:h-2.5 bg-[#0B63E5]' 
                    : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/40 hover:bg-white/80'
                }`}
                aria-label={`Ir para capa ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          2. POYTARA EXACT SECTION .f-block .mirror-box (Cores Azul GPA Royal)
          =================================================================== */}
      <section className="f-block py-16 sm:py-24 bg-fixed">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mirror-box">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Clear Text Hierarchy */}
              <div className="lg:col-span-7 space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#0B63E5]/20 border border-[#0B63E5]/50 text-[#0B63E5] font-akrobat text-xs uppercase tracking-widest font-black rounded-md">
                  <Sparkles className="w-3.5 h-3.5 text-[#0B63E5]" />
                  Indústria Gráfica & Têxtil
                </span>
                
                <h1>
                  Conheça as soluções industriais <br />
                  que estão transformando a comunicação visual:
                </h1>
                
                <h2 className="text-[#0B63E5]">{title && !title.toLowerCase().includes('produção industrial gráfica') ? title : 'EXCELÊNCIA EM ARTES GRÁFICAS, TÊXTIL & BRANDING'}</h2>

                <p>
                  {subtitle || 'Excelência comprovada em produção gráfica de alta tiragem, fardamento têxtil bordado e sinalética arquitetural 3D com precisão, tecnologia de ponta e entrega em todo o território nacional.'}
                </p>

                <div className="pt-2 flex flex-wrap gap-3 items-center">
                  <a 
                    onClick={onExploreServices}
                    className="btn-default"
                    title="Saiba mais sobre os serviços da GPA Angola"
                  >
                    <span>CONHEÇA TODOS OS SERVIÇOS</span>
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </a>

                  <button
                    onClick={onOpenQuoteCalculator}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-white/10 hover:bg-white/20 border border-white/30 text-white font-akrobat text-lg uppercase font-bold transition-all shadow-md cursor-pointer"
                  >
                    <Calculator className="w-4.5 h-4.5 text-[#0B63E5]" />
                    <span>Pedir Orçamento</span>
                  </button>
                </div>
              </div>

              {/* Right Column: 3D Showcase Image (Imagem Número 7 GPA) */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative max-w-[440px] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-slate-900/60 p-2 group hover:border-[#0B63E5]/50 transition-colors">
                  <img 
                    src="/capa/7.jpg" 
                    alt="Produção Industrial Gráfica GPA Angola - Imagem 7" 
                    className="w-full h-auto object-cover rounded-xl shadow-lg transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
