import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Volume2, VolumeX } from 'lucide-react';

interface IntroScreenProps {
  isOpen: boolean;
  onClose: () => void;
  logoUrl?: string;
  videoUrl?: string;
}

export default function IntroScreen({ isOpen, onClose, logoUrl, videoUrl = '/GPA/Cinematic_D_animation_seaml.mp4' }: IntroScreenProps) {
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 overflow-hidden"
      >
        {/* Fullscreen Video Background com zoom e mascaramento para ocultar marca de água */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover scale-[1.08] filter brightness-[0.75] contrast-[1.1] saturate-[1.2]"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>

          {/* Cinematic Vignette Overlay (Escurece cantos e oculta símbolos nos cantos) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.3)_0%,rgba(9,10,16,0.85)_80%,rgba(5,7,12,0.98)_100%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.85)_0%,transparent_35%,transparent_65%,rgba(9,10,16,0.95)_100%)] pointer-events-none" />

          {/* Corner Watermark Masking Badges (Mascara elegantemente o canto inferior direito) */}
          <div className="absolute bottom-4 right-4 z-10 px-4 py-2 bg-slate-950/90 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/90">
              GPA ANGOLA • PRODUÇÃO 2026
            </span>
          </div>
        </div>

        {/* Floating Ambient Orbs (Deep Cobalt & Sapphire Theme) */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-900/25 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-900/30 rounded-full blur-[140px] pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center space-y-8">
          {/* Transparent 3D Floating Logo with Deep Sapphire Ambient Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: -30 }}
            animate={{ 
              opacity: 1, 
              scale: [1, 1.04, 1], 
              y: [0, -10, 0] 
            }}
            transition={{
              opacity: { duration: 1 },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative inline-block my-2"
          >
            {/* Soft Deep Blue Light Halos behind Logo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/35 via-indigo-800/30 to-slate-900/40 rounded-full blur-3xl animate-pulse scale-140 pointer-events-none" />

            {/* Logo Image without solid background */}
            <div className="relative flex items-center justify-center p-2">
              <img
                src={logoUrl || 'https://i.ibb.co/v6FWV57q/LOGO-GPA.png'}
                alt="GPA Angola"
                className="h-28 sm:h-36 md:h-44 max-w-full object-contain filter drop-shadow-[0_0_25px_rgba(30,58,138,0.55)] drop-shadow-[0_15px_30px_rgba(0,0,0,0.95)]"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          {/* Deep Cobalt 3D Title with Rolling Shimmer Sweep: BEM-VINDO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="pt-1 select-none"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-black tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap uppercase leading-none py-2">
              <motion.span
                animate={{
                  backgroundPosition: ['200% 0%', '-200% 0%'],
                  filter: [
                    'drop-shadow(0 0 15px rgba(30,58,138,0.5)) drop-shadow(0 0 25px rgba(255,255,255,0.4))',
                    'drop-shadow(0 0 35px rgba(59,130,246,0.8)) drop-shadow(0 0 45px rgba(255,255,255,0.85))',
                    'drop-shadow(0 0 15px rgba(30,58,138,0.5)) drop-shadow(0 0 25px rgba(255,255,255,0.4))'
                  ]
                }}
                transition={{
                  backgroundPosition: { duration: 4.5, repeat: Infinity, ease: 'linear' },
                  filter: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
                }}
                className="inline-block text-transparent bg-clip-text bg-[linear-gradient(110deg,#cbd5e1,45%,#ffffff,50%,#93c5fd,55%,#cbd5e1)] bg-[length:250%_100%] [text-shadow:_0_1px_0_#1e3a8a,_0_2px_0_#1e40af,_0_4px_0_#1d4ed8,_0_6px_0_#1e3a8a,_0_8px_0_#0f172a,_0_18px_35px_rgba(0,0,0,0.95)]"
              >
                BEM-VINDO
              </motion.span>
            </h1>
          </motion.div>

          {/* Action Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              type="button"
              onClick={onClose}
              className="group relative overflow-hidden flex items-center space-x-3 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white px-9 py-4 rounded-full font-sans font-black text-lg tracking-wider uppercase shadow-[0_15px_40px_rgba(30,58,138,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <span>Entrar no Site</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-4 rounded-full font-sans text-xs font-bold text-white backdrop-blur-md transition-all cursor-pointer"
              title={isMuted ? 'Ativar Som' : 'Desativar Som'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-brand-orange" />}
              <span>{isMuted ? 'Som Desativado' : 'Som Ativo'}</span>
            </button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
