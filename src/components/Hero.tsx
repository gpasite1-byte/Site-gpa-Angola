import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, ArrowRight, ShieldCheck, Clock, Layers, Award, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { INDUSTRIAL_IMAGES, IMAGE_CAPTIONS } from './IndustrialGalleryModal';
import { HERO_IMAGE_PATH } from '../data';

interface HeroProps {
  onOpenQuoteCalculator: () => void;
  onExploreServices: () => void;
  onPlayVideo: () => void;
  onOpenIndustrialGallery: () => void;
  title?: string;
  subtitle?: string;
  videoUrl?: string;
}

export default function Hero({ 
  onOpenQuoteCalculator, 
  onExploreServices, 
  onPlayVideo, 
  onOpenIndustrialGallery,
  title,
  subtitle,
  videoUrl = '/GPA/Cinematic_D_animation_seaml.mp4'
}: HeroProps) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const cleanUrl = url.trim();
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/shorts\/)([^#\&\?]*).*/;
    const match = cleanUrl.match(regExp);
    if (match && match[2]) {
      const cleanId = match[2].trim();
      if (cleanId.length === 11) return cleanId;
    }
    const fallbackRegExp = /(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const fallbackMatch = cleanUrl.match(fallbackRegExp);
    if (fallbackMatch && fallbackMatch[1]) return fallbackMatch[1];
    return null;
  };

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % INDUSTRIAL_IMAGES.length);
    }, 4500); // 4.5 seconds pacing
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === 0 ? INDUSTRIAL_IMAGES.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % INDUSTRIAL_IMAGES.length);
  };

  const features = [
    {
      icon: ShieldCheck,
      title: 'Qualidade Premium',
      desc: 'Acabamentos de excelência'
    },
    {
      icon: Clock,
      title: 'Prazos Cumpridos',
      desc: 'Compromisso e entrega pontual'
    },
    {
      icon: Layers,
      title: 'Soluções Integradas',
      desc: 'Do design à execução'
    },
    {
      icon: Award,
      title: 'Atendimento Dedicado',
      desc: 'Focado no seu sucesso'
    }
  ];

  const cinematicVideo = videoUrl || '/GPA/Cinematic_D_animation_seaml.mp4';

  return (
    <section
      id="home"
      className="relative pt-36 sm:pt-44 md:pt-52 lg:pt-56 pb-16 md:pb-24 overflow-hidden text-slate-800"
    >
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(147,51,234,0.16),transparent_30%),linear-gradient(135deg,rgba(17,13,34,0.82),rgba(15,23,42,0.72),rgba(17,13,34,0.8))]" />
      <div className="hero-orb left-8 top-20 h-52 w-52 bg-orange-300/40"></div>
      <div className="hero-orb right-10 bottom-12 h-80 w-80 bg-violet-300/30" style={{ animationDelay: '1.2s' }}></div>
      <div className="hero-orb left-1/2 top-16 h-64 w-64 bg-amber-200/30" style={{ animationDelay: '2.4s' }}></div>

      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20 pb-12 border-b border-white/10">
          <div className="lg:col-span-7 space-y-6 md:space-y-8 text-left reveal-up">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2.5 bg-white/8 backdrop-blur-xl px-4 py-2.5 rounded-full border border-orange-300/30 shadow-[0_15px_35px_rgba(17,13,34,0.18)]"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-brand-orange to-amber-400 animate-pulse"></span>
              <span className="text-[11px] sm:text-xs font-mono font-extrabold tracking-[0.2em] uppercase text-white/90">
                Soluções Gráficas & Marketing
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ fontFamily: 'Sora, sans-serif', fontStyle: 'normal' }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.05em] leading-[0.94] text-white drop-shadow-[0_10px_24px_rgba(15,23,42,0.45)]"
            >
              {title ? (
                title.replace(/Parque de /gi, '').replace(/^#\s*/, '')
              ) : (
                <>
                  Transformamos ideias em <span className="bg-gradient-to-r from-brand-orange via-amber-300 to-yellow-200 bg-clip-text text-transparent">marcas</span> que impressionam.
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-200 max-w-2xl leading-relaxed drop-shadow-[0_8px_18px_rgba(15,23,42,0.35)]"
            >
              {subtitle ? subtitle : 'Soluções criativas e inovadoras em impressão gráfica, personalização têxtil, marketing digital e muito mais para impulsionar o seu negócio com alto impacto visual.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 items-center"
            >
              <button
                onClick={onExploreServices}
                className="group relative overflow-hidden flex items-center space-x-2.5 bg-gradient-to-r from-brand-orange via-amber-400 to-brand-orange text-white hover:brightness-110 px-8 py-4 rounded-full font-display font-black text-lg shadow-[0_18px_40px_rgba(245,158,11,0.35)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span className="relative z-10">Os Nossos Serviços</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onPlayVideo}
                className="flex items-center space-x-2.5 bg-white/10 border border-white/20 hover:bg-white/15 hover:border-orange-200/40 px-8 py-4 rounded-full font-display font-black text-lg text-white shadow-[0_18px_32px_rgba(17,13,34,0.18)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer backdrop-blur-md"
              >
                <div className="p-1.5 rounded-full bg-brand-orange/10 text-brand-orange">
                  <Play className="w-5 h-5 fill-brand-orange text-brand-orange" />
                </div>
                <span>Ver Vídeo Institucional</span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4"
            >
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-3 text-white shadow-[0_12px_28px_rgba(15,23,42,0.15)]">
                    <div className="mb-2 inline-flex rounded-xl bg-white/10 p-2 text-brand-orange">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-300">{feature.title}</div>
                    <div className="mt-1 text-xs text-white/90">{feature.desc}</div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="w-full relative premium-card premium-glow rounded-[30px] overflow-hidden p-4"
            >
              <div className="relative overflow-hidden rounded-[24px] aspect-[4/5] border border-white/10 bg-slate-950">
                <img
                  src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80"
                  alt="Produção industrial GPA"
                  className="h-full w-full object-cover opacity-85"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-brand-orange">
                    <span className="h-2 w-2 rounded-full bg-brand-orange animate-pulse"></span>
                    Produção ativa
                  </div>
                  <h3 className="mt-3 text-2xl font-display font-black text-white">Impressão, sinalética e branding em grande escala.</h3>
                  <p className="mt-2 text-sm text-slate-200">Tecnologia industrial, acabamento premium e exigência de execução impecável.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mb-16 relative">
          <div className="text-center mb-8">
            <span className="text-sm font-mono font-bold tracking-[0.2em] text-brand-orange uppercase bg-white/75 px-4 py-2.5 rounded-full border border-brand-orange/15 shadow-[0_12px_28px_rgba(245,158,11,0.12)]">
              🏭 CAPACIDADE GPA • PRODUÇÃO INDUSTRIAL ATIVA
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative flex justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-200/50 via-white/10 to-violet-200/40 rounded-[32px] filter blur-2xl transform scale-95 pointer-events-none"></div>

            <div className="relative bg-slate-950/30 border border-brand-orange/20 rounded-[32px] shadow-[0_30px_90px_rgba(17,13,34,0.14)] overflow-hidden group w-full h-[550px] sm:h-[700px] lg:h-[800px] xl:h-[850px]">
              <div className="relative w-full h-full bg-slate-950">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImgIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img
                      src={INDUSTRIAL_IMAGES[currentImgIndex]}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover filter blur-3xl opacity-40 select-none pointer-events-none scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <motion.img
                      key={`img_${currentImgIndex}`}
                      initial={{ scale: 1.08 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 4.5, ease: "linear" }}
                      src={INDUSTRIAL_IMAGES[currentImgIndex]}
                      alt={`GPA Angola - ${IMAGE_CAPTIONS[currentImgIndex] || 'Linha de Produção'}`}
                      className="w-full h-full object-cover relative z-10"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute top-0 left-0 right-0 h-1.5 z-20 bg-white/10">
                  <motion.div
                    key={`${currentImgIndex}_${isPlaying}`}
                    initial={{ width: '0%' }}
                    animate={isPlaying ? { width: '100%' } : { width: '0%' }}
                    transition={{ duration: 4.5, ease: 'linear' }}
                    className="h-full bg-gradient-to-r from-brand-orange via-amber-400 to-brand-gold shadow-[0_0_10px_rgba(245,158,11,0.7)]"
                  />
                </div>

                <button
                  onClick={handlePrevImage}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-slate-900/70 hover:bg-slate-900/90 text-white border border-white/15 shadow-lg hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-20"
                  title="Imagem Anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-slate-900/70 hover:bg-slate-900/90 text-white border border-white/15 shadow-lg hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-20"
                  title="Próxima Imagem"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent p-8 pt-24 text-left z-10 pointer-events-none">
                  <p className="text-xs sm:text-sm uppercase font-mono text-brand-orange font-black tracking-[0.18em] leading-none">
                    PARQUE INDUSTRIAL GPA • PAINEL {currentImgIndex + 1} / {INDUSTRIAL_IMAGES.length}
                  </p>
                  <p className="text-base sm:text-lg lg:text-xl font-display font-black text-white mt-3.5 max-w-4xl drop-shadow-md leading-relaxed tracking-wide">
                    {IMAGE_CAPTIONS[currentImgIndex] || "Rigor industrial e acabamento de excelência"}
                  </p>
                </div>

                <div className="absolute top-5 right-5 flex items-center space-x-3 bg-slate-950/75 backdrop-blur-md px-4 py-2.5 rounded-full z-20 border border-white/10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPlaying(!isPlaying);
                    }}
                    className="text-white hover:text-brand-orange transition-colors p-0.5 flex items-center justify-center cursor-pointer"
                    title={isPlaying ? 'Pausar Reprodução' : 'Iniciar Reprodução'}
                  >
                    {isPlaying ? (
                      <Pause className="w-3.5 h-3.5 fill-white text-white hover:fill-brand-orange hover:text-brand-orange" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-white text-white hover:fill-brand-orange hover:text-brand-orange" />
                    )}
                  </button>
                  <div className="h-4 w-px bg-white/20" />
                  {Array.from({ length: 8 }).map((_, idx) => {
                    const groupSize = Math.ceil(INDUSTRIAL_IMAGES.length / 8);
                    const isActive = Math.floor(currentImgIndex / groupSize) === idx;
                    return (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImgIndex(idx * groupSize);
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          isActive ? 'bg-brand-orange shadow-[0_0_12px_rgba(245,158,11,0.8)]' : 'bg-white/40'
                        }`}
                        title={`Imagem ${idx + 1}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
