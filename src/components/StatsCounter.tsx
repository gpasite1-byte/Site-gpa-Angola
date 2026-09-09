import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, CheckSquare, Calendar, MapPin, Smile } from 'lucide-react';

interface StatItemProps {
  icon: React.ElementType;
  targetValue: number;
  suffix: string;
  label: string;
}

function AnimatedNumber({ icon: Icon, targetValue, suffix, label }: StatItemProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = targetValue;
    if (start === end) return;

    const duration = 1500;
    const increment = Math.ceil(end / (duration / 16));
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [targetValue]);

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="flex flex-col items-center text-center p-6 rounded-lg bg-black/60 border border-white/10 hover:border-[#AF9B72]/50 transition-all duration-300 shadow-md h-full justify-center group">
      <div className="p-3 bg-white/5 group-hover:bg-[#AF9B72]/20 rounded-xl text-[#AF9B72] mb-3 transition-colors">
        <Icon className="w-6 h-6 stroke-[2]" />
      </div>
      <div className="font-akrobat font-black text-4xl sm:text-5xl text-[#AF9B72] tracking-tight leading-none">
        {formatNumber(count)}
        {suffix}
      </div>
      <div className="text-xs sm:text-sm text-neutral-300 font-montserrat font-semibold mt-2 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}

interface StatsCounterProps {
  provinciasAtendidas?: number;
  anosExperiencia?: number;
}

export default function StatsCounter({ provinciasAtendidas = 21, anosExperiencia = 18 }: StatsCounterProps) {
  const stats = [
    { icon: Users, targetValue: 1248, suffix: '+', label: 'Clientes Satisfeitos' },
    { icon: CheckSquare, targetValue: 12450, suffix: '+', label: 'Projetos Concluídos' },
    { icon: Calendar, targetValue: anosExperiencia, suffix: '+', label: 'Anos de Liderança' },
    { icon: MapPin, targetValue: provinciasAtendidas, suffix: '', label: 'Províncias Atendidas' },
    { icon: Smile, targetValue: 98, suffix: '%', label: 'Taxa de Satisfação' }
  ];

  return (
    <section className="bg-[#050505] py-14 border-t border-b border-[#AF9B72]/30 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className={idx === 4 ? 'col-span-2 lg:col-span-1' : ''}
            >
              <AnimatedNumber
                icon={stat.icon}
                targetValue={stat.targetValue}
                suffix={stat.suffix}
                label={stat.label}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
