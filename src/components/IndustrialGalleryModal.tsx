import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Play, Pause, Image as ImageIcon, Sparkles } from 'lucide-react';
import { GalleryItem } from '../types';

interface IndustrialGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  liveGallery?: GalleryItem[] | null;
}

export const INDUSTRIAL_IMAGES = [
  "https://i.ibb.co/WWg9Y8mv/702077333-1456320736511584-7030095664157279059-n.jpg",
  "https://i.ibb.co/93Y6R1WR/540920032-1233950912081902-7946009404277390490-n.jpg",
  "https://i.ibb.co/tp11FWrR/540917386-1233950932081900-5699568455854047019-n.jpg",
  "https://i.ibb.co/PzYf2p6Z/540939835-1233950958748564-4095335279366262323-n.jpg",
  "https://i.ibb.co/cKh1RC7X/540916036-1233950978748562-2995131198110979426-n.jpg",
  "https://i.ibb.co/twCRR6XK/536279917-1234695478674112-5049397024375765850-n.jpg",
  "https://i.ibb.co/nscDP5rt/535394858-1234695495340777-7994565590217478960-n.jpg",
  "https://i.ibb.co/Wb57xLt/545679985-1243221307821529-5130119577793807322-n.jpg",
  "https://i.ibb.co/1fvY21TR/545276450-1243221351154858-248397123228796715-n.jpg",
  "https://i.ibb.co/jZxdSQ26/545787440-1243221354488191-832296112002315271-n.jpg",
  "https://i.ibb.co/WNrwbWVK/544941232-1243221381154855-7838865249541884622-n.jpg",
  "https://i.ibb.co/C5FnhWtn/545864171-1244123381064655-8157726408502733676-n.jpg",
  "https://i.ibb.co/1tGrSc0P/558946978-1272051514938508-3963342520463300037-n.jpg",
  "https://i.ibb.co/ksywzjrw/558914071-1272051518271841-5231400735551675422-n.jpg",
  "https://i.ibb.co/SXLZh9Zg/559739719-1272055118271481-1238828744918033296-n.jpg",
  "https://i.ibb.co/spJSvJdJ/589071951-1313233250820334-2592418726624235031-n.jpg",
  "https://i.ibb.co/YB8ssHrL/590709276-1313233260820333-7787760024063928459-n.jpg",
  "https://i.ibb.co/Lzdpj39f/591238995-1313233294153663-7133511066114983303-n.jpg",
  "https://i.ibb.co/ymhVGsd5/590756837-1313238094153183-1365461453351652902-n.jpg",
  "https://i.ibb.co/1GZPbf92/590712223-1313238097486516-4868584510356481379-n.jpg",
  "https://i.ibb.co/k6q0jLFN/590841876-1313238447486481-8546079449643251849-n.jpg",
  "https://i.ibb.co/DHmbgG8j/587935863-1313238540819805-3763238581392909474-n.jpg",
  "https://i.ibb.co/jPSLfJJy/590666367-1313238747486451-5327807463761321786-n.jpg",
  "https://i.ibb.co/8nphHnv6/591884298-1322426489901010-5253783985490263650-n.jpg",
  "https://i.ibb.co/Rk31zNR7/597397236-1322426499901009-5340903461175313730-n.jpg",
  "https://i.ibb.co/8D4dnxWv/594963963-1322426496567676-5880724682465892454-n.jpg",
  "https://i.ibb.co/sv0gN0PW/598425988-1324013893075603-6225627015772856834-n.jpg",
  "https://i.ibb.co/1YvgSyY4/616986224-1352424433567882-5517228228751507923-n-1.jpg",
  "https://i.ibb.co/Zprq56nd/622287632-1361455125998146-4348782168895175086-n.jpg",
  "https://i.ibb.co/HLTgnJCg/625779548-18193345012344465-66904347820869569-n.jpg",
  "https://i.ibb.co/3Y5rhZbV/633998008-1376760894467569-5219175404776028965-n.jpg",
  "https://i.ibb.co/V0tpkRPK/641326424-1385371173606541-7138701938292268132-n.jpg",
  "https://i.ibb.co/00PzykV/645785286-1392448646232127-5976409901730278079-n.jpg",
  "https://i.ibb.co/sJwKN92j/646029489-1392448762898782-92407335605973146-n.jpg",
  "https://i.ibb.co/WW1szHRg/645923786-1392448952898763-3323679438109629361-n.jpg",
  "https://i.ibb.co/zHWqHL7m/647694045-1394040359406289-4973339370753149506-n.jpg",
  "https://i.ibb.co/jPgHZN3s/650829785-1398755772268081-1483771868539569239-n.jpg",
  "https://i.ibb.co/KpZ8WQm8/655524775-1406371991506459-3159243184472948344-n.jpg",
  "https://i.ibb.co/gbX9rYnz/655441939-1407411568069168-7092118679060382198-n.jpg",
  "https://i.ibb.co/Z6cGMXLX/655661189-1407411611402497-7403008564769482131-n.jpg",
  "https://i.ibb.co/dCtc7BR/656551679-1407411614735830-3889654681533585586-n.jpg",
  "https://i.ibb.co/VcPkQQqy/656589756-1408446864632305-9160212963258848695-n.jpg",
  "https://i.ibb.co/8D3TctRD/657840895-1411767247633600-6592884771909627979-n.jpg",
  "https://i.ibb.co/VY7T0pxX/662639885-1417836747026650-3095597324884168411-n.jpg",
  "https://i.ibb.co/qFcTFGT1/662948947-1421070383369953-7183036521982117620-n.jpg",
  "https://i.ibb.co/h1t1xTbB/668176835-1421746166635708-727487059499125795-n.png",
  "https://i.ibb.co/1fKYRBPw/667142113-1422675933209398-6604047788713308752-n.jpg",
  "https://i.ibb.co/CrcQGMY/670421438-1423508169792841-3025246816797071526-n.jpg",
  "https://i.ibb.co/JwFyyNZ6/671612090-1427359116074413-2089177878907233975-n.jpg",
  "https://i.ibb.co/MxY38t1S/671631674-1429185452558446-2827532888539438337-n.jpg",
  "https://i.ibb.co/JjTJDyR3/686236560-1439911168152541-9219824961674823803-n.jpg"
];

