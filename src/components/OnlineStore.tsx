import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, Search, Filter, ShoppingBag, ArrowRight, Check, AlertCircle, 
  Trash2, Plus, Minus, FileSpreadsheet, Grid, List, Phone, Percent, Tag, ShieldAlert, X
} from 'lucide-react';
import { SiteConfig, getNextCommercialRotation } from '../firebaseClient';
import { StoreProduct } from '../types';
import { DEFAULT_STORE_PRODUCTS } from '../data';

interface OnlineStoreProps {
  siteConfig: SiteConfig | null;
  onOpenQuoteWithDetails: (serviceId?: string, productName?: string) => void;
  storeProducts?: StoreProduct[] | null;
}

interface CartItem {
  product: string;
  price: number;
  quantity: number;
  minQty: number;
  category: string;
}

const CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'impressao', label: 'Artes Gráficas' },
  { id: 'textil', label: 'Têxtil & Uniformes' },
  { id: 'design', label: 'Design & Branding' },
  { id: 'marketing', label: 'Marketing & Web' },
  { id: 'audiovisual', label: 'Audiovisual' },
  { id: 'brindes', label: 'Brindes Corporativos' },
  { id: 'sinaletica', label: 'Sinalética & Stands' }
];

const PRODUCT_IMAGES: Record<string, string> = {
  'Cartões de Visita Premium': 'https://images.unsplash.com/photo-1589149098258-3e9102ca63d3?auto=format&fit=crop&w=600&q=80',
  'Panfletos e Flyers': 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80',
  'Catálogos Corporativos': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
  'Calendários e Agendas': 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80',
  'Envelopes e Papel Timbrado': 'https://images.unsplash.com/photo-1598425237654-4fc758e50a93?auto=format&fit=crop&w=600&q=80',
  
  'T-shirts Promocionais': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
  'Polos Corporativos Bordados': 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80',
  'Fardas para Indústria e Restauração': 'https://images.unsplash.com/photo-157857437130-527eed3abbec?auto=format&fit=crop&w=600&q=80',
  'Bonés e Viseiras': 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80',
  'Coletes de Segurança Personalizados': 'https://images.unsplash.com/photo-1590402444587-438e6d7edd25?auto=format&fit=crop&w=600&q=80',
  
  'Logótipo & Manual de Marca': 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
  'Design de Embalagens': 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
  'Artes de Redes Sociais': 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=600&q=80',
  'Design de Flyers e Banners': 'https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&w=600&q=80',
  'Layouts para Stands': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
  
  'Pacotes Mensais de Social Media': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
  'Configuração de Campanhas de Anúncios': 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80',
  'Copywriting de Vendas': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
  'Landing Pages para Conversão': 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
  'Auditoria de Presença Digital': 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=600&q=80',
  
  'Vídeos Institucionais': 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80',
  'Spots Publicitários de 15s/30s': 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
  'Vídeo Reportagem de Eventos': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
  'Sessões Fotográficas de Equipa': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80',
  'Motion Graphics Explicativos': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
  
  'Canecas de Cerâmica & Garrafas Térmicas': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
  'Canetas Metálicas Gravadas a Laser': 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80',
  'Blocos de Notas e Agendas': 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=80',
  'Sacos Ecológicos (Tote Bags)': 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
  'Pens USB & Powerbanks': 'https://images.unsplash.com/photo-1624996379697-f01d168b1a52?auto=format&fit=crop&w=600&q=80',
  
  'Placas de Sinalização Interna/Externa': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
  'Decoração Integral ou Parcial de Viaturas': 'https://images.unsplash.com/photo-1516515429572-1f9f3b539443?auto=format&fit=crop&w=600&q=80',
  'Reclames Luminosos 3D': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
  'Lonas Publicitárias com Ilhós': 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?auto=format&fit=crop&w=600&q=80',
  'Roll-ups Autoportantes': 'https://images.unsplash.com/photo-1533750349088-cd871a91515c?auto=format&fit=crop&w=600&q=80',
  'Stands Personalizados (Carpintaria)': 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80',
  'Stands Modulares para Feiras': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
  'Balcões de Atendimento e Displays': 'https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&w=600&q=80',
  'Backdrops de Conferência Gigantes': 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
  'Roll-ups e Pop-ups Promocionais': 'https://images.unsplash.com/photo-1542744173-8e0ee26bf15a?auto=format&fit=crop&w=600&q=80'
};

