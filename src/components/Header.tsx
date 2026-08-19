import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Menu, X, Phone, Calculator, ArrowRight, ChevronDown, MessageSquare } from 'lucide-react';

interface HeaderProps {
  onOpenQuoteCalculator: () => void;
  onScrollToSection: (id: string) => void;
  activeSection: string;
  logoUrl?: string;
  companyPhones?: string[];
}

export default function Header({ onOpenQuoteCalculator, onScrollToSection, activeSection, logoUrl, companyPhones }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactsDropdownOpen, setIsContactsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Início', id: 'home' },
    { label: 'Produção Industrial', id: 'production' },
    { label: 'Sobre Nós', id: 'about' },
    { label: 'Loja Online', id: 'store' },
    { label: 'Serviços', id: 'services' },
    { label: 'Portfólio', id: 'portfolio' },
    { label: 'Contactos', id: 'contact' },
  ];

  const handleNavClick = (id: string) => {
    onScrollToSection(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-[0_12px_40px_rgba(15,23,42,0.08)] py-3 text-slate-800 border-b border-slate-200/70'
          : 'bg-gradient-to-b from-slate-950/95 via-slate-950/70 to-transparent backdrop-blur-md py-4 text-white'
      }`}
    >
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          <div
            id="header-logo"
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => handleNavClick('home')}
          >
            <motion.div 
              className="relative flex items-center justify-start w-40 h-12 sm:w-56 sm:h-16 md:w-72 md:h-20 lg:w-[400px] lg:h-26 bg-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Animated glow background for logo */}
              <motion.div
                className="absolute inset-0 rounded-3xl bg-gradient-to-r from-brand-orange/0 via-brand-orange/25 to-amber-400/0 blur-3xl"
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  scale: [0.95, 1.1, 0.95]
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Main logo image */}
              <motion.img
                src={logoUrl || "https://i.ibb.co/v6FWV57q/LOGO-GPA.png"}
                alt="GPA Angola"
                className="relative w-full h-full object-contain object-left"
                referrerPolicy="no-referrer"
                animate={{
                  y: [0, -8, 0],
                  filter: [
                    "drop-shadow(0 10px 25px rgba(17,13,34,0.1))",
                    "drop-shadow(0 20px 40px rgba(245,158,11,0.3))",
                    "drop-shadow(0 10px 25px rgba(17,13,34,0.1))"
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>

          <nav id="desktop-nav" className="hidden lg:flex items-center space-x-6 xl:space-x-8 font-display font-semibold">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={index === 0 ? { fontWeight: '800' } : undefined}
                className={`relative py-2 text-[12px] xl:text-[13px] uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  activeSection === item.id
                    ? 'text-brand-orange font-extrabold'
                    : isScrolled
                    ? 'text-slate-700 hover:text-brand-orange font-bold'
                    : 'text-slate-100 hover:text-brand-orange font-bold drop-shadow-sm'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 rounded-full bg-gradient-to-r from-brand-orange via-amber-400 to-brand-gold"></span>
                )}
              </button>
            ))}
          </nav>

          <div className="hidden sm:flex items-center space-x-6">
            <div
              className="relative"
              onMouseEnter={() => setIsContactsDropdownOpen(true)}
              onMouseLeave={() => setIsContactsDropdownOpen(false)}
            >
              <button
                onClick={() => setIsContactsDropdownOpen(!isContactsDropdownOpen)}
                className={`flex items-center space-x-2 text-xs font-mono font-bold tracking-wider uppercase py-2 px-3.5 rounded-xl transition-all cursor-pointer border ${
                  isScrolled
                    ? 'bg-slate-100 text-slate-800 border-slate-200 hover:border-brand-orange/40 hover:bg-brand-orange/5'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-brand-orange/60 backdrop-blur-md'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-brand-orange" />
                <span>Contactos</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isContactsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Contacts Dropdown */}
              {isContactsDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-800 p-3 space-y-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-[0.2em] text-amber-400 block px-2 pt-1">
                    Linhas Diretas GPA
                  </span>
                  {(() => {
                    const labels = ["Comercial", "Orçamentos", "Produção", "Geral"];
                    const phones = companyPhones && companyPhones.length > 0
                      ? companyPhones
                      : ['+244 945 119 409', '+244 933 417 569', '+244 953 979 343', '+244 994 943 828'];

                    return phones.map((phone, idx) => {
                      const cleaned = phone.replace(/\s+/g, '');
                      const label = labels[idx] || "Atendimento";
                      return (
                        <div key={phone} className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-brand-orange/40 transition-colors group">
                          <div>
                            <span className="text-[9px] uppercase font-mono text-slate-400 font-bold block">{label}</span>
                            <span className="text-xs font-mono font-bold text-white group-hover:text-brand-orange transition-colors">{phone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <a
                              href={`tel:${cleaned}`}
                              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-brand-orange transition-colors"
                              title="Ligar"
                            >
                              <Phone className="w-3 h-3" />
                            </a>
                            <a
                              href={`https://wa.me/${cleaned.replace('+', '').replace(/\s+/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                              title="WhatsApp"
                            >
                              <MessageSquare className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>

            <button
              onClick={onOpenQuoteCalculator}
              className="bg-gradient-to-r from-brand-orange to-amber-500 hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-[0_10px_25px_rgba(245,158,11,0.35)] flex items-center space-x-2 cursor-pointer transition-all transform hover:scale-[1.02]"
            >
              <Calculator className="w-4 h-4" />
              <span>Simular Preço</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-70" />
            </button>
          </div>

          {/* MOBILE TOGGLE & ACTION */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={onOpenQuoteCalculator}
              className="p-2.5 rounded-xl bg-gradient-to-r from-brand-orange to-amber-400 text-white shadow-[0_10px_20px_rgba(245,158,11,0.35)] cursor-pointer active:scale-95"
              title="Solicitar Orçamento"
            >
              <Calculator className="w-4.5 h-4.5" />
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2.5 rounded-xl transition-all cursor-pointer border ${
                isScrolled 
                  ? 'text-slate-800 bg-slate-100 border-slate-200 hover:bg-slate-200' 
                  : 'text-white bg-slate-900/80 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="lg:hidden absolute top-full left-0 w-full bg-slate-950/98 backdrop-blur-2xl shadow-[0_25px_50px_rgba(0,0,0,0.7)] border-t border-slate-800 py-5 px-6 max-h-[85vh] overflow-y-auto"
        >
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer border ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-brand-orange to-amber-500 text-white border-amber-400/40 shadow-lg'
                    : 'text-slate-100 bg-slate-900/70 border-slate-800/80 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="border-t border-slate-800/80 pt-4 mt-3 space-y-2.5">
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-[0.2em] text-amber-400 block px-2">
                Linhas Diretas de Atendimento
              </span>
              <div className="space-y-2">
                {(() => {
                  const labels = ["Comercial", "Orçamentos", "Produção", "Geral"];
                  const phones = companyPhones && companyPhones.length > 0
                    ? companyPhones
                    : ['+244 945 119 409', '+244 933 417 569', '+244 953 979 343', '+244 994 943 828'];

                  return phones.map((phone, idx) => {
                    const cleaned = phone.replace(/\s+/g, '');
                    const label = labels[idx] || "Atendimento";
                    return (
                      <div key={phone} className="flex items-center justify-between py-2 px-3.5 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="text-left">
                          <span className="text-[9px] uppercase font-mono text-slate-400 font-bold block">{label}</span>
                          <span className="text-xs font-mono font-bold text-white">{phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <a
                            href={`tel:${cleaned}`}
                            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-white hover:text-brand-orange transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`https://wa.me/${cleaned.replace('+', '').replace(/\s+/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
