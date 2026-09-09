import React from 'react';
import { motion } from 'motion/react';
import { Factory, Play, ArrowUpRight, Sparkles } from 'lucide-react';

interface CategoryBannersProps {
  onSelectCategory: (categoryId: string) => void;
  onOpenQuoteWithService: (serviceId?: string) => void;
  onPlayVideo?: () => void;
}

export default function CategoryBanners({ onSelectCategory, onOpenQuoteWithService, onPlayVideo }: CategoryBannersProps) {
  return (
    <section className="s-block categories-banners py-8 bg-white">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Card 1 (Lado Esquerdo): Parque de Produção Industrial Gráfica e Têxtil em Luanda */}
          <div 
            className="box-image cursor-pointer group relative overflow-hidden rounded-2xl border border-slate-200 shadow-lg h-[260px] sm:h-[320px] bg-cover bg-center transition-all duration-300 hover:shadow-2xl hover:border-[#0B63E5]/50"
            style={{ backgroundImage: `url('/capa/7.jpg')` }}
            onClick={() => onSelectCategory('production')}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20 transition-all duration-300 group-hover:from-black/98 group-hover:via-black/60" />
            <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#0B63E5] transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div className="absolute bottom-0 left-0 p-6 sm:p-8 space-y-2 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#0B63E5] text-white text-xs font-akrobat uppercase tracking-wider font-black shadow-sm">
                <Factory className="w-3.5 h-3.5" /> Luanda · 21 Províncias
              </span>
              <h3 className="font-akrobat text-2xl sm:text-3xl lg:text-4xl text-white uppercase font-black tracking-tight leading-none group-hover:text-[#0B63E5] transition-colors">
                Produção Industrial Gráfica e Têxtil em Luanda
              </h3>
              <p className="text-neutral-300 font-montserrat text-xs sm:text-sm max-w-lg leading-relaxed">
                Maquinaria offset alemã, bordados computadorizados e estamparia industrial própria com capacidade de alta escala instalada.
              </p>
            </div>
          </div>

          {/* Card 2 (Lado Direito): Vídeo Institucional GPA Angola */}
          <div 
            className="box-image cursor-pointer group relative overflow-hidden rounded-2xl border border-slate-200 shadow-lg h-[260px] sm:h-[320px] bg-cover bg-center transition-all duration-300 hover:shadow-2xl hover:border-[#0B63E5]/50"
            style={{ backgroundImage: `url('/GPA/hero_poster.jpg')` }}
            onClick={onPlayVideo}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/30 transition-all duration-300 group-hover:from-black/98 group-hover:via-black/50" />
            
            {/* Play Button Center Pulse */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#0B63E5] group-hover:bg-[#0052CC] text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 border-2 border-white/70">
                <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-current ml-1" />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 p-6 sm:p-8 space-y-2 z-10 w-full">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-red-600 text-white text-xs font-akrobat uppercase tracking-wider font-black shadow-sm">
                <Play className="w-3 h-3 fill-current" /> Vídeo Institucional 4K
              </span>
              <h3 className="font-akrobat text-2xl sm:text-3xl lg:text-4xl text-white uppercase font-black tracking-tight leading-none group-hover:text-[#0B63E5] transition-colors">
                Apresentação Institucional em Vídeo
              </h3>
              <p className="text-neutral-300 font-montserrat text-xs sm:text-sm max-w-lg leading-relaxed">
                Clique para assistir à visita guiada pela nossa fábrica e conhecer os bastidores da produção gráfica e têxtil.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
