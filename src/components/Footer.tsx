import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Facebook, Instagram, Linkedin, Youtube, Mail, Phone, 
  MapPin, Send, CheckCircle, ArrowRight, ShieldCheck, MessageSquare, Lock
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

export default function Footer({ 
  onScrollToSection, 
  onOpenAdmin, 
  logoUrl, 
  footerLogoUrl, 
  companyNif = '5417000000', 
  companyYear = '2008', 
  companyPhones = ['+244 923 000 000', '+244 931 000 000'], 
  partners, 
  hidePartnersMarquee 
}: FooterProps) {
  const primaryPhone = companyPhones[0] || '+244 923 000 000';
  const cleanPhone = primaryPhone.replace(/\D/g, '');

  return (
    <footer id="footer">
      {/* ===================================================================
          POYTARA FOOTER .box-institutional (4 Columns)
          =================================================================== */}
      <div className="box-institutional">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Col 1: Logo */}
            <div className="footer-column-1 space-y-4">
              <div 
                className="footer-logo cursor-pointer"
                onClick={() => onScrollToSection('home')}
              >
                <img 
                  src={footerLogoUrl || logoUrl || "https://i.ibb.co/v6FWV57q/LOGO-GPA.png"} 
                  alt="Logo Rodapé Website GPA Angola" 
                  className="h-20 sm:h-24 md:h-28 w-auto object-contain drop-shadow-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Indústria angolana líder em soluções gráficas de alta tiragem, estamparia industrial, personalização têxtil e reclames luminosos 3D.
              </p>
            </div>

            {/* Col 2: Institucional */}
            <div className="footer-column-2">
              <h2>Institucional</h2>
              <ul>
                <li><button className="text-left text-neutral-400 hover:text-white transition-colors cursor-pointer" onClick={() => onScrollToSection('home')}>Página Inicial</button></li>
                <li><button className="text-left text-neutral-400 hover:text-white transition-colors cursor-pointer" onClick={() => onScrollToSection('store')}>Produtos & Loja</button></li>
                <li><button className="text-left text-neutral-400 hover:text-white transition-colors cursor-pointer" onClick={() => onScrollToSection('services')}>Serviços</button></li>
                <li><button className="text-left text-neutral-400 hover:text-white transition-colors cursor-pointer" onClick={() => onScrollToSection('production')}>Parque Industrial</button></li>
                <li><button className="text-left text-neutral-400 hover:text-white transition-colors cursor-pointer" onClick={() => onScrollToSection('about')}>Quem Somos</button></li>
                <li><button className="text-left text-neutral-400 hover:text-white transition-colors cursor-pointer" onClick={() => onScrollToSection('portfolio')}>Portfólio</button></li>
                <li><button className="text-left text-neutral-400 hover:text-white transition-colors cursor-pointer" onClick={() => onScrollToSection('contact')}>Contacto</button></li>
              </ul>
            </div>

            {/* Col 3: Produtos & Serviços */}
            <div className="footer-column-3">
              <h2>Produtos & Serviços</h2>
              <ul>
                <li><button className="text-left text-neutral-400 hover:text-white transition-colors cursor-pointer" onClick={() => onScrollToSection('services')}>Impressão Offset & Digital</button></li>
                <li><button className="text-left text-neutral-400 hover:text-white transition-colors cursor-pointer" onClick={() => onScrollToSection('services')}>Personalização Têxtil & Fardas</button></li>
                <li><button className="text-left text-neutral-400 hover:text-white transition-colors cursor-pointer" onClick={() => onScrollToSection('services')}>Sinalética & Fachadas 3D</button></li>
                <li><button className="text-left text-neutral-400 hover:text-white transition-colors cursor-pointer" onClick={() => onScrollToSection('services')}>Brindes Corporativos VIP</button></li>
                <li><button className="text-left text-neutral-400 hover:text-white transition-colors cursor-pointer" onClick={() => onScrollToSection('services')}>Design Gráfico & Branding</button></li>
              </ul>
            </div>

            {/* Col 4: Atendimento & Redes */}
            <div className="footer-column-4 space-y-3">
              <h2>Atendimento</h2>
              <p className="text-sm text-neutral-300">Luanda, Angola</p>
              <p className="text-sm text-neutral-300">Tel: {primaryPhone}</p>
              <p className="text-sm text-neutral-300">contacto@gpaangola.com</p>

              <div className="pt-3 flex items-center space-x-3.5 text-white">
                <a href="https://www.instagram.com/gpa_angola/" target="_blank" rel="noopener noreferrer" title="Instagram GPA Angola (@gpa_angola)" className="hover:text-[#0B63E5] transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://www.facebook.com/facegpaangola" target="_blank" rel="noopener noreferrer" title="Facebook GPA Angola" className="hover:text-[#0B63E5] transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://ao.linkedin.com/company/gpa-angola" target="_blank" rel="noopener noreferrer" title="LinkedIn GPA Angola" className="hover:text-[#0B63E5] transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://www.youtube.com/@GPA-ANGOLA" target="_blank" rel="noopener noreferrer" title="YouTube GPA Angola (@GPA-ANGOLA)" className="hover:text-[#0B63E5] transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href={`https://wa.me/${cleanPhone}?text=Ol%C3%A1%20GPA%20Angola%2C%20gostaria%20de%20informa%C3%A7%C3%B5es.`} target="_blank" rel="noopener noreferrer" title="WhatsApp GPA Angola" className="hover:text-[#25D366] transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ===================================================================
          POYTARA COPYRIGHT-BAR
          =================================================================== */}
      <div className="copyright-bar">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <small>© {new Date().getFullYear()} GPA Angola. Todos os direitos reservados. NIF: {companyNif}</small>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenAdmin}
              className="text-white/80 hover:text-white text-xs cursor-pointer flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              <span>Painel Admin</span>
            </button>
            <span className="text-xs text-white/70">Desde {companyYear} em Angola</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
