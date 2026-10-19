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
  footerLogoUrl = '/GPA 19 ANOS.png', 
  companyNif = '5417000000', 
  companyYear = '2008', 
  companyPhones = ['+244 945 119 409', '+244 933 417 569', '+244 953 979 343', '+244 994 943 828'], 
  partners, 
  hidePartnersMarquee 
}: FooterProps) {
  const activeFooterLogo = (!footerLogoUrl || footerLogoUrl.includes('18')) ? '/GPA 19 ANOS.png' : footerLogoUrl;

  const phoneDepartments = ['Comercial', 'Orçamentos', 'Produção', 'Geral & WhatsApp'];
  const phoneItems = (companyPhones && companyPhones.length > 0 && !companyPhones[0].includes('000 000'))
    ? companyPhones.map((phone, idx) => ({ phone, dept: phoneDepartments[idx] || 'Atendimento' }))
    : [
        { phone: '+244 945 119 409', dept: 'Comercial' },
        { phone: '+244 933 417 569', dept: 'Orçamentos' },
        { phone: '+244 953 979 343', dept: 'Produção' },
        { phone: '+244 994 943 828', dept: 'Geral & WhatsApp' },
      ];

  const primaryPhone = phoneItems[0]?.phone || '+244 945 119 409';
  const cleanPhone = primaryPhone.replace(/\D/g, '');

  return (
    <footer id="footer">
      {/* ===================================================================
          POYTARA FOOTER .box-institutional (4 Columns)
          =================================================================== */}
      <div className="box-institutional">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Col 1: Logo GPA 19 ANOS */}
            <div className="footer-column-1 space-y-4">
              <div 
                className="footer-logo cursor-pointer"
                onClick={() => onScrollToSection('home')}
                title="GPA Angola - 19 Anos"
              >
                <img 
                  src={activeFooterLogo} 
                  alt="Logo GPA 19 Anos Rodapé" 
                  className="h-20 sm:h-24 md:h-28 w-auto object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
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

            {/* Col 4: Atendimento com Todos os Números da Versão Anterior & Redes */}
            <div className="footer-column-4 space-y-3">
              <h2>Atendimento</h2>
              <p className="text-sm text-neutral-300">Luanda, Angola (Viana)</p>

              {/* Lista Completa de Telefones de Atendimento */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] uppercase tracking-wider text-[#0B63E5] font-bold block">
                  Linhas de Atendimento:
                </span>
                {phoneItems.map((item) => {
                  const clean = item.phone.replace(/\D/g, '');
                  return (
                    <div key={item.phone} className="flex items-center justify-between text-xs py-1 border-b border-white/5">
                      <span className="text-neutral-400 font-medium">{item.dept}:</span>
                      <a 
                        href={`https://wa.me/${clean}?text=Ol%C3%A1%20GPA%20Angola%2C%20gostaria%20de%20falar%20com%20o%20departamento%20de%20${encodeURIComponent(item.dept)}.`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-neutral-200 hover:text-[#25D366] font-semibold transition-colors flex items-center gap-1.5"
                        title={`Falar com ${item.dept} no WhatsApp`}
                      >
                        <Phone className="w-3 h-3 text-[#0B63E5]" />
                        <span>{item.phone}</span>
                      </a>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-neutral-300 pt-1">
                <span className="text-neutral-400">E-mail:</span> contacto@gpaangola.com
              </p>

              <div className="pt-2 flex items-center space-x-3.5 text-white">
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
