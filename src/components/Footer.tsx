import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Facebook, Instagram, Linkedin, Youtube, Mail, Phone, 
  MapPin, Send, CheckCircle, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { addNewsletterSubscriber } from '../supabaseClient';

import { PARTNERS } from '../data';
import { Partner } from '../types';

interface FooterProps {
  onScrollToSection: (id: string) => void;
  onOpenAdmin: () => void;
  logoUrl?: string;
  footerLogoUrl?: string;
  companyNif?: string;
  companyYear?: string;
  companyPhones?: string[];
  partners?: Partner[] | null;
  hidePartnersMarquee?: boolean;
}

export default function Footer({ onScrollToSection, onOpenAdmin, logoUrl, footerLogoUrl, companyNif, companyYear, companyPhones, partners, hidePartnersMarquee }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const activePartners = partners && partners.length > 0 ? partners : PARTNERS;
  // Repeat array for continuous seamless looping marquee
  const displayPartnersList = [...activePartners, ...activePartners, ...activePartners, ...activePartners];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Save to database
    addNewsletterSubscriber(email);
    setSubscribed(true);
    setEmail('');
    setTimeout(() => {
      setSubscribed(false);
    }, 4000);
  };


  const navLinks = [
    { label: 'Início', id: 'home' },
    { label: 'Sobre Nós', id: 'about' },
    { label: 'Serviços', id: 'services' },
    { label: 'Portfólio', id: 'portfolio' },
    { label: 'Contactos', id: 'contact' },
  ];

  const servicesLinks = [
    { label: 'Impressão Gráfica', id: 'services' },
    { label: 'Personalização Têxtil', id: 'services' },
    { label: 'Design Gráfico', id: 'services' },
    { label: 'Marketing Digital', id: 'services' },
    { label: 'Sinalética Exterior', id: 'services' },
    { label: 'Brindes Corporativos', id: 'services' },
  ];

  return (
    <footer id="contact" className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.16),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_25%),linear-gradient(135deg,#110d22_0%,#17162d_35%,#0d1324_100%)] text-gray-300 pt-8 pb-8 border-t border-white/5 scroll-mt-12">
      <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.02)_100%)]"></div>

      {/* GRANDES EMPRESAS QUE CONFIAM NA GPA ANGOLA (CARROSSEL DE PARCEIROS NO RODAPÉ - OCULTO NA ABA CONTACTOS) */}
      {!hidePartnersMarquee && (
        <div className="border-b border-white/10 pb-10 pt-2 mb-12 relative overflow-hidden bg-slate-950/40 backdrop-blur-sm">
          <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
            <div className="inline-flex items-center space-x-2.5 bg-brand-orange/10 border border-brand-orange/20 px-5 py-2 rounded-full shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-pulse"></span>
              <span className="text-xs font-mono font-extrabold uppercase tracking-[0.2em] text-brand-orange">
                Grandes Empresas que Confiam na GPA Angola
              </span>
            </div>
          </div>

          <div className="relative w-full overflow-hidden py-3">
            {/* Gradient fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-[#110d22] via-[#110d22]/80 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-[#110d22] via-[#110d22]/80 to-transparent z-10 pointer-events-none"></div>

            <div className="animate-marquee pause-hover flex whitespace-nowrap items-center">
              {displayPartnersList.map((p, idx) => (
                <div
                  key={`${(p as any).id || p.name}-${idx}`}
                  className="relative inline-flex flex-col items-center justify-center text-center bg-white border-2 border-white/40 rounded-2xl p-4 transition-all duration-300 w-56 h-32 sm:w-64 sm:h-36 shadow-[0_10px_30px_rgba(15,23,42,0.15)] hover:shadow-[0_15px_35px_rgba(245,158,11,0.35)] hover:scale-105 hover:border-brand-orange group mx-3 select-none flex-shrink-0 cursor-pointer overflow-hidden"
                >
                  {/* Subtle shine highlight inside card */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="flex items-center justify-center w-full h-full overflow-hidden p-1">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={`Logótipo ${p.name}`}
                        className="h-24 sm:h-28 max-h-[96%] w-auto max-w-[96%] object-contain filter drop-shadow-[0_4px_12px_rgba(245,158,11,0.22)] group-hover:drop-shadow-[0_8px_20px_rgba(245,158,11,0.45)] group-hover:scale-110 transition-all duration-300"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="font-display font-black text-base sm:text-lg tracking-wider text-slate-900 group-hover:text-brand-orange transition-colors">
                        {p.logoText || p.name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand & Bio (4 cols) */}
          <div className="md:col-span-4 space-y-5">
            {/* Logo with shine effect */}
            <motion.div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => onScrollToSection('home')}
            >
              <motion.div 
                className="relative flex items-center justify-center w-full max-w-[360px] h-[110px] sm:h-[130px] bg-brand-purple-dark/50 rounded-2xl px-6 py-4 border border-white/10 shadow-lg overflow-hidden"
                animate={{
                  boxShadow: [
                    "0 0 15px rgba(245, 158, 11, 0.25), inset 0 0 30px rgba(245, 158, 11, 0.08)",
                    "0 0 40px rgba(245, 158, 11, 0.45), inset 0 0 50px rgba(245, 158, 11, 0.15)",
                    "0 0 15px rgba(245, 158, 11, 0.25), inset 0 0 30px rgba(245, 158, 11, 0.08)"
                  ]
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Animated gradient background behind logo */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-orange/0 via-brand-orange/15 to-amber-400/0"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <motion.img
                  src={footerLogoUrl || logoUrl || "https://i.ibb.co/v4JJZZXF/LOGO-GPA-18-BRANCA-1.png"}
                  alt="GPA Angola"
                  className="w-full h-full object-contain object-center mix-blend-screen relative z-10"
                  referrerPolicy="no-referrer"
                  animate={{
                    filter: [
                      "drop-shadow(0 0 8px rgba(245, 158, 11, 0.25))",
                      "drop-shadow(0 0 30px rgba(245, 158, 11, 0.5))",
                      "drop-shadow(0 0 8px rgba(245, 158, 11, 0.25))"
                    ]
                  }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Shine effect na footer logo */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                  animate={{
                    opacity: [0, 0.3, 0],
                    x: [-150, 150, -150]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: 2.5,
                    ease: "easeInOut"
                  }}
                  style={{ pointerEvents: 'none' }}
                />
              </motion.div>
            </motion.div>

            <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed max-w-sm">
              Somos a gráfica industrial líder em Angola. Produzimos com rigor tecnológico e materiais de topo soluções de sinalização, stands, uniformes e brindes para impulsionar a sua imagem corporativa.
            </p>

            {/* Social Icons Row */}
            <div className="flex items-center space-x-3 pt-2">
              {[
                { icon: Facebook, href: 'https://www.facebook.com/facegpaangola/?locale=pt_BR' },
                { icon: Instagram, href: 'https://www.instagram.com/gpa_angola/' },
                { icon: Linkedin, href: 'https://linkedin.com/company/18242153/admin/dashboard' },
                { icon: Youtube, href: 'https://www.youtube.com/@GPA-ANGOLA' }
              ].map((soc, idx) => {
                const Icon = soc.icon;
                return (
                  <a
                    key={idx}
                    href={soc.href}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-brand-orange hover:border-brand-orange hover:bg-brand-orange/10 transition-all shadow-xs hover:-translate-y-0.5"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Col 2: Navigation Links (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-wider text-white uppercase border-l-2 border-brand-orange pl-2">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onScrollToSection(link.id)}
                    className="hover:text-brand-orange text-gray-300 transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-wider text-white uppercase border-l-2 border-brand-orange pl-2">
              Serviços
            </h4>
            <ul className="space-y-2.5 text-sm">
              {servicesLinks.map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onScrollToSection(link.id)}
                    className="hover:text-brand-orange text-gray-300 transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contacts & Location (4 cols) */}
          <div className="md:col-span-4 space-y-5">
            <h4 className="text-xs font-mono font-bold tracking-wider text-white uppercase border-l-2 border-brand-orange pl-2">
              Fale Connosco
            </h4>
            
            <ul className="space-y-3.5 text-xs sm:text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed text-gray-400">
                  Município de Belas/Cabolombo, Av. Lúcio Lara, Zona Verde III, Rua 53 Porta n.º 01, Luanda, Angola
                </span>
              </li>

              <li className="flex items-center space-x-3">
                <Phone className="w-4.5 h-4.5 text-brand-orange flex-shrink-0" />
                <a 
                  href={`tel:${((companyPhones && companyPhones[0]) || '+244994943828').replace(/\s+/g, '')}`} 
                  className="text-gray-300 hover:text-brand-orange font-mono"
                >
                  {companyPhones && companyPhones.length > 0 
                    ? companyPhones.join(' | ') 
                    : '+244 994 943 828 | 945 119 409'}
                </a>
              </li>

              <li className="flex items-center space-x-3">
                <Mail className="w-4.5 h-4.5 text-brand-orange flex-shrink-0" />
                <a href="mailto:atendimento@gpaangola.co.ao" className="text-gray-300 hover:text-brand-orange font-mono">
                  atendimento@gpaangola.co.ao
                </a>
              </li>
            </ul>

            {/* Newsletter Sign up Form */}
            <div className="space-y-2 border-t border-white/10 pt-4">
              <span className="text-[11px] font-mono font-bold text-white uppercase block">Subscrever Newsletter</span>
              
              {subscribed ? (
                <div className="flex items-center space-x-2 text-xs text-green-400 font-sans p-2 rounded-lg bg-green-950/20 border border-green-900/35">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Subscrito! Obrigado por se juntar a nós.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex space-x-2">
                  <input
                    type="email"
                    required
                    placeholder="Seu email comercial..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/15 rounded-xl py-2 px-3 text-xs text-white placeholder-gray-500 focus:outline-none transition-all"
                  />
                  <button
                    type="submit"
                    className="bg-brand-orange hover:bg-brand-orange-hover p-2 rounded-xl text-white transition-colors cursor-pointer"
                    title="Subscrever"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Bottom copyright list bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 font-sans gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-2 gap-1 text-center sm:text-left">
            <span>© {companyYear || "2026"} GPA Angola. Todos os direitos reservados.</span>
            <span className="hidden sm:inline">|</span>
            <div className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-orange" />
              <span>NIF: {companyNif || "5002498223"}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a href="#privacy" className="hover:text-white hover:underline">Política de Privacidade</a>
            <a href="#terms" className="hover:text-white hover:underline">Termos e Condições</a>
            <button 
              onClick={onOpenAdmin} 
              className="text-gray-400 hover:text-brand-orange transition-colors flex items-center space-x-1 font-semibold cursor-pointer border border-white/10 hover:border-brand-orange/45 rounded-lg px-2 py-1 bg-white/5"
            >
              <span>🔒 Painel Admin</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
