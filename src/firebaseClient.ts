import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  increment
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { Testimonial, QuoteRequest, Project, ChatMessage, AssistantChatSession, StoreProduct, AdminUser, StoreCategory, Service } from './types';
import { PROJECTS, DEFAULT_STORE_PRODUCTS, DEFAULT_STORE_CATEGORIES, SERVICES } from './data';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Collection Names
const CONFIG_COLLECTION = 'gpa_config';
const TESTIMONIALS_COLLECTION = 'gpa_testimonials';
const QUOTES_COLLECTION = 'gpa_quotes';
const SUBSCRIBERS_COLLECTION = 'gpa_subscribers';
const GALLERY_COLLECTION = 'gpa_gallery';
const ASSISTANT_CHATS_COLLECTION = 'gpa_assistant_chats';
const PARTNERS_COLLECTION = 'gpa_partners';
const PROJECTS_COLLECTION = 'gpa_projects';
const STORE_PRODUCTS_COLLECTION = 'gpa_store_products';
const ADMIN_USERS_COLLECTION = 'gpa_admin_users';
const STORE_CATEGORIES_COLLECTION = 'gpa_store_categories';
const SERVICES_COLLECTION = 'gpa_services';

/**
 * --- RETRIEVAL TIMEOUT HELPER ---
 * Guarantees that if Firestore stalls/hangs due to network, unprovisioned DB,
 * or unaccepted terms, the app immediately falls back to static defaults and never spins forever.
 */
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, fallbackValue: T): Promise<T> {
  return Promise.race([
    promise.catch((err) => {
      console.warn(`[Firebase] Query failed. Using offline fallback.`, err);
      return fallbackValue;
    }),
    new Promise<T>((resolve) => setTimeout(() => {
      console.warn(`[Firebase] Query timed out after ${timeoutMs}ms. Using offline fallback.`);
      resolve(fallbackValue);
    }, timeoutMs))
  ]);
}

/**
 * --- ADMIN AUTHENTICATION ---
 * Since simple passcodes are requested and we want instant setup without configuring email auth providers,
 * we can check an admin passcode securely stored in Firestore, or fallback to 'gpa2026' or 'admin@gpa'
 */
export async function verifyAdminPasscode(passcode: string): Promise<boolean> {
  const adminDocRef = doc(db, CONFIG_COLLECTION, 'admin_auth');
  const fetchPromise = (async () => {
    const snap = await getDoc(adminDocRef);
    if (snap.exists()) {
      const data = snap.data();
      return data.passcode === passcode;
    } else {
      // Auto-create default admin passcode 'gpa2026' on first run
      await setDoc(adminDocRef, { passcode: 'gpa2026' });
      return passcode === 'gpa2026';
    }
  })();
  return withTimeout(fetchPromise, 20000, passcode === 'gpa2026');
}

export async function updateAdminPasscode(newPasscode: string): Promise<void> {
  const adminDocRef = doc(db, CONFIG_COLLECTION, 'admin_auth');
  await setDoc(adminDocRef, { passcode: newPasscode }, { merge: true });
}

/**
 * --- GENERAL SITE CONFIGURATION ---
 * Easily edit general texts, contact numbers, titles, video URL, etc.
 */
export interface SiteConfig {
  heroTitle: string;
  heroSubtitle: string;
  companyEmail: string;
  companyPhone: string;
  companyPhones?: string[];
  companyAddress: string;
  videoUrl: string;
  whatsappNumber: string;

  // New Fields requested by user to alter everything (text, images, video)
  aboutTitle: string;
  aboutSubtitle: string;
  aboutText1: string;
  aboutText2: string;
  aboutHighlightTitle: string;
  aboutHighlightText: string;
  aboutImageUrl: string;

  heroBg1: string;
  heroBg2: string;
  heroBg3: string;

  // Added newly requested fields
  logoUrl: string;
  footerLogoUrl?: string;
  companyNif: string;
  companyYear: string;
  statsProvinciasAtendidas: number;
  statsAnosExperiencia: number;

  // Global background image and opacity
  bgImageUrl: string;
  bgOpacity: number;

  // Premium admin modules and custom section registry
  customModules?: Array<{
    id: string;
    title: string;
    description: string;
    accent: string;
    icon: string;
    enabled: boolean;
    createdAt: string;
  }>;

  // Dynamic service rates for quote calculator
  rate_impressao_base: number;
  rate_impressao_unit: number;
  rate_textil_base: number;
  rate_textil_unit: number;
  rate_design_base: number;
  rate_design_unit: number;
  rate_marketing_base: number;
  rate_marketing_unit: number;
  rate_audiovisual_base: number;
  rate_audiovisual_unit: number;
  rate_brindes_base: number;
  rate_brindes_unit: number;
  rate_sinaletica_base: number;
  rate_sinaletica_unit: number;
  rate_stands_base: number;
  rate_stands_unit: number;
  productPrices?: Record<string, number>;
  productMinQtys?: Record<string, number>;
  productImages?: Record<string, string>;
  imgbbApiKey?: string;
}