// Give short beautiful Portuguese descriptive subtitles based on actual process steps
export const IMAGE_CAPTIONS: Record<number, string> = {
  0: "Bordados computadorizados em fardamentos oficiais de alta cadência",
  1: "Estamparia industrial avançada e triagem têxtil rigorosa",
  2: "Sinalética premium corporativa e revestimento de frotas",
  3: "Impressão digital de grande formato com fidelidade cromática",
  4: "Offset Heidelberg alemã - controlo de densidade de tinta automático",
  5: "Personalização têxtil e corte de precisão computadorizado",
  6: "Gravação laser YAG fina em brindes corporativos e acrílicos",
  7: "Linha de montagem própria de stands de feira modulares e sob medida",
  8: "Impressão de vinil autocolante de alta performance contra intempéries",
  9: "Sinalização interna de alta definição em chapas de Alucobond",
  10: "Controlo manual de qualidade de cada lote antes do embalamento",
  11: "Decoração profissional de veículos comerciais para forte presença de marca",
  12: "Reclames luminosos energeticamente eficientes com iluminação LED",
  13: "Plotters de alta produção com tintas eco-solventes amigas do ambiente",
  14: "Dobragem e acabamento automatizado de catálogos e agendas",
  15: "Prensagem térmica digital para t-shirts promocionais perfeitas",
  16: "Produção de backdrops rígidos para grandes salas de conferência",
  17: "Gravação de brindes tecnológicos e artigos promocionais",
  18: "Bordado industrial com fios alemães de alta resistência e brilho",
  19: "Estúdio criativo integrado de design conceptual e paginação",
  20: "Corte e modelagem 3D de painéis em acrílico e PVC expandido",
  21: "Acabamento em verniz UV localizado para destaque de marcas premium",
  22: "Fardamento técnico de segurança com faixas refletoras certificadas",
  23: "Decoração de montras de lojas comerciais com vinil fosco de privacidade",
  24: "Arrumação e stock de bobinas de lona e tecidos de algodão",
  25: "Secagem térmica profissional para durabilidade extrema de estampas",
  26: "Corte robotizado CNC com precisão milimétrica de materiais rígidos",
  27: "Impressão digital Xerox para prazos imediatos de panfletos",
  28: "Montagem de expositores de ponto de venda robustos e apelativos",
  29: "Impressão de caixas personalizadas com fecho magnético para brindes",
  30: "Cozedura e costura dupla de camisas e polos corporativos",
  31: "Tampografia de alta cadência para canetas e canecas personalizadas",
  32: "Plastificação mate e soft-touch de relatórios corporativos",
  33: "Backdrops de tensão rápida para montagem limpa e sem rugas",
  34: "Pós-cura têxtil contra desbotamento de cores nas lavagens",
  35: "Sinalética direcional de emergência fotoluminescente certificada",
  36: "Produção de caixas americanas de envio com marca gravada",
  37: "Estamparia DTF brilhante e maleável que não racha no peito",
  38: "Alinhamento a laser para letreiros volumétricos exteriores",
  39: "Impressão em papel de alta gramagem texturado para convites",
  40: "Carpintaria especializada própria no fabrico de balcões LED",
  41: "Acabamento de rebordo cosido para bandeiras publicitárias",
  42: "Revisão eletrónica de artes finais para evitar erros de corte",
  43: "Criação de fardamento corporativo personalizado sob medida",
  44: "Lonas gigantes de alta resistência com ilhós de latão",
  45: "Bordados em emblemas de instituições públicas de grande escala",
  46: "Kits de boas-vindas personalizados para integração de novos colaboradores",
  47: "Brindes de luxo gravados a laser com estojo texturado",
  48: "Fitas de pescoço (Lanyards) com fecho de segurança",
  49: "Instalação física de lonas de grande formato em fachadas",
  50: "Expedição de encomendas embaladas com fita protetora GPA"
};

