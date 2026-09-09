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
  const [modalImageIndex, setModalImageIndex] = useState<number>(0);

  useEffect(() => {
    getServicesData().then(data => {
      if (data && data.length > 0) {
        const merged = data.map(service => {
          const localMatch = SERVICES.find(s => s.id === service.id);
          return {
            ...service,
            imageUrl: localMatch?.imageUrl || service.imageUrl,
            hoverImageUrl: localMatch?.hoverImageUrl || service.hoverImageUrl,
          };
        });
        setLiveServices(merged);
      }
    });
  }, []);

  const handleOpenModal = (service: Service) => {
    setSelectedService(service);
    setModalImageIndex(0);
  };

  return (
    <section id="services" className="t-block py-16 bg-white">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ===================================================================
            POYTARA T-BLOCK TITLE (EXACT POYTARA SPEC)
            =================================================================== */}
        <div className="mb-8 text-center">
          <h1>SERVIÇOS EM <span>DESTAQUE</span></h1>
        </div>

        {/* ===================================================================
            POYTARA INITIAL-PRODUCTS GRID (EXACT POYTARA SPEC & GPA ASSETS)
            =================================================================== */}
        <div className="initial-products">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {liveServices.map((service) => (
              <div key={service.id} className="col-prod">
                <div 
                  className="box-product group"
                  onClick={() => handleOpenModal(service)}
                >
                  {/* Exact Poytara Box Background */}
                  <div className="box-bg">
                    
                    {/* Poytara Signature Corner Fold Ribbon */}
                    <div className="absolute top-0 left-0 w-11 h-11 bg-gradient-to-br from-[#767676] to-[#555555] rounded-br-[100%] z-20 shadow-sm pointer-events-none group-hover:from-[#0B63E5] group-hover:to-[#0052CC] transition-all duration-300 opacity-90 group-hover:opacity-100" />

                    {/* Badge Poytara Style if present */}
                    {service.badge && (
                      <div className="absolute top-3 right-3 z-30 bg-slate-900/90 group-hover:bg-[#0B63E5] text-white px-2.5 py-1 rounded text-[11px] font-akrobat uppercase font-black tracking-wider shadow-sm transition-colors duration-300">
                        {service.badge}
                      </div>
                    )}

                    {/* Primary Product Image (Large 380px object-contain) */}
                    <img 
                      src={service.imageUrl} 
                      alt={service.title} 
                      className="product img-fluid"
                      loading="lazy" 
                    />

                    {/* Secondary Hover Highlight Image (.feed) */}
                    {service.hoverImageUrl && (
                      <img 
                        src={service.hoverImageUrl} 
                        alt={`${service.title} em Destaque`} 
                        className="feed img-fluid" 
                        loading="lazy" 
                      />
                    )}

                    {/* Poytara Signature Circular Background with Zoom Animation */}
                    <div className="circle-bg">
                      <img 
                        src={service.hoverImageUrl || service.imageUrl} 
                        alt="" 
                        className="iframe-dynamic img-fluid" 
                        loading="lazy" 
                      />
                    </div>

                    {/* Poytara Search Icon */}
                    <div className="absolute bottom-3 right-3 z-30 flex items-center justify-center w-8 h-8 rounded-full bg-white/95 group-hover:bg-[#0B63E5] group-hover:text-white text-slate-700 shadow-sm group-hover:shadow-md transition-all duration-300 transform group-hover:scale-110">
                      <Icons.Search className="w-4 h-4 stroke-[2.2]" />
                    </div>
                  </div>

                  {/* Description Box (Poytara .box-dsc) */}
                  <div className="box-dsc">
                    <h2>{service.title}</h2>
                    <p>{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ===================================================================
          SERVICE DETAIL MODAL
          =================================================================== */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white text-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden z-10 border border-slate-200 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
                <h3 className="font-akrobat text-2xl uppercase font-black tracking-wide text-white leading-none">
                  {selectedService.title}
                </h3>

                <button
                  onClick={() => setSelectedService(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <Icons.X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-3">
                    <div className="h-64 rounded-xl overflow-hidden border border-slate-200 shadow-md bg-slate-900 relative">
                      <img
                        src={modalImageIndex === 1 && selectedService.hoverImageUrl ? selectedService.hoverImageUrl : selectedService.imageUrl}
                        alt={selectedService.title}
                        className="w-full h-full object-cover transition-all duration-300"
                      />
                    </div>

                    {/* Dual Thumbnail Switcher */}
                    {selectedService.hoverImageUrl && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setModalImageIndex(0)}
                          className={`flex-1 py-2 px-3 rounded-lg border text-xs font-akrobat uppercase font-bold transition-all cursor-pointer ${
                            modalImageIndex === 0 
                              ? 'bg-[#0B63E5] text-white border-[#0B63E5] shadow-sm' 
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          Foto 1 (Principal)
                        </button>
                        <button 
                          onClick={() => setModalImageIndex(1)}
                          className={`flex-1 py-2 px-3 rounded-lg border text-xs font-akrobat uppercase font-bold transition-all cursor-pointer ${
                            modalImageIndex === 1 
                              ? 'bg-[#0B63E5] text-white border-[#0B63E5] shadow-sm' 
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          Foto 2 (LED Iluminado)
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <span className="inline-block text-xs font-akrobat font-black tracking-widest text-[#0B63E5] uppercase bg-[#0B63E5]/10 px-2.5 py-0.5 rounded">
                      {selectedService.badge || 'GPA Industrial'}
                    </span>
                    <h4 className="font-akrobat text-2xl uppercase font-black text-slate-900 leading-tight">
                      Visão Geral da Produção
                    </h4>
                    <p className="text-slate-600 font-montserrat text-sm leading-relaxed">
                      {selectedService.fullDescription || selectedService.description}
                    </p>
                  </div>
                </div>

                {/* Features List */}
                {selectedService.features && selectedService.features.length > 0 && (
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h4 className="font-akrobat text-lg uppercase font-bold text-slate-900">
                      Diferenciais & Acabamentos
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedService.features.map((feature, i) => (
                        <div key={i} className="flex items-center space-x-2 text-xs sm:text-sm font-montserrat text-slate-700">
                          <Icons.CheckCircle2 className="w-4 h-4 text-[#0B63E5] shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Typical Products List */}
                {selectedService.typicalProducts && selectedService.typicalProducts.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-akrobat text-base uppercase font-bold text-slate-800">
                      Aplicações Comuns:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedService.typicalProducts.map((prod, i) => (
                        <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-montserrat font-medium border border-slate-200">
                          {prod}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-slate-600 hover:text-slate-900 font-montserrat text-sm font-semibold cursor-pointer"
                >
                  Fechar Janela
                </button>

                <button
                  onClick={() => {
                    const id = selectedService.id;
                    setSelectedService(null);
                    onOpenQuoteCalculatorWithService(id);
                  }}
                  className="bg-gradient-to-r from-[#0052CC] to-[#0B63E5] hover:from-[#0B63E5] hover:to-[#0052CC] text-white font-akrobat text-lg uppercase font-black px-7 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  Simular Cotação Agora
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