const DEFAULT_CONFIG: SiteConfig = {
  imgbbApiKey: '4714d428c9a98b9354b9fec028184ea9',
  heroTitle: 'Produção Industrial Gráfica e Têxtil em Luanda',
  heroSubtitle: 'A GPA Angola é a maior aliada da sua marca na produção de fardamentos, sinalética e brindes de alta qualidade corporativa.',
  companyEmail: 'comercial@gpaangola.com',
  companyPhone: '+244 994 943 828',
  companyPhones: [
    '+244 945 119 409',
    '+244 933 417 569',
    '+244 953 979 343',
    '+244 994 943 828'
  ],
  companyAddress: 'Parque Industrial de Viana, Luanda, Angola',
  videoUrl: 'https://youtu.be/NhOghnXD1f8?si=Y0Jd-XJlk7APXYO9',
  whatsappNumber: '244923100200',

  aboutTitle: 'Quem Somos',
  aboutSubtitle: 'Criamos marcas prontas para deixar uma impressão indelével no mercado.',
  aboutText1: 'Na GPA Angola, compreendemos que o material gráfico e o fardamento de uma empresa são a extensão física da sua credibilidade. É por isso que não subcontratamos a nossa produção. Todo o processo — desde a concepção gráfica no nosso estúdio criativo, até à impressão offset, cozedura têxtil e instalação física de letreiros — é realizado internamente.',
  aboutText2: 'Contamos com instalações modernas equipadas com tecnologia industrial de última geração, o que nos permite garantir prazos recordes e preços imbatíveis para tiragens de alta escala.',
  aboutHighlightTitle: 'Liderança no Setor de Artes Gráficas em Luanda',
  aboutHighlightText: 'Fundada com a missão de colmatar a escassez de produção industrial de alta definição, a GPA Angola tornou-se o parceiro estratégico de corporações multinacionais e gabinetes governamentais.',
  aboutImageUrl: 'https://i.ibb.co/tp11FWrR/540917386-1233950932081900-5699568455854047019-n.jpg',

  heroBg1: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop',
  heroBg2: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1955&auto=format&fit=crop',
  heroBg3: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',

  logoUrl: 'https://i.ibb.co/v6FWV57q/LOGO-GPA.png',
  footerLogoUrl: 'https://i.ibb.co/v4JJZZXF/LOGO-GPA-18-BRANCA-1.png',
  companyNif: '5002498223',
  companyYear: '2026',
  statsProvinciasAtendidas: 21,
  statsAnosExperiencia: 18,

  // Default global background
  bgImageUrl: '',
  bgOpacity: 0.1,
  customModules: [
    {
      id: 'marketing-kit',
      title: 'Kit de Marketing',
      description: 'Gestão de campanhas, materiais e lançamentos promocionais.',
      accent: '#f59e0b',
      icon: '✦',
      enabled: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'operacoes',
      title: 'Operações',
      description: 'Planeamento de produção, prazos e logística de entregas.',
      accent: '#3b82f6',
      icon: '◎',
      enabled: true,
      createdAt: new Date().toISOString()
    }
  ],

  // Dynamic rates (defaults match the original switch-case)
  rate_impressao_base: 5000,
  rate_impressao_unit: 250,
  rate_textil_base: 12000,
  rate_textil_unit: 4500,
  rate_design_base: 25000,
  rate_design_unit: 0,
  rate_marketing_base: 60000,
  rate_marketing_unit: 0,
  rate_audiovisual_base: 85000,
  rate_audiovisual_unit: 0,
  rate_brindes_base: 8000,
  rate_brindes_unit: 1500,
  rate_sinaletica_base: 35000,
  rate_sinaletica_unit: 12000,
  rate_stands_base: 250000,
  rate_stands_unit: 0,
  productPrices: {
    'Cartões de Visita Premium': 350,
    'Panfletos e Flyers': 250,
    'Catálogos Corporativos': 15500,
    'Calendários e Agendas': 16500,
    'Envelopes e Papel Timbrado': 350,
    'T-shirts Promocionais': 7500,
    'Polos Corporativos Bordados': 12500,
    'Fardas para Indústria e Restauração': 15500,
    'Bonés e Viseiras': 4850,
    'Coletes de Segurança Personalizados': 12950,
    'Logótipo & Manual de Marca': 150000,
    'Design de Embalagens': 45000,
    'Artes de Redes Sociais': 15000,
    'Design de Flyers e Banners': 10000,
    'Layouts para Stands': 95000,
    'Pacotes Mensais de Social Media': 250000,
    'Configuração de Campanhas de Anúncios': 85000,
    'Copywriting de Vendas': 35000,
    'Landing Pages para Conversão': 150000,
    'Auditoria de Presença Digital': 50000,
    'Vídeos Institucionais': 750000,
    'Spots Publicitários de 15s/30s': 350000,
    'Vídeo Reportagem de Eventos': 450000,
    'Sessões Fotográficas de Equipa': 180000,
    'Motion Graphics Explicativos': 290000,
    'Canecas de Cerâmica & Garrafas Térmicas': 9800,
    'Canetas Metálicas Gravadas a Laser': 5850,
    'Blocos de Notas e Agendas': 9350,
    'Sacos Ecológicos (Tote Bags)': 2850,
    'Pens USB & Powerbanks': 19500,
    'Placas de Sinalização Interna/Externa': 45500,
    'Decoração Integral ou Parcial de Viaturas': 595000,
    'Reclames Luminosos 3D': 335000,
    'Lonas Publicitárias com Ilhós': 44500,
    'Roll-ups Autoportantes': 80500,
    'Stands Personalizados (Carpintaria)': 2950000,
    'Stands Modulares para Feiras': 1850000,
    'Balcões de Atendimento e Displays': 185000,
    'Backdrops de Conferência Gigantes': 495000,
    'Roll-ups e Pop-ups Promocionais': 485000
  },
  productMinQtys: {
    'Cartões de Visita Premium': 200,
    'Panfletos e Flyers': 1000,
    'Catálogos Corporativos': 100,
    'Calendários e Agendas': 50,
    'Envelopes e Papel Timbrado': 500,
    'T-shirts Promocionais': 100,
    'Polos Corporativos Bordados': 50,
    'Fardas para Indústria e Restauração': 30,
    'Bonés e Viseiras': 100,
    'Coletes de Segurança Personalizados': 10,
    'Canecas de Cerâmica & Garrafas Térmicas': 30,
    'Canetas Metálicas Gravadas a Laser': 100,
    'Blocos de Notas e Agendas': 100,
    'Sacos Ecológicos (Tote Bags)': 200,
    'Pens USB & Powerbanks': 30,
    'Placas de Sinalização Interna/Externa': 5,
    'Decoração Integral ou Parcial de Viaturas': 1,
    'Reclames Luminosos 3D': 2,
    'Lonas Publicitárias com Ilhós': 5,
    'Roll-ups Autoportantes': 1,
    'Stands Personalizados (Carpintaria)': 1,
    'Stands Modulares para Feiras': 1,
    'Balcões de Atendimento e Displays': 1,
    'Backdrops de Conferência Gigantes': 1,
    'Roll-ups e Pop-ups Promocionais': 1
  }
};