export default function IndustrialGalleryModal({ isOpen, onClose, liveGallery }: IndustrialGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const thumbnailScrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Convert liveGallery or default list into a unified list of GalleryItem
  const galleryList = React.useMemo(() => {
    if (liveGallery && liveGallery.length > 0) {
      return liveGallery.map((item, idx) => ({
        id: item.id || String(idx),
        imageUrl: item.imageUrl,
        caption: item.caption || "Processo de fabrico e rigor industrial GPA Angola",
        order: item.order ?? idx
      }));
    }
    return INDUSTRIAL_IMAGES.map((url, idx) => ({
      id: String(idx),
      imageUrl: url,
      caption: IMAGE_CAPTIONS[idx] || "Processo de fabrico e rigor industrial GPA Angola",
      order: idx
    }));
  }, [liveGallery]);

  // Restart index on open
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setIsPlaying(true);
    }
  }, [isOpen]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? galleryList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === galleryList.length - 1 ? 0 : prev + 1));
  };

  // Autoplay management
  useEffect(() => {
    if (!isOpen) return;

    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }

    if (isPlaying) {
      autoplayTimerRef.current = setInterval(() => {
        handleNext();
      }, 3500);
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [isOpen, isPlaying, currentIndex, galleryList]);

  // Center the active thumbnail into view
  useEffect(() => {
    if (thumbnailScrollContainerRef.current) {
      const activeThumb = thumbnailScrollContainerRef.current.children[currentIndex] as HTMLElement;
      if (activeThumb) {
        thumbnailScrollContainerRef.current.scrollTo({
          left: activeThumb.offsetLeft - thumbnailScrollContainerRef.current.offsetWidth / 2 + activeThumb.offsetWidth / 2,
          behavior: 'smooth'
        });
      }
    }
  }, [currentIndex]);

  if (!isOpen) return null;

  const currentItem = galleryList[currentIndex] || galleryList[0];
  const currentCaption = currentItem?.caption || "Processo de fabrico e rigor industrial GPA Angola";
  const currentImageUrl = currentItem?.imageUrl || "";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 overflow-hidden">
        
        {/* Background Click to Close */}
        <div className="absolute inset-0 cursor-default" onClick={onClose} />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative w-full max-w-5xl bg-slate-900 border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col z-10 max-h-[96vh]"
        >
          
          {/* Header Row */}
          <div className="flex items-center justify-between p-4 sm:px-6 bg-slate-900/90 border-b border-white/10 z-20">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-brand-orange/15 text-brand-orange">
                <Sparkles className="w-4.5 h-4.5 text-brand-orange fill-brand-orange animate-pulse" />
              </div>
              <div>
                <h3 className="text-white font-display font-bold text-sm sm:text-base tracking-wide flex items-center space-x-2">
                  <span>GPA Angola • Parque Industrial</span>
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-400 font-sans leading-none">
                  Galeria interativa de fotos reais da nossa linha de produção
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Play / Pause Autoplay State indicator */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  isPlaying ? 'bg-brand-orange/25 text-brand-orange' : 'bg-white/10 text-slate-300'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-brand-orange" /> : <Play className="w-3.5 h-3.5 fill-slate-300" />}
                <span className="hidden sm:inline">{isPlaying ? 'Autoplay Ativo' : 'Pausado'}</span>
              </button>

              <button
                onClick={onClose}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full cursor-pointer transition-colors"
                title="Fechar galeria"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Large Main Showcase Carousel Area */}
          <div className="relative flex-1 flex items-center justify-center bg-slate-950 aspect-video md:min-h-[420px] max-h-[60vh] overflow-hidden group">
            
            {/* Direct Slider Image container */}
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={currentImageUrl}
                alt={currentCaption}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="max-h-full max-w-full object-contain pointer-events-none"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-3 p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900/90 text-white border border-white/5 shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer opacity-80 hover:opacity-100"
              title="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900/90 text-white border border-white/5 shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer opacity-80 hover:opacity-100"
              title="Próxima"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Top-Right Index Indicator Pill */}
            <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur border border-white/10 rounded-full px-3 py-1 text-[11px] font-mono font-bold text-slate-300">
              {currentIndex + 1} / {galleryList.length}
            </div>

            {/* Caption Banner overlay at bottom */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/65 to-transparent p-4 pt-12 text-center text-white font-sans z-10">
              <motion.p
                key={currentIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs sm:text-sm font-medium tracking-wide text-slate-100 max-w-2xl mx-auto drop-shadow-md"
              >
                {currentCaption}
              </motion.p>
            </div>
          </div>

          {/* Bottom Thumbnails Navigation Strip */}
          <div className="bg-slate-950 p-3 sm:p-4 border-t border-white/5 flex flex-col space-y-2">
            <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider px-1">
              <ImageIcon className="w-3 h-3 text-brand-orange" />
              <span>Navegador Rápido de Fotos ({galleryList.length} itens)</span>
            </div>

            <div 
              ref={thumbnailScrollContainerRef}
              className="flex overflow-x-auto space-x-2 pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent select-none whitespace-nowrap scroll-smooth"
            >
              {galleryList.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsPlaying(false); // Pause on manual select
                  }}
                  className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    currentIndex === idx 
                      ? 'border-brand-orange scale-102 shadow-lg brightness-110' 
                      : 'border-white/10 brightness-50 hover:brightness-100 hover:border-white/35'
                  }`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.caption}
                    className="w-full h-full object-cover pointer-events-none"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <span className="absolute bottom-0.5 right-0.5 bg-black/75 px-1 py-0.2 rounded font-mono text-[8px] font-bold text-white leading-none scale-90">
                    {idx + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt to book */}
          <div className="bg-slate-900 px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-white border-t border-white/10 gap-3">
            <span className="text-xs font-sans text-slate-300 text-center sm:text-left leading-relaxed">
              👉 <strong>Processo 100% Interno:</strong> Desde o design conceptual e carpintaria gráfica à cozedura têxtil e instalação final.
            </span>
            <button
              onClick={() => {
                onClose();
                // We'll let the parent handle the transition to quote
                const el = document.getElementById('portfolio');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold py-2 px-5 rounded-xl shadow cursor-pointer transition-colors flex-shrink-0"
            >
              Simular Projeto Agora
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