export default function OnlineStore({ siteConfig, onOpenQuoteWithDetails, storeProducts }: OnlineStoreProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<'destaques' | 'preco-asc' | 'preco-desc' | 'nome-asc'>('destaques');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Dynamic products configuration from Firestore config or defaults
  const productPrices = siteConfig?.productPrices || {};
  const productMinQtys = siteConfig?.productMinQtys || {};

  // List of all products mapped to categories
  const productsList = useMemo(() => {
    const activeProducts = storeProducts && storeProducts.length > 0 ? storeProducts : DEFAULT_STORE_PRODUCTS;
    return activeProducts.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: productPrices[p.name] !== undefined ? productPrices[p.name] : p.price,
      minQty: productMinQtys[p.name] !== undefined ? productMinQtys[p.name] : p.minQty,
      description: p.description,
      imageUrl: p.imageUrl,
      badge: p.badge,
      inStock: p.inStock
    }));
  }, [storeProducts, productPrices, productMinQtys]);

  // Filtered and Sorted list
  const filteredProducts = useMemo(() => {
    let list = productsList.filter((p) => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortOption === 'preco-asc') {
      list = [...list].sort((a, b) => (a.price || 999999) - (b.price || 999999));
    } else if (sortOption === 'preco-desc') {
      list = [...list].sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortOption === 'nome-asc') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [productsList, selectedCategory, searchTerm, sortOption]);

  const categoryShowcase = [
    { id: 'impressao', title: 'Arte Gráfica', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80' },
    { id: 'textil', title: 'Têxtil & Uniformes', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80' },
    { id: 'design', title: 'Branding & Design', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80' },
    { id: 'marketing', title: 'Marketing Digital', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80' },
    { id: 'audiovisual', title: 'Audiovisual', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80' },
    { id: 'brindes', title: 'Brindes Corporativos', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80' },
    { id: 'sinaletica', title: 'Sinalética & Stands', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80' }
  ];

  // Cart operations
  const addToCart = (productName: string, price: number, minQty: number, category: string, customQty?: number) => {
    const qtyToAdd = customQty && customQty >= minQty ? customQty : minQty;
    
    setCart((prev) => {
      const existing = prev.find((item) => item.product === productName);
      if (existing) {
        return prev.map((item) => 
          item.product === productName 
            ? { ...item, quantity: qtyToAdd } 
            : item
        );
      }
      return [...prev, { product: productName, price, quantity: qtyToAdd, minQty, category }];
    });
    
    setIsCartOpen(true);
  };

  const updateCartQty = (productName: string, qty: number) => {
    setCart((prev) => 
      prev.map((item) => {
        if (item.product === productName) {
          const validQty = Math.max(item.minQty, qty);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productName: string) => {
    setCart((prev) => prev.filter((item) => item.product !== productName));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      if (item.price === 0) return sum;
      return sum + (item.price * item.quantity);
    }, 0);
  }, [cart]);

  // Format Whatsapp message with order details dynamically utilizing round-robin commercial rotation
  const handleWhatsAppCheckout = async () => {
    if (cart.length === 0) return;
    
    const rep = await getNextCommercialRotation();
    
    let message = `🛒 *PEDIDO DE COMPRA / ENCOMENDA - LOJA ONLINE GPA ANGOLA*\n`;
    message += `-----------------------------------------------\n`;
    if (rep) {
      message += `👤 *Gestor Comercial:* ${rep.name}\n`;
    }
    message += `📅 *Data:* ${new Date().toLocaleDateString('pt-AO')}\n`;
    message += `-----------------------------------------------\n\n`;
    
    cart.forEach((item, idx) => {
      const priceText = item.price > 0 ? `${(item.price * item.quantity).toLocaleString('pt-AO')} Kz` : 'Sob Consulta';
      message += `📦 *${idx + 1}. ${item.product}*\n`;
      message += `   • *Quantidade:* ${item.quantity.toLocaleString('pt-AO')} un. (Mín: ${item.minQty})\n`;
      message += `   • *Subtotal:* ${priceText}\n\n`;
    });

    const totalCalculated = cart.some(item => item.price === 0) 
      ? `Sob Consulta (Com itens industriais)` 
      : `${cartTotal.toLocaleString('pt-AO')} Kz`;

    message += `-----------------------------------------------\n`;
    message += `💰 *TOTAL DO PEDIDO:* *${totalCalculated}*\n`;
    message += `-----------------------------------------------\n`;
    message += `_Mensagem enviada via gpa.co.ao_`;

    let cleanPhone = '';
    if (rep && rep.whatsappNumber) {
      cleanPhone = rep.whatsappNumber.replace(/\s+/g, '').replace('+', '').replace('-', '');
    } else {
      cleanPhone = (siteConfig?.whatsappNumber || '244994943828').replace(/\s+/g, '').replace('+', '').replace('-', '');
    }

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="store" className="py-20 bg-white border-t border-b border-slate-100 scroll-mt-12 relative">
      
      {/* Visual background accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-orange/5 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-purple/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-block text-xs font-mono font-bold tracking-widest text-brand-orange uppercase bg-brand-orange/10 px-3.5 py-1 rounded-full">
            Loja Online Industrial & Catálogo
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-slate-900 leading-tight">
            Selecione Seus Produtos & Faça a Encomenda Direta
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
            Navegue pelo nosso preçário oficial corporativo. Ajuste a quantidade respeitando o <strong className="text-brand-orange">mínimo exigido</strong> pela instituição e finalize no WhatsApp comercial ou solicite um orçamento detalhado.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
          {categoryShowcase.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`group relative overflow-hidden rounded-[28px] border text-left transition-all duration-300 ${selectedCategory === cat.id ? 'border-brand-orange shadow-[0_18px_35px_rgba(245,158,11,0.18)]' : 'border-slate-200 bg-white hover:border-slate-300'}`}
            >
              <img src={cat.image} alt={cat.title} className="h-36 w-full object-cover transition duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-orange-200">Categoria</div>
                <h3 className="mt-2 text-lg font-display font-black text-white">{cat.title}</h3>
              </div>
            </button>
          ))}
        </div>

        {/* Toolbar: Category Filters, Search & View Switcher */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-4 sm:p-6 mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between shadow-xs">
          
          {/* Categories Horizontal Scroller */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none max-w-full -mx-4 px-4 md:mx-0 md:px-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

            {/* Search Input, Sort & Toggle Mode */}
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquisar produto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/10 rounded-2xl pl-10 pr-4 py-2 text-xs font-sans text-gray-800 outline-none transition-all"
                />
              </div>

              {/* Sort Selector Dropdown */}
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="bg-white border border-slate-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/10 rounded-2xl px-3 py-2 text-xs font-sans font-medium text-slate-800 outline-none cursor-pointer"
              >
                <option value="destaques">✨ Destaques</option>
                <option value="preco-asc">⬇️ Menor Preço</option>
                <option value="preco-desc">⬆️ Maior Preço</option>
                <option value="nome-asc">🔤 Nome (A-Z)</option>
              </select>

            <div className="flex items-center border border-slate-200 bg-white rounded-2xl p-1 shadow-2xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-xl cursor-pointer transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-slate-100 text-brand-orange' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Ver Catálogo em Grelha"
              >
                <Grid className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-xl cursor-pointer transition-all ${
                  viewMode === 'table' 
                    ? 'bg-slate-100 text-brand-orange' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Ver Tabela de Preçário"
              >
                <FileSpreadsheet className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>

        {/* MAIN STORE CONTAINER */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200/60 max-w-md mx-auto">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">Nenhum produto encontrado</p>
            <p className="text-xs text-slate-400 mt-1">Experimente remover os filtros de pesquisa.</p>
          </div>
        ) : viewMode === 'grid' ? (
          
          /* VIEW 1: GRID MODE CATALOG */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((p) => {
              const isInCart = cart.some((item) => item.product === p.name);
              const cartItem = cart.find((item) => item.product === p.name);
              const currentQty = cartItem ? cartItem.quantity : p.minQty;

              return (
                <div
                  key={p.name}
                  className={`bg-white border rounded-[2rem] p-4 flex flex-col justify-between transition-all duration-500 ease-out select-none hover:shadow-xl hover:border-slate-300 hover:scale-[1.02] relative overflow-hidden group ${
                    isInCart ? 'border-brand-orange bg-brand-orange/[0.01]' : 'border-slate-200/80'
                  }`}
                >
                  {/* Premium Product Image Container - Poytara Style */}
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 relative mb-4">
                    <img
                      src={p.imageUrl || siteConfig?.productImages?.[p.name] || PRODUCT_IMAGES[p.name] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      referrerPolicy="no-referrer"
                    />
                    {p.badge && (
                      <span className="absolute top-2.5 left-2.5 bg-brand-orange text-white text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full shadow-md z-10">
                        {p.badge}
                      </span>
                    )}
                    <div className="absolute top-2.5 right-2.5 w-8.5 h-8.5 bg-black/40 backdrop-blur-md rounded-xl flex items-center justify-center pointer-events-none transition-colors group-hover:bg-brand-orange/95">
                      <ShoppingBag className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 py-0.5 px-2 rounded-md">
                        {CATEGORIES.find(c => c.id === p.category)?.label || 'Gráfica'}
                      </span>
                      <h3 className="font-display font-bold text-sm text-slate-900 mt-2 line-clamp-2 min-h-[40px] leading-snug">
                        {p.name}
                      </h3>
                    </div>

                    <div className="space-y-1.5 border-t border-slate-100 pt-3">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[10px] text-slate-400 font-sans">Preço Unitário:</span>
                        <span className="font-mono font-extrabold text-sm text-brand-purple">
                          {p.price > 0 ? `${p.price.toLocaleString('pt-AO')} Kz` : 'Sob Consulta'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-[10px] text-amber-700 bg-amber-50/70 border border-amber-100 px-2 py-1 rounded-lg">
                        <span className="font-sans font-semibold">Tiragem Mínima Exigida:</span>
                        <span className="font-mono font-extrabold">{p.minQty.toLocaleString('pt-AO')} un.</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 space-y-3">
                    {/* Interactive Quantity Selection for Catalog card */}
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl p-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const nextQty = currentQty - (p.minQty >= 100 ? 50 : p.minQty >= 10 ? 5 : 1);
                          if (isInCart) {
                            updateCartQty(p.name, nextQty);
                          } else {
                            addToCart(p.name, p.price, p.minQty, p.category, Math.max(p.minQty, nextQty));
                          }
                        }}
                        disabled={currentQty <= p.minQty}
                        className="p-1 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-slate-600"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      
                      <div className="text-center">
                        <span className="font-mono text-xs font-black text-slate-900 block">
                          {currentQty.toLocaleString('pt-AO')}
                        </span>
                        <span className="text-[8px] text-slate-400 block font-sans">unidades</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const nextQty = currentQty + (p.minQty >= 100 ? 50 : p.minQty >= 10 ? 5 : 1);
                          if (isInCart) {
                            updateCartQty(p.name, nextQty);
                          } else {
                            addToCart(p.name, p.price, p.minQty, p.category, nextQty);
                          }
                        }}
                        className="p-1 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer text-slate-600"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(p.name, p.price, p.minQty, p.category, currentQty)}
                      className={`w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-2xl text-xs font-semibold cursor-pointer transition-all ${
                        isInCart 
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs' 
                          : 'bg-brand-orange hover:bg-brand-orange-hover text-white shadow-xs'
                      }`}
                    >
                      {isInCart ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Adicionado ({currentQty.toLocaleString('pt-AO')} un)</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Adicionar à Encomenda</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          
          /* VIEW 2: SPREADSHEET HIGH-VISIBILITY TABLE MODE */
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md overflow-x-auto select-none">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-900 text-white font-display text-xs tracking-wider uppercase">
                  <th className="px-6 py-4.5 font-semibold">Artigo / Artigo Corporativo</th>
                  <th className="px-6 py-4.5 font-semibold">Categoria</th>
                  <th className="px-6 py-4.5 font-semibold">Preço Unitário Base</th>
                  <th className="px-6 py-4.5 font-semibold text-center">Qtd Mínima GPA</th>
                  <th className="px-6 py-4.5 font-semibold text-center">Quantidade Desejada</th>
                  <th className="px-6 py-4.5 font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-sans text-slate-700">
                {filteredProducts.map((p) => {
                  const isInCart = cart.some((item) => item.product === p.name);
                  const cartItem = cart.find((item) => item.product === p.name);
                  const currentQty = cartItem ? cartItem.quantity : p.minQty;

                  return (
                    <tr 
                      key={p.name} 
                      className={`hover:bg-slate-50/50 transition-colors ${
                        isInCart ? 'bg-brand-orange/[0.02]' : ''
                      }`}
                    >
                      <td className="px-6 py-4.5">
                        <div className="flex items-center space-x-3">
                          <img
                            src={siteConfig?.productImages?.[p.name] || PRODUCT_IMAGES[p.name] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'}
                            alt={p.name}
                            className="w-12 h-12 object-cover rounded-xl border border-slate-100/80 flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-semibold text-slate-900 block leading-snug">{p.name}</span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">Produzido no parque industrial de Viana</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4.5">
                        <span className="bg-slate-100 text-slate-600 font-mono font-bold text-[10px] uppercase py-1 px-2.5 rounded-full">
                          {CATEGORIES.find(c => c.id === p.category)?.label || 'Gráfica'}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 font-mono font-bold text-slate-800">
                        {p.price > 0 ? `${p.price.toLocaleString('pt-AO')} Kz` : 'Sob Consulta'}
                      </td>
                      <td className="px-6 py-4.5 text-center">
                        <span className="bg-amber-100/60 text-amber-800 font-bold font-mono py-1 px-2.5 rounded-lg border border-amber-200/50 text-xs">
                          {p.minQty.toLocaleString('pt-AO')} un.
                        </span>
                      </td>
                      <td className="px-6 py-4.5">
                        <div className="flex items-center justify-center space-x-2 max-w-[120px] mx-auto">
                          <button
                            type="button"
                            onClick={() => {
                              const nextQty = currentQty - (p.minQty >= 100 ? 50 : p.minQty >= 10 ? 5 : 1);
                              if (isInCart) {
                                updateCartQty(p.name, nextQty);
                              } else {
                                addToCart(p.name, p.price, p.minQty, p.category, Math.max(p.minQty, nextQty));
                              }
                            }}
                            disabled={currentQty <= p.minQty}
                            className="p-1 rounded-md bg-slate-100 border border-slate-200 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5 text-slate-600" />
                          </button>
                          <span className="font-mono text-xs font-bold text-slate-900 w-12 text-center">
                            {currentQty}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const nextQty = currentQty + (p.minQty >= 100 ? 50 : p.minQty >= 10 ? 5 : 1);
                              if (isInCart) {
                                updateCartQty(p.name, nextQty);
                              } else {
                                addToCart(p.name, p.price, p.minQty, p.category, nextQty);
                              }
                            }}
                            className="p-1 rounded-md bg-slate-100 border border-slate-200 hover:bg-slate-200 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 text-slate-600" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4.5 text-right">
                        <button
                          type="button"
                          onClick={() => addToCart(p.name, p.price, p.minQty, p.category, currentQty)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                            isInCart 
                              ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                              : 'bg-brand-orange hover:bg-brand-orange-hover text-white shadow-xs'
                          }`}
                        >
                          {isInCart ? (
                            <span className="flex items-center space-x-1.5">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Ok</span>
                            </span>
                          ) : (
                            <span>Selecionar</span>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Informative Quality Note below tables */}
        <div className="mt-6 p-4.5 bg-[#fbfbfb]/80 border border-slate-200 rounded-2xl flex items-start space-x-3 text-slate-500 text-xs leading-relaxed max-w-4xl">
          <ShieldAlert className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
          <div className="font-sans">
            <strong>Garantia & Acordos de Volume:</strong> Todos os preços listados são referenciais para tiragens iniciais recomendadas. Para contratos estatais ou parcerias contínuas com fornecimento anual de fardas, stands ou merchandising promocional, dispomos de descontos de escala exclusivos. Submeta a sua lista comercial para consulta de faturas pró-forma oficiais.
          </div>
        </div>

      </div>

      {/* FLOATING CART AND CHECKOUT DRAWER */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          {/* Cart Icon Launcher Trigger */}
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="bg-brand-purple hover:bg-brand-purple/95 text-white p-4.5 rounded-full shadow-2xl flex items-center justify-center space-x-2.5 cursor-pointer relative hover:scale-105 active:scale-95 transition-all"
            title="Ver carrinho de encomendas"
          >
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-3.5 -right-3.5 bg-brand-orange text-white text-[10px] font-mono font-extrabold w-5 h-5 rounded-full flex items-center justify-center border border-white animate-bounce">
                {cart.length}
              </span>
            </div>
            <span className="hidden sm:inline font-display font-bold text-sm pr-1.5">
              Carrinho GPA Angola
            </span>
          </button>

          {/* Cart Drawer Panel Pop-up overlay */}
          {isCartOpen && (
            <div className="absolute bottom-16 right-0 w-[92vw] sm:w-[420px] bg-slate-900 border border-white/10 text-white rounded-3xl p-6 shadow-2xl flex flex-col space-y-4 animate-in slide-in-from-bottom-5 duration-300">
              
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-brand-orange" />
                  <h4 className="font-display font-bold text-sm text-white">O Seu Pedido Comercial</h4>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Items List inside Drawer */}
              <div className="space-y-3.5 max-h-[250px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product} className="flex items-start justify-between bg-white/5 border border-white/5 rounded-2xl p-3 text-xs font-sans relative">
                    <div className="space-y-1 pr-6 flex-1">
                      <span className="text-[8px] font-mono font-bold text-slate-400 uppercase">
                        {CATEGORIES.find(c => c.id === item.category)?.label || 'Gráfica'}
                      </span>
                      <h5 className="font-display font-bold text-white line-clamp-1">{item.product}</h5>
                      <p className="text-[10px] font-mono text-brand-orange">
                        {item.price > 0 ? `${(item.price * item.quantity).toLocaleString('pt-AO')} Kz (${item.price} Kz/un.)` : 'Preço de Escala sob Consulta'}
                      </p>
                    </div>

                    {/* Quantity selectors & Trash */}
                    <div className="flex flex-col items-end space-y-2">
                      <button
                        onClick={() => removeFromCart(item.product)}
                        className="text-red-400 hover:text-red-500 cursor-pointer p-0.5"
                        title="Remover"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center bg-white/10 border border-white/10 rounded-lg p-0.5">
                        <button
                          onClick={() => updateCartQty(item.product, item.quantity - (item.minQty >= 100 ? 50 : item.minQty >= 10 ? 5 : 1))}
                          className="px-1 text-slate-300 hover:text-white cursor-pointer"
                          disabled={item.quantity <= item.minQty}
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="font-mono text-[10px] font-bold text-white px-2 w-10 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.product, item.quantity + (item.minQty >= 100 ? 50 : item.minQty >= 10 ? 5 : 1))}
                          className="px-1 text-slate-300 hover:text-white cursor-pointer"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Totals Box */}
              <div className="border-t border-white/10 pt-4.5 space-y-3">
                <div className="flex justify-between items-baseline font-display">
                  <span className="text-xs text-slate-400">Total Estimado do Lote:</span>
                  <span className="font-mono font-black text-lg text-brand-orange">
                    {cart.some(item => item.price === 0) 
                      ? 'Sob Consulta' 
                      : `${cartTotal.toLocaleString('pt-AO')} Kz`}
                  </span>
                </div>

                {cart.some(item => item.price === 0) && (
                  <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl p-2.5 text-[10px] flex items-start space-x-1.5 font-sans">
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>
                      <strong>Aviso de Consulta:</strong> O seu pedido contém artigos de alta escala ou serviços especiais cujo orçamento final requer verificação direta de matriz por parte da equipa comercial.
                    </span>
                  </div>
                )}

                {/* Checkout CTA Buttons */}
                <div className="grid grid-cols-2 gap-2.5 pt-1.5">
                  <button
                    type="button"
                    onClick={handleWhatsAppCheckout}
                    className="flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 fill-white stroke-none" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      // Grab first item to pass to calculator prefill
                      const firstItem = cart[0];
                      onOpenQuoteWithDetails(firstItem.category, firstItem.product);
                      setIsCartOpen(false);
                    }}
                    className="flex items-center justify-center space-x-1.5 bg-brand-orange hover:bg-brand-orange-hover text-white py-3 px-4 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors"
                  >
                    <span>Orçar Completo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={clearCart}
                  className="w-full text-center text-[10px] text-slate-500 hover:text-slate-400 hover:underline cursor-pointer"
                >
                  Limpar todo o carrinho
                </button>
              </div>

            </div>
          )}
        </div>
      )}

    </section>
  );
}