export async function getSiteConfig(): Promise<SiteConfig> {
  const configRef = doc(db, CONFIG_COLLECTION, 'general_settings');
  const cached = localStorage.getItem('gpa_cached_site_config');
  const fallback = cached ? JSON.parse(cached) : DEFAULT_CONFIG;

  const fetchPromise = (async () => {
    try {
      const snap = await getDoc(configRef);
      if (snap.exists()) {
        const incoming = snap.data();
        const mergedPrices = { ...DEFAULT_CONFIG.productPrices, ...(incoming.productPrices || {}) };
        const mergedMinQtys = { ...DEFAULT_CONFIG.productMinQtys, ...(incoming.productMinQtys || {}) };
        const data = { 
          ...DEFAULT_CONFIG, 
          ...incoming, 
          productPrices: mergedPrices, 
          productMinQtys: mergedMinQtys 
        } as SiteConfig;
        try { localStorage.setItem('gpa_cached_site_config', JSON.stringify(data)); } catch (e) {}
        return data;
      } else {
        try { await setDoc(configRef, DEFAULT_CONFIG); } catch (e) {}
        try { localStorage.setItem('gpa_cached_site_config', JSON.stringify(DEFAULT_CONFIG)); } catch (e) {}
        return DEFAULT_CONFIG;
      }
    } catch (err) {
      console.warn('Firestore getSiteConfig error, using fallback:', err);
      return fallback;
    }
  })();

  return withTimeout(fetchPromise, 4000, fallback);
}

export async function updateSiteConfig(newConfig: Partial<SiteConfig>): Promise<void> {
  const configRef = doc(db, CONFIG_COLLECTION, 'general_settings');
  try {
    await setDoc(configRef, newConfig, { merge: true });
  } catch (err) {
    console.warn('Firestore updateSiteConfig error:', err);
  }

  try {
    const cached = localStorage.getItem('gpa_cached_site_config');
    const current = cached ? JSON.parse(cached) : DEFAULT_CONFIG;
    const updated = { ...current, ...newConfig };
    localStorage.setItem('gpa_cached_site_config', JSON.stringify(updated));
  } catch (e) {
    console.warn('Could not update cached site config:', e);
  }
}

/**
 * --- PARTNERS / LOGOS ---
 */
export interface Partner {
  id: string;
  name: string;
  logoText: string;
  imageUrl: string;
  order: number;
}

export async function getPartners(): Promise<Partner[]> {
  const defaultPartners: Partner[] = [
    { id: '1', name: 'Sonangol', logoText: 'Sonangol', imageUrl: 'https://i.ibb.co/Z1c5FwFV/SONANGOL.jpg', order: 1 },
    { id: '2', name: 'Banco BAI', logoText: 'BAI', imageUrl: 'https://i.ibb.co/8DyXrMdP/BAI.png', order: 2 },
    { id: '3', name: 'Unitel', logoText: 'UNITEL', imageUrl: 'https://i.ibb.co/nNFLY2dt/UNITEL.jpg', order: 3 },
    { id: '4', name: 'Zap', logoText: 'zap', imageUrl: 'https://i.ibb.co/vFh3KHn/zap.jpg', order: 4 },
    { id: '5', name: 'BFA', logoText: 'BFA', imageUrl: 'https://i.ibb.co/jvg2s2K2/BFA.jpg', order: 5 },
    { id: '6', name: 'Nestlé', logoText: 'Nestlé', imageUrl: 'https://i.ibb.co/4w3FGfSG/NESTLE.jpg', order: 6 }
  ];

  const cached = localStorage.getItem('gpa_cached_partners');
  const fallback = cached ? JSON.parse(cached) : defaultPartners;

  const fetchPromise = (async () => {
    try {
      const snap = await getDocs(collection(db, PARTNERS_COLLECTION));
      if (snap.empty) {
        try {
          for (const p of defaultPartners) {
            await setDoc(doc(db, PARTNERS_COLLECTION, p.id), p);
          }
        } catch (e) {}
        try { localStorage.setItem('gpa_cached_partners', JSON.stringify(defaultPartners)); } catch (e) {}
        return defaultPartners;
      }
      const list: Partner[] = [];
      snap.forEach((d) => {
        const data = d.data();
        list.push({ id: d.id, ...data } as Partner);
      });
      const sorted = list.sort((a, b) => (a.order || 0) - (b.order || 0));
      try { localStorage.setItem('gpa_cached_partners', JSON.stringify(sorted)); } catch (e) {}
      return sorted;
    } catch (err) {
      console.warn('Firestore getPartners error:', err);
      return fallback;
    }
  })();

  return withTimeout(fetchPromise, 4000, fallback);
}

export async function savePartner(partner: Partner): Promise<void> {
  try {
    await setDoc(doc(db, PARTNERS_COLLECTION, partner.id), partner, { merge: true });
  } catch (e) {}

  try {
    const cached = localStorage.getItem('gpa_cached_partners');
    let list: Partner[] = cached ? JSON.parse(cached) : [];
    const idx = list.findIndex(p => p.id === partner.id);
    if (idx > -1) {
      list[idx] = partner;
    } else {
      list.push(partner);
    }
    list.sort((a, b) => (a.order || 0) - (b.order || 0));
    localStorage.setItem('gpa_cached_partners', JSON.stringify(list));
  } catch (e) {}
}

export async function deletePartner(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, PARTNERS_COLLECTION, id));
  } catch (e) {}

  try {
    const cached = localStorage.getItem('gpa_cached_partners');
    if (cached) {
      let list: Partner[] = JSON.parse(cached);
      list = list.filter(p => p.id !== id);
      localStorage.setItem('gpa_cached_partners', JSON.stringify(list));
    }
  } catch (e) {}
}

/**
 * --- INDUSTRIAL GALLERY ---
 */
