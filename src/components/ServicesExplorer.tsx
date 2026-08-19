import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { SERVICES } from '../data';
import { Service } from '../types';
import { getServicesData } from '../firebaseClient';

interface ServicesExplorerProps {
  onOpenQuoteCalculatorWithService: (serviceId: string) => void;
}

export default function ServicesExplorer({ onOpenQuoteCalculatorWithService }: ServicesExplorerProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [liveServices, setLiveServices] = useState<Service[]>(SERVICES);

  useEffect(() => {
    getServicesData().then(data => {
      if (data && data.length > 0) {
        setLiveServices(data);
      }
    });
  }, []);

  // Dynamic Lucide Icon Resolver
  const renderIcon = (iconName: string, className: string = "w-6 h-6") => {
    const IconComp = (Icons as any)[iconName];
    if (IconComp) {
      return <IconComp className={className} />;
    }
    return <Icons.HelpCircle className={className} />;
  };

  return (
    <section id="services" className="relative pt-32 sm:pt-36 md:pt-44 lg:pt-48 pb-20 overflow-hidden border-t border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.10),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_20%),linear-gradient(135deg,#fffaf5_0%,#f5f7ff_35%,#f9fafb_100%)] text-slate-800 scroll-mt-28">
      <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(17,13,34,0.02)_100%)]"></div>
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-[11px] font-mono font-bold tracking-[0.24em] text-brand-orange uppercase bg-white/70 px-4 py-2 rounded-full border border-brand-orange/15 shadow-[0_10px_24px_rgba(245,158,11,0.12)]"
          >
            Capabilities & Produção Industrial
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-[-0.04em] text-brand-purple">
            O Que Produzimos Com Excelência
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-sans leading-relaxed">
            Conheça a nossa capacidade técnica e parque de máquinas. Clique em qualquer setor de produção para explorar os equipamentos, produtos finais e solicitar orçamento direto.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {liveServices.map((service, idx) => {
            const isSelected = selectedService?.id === service.id;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => setSelectedService(isSelected ? null : service)}
                className={`group relative rounded-[28px] border cursor-pointer transition-all duration-300 overflow-hidden backdrop-blur-md ${
                  isSelected
                    ? 'border-brand-orange/50 bg-white shadow-[0_25px_50px_rgba(17,13,34,0.15)] scale-[1.01] z-10'
                    : 'border-slate-200/80 bg-white/80 shadow-[0_16px_32px_rgba(15,23,42,0.05)] hover:shadow-[0_22px_42px_rgba(17,13,34,0.12)] hover:border-brand-orange/30 hover:-translate-y-1'
                }`}
              >
                {/* Header Photo Container */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={service.imageUrl || 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=800&q=80'}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-85"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                  
                  {/* Badge */}
                  {service.badge && (
                    <div className="absolute top-3.5 left-3.5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-orange/90 text-white shadow-md backdrop-blur-md">
                        {service.badge}
                      </span>
                    </div>
                  )}

                  {/* Floating Icon */}
                  <div className={`absolute bottom-3 right-3.5 w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-brand-orange text-white shadow-lg scale-110'
                      : 'bg-white/90 text-slate-900 group-hover:bg-brand-orange group-hover:text-white shadow-md'
                  }`}>
                    {renderIcon(service.iconName, 'w-5 h-5 stroke-[2.2]')}
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 space-y-2.5">
                  <h3 className="text-lg font-display font-black text-brand-purple group-hover:text-brand-orange transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed line-clamp-2">
                    {service.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs font-semibold text-brand-orange font-mono">
                    <span className="flex items-center space-x-1.5 group-hover:translate-x-1 transition-transform">
                      <span>{isSelected ? 'Ocultar detalhes' : 'Ver especialidades'}</span>
                      <Icons.ArrowRight className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">GPA Industrial</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic Detail Panel (Displays when a service is clicked) */}
        <AnimatePresence mode="wait">
          {selectedService && (
            <motion.div
              key={selectedService.id}
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="bg-white text-slate-800 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl relative border border-slate-200/80">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Full Bio, Image & Features */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3.5 rounded-2xl bg-brand-orange text-white shadow-md">
                        {renderIcon(selectedService.iconName, 'w-7 h-7 stroke-[2.2]')}
                      </div>
                      <div>
                        <span className="text-xs font-mono text-brand-orange font-bold uppercase tracking-wider">Setor Industrial GPA</span>
                        <h3 className="text-2xl sm:text-3xl font-display font-extrabold mt-0.5 text-brand-purple">{selectedService.title}</h3>
                      </div>
                    </div>

                    {/* Featured Large Image Banner */}
                    <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden shadow-md border border-slate-100 group">
                      <img
                        src={selectedService.imageUrl || 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=1000&q=80'}
                        alt={selectedService.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                        <span className="text-xs font-mono font-bold uppercase tracking-widest bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                          {selectedService.badge || 'Capacidade Industrial'}
                        </span>
                        <span className="text-[11px] font-sans text-slate-200">Garantia GPA Angola</span>
                      </div>
                    </div>

                    <p className="text-base text-slate-600 font-sans leading-relaxed">
                      {selectedService.fullDescription}
                    </p>

                    {/* Features checklist */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-sm font-mono font-bold tracking-wider text-brand-orange uppercase">Vantagens & Capacidades</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedService.features.map((feature, i) => (
                          <div key={i} className="flex items-start space-x-2.5">
                            <Icons.CheckCircle2 className="w-4.5 h-4.5 text-brand-orange flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-700 font-sans">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Typical Products List & Quote Call */}
                  <div className="lg:col-span-5 bg-brand-purple-light/50 border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
                    <div className="space-y-3">
                      <h4 className="text-sm font-mono font-bold tracking-wider text-brand-orange uppercase flex items-center space-x-2">
                        <Icons.ShoppingBag className="w-4 h-4" />
                        <span>Produtos Mais Solicitados</span>
                      </h4>
                      <ul className="space-y-2.5">
                        {selectedService.typicalProducts.map((prod, i) => (
                          <li key={i} className="flex items-center space-x-3 text-sm text-slate-700 font-medium">
                            <span className="w-2 h-2 rounded-full bg-brand-orange"></span>
                            <span>{prod}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-slate-100 pt-5 flex flex-col space-y-3">
                      <p className="text-xs text-slate-500 font-sans">
                        Necessita de um produto personalizado ou quer discutir uma tiragem especial? Fale directamente com a nossa equipa industrial de produção.
                      </p>
                      
                      <button
                        onClick={() => onOpenQuoteCalculatorWithService(selectedService.id)}
                        className="w-full flex items-center justify-center space-x-2 bg-brand-orange hover:bg-brand-orange-hover text-white py-3.5 px-5 rounded-xl font-display font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                      >
                        <Icons.Calculator className="w-4.5 h-4.5" />
                        <span>Simular Orçamento para {selectedService.title}</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}

