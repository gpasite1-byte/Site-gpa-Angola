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
          ? 'bg-white/90 backdrop-blur-xl shadow-[0_12px_40px_rgba(15,23,42,0.08)] py-3 text-slate-800 border-b border-slate-200/70'
          : 'bg-gradient-to-b from-slate-950/85 via-slate-950/45 to-transparent backdrop-blur-sm py-4 text-slate-800'
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
              className="relative flex items-center justify-start w-48 h-14 sm:w-64 sm:h-18 md:w-80 md:h-22 lg:w-[420px] lg:h-28 bg-transparent"
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
              
              {/* Main logo image com animação de flutuação */}
              <motion.img
                src={logoUrl || "https://i.ibb.co/v6FWV57q/LOGO-GPA.png"}
                alt="GPA Angola"
                className="relative w-full h-full object-contain object-left"
                referrerPolicy="no-referrer"
                animate={{
                  y: [0, -12, 0],
                  filter: [
                    "drop-shadow(0 10px 25px rgba(17,13,34,0.1))",
                    "drop-shadow(0 25px 50px rgba(245,158,11,0.3))",
                    "drop-shadow(0 10px 25px rgba(17,13,34,0.1))"
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Shine effect que aparece e desaparece */}
              <motion.div
                className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                animate={{
                  opacity: [0, 0.4, 0],
                  x: [-200, 200, -200]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: 2,
                  ease: "easeInOut"
                }}
                style={{ pointerEvents: 'none' }}
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
                    ? 'text-slate-600 hover:text-brand-orange'
                    : 'md:text-slate-600 hover:text-brand-orange text-slate-500'
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
                className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-full border transition-all duration-300 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  isScrolled
                    ? 'bg-white/90 border-white/70 text-slate-800 shadow-[0_16px_36px_rgba(15,23,42,0.08)] hover:border-brand-orange/40'
                    : 'bg-white/70 border-white/50 text-slate-800 shadow-[0_18px_38px_rgba(15,23,42,0.08)] backdrop-blur-md hover:border-brand-orange/40'
                }`}
              >
                <div className="p-1.5 rounded-full bg-gradient-to-br from-brand-orange to-amber-400 text-white shadow-[0_8px_18px_rgba(245,158,11,0.32)] flex-shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center space-x-1.5 whitespace-nowrap flex-shrink-0">
                  <span className="text-[9px] uppercase font-mono text-slate-500 font-black tracking-[0.18em] whitespace-nowrap">Contacto:</span>
                  <span className="font-mono text-xs font-bold text-slate-800 whitespace-nowrap">
                    {companyPhones && companyPhones.length > 0 ? companyPhones[0] : '+244 945 119 409'}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${isContactsDropdownOpen ? 'rotate-180 text-brand-orange' : ''}`} />
              </button>

              {isContactsDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white/95 border border-slate-200/80 rounded-3xl shadow-[0_22px_60px_rgba(15,23,42,0.14)] p-4 z-50 backdrop-blur-xl">
                  <div className="space-y-3.5">
                    <div className="border-b border-slate-100 pb-2">
                      <span className="text-[10px] uppercase font-mono text-brand-orange font-black tracking-[0.2em] block">GPA Angola</span>
                      <span className="text-[9px] text-slate-500 block mt-0.5">Clique para ligar ou abrir WhatsApp direto</span>
                    </div>

                    <div className="space-y-2">
                      {(() => {
                        const labels = ["Departamento Comercial", "Gestão de Orçamentos", "Apoio e Produção", "Direção Geral"];
                        const phones = companyPhones && companyPhones.length > 0
                          ? companyPhones
                          : ['+244 945 119 409', '+244 933 417 569', '+244 953 979 343', '+244 994 943 828'];

                        return phones.map((phone, idx) => {
                          const cleaned = phone.replace(/\s+/g, '');
                          const label = labels[idx] || "Linha de Atendimento";
                          return (
                            <div key={phone} className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition-colors group/item">
                              <div className="text-left">
                                <span className="text-[9px] uppercase font-mono text-slate-400 font-bold block">{label}</span>
                                <span className="text-xs font-mono font-bold text-slate-800">{phone}</span>
                              </div>
                              <div className="flex items-center space-x-1.5">
                                <a
                                  href={`tel:${cleaned}`}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-brand-orange hover:text-white text-slate-600 transition-colors"
                                  title={`Ligar para ${label}`}
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                                <a
                                  href={`https://wa.me/${cleaned.replace('+', '').replace(/\s+/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-whatsapp-official hover:text-white text-whatsapp-official transition-colors"
                                  title={`Mensagem para ${label}`}
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
              )}
            </div>
          </div>

          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={onOpenQuoteCalculator}
              className="sm:hidden p-2 rounded-full bg-gradient-to-r from-brand-orange to-amber-400 text-white shadow-[0_12px_24px_rgba(245,158,11,0.3)] cursor-pointer"
              title="Solicitar Orçamento"
            >
              <Calculator className="w-4.5 h-4.5" />
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isScrolled ? 'text-slate-800 hover:bg-slate-100' : 'md:text-slate-800 hover:bg-slate-100 text-slate-800'
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
          className="lg:hidden absolute top-full left-0 w-full bg-white/90 backdrop-blur-xl shadow-[0_18px_40px_rgba(15,23,42,0.12)] border-t border-slate-200/80 py-4 px-6"
        >
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-brand-orange/10 text-brand-orange font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="border-t border-slate-100 pt-4 mt-2 space-y-2">
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-[0.2em] text-slate-400 block px-3">
                Canais de Atendimento
              </span>
              <div className="space-y-1">
                {(() => {
                  const labels = ["Comercial", "Orçamentos", "Produção", "Geral"];
                  const phones = companyPhones && companyPhones.length > 0
                    ? companyPhones
                    : ['+244 945 119 409', '+244 933 417 569', '+244 953 979 343', '+244 994 943 828'];

                  return phones.map((phone, idx) => {
                    const cleaned = phone.replace(/\s+/g, '');
                    const label = labels[idx] || "Atendimento";
                    return (
                      <div key={phone} className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-100/50">
                        <div className="text-left">
                          <span className="text-[9px] uppercase font-mono text-slate-400 font-bold block">{label}</span>
                          <span className="text-xs font-mono font-bold text-slate-800">{phone}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <a
                            href={`tel:${cleaned}`}
                            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-brand-orange transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`https://wa.me/${cleaned.replace('+', '').replace(/\s+/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-whatsapp-official hover:bg-whatsapp-official hover:text-white transition-colors"
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