export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  order: number;
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const defaultGallery: GalleryItem[] = [
    { id: '0', imageUrl: "https://i.ibb.co/WWg9Y8mv/702077333-1456320736511584-7030095664157279059-n.jpg", caption: "Bordados computadorizados em fardamentos oficiais de alta cadência", order: 0 },
    { id: '1', imageUrl: "https://i.ibb.co/93Y6R1WR/540920032-1233950912081902-7946009404277390490-n.jpg", caption: "Estamparia industrial avançada e triagem têxtil rigorosa", order: 1 },
    { id: '2', imageUrl: "https://i.ibb.co/tp11FWrR/540917386-1233950932081900-5699568455854047019-n.jpg", caption: "Sinalética premium corporativa e revestimento de frotas", order: 2 },
    { id: '3', imageUrl: "https://i.ibb.co/PzYf2p6Z/540939835-1233950958748564-4095335279366262323-n.jpg", caption: "Impressão digital de grande formato com fidelidade cromática", order: 3 },
    { id: '4', imageUrl: "https://i.ibb.co/cKh1RC7X/540916036-1233950978748562-2995131198110979426-n.jpg", caption: "Offset Heidelberg alemã - controlo de densidade de tinta automático", order: 4 },
    { id: '5', imageUrl: "https://i.ibb.co/twCRR6XK/536279917-1234695478674112-5049397024375765850-n.jpg", caption: "Personalização têxtil e corte de precisão computadorizado", order: 5 }
  ];

  const cached = localStorage.getItem('gpa_cached_gallery');
  const fallback = cached ? JSON.parse(cached) : defaultGallery;

  const fetchPromise = (async () => {
    try {
      const snap = await getDocs(collection(db, GALLERY_COLLECTION));
      if (snap.empty) {
        try {
          for (const item of defaultGallery) {
            await setDoc(doc(db, GALLERY_COLLECTION, item.id), item);
          }
        } catch (e) {}
        try { localStorage.setItem('gpa_cached_gallery', JSON.stringify(defaultGallery)); } catch (e) {}
        return defaultGallery;
      }
      const list: GalleryItem[] = [];
      snap.forEach((d) => {
        const data = d.data();
        list.push({ id: d.id, ...data } as GalleryItem);
      });
      const sorted = list.sort((a, b) => (a.order || 0) - (b.order || 0));
      try { localStorage.setItem('gpa_cached_gallery', JSON.stringify(sorted)); } catch (e) {}
      return sorted;
    } catch (err) {
      console.warn('Firestore getGalleryItems error:', err);
      return fallback;
    }
  })();

  return withTimeout(fetchPromise, 4000, fallback);
}

export async function saveGalleryItem(item: GalleryItem): Promise<void> {
  try {
    await setDoc(doc(db, GALLERY_COLLECTION, item.id), item, { merge: true });
  } catch (e) {}

  try {
    const cached = localStorage.getItem('gpa_cached_gallery');
    let list: GalleryItem[] = cached ? JSON.parse(cached) : [];
    const idx = list.findIndex(g => g.id === item.id);
    if (idx > -1) {
      list[idx] = item;
    } else {
      list.push(item);
    }
    list.sort((a, b) => (a.order || 0) - (b.order || 0));
    localStorage.setItem('gpa_cached_gallery', JSON.stringify(list));
  } catch (e) {}
}

export async function deleteGalleryItem(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, GALLERY_COLLECTION, id));
  } catch (e) {}

  try {
    const cached = localStorage.getItem('gpa_cached_gallery');
    if (cached) {
      let list: GalleryItem[] = JSON.parse(cached);
      list = list.filter(g => g.id !== id);
      localStorage.setItem('gpa_cached_gallery', JSON.stringify(list));
    }
  } catch (e) {}
}

/**
 * --- TESTIMONIALS ---
 */
export async function getFirebaseTestimonials(): Promise<Testimonial[]> {
  const fetchPromise = (async () => {
    try {
      const snap = await getDocs(collection(db, TESTIMONIALS_COLLECTION));
      const list: Testimonial[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Testimonial);
      });
      return list;
    } catch (err) {
      console.warn('Firestore getFirebaseTestimonials error:', err);
      return [];
    }
  })();

  return withTimeout(fetchPromise, 4000, []);
}

export async function saveFirebaseTestimonial(t: Testimonial): Promise<void> {
  try {
    await setDoc(doc(db, TESTIMONIALS_COLLECTION, t.id), t, { merge: true });
  } catch (e) {}
}

export async function deleteFirebaseTestimonial(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, TESTIMONIALS_COLLECTION, id));
  } catch (e) {}
}

/**
 * --- QUOTE REQUESTS ---
 */
export async function getFirebaseQuotes(): Promise<QuoteRequest[]> {
  const fetchPromise = (async () => {
    try {
      const snap = await getDocs(collection(db, QUOTES_COLLECTION));
      const list: QuoteRequest[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as QuoteRequest);
      });
      return list.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    } catch (err) {
      console.warn('Firestore getFirebaseQuotes error:', err);
      return [];
    }
  })();

  return withTimeout(fetchPromise, 4000, []);
}

export async function saveFirebaseQuote(q: QuoteRequest): Promise<void> {
  try {
    await setDoc(doc(db, QUOTES_COLLECTION, q.id), q);
  } catch (e) {}
}

export async function deleteFirebaseQuote(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, QUOTES_COLLECTION, id));
  } catch (e) {}
}

/**
 * --- NEWSLETTER SUBSCRIBERS ---
 */
export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export async function getFirebaseSubscribers(): Promise<Subscriber[]> {
  const fetchPromise = (async () => {
    try {
      const snap = await getDocs(collection(db, SUBSCRIBERS_COLLECTION));
      const list: Subscriber[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Subscriber);
      });
      return list;
    } catch (err) {
      console.warn('Firestore getFirebaseSubscribers error:', err);
      return [];
    }
  })();

  return withTimeout(fetchPromise, 4000, []);
}

export async function addFirebaseSubscriber(email: string): Promise<void> {
  const id = Date.now().toString();
  try {
    await setDoc(doc(db, SUBSCRIBERS_COLLECTION, id), {
      id,
      email,
      subscribedAt: new Date().toISOString()
    });
  } catch (e) {}
}

/**
 * --- PORTFOLIO / PROJECTS ---
 */
export async function getFirebaseProjects(): Promise<Project[]> {
  const cached = localStorage.getItem('gpa_cached_projects');
  const fallback = cached ? JSON.parse(cached) : PROJECTS;

  const fetchPromise = (async () => {
    try {
      const snap = await getDocs(collection(db, PROJECTS_COLLECTION));
      if (snap.empty) {
        try {
          for (const p of PROJECTS) {
            await setDoc(doc(db, PROJECTS_COLLECTION, p.id), p);
          }
        } catch (e) {}
        try { localStorage.setItem('gpa_cached_projects', JSON.stringify(PROJECTS)); } catch (e) {}
        return PROJECTS;
      }
      const list: Project[] = [];
      snap.forEach((d) => {
        const data = d.data();
        list.push({ id: d.id, ...data } as Project);
      });
      try { localStorage.setItem('gpa_cached_projects', JSON.stringify(list)); } catch (e) {}
      return list;
    } catch (err) {
      console.warn('Firestore getFirebaseProjects error:', err);
      return fallback;
    }
  })();

  return withTimeout(fetchPromise, 4000, fallback);
}

