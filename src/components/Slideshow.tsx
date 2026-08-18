import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Sparkles, Box, Award, ShieldCheck, Shirt, Lightbulb } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  badge: string;
  icon: React.ElementType;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    badge: 'Produção Têxtil Industrial',
    title: 'Fardamento & Merchandising de Alta Escala',
    subtitle: 'Costura industrial e estamparia personalizada',
    description: 'Personalizamos camisolas, polos, coletes refletores e fardamento técnico completo com durabilidade extrema para indústrias e corporações em toda Angola.',
    imageUrl: 'https://i.ibb.co/twCRR6XK/536279917-1234695478674112-5049397024375765850-n.jpg',
    icon: Shirt
  },
  {
    id: 2,
    badge: 'Stands & Eventos',
    title: 'Soluções Integradas para Exposições e Feiras',
    subtitle: 'Montagem de stands corporativos premium',
    description: 'Criamos experiências de marca memoráveis através do design, produção e instalação de stands interativos na FILDA e outros grandes palcos nacionais.',
    imageUrl: 'https://i.ibb.co/3Y5rhZbV/633998008-1376760894467569-5219175404776028965-n.jpg',
    icon: Box
  },
  {
    id: 3,
    badge: 'Sinalética & Fachadas',
    title: 'Identidade Corporativa em Grande Formato',
    subtitle: 'Comunicação exterior com durabilidade testada',
    description: 'Produzimos e instalamos reclames luminosos, painéis publicitários de grande porte, letras monobloco 3D e sinalética de segurança industrial.',
    imageUrl: 'https://i.ibb.co/spJSvJdJ/589071951-1313233250820334-2592418726624235031-n.jpg',
    icon: Lightbulb
  },
  {
    id: 4,
    badge: 'Impressão Offset & Digital',
    title: 'Alta Definição que Impressiona Clientes',
    subtitle: 'Parque gráfico moderno com tecnologia alemã',
    description: 'Flyers, desdobráveis, catálogos e agendas produzidos em papel de alta qualidade com acabamentos envernizados e corte geométrico preciso.',
    imageUrl: 'https://i.ibb.co/ksywzjrw/558914071-1272051518271841-5231400735551675422-n.jpg',
    icon: ShieldCheck
  },
  {
    id: 5,
    badge: 'Brindes Promocionais',
    title: 'Sua Marca Sempre Presente no Dia a Dia',
    subtitle: 'Memorabilidade de marca sob medida',
    description: 'Canetas, blocos de notas, canecas e mochilas personalizadas de elevada durabilidade para campanhas de marketing de grande impacto.',
    imageUrl: 'https://i.ibb.co/sv0gN0PW/598425988-1324013893075603-6225627015772856834-n.jpg',
    icon: Award
  }
];

export default function Slideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000); // Auto-rotation every 6 seconds
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handlePrev = () => {
    setDirection('left');
    setCurrentIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection('right');
    setCurrentIndex((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  };

  const handleSelect = (index: number) => {
    setDirection(index > currentIndex ? 'right' : 'left');
    setCurrentIndex(index);
  };

  const activeSlide = SLIDES[currentIndex];
  const ActiveIcon = activeSlide.icon;

  return (
    <section id="production" className="pt-48 sm:pt-56 md:pt-64 lg:pt-72 pb-24 bg-[#f9fbff] border-t border-b border-slate-100 overflow-hidden relative scroll-mt-36">
      {/* Background Orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-50px] w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
         {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-14 mt-8 sm:mt-12 space-y-5">
          <div className="inline-block text-sm font-mono font-bold tracking-widest text-brand-orange uppercase bg-brand-orange/10 px-4 py-1.5 rounded-full">
            Destaques da Produção
          </div>
          <h2 
            style={{ fontFamily: 'Italiana, serif', fontSize: '59px', fontStyle: 'normal', lineHeight: '48px' }}
            className="text-3xl sm:text-4.5xl lg:text-5xl tracking-tight text-brand-purple"
          >
            Rigor Industrial em Cada Detalhe
          </h2>
          <p 
            style={{ fontFamily: '"Noto Sans Old Italic", "Noto Sans", sans-serif', fontWeight: 'normal' }}
            className="text-base sm:text-lg text-slate-700 leading-relaxed"
          >
            Navegue pelos principais setores produtivos da GPA Angola e conheça o compromisso de qualidade que nos posiciona como líderes de mercado.
          </p>
        </div>

        {/* Carousel Container Box */}
        <div className="relative bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xl min-h-[520px] md:min-h-[460px] flex flex-col md:flex-row">
          
          {/* Left Column: Interactive Image Carousel */}
          <div className="w-full md:w-1/2 relative h-[280px] sm:h-[380px] md:h-auto min-h-[280px] bg-slate-950 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.img
                key={currentIndex}
                src={activeSlide.imageUrl}
                alt={activeSlide.title}
                initial={{ opacity: 0.1, scale: 1.15, filter: 'blur(6px)' }}
                animate={{ opacity: 1, scale: [1.12, 1.02], filter: 'blur(0px)' }}
                exit={{ opacity: 0.1, scale: 0.96, filter: 'blur(4px)' }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="absolute inset-0 w-full h-full object-cover origin-center"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent pointer-events-none"></div>

            {/* Quick manual overlay navigation for images */}
            <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center z-20">
              <span className="text-xs font-mono font-extrabold bg-black/65 text-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-white/10 uppercase tracking-widest">
                {activeSlide.badge}
              </span>
              <div className="flex space-x-1.5">
                {SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? 'bg-brand-orange w-5' : 'bg-white/40 hover:bg-white/70'
                    }`}
                    title={`Ver slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Descriptions and Stats */}
          <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-between bg-white relative">
            {/* Hex decor */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.02)_0%,transparent_60%)] pointer-events-none"></div>

            <div className="space-y-6 relative z-10">
              {/* Slide Meta Card Header */}
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-brand-orange/10 text-brand-orange rounded-2xl border border-brand-orange/15 shadow-inner">
                  <ActiveIcon className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-brand-orange block">
                    GPA Angola Produção
                  </span>
                  <span className="text-sm font-bold text-slate-500 font-sans">Setor Industrial 0{activeSlide.id}</span>
                </div>
              </div>

              {/* Title and descriptions with custom key transition */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: direction === 'right' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction === 'right' ? -20 : 20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <h3 className="text-2xl sm:text-3.5xl font-display font-black leading-tight text-slate-900">
                    {activeSlide.title}
                  </h3>
                  <p className="text-base sm:text-lg font-bold text-slate-800 font-sans">
                    {activeSlide.subtitle}
                  </p>
                  <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
                    {activeSlide.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Controls / Interactivity Bar */}
            <div className="mt-8 pt-6 border-t border-slate-150 flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-2 text-xs font-mono font-black text-slate-600 uppercase tracking-widest">
                <Sparkles className="w-5 h-5 text-brand-orange animate-pulse" />
                <span>Padrão Europeu</span>
              </div>

              {/* Action Navigation Buttons */}
              <div className="flex space-x-2.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-3 bg-slate-50 border-2 border-slate-200 hover:border-brand-orange text-slate-700 hover:text-brand-orange rounded-xl transition-all shadow-xs hover:shadow-sm cursor-pointer"
                  title="Slide anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-3 bg-slate-50 border-2 border-slate-200 hover:border-brand-orange text-slate-700 hover:text-brand-orange rounded-xl transition-all shadow-xs hover:shadow-sm cursor-pointer"
                  title="Próximo slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
