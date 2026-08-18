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

    // Fast increment based on target size
    const duration = 1500; // ms
    const increment = Math.ceil(end / (duration / 16)); // ~60fps
    
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

  // Format with thousand separator
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-sm h-full justify-center">
      <div className="p-3 bg-brand-orange/15 rounded-2xl text-brand-orange mb-3 shadow-inner">
        <Icon className="w-6 h-6 stroke-[2]" />
      </div>
      <div className="font-display font-black text-2xl sm:text-3xl text-brand-orange tracking-tight">
        {formatNumber(count)}
        {suffix}
      </div>
      <div className="text-xs sm:text-sm text-white font-sans font-medium mt-1">
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
    { icon: Calendar, targetValue: anosExperiencia, suffix: '+', label: 'Anos de Experiência' },
    { icon: MapPin, targetValue: provinciasAtendidas, suffix: '', label: 'Províncias Atendidas' },
    { icon: Smile, targetValue: 98, suffix: '%', label: 'Taxa de Satisfação' }
  ];

  return (
    <section className="bg-[#21185f] py-12 sm:py-16 border-y border-white/5 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.04)_0%,transparent_70%)] pointer-events-none"></div>
      
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