export async function saveFirebaseProject(proj: Project): Promise<void> {
  await setDoc(doc(db, PROJECTS_COLLECTION, proj.id), proj, { merge: true });

  try {
    const cached = localStorage.getItem('gpa_cached_projects');
    let list: Project[] = cached ? JSON.parse(cached) : [];
    const idx = list.findIndex(p => p.id === proj.id);
    if (idx > -1) {
      list[idx] = proj;
    } else {
      list.push(proj);
    }
    localStorage.setItem('gpa_cached_projects', JSON.stringify(list));
  } catch (e) {
    console.warn('Could not update cached projects:', e);
  }
}

export async function deleteFirebaseProject(id: string): Promise<void> {
  await deleteDoc(doc(db, PROJECTS_COLLECTION, id));

  try {
    const cached = localStorage.getItem('gpa_cached_projects');
    if (cached) {
      let list: Project[] = JSON.parse(cached);
      list = list.filter(p => p.id !== id);
      localStorage.setItem('gpa_cached_projects', JSON.stringify(list));
    }
  } catch (e) {
    console.warn('Could not update cached projects:', e);
  }
}

/**
 * --- REAL-TIME SUBSCRIPTION HELPERS (QUERO TUDO APARECE AQUI DO GEITO QUE ESTA NOUTRO PC) ---
 * Provides real-time synchronization across multiple devices/PCs using Firebase Firestore onSnapshot listeners.
 */
export function subscribeSiteConfig(callback: (config: SiteConfig) => void): () => void {
  const configRef = doc(db, CONFIG_COLLECTION, 'general_settings');
  return onSnapshot(configRef, (snap) => {
    if (snap.exists()) {
      const data = { ...DEFAULT_CONFIG, ...snap.data() } as SiteConfig;
      localStorage.setItem('gpa_cached_site_config', JSON.stringify(data));
      callback(data);
    } else {
      setDoc(configRef, DEFAULT_CONFIG);
      localStorage.setItem('gpa_cached_site_config', JSON.stringify(DEFAULT_CONFIG));
      callback(DEFAULT_CONFIG);
    }
  }, (err) => {
    console.error('Real-time site config sync error:', err);
  });
}

export function subscribePartners(callback: (partners: Partner[]) => void): () => void {
  const partnersRef = collection(db, PARTNERS_COLLECTION);
  return onSnapshot(partnersRef, (snap) => {
    const list: Partner[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as Partner);
    });
    const sorted = list.sort((a, b) => (a.order || 0) - (b.order || 0));
    localStorage.setItem('gpa_cached_partners', JSON.stringify(sorted));
    callback(sorted);
  }, (err) => {
    console.error('Real-time partners sync error:', err);
  });
}

export function subscribeProjects(callback: (projects: Project[]) => void): () => void {
  const projectsRef = collection(db, PROJECTS_COLLECTION);
  return onSnapshot(projectsRef, (snap) => {
    const list: Project[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as Project);
    });
    localStorage.setItem('gpa_cached_projects', JSON.stringify(list));
    callback(list);
  }, (err) => {
    console.error('Real-time projects sync error:', err);
  });
}

export function subscribeGallery(callback: (gallery: GalleryItem[]) => void): () => void {
  const galleryRef = collection(db, GALLERY_COLLECTION);
  return onSnapshot(galleryRef, (snap) => {
    const list: GalleryItem[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as GalleryItem);
    });
    const sorted = list.sort((a, b) => (a.order || 0) - (b.order || 0));
    localStorage.setItem('gpa_cached_gallery', JSON.stringify(sorted));
    callback(sorted);
  }, (err) => {
    console.error('Real-time gallery sync error:', err);
  });
}

const ANALYTICS_COLLECTION = 'gpa_analytics';

export async function logPageView(): Promise<void> {
  const viewsRef = doc(db, ANALYTICS_COLLECTION, 'page_views');
  try {
    const snap = await getDoc(viewsRef);
    if (!snap.exists()) {
      await setDoc(viewsRef, { count: 1 });
    } else {
      await updateDoc(viewsRef, { count: increment(1) });
    }
  } catch (e) {
    console.warn('[Analytics] Failed to log page view:', e);
  }
}

export function subscribePageViews(callback: (views: number) => void): () => void {
  const viewsRef = doc(db, ANALYTICS_COLLECTION, 'page_views');
  return onSnapshot(viewsRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data().count || 0);
    } else {
      callback(0);
    }
  }, (err) => {
    console.error('Real-time page views sync error:', err);
  });
}

/**
 * --- MULTI-ADMIN SYSTEM ---
 */
// Get all admin users from Firestore
export async function getAdminUsers(): Promise<AdminUser[]> {
  const fetchPromise = (async () => {
    const snap = await getDocs(collection(db, ADMIN_USERS_COLLECTION));
    let list: AdminUser[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as AdminUser);
    });

    // Check if there is any administrator with 'owner' role. If not, seed a default master admin.
    const hasAnyOwner = list.some(u => u.role === 'owner');
    if (!hasAnyOwner && !list.some(u => u.username === 'admin')) {
      const defaultOwner: AdminUser = {
        id: 'admin',
        username: 'admin',
        passcode: 'gpa2026',
        name: 'Administrador Principal',
        role: 'owner',
        status: 'active',
        permissions: {
          editGeneral: true,
          editProducts: true,
          editPartners: true,
          editPortfolio: true,
          editGallery: true,
          viewQuotes: true,
          manageAdmins: true
        }
      };
      await setDoc(doc(db, ADMIN_USERS_COLLECTION, defaultOwner.id), defaultOwner);
      list.push(defaultOwner);
    }

    // Seed default staff only if the list has no staff/commercial agents at all! This prevents resetting edited names or phone numbers of commercials.
    const hasAnyStaff = list.some(u => u.role === 'staff');
    if (!hasAnyStaff && list.length <= 1) {
      const defaultComercial: AdminUser = {
        id: 'comercial 1',
        username: 'comercial 1',
        passcode: 'dtp',
        name: 'Comercial 1',
        role: 'staff',
        status: 'active',
        permissions: {
          editGeneral: false,
          editProducts: false,
          editPartners: false,
          editPortfolio: false,
          editGallery: false,
          viewQuotes: true,
          manageAdmins: false
        },
        whatsappNumber: '+244 994 943 828',
        isOnline: true
      };
      await setDoc(doc(db, ADMIN_USERS_COLLECTION, defaultComercial.id), defaultComercial);
      list.push(defaultComercial);
    }

    return list;
  })();
  return withTimeout(fetchPromise, 20000, []);
}

