import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Calendar, User, Tag, Plus, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PROJECTS } from '../data';
import { Project } from '../types';

// Subcomponent to animate and auto-rotate images inside each card in the grid
function ProjectCardImage({ project }: { project: Project }) {
  const images = useMemo(() => {
    return [project.image, ...(project.images || [])].filter(Boolean);
  }, [project.image, project.images]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3500); // Rotate every 3.5 seconds
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={project.title}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.5 }}
          transition={{ duration: 0.6 }}
          className="w-full h-full object-cover transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      </AnimatePresence>

      {/* Discrete slide indicators at the corner of the card if there are multiple images */}
      {images.length > 1 && (
        <div className="absolute bottom-3 right-3 flex space-x-1 z-10 bg-slate-950/50 backdrop-blur-xs py-1 px-2 rounded-full">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'bg-brand-orange w-3.5' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Subcomponent to animate, auto-rotate and allow manual navigation in the expanded Lightbox
function ProjectLightboxCarousel({ project }: { project: Project }) {
  const images = useMemo(() => {
    return [project.image, ...(project.images || [])].filter(Boolean);
  }, [project.image, project.images]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Rotate every 4 seconds in details view
    return () => clearInterval(interval);
  }, [images]);

  if (images.length <= 1) {
    return (
      <div className="relative w-full h-full min-h-[300px] sm:min-h-[400px] md:min-h-full">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[300px] sm:min-h-[400px] md:min-h-full bg-slate-950 overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${project.title} - Foto ${currentIndex + 1}`}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.6 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover absolute inset-0"
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none"></div>

      {/* Manual Controls (Arrows) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        }}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-slate-950/60 hover:bg-brand-orange text-white rounded-full transition-colors z-20 cursor-pointer hidden sm:block opacity-0 group-hover:opacity-100 duration-300"
        title="Foto anterior"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setCurrentIndex((prev) => (prev + 1) % images.length);
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-slate-950/60 hover:bg-brand-orange text-white rounded-full transition-colors z-20 cursor-pointer hidden sm:block opacity-0 group-hover:opacity-100 duration-300"
        title="Próxima foto"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Thumbnail Indicators */}
      <div className="absolute bottom-5 inset-x-0 flex justify-center items-center space-x-2 z-20 px-4">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(i);
            }}
            className={`relative w-12 h-9 sm:w-14 sm:h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
              i === currentIndex ? 'border-brand-orange scale-110 shadow-lg' : 'border-white/30 hover:border-white/70 hover:scale-105'
            }`}
            title={`Ver foto ${i + 1}`}
          >
            <img
              src={img}
              alt={`Miniatura ${i + 1}`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

interface PortfolioProps {
  onOpenQuoteForProject: (serviceId: string, productName: string) => void;
  liveProjects?: Project[] | null;
}

export default function Portfolio({ onOpenQuoteForProject, liveProjects }: PortfolioProps) {
  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Generate filters from actual project categories + 'todos'
  const filterOptions = [
    { label: 'Todos', value: 'todos' },
    { label: 'Stands & Exposições', value: 'stands' },
    { label: 'Têxtil Personalizado', value: 'textil' },
    { label: 'Sinalética', value: 'sinaletica' },
    { label: 'Brindes', value: 'brindes' },
  ];

  // Filtering and Searching logic
  const filteredProjects = useMemo(() => {
    const list = (liveProjects && liveProjects.length > 0) ? liveProjects : PROJECTS;
    return list.filter((proj) => {
      const matchesFilter = activeFilter === 'todos' || proj.category === activeFilter;
      const matchesSearch = 
        proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery, liveProjects]);

  return (
    <section id="portfolio" className="relative pt-32 sm:pt-36 md:pt-44 lg:pt-48 pb-20 overflow-hidden border-t border-white/10 bg-slate-950 text-slate-900 scroll-mt-28 min-h-screen">
      {/* Background Video (Cinematic_D_animation_seaml.mp4) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05] opacity-75"
        >
          <source src="/GPA/Cinematic_D_animation_seaml.mp4" type="video/mp4" />
        </video>
        {/* Soft Glass Contrast Overlays */}
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[3px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/30 to-slate-950/80 pointer-events-none" />
      </div>

      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl space-y-4">
            <div className="inline-block text-[11px] font-mono font-extrabold tracking-[0.24em] text-brand-orange uppercase bg-slate-950/80 px-4 py-2 rounded-full border border-brand-orange/30 shadow-[0_0_25px_rgba(245,158,11,0.25)] backdrop-blur-md">
              Portfólio de Sucesso
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]">
              Resultados Que Geram Impacto & Conexão
            </h2>
            <p className="text-sm sm:text-base text-slate-200 font-sans leading-relaxed drop-shadow">
              Descubra as soluções criativas que ajudam marcas de referência em Angola a comunicar, conectar e crescer em grande escala.
            </p>
          </div>

          <div className="relative w-full md:w-80 flex-shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
            <input
              type="text"
              placeholder="Pesquisar por cliente ou projeto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/85 border border-white/20 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 rounded-xl py-2.5 pl-11 pr-4 text-sm font-sans text-white placeholder-slate-400 focus:outline-none transition-all shadow-xl backdrop-blur-md"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-8">
          <div className="flex items-center space-x-2 mr-2 text-slate-300 font-semibold text-xs font-mono uppercase">
            <Filter className="w-3.5 h-3.5 text-brand-orange" />
            <span>Filtrar:</span>
          </div>
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setActiveFilter(opt.value)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer backdrop-blur-md ${
                activeFilter === opt.value
                  ? 'bg-gradient-to-r from-brand-orange to-amber-400 text-white shadow-[0_10px_25px_rgba(245,158,11,0.4)] font-bold'
                  : 'bg-slate-950/75 text-slate-200 border border-white/15 hover:bg-white/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj, idx) => (
              <motion.div
                key={proj.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onClick={() => setSelectedProject(proj)}
                className="group relative bg-white/92 rounded-[28px] overflow-hidden shadow-[0_20px_45px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_60px_rgba(245,158,11,0.3)] border border-white/60 cursor-pointer transition-all duration-300 backdrop-blur-xl hover:-translate-y-1 hover:border-brand-orange"
              >
                <div className="relative overflow-hidden aspect-[4/3] bg-slate-900">
                  <ProjectCardImage project={proj} />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="flex items-center space-x-2 text-white font-display font-bold text-sm">
                      <span>Ver ficha técnica</span>
                      <Plus className="w-4 h-4 bg-brand-orange text-white rounded-full p-0.5" />
                    </div>
                  </div>

                  <div className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur-md rounded-xl py-1 px-3 shadow-md border border-white/10">
                    <span className="text-[11px] font-display font-extrabold text-white">
                      {proj.client}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-[10px] font-mono font-bold uppercase text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-md">
                    {proj.categoryLabel}
                  </span>

                  <h3 className="text-base sm:text-lg font-display font-black text-brand-purple mt-2 group-hover:text-brand-orange transition-colors">
                    {proj.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 font-sans mt-2 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty Search State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <Search className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg text-brand-purple">Nenhum projeto encontrado</h3>
            <p className="text-sm text-gray-500 font-sans max-w-md mx-auto mt-1">
              Não conseguimos encontrar resultados para "{searchQuery}". Experimente usar outro termo ou limpar os filtros.
            </p>
            <button
              onClick={() => { setActiveFilter('todos'); setSearchQuery(''); }}
              className="mt-4 bg-brand-purple text-white text-xs font-semibold tracking-wide py-2 px-4 rounded-xl hover:bg-brand-purple-dark transition-colors"
            >
              Repor Filtros
            </button>
          </div>
        )}

      </div>

      {/* Project Lightbox Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark glass backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] overflow-y-auto text-slate-800"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-full cursor-pointer transition-colors z-20 border border-slate-200"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12">
                
                {/* Left col: Image and visual cues (5 cols) */}
                <div className="md:col-span-6 bg-slate-950 relative min-h-[250px] sm:min-h-[350px] md:min-h-full flex flex-col justify-between">
                  <ProjectLightboxCarousel project={selectedProject} />
                  
                  {/* Title overlay on mobile-first image banner */}
                  <div className="absolute bottom-6 left-6 text-white pr-6 z-20 pointer-events-none">
                    <span className="text-xs font-mono font-semibold tracking-wider text-brand-orange uppercase">
                      {selectedProject.categoryLabel}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-display font-extrabold mt-1">
                      {selectedProject.title}
                    </h3>
                  </div>
                </div>

                {/* Right col: Technical specs & Details (7 cols) */}
                <div className="md:col-span-6 p-6 sm:p-8 space-y-6">
                  
                  {/* Client Profile Header */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-100 pb-5">
                    <div className="flex items-center space-x-2">
                      <User className="w-4.5 h-4.5 text-brand-orange" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-slate-500 font-bold uppercase leading-none">Cliente</span>
                        <span className="text-sm font-sans font-bold text-brand-purple mt-0.5">{selectedProject.client}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4.5 h-4.5 text-brand-orange" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-slate-500 font-bold uppercase leading-none">Ano</span>
                        <span className="text-sm font-sans font-bold text-brand-purple mt-0.5">{selectedProject.year}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Tag className="w-4.5 h-4.5 text-brand-orange" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-slate-500 font-bold uppercase leading-none">Categoria</span>
                        <span className="text-sm font-sans font-bold text-brand-purple mt-0.5 truncate max-w-[80px]">{selectedProject.categoryLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Project description */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold tracking-wider text-slate-500 uppercase">Resumo do Projeto</h4>
                    <p className="text-sm text-slate-600 font-sans leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>

                  {/* Technical Specifications Table */}
                  {selectedProject.details && selectedProject.details.length > 0 && (
                    <div className="space-y-3 bg-brand-purple-light p-4 rounded-2xl border border-slate-200/80">
                      <h4 className="text-xs font-mono font-bold tracking-wider text-brand-purple uppercase flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-brand-orange" />
                        <span>Ficha Técnica do Material</span>
                      </h4>
                      <div className="divide-y divide-slate-100">
                        {selectedProject.details.map((detail, idx) => (
                          <div key={idx} className="flex justify-between py-2 text-xs font-sans">
                            <span className="text-slate-500 font-semibold">{detail.label}</span>
                            <span className="text-brand-purple font-bold text-right">{detail.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Direct Simulation Prompt */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        onOpenQuoteForProject(selectedProject.category, selectedProject.title);
                        setSelectedProject(null);
                      }}
                      className="w-full flex items-center justify-center space-x-2 bg-brand-orange hover:bg-brand-orange-hover text-white py-3.5 px-5 rounded-xl font-display font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      <span>Solicitar Orçamento Idêntico</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-[10px] text-slate-500 font-sans text-center mt-2.5">
                      Personalize quantidades e materiais na etapa seguinte. Estimativa calculada em tempo real.
                    </p>
                  </div>

                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
