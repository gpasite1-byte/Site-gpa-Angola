import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Settings, 
  Users, 
  Image as ImageIcon, 
  FileText, 
  Check, 
  Trash2, 
  Plus, 
  Save, 
  LogOut, 
  Upload, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Sparkles,
  RefreshCw,
  Search,
  MessageSquare,
  HelpCircle,
  FileSpreadsheet,
  MessageCircle,
  Phone,
  Tag,
  ShoppingBag,
  Package,
  Edit2,
  X
} from 'lucide-react';
import { 
  getSiteConfig, 
  updateSiteConfig, 
  getPartners, 
  savePartner, 
  deletePartner, 
  getGalleryItems, 
  saveGalleryItem, 
  deleteGalleryItem, 
  getFirebaseQuotes, 
  deleteFirebaseQuote, 
  getFirebaseTestimonials, 
  saveFirebaseTestimonial, 
  deleteFirebaseTestimonial,
  verifyAdminPasscode,
  updateAdminPasscode,
  getFirebaseProjects,
  saveFirebaseProject,
  deleteFirebaseProject,
  getStoreProducts,
  addStoreProduct,
  updateStoreProduct,
  deleteStoreProduct,
  subscribeStoreProducts,
  getStoreCategories,
  saveStoreCategory,
  deleteStoreCategory,
  getServicesData,
  saveServiceData,
  SiteConfig,
  Partner,
  GalleryItem,
  getAdminUsers,
  saveAdminUser,
  deleteAdminUser,
  subscribeAssistantChats
} from '../firebaseClient';
import { Testimonial, QuoteRequest, Project, AssistantChatSession, StoreProduct, AdminUser, StoreCategory, Service } from '../types';
import { PROJECTS, DEFAULT_STORE_PRODUCTS, DEFAULT_STORE_CATEGORIES, SERVICES } from '../data';

interface AdminDashboardProps {
  onClose: () => void;
  onRefreshSiteData?: () => void;
  liveProjects?: Project[] | null;
  pageViews?: number;
  videoUrl?: string;
}

interface CustomAdminModule {
  id: string;
  title: string;
  description: string;
  accent: string;
  icon: string;
  enabled: boolean;
  createdAt: string;
}

const DEFAULT_CUSTOM_MODULES: CustomAdminModule[] = [
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
];