// Save or update an admin user in Firestore
export async function saveAdminUser(user: AdminUser): Promise<void> {
  const cleanUsername = user.username.toLowerCase().trim();
  const docRef = doc(db, ADMIN_USERS_COLLECTION, cleanUsername);
  user.id = cleanUsername;
  await setDoc(docRef, user, { merge: true });
}

// Delete an admin user from Firestore
export async function deleteAdminUser(id: string): Promise<void> {
  await deleteDoc(doc(db, ADMIN_USERS_COLLECTION, id));
}

// Verify login with username and passcode
export async function verifyAdminLogin(username: string, passcode: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  const normalizedUsername = (username || 'admin').toLowerCase().trim();
  const cleanPasscode = (passcode || '').trim();

  // Master credentials
  const isMasterPasscode = ['gpa2026', 'admin@gpa', 'gpa'].includes(cleanPasscode);
  const isMasterUser = normalizedUsername === 'admin' || normalizedUsername === 'gpa2026' || normalizedUsername === '';

  const defaultMasterUser: AdminUser = {
    id: 'admin',
    username: 'admin',
    passcode: 'gpa2026',
    name: 'Administrador Principal',
    role: 'owner',
    status: 'active',
    permissions: {
      editGeneral: true,
      editProducts: true,
      editPartners: true,
      editPortfolio: true,
      editGallery: true,
      viewQuotes: true,
      manageAdmins: true,
      canManageConfig: true,
      canManageProducts: true,
      canManageCategories: true,
      canManageServices: true,
      canManageGallery: true,
      canManageQuotes: true,
      canManageUsers: true,
    },
    isOnline: true
  };

  const defaultCommercialUser: AdminUser = {
    id: 'comercial 1',
    username: 'comercial 1',
    passcode: 'dtp',
    name: 'Comercial 1',
    role: 'staff',
    status: 'active',
    permissions: {
      editGeneral: false,
      editProducts: false,
      editPartners: false,
      editPortfolio: false,
      editGallery: false,
      viewQuotes: true,
      manageAdmins: false
    },
    whatsappNumber: '+244 994 943 828',
    isOnline: true
  };

  try {
    const fetchDoc = async () => {
      const docRef = doc(db, ADMIN_USERS_COLLECTION, normalizedUsername);
      const snap = await getDoc(docRef);
      return snap;
    };

    const snap = await withTimeout(fetchDoc(), 3000, null as any);

    if (snap && typeof snap.exists === 'function' && snap.exists()) {
      const user = { id: snap.id, ...snap.data() } as AdminUser;
      if (user.passcode === cleanPasscode || (isMasterUser && isMasterPasscode)) {
        const result = await handleAdminStatusAndExpiry(user);
        if (result.success && result.user) {
          result.user.isOnline = true;
          try { await saveAdminUser(result.user); } catch (e) {}
        }
        return result;
      }
      return { success: false, error: 'Código de acesso incorreto.' };
    }

    // If document doesn't exist in Firestore, check allAdmins / cached admins list
    try {
      const allAdmins = await getAdminUsers();
      const matched = allAdmins.find(u => 
        (u.username?.toLowerCase().trim() === normalizedUsername && u.passcode?.trim() === cleanPasscode) ||
        (u.passcode?.trim() === cleanPasscode && (normalizedUsername === 'admin' || !normalizedUsername))
      );
      if (matched) {
        const result = await handleAdminStatusAndExpiry(matched);
        if (result.success && result.user) {
          result.user.isOnline = true;
          try { await saveAdminUser(result.user); } catch (e) {}
        }
        return result;
      }
    } catch (e) {}

    // Check hardcoded defaults
    if (isMasterUser && isMasterPasscode) {
      return { success: true, user: defaultMasterUser };
    }
    if ((normalizedUsername === 'comercial 1' || normalizedUsername === 'comercial') && cleanPasscode === 'dtp') {
      return { success: true, user: defaultCommercialUser };
    }

    return { success: false, error: 'Utilizador ou código de acesso incorretos.' };
  } catch (err) {
    console.warn('Firebase login attempt fallback:', err);
    if (isMasterUser && isMasterPasscode) {
      return { success: true, user: defaultMasterUser };
    }
    if ((normalizedUsername === 'comercial 1' || normalizedUsername === 'comercial') && cleanPasscode === 'dtp') {
      return { success: true, user: defaultCommercialUser };
    }
    return { success: false, error: 'Utilizador ou código incorretos.' };
  }
}

// Helper to check status, block or silence expiration, and save the updated status if needed
async function handleAdminStatusAndExpiry(user: AdminUser): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  const now = new Date();
  
  // Check if blocked and if expiration has passed
  if (user.status === 'blocked') {
    if (user.blockExpiresAt) {
      const expiry = new Date(user.blockExpiresAt);
      if (now > expiry) {
        // Expiration passed! Lift block
        user.status = 'active';
        user.blockExpiresAt = null;
        await saveAdminUser(user);
      } else {
        const formattedDate = expiry.toLocaleString('pt-PT');
        return { success: false, error: `Esta conta está bloqueada temporariamente até ${formattedDate}.` };
      }
    } else {
      return { success: false, error: 'Esta conta está bloqueada permanentemente. Contacte o Administrador Principal.' };
    }
  }
  
  // Check if silenced and if expiration has passed
  if (user.status === 'silenced' && user.silenceExpiresAt) {
    const expiry = new Date(user.silenceExpiresAt);
    if (now > expiry) {
      // Expiration passed! Lift silence
      user.status = 'active';
      user.silenceExpiresAt = null;
      await saveAdminUser(user);
    }
  }
  
  return { success: true, user };
}

