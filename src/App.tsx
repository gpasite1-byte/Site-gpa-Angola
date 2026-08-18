import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, Volume2, ShieldAlert, Check, Users, Sparkles, 
  MapPin, Clock, ArrowRight, HelpCircle, X, Award, Eye, Settings, Video, FileVideo, Building2
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

  // Intersection Observer for scroll tracking
  useEffect(() => {
    const sections = ['home', 'production', 'about', 'store', 'services', 'portfolio', 'testimonials', 'contact'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Video progress bar interval simulation is no longer needed with real video player

  const handleScrollToSection = (id: string) => {
    setActiveSection(id);
    window.scrollTo({ top: 0, behavior: 'instant' });

    const el = document.getElementById(id);
    if (el) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth'
      });
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
      case 'production':
        return <Slideshow />;
      case 'about':
        return (
          <section id="about" className="relative pt-44 sm:pt-52 md:pt-60 lg:pt-64 pb-24 scroll-mt-36 border-t border-white/10 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <video className="h-full w-full object-cover opacity-25" autoPlay muted loop playsInline>
                <source src="/GPA/Cinematic_D_animation_seaml.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(249,250,252,0.90),rgba(245,247,255,0.96))]" />
            </div>
            <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5 relative">
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-orange/5 rounded-full blur-2xl"></div>
                  <div className="relative bg-white rounded-3xl p-6 sm:p-8 text-slate-800 space-y-6 shadow-xl overflow-hidden border border-slate-200">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.05)_0%,transparent_60%)] pointer-events-none"></div>
                    {liveConfig?.aboutImageUrl && (
                      <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                        <img src={liveConfig.aboutImageUrl} alt="GPA Angola" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    <div className="relative z-10 space-y-4">
                      <div className="p-3 bg-brand-orange/10 rounded-2xl inline-block text-brand-orange"><Award className="w-6 h-6" /></div>
                      <h3 className="font-display font-extrabold text-xl sm:text-2xl leading-tight text-slate-900">{liveConfig?.aboutHighlightTitle || 'Liderança no Setor de Artes Gráficas em Luanda'}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">{liveConfig?.aboutHighlightText || 'Fundada com a missão de colmatar a escassez de produção industrial de alta definição, a GPA Angola tornou-se o parceiro estratégico de corporações multinacionais e gabinetes governamentais.'}</p>
                    </div>
                    <div className="border-t border-slate-100 pt-5 mt-2 space-y-3.5 relative z-10">
                      <div className="flex items-center space-x-3 text-xs sm:text-sm font-sans"><div className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center p-0.5"><Check className="w-3 h-3 stroke-[3]" /></div><span className="font-semibold text-slate-700">Parque de máquinas próprio 100% ativo</span></div>
                      <div className="flex items-center space-x-3 text-xs sm:text-sm font-sans"><div className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center p-0.5"><Check className="w-3 h-3 stroke-[3]" /></div><span className="font-semibold text-slate-700">Importação direta de consumíveis alemães</span></div>
                      <div className="flex items-center space-x-3 text-xs sm:text-sm font-sans"><div className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center p-0.5"><Check className="w-3 h-3 stroke-[3]" /></div><span className="font-semibold text-slate-700">Equipa técnica de montagem 24/7</span></div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl flex items-center space-x-3 relative z-10 border border-slate-100">
                      <span className="text-2xl font-black text-brand-orange font-display">{liveConfig?.statsAnosExperiencia !== undefined ? `${liveConfig.statsAnosExperiencia}+` : '18+'}</span>
                      <p className="text-[11px] text-slate-600 font-sans leading-snug">Anos de experiência sólida moldando identidades visuais de peso em todas as {liveConfig?.statsProvinciasAtendidas !== undefined ? liveConfig.statsProvinciasAtendidas : '21'} províncias atendidas.</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-block text-xs font-mono font-bold tracking-widest text-brand-orange uppercase bg-brand-orange/10 px-3.5 py-1 rounded-full">{liveConfig?.aboutTitle || 'Quem Somos'}</div>
                  <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-slate-900 leading-tight">{liveConfig?.aboutSubtitle || 'Criamos marcas prontas para deixar uma impressão indelével no mercado.'}</h2>
                  <div className="space-y-4 text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
                    <p>{liveConfig?.aboutText1 || 'Na GPA Angola, compreendemos que o material gráfico e o fardamento de uma empresa são a extensão física da sua credibilidade. É por isso que não subcontratamos a nossa produção. Todo o processo — desde a concepção gráfica no nosso estúdio criativo, até à impressão offset, cozedura têxtil e instalação física de letreiros — é realizado internamente.'}</p>
                    <p>{liveConfig?.aboutText2 || 'Contamos com instalações modernas equipadas com tecnologia industrial de última geração, o que nos permite garantir prazos recordes e preços imbatíveis para tiragens de alta escala.'}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-2xl flex items-start space-x-3 backdrop-blur-xl"><div className="p-2 bg-brand-orange/10 text-brand-orange rounded-xl mt-0.5"><Sparkles className="w-4.5 h-4.5" /></div><div><h4 className="font-display font-bold text-sm text-slate-900">Inovação Tecnológica</h4><p className="text-xs text-slate-500 mt-1 font-sans">Investimento constante em sistemas automáticos de tintagem e corte a laser.</p></div></div>
                    <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-2xl flex items-start space-x-3 backdrop-blur-xl"><div className="p-2 bg-brand-orange/10 text-brand-orange rounded-xl mt-0.5"><MapPin className="w-4.5 h-4.5" /></div><div><h4 className="font-display font-bold text-sm text-slate-900">Logística Nacional</h4><p className="text-xs text-slate-500 mt-1 font-sans">Capacidade logística para entregar e instalar stands e fachadas em qualquer província.</p></div></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      case 'store':
        return (
          <section id="store" className="relative pt-44 sm:pt-52 md:pt-60 lg:pt-64 pb-24 scroll-mt-36 border-t border-white/10 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <video className="h-full w-full object-cover opacity-20" autoPlay muted loop playsInline>
                <source src="/GPA/Cinematic_D_animation_seaml.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.90),rgba(250,250,255,0.96))]" />
            </div>
            <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-12 mt-4 sm:mt-8 space-y-4">
                <div className="inline-block text-xs font-mono font-bold tracking-widest text-brand-orange uppercase bg-brand-orange/10 px-3.5 py-1 rounded-full">Catálogo Oficial</div>
                <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-brand-purple">Nossa Loja Online</h2>
                <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed">Explore o nosso catálogo industrial, consulte os preços de referência em tempo real e faça as suas encomendas diretamente por WhatsApp ou com simulação automática de orçamento.</p>
              </div>
              <OnlineStore siteConfig={liveConfig} onOpenQuoteWithDetails={handleOpenQuoteWithDetails} storeProducts={liveStoreProducts} />
            </div>
          </section>
        );
      case 'services':
        return <ServicesExplorer onOpenQuoteCalculatorWithService={(serviceId) => handleOpenQuoteWithDetails(serviceId)} />;
      case 'portfolio':
        return <Portfolio onOpenQuoteForProject={(serviceId, productName) => handleOpenQuoteWithDetails(serviceId, productName)} liveProjects={liveProjects} />;
      case 'contact':
        return (
          <section id="contact" className="relative flex-1 flex flex-col justify-center py-20 pt-36 sm:pt-44 lg:pt-48 scroll-mt-28 overflow-hidden">
            <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
              <div className="rounded-[2rem] border border-white/20 bg-[linear-gradient(135deg,rgba(17,24,39,0.96),rgba(30,41,59,0.9),rgba(15,23,42,0.96))] p-8 sm:p-12 text-white shadow-2xl">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                  <div className="space-y-4 max-w-2xl">
                    <div className="inline-block text-xs font-mono font-bold tracking-widest text-brand-orange uppercase bg-brand-orange/10 px-3.5 py-1 rounded-full">Contacto Directo</div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight leading-tight">Vamos criar a sua próxima campanha ou solução de produção.</h2>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                      Entre em contacto com a nossa equipa comercial para pedir orçamentos, esclarecer dúvidas técnicas ou agendar uma reunião presencial.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {(liveConfig?.companyPhones && liveConfig.companyPhones.length > 0 ? liveConfig.companyPhones : ['+244 945 119 409', '+244 933 417 569', '+244 953 979 343']).map((phone) => (
                      <a key={phone} href={`tel:${phone.replace(/\s+/g, '')}`} className="px-5 py-3 rounded-full bg-white/10 border border-white/15 hover:bg-brand-orange hover:border-brand-orange text-sm sm:text-base font-semibold transition-all shadow-md">{phone}</a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      case 'home':
      default:
        return (
          <>
            <Hero onOpenQuoteCalculator={() => handleOpenQuoteWithDetails()} onExploreServices={() => handleScrollToSection('services')} onPlayVideo={() => setIsVideoOpen(true)} onOpenIndustrialGallery={() => setIsIndustrialGalleryOpen(true)} title={liveConfig?.heroTitle} subtitle={liveConfig?.heroSubtitle} videoUrl={videoUrl} />
            <Slideshow />
            <StatsCounter provinciasAtendidas={liveConfig?.statsProvinciasAtendidas} anosExperiencia={liveConfig?.statsAnosExperiencia} />
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
      />
    );
  }

  return (
    <div className="min-h-screen bg-hexagon-pattern text-slate-800 selection:bg-brand-orange selection:text-white font-sans antialiased overflow-x-hidden relative">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <video key={videoUrl} className="page-video" autoPlay muted loop playsInline poster="/GPA/Gemini_Generated_Image_2nsofo2nsofo2nso.png">
          <source src={videoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(9,10,16,0.72),rgba(18,22,35,0.54),rgba(17,13,34,0.82))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.16),transparent_24%)]" />
      </div>

      <div className="fixed inset-0 pointer-events-none z-0 bg-no-repeat bg-center" style={{ backgroundImage: `url(${liveConfig?.bgImageUrl || "https://i.ibb.co/v6FWV57q/LOGO-GPA.png"})`, backgroundSize: 'min(450px, 75%)', backgroundPosition: 'center 35%', opacity: liveConfig?.bgOpacity && liveConfig.bgOpacity > 0.02 ? liveConfig.bgOpacity : 0.08 }}></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[20%] right-[-50px] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none"></div>

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
