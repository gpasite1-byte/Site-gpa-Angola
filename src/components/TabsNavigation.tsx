import React from 'react';
import { motion } from 'motion/react';
import { Home, Zap, Users, ShoppingBag, Sparkles, Grid3x3, Phone } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface TabsNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs: Tab[] = [
  {
    id: 'home',
    label: 'Início',
    icon: <Home className="w-4 h-4" />,
    description: 'Página inicial'
  },
  {
    id: 'production',
    label: 'Produção',
    icon: <Zap className="w-4 h-4" />,
    description: 'Industrial'
  },
  {
    id: 'about',
    label: 'Sobre Nós',
    icon: <Users className="w-4 h-4" />,
    description: 'Quem Somos'
  },
  {
    id: 'store',
    label: 'Loja Online',
    icon: <ShoppingBag className="w-4 h-4" />,
    description: 'Catálogo'
  },
  {
    id: 'services',
    label: 'Serviços',
    icon: <Sparkles className="w-4 h-4" />,
    description: 'O que oferecemos'
  },
  {
    id: 'portfolio',
    label: 'Portfólio',
    icon: <Grid3x3 className="w-4 h-4" />,
    description: 'Casos de sucesso'
  },
  {
    id: 'contact',
    label: 'Contacto',
    icon: <Phone className="w-4 h-4" />,
    description: 'Fale connosco'
  }
];

export default function TabsNavigation({ activeTab, onTabChange }: TabsNavigationProps) {
  return (
    <div className="sticky top-20 z-30 bg-gradient-to-b from-white/95 via-white/90 to-white/80 backdrop-blur-xl border-b border-white/20 shadow-[0_8px_32px_rgba(15,23,42,0.08)]">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide py-3">
          {tabs.map((tab, idx) => (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl font-display font-bold text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'text-white bg-gradient-to-r from-brand-orange to-amber-400 shadow-[0_12px_28px_rgba(245,158,11,0.3)]'
                  : 'text-slate-600 hover:text-brand-orange hover:bg-white/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  className="absolute -bottom-3 left-4 right-4 h-1 bg-gradient-to-r from-brand-orange to-amber-400 rounded-full"
                  layoutId="activeTab"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