/**
 * --- CHATBOT ASSISTANT CONVERSATION PERSISTENCE ---
 * Stores chat interactions in Firestore to allow commercial users to monitor chatbot messages in real-time.
 */
export async function saveAssistantChatSession(session: AssistantChatSession): Promise<void> {
  const chatDocRef = doc(db, ASSISTANT_CHATS_COLLECTION, session.id);
  await setDoc(chatDocRef, session, { merge: true });
}

export function subscribeAssistantChats(callback: (chats: AssistantChatSession[]) => void): () => void {
  const chatsRef = collection(db, ASSISTANT_CHATS_COLLECTION);
  return onSnapshot(chatsRef, (snap) => {
    const list: AssistantChatSession[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as AssistantChatSession);
    });
    // Sort by last active so newest is first
    const sorted = list.sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());
    callback(sorted);
  }, (err) => {
    console.error('Real-time assistant chats sync error:', err);
  });
}

/**
 * --- COMMERCIAL ROUND-ROBIN ROTATION SYSTEM ---
 * Selects the next active and online commercial agent sequentially.
 */
export async function getNextCommercialRotation(): Promise<AdminUser | null> {
  try {
    const admins = await getAdminUsers();
    // Filter active admins that are marked as online and have a whatsapp number configured
    const onlineReps = admins.filter(u => u.status === 'active' && u.isOnline && u.whatsappNumber);
    if (onlineReps.length === 0) return null;
    if (onlineReps.length === 1) return onlineReps[0];

    // Retrieve rotation from DB
    const rotationDocRef = doc(db, CONFIG_COLLECTION, 'commercial_rotation');
    let lastAssignedId = '';
    try {
      const snap = await getDoc(rotationDocRef);
      if (snap.exists()) {
        lastAssignedId = snap.data().lastAssignedId || '';
      }
    } catch (e) {
      console.warn('Error reading commercial rotation state:', e);
    }

    // Sort reps alphabetically by ID to have deterministic ordering
    const sortedReps = [...onlineReps].sort((a, b) => a.id.localeCompare(b.id));
    const lastIndex = sortedReps.findIndex(r => r.id === lastAssignedId);
    let nextIndex = 0;
    if (lastIndex !== -1) {
      nextIndex = (lastIndex + 1) % sortedReps.length;
    }

    const nextRep = sortedReps[nextIndex];

    // Update the rotation document
    try {
      await setDoc(rotationDocRef, { lastAssignedId: nextRep.id }, { merge: true });
    } catch (e) {
      console.warn('Error saving commercial rotation state:', e);
    }

    return nextRep;
  } catch (err) {
    console.error('Error in getNextCommercialRotation:', err);
    return null;
  }
}

/**
 * --- STORE PRODUCTS MANAGEMENT ---
 */
export async function getStoreProducts(): Promise<StoreProduct[]> {
  const cached = localStorage.getItem('gpa_cached_store_products');
  const fallback = cached ? JSON.parse(cached) : DEFAULT_STORE_PRODUCTS;

  const fetchPromise = (async () => {
    try {
      const prodsRef = collection(db, STORE_PRODUCTS_COLLECTION);
      const snap = await getDocs(prodsRef);
      if (!snap.empty) {
        const list: StoreProduct[] = [];
        snap.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as StoreProduct);
        });
        const localList: StoreProduct[] = cached ? JSON.parse(cached) : [];
        const mergedMap = new Map<string, StoreProduct>();
        localList.forEach(p => mergedMap.set(p.id, p));
        list.forEach(p => mergedMap.set(p.id, p));
        const finalProducts = Array.from(mergedMap.values());
        localStorage.setItem('gpa_cached_store_products', JSON.stringify(finalProducts));
        return finalProducts;
      }
    } catch (err) {
      console.warn('Firestore getStoreProducts error:', err);
    }
    return fallback;
  })();

  return withTimeout(fetchPromise, 15000, fallback);
}

export async function addStoreProduct(product: Omit<StoreProduct, 'id'>): Promise<StoreProduct> {
  let docId = 'prod_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  try {
    const prodsRef = collection(db, STORE_PRODUCTS_COLLECTION);
    const docRef = await addDoc(prodsRef, product);
    docId = docRef.id;
  } catch (err) {
    console.warn('Firestore addStoreProduct falhou ou offline. A guardar no cache local:', err);
  }

  const newProduct: StoreProduct = { id: docId, ...product };
  
  // Update local cache
  const cached = localStorage.getItem('gpa_cached_store_products');
  const list: StoreProduct[] = cached ? JSON.parse(cached) : [...DEFAULT_STORE_PRODUCTS];
  const updated = [newProduct, ...list.filter(p => p.id !== docId)];
  localStorage.setItem('gpa_cached_store_products', JSON.stringify(updated));

  return newProduct;
}

