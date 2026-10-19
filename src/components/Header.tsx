import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, X, Phone, Calculator, ArrowRight, 
  Instagram, Facebook, Youtube, Mail, MessageSquare, ChevronRight, Linkedin
} from 'lucide-react';

interface HeaderProps {
  onOpenQuoteCalculator: () => void;
  onScrollToSection: (id: string) => void;
  activeSection: string;
  logoUrl?: string;
  companyPhones?: string[];
}

const DEFAULT_HEADER_PHONES = [
  { phone: '+244 945 119 409', dept: 'Comercial' },
  { phone: '+244 933 417 569', dept: 'Orçamentos' },
  { phone: '+244 953 979 343', dept: 'Produção' },
  { phone: '+244 994 943 828', dept: 'Geral & WhatsApp' },
];

export default function Header({ 
  onOpenQuoteCalculator, 
  onScrollToSection, 
  activeSection, 
  logoUrl, 
  companyPhones = ['+244 945 119 409', '+244 933 417 569', '+244 953 979 343', '+244 994 943 828']
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'INÍCIO', id: 'home' },
    { label: 'PRODUTOS', id: 'store' },
    { label: 'SERVIÇOS', id: 'services' },
    { label: 'PARQUE INDUSTRIAL', id: 'production' },
    { label: 'QUEM SOMOS', id: 'about' },
    { label: 'PORTFÓLIO', id: 'portfolio' },
    { label: 'CONTACTO', id: 'contact' },
  ];

  const handleNavClick = (id: string) => {
    onScrollToSection(id);
    setIsMobileMenuOpen(false);
  };

  const phoneDepartments = ['Comercial', 'Orçamentos', 'Produção', 'Geral & WhatsApp'];
  const phoneItems = (companyPhones && companyPhones.length > 0 && !companyPhones[0].includes('000 000'))
    ? companyPhones.map((phone, idx) => ({ phone, dept: phoneDepartments[idx] || 'Atendimento' }))
    : DEFAULT_HEADER_PHONES;

  const primaryPhone = phoneItems[0]?.phone || '+244 945 119 409';
  const cleanPhone = primaryPhone.replace(/\D/g, '');

  return (
    <header id="js-header" className="sticky top-0 left-0 w-full z-50 transition-all duration-300">
      {/* ===================================================================
          PASSO 03: TOPBAR (ESTILO POYTARA ORIGINAL)
          =================================================================== */}
      <div className="topbar" id="js-topbar">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Pesquisar */}
            <div 
              className="searchGroupH"
              onClick={() => setIsSearchOpen(true)}
              title="Pesquisar Serviços ou Produtos"
            >
              <Search className="w-4 h-4 text-[#0B63E5]" />
              <span className="text-[13px] font-medium tracking-wide">Pesquisar GPA Angola</span>
            </div>

            {/* WhatsApp + Botão Compre / Orçamento com distanciamento nítido */}
            <div className="flex items-center">
              <a 
                href={`https://wa.me/${cleanPhone}?text=Ol%C3%A1%20GPA%20Angola%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20vossos%20servi%C3%A7os.`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="whats-link hidden sm:inline-flex items-center gap-2 text-slate-700 hover:text-[#0B63E5] text-[13.5px] font-semibold transition-colors"
                title="Clique para falar conosco no WhatsApp"
              >
                <div className="w-4.5 h-4.5 bg-[#25D366] text-white rounded-full flex items-center justify-center p-0.5 shadow-sm">
                  <MessageSquare className="w-3 h-3 fill-current" />
                </div>
                <span>{primaryPhone}</span>
              </a>

              {/* Separador e distanciamento entre o número e o botão PEDIR ORÇAMENTO */}
              <div className="shop-modal ml-6 sm:ml-8 pl-4 sm:pl-6 border-l border-slate-300/80">
                <div 
                  onClick={onOpenQuoteCalculator}
                  className="buy-button"
                  title="Calcular Orçamento Online"
                >
                  Pedir Orçamento
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================
          BOTTOMBAR / BARRA DE NAVEGAÇÃO PRINCIPAL (Fundo Branco Translúcido)
          =================================================================== */}
      <div 
        id="bottombar"
        className={`w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-2 border-b border-slate-200/90' 
            : 'bg-white/90 backdrop-blur-md py-3.5 border-b border-slate-200/80 shadow-sm'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="nav-bar" id="dnavbar">
            
            {/* LOGOTIPO AMPLIADO (Tamanho Grande & Destaque Total no Fundo Claro) */}
            <div 
              className="logo cursor-pointer flex items-center py-1"
              onClick={() => handleNavClick('home')}
            >
              <img 
                src={logoUrl || "https://i.ibb.co/v6FWV57q/LOGO-GPA.png"} 
                alt="Logo Website GPA Angola" 
                className="h-20 sm:h-24 md:h-28 lg:h-32 w-auto max-w-[380px] object-contain transition-transform duration-300 hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* NAV MENU (POYTARA ORIGINAL) */}
            <nav className="hidden lg:block">
              <ul id="nav-menu">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className={`nav-link-poytara ${
                        activeSection === item.id ? '!text-[#0B63E5] font-black' : ''
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}

                <li>
                  <button 
                    onClick={() => handleNavClick('partner')}
                    className="menuButtonStyle"
                  >
                    Seja um Parceiro
                  </button>
                </li>

                <li>
                  <button 
                    onClick={onOpenQuoteCalculator}
                    className="menuButtonStyle"
                  >
                    Calculadora
                  </button>
                </li>
              </ul>
            </nav>

            {/* ICONS NAV (POYTARA ORIGINAL) */}
            <div className="hidden lg:flex items-center icons-nav">
              <button 
                onClick={() => setIsSearchOpen(true)}
                title="Busque pelos produtos ou serviços GPA"
              >
                <Search className="w-5 h-5" />
              </button>

              <a 
                href="https://www.instagram.com/gpa_angola/" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Instagram GPA Angola (@gpa_angola)"
              >
                <Instagram className="w-5 h-5" />
              </a>

              <a 
                href="https://www.facebook.com/facegpaangola" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Facebook GPA Angola"
              >
                <Facebook className="w-5 h-5" />
              </a>

              <a 
                href="https://ao.linkedin.com/company/gpa-angola" 
                target="_blank" 
                rel="noopener noreferrer"
                title="LinkedIn GPA Angola"
              >
                <Linkedin className="w-5 h-5" />
              </a>

              <a 
                href="https://www.youtube.com/@GPA-ANGOLA" 
                target="_blank" 
                rel="noopener noreferrer"
                title="YouTube GPA Angola (@GPA-ANGOLA)"
              >
                <Youtube className="w-5 h-5" />
              </a>

              <a 
                href="mailto:contacto@gpaangola.com" 
                title="Fale com a GPA Angola por E-mail"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>

            {/* Mobile Hamburger Trigger */}
            <div className="flex lg:hidden items-center space-x-3 text-white">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5"
              >
                <Search className="w-6 h-6" />
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5"
                aria-label="Abrir Menu"
              >
                {isMobileMenuOpen ? <X className="w-7 h-7" /> : (
                  <div className="space-y-1.5 w-6">
                    <span className="block h-0.5 w-6 bg-white"></span>
                    <span className="block h-0.5 w-6 bg-white"></span>
                    <span className="block h-0.5 w-4 bg-white"></span>
                  </div>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ===================================================================
          SEARCH BAR POPUP / OVERLAY (Poytara Style)
          =================================================================== */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full bg-[#111111] border-b border-[#075b2d] text-white py-4 px-4 sm:px-8 shadow-2xl z-50"
          >
            <div className="max-w-[1000px] mx-auto flex items-center gap-4">
              <Search className="w-6 h-6 text-[#09ac53]" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Qual serviço ou produto GPA você deseja?"
                className="w-full bg-transparent border-none text-white text-lg focus:outline-none placeholder:text-neutral-400 font-montserrat"
                autoFocus
              />
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================================
          MOBILE DRAWER MENU (Poytara overlay style)
          =================================================================== */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[340px] bg-[#0a0a0a] text-white z-50 p-6 flex flex-col justify-between shadow-2xl border-r border-[#075b2d]/40 lg:hidden"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <img 
                    src={logoUrl || "https://i.ibb.co/v6FWV57q/LOGO-GPA.png"} 
                    alt="GPA Angola" 
                    className="h-14 w-auto object-contain"
                  />
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-neutral-400 hover:text-white rounded-lg bg-white/5"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="py-5 space-y-2">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className="w-full text-left font-akrobat text-xl uppercase tracking-wider font-extrabold py-2 px-3 rounded hover:bg-white/5 hover:text-[#0B63E5] transition-colors flex items-center justify-between"
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="w-4 h-4 text-neutral-500" />
                    </button>
                  ))}
                </div>

                {/* Linhas Diretas de Atendimento (Versão Anterior Restaurada) */}
                <div className="border-t border-white/10 pt-4 mt-1 space-y-2">
                  <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-[#0B63E5] block px-1">
                    Linhas Diretas de Atendimento
                  </span>
                  <div className="space-y-2">
                    {phoneItems.map((item) => {
                      const clean = item.phone.replace(/\D/g, '');
                      return (
                        <div key={item.phone} className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/5 border border-white/10">
                          <div className="text-left">
                            <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">{item.dept}</span>
                            <span className="text-xs font-mono font-bold text-white">{item.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <a
                              href={`tel:${item.phone.replace(/\s+/g, '')}`}
                              className="p-1.5 rounded-lg bg-white/10 text-white hover:text-[#0B63E5] transition-colors"
                              title={`Ligar para ${item.dept}`}
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`https://wa.me/${clean}?text=Ol%C3%A1%20GPA%20Angola%2C%20gostaria%20de%20falar%20com%20o%20departamento%20de%20${encodeURIComponent(item.dept)}.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
                              title={`WhatsApp ${item.dept}`}
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenQuoteCalculator();
                  }}
                  className="w-full bg-[#0052CC] hover:bg-[#0B63E5] text-white font-akrobat text-xl uppercase font-black py-3 rounded shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Calculator className="w-5 h-5" />
                  <span>Pedir Orçamento</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