export default function AdminDashboard({ onClose, onRefreshSiteData, pageViews = 0, videoUrl }: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Active tab selection
  const [activeTab, setActiveTab] = useState<string>('general');
  const [customModules, setCustomModules] = useState<CustomAdminModule[]>(DEFAULT_CUSTOM_MODULES);
  const [newModuleForm, setNewModuleForm] = useState({
    title: '',
    description: '',
    accent: '#f59e0b',
    icon: '✦'
  });

  // Multi-Admin States
  const [loginUsername, setLoginUsername] = useState('');
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [adminList, setAdminList] = useState<AdminUser[]>([]);
  
  // Create / Edit Admin State
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  
  // Create/Edit form fields
  const [formAdminUsername, setFormAdminUsername] = useState('');
  const [formAdminName, setFormAdminName] = useState('');
  const [formAdminPasscode, setFormAdminPasscode] = useState('');
  const [formAdminRole, setFormAdminRole] = useState<'owner' | 'staff'>('staff');
  const [formAdminStatus, setFormAdminStatus] = useState<'active' | 'blocked' | 'silenced'>('active');
  const [formAdminBlockExpiresAt, setFormAdminBlockExpiresAt] = useState('');
  const [formAdminSilenceExpiresAt, setFormAdminSilenceExpiresAt] = useState('');
  const [formAdminWhatsapp, setFormAdminWhatsapp] = useState('');
  const [formAdminIsOnline, setFormAdminIsOnline] = useState(false);
  const [formAdminPermissions, setFormAdminPermissions] = useState({
    editGeneral: true,
    editProducts: true,
    editPartners: true,
    editPortfolio: true,
    editGallery: true,
    viewQuotes: true,
    manageAdmins: false
  });

  // Loaders
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Firestore States
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    heroTitle: '',
    heroSubtitle: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    videoUrl: '',
    whatsappNumber: '',
    aboutTitle: '',
    aboutSubtitle: '',
    aboutText1: '',
    aboutText2: '',
    aboutHighlightTitle: '',
    aboutHighlightText: '',
    aboutImageUrl: '',
    heroBg1: '',
    heroBg2: '',
    heroBg3: '',
    
    // Newly requested NIF, logo, year fields
    logoUrl: '',
    companyNif: '',
    companyYear: '',

    // Dynamic service rates
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
    rate_stands_unit: 0
  });
  const [partners, setPartners] = useState<Partner[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>([]);
  
  // Store Categories States
  const [storeCategories, setStoreCategories] = useState<StoreCategory[]>(DEFAULT_STORE_CATEGORIES);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<StoreCategory | null>(null);
  const [catForm, setCatForm] = useState<StoreCategory>({
    id: '',
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    iconName: 'Printer',
    badge: ''
  });

  // Services States
  const [servicesList, setServicesList] = useState<Service[]>(SERVICES);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState<Service>({
    id: '',
    title: '',
    iconName: 'Printer',
    description: '',
    fullDescription: '',
    features: [],
    typicalProducts: [],
    imageUrl: '',
    badge: ''
  });
  
  // Store Product Form & Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<StoreProduct | null>(null);
  const [prodSearch, setProdSearch] = useState('');
  const [prodCategoryFilter, setProdCategoryFilter] = useState('all');
  const [prodForm, setProdForm] = useState({
    name: '',
    category: 'impressao',
    price: 100,
    minQty: 1,
    description: '',
    imageUrl: '',
    badge: '',
    inStock: true
  });

  // Editing structures
  const [newPasscode, setNewPasscode] = useState('');
  const [showLoginPasscode, setShowLoginPasscode] = useState(false);
  const [showSecurityPasscode, setShowSecurityPasscode] = useState(false);
  const [quoteSearch, setQuoteSearch] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);

  // Image Upload helper state
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // States for Assistant Chats monitoring
  const [assistantChats, setAssistantChats] = useState<AssistantChatSession[]>([]);
  const [selectedChat, setSelectedChat] = useState<AssistantChatSession | null>(null);

  // Check Local Session for Auth
  useEffect(() => {
    const isAuth = sessionStorage.getItem('gpa_admin_authenticated') === 'true';
    if (isAuth) {
      setIsAuthenticated(true);
      const cached = sessionStorage.getItem('gpa_current_admin');
      if (cached) {
        try {
          setCurrentAdmin(JSON.parse(cached));
        } catch (e) {
          console.warn('Error parsing cached admin user:', e);
        }
      }
      loadAllData();
    }
  }, []);

  useEffect(() => {
    if (siteConfig?.customModules && siteConfig.customModules.length > 0) {
      setCustomModules(siteConfig.customModules);
    }
  }, [siteConfig]);

  // Real-time assistant chats subscription for commercial users
  useEffect(() => {
    let unsubscribeChats: (() => void) | undefined;
    let unsubscribeProducts: (() => void) | undefined;
    if (isAuthenticated) {
      unsubscribeChats = subscribeAssistantChats((chats) => {
        setAssistantChats(chats);
      });
      unsubscribeProducts = subscribeStoreProducts((prods) => {
        setStoreProducts(prods);
      });
    }
    return () => {
      if (unsubscribeChats) unsubscribeChats();
      if (unsubscribeProducts) unsubscribeProducts();
    };
  }, [isAuthenticated]);

  const showStatus = (text: string, isError = false) => {
    setStatusMessage({ text, isError });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsVerifying(true);

    try {
      const targetUser = loginUsername.trim() || 'admin';
      const targetPasscode = passcode.trim();
      const result = await verifyAdminLogin(targetUser, targetPasscode);
      if (result.success && result.user) {
        setIsAuthenticated(true);
        setCurrentAdmin(result.user);
        sessionStorage.setItem('gpa_admin_authenticated', 'true');
        sessionStorage.setItem('gpa_current_admin', JSON.stringify(result.user));
        
        // Setup initial active tab based on permissions
        const hasPerm = (tab: string): boolean => {
          if (result.user?.role === 'owner' || result.user?.role === 'superadmin') return true;
          switch(tab) {
            case 'general': return !!result.user?.permissions?.editGeneral || !!result.user?.permissions?.canManageConfig;
            case 'partners': return !!result.user?.permissions?.editPartners || !!result.user?.permissions?.canManageConfig;
            case 'gallery': return !!result.user?.permissions?.editGallery || !!result.user?.permissions?.canManageGallery;
            case 'portfolio': return !!result.user?.permissions?.editPortfolio || !!result.user?.permissions?.canManageGallery;
            case 'prices': return !!result.user?.permissions?.editProducts || !!result.user?.permissions?.canManageProducts;
            case 'quotes': return !!result.user?.permissions?.viewQuotes || !!result.user?.permissions?.canManageQuotes;
            case 'testimonials': return !!result.user?.permissions?.editPortfolio || !!result.user?.permissions?.canManageGallery;
            case 'admins': return !!result.user?.permissions?.manageAdmins || !!result.user?.permissions?.canManageUsers;
            default: return false;
          }
        };
        
        const allowed = ['general', 'partners', 'gallery', 'portfolio', 'prices', 'quotes', 'testimonials', 'admins'].filter(hasPerm);
        if (allowed.length > 0) {
          setActiveTab(allowed[0] as any);
        }
        
        loadAllData();
      } else {
        setAuthError(result.error || 'Utilizador ou código incorretos.');
      }
    } catch (err) {
      console.warn('Login exception, fallback check:', err);
      const cleanUser = (loginUsername || 'admin').trim().toLowerCase();
      const cleanCode = passcode.trim();
      if ((cleanUser === 'admin' || !cleanUser) && ['gpa2026', 'admin@gpa', 'gpa'].includes(cleanCode)) {
        const masterUser: AdminUser = {
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
            canManageUsers: true
          },
          isOnline: true
        };
        setIsAuthenticated(true);
        setCurrentAdmin(masterUser);
        sessionStorage.setItem('gpa_admin_authenticated', 'true');
        sessionStorage.setItem('gpa_current_admin', JSON.stringify(masterUser));
        loadAllData();
      } else {
        setAuthError('Utilizador ou código incorretos. Utilize utilizador: admin, código: gpa2026.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = async () => {
    if (currentAdmin) {
      try {
        const updated = { ...currentAdmin, isOnline: false };
        await saveAdminUser(updated);
      } catch (e) {
        console.warn('Error setting offline status on logout:', e);
      }
    }
    setIsAuthenticated(false);
    setCurrentAdmin(null);
    sessionStorage.removeItem('gpa_admin_authenticated');
    sessionStorage.removeItem('gpa_current_admin');
  };

  // Load all configurations
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      try {
        const config = await getSiteConfig();
        setSiteConfig(config);
      } catch (e) {
        console.error('Error loading site config:', e);
      }

      try {
        const fetchedPartners = await getPartners();
        setPartners(fetchedPartners);
      } catch (e) {
        console.error('Error loading partners:', e);
      }

      try {
        const fetchedGallery = await getGalleryItems();
        setGallery(fetchedGallery);
      } catch (e) {
        console.error('Error loading gallery:', e);
      }

      try {
        const fetchedQuotes = await getFirebaseQuotes();
        setQuotes(fetchedQuotes);
      } catch (e) {
        console.error('Error loading quotes:', e);
      }

      try {
        const fetchedTestimonials = await getFirebaseTestimonials();
        setTestimonials(fetchedTestimonials);
      } catch (e) {
        console.error('Error loading testimonials:', e);
      }

      try {
        const fetchedProjects = await getFirebaseProjects();
        if (fetchedProjects && fetchedProjects.length > 0) {
          setProjects(fetchedProjects);
        } else {
          setProjects(PROJECTS);
        }
      } catch (e) {
        console.error('Error loading projects:', e);
        setProjects(PROJECTS);
      }

      try {
        const fetchedProducts = await getStoreProducts();
        setStoreProducts(fetchedProducts);
      } catch (e) {
        console.error('Error loading store products:', e);
        setStoreProducts(DEFAULT_STORE_PRODUCTS);
      }

      try {
        const fetchedCategories = await getStoreCategories();
        setStoreCategories(fetchedCategories);
      } catch (e) {
        console.error('Error loading store categories:', e);
        setStoreCategories(DEFAULT_STORE_CATEGORIES);
      }

      try {
        const fetchedServices = await getServicesData();
        setServicesList(fetchedServices);
      } catch (e) {
        console.error('Error loading services list:', e);
        setServicesList(SERVICES);
      }

      // Load administrators list if user is owner / has permission
      try {
        const admins = await getAdminUsers();
        setAdminList(admins);
      } catch (e) {
        console.error('Error loading admin list:', e);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
      showStatus('Erro ao carregar os dados de Firestore', true);
    } finally {
      setIsLoading(false);
    }
  };

  const checkWritePermission = (): boolean => {
    if (!currentAdmin) return false;
    
    // Owner is Admin Principal and has unrestricted access
    if (currentAdmin.role === 'owner') return true;
    
    // Check if blocked
    if (currentAdmin.status === 'blocked') {
      showStatus('Esta conta está bloqueada e não pode efetuar alterações.', true);
      return false;
    }
    
    // Check if silenced
    if (currentAdmin.status === 'silenced') {
      const now = new Date();
      if (currentAdmin.silenceExpiresAt) {
        const expiry = new Date(currentAdmin.silenceExpiresAt);
        if (now < expiry) {
          showStatus(`Utilizador Silenciado! A sua conta está suspensa de escrita até ${expiry.toLocaleString('pt-PT')}.`, true);
          return false;
        }
      } else {
        showStatus('Utilizador Silenciado! Não tem permissão para guardar alterações de momento.', true);
        return false;
      }
    }
    
    return true;
  };

  const handleSaveAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAdmin || currentAdmin.role !== 'owner') {
      showStatus('Apenas o Administrador Principal pode gerir administradores.', true);
      return;
    }
    
    if (!formAdminUsername.trim() || !formAdminName.trim() || !formAdminPasscode.trim()) {
      showStatus('Por favor, preencha todos os campos obrigatórios.', true);
      return;
    }
    
    setIsLoading(true);
    try {
      const payload: AdminUser = {
        id: formAdminUsername.toLowerCase().trim(),
        username: formAdminUsername.toLowerCase().trim(),
        name: formAdminName.trim(),
        passcode: formAdminPasscode.trim(),
        role: formAdminRole,
        status: formAdminStatus,
        blockExpiresAt: formAdminStatus === 'blocked' && formAdminBlockExpiresAt ? new Date(formAdminBlockExpiresAt).toISOString() : null,
        silenceExpiresAt: formAdminStatus === 'silenced' && formAdminSilenceExpiresAt ? new Date(formAdminSilenceExpiresAt).toISOString() : null,
        permissions: formAdminPermissions,
        whatsappNumber: formAdminWhatsapp.trim(),
        isOnline: formAdminIsOnline
      };
      
      await saveAdminUser(payload);
      showStatus(`Administrador ${payload.name} guardado com sucesso!`);
      
      // Reset form
      setIsCreatingAdmin(false);
      setSelectedAdmin(null);
      
      // Reload admins
      const updated = await getAdminUsers();
      setAdminList(updated);
    } catch (err: any) {
      showStatus(`Erro ao salvar administrador: ${err.message}`, true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAdmin = async (id: string, name: string) => {
    if (id === 'admin') {
      showStatus('Não é possível apagar a conta do Administrador Principal.', true);
      return;
    }
    if (!confirm(`Deseja realmente remover o utilizador ${name}?`)) return;
    
    setIsLoading(true);
    try {
      await deleteAdminUser(id);
      showStatus(`Administrador ${name} removido com sucesso.`);
      const updated = await getAdminUsers();
      setAdminList(updated);
    } catch (err: any) {
      showStatus(`Erro ao remover administrador: ${err.message}`, true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAdminClick = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setFormAdminUsername(admin.username);
    setFormAdminName(admin.name);
    setFormAdminPasscode(admin.passcode);
    setFormAdminRole(admin.role);
    setFormAdminStatus(admin.status);
    setFormAdminBlockExpiresAt(admin.blockExpiresAt ? admin.blockExpiresAt.split('T')[0] : '');
    setFormAdminSilenceExpiresAt(admin.silenceExpiresAt ? admin.silenceExpiresAt.split('T')[0] : '');
    setFormAdminPermissions(admin.permissions);
    setFormAdminWhatsapp(admin.whatsappNumber || '');
    setFormAdminIsOnline(admin.isOnline || false);
    setIsCreatingAdmin(true);
  };

  const handleNewAdminClick = () => {
    setSelectedAdmin(null);
    setFormAdminUsername('');
    setFormAdminName('');
    setFormAdminPasscode('');
    setFormAdminRole('staff');
    setFormAdminStatus('active');
    setFormAdminBlockExpiresAt('');
    setFormAdminSilenceExpiresAt('');
    setFormAdminWhatsapp('');
    setFormAdminIsOnline(false);
    setFormAdminPermissions({
      editGeneral: true,
      editProducts: true,
      editPartners: true,
      editPortfolio: true,
      editGallery: true,
      viewQuotes: true,
      manageAdmins: false
    });
    setIsCreatingAdmin(true);
  };

  // Helper to compress images client-side before uploading to Firestore to avoid the 1MB document limit
  const compressImage = (file: File, maxWidth = 600, quality = 0.4): Promise<string> => {
    return new Promise((resolve, reject) => {
      // If it's not an image, resolve with standard reader result
      if (!file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize if width is larger than maxWidth
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert photos/screenshots to JPEG to apply efficient quality compression (<15KB).
          // Only preserve transparent PNG for files explicitly containing 'logo', 'logo-gpa', 'logo_gpa' or 'marca' in their names, or SVG.
          const isLogoOrSvg = file.name.toLowerCase().includes('logo') || file.name.toLowerCase().includes('marca') || file.type.includes('svg');
          const outputType = isLogoOrSvg ? 'image/png' : 'image/jpeg';
          const finalQuality = isLogoOrSvg ? undefined : quality;
          
          const compressedBase64 = canvas.toDataURL(outputType, finalQuality);
          resolve(compressedBase64);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // Helper to upload image either via ImgBB API (if configured) or optimized client compression
  const uploadImageCloud = async (file: File): Promise<string> => {
    const apiKey = localStorage.getItem('gpa_imgbb_api_key') || siteConfig?.imgbbApiKey || '4714d428c9a98b9354b9fec028184ea9';
    if (apiKey) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data && data.success && data.data && data.data.url) {
          return data.data.url;
        }
      } catch (e) {
        console.warn('Upload via ImgBB API falhou. A utilizar fallback de otimização local:', e);
      }
    }
    // Fallback: local compression to Base64
    return await compressImage(file);
  };

  // File to cloud/base64 converter helper
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, onComplete: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress('A processar e enviar imagem para a nuvem...');
    try {
      const resultUrl = await uploadImageCloud(file);
      onComplete(resultUrl);
      showStatus('Imagem carregada e guardada com sucesso!');
    } catch (err) {
      console.error(err);
      showStatus('Erro ao processar imagem', true);
    } finally {
      setUploadProgress(null);
    }
  };

  // Multi-file to cloud/base64 converter helper for Production Gallery
  const handleMultiFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadProgress(`A carregar ${files.length} fotos para a nuvem...`);
    const newItems: GalleryItem[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const resultUrl = await uploadImageCloud(file);
        newItems.push({
          id: 'gallery_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
          imageUrl: resultUrl,
          caption: file.name.split('.')[0] || 'Foto do processo de fabrico GPA',
          order: gallery.length + i
        });
      }
      setGallery((prev) => [...prev, ...newItems]);
      showStatus(`${newItems.length} fotos carregadas simultaneamente com sucesso! Clique em 'Guardar Tudo' para salvar permanentemente.`);
    } catch (err) {
      console.error(err);
      showStatus('Erro ao processar ficheiros múltiplos', true);
    } finally {
      setUploadProgress(null);
    }
  };

  // Multi-file to base64 converter helper for Portfolio Projects
  const handleMultiProjectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadProgress(`A processar e otimizar ${files.length} projetos...`);
    const newProjects: Project[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressed = await compressImage(file);
        newProjects.push({
          id: 'proj_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
          title: file.name.split('.')[0] || 'Novo Projeto',
          category: 'stands',
          categoryLabel: 'Stands & Exposições',
          client: 'Nome do Cliente',
          year: new Date().getFullYear().toString(),
          description: 'Breve descrição do projeto realizado pela GPA Angola.',
          image: compressed,
          details: [
            { label: 'Desafio', value: 'Desafio proposto pelo cliente para a GPA superar.' },
            { label: 'Solução', value: 'A nossa solução industrial para garantir um excelente resultado.' },
            { label: 'Impacto', value: 'O impacto positivo que este projeto gerou.' },
            { label: 'Especificações', value: 'Materiais ou técnicas industriais utilizadas.' }
          ]
        });
      }
      setProjects((prev) => [...prev, ...newProjects]);
      showStatus(`${newProjects.length} novos projetos criados com imagem com sucesso! Clique em 'Guardar Tudo' no Portfólio para salvar permanentemente.`);
    } catch (err) {
      console.error(err);
      showStatus('Erro ao processar projetos múltiplos', true);
    } finally {
      setUploadProgress(null);
    }
  };

  // Short video upload helper (max 2MB, warning issued)
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showStatus('Ficheiro de vídeo muito grande! O Firestore limita o tamanho máximo de todo o documento de configuração em 1MB. Recomendamos vivamente vídeos curtos/comprimidos (como loops de 5-10s) ou o uso de links do YouTube.', true);
      return;
    }

    setUploadProgress('A codificar vídeo...');
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setSiteConfig({ ...siteConfig, videoUrl: reader.result as string });
      setUploadProgress(null);
      showStatus('Vídeo carregado com sucesso! Lembre-se de salvar as configurações para guardar.');
    };
    reader.onerror = () => {
      setUploadProgress(null);
      showStatus('Erro ao carregar o vídeo.', true);
    };
  };

  // 1. General Config Save
  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkWritePermission()) return;
    setIsLoading(true);
    try {
      await updateSiteConfig(siteConfig);
      showStatus('Definições gerais guardadas com sucesso!');
      if (onRefreshSiteData) onRefreshSiteData();
    } catch (err) {
      showStatus('Erro ao guardar as definições', true);
    } finally {
      setIsLoading(false);
    }
  };

  // 1.5. Product Prices & Min Quantities Save
  const handleUpdateProductPrice = (productName: string, price: number) => {
    const updatedPrices = { ...(siteConfig.productPrices || {}), [productName]: price };
    setSiteConfig({ ...siteConfig, productPrices: updatedPrices });
  };

  const handleUpdateProductMinQty = (productName: string, minQty: number) => {
    const updatedMinQtys = { ...(siteConfig.productMinQtys || {}), [productName]: minQty };
    setSiteConfig({ ...siteConfig, productMinQtys: updatedMinQtys });
  };

  const handleUpdateProductImage = (productName: string, imageUrl: string) => {
    const updatedImages = { ...(siteConfig.productImages || {}), [productName]: imageUrl };
    setSiteConfig({ ...siteConfig, productImages: updatedImages });
  };

  const handleSaveProductPricesAndMinQtys = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkWritePermission()) return;
    setIsLoading(true);
    try {
      await updateSiteConfig(siteConfig);
      showStatus('Tabela de Preços & Mínimos atualizados com sucesso!');
      if (onRefreshSiteData) onRefreshSiteData();
    } catch (err) {
      console.error(err);
      showStatus('Erro ao guardar os preços', true);
    } finally {
      setIsLoading(false);
    }
  };

  // Category Management Handlers
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCatForm({
      id: '',
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      iconName: 'Printer',
      badge: ''
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: StoreCategory) => {
    setEditingCategory(cat);
    setCatForm(cat);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkWritePermission()) return;
    setIsLoading(true);
    try {
      const saved = await saveStoreCategory(catForm);
      showStatus(`Categoria "${saved.name}" guardada com sucesso!`);
      const updated = await getStoreCategories();
      setStoreCategories(updated);
      setIsCategoryModalOpen(false);
      if (onRefreshSiteData) onRefreshSiteData();
    } catch (err) {
      showStatus('Erro ao guardar categoria', true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategoryItem = async (id: string, name: string) => {
    if (!confirm(`Tem a certeza que deseja eliminar a categoria "${name}"?`)) return;
    if (!checkWritePermission()) return;
    setIsLoading(true);
    try {
      await deleteStoreCategory(id);
      showStatus(`Categoria "${name}" eliminada.`);
      const updated = await getStoreCategories();
      setStoreCategories(updated);
    } catch (err) {
      showStatus('Erro ao eliminar categoria', true);
    } finally {
      setIsLoading(false);
    }
  };

  // Service Management Handlers
  const handleOpenEditService = (srv: Service) => {
    setEditingService(srv);
    setServiceForm(srv);
    setIsServiceModalOpen(true);
  };

  const handleSaveServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkWritePermission()) return;
    setIsLoading(true);
    try {
      await saveServiceData(serviceForm);
      showStatus(`Serviço "${serviceForm.title}" atualizado com sucesso!`);
      const updated = await getServicesData();
      setServicesList(updated);
      setIsServiceModalOpen(false);
      if (onRefreshSiteData) onRefreshSiteData();
    } catch (err) {
      showStatus('Erro ao guardar serviço', true);
    } finally {
      setIsLoading(false);
    }
  };

  // Admin User Handlers
  const handleNewAdminUserClick = () => {
    setSelectedAdmin(null);
    setFormAdminUsername('');
    setFormAdminName('');
    setFormAdminPasscode('');
    setFormAdminRole('staff' as any);
    setFormAdminPermissions({
      canManageConfig: true,
      canManageProducts: true,
      canManageCategories: true,
      canManageServices: true,
      canManageGallery: true,
      canManageQuotes: true,
      canManageUsers: false,
      editGeneral: true,
      editProducts: true,
      editPartners: true,
      editPortfolio: true,
      editGallery: true,
      viewQuotes: true,
      manageAdmins: false
    } as any);
    setIsCreatingAdmin(true);
  };

  const handleEditAdminUserClick = (user: AdminUser) => {
    setSelectedAdmin(user);
    setFormAdminUsername(user.username);
    setFormAdminName(user.name);
    setFormAdminPasscode(user.passcode);
    setFormAdminRole(user.role as any);
    setFormAdminPermissions((user.permissions as any) || {
      canManageConfig: true,
      canManageProducts: true,
      canManageCategories: true,
      canManageServices: true,
      canManageGallery: true,
      canManageQuotes: true,
      canManageUsers: false
    });
    setIsCreatingAdmin(true);
  };

  const handleDeleteAdminUserItem = async (id: string, name: string) => {
    if (!confirm(`Tem a certeza que deseja eliminar o utilizador "${name}"?`)) return;
    if (!checkWritePermission()) return;
    setIsLoading(true);
    try {
      await deleteAdminUser(id);
      showStatus(`Utilizador "${name}" removido.`);
      const updated = await getAdminUsers();
      setAdminList(updated);
    } catch (err) {
      showStatus('Erro ao eliminar utilizador', true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAdminClick = handleEditAdminUserClick;
  const handleDeleteAdmin = handleDeleteAdminUserItem;

  const handleSaveAdminUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAdminUsername.trim() || !formAdminName.trim() || !formAdminPasscode.trim()) {
      showStatus('Preencha todos os campos do utilizador', true);
      return;
    }
    setIsLoading(true);
    try {
      const cleanUser = formAdminUsername.trim().toLowerCase().replace(/^@/, '');
      const userToSave: AdminUser = {
        id: selectedAdmin ? selectedAdmin.id : cleanUser,
        name: formAdminName.trim(),
        username: cleanUser,
        passcode: formAdminPasscode.trim(),
        role: formAdminRole as any,
        active: true,
        status: formAdminStatus || 'active',
        whatsappNumber: formAdminWhatsapp || '',
        isOnline: formAdminIsOnline,
        blockExpiresAt: formAdminBlockExpiresAt || null,
        silenceExpiresAt: formAdminSilenceExpiresAt || null,
        createdAt: selectedAdmin?.createdAt || new Date().toISOString(),
        permissions: {
          canManageConfig: (formAdminPermissions as any).canManageConfig ?? true,
          canManageProducts: (formAdminPermissions as any).canManageProducts ?? true,
          canManageCategories: (formAdminPermissions as any).canManageCategories ?? true,
          canManageServices: (formAdminPermissions as any).canManageServices ?? true,
          canManageGallery: (formAdminPermissions as any).canManageGallery ?? true,
          canManageQuotes: (formAdminPermissions as any).canManageQuotes ?? true,
          canManageUsers: (formAdminPermissions as any).canManageUsers ?? false,
          editGeneral: (formAdminPermissions as any).canManageConfig ?? true,
          editProducts: (formAdminPermissions as any).canManageProducts ?? true,
          editPartners: (formAdminPermissions as any).canManageConfig ?? true,
          editPortfolio: (formAdminPermissions as any).canManageGallery ?? true,
          editGallery: (formAdminPermissions as any).canManageGallery ?? true,
          viewQuotes: (formAdminPermissions as any).canManageQuotes ?? true,
          manageAdmins: (formAdminPermissions as any).canManageUsers ?? false
        }
      };

      const savedUser = await saveAdminUser(userToSave);
      showStatus(`Utilizador "${userToSave.name}" guardado com sucesso! Código: ${userToSave.passcode}`);
      const updatedAdmins = await getAdminUsers();
      setAdminList(updatedAdmins);
      setIsCreatingAdmin(false);
      setSelectedAdmin(null);
      setFormAdminUsername('');
      setFormAdminName('');
      setFormAdminPasscode('');
    } catch (err) {
      console.error('Error saving admin user:', err);
      showStatus('Erro ao guardar utilizador admin', true);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Partner Management Actions
  const handleAddPartner = () => {
    const newP: Partner = {
      id: 'partner_' + Date.now(),
      name: 'Novo Parceiro',
      logoText: 'NOVO',
      imageUrl: '',
      order: partners.length + 1
    };
    setPartners([...partners, newP]);
  };

  const handleUpdatePartnerField = (index: number, field: keyof Partner, value: any) => {
    const updated = [...partners];
    updated[index] = { ...updated[index], [field]: value };
    setPartners(updated);
  };

  const handleSavePartners = async () => {
    if (!checkWritePermission()) return;
    setIsLoading(true);
    try {
      for (const p of partners) {
        await savePartner(p);
      }
      showStatus('Parceiros / Logótipos atualizados em tempo real!');
      if (onRefreshSiteData) onRefreshSiteData();
    } catch (err) {
      showStatus('Erro ao guardar marcas parceiras', true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePartner = async (id: string, index: number) => {
    if (!confirm('Deseja mesmo remover esta marca parceira?')) return;
    if (!checkWritePermission()) return;
    setIsLoading(true);
    try {
      await deletePartner(id);
      const updated = partners.filter((_, idx) => idx !== index);
      setPartners(updated);
      showStatus('Marca parceira removida!');
      if (onRefreshSiteData) onRefreshSiteData();
    } catch (err) {
      showStatus('Erro ao remover marca', true);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Gallery Management Actions
  const handleAddGalleryItem = () => {
    const newItem: GalleryItem = {
      id: 'gallery_' + Date.now(),
      imageUrl: 'https://i.ibb.co/WWg9Y8mv/702077333-1456320736511584-7030095664157279059-n.jpg',
      caption: 'Nova foto do processo de fabrico GPA',
      order: gallery.length
    };
    setGallery([...gallery, newItem]);
  };

  const handleUpdateGalleryField = (index: number, field: keyof GalleryItem, value: any) => {
    const updated = [...gallery];
    updated[index] = { ...updated[index], [field]: value };
    setGallery(updated);
  };

  const handleSaveGallery = async () => {
    if (!checkWritePermission()) return;
    setIsLoading(true);
    try {
      for (const item of gallery) {
        await saveGalleryItem(item);
      }
      showStatus('Galeria de fotos atualizada com sucesso!');
      if (onRefreshSiteData) onRefreshSiteData();
    } catch (err) {
      showStatus('Erro ao guardar fotos da galeria', true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGallery = async (id: string, index: number) => {
    if (!confirm('Deseja remover esta imagem da galeria industrial?')) return;
    if (!checkWritePermission()) return;
    setIsLoading(true);
    try {
      await deleteGalleryItem(id);
      const updated = gallery.filter((_, idx) => idx !== index);
      setGallery(updated);
      showStatus('Foto removida!');
      if (onRefreshSiteData) onRefreshSiteData();
    } catch (err) {
      showStatus('Erro ao remover foto', true);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Testimonials Actions
  const handleUpdateTestimonial = async (t: Testimonial) => {
    if (!checkWritePermission()) return;
    try {
      await saveFirebaseTestimonial(t);
      showStatus('Depoimento guardado!');
      loadAllData();
    } catch (err) {
      showStatus('Erro ao salvar depoimento', true);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Deseja apagar este depoimento?')) return;
    if (!checkWritePermission()) return;
    try {
      await deleteFirebaseTestimonial(id);
      showStatus('Depoimento removido.');
      loadAllData();
    } catch (err) {
      showStatus('Erro ao remover depoimento', true);
    }
  };

  // 4.5. Portfolio Management Actions
  const handleAddProject = () => {
    const newP: Project = {
      id: 'project_' + Date.now(),
      title: 'Novo Caso de Sucesso',
      category: 'stands',
      categoryLabel: 'Stands & Exposições',
      client: 'Nome do Cliente',
      year: '2026',
      description: 'Breve descrição do projeto realizado pela GPA Angola.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
      details: [
        { label: 'Desafio', value: 'Desafio proposto pelo cliente para a GPA superar.' },
        { label: 'Solução', value: 'A nossa solução industrial para garantir um excelente resultado.' },
        { label: 'Impacto', value: 'O impacto positivo que este projeto gerou.' },
        { label: 'Especificações', value: 'Materiais ou técnicas industriais utilizadas.' }
      ]
    };
    setProjects([...projects, newP]);
  };

  const handleUpdateProjectField = (index: number, field: keyof Project, value: any) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };

  const handleUpdateProjectDetailsField = (index: number, detailIndex: number, detailField: 'label' | 'value', value: string) => {
    const updated = [...projects];
    const details = [...(updated[index].details || [])];
    if (details[detailIndex]) {
      details[detailIndex] = { ...details[detailIndex], [detailField]: value };
    } else {
      details[detailIndex] = { label: detailField === 'label' ? value : '', value: detailField === 'value' ? value : '' };
    }
    updated[index] = { ...updated[index], details };
    setProjects(updated);
  };

  const handleSaveProjects = async () => {
    if (!checkWritePermission()) return;
    setIsLoading(true);
    try {
      console.log('Salvando projetos no Firestore:', projects);
      for (const p of projects) {
        if (!p.id) {
          p.id = 'proj_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        }
        await saveFirebaseProject(p);
      }
      showStatus('Todos os projetos do Portfólio de Sucesso foram salvos com sucesso!');
      if (onRefreshSiteData) onRefreshSiteData();
    } catch (err: any) {
      console.error('Erro ao salvar projetos do portfólio no Firestore:', err);
      showStatus(`Erro ao salvar os projetos do portfólio: ${err.message || 'Tamanho da imagem excedeu o limite'}`, true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (id: string, index: number) => {
    if (!confirm('Deseja realmente apagar este projeto do portfólio de sucesso?')) return;
    if (!checkWritePermission()) return;
    setIsLoading(true);
    try {
      await deleteFirebaseProject(id);
      const updated = projects.filter((_, idx) => idx !== index);
      setProjects(updated);
      showStatus('Projeto removido com sucesso!');
      if (onRefreshSiteData) onRefreshSiteData();
    } catch (err) {
      showStatus('Erro ao remover projeto', true);
    } finally {
      setIsLoading(false);
    }
  };

  // 4.6. Store Product Management Actions
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdForm({
      name: '',
      category: 'impressao',
      price: 100,
      minQty: 1,
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1589149098258-3e9102ca63d3?auto=format&fit=crop&w=600&q=80',
      badge: '',
      inStock: true
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: StoreProduct) => {
    setEditingProduct(prod);
    setProdForm({
      name: prod.name,
      category: prod.category || 'impressao',
      price: prod.price || 0,
      minQty: prod.minQty || 1,
      description: prod.description || '',
      imageUrl: prod.imageUrl || '',
      badge: prod.badge || '',
      inStock: prod.inStock !== false
    });
    setIsProductModalOpen(true);
  };

  const handleSaveStoreProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkWritePermission()) return;
    setIsLoading(true);

    try {
      if (editingProduct) {
        // Update existing product
        await updateStoreProduct(editingProduct.id, {
          name: prodForm.name,
          category: prodForm.category,
          price: Number(prodForm.price),
          minQty: Number(prodForm.minQty),
          description: prodForm.description,
          imageUrl: prodForm.imageUrl,
          badge: prodForm.badge,
          inStock: prodForm.inStock
        });
        setStoreProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? { ...p, ...prodForm } : p))
        );
        showStatus('Produto atualizado com sucesso!');
      } else {
        // Add new product
        const newProduct = await addStoreProduct({
          name: prodForm.name,
          category: prodForm.category,
          price: Number(prodForm.price),
          minQty: Number(prodForm.minQty),
          description: prodForm.description,
          imageUrl: prodForm.imageUrl,
          badge: prodForm.badge,
          inStock: prodForm.inStock
        });
        setStoreProducts((prev) => [newProduct, ...prev]);
        showStatus('Novo produto adicionado à loja online!');
      }
      setIsProductModalOpen(false);
      if (onRefreshSiteData) onRefreshSiteData();
    } catch (err: any) {
      console.error('Erro ao guardar produto da loja:', err);
      showStatus(`Erro ao guardar produto: ${err.message || 'Tente novamente'}`, true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStoreProduct = async (id: string, name: string) => {
    if (!confirm(`Deseja realmente apagar o produto "${name}" da loja online?`)) return;
    if (!checkWritePermission()) return;
    setIsLoading(true);
    try {
      await deleteStoreProduct(id);
      setStoreProducts((prev) => prev.filter((p) => p.id !== id));
      showStatus('Produto removido da loja online!');
      if (onRefreshSiteData) onRefreshSiteData();
    } catch (err) {
      showStatus('Erro ao remover produto', true);
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Quote Actions
  const handleDeleteQuote = async (id: string) => {
    if (!confirm('Deseja apagar este pedido do histórico permanente?')) return;
    if (!checkWritePermission()) return;
    try {
      await deleteFirebaseQuote(id);
      showStatus('Pedido de orçamento apagado.');
      setSelectedQuote(null);
      loadAllData();
    } catch (err) {
      showStatus('Erro ao apagar pedido', true);
    }
  };

  // 6. Security Save
  const handleUpdateSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasscode.trim()) {
      showStatus('O código não pode ser vazio', true);
      return;
    }
    setIsLoading(true);
    try {
      await updateAdminPasscode(newPasscode);
      showStatus('Código de acesso administrativo atualizado!');
      setNewPasscode('');
    } catch (err) {
      showStatus('Erro ao atualizar o código de acesso', true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCustomModule = async () => {
    if (!newModuleForm.title.trim()) {
      showStatus('Indique um nome para o novo módulo.', true);
      return;
    }

    const newModule: CustomAdminModule = {
      id: `${newModuleForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
      title: newModuleForm.title.trim(),
      description: newModuleForm.description.trim() || 'Novo módulo administrativo do site.',
      accent: newModuleForm.accent,
      icon: newModuleForm.icon.trim() || '✦',
      enabled: true,
      createdAt: new Date().toISOString()
    };

    const updated = [...customModules, newModule];
    setCustomModules(updated);
    setSiteConfig({ ...siteConfig, customModules: updated });
    setNewModuleForm({ title: '', description: '', accent: '#f59e0b', icon: '✦' });
    setActiveTab(newModule.id);
    showStatus(`Módulo "${newModule.title}" criado com sucesso.`);
  };

  const handleSaveCustomModules = async () => {
    if (!checkWritePermission()) return;
    setIsLoading(true);
    try {
      const nextConfig = { ...siteConfig, customModules };
      await updateSiteConfig(nextConfig);
      setSiteConfig(nextConfig);
      showStatus('Módulos administrativos guardados com sucesso.');
      if (onRefreshSiteData) onRefreshSiteData();
    } catch (err) {
      showStatus('Erro ao guardar módulos administrativos.', true);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCustomModule = (moduleId: string) => {
    setCustomModules((prev) => prev.map((module) =>
      module.id === moduleId ? { ...module, enabled: !module.enabled } : module
    ));
  };

  // Export Quotes as simple CSV representation
  const exportQuotesToCSV = () => {
    if (quotes.length === 0) return;
    const headers = ['ID', 'Cliente', 'Email', 'Telemóvel', 'Serviço ID', 'Produto', 'Quantidade', 'Descrição', 'Urgência', 'Data'];
    const rows = quotes.map(q => [
      q.id,
      q.clientName,
      q.email,
      q.phone,
      q.serviceId || 'N/D',
      q.product || 'N/D',
      q.quantity,
      `"${q.description.replace(/"/g, '""')}"`,
      q.urgency,
      q.timestamp
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `GPA_Angola_Orcamentos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredQuotes = quotes.filter(q => 
    q.clientName.toLowerCase().includes(quoteSearch.toLowerCase()) ||
    q.email.toLowerCase().includes(quoteSearch.toLowerCase()) ||
    q.phone.includes(quoteSearch) ||
    (q.product && q.product.toLowerCase().includes(quoteSearch.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative z-50 overflow-hidden">
      
      {/* Background Video Layer with Dark Overlay for Admin Area */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-cover bg-center">
        <video 
          key={videoUrl || '/GPA/Cinematic_D_animation_seaml.mp4'} 
          className="page-video opacity-30 object-cover w-full h-full" 
          autoPlay 
          muted 
          loop 
          playsInline 
          poster="/GPA/hero_poster.jpg" 
          preload="metadata"
        >
          <source src={videoUrl || '/GPA/Cinematic_D_animation_seaml.mp4'} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.12),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(79,70,229,0.12),transparent_30%)]" />
      </div>

      {/* Visual background ambient gradient lines */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full filter blur-3xl pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-900/5 rounded-full filter blur-3xl pointer-events-none z-0"></div>

      {/* HEADER BAR */}
      <header className="bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_22%),linear-gradient(135deg,#0f172a_0%,#111827_35%,#0b1120_100%)] border-b border-white/10 px-6 py-4 flex justify-between items-center relative z-20 shadow-[0_20px_40px_rgba(15,23,42,0.34)]">
        <div className="flex items-center space-x-3">
          <div className="h-11 w-11 bg-gradient-to-br from-brand-orange to-amber-400 text-white rounded-2xl flex items-center justify-center font-display font-black text-xl tracking-tight shadow-[0_12px_28px_rgba(245,158,11,0.35)]">
            GPA
          </div>
          <div>
            <h1 className="text-white font-display font-bold text-base tracking-wide flex items-center space-x-2">
              <span>Área Administrativa GPA</span>
              <span className="bg-brand-orange/20 text-brand-orange text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border border-brand-orange/30">
                Backend Premium
              </span>
            </h1>
            <p className="text-xs text-slate-400">Gestão centralizada, módulos dinâmicos e edição em tempo real</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {isAuthenticated && (
            <button
              onClick={loadAllData}
              className="text-slate-300 hover:text-white p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-all"
              title="Recarregar dados do Firestore"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-brand-orange to-amber-400 hover:brightness-110 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-[0_12px_24px_rgba(245,158,11,0.35)] cursor-pointer transition-all"
          >
            Voltar ao Site
          </button>
        </div>
      </header>

      {/* LOGIN VIEW */}
      {!isAuthenticated ? (
        <div className="flex-1 flex items-center justify-center p-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-orange via-orange-500 to-amber-500"></div>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6 text-brand-orange" />
              </div>
              <h2 className="text-xl font-display font-bold text-white tracking-wide">Início de Sessão</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Identifique-se para desbloquear a gestão profissional e edição direta do site
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">Utilizador (Username)</label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="admin ou o seu utilizador"
                  className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors placeholder:text-slate-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">Código de Acesso</label>
                <div className="relative">
                  <input
                    type={showLoginPasscode ? "text" : "password"}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Introduza o código de acesso"
                    className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl pl-4 pr-11 py-3 text-sm text-white focus:outline-none transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPasscode(!showLoginPasscode)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title={showLoginPasscode ? "Ocultar Código" : "Mostrar Código"}
                  >
                    {showLoginPasscode ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {authError && (
                <p className="text-xs text-red-400 font-medium bg-red-950/40 border border-red-900/40 rounded-lg p-2.5 text-center">
                  ⚠️ {authError}
                </p>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-3.5 px-4 rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center space-x-2 text-sm"
              >
                {isVerifying ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Aceder ao Painel</span>
                  </>
                )}
              </button>
            </form>

            {/* QUICK PRE-SET ACCOUNTS SELECTOR */}
            <div className="mt-5 pt-4 border-t border-white/10 space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block text-center">
                Acesso Rápido para a Equipa GPA
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => { setLoginUsername('admin'); setPasscode('gpa2026'); }}
                  className="bg-slate-950/80 hover:bg-slate-800 border border-amber-400/20 hover:border-amber-400/60 p-2 rounded-xl text-center cursor-pointer transition-all"
                >
                  <span className="text-[10px] font-bold text-amber-400 block">Principal</span>
                  <span className="text-[9px] font-mono text-slate-400">admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginUsername('gestor'); setPasscode('gpa2026'); }}
                  className="bg-slate-950/80 hover:bg-slate-800 border border-blue-400/20 hover:border-blue-400/60 p-2 rounded-xl text-center cursor-pointer transition-all"
                >
                  <span className="text-[10px] font-bold text-blue-400 block">Gestor Apoio</span>
                  <span className="text-[9px] font-mono text-slate-400">gestor</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginUsername('comercial 1'); setPasscode('dtp'); }}
                  className="bg-slate-950/80 hover:bg-slate-800 border border-emerald-400/20 hover:border-emerald-400/60 p-2 rounded-xl text-center cursor-pointer transition-all"
                >
                  <span className="text-[10px] font-bold text-emerald-400 block">Comercial</span>
                  <span className="text-[9px] font-mono text-slate-400">comercial 1</span>
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-center">
              <span className="text-[10px] text-slate-500 font-mono">
                GPA Angola • Produção Industrial Gráfica e Têxtil em Luanda
              </span>
            </div>
          </motion.div>
        </div>
      ) : (
        /* MAIN DASHBOARD PANEL */
        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          
          {/* SIDEBAR TABS BAR (HIGH VISIBILITY, CONTRAST & FULL MOBILE RESPONSIVENESS) */}
          <aside className="w-full md:w-72 bg-slate-950/95 border-b md:border-b-0 md:border-r border-slate-800/90 flex flex-col justify-between py-2.5 md:py-5 shadow-[4px_0_30px_rgba(0,0,0,0.6)] relative z-20 shrink-0 backdrop-blur-md">
            <div className="px-2 md:px-3.5 flex md:flex-col overflow-x-auto md:overflow-y-auto no-scrollbar gap-1.5 md:space-y-2.5 pb-1 md:pb-0">
              <div className="hidden md:flex px-3 py-1.5 text-[11px] uppercase font-mono font-extrabold text-amber-400 tracking-wider bg-slate-900/90 rounded-lg border border-amber-400/20 shadow-xs items-center justify-between">
                <span>Controlos do Site</span>
                <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
              </div>

              {currentAdmin && (currentAdmin.role === 'owner' || currentAdmin.permissions.editGeneral) && (
                <button
                  onClick={() => setActiveTab('general')}
                  className={`shrink-0 md:w-full flex items-center space-x-2 md:space-x-3 px-3 md:px-3.5 py-2 md:py-3 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer border whitespace-nowrap ${
                    activeTab === 'general' 
                      ? 'bg-gradient-to-r from-brand-orange to-amber-500 text-white shadow-[0_10px_25px_rgba(245,158,11,0.35)] border-amber-400/40 scale-[1.02]' 
                      : 'bg-slate-900/80 text-slate-100 border-slate-800/80 hover:bg-slate-800 hover:text-white hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <Settings className={`w-4.5 h-4.5 ${activeTab === 'general' ? 'text-white' : 'text-amber-400'}`} />
                  <span>Textos & Contactos</span>
                </button>
              )}

              {customModules.filter((module) => module.enabled).map((module) => (
                <button
                  key={module.id}
                  onClick={() => setActiveTab(module.id)}
                  className={`shrink-0 md:w-full flex items-center space-x-2 md:space-x-3 px-3 md:px-3.5 py-2 md:py-3 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer border whitespace-nowrap ${
                    activeTab === module.id 
                      ? 'text-white shadow-[0_10px_25px_rgba(15,23,42,0.4)] border-white/25 scale-[1.02]' 
                      : 'bg-slate-900/80 text-slate-100 border-slate-800/80 hover:bg-slate-800 hover:text-white hover:border-slate-700 shadow-sm'
                  }`}
                  style={activeTab === module.id ? { background: `linear-gradient(135deg, ${module.accent}, rgba(15,23,42,0.9))` } : undefined}
                >
                  <span className="flex h-6 w-6 md:h-7 md:w-7 items-center justify-center rounded-lg border border-white/20 text-xs md:text-sm font-bold shadow-xs" style={{ backgroundColor: `${module.accent}30`, color: module.accent }}>
                    {module.icon}
                  </span>
                  <span className="truncate">{module.title}</span>
                </button>
              ))}

              {currentAdmin && (currentAdmin.role === 'owner' || currentAdmin.permissions.editPartners) && (
                <button
                  onClick={() => setActiveTab('partners')}
                  className={`shrink-0 md:w-full flex items-center space-x-2 md:space-x-3 px-3 md:px-3.5 py-2 md:py-3 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer border whitespace-nowrap ${
                    activeTab === 'partners' 
                      ? 'bg-gradient-to-r from-brand-orange to-amber-500 text-white shadow-[0_10px_25px_rgba(245,158,11,0.35)] border-amber-400/40 scale-[1.02]' 
                      : 'bg-slate-900/80 text-slate-100 border-slate-800/80 hover:bg-slate-800 hover:text-white hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <Users className={`w-4.5 h-4.5 ${activeTab === 'partners' ? 'text-white' : 'text-blue-400'}`} />
                  <span>Marcas Parceiras</span>
                </button>
              )}

              {currentAdmin && (currentAdmin.role === 'owner' || currentAdmin.permissions.editGallery) && (
                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`shrink-0 md:w-full flex items-center space-x-2 md:space-x-3 px-3 md:px-3.5 py-2 md:py-3 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer border whitespace-nowrap ${
                    activeTab === 'gallery' 
                      ? 'bg-gradient-to-r from-brand-orange to-amber-500 text-white shadow-[0_10px_25px_rgba(245,158,11,0.35)] border-amber-400/40 scale-[1.02]' 
                      : 'bg-slate-900/80 text-slate-100 border-slate-800/80 hover:bg-slate-800 hover:text-white hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <ImageIcon className={`w-4.5 h-4.5 ${activeTab === 'gallery' ? 'text-white' : 'text-emerald-400'}`} />
                  <span>Galeria de Produção</span>
                </button>
              )}

              {currentAdmin && (currentAdmin.role === 'owner' || currentAdmin.permissions.editPortfolio) && (
                <button
                  onClick={() => setActiveTab('portfolio')}
                  className={`shrink-0 md:w-full flex items-center space-x-2 md:space-x-3 px-3 md:px-3.5 py-2 md:py-3 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer border whitespace-nowrap ${
                    activeTab === 'portfolio' 
                      ? 'bg-gradient-to-r from-brand-orange to-amber-500 text-white shadow-[0_10px_25px_rgba(245,158,11,0.35)] border-amber-400/40 scale-[1.02]' 
                      : 'bg-slate-900/80 text-slate-100 border-slate-800/80 hover:bg-slate-800 hover:text-white hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <Sparkles className={`w-4.5 h-4.5 ${activeTab === 'portfolio' ? 'text-white' : 'text-purple-400'}`} />
                  <span>Portfólio de Sucesso</span>
                </button>
              )}

              {currentAdmin && (currentAdmin.role === 'owner' || currentAdmin.permissions.editProducts) && (
                <button
                  onClick={() => setActiveTab('prices')}
                  className={`shrink-0 md:w-full flex items-center space-x-2 md:space-x-3 px-3 md:px-3.5 py-2 md:py-3 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer border whitespace-nowrap ${
                    activeTab === 'prices' 
                      ? 'bg-gradient-to-r from-brand-orange to-amber-500 text-white shadow-[0_10px_25px_rgba(245,158,11,0.35)] border-amber-400/40 scale-[1.02]' 
                      : 'bg-slate-900/80 text-slate-100 border-slate-800/80 hover:bg-slate-800 hover:text-white hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <FileSpreadsheet className={`w-4.5 h-4.5 ${activeTab === 'prices' ? 'text-white' : 'text-amber-400'}`} />
                  <span>Preçário & Taxas</span>
                </button>
              )}

              {currentAdmin && (currentAdmin.role === 'owner' || currentAdmin.permissions.editGeneral) && (
                <button
                  onClick={() => setActiveTab('services')}
                  className={`shrink-0 md:w-full flex items-center space-x-2 md:space-x-3 px-3 md:px-3.5 py-2 md:py-3 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer border whitespace-nowrap ${
                    activeTab === 'services' 
                      ? 'bg-gradient-to-r from-brand-orange to-amber-500 text-white shadow-[0_10px_25px_rgba(245,158,11,0.35)] border-amber-400/40 scale-[1.02]' 
                      : 'bg-slate-900/80 text-slate-100 border-slate-800/80 hover:bg-slate-800 hover:text-white hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <Sparkles className={`w-4.5 h-4.5 ${activeTab === 'services' ? 'text-white' : 'text-amber-400'}`} />
                  <span>Serviços & Fotografias</span>
                </button>
              )}

              {currentAdmin && (currentAdmin.role === 'owner' || currentAdmin.permissions.editProducts) && (
                <button
                  onClick={() => setActiveTab('store-products')}
                  className={`shrink-0 md:w-full flex items-center justify-between space-x-2 px-3 md:px-3.5 py-2 md:py-3 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer border whitespace-nowrap ${
                    activeTab === 'store-products' 
                      ? 'bg-gradient-to-r from-brand-orange to-amber-500 text-white shadow-[0_10px_25px_rgba(245,158,11,0.35)] border-amber-400/40 scale-[1.02]' 
                      : 'bg-slate-900/80 text-slate-100 border-slate-800/80 hover:bg-slate-800 hover:text-white hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <ShoppingBag className={`w-4.5 h-4.5 ${activeTab === 'store-products' ? 'text-white' : 'text-amber-400'}`} />
                    <span>Produtos da Loja</span>
                  </div>
                  <span className={`text-[10px] font-mono font-extrabold px-1.5 md:px-2 py-0.5 rounded-full ${activeTab === 'store-products' ? 'bg-white text-brand-orange' : 'bg-brand-orange text-white'}`}>
                    {storeProducts.length}
                  </span>
                </button>
              )}

              {currentAdmin && (currentAdmin.role === 'owner' || currentAdmin.permissions.editProducts) && (
                <button
                  onClick={() => setActiveTab('categories')}
                  className={`shrink-0 md:w-full flex items-center justify-between space-x-2 px-3 md:px-3.5 py-2 md:py-3 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer border whitespace-nowrap ${
                    activeTab === 'categories' 
                      ? 'bg-gradient-to-r from-brand-orange to-amber-500 text-white shadow-[0_10px_25px_rgba(245,158,11,0.35)] border-amber-400/40 scale-[1.02]' 
                      : 'bg-slate-900/80 text-slate-100 border-slate-800/80 hover:bg-slate-800 hover:text-white hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <Tag className={`w-4.5 h-4.5 ${activeTab === 'categories' ? 'text-white' : 'text-orange-400'}`} />
                    <span>Categorias & Capas</span>
                  </div>
                  <span className={`text-[10px] font-mono font-extrabold px-1.5 md:px-2 py-0.5 rounded-full ${activeTab === 'categories' ? 'bg-white text-brand-orange' : 'bg-orange-500 text-white'}`}>
                    {storeCategories.length}
                  </span>
                </button>
              )}

              <div className="hidden md:flex px-3 py-1.5 pt-3 text-[11px] uppercase font-mono font-extrabold text-blue-400 tracking-wider bg-slate-900/90 rounded-lg border border-blue-400/20 shadow-xs items-center justify-between">
                <span>Registos de Clientes</span>
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              </div>

              {currentAdmin && (currentAdmin.role === 'owner' || currentAdmin.permissions.viewQuotes) && (
                <button
                  onClick={() => setActiveTab('quotes')}
                  className={`shrink-0 md:w-full flex items-center justify-between space-x-2 px-3 md:px-3.5 py-2 md:py-3 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer border whitespace-nowrap ${
                    activeTab === 'quotes' 
                      ? 'bg-gradient-to-r from-brand-orange to-amber-500 text-white shadow-[0_10px_25px_rgba(245,158,11,0.35)] border-amber-400/40 scale-[1.02]' 
                      : 'bg-slate-900/80 text-slate-100 border-slate-800/80 hover:bg-slate-800 hover:text-white hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <FileText className={`w-4.5 h-4.5 ${activeTab === 'quotes' ? 'text-white' : 'text-amber-400'}`} />
                    <span>Pedidos de Orçamento</span>
                  </div>
                  {quotes.length > 0 && (
                    <span className={`text-[10px] font-mono font-extrabold px-1.5 md:px-2 py-0.5 rounded-full ${activeTab === 'quotes' ? 'bg-white text-brand-orange' : 'bg-brand-orange text-white'}`}>
                      {quotes.length}
                    </span>
                  )}
                </button>
              )}

              {currentAdmin && (currentAdmin.role === 'owner' || currentAdmin.permissions.editPortfolio) && (
                <button
                  onClick={() => setActiveTab('testimonials')}
                  className={`shrink-0 md:w-full flex items-center space-x-2 md:space-x-3 px-3 md:px-3.5 py-2 md:py-3 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer border whitespace-nowrap ${
                    activeTab === 'testimonials' 
                      ? 'bg-gradient-to-r from-brand-orange to-amber-500 text-white shadow-[0_10px_25px_rgba(245,158,11,0.35)] border-amber-400/40 scale-[1.02]' 
                      : 'bg-slate-900/80 text-slate-100 border-slate-800/80 hover:bg-slate-800 hover:text-white hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <MessageSquare className={`w-4.5 h-4.5 ${activeTab === 'testimonials' ? 'text-white' : 'text-teal-400'}`} />
                  <span>Depoimentos</span>
                </button>
              )}

              {currentAdmin && (currentAdmin.role === 'owner' || currentAdmin.role === 'staff') && (
                <button
                  onClick={() => setActiveTab('comercial')}
                  className={`shrink-0 md:w-full flex items-center space-x-2 md:space-x-3 px-3 md:px-3.5 py-2 md:py-3 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer border whitespace-nowrap ${
                    activeTab === 'comercial' 
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-[0_10px_25px_rgba(16,185,129,0.35)] border-emerald-400/40 scale-[1.02]' 
                      : 'bg-slate-900/80 text-slate-100 border-slate-800/80 hover:bg-slate-800 hover:text-white hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <MessageCircle className={`w-4.5 h-4.5 ${activeTab === 'comercial' ? 'text-white' : 'text-emerald-400'}`} />
                  <span>Atendimento WhatsApp</span>
                </button>
              )}

              <div className="hidden md:flex px-3 py-1.5 pt-3 text-[11px] uppercase font-mono font-extrabold text-purple-400 tracking-wider bg-slate-900/90 rounded-lg border border-purple-400/20 shadow-xs items-center justify-between">
                <span>Definições & Gestão</span>
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
              </div>

              {currentAdmin && (currentAdmin.role === 'owner' || currentAdmin.role === 'superadmin' || currentAdmin.permissions.manageAdmins) && (
                <button
                  onClick={() => setActiveTab('admins')}
                  className={`shrink-0 md:w-full flex items-center space-x-2 md:space-x-3 px-3 md:px-3.5 py-2 md:py-3 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer border whitespace-nowrap ${
                    activeTab === 'admins' 
                      ? 'bg-gradient-to-r from-brand-orange to-amber-500 text-white shadow-[0_10px_25px_rgba(245,158,11,0.35)] border-amber-400/40 scale-[1.02]' 
                      : 'bg-slate-900/80 text-slate-100 border-slate-800/80 hover:bg-slate-800 hover:text-white hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <Users className={`w-4.5 h-4.5 ${activeTab === 'admins' ? 'text-white' : 'text-amber-400'}`} />
                  <span className="font-extrabold">Gestão de Equipa & Admins</span>
                </button>
              )}

              {currentAdmin && (currentAdmin.role === 'owner' || currentAdmin.role === 'superadmin') && (
                <button
                  onClick={() => setActiveTab('security')}
                  className={`shrink-0 md:w-full flex items-center space-x-2 md:space-x-3 px-3 md:px-3.5 py-2 md:py-3 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer border whitespace-nowrap ${
                    activeTab === 'security' 
                      ? 'bg-gradient-to-r from-brand-orange to-amber-500 text-white shadow-[0_10px_25px_rgba(245,158,11,0.35)] border-amber-400/40 scale-[1.02]' 
                      : 'bg-slate-900/80 text-slate-100 border-slate-800/80 hover:bg-slate-800 hover:text-white hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <Lock className={`w-4.5 h-4.5 ${activeTab === 'security' ? 'text-white' : 'text-red-400'}`} />
                  <span>Segurança Geral</span>
                </button>
              )}
            </div>

            <div className="px-3.5 pt-5 border-t border-slate-800/90 space-y-3">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-inner">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-mono font-extrabold text-amber-400">Módulos</span>
                  <button
                    type="button"
                    onClick={handleSaveCustomModules}
                    className="text-[10px] font-extrabold text-brand-orange hover:text-orange-300 transition-colors cursor-pointer bg-brand-orange/10 px-2 py-0.5 rounded-md border border-brand-orange/20"
                  >
                    Guardar
                  </button>
                </div>
                <div className="space-y-2">
                  {customModules.map((module) => (
                    <div key={module.id} className="flex items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-2.5 py-1.5 shadow-xs">
                      <div className="flex items-center gap-2 truncate">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold" style={{ backgroundColor: `${module.accent}25`, color: module.accent }}>{module.icon}</span>
                        <span className="text-xs text-slate-100 font-semibold truncate">{module.title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleCustomModule(module.id)}
                        className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${module.enabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
                      >
                        {module.enabled ? 'Ativo' : 'Off'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono text-slate-200">
                <div className="flex items-center space-x-2 truncate">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  <span className="truncate font-bold text-slate-100">{currentAdmin?.name || 'Administrador'}</span>
                </div>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-brand-orange/20 text-brand-orange font-bold font-mono">
                  {currentAdmin?.role || 'Admin'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-bold text-red-300 bg-red-950/40 border border-red-800/50 hover:bg-red-900/60 hover:text-white transition-all cursor-pointer shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Terminar Sessão</span>
              </button>
            </div>
          </aside>

          {/* CONTENT PANEL BODY */}
          <main className="flex-1 bg-slate-950/85 backdrop-blur-md p-6 md:p-8 overflow-y-auto min-h-0 relative z-10">
            
            {/* Real-time status toast */}
            {statusMessage && (
              <div className={`fixed bottom-6 right-6 z-50 rounded-2xl p-4 shadow-xl border flex items-center space-x-3 font-medium text-xs tracking-wide ${
                statusMessage.isError 
                  ? 'bg-red-950/95 text-red-200 border-red-800' 
                  : 'bg-emerald-950/95 text-emerald-200 border-emerald-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${statusMessage.isError ? 'bg-red-400' : 'bg-emerald-400 animate-ping'}`}></div>
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* Upload progress banner */}
            {uploadProgress && (
              <div className="mb-4 bg-blue-950/60 border border-blue-900/50 p-3 rounded-xl flex items-center space-x-3 text-xs text-blue-200">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                <span>{uploadProgress}</span>
              </div>
            )}

            {isLoading && (
              <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm flex items-center justify-center z-30">
                <div className="text-center space-y-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-brand-orange mx-auto" />
                  <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">A carregar dados do Firebase...</p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: GENERAL SITE SETTINGS */}
            {activeTab === 'general' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <h2 className="text-lg font-display font-bold text-white flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-brand-orange" />
                    <span>Configurações Gerais do Website</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Ajuste os textos de destaque, contactos e links oficiais exibidos em toda a página pública.</p>
                </div>

                {/* ANALYTICS DASHBOARD BENTO - REQUISITO 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 flex items-center space-x-4">
                    <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-xl">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono uppercase text-slate-400 font-bold">Visualizações do Website (Geral)</span>
                      <span className="text-2xl font-black text-white font-display block mt-1">{pageViews.toLocaleString('pt-AO')}</span>
                      <span className="text-[9px] text-slate-500 block leading-tight mt-0.5">Contador em tempo real e anónimo</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 flex items-center space-x-4">
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono uppercase text-slate-400 font-bold">Pedidos de Orçamento permanentemente gravados</span>
                      <span className="text-2xl font-black text-emerald-400 font-display block mt-1">{quotes.length}</span>
                      <span className="text-[9px] text-slate-500 block leading-tight mt-0.5">Sincronizados em tempo real</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 flex items-center space-x-4">
                    <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono uppercase text-slate-400 font-bold">Marcas Parceiras Cadastradas</span>
                      <span className="text-2xl font-black text-purple-400 font-display block mt-1">{partners.length}</span>
                      <span className="text-[9px] text-slate-500 block leading-tight mt-0.5">Deslizando no carrossel do site</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSaveGeneral} className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-5">
                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">Título do Hero (Destaque Principal)</label>
                      <input
                        type="text"
                        value={siteConfig.heroTitle}
                        onChange={(e) => setSiteConfig({ ...siteConfig, heroTitle: e.target.value })}
                        className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">Subtítulo Descritivo</label>
                      <textarea
                        value={siteConfig.heroSubtitle}
                        onChange={(e) => setSiteConfig({ ...siteConfig, heroSubtitle: e.target.value })}
                        rows={3}
                        className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">Telemóvel Oficial</label>
                      <input
                        type="text"
                        value={siteConfig.companyPhone}
                        onChange={(e) => setSiteConfig({ ...siteConfig, companyPhone: e.target.value })}
                        className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">Email Comercial</label>
                      <input
                        type="email"
                        value={siteConfig.companyEmail}
                        onChange={(e) => setSiteConfig({ ...siteConfig, companyEmail: e.target.value })}
                        className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* CUSTOM DYNAMIC CONTACTS MANAGEMENT */}
                  <div className="border border-white/10 bg-slate-900/40 p-4 rounded-xl space-y-3 mt-3">
                    <label className="block text-xs font-mono uppercase text-slate-400 font-bold">Contactos Alternativos (Header & Rodapé)</label>
                    <p className="text-[11px] text-slate-500">Adicione ou remova os números de telefone secundários exibidos no cabeçalho e rodapé do site.</p>
                    
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {(siteConfig.companyPhones || []).map((phone, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-950/80 px-3 py-2 rounded-lg border border-white/5">
                          <span className="text-xs text-white font-mono">{phone}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (siteConfig.companyPhones || []).filter((_, i) => i !== idx);
                              setSiteConfig({ ...siteConfig, companyPhones: updated });
                            }}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-white/5 rounded transition-colors cursor-pointer"
                            title="Remover contacto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        id="new-phone-input"
                        placeholder="Adicionar ex: +244 945 119 409"
                        className="flex-1 bg-slate-950 border border-white/15 focus:border-brand-orange rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition-colors"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = document.getElementById('new-phone-input') as HTMLInputElement;
                            const val = input.value.trim();
                            if (val) {
                              const current = siteConfig.companyPhones || [];
                              if (!current.includes(val)) {
                                setSiteConfig({ ...siteConfig, companyPhones: [...current, val] });
                                input.value = '';
                              }
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById('new-phone-input') as HTMLInputElement;
                          const val = input.value.trim();
                          if (val) {
                            const current = siteConfig.companyPhones || [];
                            if (!current.includes(val)) {
                              setSiteConfig({ ...siteConfig, companyPhones: [...current, val] });
                              input.value = '';
                            }
                          }
                        }}
                        className="bg-brand-orange hover:bg-brand-orange-hover text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">Número de WhatsApp (Apenas Números com Prefixo)</label>
                      <input
                        type="text"
                        value={siteConfig.whatsappNumber}
                        onChange={(e) => setSiteConfig({ ...siteConfig, whatsappNumber: e.target.value })}
                        placeholder="Ex: 244923100200"
                        className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">Vídeo Institucional (YouTube, Direct URL ou Carregamento Local)</label>
                      <input
                        type="text"
                        value={siteConfig.videoUrl}
                        onChange={(e) => setSiteConfig({ ...siteConfig, videoUrl: e.target.value })}
                        placeholder="Ex: https://www.youtube.com/watch?v=... ou /video.mp4"
                        className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                        required
                      />

                      {/* Custom Video File Upload Box */}
                      <div className="mt-3 border border-dashed border-white/10 bg-slate-950/60 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center space-x-3 text-left">
                          <div className="h-10 w-10 rounded bg-slate-900 border border-white/5 flex items-center justify-center text-brand-orange">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-300 block leading-none">Carregar Vídeo do Dispositivo</span>
                            <span className="text-[9px] text-slate-500 mt-0.5 block leading-relaxed max-w-xs">
                              Selecione um vídeo MP4 curto (Máx. 2MB) ou use o campo de texto para links externos.
                            </span>
                          </div>
                        </div>

                        <label className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white cursor-pointer transition-colors flex items-center space-x-1">
                          <span>Escolher Ficheiro</span>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                        💡 <strong>Para vídeos grandes ou de alta qualidade:</strong> Cole o vídeo na pasta <code className="bg-white/5 px-1 py-0.5 rounded font-mono text-slate-300">public/</code> do projeto (ex: <code className="bg-white/5 px-1 py-0.5 rounded font-mono text-slate-300">public/video.mp4</code>) e escreva <code className="bg-white/5 px-1 py-0.5 rounded font-mono text-slate-300">/video.mp4</code> no campo acima!
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">Endereço Físico do Parque Industrial</label>
                    <input
                      type="text"
                      value={siteConfig.companyAddress}
                      onChange={(e) => setSiteConfig({ ...siteConfig, companyAddress: e.target.value })}
                      className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div className="border-t border-white/10 pt-5 mt-5 space-y-4">
                    <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider text-brand-orange">
                      Secção "Sobre Nós" (Quem Somos)
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">Título Curto (Badge)</label>
                        <input
                          type="text"
                          value={siteConfig.aboutTitle}
                          onChange={(e) => setSiteConfig({ ...siteConfig, aboutTitle: e.target.value })}
                          className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">Subtítulo Principal da Secção</label>
                        <input
                          type="text"
                          value={siteConfig.aboutSubtitle}
                          onChange={(e) => setSiteConfig({ ...siteConfig, aboutSubtitle: e.target.value })}
                          className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5">
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">Parágrafo de Descrição 1</label>
                        <textarea
                          value={siteConfig.aboutText1}
                          onChange={(e) => setSiteConfig({ ...siteConfig, aboutText1: e.target.value })}
                          rows={3}
                          className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">Parágrafo de Descrição 2</label>
                        <textarea
                          value={siteConfig.aboutText2}
                          onChange={(e) => setSiteConfig({ ...siteConfig, aboutText2: e.target.value })}
                          rows={3}
                          className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">Cartão Destaque - Título</label>
                        <input
                          type="text"
                          value={siteConfig.aboutHighlightTitle}
                          onChange={(e) => setSiteConfig({ ...siteConfig, aboutHighlightTitle: e.target.value })}
                          className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">Cartão Destaque - Descrição</label>
                        <textarea
                          value={siteConfig.aboutHighlightText}
                          onChange={(e) => setSiteConfig({ ...siteConfig, aboutHighlightText: e.target.value })}
                          rows={2}
                          className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">Imagem Lateral "Sobre Nós" (URL ou Base64)</label>
                      <input
                        type="text"
                        value={siteConfig.aboutImageUrl}
                        onChange={(e) => setSiteConfig({ ...siteConfig, aboutImageUrl: e.target.value })}
                        placeholder="Link da imagem..."
                        className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors mb-3"
                      />

                      <div className="border border-dashed border-white/10 bg-slate-950/60 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          {siteConfig.aboutImageUrl ? (
                            <img
                              src={siteConfig.aboutImageUrl}
                              alt="Sobre Nós"
                              className="h-12 w-16 object-cover bg-white/5 rounded border border-white/10"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="h-12 w-16 rounded bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 text-[9px] font-mono font-bold">
                              Sem Imagem
                            </div>
                          )}
                          <div className="text-left">
                            <span className="text-[10px] font-bold text-slate-300 block leading-none">Substituir Imagem do Sobre Nós</span>
                            <span className="text-[9px] text-slate-500 mt-0.5 block">Recomendado: 800x600 pixels</span>
                          </div>
                        </div>

                        <label className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white cursor-pointer transition-colors flex items-center space-x-1">
                          <Upload className="w-3.5 h-3.5 text-brand-orange" />
                          <span>Carregar Imagem</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, (base64) => setSiteConfig({ ...siteConfig, aboutImageUrl: base64 }))}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* IDENTIDADE DA MARCA (LOGO, NIF, copyright year) */}
                  <div className="border-t border-white/10 pt-5 mt-5 space-y-4">
                    <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider text-brand-orange">
                      Identidade da Empresa & Logomarca
                    </h3>
                    <p className="text-xs text-slate-400">Configure aqui o logótipo principal da empresa, o NIF e o ano de rodapé exibidos publicamente.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">NIF da Empresa</label>
                        <input
                          type="text"
                          value={siteConfig.companyNif || ''}
                          onChange={(e) => setSiteConfig({ ...siteConfig, companyNif: e.target.value })}
                          placeholder="Ex: 5002498223"
                          className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">Ano do Rodapé (Copyright)</label>
                        <input
                          type="text"
                          value={siteConfig.companyYear || ''}
                          onChange={(e) => setSiteConfig({ ...siteConfig, companyYear: e.target.value })}
                          placeholder="Ex: 2026"
                          className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">Províncias Atendidas (Estatística)</label>
                        <input
                          type="number"
                          value={siteConfig.statsProvinciasAtendidas !== undefined ? siteConfig.statsProvinciasAtendidas : 21}
                          onChange={(e) => setSiteConfig({ ...siteConfig, statsProvinciasAtendidas: parseInt(e.target.value) || 0 })}
                          placeholder="Ex: 21"
                          className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">Anos de Experiência (Estatística)</label>
                        <input
                          type="number"
                          value={siteConfig.statsAnosExperiencia !== undefined ? siteConfig.statsAnosExperiencia : 18}
                          onChange={(e) => setSiteConfig({ ...siteConfig, statsAnosExperiencia: parseInt(e.target.value) || 0 })}
                          placeholder="Ex: 18"
                          className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">Logomarca do Cabeçalho (Em Cima) (URL ou Base64)</label>
                      <input
                        type="text"
                        value={siteConfig.logoUrl || ''}
                        onChange={(e) => setSiteConfig({ ...siteConfig, logoUrl: e.target.value })}
                        placeholder="Link da logomarca que aparece no cabeçalho (em cima)..."
                        className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors mb-3"
                      />

                      <div className="border border-dashed border-white/10 bg-slate-950/60 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          {siteConfig.logoUrl ? (
                            <img
                              src={siteConfig.logoUrl}
                              alt="Logótipo GPA"
                              className="h-12 w-28 object-contain bg-white/5 rounded border border-white/10 p-1"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="h-12 w-28 rounded bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 text-[9px] font-mono font-bold">
                              Sem Logótipo
                            </div>
                          )}
                          <div className="text-left">
                            <span className="text-[10px] font-bold text-slate-300 block leading-none">Substituir Logomarca Oficial</span>
                            <span className="text-[9px] text-slate-500 mt-0.5 block">Formatos recomendados: PNG transparente</span>
                          </div>
                        </div>

                        <label className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white cursor-pointer transition-colors flex items-center space-x-1">
                          <Upload className="w-3.5 h-3.5 text-brand-orange" />
                          <span>Carregar Ficheiro</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, (base64) => setSiteConfig({ ...siteConfig, logoUrl: base64 }))}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-5 mt-5">
                      <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">Logomarca do Rodapé (Em Baixo) (URL ou Base64)</label>
                      <input
                        type="text"
                        value={siteConfig.footerLogoUrl || ''}
                        onChange={(e) => setSiteConfig({ ...siteConfig, footerLogoUrl: e.target.value })}
                        placeholder="Link da logomarca que aparece no rodapé (em baixo)..."
                        className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors mb-3"
                      />

                      <div className="border border-dashed border-white/10 bg-slate-950/60 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          {siteConfig.footerLogoUrl ? (
                            <img
                              src={siteConfig.footerLogoUrl}
                              alt="Logótipo GPA Rodapé"
                              className="h-12 w-28 object-contain bg-white/5 rounded border border-white/10 p-1"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="h-12 w-28 rounded bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 text-[9px] font-mono font-bold">
                              Sem Logótipo
                            </div>
                          )}
                          <div className="text-left">
                            <span className="text-[10px] font-bold text-slate-300 block leading-none">Substituir Logomarca do Rodapé</span>
                            <span className="text-[9px] text-slate-500 mt-0.5 block">Formatos recomendados: PNG transparente</span>
                          </div>
                        </div>

                        <label className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white cursor-pointer transition-colors flex items-center space-x-1">
                          <Upload className="w-3.5 h-3.5 text-brand-orange" />
                          <span>Carregar Ficheiro</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, (base64) => setSiteConfig({ ...siteConfig, footerLogoUrl: base64 }))}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* IMAGEM DE FUNDO GLOBAL DO WEBSITE (REQUISITO 5) */}
                  <div className="border-t border-white/10 pt-5 mt-5 space-y-4">
                    <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider text-brand-orange">
                      Marca d'Água / Logomarca de Fundo (Por Baixo do Cabeçalho)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Adicione uma imagem ou logótipo alternativo para servir como marca d'água semi-transparente no fundo do website (por baixo do cabeçalho). A opacidade pode ser regulada para garantir legibilidade ideal.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">Opacidade do Fundo (Ex: 0.1 para 10%, 0.25 para 25%)</label>
                        <input
                          type="number"
                          step="0.05"
                          min="0"
                          max="1"
                          value={siteConfig.bgOpacity ?? 0.1}
                          onChange={(e) => setSiteConfig({ ...siteConfig, bgOpacity: Number(e.target.value) })}
                          placeholder="Ex: 0.1"
                          className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">Regulação por Barra Deslizante</label>
                        <div className="flex items-center space-x-3 h-12">
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={siteConfig.bgOpacity ?? 0.15}
                            onChange={(e) => setSiteConfig({ ...siteConfig, bgOpacity: Number(e.target.value) })}
                            className="flex-1 accent-brand-orange"
                          />
                          <span className="text-sm font-mono text-white font-bold w-12 text-right">
                            {Math.round((siteConfig.bgOpacity ?? 0.15) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">Marca d'Água de Fundo (Por Baixo) (URL ou Base64)</label>
                      <input
                        type="text"
                        value={siteConfig.bgImageUrl || ''}
                        onChange={(e) => setSiteConfig({ ...siteConfig, bgImageUrl: e.target.value })}
                        placeholder="Link para a imagem ou logótipo de fundo (marca d'água)..."
                        className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors mb-3"
                      />

                      <div className="border border-dashed border-white/10 bg-slate-950/60 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          {siteConfig.bgImageUrl ? (
                            <div className="relative h-12 w-16 rounded overflow-hidden border border-white/10 bg-black/40">
                              <img
                                src={siteConfig.bgImageUrl}
                                alt="Fundo"
                                className="w-full h-full object-cover"
                                style={{ opacity: siteConfig.bgOpacity ?? 0.1 }}
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ) : (
                            <div className="h-12 w-16 rounded bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 text-[9px] font-mono font-bold">
                              Sem Imagem
                            </div>
                          )}
                          <div className="text-left">
                            <span className="text-[10px] font-bold text-slate-300 block leading-none">Carregar Imagem de Fundo</span>
                            <span className="text-[9px] text-slate-500 mt-0.5 block">Recomendado: Texturas subtis, padrões ou marcas de água</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          {siteConfig.bgImageUrl && (
                            <button
                              type="button"
                              onClick={() => setSiteConfig({ ...siteConfig, bgImageUrl: '' })}
                              className="bg-red-950/40 hover:bg-red-900/50 border border-red-900/30 text-red-300 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                            >
                              Remover
                            </button>
                          )}
                          <label className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white cursor-pointer transition-colors flex items-center space-x-1">
                            <Upload className="w-3.5 h-3.5 text-brand-orange" />
                            <span>Carregar Ficheiro</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, (base64) => setSiteConfig({ ...siteConfig, bgImageUrl: base64 }))}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* IMGBB API KEY INTEGRATION FOR CLOUD STORAGE */}
                  <div className="border-t border-white/10 pt-5 mt-5 space-y-4">
                    <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider text-brand-orange flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4 text-brand-orange" />
                      <span>Alojamento Ilimitado na Nuvem (ImgBB Cloud Storage API)</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Adicione a sua Chave de API gratuita do ImgBB (obtenha gratuitamente em <a href="https://api.imgbb.com/" target="_blank" rel="noreferrer" className="text-brand-orange underline">api.imgbb.com</a>). 
                      Quando ativado, todas as fotos carregadas no Painel Admin são enviadas automaticamente para o ImgBB de forma permanente e sem perdas!
                    </p>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">Chave de API ImgBB (Opcional)</label>
                      <input
                        type="text"
                        value={siteConfig?.imgbbApiKey || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSiteConfig({ ...siteConfig, imgbbApiKey: val });
                          localStorage.setItem('gpa_imgbb_api_key', val);
                        }}
                        placeholder="Ex: 3a2b1c4d5e6f7g8h9i0j..."
                        className="w-full bg-slate-950 border border-white/10 focus:border-brand-orange rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* TABELA DE PREÇOS / ESTIMATIVAS DA CALCULADORA */}
                  <div className="border-t border-white/10 pt-5 mt-5 space-y-4">
                    <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider text-brand-orange flex items-center space-x-2">
                      <FileSpreadsheet className="w-4 h-4 text-brand-orange" />
                      <span>Preços Unitários & Taxas de Base da Calculadora</span>
                    </h3>
                    <p className="text-xs text-slate-400">Configure os valores mínimos (Taxa Base) e custos individuais por unidade que alimentam o motor de cálculo automático de orçamentos.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      
                      {/* Impressão */}
                      <div className="bg-slate-950/45 border border-white/5 rounded-xl p-4 space-y-3">
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">1. Impressão Offset & Digital</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] font-mono uppercase text-slate-400 font-bold mb-1">Taxa Base (Kz)</label>
                            <input
                              type="number"
                              value={siteConfig.rate_impressao_base ?? 5000}
                              onChange={(e) => setSiteConfig({ ...siteConfig, rate_impressao_base: Number(e.target.value) })}
                              className="w-full bg-slate-900 border border-white/10 focus:border-brand-orange rounded-lg px-3 py-2 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono uppercase text-slate-400 font-bold mb-1">Custo Unid. (Kz)</label>
                            <input
                              type="number"
                              value={siteConfig.rate_impressao_unit ?? 250}
                              onChange={(e) => setSiteConfig({ ...siteConfig, rate_impressao_unit: Number(e.target.value) })}
                              className="w-full bg-slate-900 border border-white/10 focus:border-brand-orange rounded-lg px-3 py-2 text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Têxtil */}
                      <div className="bg-slate-950/45 border border-white/5 rounded-xl p-4 space-y-3">
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">2. Têxtil & Uniformes</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] font-mono uppercase text-slate-400 font-bold mb-1">Taxa Base (Kz)</label>
                            <input
                              type="number"
                              value={siteConfig.rate_textil_base ?? 12000}
                              onChange={(e) => setSiteConfig({ ...siteConfig, rate_textil_base: Number(e.target.value) })}
                              className="w-full bg-slate-900 border border-white/10 focus:border-brand-orange rounded-lg px-3 py-2 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono uppercase text-slate-400 font-bold mb-1">Custo Unid. (Kz)</label>
                            <input
                              type="number"
                              value={siteConfig.rate_textil_unit ?? 4500}
                              onChange={(e) => setSiteConfig({ ...siteConfig, rate_textil_unit: Number(e.target.value) })}
                              className="w-full bg-slate-900 border border-white/10 focus:border-brand-orange rounded-lg px-3 py-2 text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Design */}
                      <div className="bg-slate-950/45 border border-white/5 rounded-xl p-4 space-y-3">
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">3. Design Gráfico & Identidade</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] font-mono uppercase text-slate-400 font-bold mb-1">Taxa Base (Kz)</label>
                            <input
                              type="number"
                              value={siteConfig.rate_design_base ?? 25000}
                              onChange={(e) => setSiteConfig({ ...siteConfig, rate_design_base: Number(e.target.value) })}
                              className="w-full bg-slate-900 border border-white/10 focus:border-brand-orange rounded-lg px-3 py-2 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono uppercase text-slate-400 font-bold mb-1">Custo Unid. (Kz)</label>
                            <input
                              type="number"
                              value={siteConfig.rate_design_unit ?? 0}
                              onChange={(e) => setSiteConfig({ ...siteConfig, rate_design_unit: Number(e.target.value) })}
                              className="w-full bg-slate-900 border border-white/10 focus:border-brand-orange rounded-lg px-3 py-2 text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Marketing */}
                      <div className="bg-slate-950/45 border border-white/5 rounded-xl p-4 space-y-3">
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">4. Marketing Digital & Campanhas</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] font-mono uppercase text-slate-400 font-bold mb-1">Taxa Base (Kz)</label>
                            <input
                              type="number"
                              value={siteConfig.rate_marketing_base ?? 60000}
                              onChange={(e) => setSiteConfig({ ...siteConfig, rate_marketing_base: Number(e.target.value) })}
                              className="w-full bg-slate-900 border border-white/10 focus:border-brand-orange rounded-lg px-3 py-2 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono uppercase text-slate-400 font-bold mb-1">Custo Unid. (Kz)</label>
                            <input
                              type="number"
                              value={siteConfig.rate_marketing_unit ?? 0}
                              onChange={(e) => setSiteConfig({ ...siteConfig, rate_marketing_unit: Number(e.target.value) })}
                              className="w-full bg-slate-900 border border-white/10 focus:border-brand-orange rounded-lg px-3 py-2 text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Audiovisual */}
                      <div className="bg-slate-950/45 border border-white/5 rounded-xl p-4 space-y-3">
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">5. Produção Audiovisual</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] font-mono uppercase text-slate-400 font-bold mb-1">Taxa Base (Kz)</label>
                            <input
                              type="number"
                              value={siteConfig.rate_audiovisual_base ?? 85000}
                              onChange={(e) => setSiteConfig({ ...siteConfig, rate_audiovisual_base: Number(e.target.value) })}
                              className="w-full bg-slate-900 border border-white/10 focus:border-brand-orange rounded-lg px-3 py-2 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono uppercase text-slate-400 font-bold mb-1">Custo Unid. (Kz)</label>
                            <input
                              type="number"
                              value={siteConfig.rate_audiovisual_unit ?? 0}
                              onChange={(e) => setSiteConfig({ ...siteConfig, rate_audiovisual_unit: Number(e.target.value) })}
                              className="w-full bg-slate-900 border border-white/10 focus:border-brand-orange rounded-lg px-3 py-2 text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Brindes */}
                      <div className="bg-slate-950/45 border border-white/5 rounded-xl p-4 space-y-3">
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">6. Brindes & Merchandising</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] font-mono uppercase text-slate-400 font-bold mb-1">Taxa Base (Kz)</label>
                            <input
                              type="number"
                              value={siteConfig.rate_brindes_base ?? 8000}
                              onChange={(e) => setSiteConfig({ ...siteConfig, rate_brindes_base: Number(e.target.value) })}
                              className="w-full bg-slate-900 border border-white/10 focus:border-brand-orange rounded-lg px-3 py-2 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono uppercase text-slate-400 font-bold mb-1">Custo Unid. (Kz)</label>
                            <input
                              type="number"
                              value={siteConfig.rate_brindes_unit ?? 1500}
                              onChange={(e) => setSiteConfig({ ...siteConfig, rate_brindes_unit: Number(e.target.value) })}
                              className="w-full bg-slate-900 border border-white/10 focus:border-brand-orange rounded-lg px-3 py-2 text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Sinalética */}
                      <div className="bg-slate-950/45 border border-white/5 rounded-xl p-4 space-y-3">
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">7. Sinalética & Grandes Formatos</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] font-mono uppercase text-slate-400 font-bold mb-1">Taxa Base (Kz)</label>
                            <input
                              type="number"
                              value={siteConfig.rate_sinaletica_base ?? 35000}
                              onChange={(e) => setSiteConfig({ ...siteConfig, rate_sinaletica_base: Number(e.target.value) })}
                              className="w-full bg-slate-900 border border-white/10 focus:border-brand-orange rounded-lg px-3 py-2 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono uppercase text-slate-400 font-bold mb-1">Custo M² (Kz)</label>
                            <input
                              type="number"
                              value={siteConfig.rate_sinaletica_unit ?? 12000}
                              onChange={(e) => setSiteConfig({ ...siteConfig, rate_sinaletica_unit: Number(e.target.value) })}
                              className="w-full bg-slate-900 border border-white/10 focus:border-brand-orange rounded-lg px-3 py-2 text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Stands */}
                      <div className="bg-slate-950/45 border border-white/5 rounded-xl p-4 space-y-3">
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">8. Stands & Pavilhões</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] font-mono uppercase text-slate-400 font-bold mb-1">Taxa Base (Kz)</label>
                            <input
                              type="number"
                              value={siteConfig.rate_stands_base ?? 250000}
                              onChange={(e) => setSiteConfig({ ...siteConfig, rate_stands_base: Number(e.target.value) })}
                              className="w-full bg-slate-900 border border-white/10 focus:border-brand-orange rounded-lg px-3 py-2 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono uppercase text-slate-400 font-bold mb-1">Custo Unid. (Kz)</label>
                            <input
                              type="number"
                              value={siteConfig.rate_stands_unit ?? 0}
                              onChange={(e) => setSiteConfig({ ...siteConfig, rate_stands_unit: Number(e.target.value) })}
                              className="w-full bg-slate-900 border border-white/10 focus:border-brand-orange rounded-lg px-3 py-2 text-xs text-white"
                              disabled
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* TABELA DE PREÇOS ESPECÍFICOS POR ARTIGO (PDF) */}
                  <div className="border-t border-white/10 pt-5 mt-5 space-y-4">
                    <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider text-brand-orange flex items-center space-x-2">
                      <FileSpreadsheet className="w-4 h-4 text-brand-orange" />
                      <span>Preços Unitários & Mínimos Recomendados por Artigo (Catálogo PDF)</span>
                    </h3>
                    <p className="text-xs text-slate-400">Configure os valores unitários e as quantidades mínimas recomendadas para cada produto listado no nosso catálogo oficial (PDF).</p>
                    
                    <div className="bg-slate-950/45 border border-white/5 rounded-xl p-5 space-y-4">
                      {/* Standard products grouped by service category */}
                      {[
                        {
                          title: '1. Impressão Gráfica',
                          products: ['Cartões de Visita Premium', 'Panfletos e Flyers', 'Catálogos Corporativos', 'Calendários e Agendas', 'Envelopes e Papel Timbrado']
                        },
                        {
                          title: '2. Personalização Têxtil',
                          products: ['T-shirts Promocionais', 'Polos Corporativos Bordados', 'Fardas para Indústria e Restauração', 'Bonés e Viseiras', 'Coletes de Segurança Personalizados']
                        },
                        {
                          title: '3. Design Gráfico',
                          products: ['Logótipo & Manual de Marca', 'Design de Embalagens', 'Artes de Redes Sociais', 'Design de Flyers e Banners', 'Layouts para Stands']
                        },
                        {
                          title: '4. Marketing Digital',
                          products: ['Pacotes Mensais de Social Media', 'Configuração de Campanhas de Anúncios', 'Copywriting de Vendas', 'Landing Pages para Conversão', 'Auditoria de Presença Digital']
                        },
                        {
                          title: '5. Produção Audiovisual',
                          products: ['Vídeos Institucionais', 'Spots Publicitários de 15s/30s', 'Vídeo Reportagem de Eventos', 'Sessões Fotográficas de Equipa', 'Motion Graphics Explicativos']
                        },
                        {
                          title: '6. Brindes Corporativos',
                          products: ['Canecas de Cerâmica & Garrafas Térmicas', 'Canetas Metálicas Gravadas a Laser', 'Blocos de Notas e Agendas', 'Sacos Ecológicos (Tote Bags)', 'Pens USB & Powerbanks']
                        },
                        {
                          title: '7. Sinalética & Grandes Formatos',
                          products: ['Placas de Sinalização Interna/Externa', 'Decoração Integral ou Parcial de Viaturas', 'Reclames Luminosos 3D', 'Lonas Publicitárias com Ilhós', 'Roll-ups Autoportantes']
                        },
                        {
                          title: '8. Stands & Exposições',
                          products: ['Stands Personalizados (Carpintaria)', 'Stands Modulares para Feiras', 'Balcões de Atendimento e Displays', 'Backdrops de Conferência Gigantes', 'Roll-ups e Pop-ups Promocionais']
                        }
                      ].map((cat) => (
                        <div key={cat.title} className="border-b border-white/5 pb-4 last:border-none last:pb-0">
                          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 font-mono text-brand-orange">{cat.title}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {cat.products.map((prod) => (
                              <div key={prod} className="bg-slate-900/60 border border-white/5 p-3 rounded-lg space-y-2">
                                <span className="block text-[11px] font-bold text-white leading-tight truncate" title={prod}>
                                  {prod}
                                </span>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[8px] font-mono uppercase text-slate-400 font-bold mb-0.5">Preço Unit. (Kz)</label>
                                    <input
                                      type="number"
                                      value={siteConfig.productPrices?.[prod] ?? 0}
                                      onChange={(e) => {
                                        const prices = { ...(siteConfig.productPrices || {}) };
                                        prices[prod] = Number(e.target.value);
                                        setSiteConfig({ ...siteConfig, productPrices: prices });
                                      }}
                                      className="w-full bg-slate-950 border border-white/10 focus:border-brand-orange rounded px-2 py-1 text-xs text-white text-right"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[8px] font-mono uppercase text-slate-400 font-bold mb-0.5">Mínimo Qtd</label>
                                    <input
                                      type="number"
                                      value={siteConfig.productMinQtys?.[prod] ?? 1}
                                      onChange={(e) => {
                                        const minQtys = { ...(siteConfig.productMinQtys || {}) };
                                        minQtys[prod] = Math.max(1, Number(e.target.value));
                                        setSiteConfig({ ...siteConfig, productMinQtys: minQtys });
                                      }}
                                      className="w-full bg-slate-950 border border-white/10 focus:border-brand-orange rounded px-2 py-1 text-xs text-white text-right"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-3 px-6 rounded-xl cursor-pointer transition-colors shadow-md flex items-center space-x-2 text-xs uppercase tracking-wider"
                    >
                      <Save className="w-4 h-4" />
                      <span>Guardar Alterações</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* TAB CONTENT: PRODUTOS DA LOJA ONLINE */}
            {activeTab === 'store-products' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-xl">
                  <div>
                    <h2 className="text-lg font-display font-bold text-white flex items-center space-x-2">
                      <ShoppingBag className="w-5 h-5 text-brand-orange" />
                      <span>Catálogo & Produtos da Loja Online</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Gerencie dinamicamente os produtos, preços em Kwanzas (AOA), quantidades mínimas, categorias e imagens em tempo real.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddProduct}
                    className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center space-x-2 cursor-pointer transition-all shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Criar Novo Produto</span>
                  </button>
                </div>

                {/* FILTERS & SEARCH BAR */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/60 border border-white/10 p-4 rounded-xl">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Pesquisar produto por nome..."
                      value={prodSearch}
                      onChange={(e) => setProdSearch(e.target.value)}
                      className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                    {[
                      { id: 'all', label: 'Todos' },
                      { id: 'impressao', label: 'Gráficas' },
                      { id: 'textil', label: 'Têxtil' },
                      { id: 'design', label: 'Design' },
                      { id: 'marketing', label: 'Marketing' },
                      { id: 'audiovisual', label: 'Audiovisual' },
                      { id: 'brindes', label: 'Brindes' },
                      { id: 'sinaletica', label: 'Sinalética' }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setProdCategoryFilter(cat.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
                          prodCategoryFilter === cat.id
                            ? 'bg-brand-orange text-white font-bold'
                            : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* PRODUCTS LIST GRID */}
                {(() => {
                  const filtered = storeProducts.filter((p) => {
                    const matchesCat = prodCategoryFilter === 'all' || p.category === prodCategoryFilter;
                    const matchesSearch = !prodSearch || p.name.toLowerCase().includes(prodSearch.toLowerCase()) || (p.description && p.description.toLowerCase().includes(prodSearch.toLowerCase()));
                    return matchesCat && matchesSearch;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-12 text-center text-slate-400 space-y-3">
                        <ShoppingBag className="w-10 h-10 mx-auto text-slate-600" />
                        <p className="text-sm font-semibold">Nenhum produto encontrado nesta categoria.</p>
                        <button
                          onClick={handleOpenAddProduct}
                          className="text-xs text-brand-orange hover:underline font-bold cursor-pointer"
                        >
                          + Adicionar Primeiro Produto
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filtered.map((prod) => (
                        <div
                          key={prod.id}
                          className="bg-slate-900 border border-white/10 hover:border-white/20 rounded-2xl p-5 space-y-4 shadow-lg flex flex-col justify-between transition-all"
                        >
                          <div className="space-y-3">
                            <div className="relative h-44 rounded-xl overflow-hidden bg-slate-950 border border-white/5 group">
                              <img
                                src={prod.imageUrl}
                                alt={prod.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                              {prod.badge && (
                                <span className="absolute top-2 left-2 bg-brand-orange text-white text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full shadow-md">
                                  {prod.badge}
                                </span>
                              )}
                              <span
                                className={`absolute top-2 right-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                  prod.inStock !== false ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}
                              >
                                {prod.inStock !== false ? 'Em Stock' : 'Esgotado'}
                              </span>
                            </div>

                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold uppercase text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded">
                                  {prod.category}
                                </span>
                                <span className="text-xs font-mono font-bold text-slate-400">
                                  Mín. {prod.minQty} un.
                                </span>
                              </div>
                              <h3 className="text-sm font-bold text-white mt-1.5 line-clamp-1">{prod.name}</h3>
                              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{prod.description}</p>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                            <div>
                              <span className="text-[9px] font-mono text-slate-500 block uppercase">Preço Unitário</span>
                              <span className="text-base font-display font-extrabold text-white">
                                {prod.price ? prod.price.toLocaleString('pt-AO') : 0} <span className="text-xs text-brand-orange">Kz</span>
                              </span>
                            </div>

                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleOpenEditProduct(prod)}
                                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white p-2 rounded-lg text-xs cursor-pointer transition-colors"
                                title="Editar Produto"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                              </button>
                              <button
                                onClick={() => handleDeleteStoreProduct(prod.id, prod.name)}
                                className="bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 text-red-300 p-2 rounded-lg text-xs cursor-pointer transition-colors"
                                title="Apagar Produto"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </motion.div>
            )}

            {/* TAB CONTENT: CATEGORIAS DA LOJA ONLINE */}
            {activeTab === 'categories' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-xl">
                  <div>
                    <h2 className="text-lg font-display font-bold text-white flex items-center space-x-2">
                      <Tag className="w-5 h-5 text-brand-orange" />
                      <span>Gestão de Categorias & Imagens de Capa da Loja</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Altere os títulos, descrições e carregue imagens de capa personalizadas para cada categoria da Loja Online.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddCategory}
                    className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center space-x-2 cursor-pointer transition-all shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Criar Nova Categoria</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {storeCategories.map((cat, idx) => (
                    <div key={cat.id || idx} className="bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-4 shadow-lg flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="relative h-36 rounded-xl overflow-hidden bg-slate-950 border border-white/5 group">
                          <img
                            src={cat.imageUrl || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80'}
                            alt={cat.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end text-white">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-orange/90 px-2 py-0.5 rounded-full">
                              {cat.badge || cat.slug}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-white mt-1">{cat.name}</h3>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{cat.description}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-500 uppercase">Slug: {cat.slug}</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpenEditCategory(cat)}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white p-2 rounded-lg text-xs cursor-pointer transition-colors"
                            title="Editar Categoria"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategoryItem(cat.id, cat.name)}
                            className="bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 text-red-300 p-2 rounded-lg text-xs cursor-pointer transition-colors"
                            title="Apagar Categoria"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT: SERVIÇOS & FOTOGRAFIAS */}
            {activeTab === 'services' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h2 className="text-lg font-display font-bold text-white flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-brand-orange" />
                    <span>Gestão de Serviços & Fotografias Industriais</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Personalize os títulos, ícones, descrições e fotografias temáticas em alta definição de cada um dos 8 setores de produção da GPA Angola.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {servicesList.map((srv) => (
                    <div key={srv.id} className="bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-4 shadow-lg flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="relative h-36 rounded-xl overflow-hidden bg-slate-950 border border-white/5 group">
                          <img
                            src={srv.imageUrl || 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=600&q=80'}
                            alt={srv.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                          {srv.badge && (
                            <span className="absolute top-2 left-2 bg-brand-orange text-white text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full shadow-md">
                              {srv.badge}
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-mono font-bold text-brand-orange">{srv.iconName}</span>
                          </div>
                          <h3 className="text-base font-bold text-white mt-1">{srv.title}</h3>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{srv.description}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-500 uppercase">{srv.id}</span>
                        <button
                          onClick={() => handleOpenEditService(srv)}
                          className="bg-brand-orange/10 hover:bg-brand-orange text-brand-orange hover:text-white border border-brand-orange/30 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center space-x-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Editar Serviço</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT: EQUIPA & UTILIZADORES ADMIN */}
            {activeTab === 'admins' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-xl">
                  <div>
                    <h2 className="text-lg font-display font-bold text-white flex items-center space-x-2">
                      <Users className="w-5 h-5 text-brand-orange" />
                      <span>Gestão da Equipa & Utilizadores Administradores</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Crie utilizadores para a equipa da GPA Angola e defina exatamente quais as abas e funções que cada um pode alterar.
                    </p>
                  </div>

                  <button
                    onClick={handleNewAdminUserClick}
                    className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center space-x-2 cursor-pointer transition-all shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Criar Novo Utilizador</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {adminList.map((user) => (
                    <div key={user.id} className="bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-4 shadow-lg flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full ${
                            user.role === 'superadmin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {user.role === 'superadmin' ? 'Super Admin' : user.role}
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            user.active !== false ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {user.active !== false ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-white">{user.name}</h3>
                          <p className="text-xs font-mono text-slate-400">@{user.username}</p>
                        </div>

                        <div className="bg-slate-950 p-3 rounded-xl border border-white/5 space-y-1.5 text-[11px]">
                          <span className="block text-[10px] font-mono uppercase text-slate-500 font-bold">Permissões Ativas</span>
                          <div className="flex flex-wrap gap-1">
                            {user.permissions?.canManageConfig && <span className="bg-white/5 text-slate-300 px-2 py-0.5 rounded text-[10px]">Textos</span>}
                            {user.permissions?.canManageProducts && <span className="bg-white/5 text-slate-300 px-2 py-0.5 rounded text-[10px]">Produtos</span>}
                            {user.permissions?.canManageCategories && <span className="bg-white/5 text-slate-300 px-2 py-0.5 rounded text-[10px]">Categorias</span>}
                            {user.permissions?.canManageServices && <span className="bg-white/5 text-slate-300 px-2 py-0.5 rounded text-[10px]">Serviços</span>}
                            {user.permissions?.canManageGallery && <span className="bg-white/5 text-slate-300 px-2 py-0.5 rounded text-[10px]">Galeria</span>}
                            {user.permissions?.canManageQuotes && <span className="bg-white/5 text-slate-300 px-2 py-0.5 rounded text-[10px]">Orçamentos</span>}
                            {user.permissions?.canManageUsers && <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px]">Gerir Equipa</span>}
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-500">Passcode: ••••••</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditAdminUserClick(user)}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white p-2 rounded-lg text-xs cursor-pointer transition-colors"
                            title="Editar Utilizador"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                          </button>
                          {user.username !== 'admin' && (
                            <button
                              onClick={() => handleDeleteAdminUserItem(user.id, user.name)}
                              className="bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 text-red-300 p-2 rounded-lg text-xs cursor-pointer transition-colors"
                              title="Apagar Utilizador"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT: PARTNERS & LOGOMARCAS */}
            {activeTab === 'partners' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-lg font-display font-bold text-white flex items-center space-x-2">
                      <Users className="w-5 h-5 text-brand-orange" />
                      <span>Logomarcas de Clientes Parceiros</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Adicione, edite ou remova as grandes marcas parceiras da GPA. Carregue imagens diretamente para ficarem coloridas e polidas!
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddPartner}
                      className="bg-slate-900 hover:bg-slate-800 border border-white/10 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-brand-orange" />
                      <span>Adicionar Marca</span>
                    </button>

                    <button
                      onClick={handleSavePartners}
                      className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Guardar Tudo</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {partners.map((p, idx) => (
                    <div key={p.id} className="bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-4 relative group">
                      
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                          Marca #{idx + 1}
                        </span>
                        <button
                          onClick={() => handleDeletePartner(p.id, idx)}
                          className="p-1.5 bg-red-950/40 border border-red-900/40 text-red-400 hover:bg-red-900 hover:text-white rounded-lg cursor-pointer transition-colors"
                          title="Remover parceiro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">Nome Comercial</label>
                          <input
                            type="text"
                            value={p.name}
                            onChange={(e) => handleUpdatePartnerField(idx, 'name', e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 focus:border-brand-orange rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                            placeholder="Ex: Banco de Fomento"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">Ordem de Exibição</label>
                          <input
                            type="number"
                            value={p.order}
                            onChange={(e) => handleUpdatePartnerField(idx, 'order', parseInt(e.target.value) || 0)}
                            className="w-full bg-slate-950 border border-white/10 focus:border-brand-orange rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">Link Direto da Imagem (Opcional)</label>
                        <input
                          type="text"
                          value={p.imageUrl}
                          onChange={(e) => handleUpdatePartnerField(idx, 'imageUrl', e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 focus:border-brand-orange rounded-xl px-3 py-2 text-xs text-white focus:outline-none mb-2"
                          placeholder="https://i.ibb.co/..."
                        />
                      </div>

                      {/* Interactive direct upload widget */}
                      <div className="border border-dashed border-white/10 bg-slate-950/60 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          {p.imageUrl ? (
                            <img
                              src={p.imageUrl}
                              alt="Preview"
                              className="h-10 w-14 object-contain bg-white/5 rounded p-1 border border-white/10"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="h-10 w-14 rounded bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 text-[9px] font-mono font-bold">
                              Sem Logo
                            </div>
                          )}
                          <div className="text-left">
                            <span className="text-[10px] font-bold text-slate-300 block leading-none">Substituir Logótipo</span>
                            <span className="text-[9px] text-slate-500 mt-0.5 block">Formatos: PNG, JPG</span>
                          </div>
                        </div>

                        <label className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white cursor-pointer transition-colors flex items-center space-x-1">
                          <Upload className="w-3.5 h-3.5 text-brand-orange" />
                          <span>Carregar Ficheiro</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, (base64) => handleUpdatePartnerField(idx, 'imageUrl', base64))}
                            className="hidden"
                          />
                        </label>
                      </div>

                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT: INDUSTRIAL GALLERY IMAGES */}
            {activeTab === 'gallery' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-lg font-display font-bold text-white flex items-center space-x-2">
                      <ImageIcon className="w-5 h-5 text-brand-orange" />
                      <span>Imagens do Parque de Produção</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Gerencie as fotos exibidas no carrossel de fabrico na página inicial e no explorador interativo.
                    </p>
                  </div>

                  <div className="flex space-x-2 items-center">
                    <button
                      onClick={handleAddGalleryItem}
                      className="bg-slate-900 hover:bg-slate-800 border border-white/10 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-brand-orange" />
                      <span>Adicionar Foto</span>
                    </button>

                    <label className="bg-slate-900 hover:bg-slate-800 border border-white/10 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 text-brand-orange" />
                      <span>Carregar Várias Fotos</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleMultiFileUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      onClick={handleSaveGallery}
                      className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Guardar Tudo</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {gallery.map((item, idx) => (
                    <div key={item.id} className="bg-slate-900 border border-white/10 rounded-2xl p-5 flex flex-col justify-between relative group">
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                            Foto Industrial #{idx + 1}
                          </span>
                          <button
                            onClick={() => handleDeleteGallery(item.id, idx)}
                            className="p-1.5 bg-red-950/40 border border-red-900/40 text-red-400 hover:bg-red-900 hover:text-white rounded-lg cursor-pointer transition-colors"
                            title="Remover foto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-white/5">
                          <img
                            src={item.imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">Legenda em Português</label>
                          <input
                            type="text"
                            value={item.caption}
                            onChange={(e) => handleUpdateGalleryField(idx, 'caption', e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 focus:border-brand-orange rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                            placeholder="Legenda descritiva da máquina ou processo..."
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">Ordem</label>
                            <input
                              type="number"
                              value={item.order}
                              onChange={(e) => handleUpdateGalleryField(idx, 'order', parseInt(e.target.value) || 0)}
                              className="w-full bg-slate-950 border border-white/10 focus:border-brand-orange rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                            />
                          </div>

                          <div className="flex flex-col justify-end">
                            <label className="w-full bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-xl text-xs font-bold text-white cursor-pointer transition-colors flex items-center justify-center space-x-1.5">
                              <Upload className="w-3.5 h-3.5 text-brand-orange" />
                              <span>Carregar Ficheiro</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, (base64) => handleUpdateGalleryField(idx, 'imageUrl', base64))}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">Link Direto Alternativo</label>
                          <input
                            type="text"
                            value={item.imageUrl}
                            onChange={(e) => handleUpdateGalleryField(idx, 'imageUrl', e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 focus:border-brand-orange rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT: PORTFOLIO MANAGEMENT */}
            {activeTab === 'portfolio' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-lg font-display font-bold text-white flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-brand-orange" />
                      <span>Portfólio de Sucesso</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Gerencie as fotos, detalhes e informações de cada caso de sucesso exibido na página pública.
                    </p>
                  </div>

                  <div className="flex space-x-2 items-center">
                    <button
                      onClick={handleAddProject}
                      className="bg-slate-900 hover:bg-slate-800 border border-white/10 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-brand-orange" />
                      <span>Adicionar Projeto</span>
                    </button>

                    <label className="bg-slate-900 hover:bg-slate-800 border border-white/10 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 text-brand-orange" />
                      <span>Carregar Vários Projetos</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleMultiProjectUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      onClick={handleSaveProjects}
                      className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Guardar Tudo</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {projects.map((proj, idx) => (
                    <div key={proj.id} className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-5 relative group">
                      
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="text-xs font-mono text-slate-400 font-bold uppercase">
                          Projeto #{idx + 1}: {proj.title || 'Sem Título'}
                        </span>
                        <button
                          onClick={() => handleDeleteProject(proj.id, idx)}
                          className="p-1.5 bg-red-950/40 border border-red-900/40 text-red-400 hover:bg-red-900 hover:text-white rounded-lg cursor-pointer transition-colors"
                          title="Remover projeto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="md:col-span-1 space-y-3">
                          <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">Capa do Projeto</label>
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-white/5">
                            {proj.image ? (
                              <img
                                src={proj.image}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">Sem Capa</div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="w-full bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-xl text-xs font-bold text-white cursor-pointer transition-colors flex items-center justify-center space-x-1.5">
                              <Upload className="w-3.5 h-3.5 text-brand-orange" />
                              <span>Carregar Nova Capa</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, (base64) => handleUpdateProjectField(idx, 'image', base64))}
                                className="hidden"
                              />
                            </label>
                            
                            <input
                              type="text"
                              value={proj.image}
                              onChange={(e) => handleUpdateProjectField(idx, 'image', e.target.value)}
                              className="w-full bg-slate-950 border border-white/10 focus:border-brand-orange rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                              placeholder="Link direto da imagem..."
                            />
                          </div>
                        </div>

                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">Título do Projeto</label>
                            <input
                              type="text"
                              value={proj.title}
                              onChange={(e) => handleUpdateProjectField(idx, 'title', e.target.value)}
                              className="w-full bg-slate-950 border border-white/10 focus:border-brand-orange rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                              placeholder="Ex: Fardamento Oficial Presidência"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">Cliente Oficial</label>
                            <input
                              type="text"
                              value={proj.client}
                              onChange={(e) => handleUpdateProjectField(idx, 'client', e.target.value)}
                              className="w-full bg-slate-950 border border-white/10 focus:border-brand-orange rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                              placeholder="Ex: Ministério da Energia"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">Ano Realização</label>
                            <input
                              type="text"
                              value={proj.year}
                              onChange={(e) => handleUpdateProjectField(idx, 'year', e.target.value)}
                              className="w-full bg-slate-950 border border-white/10 focus:border-brand-orange rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                              placeholder="Ex: 2026"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">Categoria (Filtro)</label>
                            <select
                              value={proj.category}
                              onChange={(e) => {
                                const selectedVal = e.target.value;
                                const labels: Record<string, string> = {
                                  stands: 'Stands & Exposições',
                                  textil: 'Têxtil Personalizado',
                                  sinaletica: 'Sinalética',
                                  brindes: 'Brindes'
                                };
                                handleUpdateProjectField(idx, 'category', selectedVal);
                                handleUpdateProjectField(idx, 'categoryLabel', labels[selectedVal] || 'Outro');
                              }}
                              className="w-full bg-slate-950 border border-white/10 focus:border-brand-orange rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                            >
                              <option value="stands">Stands & Exposições</option>
                              <option value="textil">Têxtil Personalizado</option>
                              <option value="sinaletica">Sinalética</option>
                              <option value="brindes">Brindes</option>
                            </select>
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">Resumo Descritivo Curto</label>
                            <textarea
                              value={proj.description}
                              onChange={(e) => handleUpdateProjectField(idx, 'description', e.target.value)}
                              rows={2}
                              className="w-full bg-slate-950 border border-white/10 focus:border-brand-orange rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                              placeholder="Escreva um breve parágrafo descrevendo o projeto..."
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Details Sub-form */}
                      <div className="bg-slate-950/45 border border-white/5 rounded-xl p-4 space-y-4">
                        <span className="text-[10px] font-mono uppercase text-brand-orange font-bold tracking-wider block">
                          Características e Especificações Técnicas (Exibidos no Modal Expandido)
                        </span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          {[0, 1, 2, 3].map((detailIdx) => {
                            const detailItem = proj.details?.[detailIdx] || { label: '', value: '' };
                            return (
                              <div key={detailIdx} className="bg-slate-900/60 p-3 rounded-xl border border-white/5 space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-[9px] font-mono font-bold text-slate-400">ITEM #{detailIdx + 1}</span>
                                </div>
                                <div>
                                  <label className="block text-[8px] font-mono uppercase text-slate-500 font-bold mb-0.5">Etiqueta (Ex: Material, Desafio)</label>
                                  <input
                                    type="text"
                                    value={detailItem.label}
                                    onChange={(e) => handleUpdateProjectDetailsField(idx, detailIdx, 'label', e.target.value)}
                                    placeholder="Ex: Dimensões"
                                    className="w-full bg-slate-950 border border-white/10 focus:border-brand-orange rounded px-2 py-1 text-xs text-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[8px] font-mono uppercase text-slate-500 font-bold mb-0.5">Valor do Detalhe</label>
                                  <textarea
                                    value={detailItem.value}
                                    onChange={(e) => handleUpdateProjectDetailsField(idx, detailIdx, 'value', e.target.value)}
                                    placeholder="Ex: 8m x 3.5m"
                                    rows={2}
                                    className="w-full bg-slate-950 border border-white/10 focus:border-brand-orange rounded px-2 py-1 text-xs text-white"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Slideshow/Carrossel de Imagens Adicionais */}
                      <div className="bg-slate-950/45 border border-white/5 rounded-xl p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono uppercase text-brand-orange font-bold tracking-wider block">
                            Fotos Adicionais do Caso de Sucesso (Slideshow Automático)
                          </span>
                          
                          <label className="bg-slate-900 hover:bg-slate-800 border border-white/10 text-white font-bold py-1.5 px-3 rounded-lg text-[10px] flex items-center space-x-1 cursor-pointer transition-colors">
                            <Upload className="w-3 h-3 text-brand-orange" />
                            <span>Adicionar Várias Fotos</span>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={async (e) => {
                                const files = e.target.files;
                                if (!files || files.length === 0) return;
                                setUploadProgress(`A carregar fotos adicionais...`);
                                try {
                                  const newImgs: string[] = [];
                                  for (let i = 0; i < files.length; i++) {
                                    const compressed = await compressImage(files[i]);
                                    newImgs.push(compressed);
                                  }
                                  const updated = [...projects];
                                  updated[idx] = {
                                    ...updated[idx],
                                    images: [...(updated[idx].images || []), ...newImgs]
                                  };
                                  setProjects(updated);
                                  showStatus(`${newImgs.length} fotos adicionais carregadas para este projeto!`);
                                } catch (err) {
                                  console.error(err);
                                  showStatus('Erro ao carregar fotos adicionais', true);
                                } finally {
                                  setUploadProgress(null);
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <p className="text-[11px] text-slate-400">
                          Estas fotos farão transição automática no site principal. Recomendamos de 2 a 5 fotos adicionais por caso de sucesso para o melhor efeito visual.
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                          {/* Capa principal listada aqui para conveniência */}
                          <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-brand-orange/40 bg-slate-900 flex flex-col justify-between">
                            {proj.image ? (
                              <img src={proj.image} className="w-full h-full object-cover" alt="Capa" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500">Sem Capa</div>
                            )}
                            <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[8px] text-brand-orange text-center py-0.5 font-bold uppercase">
                              Capa Principal
                            </div>
                          </div>

                          {/* Fotos adicionais */}
                          {(proj.images || []).map((imgUrl, imgIdx) => (
                            <div key={imgIdx} className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-slate-900 group">
                              <img src={imgUrl} className="w-full h-full object-cover" alt={`Slide ${imgIdx + 1}`} referrerPolicy="no-referrer" />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...projects];
                                  const images = [...(updated[idx].images || [])];
                                  images.splice(imgIdx, 1);
                                  updated[idx] = { ...updated[idx], images };
                                  setProjects(updated);
                                  showStatus('Foto removida do slideshow!');
                                }}
                                className="absolute top-1 right-1 p-1 bg-red-950/80 border border-red-900/50 text-red-400 hover:bg-red-900 hover:text-white rounded-md cursor-pointer opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remover Foto"
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                              </button>
                              <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[8px] text-slate-400 text-center py-0.5 font-bold uppercase">
                                Slide #{imgIdx + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT: CLIENT QUOTES INBOX */}
            {activeTab === 'quotes' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-lg font-display font-bold text-white flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-brand-orange" />
                      <span>Inbox de Pedidos de Orçamento</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Consulte todas as simulações enviadas pelos clientes online. Monitorização e acompanhamento direto.
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={exportQuotesToCSV}
                      disabled={quotes.length === 0}
                      className="bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-white/10 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      <span>Exportar CSV</span>
                    </button>
                  </div>
                </div>

                {/* Filter and Search Row */}
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 flex items-center space-x-3">
                  <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={quoteSearch}
                    onChange={(e) => setQuoteSearch(e.target.value)}
                    placeholder="Pesquisar por nome de cliente, email, telemóvel ou produto específico..."
                    className="w-full bg-transparent text-sm text-white focus:outline-none"
                  />
                  {quoteSearch && (
                    <button onClick={() => setQuoteSearch('')} className="text-xs text-slate-400 hover:text-white cursor-pointer">
                      Limpar
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Quotes List Panel */}
                  <div className="lg:col-span-1 bg-slate-900 border border-white/10 rounded-2xl overflow-hidden flex flex-col max-h-[600px]">
                    <div className="p-4 bg-slate-950 border-b border-white/5">
                      <h3 className="text-xs font-mono font-bold uppercase text-slate-400">Lista de Recebidos ({filteredQuotes.length})</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                      {filteredQuotes.length === 0 ? (
                        <div className="p-8 text-center">
                          <HelpCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                          <p className="text-xs text-slate-500">Nenhum pedido de orçamento encontrado.</p>
                        </div>
                      ) : (
                        filteredQuotes.map((q) => (
                          <button
                            key={q.id}
                            onClick={() => setSelectedQuote(q)}
                            className={`w-full text-left p-4 cursor-pointer transition-colors block ${
                              selectedQuote?.id === q.id ? 'bg-brand-orange/10' : 'hover:bg-white/5'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="text-xs font-bold text-white truncate max-w-[130px]">{q.clientName}</h4>
                              <span className={`text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                                q.urgency === 'alta' ? 'bg-red-950/40 text-red-400 border border-red-900/30' : 
                                q.urgency === 'media' ? 'bg-amber-950/40 text-amber-400 border border-amber-900/30' : 
                                'bg-slate-950/40 text-slate-400 border border-white/10'
                              }`}>
                                {q.urgency}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">{q.product || 'Serviço Direto'}</p>
                            <div className="flex justify-between items-center mt-2.5 text-[9px] text-slate-500 font-mono">
                              <span>Qtd: {q.quantity}</span>
                              <span>{q.timestamp}</span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Quote Detail View Panel */}
                  <div className="lg:col-span-2 bg-slate-900 border border-white/10 rounded-2xl p-6 min-h-[400px] flex flex-col justify-between">
                    {selectedQuote ? (
                      <div className="space-y-5 flex-1 flex flex-col justify-between">
                        <div className="space-y-5">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-4">
                            <div>
                              <span className="text-[10px] font-mono font-bold text-brand-orange uppercase">DETALHES DO PEDIDO</span>
                              <h3 className="text-base font-display font-bold text-white mt-0.5">{selectedQuote.clientName}</h3>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleDeleteQuote(selectedQuote.id)}
                                className="p-2 bg-red-950/40 border border-red-900/40 text-red-400 hover:bg-red-900 hover:text-white rounded-xl text-xs cursor-pointer flex items-center space-x-1 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Apagar Pedido</span>
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-slate-950/50 p-3.5 rounded-xl border border-white/5">
                              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Email do Cliente</span>
                              <a href={`mailto:${selectedQuote.email}`} className="text-xs text-brand-orange hover:underline font-semibold mt-1 block">
                                {selectedQuote.email}
                              </a>
                            </div>

                            <div className="bg-slate-950/50 p-3.5 rounded-xl border border-white/5">
                              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Contacto Telefónico</span>
                              <a href={`tel:${selectedQuote.phone}`} className="text-xs text-brand-orange hover:underline font-semibold mt-1 block">
                                {selectedQuote.phone}
                              </a>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            <div className="bg-slate-950/50 p-3.5 rounded-xl border border-white/5">
                              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Serviço Pretendido</span>
                              <span className="text-xs text-white font-medium mt-1 block uppercase">{selectedQuote.serviceId || 'Geral'}</span>
                            </div>

                            <div className="bg-slate-950/50 p-3.5 rounded-xl border border-white/5">
                              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Produto Selecionado</span>
                              <span className="text-xs text-white font-medium mt-1 block">{selectedQuote.product || 'N/A'}</span>
                            </div>

                            <div className="bg-slate-950/50 p-3.5 rounded-xl border border-white/5">
                              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Quantidade Simulada</span>
                              <span className="text-xs text-brand-orange font-bold mt-1 block">{selectedQuote.quantity} un.</span>
                            </div>
                          </div>

                          <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
                            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block mb-1.5">Especificações & Mensagem</span>
                            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-950 p-3 rounded-lg border border-white/5">
                              {selectedQuote.description || 'Nenhuma descrição adicional providenciada.'}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row justify-between items-center text-slate-400 text-[10px] font-mono">
                          <span>Submetido em: {selectedQuote.timestamp}</span>
                          <span className="text-slate-500">ID: {selectedQuote.id}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500">
                        <FileText className="w-12 h-12 text-slate-700 mb-3" />
                        <h4 className="font-display font-bold text-sm text-slate-400">Nenhum Pedido Selecionado</h4>
                        <p className="text-xs text-slate-500 max-w-xs mt-1">
                          Selecione um pedido na caixa de correio à esquerda para analisar as especificações e contactos.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT: TESTIMONIALS */}
            {activeTab === 'testimonials' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <h2 className="text-lg font-display font-bold text-white flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-brand-orange" />
                    <span>Depoimentos dos Clientes</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Gira o feedback dos clientes que é visível no fundo do website. Remova ou edite nomes e cargos facilmente.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {testimonials.map((t) => (
                    <div key={t.id} className="bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 bg-brand-orange/20 text-brand-orange rounded-full flex items-center justify-center font-bold text-sm">
                            {t.avatarLetter || t.name.charAt(0)}
                          </div>
                          <div>
                            <input
                              type="text"
                              value={t.name}
                              onChange={(e) => handleUpdateTestimonial({ ...t, name: e.target.value })}
                              className="bg-transparent border-b border-transparent focus:border-brand-orange text-xs text-white font-bold focus:outline-none"
                            />
                            <div className="flex space-x-1.5 mt-0.5">
                              <input
                                type="text"
                                value={t.role}
                                onChange={(e) => handleUpdateTestimonial({ ...t, role: e.target.value })}
                                className="bg-transparent border-b border-transparent focus:border-brand-orange text-[9px] text-slate-400 focus:outline-none w-20"
                              />
                              <span className="text-[9px] text-slate-500">@</span>
                              <input
                                type="text"
                                value={t.company}
                                onChange={(e) => handleUpdateTestimonial({ ...t, company: e.target.value })}
                                className="bg-transparent border-b border-transparent focus:border-brand-orange text-[9px] text-slate-400 focus:outline-none w-24"
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteTestimonial(t.id)}
                          className="p-1.5 bg-red-950/40 border border-red-900/40 text-red-400 hover:bg-red-900 hover:text-white rounded-lg cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <textarea
                        value={t.text}
                        rows={3}
                        onChange={(e) => handleUpdateTestimonial({ ...t, text: e.target.value })}
                        className="w-full bg-slate-950/60 border border-white/5 focus:border-brand-orange rounded-xl p-3 text-xs text-slate-300 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT: PRODUCT PRICES & MIN QUANTITIES */}
            {activeTab === 'prices' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-lg font-display font-bold text-white flex items-center space-x-2">
                      <FileSpreadsheet className="w-5 h-5 text-brand-orange" />
                      <span>Gestor de Preços & Quantidades Mínimas</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Altere em tempo real os preços unitários e quantidades mínimas exigidas na loja online e simulador de orçamentos.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveProductPricesAndMinQtys}
                    className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center space-x-2 shadow cursor-pointer transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Todos os Preços</span>
                  </button>
                </div>

                <div className="space-y-8 bg-slate-900 border border-white/10 rounded-2xl p-6">
                  {(() => {
                    const categoriesMapping: Record<string, { label: string; items: string[] }> = {
                      impressao: {
                        label: 'Artes Gráficas & Impressão',
                        items: [
                          'Cartões de Visita Premium',
                          'Panfletos e Flyers',
                          'Catálogos Corporativos',
                          'Calendários e Agendas',
                          'Envelopes e Papel Timbrado'
                        ]
                      },
                      textil: {
                        label: 'Personalização Têxtil & Uniformes',
                        items: [
                          'T-shirts Promocionais',
                          'Polos Corporativos Bordados',
                          'Fardas para Indústria e Restauração',
                          'Bonés e Viseiras',
                          'Coletes de Segurança Personalizados'
                        ]
                      },
                      design: {
                        label: 'Design Gráfico & Manuais de Marca',
                        items: [
                          'Logótipo & Manual de Marca',
                          'Design de Embalagens',
                          'Artes de Redes Sociais',
                          'Design de Flyers e Banners',
                          'Layouts para Stands'
                        ]
                      },
                      marketing: {
                        label: 'Estratégia & Marketing Digital',
                        items: [
                          'Pacotes Mensais de Social Media',
                          'Configuração de Campanhas de Anúncios',
                          'Copywriting de Vendas',
                          'Landing Pages para Conversão',
                          'Auditoria de Presença Digital'
                        ]
                      },
                      audiovisual: {
                        label: 'Produção Audiovisual & Motion Graphics',
                        items: [
                          'Vídeos Institucionais',
                          'Spots Publicitários de 15s/30s',
                          'Vídeo Reportagem de Eventos',
                          'Sessões Fotográficas de Equipa',
                          'Motion Graphics Explicativos'
                        ]
                      },
                      brindes: {
                        label: 'Brindes Corporativos Personalizados',
                        items: [
                          'Canecas de Cerâmica & Garrafas Térmicas',
                          'Canetas Metálicas Gravadas a Laser',
                          'Blocos de Notas e Agendas',
                          'Sacos Ecológicos (Tote Bags)',
                          'Pens USB & Powerbanks'
                        ]
                      },
                      sinaletica: {
                        label: 'Sinalética Corporativa & Stands para Feiras',
                        items: [
                          'Placas de Sinalização Interna/Externa',
                          'Decoração Integral ou Parcial de Viaturas',
                          'Reclames Luminosos 3D',
                          'Lonas Publicitárias com Ilhós',
                          'Roll-ups Autoportantes',
                          'Stands Personalizados (Carpintaria)',
                          'Stands Modulares para Feiras',
                          'Balcões de Atendimento e Displays',
                          'Backdrops de Conferência Gigantes',
                          'Roll-ups e Pop-ups Promocionais'
                        ]
                      }
                    };

                    return Object.entries(categoriesMapping).map(([catId, cat]) => (
                      <div key={catId} className="space-y-4">
                        <h3 className="text-xs font-mono font-black uppercase tracking-wider text-brand-orange border-b border-white/5 pb-2">
                          {cat.label}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {cat.items.map((pName) => {
                            const currentPrice = siteConfig.productPrices?.[pName] ?? 0;
                            const currentMinQty = siteConfig.productMinQtys?.[pName] ?? 1;

                            return (
                              <div key={pName} className="bg-slate-950 border border-white/5 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-white/10 transition-all">
                                <span className="text-xs font-bold text-white line-clamp-1">{pName}</span>
                                
                                <div className="grid grid-cols-2 gap-3.5">
                                  <div>
                                    <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">
                                      Preço (Kz / Unidade)
                                    </label>
                                    <input
                                      type="number"
                                      value={currentPrice}
                                      onChange={(e) => handleUpdateProductPrice(pName, Math.max(0, parseInt(e.target.value) || 0))}
                                      placeholder="0 (Sob Consulta)"
                                      className="w-full bg-slate-900 border border-white/10 rounded-lg py-1.5 px-2.5 text-xs text-brand-orange font-mono font-bold focus:outline-none"
                                    />
                                    <span className="text-[8px] text-slate-500 font-mono mt-0.5 block">0 = Sob Consulta</span>
                                  </div>

                                  <div>
                                    <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">
                                      Qtd Mínima Exigida
                                    </label>
                                    <input
                                      type="number"
                                      value={currentMinQty}
                                      onChange={(e) => handleUpdateProductMinQty(pName, Math.max(1, parseInt(e.target.value) || 1))}
                                      placeholder="1"
                                      className="w-full bg-slate-900 border border-white/10 rounded-lg py-1.5 px-2.5 text-xs text-white font-mono font-bold focus:outline-none"
                                    />
                                    <span className="text-[8px] text-slate-500 font-mono mt-0.5 block">Mínimo para produzir</span>
                                  </div>
                                </div>

                                <div className="space-y-1 pt-1 border-t border-white/5">
                                  <label className="block text-[10px] uppercase font-mono text-slate-400 mb-0.5">
                                    Imagem do Produto (URL ou Carregar do PC)
                                  </label>
                                  <div className="flex items-center space-x-2 gap-1.5">
                                    <input
                                      type="text"
                                      value={siteConfig.productImages?.[pName] ?? ''}
                                      onChange={(e) => handleUpdateProductImage(pName, e.target.value)}
                                      placeholder="URL ou carregar do PC..."
                                      className="flex-1 bg-slate-900 border border-white/10 focus:border-brand-orange rounded-lg py-1.5 px-2.5 text-[11px] text-slate-200 focus:outline-none font-mono"
                                    />
                                    <label className="bg-slate-800 hover:bg-slate-700 border border-white/10 hover:border-white/25 rounded-lg px-2.5 py-1.5 text-[10px] text-white cursor-pointer font-bold transition-all flex items-center space-x-1 whitespace-nowrap">
                                      <span>Enviar PC</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileUpload(e, (base64) => handleUpdateProductImage(pName, base64))}
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ));
                  })()}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleSaveProductPricesAndMinQtys}
                    className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-3.5 px-8 rounded-xl text-xs flex items-center space-x-2 shadow-md cursor-pointer transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Todos os Preços & Quantidades</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT: ADMINS MANAGEMENT */}
            {activeTab === 'admins' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-lg font-display font-bold text-white flex items-center space-x-2">
                      <Users className="w-5 h-5 text-brand-orange" />
                      <span>Gestão de Administradores</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Crie, bloqueie, silencie e defina as permissões granulares dos administradores auxiliares que ajudam na gestão do site.
                    </p>
                  </div>
                  {!isCreatingAdmin && (
                    <button
                      type="button"
                      onClick={handleNewAdminClick}
                      className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center space-x-2 shadow cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Novo Administrador</span>
                    </button>
                  )}
                </div>

                {/* CREATE / EDIT FORM */}
                {isCreatingAdmin && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6"
                  >
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        {selectedAdmin ? `Editar Administrador: ${formAdminUsername}` : 'Criar Novo Administrador'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => { setIsCreatingAdmin(false); setSelectedAdmin(null); }}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        Cancelar
                      </button>
                    </div>

                    <form onSubmit={handleSaveAdmin} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Nome Completo</label>
                          <input
                            type="text"
                            value={formAdminName}
                            onChange={(e) => setFormAdminName(e.target.value)}
                            placeholder="ex: João Silva"
                            className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:border-brand-orange focus:outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Nome de Utilizador</label>
                          <input
                            type="text"
                            value={formAdminUsername}
                            onChange={(e) => setFormAdminUsername(e.target.value)}
                            placeholder="ex: joao_gpa"
                            disabled={!!selectedAdmin}
                            className="w-full bg-slate-950 border border-white/10 disabled:opacity-50 rounded-xl py-2 px-3 text-xs text-white focus:border-brand-orange focus:outline-none font-mono"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Código de Acesso</label>
                          <input
                            type="text"
                            value={formAdminPasscode}
                            onChange={(e) => setFormAdminPasscode(e.target.value)}
                            placeholder="ex: senha123"
                            className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:border-brand-orange focus:outline-none font-mono"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Função</label>
                          <select
                            value={formAdminRole}
                            onChange={(e) => setFormAdminRole(e.target.value as any)}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:border-brand-orange focus:outline-none"
                          >
                            <option value="staff">Staff / Administrador Auxiliar</option>
                            <option value="owner">Owner / Administrador Principal</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Estado</label>
                          <select
                            value={formAdminStatus}
                            onChange={(e) => setFormAdminStatus(e.target.value as any)}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:border-brand-orange focus:outline-none"
                          >
                            <option value="active">Ativo (Livre)</option>
                            <option value="blocked">Bloqueado (Suspenso)</option>
                            <option value="silenced">Silenciado (Apenas Leitura)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Número de WhatsApp</label>
                          <input
                            type="text"
                            placeholder="Ex: +244 994 943 828"
                            value={formAdminWhatsapp}
                            onChange={(e) => setFormAdminWhatsapp(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:border-brand-orange focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {formAdminStatus === 'blocked' && (
                          <div>
                            <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Bloqueado Até (Opcional)</label>
                            <input
                              type="date"
                              value={formAdminBlockExpiresAt}
                              onChange={(e) => setFormAdminBlockExpiresAt(e.target.value)}
                              className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:border-brand-orange focus:outline-none font-mono"
                            />
                            <span className="text-[9px] text-slate-500 block mt-1">Deixe em branco para permanente</span>
                          </div>
                        )}

                        {formAdminStatus === 'silenced' && (
                          <div>
                            <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Silenciado Até (Opcional)</label>
                            <input
                              type="date"
                              value={formAdminSilenceExpiresAt}
                              onChange={(e) => setFormAdminSilenceExpiresAt(e.target.value)}
                              className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:border-brand-orange focus:outline-none font-mono"
                            />
                            <span className="text-[9px] text-slate-500 block mt-1">Deixe em branco para permanente</span>
                          </div>
                        )}

                        <div>
                          <label className="block text-[10px] uppercase font-mono text-slate-400 mb-2">Disponibilidade do Comercial</label>
                          <div className="flex items-center space-x-3 mt-1">
                            <button
                              type="button"
                              onClick={() => setFormAdminIsOnline(!formAdminIsOnline)}
                              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                formAdminIsOnline ? 'bg-emerald-500' : 'bg-slate-700'
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  formAdminIsOnline ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                            <span className={`text-xs font-semibold ${formAdminIsOnline ? 'text-emerald-400' : 'text-slate-400'}`}>
                              {formAdminIsOnline ? 'Online (Ativo no Site)' : 'Offline (Inativo)'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-950 border border-white/5 rounded-xl p-4 space-y-3">
                        <span className="block text-[10px] uppercase font-mono font-bold text-brand-orange tracking-wider">
                          Permissões Granulares de Acesso
                        </span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <label className="flex items-center space-x-2.5 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={formAdminPermissions.editGeneral}
                              onChange={(e) => setFormAdminPermissions({ ...formAdminPermissions, editGeneral: e.target.checked })}
                              className="rounded border-white/10 text-brand-orange focus:ring-brand-orange"
                            />
                            <span>Textos & Contactos gerais</span>
                          </label>

                          <label className="flex items-center space-x-2.5 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={formAdminPermissions.editProducts}
                              onChange={(e) => setFormAdminPermissions({ ...formAdminPermissions, editProducts: e.target.checked })}
                              className="rounded border-white/10 text-brand-orange focus:ring-brand-orange"
                            />
                            <span>Preçários & Fotos de Produtos</span>
                          </label>

                          <label className="flex items-center space-x-2.5 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={formAdminPermissions.editPartners}
                              onChange={(e) => setFormAdminPermissions({ ...formAdminPermissions, editPartners: e.target.checked })}
                              className="rounded border-white/10 text-brand-orange focus:ring-brand-orange"
                            />
                            <span>Marcas Parceiras</span>
                          </label>

                          <label className="flex items-center space-x-2.5 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={formAdminPermissions.editPortfolio}
                              onChange={(e) => setFormAdminPermissions({ ...formAdminPermissions, editPortfolio: e.target.checked })}
                              className="rounded border-white/10 text-brand-orange focus:ring-brand-orange"
                            />
                            <span>Portfólio & Depoimentos</span>
                          </label>

                          <label className="flex items-center space-x-2.5 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={formAdminPermissions.editGallery}
                              onChange={(e) => setFormAdminPermissions({ ...formAdminPermissions, editGallery: e.target.checked })}
                              className="rounded border-white/10 text-brand-orange focus:ring-brand-orange"
                            />
                            <span>Galeria de Produção Industrial</span>
                          </label>

                          <label className="flex items-center space-x-2.5 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={formAdminPermissions.viewQuotes}
                              onChange={(e) => setFormAdminPermissions({ ...formAdminPermissions, viewQuotes: e.target.checked })}
                              className="rounded border-white/10 text-brand-orange focus:ring-brand-orange"
                            />
                            <span>Visualizar Pedidos de Orçamento</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => { setIsCreatingAdmin(false); setSelectedAdmin(null); }}
                          className="bg-slate-800 hover:bg-slate-750 text-white font-bold py-2 px-5 rounded-xl text-xs cursor-pointer transition-all"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-2 px-5 rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer transition-all"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Guardar Admin</span>
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* CO-ADMIN DELEGATION BANNER */}
                <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-500/30 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-500 text-white text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full">
                        Acesso Imediato
                      </span>
                      <h3 className="text-sm font-display font-bold text-white">
                        Conta de Apoio Pré-Configurada (Gestor)
                      </h3>
                    </div>
                    <p className="text-xs text-slate-300">
                      O seu colega pode aceder ao painel imediatamente com <strong className="text-amber-400">utilizador: gestor</strong> e <strong className="text-amber-400">código: gpa2026</strong>.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const msg = `*Acesso de Gestão - GPA Angola* 🚀\n🔗 Link: ${window.location.origin}\n👤 Utilizador: gestor\n🔑 Código: gpa2026`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center space-x-2 shadow-md cursor-pointer transition-all shrink-0"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Enviar Dados por WhatsApp</span>
                  </button>
                </div>

                {/* ADMINS LIST */}
                <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/5 bg-slate-900/55 flex justify-between items-center">
                    <span className="text-xs font-mono font-bold uppercase text-slate-400">Utilizadores Registados</span>
                    <span className="text-xs font-mono text-slate-500 font-bold">{adminList.length} total</span>
                  </div>

                  <div className="divide-y divide-white/5">
                    {adminList.map((adm) => (
                      <div key={adm.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.01] transition-colors">
                        <div className="space-y-1.5">
                          <div className="flex items-center space-x-3">
                            <span className="font-bold text-sm text-white">{adm.name}</span>
                            <span className="text-xs font-mono text-slate-500">@{adm.username}</span>
                            <span className={`text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded border ${
                              adm.role === 'owner' 
                                ? 'bg-amber-950/40 text-amber-400 border-amber-900/40' 
                                : 'bg-blue-950/40 text-blue-400 border-blue-900/40'
                            }`}>
                              {adm.role === 'owner' ? 'Principal (Owner)' : 'Auxiliar (Staff)'}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {/* Status badge */}
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                              adm.status === 'active' 
                                ? 'bg-emerald-950 text-emerald-400' 
                                : adm.status === 'blocked' 
                                ? 'bg-red-950 text-red-400' 
                                : 'bg-amber-950 text-amber-400'
                            }`}>
                              {adm.status === 'active' && '● Ativo'}
                              {adm.status === 'blocked' && '● Bloqueado'}
                              {adm.status === 'silenced' && '● Silenciado'}
                            </span>

                            {/* Status detail */}
                            {adm.status === 'blocked' && adm.blockExpiresAt && (
                              <span className="text-[10px] text-red-400/80 font-mono">
                                (Até: {new Date(adm.blockExpiresAt).toLocaleDateString()})
                              </span>
                            )}
                            {adm.status === 'silenced' && adm.silenceExpiresAt && (
                              <span className="text-[10px] text-amber-400/80 font-mono">
                                (Até: {new Date(adm.silenceExpiresAt).toLocaleDateString()})
                              </span>
                            )}

                            {/* Passcode preview */}
                            <span className="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded border border-white/5 text-amber-400">
                              Código: {adm.passcode || 'gpa2026'}
                            </span>

                            {/* Permissions list summary */}
                            <span className="text-[10px] text-slate-500">
                              | Permissões: {
                                [
                                  adm.permissions.editGeneral && 'Textos',
                                  adm.permissions.editProducts && 'Preços',
                                  adm.permissions.editPartners && 'Marcas',
                                  adm.permissions.editPortfolio && 'Portfólio',
                                  adm.permissions.editGallery && 'Galeria',
                                  adm.permissions.viewQuotes && 'Orçamentos'
                                ].filter(Boolean).join(', ') || 'Nenhuma'
                              }
                            </span>

                            {adm.whatsappNumber && (
                              <span className="text-[10px] text-emerald-400 font-mono">
                                | WhatsApp: {adm.whatsappNumber}
                              </span>
                            )}

                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                              adm.isOnline ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/30' : 'bg-slate-950 text-slate-500 border border-white/5'
                            }`}>
                              {adm.isOnline ? '● Online no Chat' : '○ Offline no Chat'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              const msg = `*Acesso de Gestão - GPA Angola* 🚀\n🔗 Link: ${window.location.origin}\n👤 Utilizador: ${adm.username}\n🔑 Código: ${adm.passcode || 'gpa2026'}`;
                              window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                            }}
                            className="bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-400 hover:text-white py-1.5 px-2.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center space-x-1"
                            title="Partilhar Dados de Acesso via WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Enviar WhatsApp</span>
                          </button>
                          {adm.id !== 'admin' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleEditAdminClick(adm)}
                                className="bg-slate-800 hover:bg-slate-750 text-white font-semibold py-1.5 px-3 rounded-lg text-xs transition-colors cursor-pointer"
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAdmin(adm.id, adm.name)}
                                className="bg-red-950/40 hover:bg-red-900/60 border border-red-900/40 text-red-400 hover:text-white p-1.5 rounded-lg transition-colors cursor-pointer"
                                title="Remover Administrador"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT: SECURITY SETTINGS */}
            {customModules.filter((module) => module.enabled).map((module) =>
              activeTab === module.id && (
                <motion.div key={module.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-display font-black text-white flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 text-xl" style={{ backgroundColor: `${module.accent}20`, color: module.accent }}>{module.icon}</span>
                        <span>{module.title}</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">{module.description}</p>
                    </div>
                    <div className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300">Módulo Dinâmico</div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="rounded-3xl border border-white/10 bg-slate-900 p-5">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-3">Resumo</div>
                      <div className="text-3xl font-display font-black text-white">24</div>
                      <div className="text-xs text-slate-400 mt-2">Itens ativos nesta área</div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-slate-900 p-5">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-3">Progresso</div>
                      <div className="text-3xl font-display font-black text-white">82%</div>
                      <div className="text-xs text-slate-400 mt-2">Nível de conclusão</div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-slate-900 p-5">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-3">Último update</div>
                      <div className="text-lg font-display font-black text-white">Hoje</div>
                      <div className="text-xs text-slate-400 mt-2">Sincronização automática</div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-display font-bold text-white uppercase tracking-[0.2em]">Configuração rápida</h3>
                      <button
                        type="button"
                        onClick={handleSaveCustomModules}
                        className="bg-gradient-to-r from-brand-orange to-amber-400 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full px-4 py-2"
                      >
                        Guardar módulo
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 mb-2">Título</label>
                        <input
                          type="text"
                          value={module.title}
                          onChange={(e) => setCustomModules((prev) => prev.map((item) => item.id === module.id ? { ...item, title: e.target.value } : item))}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 mb-2">Cor destacada</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={module.accent}
                            onChange={(e) => setCustomModules((prev) => prev.map((item) => item.id === module.id ? { ...item, accent: e.target.value } : item))}
                            className="h-12 w-16 rounded-xl border border-white/10 bg-transparent"
                          />
                          <input
                            type="text"
                            value={module.accent}
                            onChange={(e) => setCustomModules((prev) => prev.map((item) => item.id === module.id ? { ...item, accent: e.target.value } : item))}
                            className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 mb-2">Descrição</label>
                        <textarea
                          rows={3}
                          value={module.description}
                          onChange={(e) => setCustomModules((prev) => prev.map((item) => item.id === module.id ? { ...item, description: e.target.value } : item))}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            )}

            {activeTab === 'security' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <h2 className="text-lg font-display font-bold text-white flex items-center space-x-2">
                    <Lock className="w-5 h-5 text-brand-orange" />
                    <span>Segurança & Código de Acesso</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Alterar o código que dá acesso total a este painel de gestão do website.</p>
                </div>

                <form onSubmit={handleUpdateSecurity} className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">Novo Código de Acesso Administrativo</label>
                    <div className="relative">
                      <input
                        type={showSecurityPasscode ? "text" : "password"}
                        value={newPasscode}
                        onChange={(e) => setNewPasscode(e.target.value)}
                        placeholder="Introduza a nova senha"
                        className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl pl-4 pr-11 py-3 text-sm text-white focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecurityPasscode(!showSecurityPasscode)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title={showSecurityPasscode ? "Ocultar Código" : "Mostrar Código"}
                      >
                        {showSecurityPasscode ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-3 px-4 rounded-xl shadow cursor-pointer transition-colors text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Atualizar Código</span>
                  </button>
                </form>
              </motion.div>
            )}

            {/* TAB CONTENT: COMERCIAL WHATSAPP STATUS */}
            {activeTab === 'comercial' && currentAdmin && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <h2 className="text-lg font-display font-bold text-white flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-emerald-400" />
                    <span>Atendimento WhatsApp Comercial</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Defina o seu número de WhatsApp e o seu estado de disponibilidade. Quando estiver "Online", os clientes poderão escolher falar consigo diretamente a partir do botão flutuante de chat do site!
                  </p>
                </div>

                <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1.5">O Seu Nome de Comercial</label>
                      <input
                        type="text"
                        value={currentAdmin.name || ''}
                        disabled
                        className="w-full bg-slate-950/50 border border-white/5 rounded-xl py-2.5 px-3.5 text-xs text-slate-400 font-medium cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1.5">Nome de Utilizador</label>
                      <input
                        type="text"
                        value={currentAdmin.username || ''}
                        disabled
                        className="w-full bg-slate-950/50 border border-white/5 rounded-xl py-2.5 px-3.5 text-xs text-slate-400 font-mono cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1.5">Número de WhatsApp (com indicativo)</label>
                      <input
                        type="text"
                        placeholder="Ex: +244 994 943 828"
                        value={currentAdmin.whatsappNumber || ''}
                        onChange={(e) => {
                          const updated = { ...currentAdmin, whatsappNumber: e.target.value };
                          setCurrentAdmin(updated);
                        }}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:border-brand-orange focus:outline-none font-mono"
                      />
                      <span className="text-[10px] text-slate-500 block mt-1">
                        Utilize o formato internacional com o indicativo (ex: +244 ...).
                      </span>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono text-slate-400 mb-2">Estado de Disponibilidade</label>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...currentAdmin, isOnline: !currentAdmin.isOnline };
                            setCurrentAdmin(updated);
                          }}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            currentAdmin.isOnline ? 'bg-emerald-500' : 'bg-slate-700'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              currentAdmin.isOnline ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span className={`text-xs font-semibold ${currentAdmin.isOnline ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {currentAdmin.isOnline ? 'Online (Disponível no Site)' : 'Offline (Invisível no Site)'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-2">
                        Quando ativo, o seu perfil e número serão listados no assistente virtual para os clientes iniciarem conversas diretas.
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-5 flex justify-end">
                    <button
                      type="button"
                      onClick={async () => {
                        setIsLoading(true);
                        try {
                          await saveAdminUser(currentAdmin);
                          // Also store in sessionStorage
                          sessionStorage.setItem('gpa_current_admin', JSON.stringify(currentAdmin));
                          showStatus('Status e dados de contacto atualizados com sucesso!');
                          if (onRefreshSiteData) onRefreshSiteData();
                        } catch (err) {
                          showStatus('Erro ao atualizar dados de contacto comercial', true);
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl text-xs flex items-center space-x-2 shadow-md cursor-pointer transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Salvar Configuração Comercial</span>
                    </button>
                  </div>
                </div>

                {/* MONITOR DE CHATS DO ASSISTENTE VIRTUAL */}
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-display font-bold text-white flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      <span>Monitor de Conversas do Assistente Virtual (Lito)</span>
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Acompanhe em tempo real todas as interações dos clientes com o assistente virtual. Pode aceder aos históricos para auxiliar o atendimento caso o cliente precise de ajuda direta.
                    </p>
                  </div>

                  {assistantChats.length === 0 ? (
                    <div className="border border-dashed border-white/10 rounded-xl p-8 text-center text-xs text-slate-500">
                      Nenhuma conversa ativa com o assistente neste momento.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[350px]">
                      {/* Chat Sessions list */}
                      <div className="lg:col-span-5 space-y-2 max-h-[400px] overflow-y-auto pr-1">
                        {assistantChats.map((chat) => {
                          const isSelected = selectedChat?.id === chat.id;
                          const lastMsg = chat.messages[chat.messages.length - 1];
                          const activeDate = new Date(chat.lastActive);
                          const activeTime = activeDate.toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' });
                          return (
                            <button
                              key={chat.id}
                              type="button"
                              onClick={() => setSelectedChat(chat)}
                              className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col space-y-1.5 ${
                                isSelected 
                                  ? 'bg-emerald-500/10 border-emerald-500/30' 
                                  : 'bg-slate-950/40 border-white/5 hover:border-white/15'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-display font-bold text-xs text-slate-200">
                                  {chat.clientName}
                                </span>
                                <span className="text-[9px] text-slate-500 font-mono">
                                  {activeTime}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 truncate max-w-xs">
                                {lastMsg ? lastMsg.text : 'Sem mensagens.'}
                              </div>
                              <div className="flex items-center justify-between text-[9px] text-slate-500">
                                <span>{chat.messages.length} mensagens</span>
                                <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
                                  Em Direto
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Selected Chat Detail bubbles */}
                      <div className="lg:col-span-7 bg-slate-950/60 rounded-xl border border-white/5 flex flex-col h-[400px]">
                        {selectedChat ? (
                          <>
                            {/* Header of selected chat */}
                            <div className="p-3.5 border-b border-white/5 bg-slate-950/80 rounded-t-xl flex items-center justify-between">
                              <div>
                                <h4 className="font-display font-bold text-xs text-white">
                                  {selectedChat.clientName}
                                </h4>
                                <span className="text-[9px] text-slate-500">
                                  Última Atividade: {new Date(selectedChat.lastActive).toLocaleString('pt-PT')}
                                </span>
                              </div>
                              <a
                                href={`https://wa.me/${(currentAdmin.whatsappNumber || '').replace(/\s+/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer transition-all"
                              >
                                <Phone className="w-3 h-3" />
                                <span>Dar Suporte Direto</span>
                              </a>
                            </div>

                            {/* Chat messages stream list */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
                              {selectedChat.messages.map((msg, idx) => {
                                const isBot = msg.sender === 'bot';
                                return (
                                  <div
                                    key={msg.id || idx}
                                    className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
                                  >
                                    <div
                                      className={`max-w-[85%] rounded-2xl p-3 text-xs shadow-md ${
                                        isBot
                                          ? 'bg-slate-900 border border-white/5 text-slate-200 rounded-tl-none'
                                          : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-tr-none'
                                      }`}
                                    >
                                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                      <div className={`text-[9px] mt-1.5 flex items-center justify-end space-x-1 ${
                                        isBot ? 'text-slate-500' : 'text-emerald-500'
                                      }`}>
                                        <span>{msg.timestamp}</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-6 text-center space-y-2">
                            <MessageCircle className="w-8 h-8 text-slate-600 animate-pulse" />
                            <p className="text-xs">Selecione uma conversa da lista para ver o histórico completo das mensagens do assistente.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          </main>
        </div>
      )}

      {/* PRODUCT CREATION & EDITING MODAL */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative my-8"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-display font-bold text-white">
                      {editingProduct ? 'Editar Produto da Loja' : 'Novo Produto da Loja'}
                    </h3>
                    <p className="text-xs text-slate-400">Preencha os detalhes comerciais do produto</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="text-slate-400 hover:text-white p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveStoreProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1">Nome do Produto</label>
                  <input
                    type="text"
                    required
                    value={prodForm.name}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                    placeholder="Ex: Cartões de Visita Premium"
                    className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1">Categoria</label>
                    <select
                      value={prodForm.category}
                      onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                      className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                    >
                      <option value="impressao">Artes Gráficas (Impressão)</option>
                      <option value="textil">Têxtil & Uniformes</option>
                      <option value="design">Design & Branding</option>
                      <option value="marketing">Marketing & Web</option>
                      <option value="audiovisual">Audiovisual</option>
                      <option value="brindes">Brindes Corporativos</option>
                      <option value="sinaletica">Sinalética & Stands</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1">Preço Unitário (AOA / Kwanzas)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={prodForm.price}
                      onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                      placeholder="Ex: 5000"
                      className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1">Quantidade Mínima de Encomenda</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={prodForm.minQty}
                      onChange={(e) => setProdForm({ ...prodForm, minQty: Number(e.target.value) })}
                      placeholder="Ex: 100"
                      className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1">Selo Destaque (Badge Opcional)</label>
                    <input
                      type="text"
                      value={prodForm.badge}
                      onChange={(e) => setProdForm({ ...prodForm, badge: e.target.value })}
                      placeholder="Ex: Popular, Novo, Mais Vendido"
                      className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1">Descrição Comercial</label>
                  <textarea
                    rows={3}
                    required
                    value={prodForm.description}
                    onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                    placeholder="Descrição detalhada do material, acabamento ou serviço..."
                    className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1">Imagem do Produto (URL ou Ficheiro)</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      required
                      value={prodForm.imageUrl}
                      onChange={(e) => setProdForm({ ...prodForm, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                    />

                    <div className="flex items-center justify-between bg-slate-950/60 border border-white/10 p-2.5 rounded-xl">
                      <div className="flex items-center space-x-3">
                        {prodForm.imageUrl ? (
                          <img
                            src={prodForm.imageUrl}
                            alt="Preview"
                            className="w-10 h-10 object-cover rounded-lg border border-white/10"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-slate-600 text-[10px]">
                            Sem Foto
                          </div>
                        )}
                        <span className="text-xs text-slate-400 font-medium">Carregar foto do computador</span>
                      </div>

                      <label className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center space-x-1">
                        <Upload className="w-3.5 h-3.5 text-brand-orange" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, (base64) => setProdForm({ ...prodForm, imageUrl: base64 }))}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setProdForm({ ...prodForm, inStock: !prodForm.inStock })}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      prodForm.inStock ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        prodForm.inStock ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className={`text-xs font-semibold ${prodForm.inStock ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {prodForm.inStock ? 'Disponível em Stock' : 'Produto Esgotado / Sob Consulta'}
                  </span>
                </div>

                <div className="flex justify-end space-x-3 border-t border-white/10 pt-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-slate-300 hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold cursor-pointer transition-colors shadow-md flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingProduct ? 'Guardar Alterações' : 'Criar Produto'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* CATEGORY EDIT/CREATE MODAL */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-display font-bold text-white flex items-center space-x-2">
                  <Tag className="w-5 h-5 text-brand-orange" />
                  <span>{editingCategory ? 'Editar Categoria' : 'Nova Categoria da Loja'}</span>
                </h3>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCategorySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1">Nome da Categoria</label>
                  <input
                    type="text"
                    value={catForm.name}
                    onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                    placeholder="Ex: Artes Gráficas"
                    className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1">Identificador / Slug (Filtro)</label>
                  <input
                    type="text"
                    value={catForm.slug}
                    onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                    placeholder="Ex: impressao"
                    className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1">Destaque / Badge</label>
                  <input
                    type="text"
                    value={catForm.badge || ''}
                    onChange={(e) => setCatForm({ ...catForm, badge: e.target.value })}
                    placeholder="Ex: Produção Offset 24h"
                    className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1">Descrição Curta</label>
                  <textarea
                    value={catForm.description}
                    onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                    rows={2}
                    className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1">Link ou Ficheiro da Imagem de Capa</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={catForm.imageUrl}
                      onChange={(e) => setCatForm({ ...catForm, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                    <label className="bg-white/10 hover:bg-white/15 border border-white/15 px-3 py-2 rounded-xl text-xs font-bold text-white cursor-pointer flex items-center space-x-1">
                      <Upload className="w-3.5 h-3.5 text-brand-orange" />
                      <span>Enviar</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, (url) => setCatForm({ ...catForm, imageUrl: url }))}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {catForm.imageUrl && (
                  <div className="h-32 rounded-xl overflow-hidden bg-slate-950 border border-white/10">
                    <img src={catForm.imageUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}

                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 text-xs font-semibold hover:bg-white/5 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-md cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Categoria</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* SERVICE EDIT MODAL */}
        {isServiceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-xl w-full space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-display font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-brand-orange" />
                  <span>Editar Serviço Industrial: {editingService?.title}</span>
                </h3>
                <button
                  onClick={() => setIsServiceModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveServiceSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1">Título do Serviço</label>
                  <input
                    type="text"
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1">Ícone (Nome Lucide)</label>
                    <input
                      type="text"
                      value={serviceForm.iconName}
                      onChange={(e) => setServiceForm({ ...serviceForm, iconName: e.target.value })}
                      placeholder="Ex: Printer, Shirt, Palette"
                      className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1">Badge de Destaque</label>
                    <input
                      type="text"
                      value={serviceForm.badge || ''}
                      onChange={(e) => setServiceForm({ ...serviceForm, badge: e.target.value })}
                      placeholder="Ex: Tecnologia Offset"
                      className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1">Descrição Resumida</label>
                  <textarea
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    rows={2}
                    className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1">Descrição Completa</label>
                  <textarea
                    value={serviceForm.fullDescription}
                    onChange={(e) => setServiceForm({ ...serviceForm, fullDescription: e.target.value })}
                    rows={4}
                    className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1">Fotografia Temática / Capa Industrial (URL ou Ficheiro)</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={serviceForm.imageUrl || ''}
                      onChange={(e) => setServiceForm({ ...serviceForm, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                    <label className="bg-white/10 hover:bg-white/15 border border-white/15 px-3 py-2 rounded-xl text-xs font-bold text-white cursor-pointer flex items-center space-x-1">
                      <Upload className="w-3.5 h-3.5 text-brand-orange" />
                      <span>Enviar</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, (url) => setServiceForm({ ...serviceForm, imageUrl: url }))}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {serviceForm.imageUrl && (
                  <div className="h-40 rounded-xl overflow-hidden bg-slate-950 border border-white/10">
                    <img src={serviceForm.imageUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}

                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsServiceModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 text-xs font-semibold hover:bg-white/5 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-md cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Alterações do Serviço</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CREATE/EDIT ADMIN USER MODAL */}
        {isCreatingAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-display font-bold text-white flex items-center space-x-2">
                  <Users className="w-5 h-5 text-brand-orange" />
                  <span>{selectedAdmin ? 'Editar Utilizador Admin' : 'Criar Novo Utilizador Admin'}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCreatingAdmin(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAdminUserSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={formAdminName}
                    onChange={(e) => setFormAdminName(e.target.value)}
                    placeholder="Ex: Carlos Silva"
                    className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1">Nome de Utilizador (@username)</label>
                  <input
                    type="text"
                    value={formAdminUsername}
                    onChange={(e) => setFormAdminUsername(e.target.value)}
                    placeholder="Ex: csilva"
                    className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1">Palavra-passe / Passcode</label>
                  <input
                    type="text"
                    value={formAdminPasscode}
                    onChange={(e) => setFormAdminPasscode(e.target.value)}
                    placeholder="Ex: gpa2026"
                    className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 font-bold mb-1">Função / Função no Sistema</label>
                  <select
                    value={formAdminRole}
                    onChange={(e) => setFormAdminRole(e.target.value as any)}
                    className="w-full bg-slate-950 border border-white/15 focus:border-brand-orange rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="superadmin">Super Admin (Acesso Total)</option>
                    <option value="gestor_comercial">Gestor Comercial</option>
                    <option value="gestor_produtos">Gestor de Produtos</option>
                    <option value="editor_conteudo">Editor de Conteúdo</option>
                    <option value="staff">Staff / Assistente</option>
                  </select>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-white/10 space-y-3">
                  <label className="block text-xs font-mono uppercase text-brand-orange font-bold">Permissões Específicas de Acesso</label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formAdminPermissions as any).canManageConfig ?? true}
                        onChange={(e) => setFormAdminPermissions({ ...formAdminPermissions, canManageConfig: e.target.checked } as any)}
                        className="rounded border-white/20 bg-slate-900 text-brand-orange focus:ring-brand-orange"
                      />
                      <span>Textos & Contactos</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formAdminPermissions as any).canManageProducts ?? true}
                        onChange={(e) => setFormAdminPermissions({ ...formAdminPermissions, canManageProducts: e.target.checked } as any)}
                        className="rounded border-white/20 bg-slate-900 text-brand-orange focus:ring-brand-orange"
                      />
                      <span>Produtos da Loja</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formAdminPermissions as any).canManageCategories ?? true}
                        onChange={(e) => setFormAdminPermissions({ ...formAdminPermissions, canManageCategories: e.target.checked } as any)}
                        className="rounded border-white/20 bg-slate-900 text-brand-orange focus:ring-brand-orange"
                      />
                      <span>Categorias da Loja</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formAdminPermissions as any).canManageServices ?? true}
                        onChange={(e) => setFormAdminPermissions({ ...formAdminPermissions, canManageServices: e.target.checked } as any)}
                        className="rounded border-white/20 bg-slate-900 text-brand-orange focus:ring-brand-orange"
                      />
                      <span>Serviços & Fotografias</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formAdminPermissions as any).canManageGallery ?? true}
                        onChange={(e) => setFormAdminPermissions({ ...formAdminPermissions, canManageGallery: e.target.checked } as any)}
                        className="rounded border-white/20 bg-slate-900 text-brand-orange focus:ring-brand-orange"
                      />
                      <span>Galeria de Produção</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formAdminPermissions as any).canManageQuotes ?? true}
                        onChange={(e) => setFormAdminPermissions({ ...formAdminPermissions, canManageQuotes: e.target.checked } as any)}
                        className="rounded border-white/20 bg-slate-900 text-brand-orange focus:ring-brand-orange"
                      />
                      <span>Orçamentos de Clientes</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer col-span-2 pt-1 border-t border-white/5">
                      <input
                        type="checkbox"
                        checked={(formAdminPermissions as any).canManageUsers ?? false}
                        onChange={(e) => setFormAdminPermissions({ ...formAdminPermissions, canManageUsers: e.target.checked } as any)}
                        className="rounded border-white/20 bg-slate-900 text-brand-orange focus:ring-brand-orange"
                      />
                      <span className="font-bold text-amber-300">Gestão de Outros Utilizadores (Gerir Equipa)</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsCreatingAdmin(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 text-xs font-semibold hover:bg-white/5 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-md cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Utilizador</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