export async function updateStoreProduct(id: string, updates: Partial<StoreProduct>): Promise<void> {
  try {
    const docRef = doc(db, STORE_PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (err) {
    console.warn('Firestore updateStoreProduct falhou ou offline. A atualizar cache local:', err);
  }

  // Update local cache
  const cached = localStorage.getItem('gpa_cached_store_products');
  const list: StoreProduct[] = cached ? JSON.parse(cached) : [...DEFAULT_STORE_PRODUCTS];
  const updated = list.map(p => p.id === id ? { ...p, ...updates } : p);
  localStorage.setItem('gpa_cached_store_products', JSON.stringify(updated));
}

export async function deleteStoreProduct(id: string): Promise<void> {
  try {
    const docRef = doc(db, STORE_PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firestore deleteStoreProduct falhou ou offline. A remover do cache local:', err);
  }

  // Update local cache
  const cached = localStorage.getItem('gpa_cached_store_products');
  if (cached) {
    const list: StoreProduct[] = JSON.parse(cached);
    const updated = list.filter(p => p.id !== id);
    localStorage.setItem('gpa_cached_store_products', JSON.stringify(updated));
  }
}

export function subscribeStoreProducts(callback: (products: StoreProduct[]) => void): () => void {
  const prodsRef = collection(db, STORE_PRODUCTS_COLLECTION);
  return onSnapshot(prodsRef, (snap) => {
    const list: StoreProduct[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as StoreProduct);
    });
    if (list.length > 0) {
      const cached = localStorage.getItem('gpa_cached_store_products');
      const localList: StoreProduct[] = cached ? JSON.parse(cached) : [];
      const mergedMap = new Map<string, StoreProduct>();
      localList.forEach(p => mergedMap.set(p.id, p));
      list.forEach(p => mergedMap.set(p.id, p));
      const finalProducts = Array.from(mergedMap.values());
      localStorage.setItem('gpa_cached_store_products', JSON.stringify(finalProducts));
      callback(finalProducts);
    } else {
      const cached = localStorage.getItem('gpa_cached_store_products');
      const fallback = cached ? JSON.parse(cached) : DEFAULT_STORE_PRODUCTS;
      callback(fallback);
    }
  }, (err) => {
    console.error('Real-time store products sync error:', err);
    const cached = localStorage.getItem('gpa_cached_store_products');
    const fallback = cached ? JSON.parse(cached) : DEFAULT_STORE_PRODUCTS;
    callback(fallback);
  });
}


/**
 * --- STORE CATEGORIES ---
 */
export async function getStoreCategories(): Promise<StoreCategory[]> {
  const cached = localStorage.getItem('gpa_cached_store_categories');
  const fallback = cached ? JSON.parse(cached) : DEFAULT_STORE_CATEGORIES;

  const fetchPromise = (async () => {
    try {
      const colRef = collection(db, STORE_CATEGORIES_COLLECTION);
      const snap = await getDocs(colRef);
      const list: StoreCategory[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as StoreCategory);
      });
      if (list.length === 0) {
        return DEFAULT_STORE_CATEGORIES;
      }
      return list;
    } catch (err) {
      console.warn('Firestore getStoreCategories permission/network error, using fallback:', err);
      return fallback;
    }
  })();

  const result = await withTimeout(fetchPromise, 5000, fallback);
  if (result && result.length > 0) {
    try {
      localStorage.setItem('gpa_cached_store_categories', JSON.stringify(result));
    } catch (e) {}
  }
  return result || fallback;
}

export async function saveStoreCategory(category: StoreCategory): Promise<StoreCategory> {
  const id = category.id || `cat_${Date.now()}`;
  const catToSave = { ...category, id };

  try {
    const docRef = doc(db, STORE_CATEGORIES_COLLECTION, id);
    await setDoc(docRef, catToSave, { merge: true });
  } catch (err) {
    console.warn('Firestore saveStoreCategory falhou/offline:', err);
  }

  try {
    const cached = localStorage.getItem('gpa_cached_store_categories');
    const list: StoreCategory[] = cached ? JSON.parse(cached) : [...DEFAULT_STORE_CATEGORIES];
    const idx = list.findIndex(c => c.id === id);
    if (idx >= 0) {
      list[idx] = catToSave;
    } else {
      list.push(catToSave);
    }
    localStorage.setItem('gpa_cached_store_categories', JSON.stringify(list));
  } catch (e) {}
  return catToSave;
}

export async function deleteStoreCategory(id: string): Promise<void> {
  try {
    const docRef = doc(db, STORE_CATEGORIES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firestore deleteStoreCategory falhou/offline:', err);
  }

  try {
    const cached = localStorage.getItem('gpa_cached_store_categories');
    if (cached) {
      const list: StoreCategory[] = JSON.parse(cached);
      const updated = list.filter(c => c.id !== id);
      localStorage.setItem('gpa_cached_store_categories', JSON.stringify(updated));
    }
  } catch (e) {}
}

export function subscribeStoreCategories(callback: (categories: StoreCategory[]) => void): () => void {
  const catsRef = collection(db, STORE_CATEGORIES_COLLECTION);
  return onSnapshot(catsRef, (snap) => {
    const list: StoreCategory[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as StoreCategory);
    });
    if (list.length > 0) {
      try { localStorage.setItem('gpa_cached_store_categories', JSON.stringify(list)); } catch (e) {}
      callback(list);
    } else {
      const cached = localStorage.getItem('gpa_cached_store_categories');
      const fallback = cached ? JSON.parse(cached) : DEFAULT_STORE_CATEGORIES;
      callback(fallback);
    }
  }, (err) => {
    console.warn('Real-time store categories sync error:', err);
    const cached = localStorage.getItem('gpa_cached_store_categories');
    const fallback = cached ? JSON.parse(cached) : DEFAULT_STORE_CATEGORIES;
    callback(fallback);
  });
}

/**
 * --- SERVICES ---
 */
export async function getServicesData(): Promise<Service[]> {
  const cached = localStorage.getItem('gpa_cached_services');
  const fallback = cached ? JSON.parse(cached) : SERVICES;

  const fetchPromise = (async () => {
    try {
      const colRef = collection(db, SERVICES_COLLECTION);
      const snap = await getDocs(colRef);
      const list: Service[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Service);
      });
      if (list.length === 0) {
        return SERVICES;
      }
      return list;
    } catch (err) {
      console.warn('Firestore getServicesData permission/network error, using fallback:', err);
      return fallback;
    }
  })();

  const result = await withTimeout(fetchPromise, 5000, fallback);
  if (result && result.length > 0) {
    try {
      localStorage.setItem('gpa_cached_services', JSON.stringify(result));
    } catch (e) {}
  }
  return result || fallback;
}

export async function saveServiceData(service: Service): Promise<Service> {
  const id = service.id;
  try {
    const docRef = doc(db, SERVICES_COLLECTION, id);
    await setDoc(docRef, service, { merge: true });
  } catch (err) {
    console.warn('Firestore saveServiceData falhou/offline:', err);
  }

  const cached = localStorage.getItem('gpa_cached_services');
  const list: Service[] = cached ? JSON.parse(cached) : [...SERVICES];
  const idx = list.findIndex(s => s.id === id);
  if (idx >= 0) {
    list[idx] = service;
  } else {
    list.push(service);
  }
  localStorage.setItem('gpa_cached_services', JSON.stringify(list));
  return service;
}


