import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, Volume2, ShieldAlert, Check, Users, Sparkles, 
  MapPin, Clock, ArrowRight, HelpCircle, X, Award, Eye, Settings, Video, FileVideo, Building2,
  Phone, Mail, Send, Calculator, MessageSquare
} from 'lucide-react';

// Data and Types
import { PARTNERS, SERVICES } from './data';
import { Project } from './types';

// Components
import Header from './components/Header';
import Hero from './components/Hero';
import ServicesExplorer from './components/ServicesExplorer';
import StatsCounter from './components/StatsCounter';
import Portfolio from './components/Portfolio';
import Slideshow from './components/Slideshow';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import QuoteCalculator from './components/QuoteCalculator';
import IndustrialGalleryModal from './components/IndustrialGalleryModal';
import AdminDashboard from './components/AdminDashboard';
import OnlineStore from './components/OnlineStore';
import IntroScreen from './components/IntroScreen';

import CategoryBanners from './components/CategoryBanners';

// Firebase Integrations
import { 
  getSiteConfig, 
  getPartners, 
  getFirebaseProjects, 
  getGalleryItems, 
  getStoreProducts,
  updateSiteConfig, 
  SiteConfig, 
  Partner, 
  GalleryItem,
  subscribeSiteConfig,
  subscribePartners,
  subscribeProjects,
  subscribeGallery,
  subscribeStoreProducts,
  logPageView,
  subscribePageViews
} from './firebaseClient';
import { StoreProduct } from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quoteServiceId, setQuoteServiceId] = useState<string | undefined>(undefined);
  const [quoteProductName, setQuoteProductName] = useState<string | undefined>(undefined);
  const [isIndustrialGalleryOpen, setIsIndustrialGalleryOpen] = useState(false);
  const [isIntroOpen, setIsIntroOpen] = useState(false);

  // Dynamic Admin Panel Toggle
  const [isAdminView, setIsAdminView] = useState(false);
  const [pageViews, setPageViews] = useState(0);

  // Dynamic Content States from Firebase
  const [liveConfig, setLiveConfig] = useState<SiteConfig | null>(null);
  const [livePartners, setLivePartners] = useState<Partner[] | null>(null);
  const [liveProjects, setLiveProjects] = useState<Project[] | null>(null);
  const [liveGallery, setLiveGallery] = useState<GalleryItem[] | null>(null);
  const [liveStoreProducts, setLiveStoreProducts] = useState<StoreProduct[] | null>(null);

  // Video Modal Custom States
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const defaultCinematicVideo = '/GPA/Cinematic_D_animation_seaml.mp4';
  const fallbackVideo = '/GPA/Prompt_Direto_e_Suave_Reco.mp4';
  const [videoUrl, setVideoUrl] = useState(() => {
    const cached = localStorage.getItem('gpa_video_url');
    if (cached && cached.includes('mixkit.co')) {
      localStorage.setItem('gpa_video_url', defaultCinematicVideo);
      return defaultCinematicVideo;
    }
    if (cached && cached.trim()) {
      return cached;
    }
    return defaultCinematicVideo;
  });
  const [isEditingVideoUrl, setIsEditingVideoUrl] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState('');

  const fetchFirebaseData = async () => {
    // 1. Instantly load local cached data for real-time offline-first feel and zero blank screens
    try {
      const cachedConfig = localStorage.getItem('gpa_cached_site_config');
      if (cachedConfig) {
        const parsed = JSON.parse(cachedConfig);
        setLiveConfig(parsed);
        if (parsed.videoUrl) {
          setVideoUrl(parsed.videoUrl);
        }
      }

      const cachedPartners = localStorage.getItem('gpa_cached_partners');
      if (cachedPartners) {
        setLivePartners(JSON.parse(cachedPartners));
      }

      const cachedProjects = localStorage.getItem('gpa_cached_projects');
      if (cachedProjects) {
        setLiveProjects(JSON.parse(cachedProjects));
      }

      const cachedGallery = localStorage.getItem('gpa_cached_gallery');
      if (cachedGallery) {
        setLiveGallery(JSON.parse(cachedGallery));
      }

      const cachedProducts = localStorage.getItem('gpa_cached_store_products');
      if (cachedProducts) {
        setLiveStoreProducts(JSON.parse(cachedProducts));
      }
    } catch (e) {
      console.warn('[Cache] Could not parse local storage backup configs:', e);
    }

    // 2. Fetch fresh, live data from Firestore in the background
    try {
      const config = await getSiteConfig();
      setLiveConfig(config);
      if (config.videoUrl) {
        setVideoUrl(config.videoUrl);
      }

      const partnersList = await getPartners();
      setLivePartners(partnersList);

      const projectsList = await getFirebaseProjects();
      setLiveProjects(projectsList);

      const galleryList = await getGalleryItems();
      setLiveGallery(galleryList);

      const storeProductsList = await getStoreProducts();
      setLiveStoreProducts(storeProductsList);
    } catch (err) {
      console.error('Error loading dynamic Firebase content:', err);
    }
  };

  useEffect(() => {
    // 1. Initial fast data retrieval (loads from local backup first, then fetches Firestore)
    fetchFirebaseData();

    // Log anonymous page view
    logPageView();

    // 2. Setup real-time listeners for active cross-PC synchronization (Requisito 4)
    const unsubConfig = subscribeSiteConfig((config) => {
      setLiveConfig(config);
      if (config.videoUrl) {
        setVideoUrl(config.videoUrl);
      }
    });

    const unsubPartners = subscribePartners((partners) => {
      setLivePartners(partners);
    });

    const unsubProjects = subscribeProjects((projects) => {
      setLiveProjects(projects);
    });

    const unsubGallery = subscribeGallery((gallery) => {
      setLiveGallery(gallery);
    });

    const unsubStoreProducts = subscribeStoreProducts((products) => {
      setLiveStoreProducts(products);
    });

    const unsubViews = subscribePageViews((views) => {
      setPageViews(views);
    });

    // Clean up real-time subscriptions when unmounting
    return () => {
      unsubConfig();
      unsubPartners();
      unsubProjects();
      unsubGallery();
      unsubStoreProducts();
      unsubViews();
    };
  }, []);

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const cleanUrl = url.trim();
    // Try the standard pattern first
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/shorts\/)([^#\&\?]*).*/;
    const match = cleanUrl.match(regExp);
    if (match && match[2]) {
      const cleanId = match[2].trim();
      if (cleanId.length === 11) {
        return cleanId;
      }
    }
    // Fallback pattern to extract exactly 11 characters after common patterns
    const fallbackRegExp = /(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const fallbackMatch = cleanUrl.match(fallbackRegExp);
    if (fallbackMatch && fallbackMatch[1]) {
      return fallbackMatch[1];
    }
    return null;
  };

  // Toast message state
  const [activeToast, setActiveToast] = useState<string | null>(null);

  useEffect(() => {
    if (activeToast) {
      const t = setTimeout(() => setActiveToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [activeToast]);

  // Video progress bar interval simulation is no longer needed with real video player

  const handleScrollToSection = (id: string) => {
    setActiveSection(id);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleOpenQuoteWithDetails = (serviceId?: string, productName?: string) => {
    setQuoteServiceId(serviceId);
    setQuoteProductName(productName);
    setIsQuoteOpen(true);
  };

  const handleCloseQuote = () => {
    setIsQuoteOpen(false);
    // Clear initial parameters so it doesn't stay locked on next open
    setQuoteServiceId(undefined);
    setQuoteProductName(undefined);
  };

  const renderPageContent = () => {
    switch (activeSection) {
      case 'store':
        return (
          <div className="w-full py-12 sm:py-16 bg-white min-h-[70vh]">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
                <span className="inline-block text-xs font-akrobat font-black tracking-widest text-[#0B63E5] uppercase bg-[#0B63E5]/10 px-3.5 py-1 rounded-md">
                  Catálogo Oficial GPA
                </span>
                <h1 className="text-3xl sm:text-5xl font-akrobat font-black uppercase tracking-tight text-slate-900">
                  Nossa Loja Online & Produtos
                </h1>
                <p className="text-sm sm:text-base text-slate-600 font-montserrat leading-relaxed">
                  Explore o catálogo de produção industrial, consulte preços de referência e encomende diretamente por WhatsApp ou com simulação instantânea de orçamento.
                </p>
              </div>
              <OnlineStore siteConfig={liveConfig} onOpenQuoteWithDetails={handleOpenQuoteWithDetails} storeProducts={liveStoreProducts} />
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="w-full py-8 sm:py-12 bg-[#fafafa] min-h-[70vh]">
            <ServicesExplorer 
              onOpenQuoteCalculatorWithService={(serviceId) => handleOpenQuoteWithDetails(serviceId)} 
            />
          </div>
        );

      case 'production':
        return (
          <div className="w-full py-8 sm:py-12 bg-slate-950 text-white min-h-[70vh]">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
              <span className="inline-block text-xs font-akrobat font-black tracking-widest text-[#0B63E5] uppercase bg-[#0B63E5]/20 px-3.5 py-1 rounded-md mb-2">
                Infraestrutura Industrial em Luanda
              </span>
              <h1 className="text-3xl sm:text-5xl font-akrobat font-black uppercase tracking-tight text-white">
                Nosso Parque Industrial & Tecnologia
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-montserrat max-w-2xl mx-auto mt-2">
                Conheça a maquinaria de ponta, processos de controlo de qualidade e capacidade de escala instalada em Luanda para atender todas as 21 províncias.
              </p>
            </div>
            <Slideshow />
            <StatsCounter 
              provinciasAtendidas={liveConfig?.statsProvinciasAtendidas} 
              anosExperiencia={liveConfig?.statsAnosExperiencia} 
            />
          </div>
        );

      case 'about':
        return (
          <div className="w-full py-12 sm:py-20 bg-slate-50 min-h-[70vh]">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5 relative">
                  <div className="relative bg-white rounded-2xl p-6 sm:p-8 text-slate-800 space-y-6 shadow-xl overflow-hidden border border-slate-200">
                    {liveConfig?.aboutImageUrl && (
                      <div className="relative h-56 w-full rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                        <img src={liveConfig.aboutImageUrl} alt="GPA Angola" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    <div className="relative z-10 space-y-3">
                      <div className="p-2.5 bg-[#0B63E5]/10 rounded-xl inline-block text-[#0B63E5]"><Award className="w-6 h-6" /></div>
                      <h3 className="font-akrobat font-black text-xl sm:text-2xl uppercase tracking-tight text-slate-900">{liveConfig?.aboutHighlightTitle || 'Liderança no Setor de Artes Gráficas em Luanda'}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-montserrat leading-relaxed">{liveConfig?.aboutHighlightText || 'Fundada com a missão de colmatar a escassez de produção industrial de alta definição, a GPA Angola tornou-se o parceiro estratégico de corporações multinacionais e gabinetes governamentais.'}</p>
                    </div>
                    <div className="border-t border-slate-100 pt-4 space-y-2.5 relative z-10">
                      <div className="flex items-center space-x-3 text-xs sm:text-sm font-montserrat"><div className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center p-0.5"><Check className="w-3 h-3 stroke-[3]" /></div><span className="font-semibold text-slate-700">Parque de máquinas próprio 100% ativo</span></div>
                      <div className="flex items-center space-x-3 text-xs sm:text-sm font-montserrat"><div className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center p-0.5"><Check className="w-3 h-3 stroke-[3]" /></div><span className="font-semibold text-slate-700">Importação direta de consumíveis alemães</span></div>
                      <div className="flex items-center space-x-3 text-xs sm:text-sm font-montserrat"><div className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center p-0.5"><Check className="w-3 h-3 stroke-[3]" /></div><span className="font-semibold text-slate-700">Equipa técnica de montagem 24/7</span></div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-6">
                  <span className="inline-block text-xs font-akrobat font-black tracking-widest text-[#0B63E5] uppercase bg-[#0B63E5]/10 px-3.5 py-1 rounded-md">{liveConfig?.aboutTitle || 'Quem Somos'}</span>
                  <h1 className="text-3xl sm:text-5xl font-akrobat font-black uppercase tracking-tight text-slate-900 leading-tight">{liveConfig?.aboutSubtitle || 'Criamos marcas prontas para deixar uma impressão indelével no mercado.'}</h1>
                  <div className="space-y-4 text-sm sm:text-base text-slate-600 font-montserrat leading-relaxed">
                    <p>{liveConfig?.aboutText1 || 'Na GPA Angola, compreendemos que o material gráfico e o fardamento de uma empresa são a extensão física da sua credibilidade. É por isso que não subcontratamos a nossa produção. Todo o processo — desde a concepção gráfica no nosso estúdio criativo, até à impressão offset, cozedura têxtil e instalação física de letreiros — é realizado internamente.'}</p>
                    <p>{liveConfig?.aboutText2 || 'Contamos com instalações modernas equipadas com tecnologia industrial de última geração, o que nos permite garantir prazos recordes e preços imbatíveis para tiragens de alta escala.'}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl flex items-start space-x-3"><div className="p-2 bg-[#0B63E5]/10 text-[#0B63E5] rounded-lg mt-0.5"><Sparkles className="w-5 h-5" /></div><div><h4 className="font-akrobat font-black uppercase text-base text-slate-900">Inovação Tecnológica</h4><p className="text-xs text-slate-500 mt-1 font-montserrat">Sistemas automáticos de tintagem e corte a laser computadorizado.</p></div></div>
                    <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl flex items-start space-x-3"><div className="p-2 bg-[#0B63E5]/10 text-[#0B63E5] rounded-lg mt-0.5"><MapPin className="w-5 h-5" /></div><div><h4 className="font-akrobat font-black uppercase text-base text-slate-900">Logística Nacional</h4><p className="text-xs text-slate-500 mt-1 font-montserrat">Capacidade para entregar e montar stands e fachadas em qualquer província.</p></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'portfolio':
        return (
          <div className="w-full py-12 sm:py-16 bg-white min-h-[70vh]">
            <Portfolio 
              onOpenQuoteForProject={(serviceId, productName) => handleOpenQuoteWithDetails(serviceId, productName)} 
              liveProjects={liveProjects} 
            />
          </div>
        );

      case 'partner':
        return (
          <div className="w-full py-12 sm:py-20 bg-slate-900 text-white min-h-[70vh]">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
                <span className="inline-block text-xs font-akrobat font-black tracking-widest text-[#0B63E5] uppercase bg-[#0B63E5]/20 px-3.5 py-1 rounded-md">
                  Programa B2B & Agências
                </span>
                <h1 className="text-3xl sm:text-5xl font-akrobat font-black uppercase tracking-tight text-white">
                  Seja um Parceiro Oficial GPA Angola
                </h1>
                <p className="text-slate-300 font-montserrat text-sm sm:text-base leading-relaxed">
                  Se é uma agência de publicidade, designer freelancer, revendedor gráfico ou gabinete empresarial, torne-se parceiro da GPA Angola e usufrua de descontos exclusivos de revenda, produção prioritária e apoio técnico dedicado.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-[#0B63E5]/20 text-[#0B63E5] flex items-center justify-center font-akrobat font-black text-2xl">%</div>
                  <h3 className="font-akrobat font-black text-xl uppercase text-white">Tabela de Revenda VIP</h3>
                  <p className="text-xs text-slate-400 font-montserrat">Margens comerciais vantajosas e preços de fábrica em grandes e médias tiragens.</p>
                </div>
                <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-[#0B63E5]/20 text-[#0B63E5] flex items-center justify-center font-akrobat font-black text-2xl">⚡</div>
                  <h3 className="font-akrobat font-black text-xl uppercase text-white">Fila de Produção Express</h3>
                  <p className="text-xs text-slate-400 font-montserrat">Prioridade na linha de corte, impressão offset e bordados computadorizados.</p>
                </div>
                <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-[#0B63E5]/20 text-[#0B63E5] flex items-center justify-center font-akrobat font-black text-2xl">🤝</div>
                  <h3 className="font-akrobat font-black text-xl uppercase text-white">Gestor de Conta Dedicado</h3>
                  <p className="text-xs text-slate-400 font-montserrat">Acompanhamento direto por WhatsApp para aprovação imediata de provas de cor.</p>
                </div>
              </div>

              <div className="text-center">
                <a 
                  href={`https://wa.me/244923000000?text=Ol%C3%A1%20GPA%20Angola%2C%20gostaria%20de%20me%20registar%20como%20Parceiro%20B2B%20%2F%20Revendedor.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-default inline-flex"
                >
                  <span>Candidatar a Parceiro no WhatsApp</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </a>
              </div>
            </div>
          </div>
        );

      case 'calculator':
        return (
          <div className="w-full py-12 sm:py-16 bg-slate-900 text-white min-h-[70vh]">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
                <span className="inline-block text-xs font-akrobat font-black tracking-widest text-[#0B63E5] uppercase bg-[#0B63E5]/20 px-3.5 py-1 rounded-md">
                  Simulador de Orçamentos Online
                </span>
                <h1 className="text-3xl sm:text-5xl font-akrobat font-black uppercase tracking-tight text-white">
                  Calculadora Instantânea GPA Angola
                </h1>
                <p className="text-slate-300 font-montserrat text-sm sm:text-base">
                  Selecione o serviço pretendido, configure as quantidades e dimensões para obter uma estimativa de investimento imediata.
                </p>
              </div>

              <div className="max-w-2xl mx-auto text-center">
                <button
                  onClick={() => setIsQuoteOpen(true)}
                  className="btn-default text-xl py-4 px-8"
                >
                  <Calculator className="w-6 h-6 mr-2" />
                  <span>ABRIR CALCULADORA DE ORÇAMENTO</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="w-full py-12 sm:py-20 bg-slate-950 text-white min-h-[70vh]">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
              
              {/* Header Section */}
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="inline-block text-xs font-akrobat font-black tracking-widest text-[#0B63E5] uppercase bg-[#0B63E5]/20 px-3.5 py-1 rounded-md">
                  Canais de Atendimento
                </span>
                <h1 className="text-3xl sm:text-5xl font-akrobat font-black uppercase tracking-tight text-white">
                  Fale Diretamente com a GPA Angola
                </h1>
                <p className="text-slate-300 text-sm sm:text-base font-montserrat leading-relaxed">
                  Estamos prontos para atender as suas necessidades industriais em Luanda e enviar para todas as 21 províncias de Angola.
                </p>
              </div>

              {/* Grid: Contact Info & Interactive Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left: Info Cards & Phone Lines */}
                <div className="lg:col-span-6 space-y-6">
                  
                  {/* Phone Lines Card */}
                  <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-6 sm:p-8 shadow-xl space-y-4">
                    <h3 className="font-akrobat font-black uppercase text-xl text-white flex items-center gap-2">
                      <Phone className="w-5 h-5 text-[#0B63E5]" />
                      Linhas Telefónicas & WhatsApp Comercial
                    </h3>
                    <p className="text-xs text-slate-400 font-montserrat">
                      Clique em qualquer número para ligar ou abrir diretamente uma conversa de WhatsApp:
                    </p>
                    <div className="flex flex-col gap-3">
                      {(liveConfig?.companyPhones && liveConfig.companyPhones.length > 0 ? liveConfig.companyPhones : ['+244 945 119 409', '+244 933 417 569', '+244 953 979 343']).map((phone) => {
                        const clean = phone.replace(/\D/g, '');
                        return (
                          <a 
                            key={phone} 
                            href={`https://wa.me/${clean}?text=Ol%C3%A1%20GPA%20Angola%2C%20gostaria%20de%20solicitar%20um%20or%C3%A7amento.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between px-5 py-3.5 rounded-xl bg-white/5 hover:bg-[#0B63E5] border border-white/10 hover:border-[#0B63E5] text-base font-bold font-akrobat uppercase transition-all shadow-md group cursor-pointer"
                          >
                            <span className="flex items-center gap-3">
                              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                              {phone}
                            </span>
                            <span className="text-xs font-montserrat font-medium text-slate-300 group-hover:text-white flex items-center gap-1">
                              WhatsApp / Chamar <ArrowRight className="w-4 h-4" />
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  {/* Location & Hours Card */}
                  <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-6 sm:p-8 shadow-xl space-y-4">
                    <h3 className="font-akrobat font-black uppercase text-xl text-white flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#0B63E5]" />
                      Localização & Horário da Fábrica
                    </h3>
                    <div className="space-y-3 font-montserrat text-sm text-slate-300">
                      <p className="flex items-start gap-3">
                        <span className="font-semibold text-white min-w-[90px]">Endereço:</span>
                        <span>Luanda, Angola (Parque Industrial e Centro de Produção Gráfica/Têxtil)</span>
                      </p>
                      <p className="flex items-start gap-3">
                        <span className="font-semibold text-white min-w-[90px]">E-mail:</span>
                        <a href="mailto:contacto@gpaangola.com" className="text-[#0B63E5] hover:underline">contacto@gpaangola.com</a>
                      </p>
                      <p className="flex items-start gap-3">
                        <span className="font-semibold text-white min-w-[90px]">Horário:</span>
                        <span>Segunda a Sexta: 08:00 – 18:00 | Sábado: 08:00 – 13:00</span>
                      </p>
                      <p className="flex items-start gap-3">
                        <span className="font-semibold text-white min-w-[90px]">Cobertura:</span>
                        <span className="text-emerald-400 font-semibold">Envio e montagem em todas as 21 províncias</span>
                      </p>
                    </div>
                  </div>

                </div>

                {/* Right: Fast Message Form */}
                <div className="lg:col-span-6">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-6 sm:p-8 shadow-xl space-y-5">
                    <h3 className="font-akrobat font-black uppercase text-2xl text-white flex items-center gap-2">
                      <Mail className="w-6 h-6 text-[#0B63E5]" />
                      Envie uma Mensagem Imediata
                    </h3>
                    <p className="text-xs text-slate-400 font-montserrat">
                      Preencha os seus dados e a equipa de atendimento responderá em menos de 15 minutos:
                    </p>

                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                        const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
                        const msg = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
                        const clean = (liveConfig?.companyPhones?.[0] || '+244923000000').replace(/\D/g, '');
                        const text = `*Novo Contacto do Website GPA*\n\n*Nome:* ${name}\n*Telefone:* ${phone}\n*Mensagem:* ${msg}`;
                        window.open(`https://wa.me/${clean}?text=${encodeURIComponent(text)}`, '_blank');
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs uppercase font-akrobat font-bold tracking-wider text-slate-300 mb-1">Seu Nome / Empresa</label>
                        <input 
                          type="text" 
                          name="name" 
                          required 
                          placeholder="Ex: Manuel Silva ou Empresa Lda."
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-slate-500 font-montserrat text-sm focus:outline-none focus:border-[#0B63E5]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase font-akrobat font-bold tracking-wider text-slate-300 mb-1">Telefone / WhatsApp</label>
                        <input 
                          type="tel" 
                          name="phone" 
                          required 
                          placeholder="+244 9XX XXX XXX"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-slate-500 font-montserrat text-sm focus:outline-none focus:border-[#0B63E5]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase font-akrobat font-bold tracking-wider text-slate-300 mb-1">Mensagem ou Descrição do Pedido</label>
                        <textarea 
                          name="message" 
                          rows={4} 
                          required 
                          placeholder="Descreva o que necessita (quantidades, tipos de materiais ou serviços)..."
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-slate-500 font-montserrat text-sm focus:outline-none focus:border-[#0B63E5]"
                        ></textarea>
                      </div>

                      <button 
                        type="submit" 
                        className="w-full btn-default text-lg py-3.5 flex items-center justify-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        <span>ENVIAR MENSAGEM VIA WHATSAPP</span>
                      </button>
                    </form>
                  </div>
                </div>

              </div>

            </div>
          </div>
        );

      case 'home':
      default:
        return (
          <>
            {/* 1. HERO BANNER SLIDER & MIRROR BOX */}
            <div id="home">
              <Hero 
                onOpenQuoteCalculator={() => handleOpenQuoteWithDetails()} 
                onExploreServices={() => handleScrollToSection('services')} 
                onPlayVideo={() => setIsVideoOpen(true)} 
                onOpenIndustrialGallery={() => setIsIndustrialGalleryOpen(true)} 
                title={liveConfig?.heroTitle} 
                subtitle={liveConfig?.heroSubtitle} 
              />
            </div>

            {/* 2. CATEGORY BANNERS (2 CARDS: PARQUE INDUSTRIAL + VÍDEO INSTITUCIONAL) */}
            <CategoryBanners 
              onSelectCategory={(catId) => handleScrollToSection(catId || 'production')}
              onOpenQuoteWithService={(svcId) => handleOpenQuoteWithDetails(svcId)}
              onPlayVideo={() => setIsVideoOpen(true)}
            />

            {/* 3. SERVIÇOS EM DESTAQUE */}
            <div id="services">
              <ServicesExplorer 
                onOpenQuoteCalculatorWithService={(serviceId) => handleOpenQuoteWithDetails(serviceId)} 
              />
            </div>

            {/* 4. PARQUE INDUSTRIAL & SLIDESHOW */}
            <div id="production">
              <Slideshow />
            </div>

            {/* 5. ESTATÍSTICAS NACIONAIS (21 PROVÍNCIAS) */}
            <StatsCounter 
              provinciasAtendidas={liveConfig?.statsProvinciasAtendidas} 
              anosExperiencia={liveConfig?.statsAnosExperiencia} 
            />
          </>
        );
    }
  };

  if (isAdminView) {
    return (
      <AdminDashboard 
        onClose={() => {
          setIsAdminView(false);
          fetchFirebaseData();
        }} 
        onRefreshSiteData={fetchFirebaseData} 
        pageViews={pageViews}
        videoUrl={videoUrl}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased overflow-x-hidden relative">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header onOpenQuoteCalculator={() => handleOpenQuoteWithDetails()} onScrollToSection={handleScrollToSection} activeSection={activeSection} logoUrl={liveConfig?.logoUrl} companyPhones={liveConfig?.companyPhones} />

        <main className="flex-1 flex flex-col w-full">
          {renderPageContent()}
        </main>

        <Footer onScrollToSection={handleScrollToSection} onOpenAdmin={() => setIsAdminView(true)} logoUrl={liveConfig?.logoUrl} footerLogoUrl={liveConfig?.footerLogoUrl} companyNif={liveConfig?.companyNif} companyYear={liveConfig?.companyYear} companyPhones={liveConfig?.companyPhones} partners={livePartners} hidePartnersMarquee={activeSection === 'contact'} />

        <WhatsAppWidget companyPhones={liveConfig?.companyPhones} />

        <QuoteCalculator isOpen={isQuoteOpen} onClose={handleCloseQuote} initialServiceId={quoteServiceId} initialProductName={quoteProductName} siteConfig={liveConfig} />

        <AnimatePresence>
          {isVideoOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsVideoOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-md"></motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-3xl bg-brand-purple-dark rounded-3xl overflow-hidden shadow-2xl z-10 border border-white/10">
              {/* Top info bar */}
              <div className="bg-brand-purple/95 border-b border-white/5 p-4 flex justify-between items-center text-white">
                <div className="flex items-center space-x-2">
                  <Play className="w-4 h-4 text-brand-orange fill-brand-orange" />
                  <span className="font-display font-bold text-sm">Apresentação Institucional GPA Angola</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setIsEditingVideoUrl(!isEditingVideoUrl);
                      setNewVideoUrl(videoUrl);
                    }}
                    className="bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
                    title="Configurar link do vídeo"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Configurar Vídeo</span>
                  </button>
                  <button
                    onClick={() => setIsVideoOpen(false)}
                    className="bg-white/10 hover:bg-white/20 text-white p-1.5 rounded-full cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Video Configuration Drawer/Input Area */}
              {isEditingVideoUrl && (
                <div className="bg-slate-900 border-b border-white/10 p-4 text-white font-sans space-y-3">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold tracking-wider text-gray-400 font-mono uppercase">URL do Vídeo (YouTube, MP4 ou Local)</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newVideoUrl}
                        onChange={(e) => setNewVideoUrl(e.target.value)}
                        placeholder="Ex: https://www.youtube.com/watch?v=... ou /video.mp4"
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-orange text-white"
                      />
                      <button
                        onClick={async () => {
                          const urlToSave = newVideoUrl.trim();
                          if (urlToSave) {
                            setVideoUrl(urlToSave);
                            localStorage.setItem('gpa_video_url', urlToSave);
                            setIsEditingVideoUrl(false);
                            setActiveToast('A guardar novo vídeo na Nuvem...');
                            try {
                              await updateSiteConfig({ videoUrl: urlToSave });
                              setActiveToast('Vídeo salvo na Nuvem com sucesso!');
                              fetchFirebaseData();
                            } catch (e) {
                              setActiveToast('Vídeo guardado localmente (Erro ao salvar na nuvem).');
                            }
                          } else {
                            // Reset to default
                            const defaultUrl = 'https://youtu.be/NhOghnXD1f8?si=Y0Jd-XJlk7APXYO9';
                            setVideoUrl(defaultUrl);
                            localStorage.removeItem('gpa_video_url');
                            setIsEditingVideoUrl(false);
                            setActiveToast('A repor vídeo padrão...');
                            try {
                              await updateSiteConfig({ videoUrl: defaultUrl });
                              setActiveToast('Vídeo padrão reposto na Nuvem!');
                              fetchFirebaseData();
                            } catch (e) {
                              setActiveToast('Erro ao atualizar na Nuvem.');
                            }
                          }
                        }}
                        className="bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold py-2 px-4 rounded-xl shadow cursor-pointer transition-colors"
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
                    💡 <strong>Dica:</strong> Pode colar um link de vídeo do <strong>YouTube</strong> ou um link de vídeo direto <strong>.mp4</strong> da internet. Se quiser carregar o seu vídeo localmente, guarde-o na pasta <code className="bg-white/10 px-1 py-0.5 rounded font-mono">public/</code> (ex: <code className="bg-white/10 px-1 py-0.5 rounded font-mono">public/video.mp4</code>) e depois coloque apenas <code className="bg-white/10 px-1 py-0.5 rounded font-mono">/video.mp4</code> no campo acima!
                  </p>
                </div>
              )}

              {/* Dynamic Video Showcase Content Screen */}
              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                {getYouTubeId(videoUrl) ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(videoUrl)}?autoplay=1&mute=0&playsinline=1&rel=0`}
                    title="Apresentação Institucional GPA Angola"
                    className="w-full h-full aspect-video border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video
                    key={videoUrl}
                    src={videoUrl}
                    className="w-full h-full aspect-video object-cover"
                    controls
                    autoPlay
                    playsInline
                  >
                    O seu navegador não suporta a reprodução de vídeo HTML5.
                  </video>
                )}
              </div>

              {/* Direct Youtube Backup/Fallback link */}
              {getYouTubeId(videoUrl) && (
                <div className="bg-slate-950 px-4 py-2 border-t border-white/5 text-center">
                  <a
                    href={`https://www.youtube.com/watch?v=${getYouTubeId(videoUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-[11px] font-sans text-brand-orange hover:text-brand-orange-hover hover:underline transition-colors"
                  >
                    <span>Se o vídeo não iniciar na sua tela, clique aqui para abrir diretamente no YouTube ↗</span>
                  </a>
                </div>
              )}

              {/* Prompt to book */}
              <div className="bg-brand-purple p-4 flex flex-col sm:flex-row justify-between items-center text-white border-t border-white/5 gap-3">
                <span className="text-xs font-sans text-gray-300 text-center sm:text-left">
                  Gostou do nosso rigor industrial? Faça uma simulação rápida do seu projeto!
                </span>
                <button
                  onClick={() => {
                    setIsVideoOpen(false);
                    handleOpenQuoteWithDetails();
                  }}
                  className="bg-brand-orange text-white hover:bg-brand-orange-hover text-xs font-bold py-2 px-4 rounded-xl shadow cursor-pointer"
                >
                  Pedir Orçamento
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      </div> {/* End of Primary Page Layout Wrapper relative z-10 */}

      {/* INDUSTRIAL GALLERY MODAL */}
      <IndustrialGalleryModal
        isOpen={isIndustrialGalleryOpen}
        onClose={() => setIsIndustrialGalleryOpen(false)}
        liveGallery={liveGallery}
      />

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/10 max-w-sm flex items-center space-x-3 font-sans"
          >
            <div className="w-2 h-2 bg-brand-orange rounded-full flex-shrink-0 animate-ping"></div>
            <p className="text-xs font-semibold leading-relaxed">{activeToast}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
