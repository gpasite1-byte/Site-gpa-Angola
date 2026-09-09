import { Service, Project, Testimonial, StoreProduct, StoreCategory } from './types';
import heroShowcaseImage from './assets/images/hero_showcase_1782469342727.jpg';

export const HERO_IMAGE_PATH = heroShowcaseImage;

export const DEFAULT_STORE_CATEGORIES: StoreCategory[] = [
  {
    id: 'cat-impressao',
    name: 'Impressão Gráfica',
    slug: 'impressao',
    description: 'Cartões offset premium, flyers, folhetos, catálogos e livros institucionais de alta tiragem.',
    imageUrl: '/servicos/embalagens_personalizadas.jpg',
    iconName: 'Printer',
    badge: 'Produção Offset 24h'
  },
  {
    id: 'cat-textil',
    name: 'Personalização Têxtil',
    slug: 'textil',
    description: 'Bordados computadorizados de alta densidade e estamparia DTF em polos, fardas e t-shirts.',
    imageUrl: '/servicos/polos_corporativos.jpg',
    iconName: 'Shirt',
    badge: 'Bordado Industrial'
  },
  {
    id: 'cat-brindes',
    name: 'Brindes Corporativos',
    slug: 'brindes',
    description: 'Kits executivos VIP com gravação a laser, garrafas térmicas inteligentes, agendas e pen drives.',
    imageUrl: '/servicos/kit_brindes_vip.jpg',
    iconName: 'Gift',
    badge: 'Gravação Laser Precision'
  },
  {
    id: 'cat-sinaletica',
    name: 'Sinalética & Fachadas',
    slug: 'sinaletica',
    description: 'Reclames luminosos LED 3D, placas corporativas em acrílico/alucobond e decoração de frotas.',
    imageUrl: '/servicos/sinaletica_led_1.jpg',
    iconName: 'Signpost',
    badge: 'Montagem Nacional'
  },
  {
    id: 'cat-design',
    name: 'Design & Branding',
    slug: 'design',
    description: 'Identidades visuais completas, redesenho de marcas, embalagens e manuais de normas.',
    imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Palette',
    badge: 'Estúdio Criativo GPA'
  }
];

export const SERVICES: Service[] = [
  {
    id: 'impressao',
    title: 'Impressão Gráfica',
    iconName: 'Printer',
    description: 'Offset e digital de alta qualidade, cartões, flyers, catálogos e folhetos.',
    fullDescription: 'Oferecemos soluções de impressão de última geração, combinando tecnologia offset para grandes volumes e impressão digital para pequenas tiragens com máxima fidelidade de cores e acabamentos premium.',
    imageUrl: '/capa/1.png',
    hoverImageUrl: '/capa/5.jpg',
    badge: 'Offset 24h',
    features: [
      'Resolução ultra-alta de impressão',
      'Papéis finos e ecológicos de diversas gramagens',
      'Acabamentos especiais: Verniz UV localizado, plastificação mate/brilho, relevo',
      'Impressão rápida sob demanda'
    ],
    typicalProducts: ['Cartões de Visita Premium', 'Panfletos e Flyers', 'Catálogos Corporativos', 'Calendários e Agendas', 'Envelopes e Papel Timbrado']
  },
  {
    id: 'textil',
    title: 'Personalização Têxtil',
    iconName: 'Shirt',
    description: 'Estamparia, bordados e fardamento personalizado para a sua equipa.',
    fullDescription: 'Dê vida à sua marca no vestuário. Desenvolvemos e personalizamos uniformes corporativos, t-shirts promocionais, polos, casacos e bonés com as melhores técnicas de estamparia e bordado industrial de alta precisão.',
    imageUrl: '/capa/8.png',
    hoverImageUrl: '/capa/2.jpg',
    badge: 'Bordado Industrial',
    features: [
      'Serigrafia de alta durabilidade',
      'Bordados computadorizados de alta definição',
      'Impressão direta no tecido (DTG / DTF)',
      'Tecidos confortáveis e resistentes ao desgaste'
    ],
    typicalProducts: ['T-shirts Promocionais', 'Polos Corporativos Bordados', 'Fardas para Indústria e Restauração', 'Bonés e Viseiras', 'Coletes de Segurança Personalizados']
  },
  {
    id: 'design',
    title: 'Design Gráfico',
    iconName: 'Palette',
    description: 'Identidade visual, branding, logótipos e paginação profissional.',
    fullDescription: 'Criamos marcas fortes que comunicam com clareza os valores do seu negócio. Desde a criação de logótipos memoráveis até ao desenvolvimento completo de manuais de identidade e materiais editoriais.',
    imageUrl: '/capa/3.png',
    hoverImageUrl: '/capa/9.jpg',
    badge: 'Estúdio Criativo',
    features: [
      'Criação de marcas (Branding) do zero',
      'Redesenho e modernização de logótipos',
      'Paginação de relatórios de contas e revistas',
      'Design de embalagens (Packaging) inovador'
    ],
    typicalProducts: ['Logótipo & Manual de Marca', 'Design de Embalagens', 'Artes de Redes Sociais', 'Design de Flyers e Banners', 'Layouts para Stands']
  },
  {
    id: 'marketing',
    title: 'Marketing Digital',
    iconName: 'Megaphone',
    description: 'Gestão de redes sociais, campanhas de anúncios e estratégia de marca.',
    fullDescription: 'Conectamos a sua empresa ao seu público-alvo no ecossistema online. Planeamos e executamos campanhas de tráfego pago, gestão de redes sociais (Instagram, Facebook, LinkedIn) e optimização de presença digital.',
    imageUrl: '/capa/6.jpg',
    hoverImageUrl: '/capa/11.jpg',
    badge: 'Estratégia & Anúncios',
    features: [
      'Gestão estratégica de Redes Sociais',
      'Campanhas de Google Ads e Meta Ads (Facebook/Instagram)',
      'Criação de conteúdos dinâmicos (Copywriting)',
      'Relatórios mensais de performance e ROI'
    ],
    typicalProducts: ['Pacotes Mensais de Social Media', 'Configuração de Campanhas de Anúncios', 'Copywriting de Vendas', 'Landing Pages para Conversão', 'Auditoria de Presença Digital']
  },
  {
    id: 'audiovisual',
    title: 'Audiovisual',
    iconName: 'Video',
    description: 'Vídeos institucionais, cobertura de eventos, fotografia e animação 2D/3D.',
    fullDescription: 'Contamos histórias em movimento que geram conexão imediata. Captamos a essência da sua empresa através de vídeos institucionais corporativos, vídeos promocionais para redes sociais, fotografia comercial de alta qualidade e animações cativantes.',
    imageUrl: '/capa/7.jpg',
    hoverImageUrl: '/capa/11.jpg',
    badge: 'Produção 4K',
    features: [
      'Captação de vídeo em alta definição (4K)',
      'Edição e pós-produção cinematográfica',
      'Animação de logótipos e Motion Graphics',
      'Fotografia corporativa e cobertura de eventos'
    ],
    typicalProducts: ['Vídeos Institucionais', 'Spots Publicitários de 15s/30s', 'Vídeo Reportagem de Eventos', 'Sessões Fotográficas de Equipa', 'Motion Graphics Explicativos']
  },
  {
    id: 'brindes',
    title: 'Brindes Corporativos',
    iconName: 'Gift',
    description: 'Canecas, canetas, agendas, sacos e brindes tecnológicos personalizados.',
    fullDescription: 'Marque presença no dia-a-dia dos seus parceiros e clientes com brindes úteis e elegantes. Oferecemos um vasto catálogo de brindes promocionais personalizados com gravação a laser, tampografia ou UV direto.',
    imageUrl: '/capa/4.png',
    hoverImageUrl: '/capa/10.jpg',
    badge: 'Gravação Laser',
    features: [
      'Gravação a laser de alta durabilidade',
      'Uv Direto a cores em superfícies rígidas',
      'Brindes ecológicos e sustentáveis',
      'Opções tecnológicas (Powerbanks, Pens USB, Auriculares)'
    ],
    typicalProducts: ['Canecas de Cerâmica & Garrafas Térmicas', 'Canetas Metálicas Gravadas a Laser', 'Blocos de Notas e Agendas', 'Sacos Ecológicos (Tote Bags)', 'Pens USB & Powerbanks']
  },
  {
    id: 'sinaletica',
    title: 'Sinalética',
    iconName: 'Signpost',
    description: 'Placas, decoração de viaturas, reclames luminosos e lonas de grande formato.',
    fullDescription: 'Destaque fisicamente o seu estabelecimento. Desenvolvemos, produzimos e instalamos painéis de sinalização interna e externa, reclames luminosos em LED, decoração de frotas comerciais e lonas gigantes de alta resistência.',
    imageUrl: '/servicos/sinaletica_led_1.jpg',
    hoverImageUrl: '/servicos/sinaletica_led_2.jpg',
    badge: 'Reclames LED 3D',
    features: [
      'Impressão em grande formato com tintas eco-solventes',
      'Reclames luminosos energeticamente eficientes (LED)',
      'Vinil de recorte e impressão premium para viaturas',
      'Materiais resistentes ao sol e chuva (Alucobond, Acrílico, PVC)'
    ],
    typicalProducts: ['Placas de Sinalização Interna/Externa', 'Decoração Integral ou Parcial de Viaturas', 'Reclames Luminosos 3D', 'Lonas Publicitárias com Ilhós', 'Roll-ups Autoportantes']
  },
  {
    id: 'stands',
    title: 'Stands & Exposições',
    iconName: 'Layers',
    description: 'Concepção, montagem e decoração de stands para feiras e conferências.',
    fullDescription: 'Crie uma experiência imersiva para os seus visitantes em feiras, exposições ou congressos. Tratamos de todo o processo: desde o design conceptual 3D do stand à produção de painéis, mobiliário corporativo e montagem final na feira.',
    imageUrl: '/capa/12.jpg',
    hoverImageUrl: '/capa/7.jpg',
    badge: 'Montagem 3D',
    features: [
      'Design e renderização 3D conceptual antes da feira',
      'Produção e carpintaria própria de estruturas de stand',
      'Mobiliário de aluguer e ecrãs multimédia integrados',
      'Equipa especializada de montagem e desmontagem rápida'
    ],
    typicalProducts: ['Stands Personalizados (Carpintaria)', 'Stands Modulares para Feiras', 'Balcões de Atendimento e Displays', 'Backdrops de Conferência Gigantes', 'Roll-ups e Pop-ups Promocionais']
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'proj1',
    title: 'Back Drop - Conferência Anual',
    category: 'stands',
    categoryLabel: 'Stands & Exposições',
    client: 'Sonangol',
    year: '2025',
    description: 'Produção e montagem de backdrop gigante de alta tensão e balcões iluminados em LED para a conferência magna de energia.',
    image: 'https://picsum.photos/seed/sonangol/600/400',
    details: [
      { label: 'Estrutura', value: 'Alumínio de alta tensão' },
      { label: 'Dimensões', value: '8m x 3.5m' },
      { label: 'Tempo de Produção', value: '3 dias úteis' },
      { label: 'Destaque', value: 'Iluminação LED embutida' }
    ]
  },
  {
    id: 'proj2',
    title: 'T-shirts e Polos Personalizados',
    category: 'textil',
    categoryLabel: 'Personalização Têxtil',
    client: 'Notre Angola',
    year: '2025',
    description: 'Desenvolvimento de fardamento corporativo e t-shirts em algodão orgânico com estamparia DTF e bordado de alta definição para as equipas de campo.',
    image: 'https://picsum.photos/seed/notre/600/400',
    details: [
      { label: 'Técnica', value: 'Bordado industrial e DTF' },
      { label: 'Material', value: '100% Algodão Premium 190g' },
      { label: 'Quantidade', value: '250 unidades' },
      { label: 'Sustentabilidade', value: 'Algodão com certificação ecológica' }
    ]
  },
  {
    id: 'proj3',
    title: 'Roll Up - FENAGRO 2024',
    category: 'sinaletica',
    categoryLabel: 'Sinalética',
    client: 'Ministério da Agricultura',
    year: '2024',
    description: 'Roll-ups institucionais premium de dupla face com estrutura reforçada para o stand oficial da FENAGRO 2024.',
    image: 'https://picsum.photos/seed/fenagro/600/400',
    details: [
      { label: 'Material Lona', value: 'Lona PVC anti-reflexo 510g' },
      { label: 'Tamanho', value: '100cm x 200cm' },
      { label: 'Estrutura', value: 'Alumínio anodizado pesado' },
      { label: 'Acabamento', value: 'Mate acetinado' }
    ]
  },
  {
    id: 'proj4',
    title: 'Sinalética e Fachada Corporativa',
    category: 'sinaletica',
    categoryLabel: 'Sinalética',
    client: 'Banco BAI',
    year: '2025',
    description: 'Desenvolvimento de sinalética interna direcional e letreiros volumétricos em acrílico retroiluminados para a nova agência principal.',
    image: 'https://picsum.photos/seed/bai/600/400',
    details: [
      { label: 'Letreiro principal', value: 'Letras monobloco em inox e acrílico' },
      { label: 'Iluminação', value: 'Módulos LED de alto brilho e baixo consumo' },
      { label: 'Sinalização Direcional', value: 'Placas de Alucobond escovado' },
      { label: 'Normativos', value: 'Em conformidade com a imagem de marca BAI' }
    ]
  },
  {
    id: 'proj5',
    title: 'Kit de Brindes Premium de Fim de Ano',
    category: 'brindes',
    categoryLabel: 'Brindes Corporativos',
    client: 'Unitel',
    year: '2025',
    description: 'Curadoria, produção e gravação a laser de kits de fim de ano sofisticados contendo garrafa térmica inteligente, agenda com capa em cortiça e powerbank fino.',
    image: 'https://picsum.photos/seed/unitel/600/400',
    details: [
      { label: 'Itens do kit', value: 'Garrafa Smart LED, Agenda Cortiça, Powerbank' },
      { label: 'Gravação', value: 'Laser YAG de alta precisão' },
      { label: 'Caixa de embalagem', value: 'Cartão rígido texturado com fecho magnético' },
      { label: 'Quantidade', value: '500 kits completos' }
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Eng. Manuel Costa',
    role: 'Diretor de Comunicação',
    company: 'Ministério da Agricultura',
    text: 'A GPA superou as nossas expectativas! Qualidade, criatividade e compromisso em cada detalhe na montagem e fornecimento dos materiais para o nosso stand oficial.',
    rating: 5,
    avatarLetter: 'M',
    date: 'Há 2 semanas'
  },
  {
    id: 't2',
    name: 'Sra. Sandra Neto',
    role: 'Coordenadora de Eventos',
    company: 'Sonangol',
    text: 'Profissionais incríveis e entrega sempre dentro do prazo estabelecido. O backdrop da nossa conferência foi muito elogiado pelas delegações estrangeiras.',
    rating: 5,
    avatarLetter: 'S',
    date: 'Há 1 mês'
  },
  {
    id: 't3',
    name: 'Dr. Paulo Albuquerque',
    role: 'Responsável de Procurement',
    company: 'Banco BAI',
    text: 'O nosso evento e fachadas ganharam vida com os materiais robustos e elegantes produzidos pela GPA. A sinalética interna tem um acabamento impecável.',
    rating: 5,
    avatarLetter: 'P',
    date: 'Há 3 meses'
  }
];

export const PARTNERS = [
  { name: 'Sonangol', logoText: 'Sonangol', imageUrl: 'https://i.ibb.co/Z1c5FwFV/SONANGOL.jpg' },
  { name: 'Banco BAI', logoText: 'BAI', imageUrl: 'https://i.ibb.co/8DyXrMdP/BAI.png' },
  { name: 'Unitel', logoText: 'UNITEL', imageUrl: 'https://i.ibb.co/nNFLY2dt/UNITEL.jpg' },
  { name: 'Zap', logoText: 'zap', imageUrl: 'https://i.ibb.co/vFh3KHn/zap.jpg' },
  { name: 'BFA', logoText: 'BFA', imageUrl: 'https://i.ibb.co/jvg2s2K2/BFA.jpg' },
  { name: 'Nestlé', logoText: 'Nestlé', imageUrl: 'https://i.ibb.co/4w3FGfSG/NESTLE.jpg' },
  { name: 'Caixa Angola', logoText: 'Caixa Angola', imageUrl: 'https://i.ibb.co/XGfS3V99/caixa-angola.png' },
  { name: 'BPC', logoText: 'BPC', imageUrl: 'https://i.ibb.co/9H0pXm3b/bpc.png' }
];

export const DEFAULT_STORE_PRODUCTS: StoreProduct[] = [
  // --- 1. ARTES GRÁFICAS & IMPRESSÃO ---
  {
    id: 'prod-1',
    name: 'Cartões de Visita Premium',
    category: 'impressao',
    price: 150,
    minQty: 100,
    description: 'Cartões de visita em papel couché 350g com laminação mate ou soft-touch e verniz UV localizado.',
    imageUrl: 'https://images.unsplash.com/photo-1589149098258-3e9102ca63d3?auto=format&fit=crop&w=600&q=80',
    badge: 'Mais Vendido',
    inStock: true
  },
  {
    id: 'prod-2',
    name: 'Panfletos e Flyers Promocionais',
    category: 'impressao',
    price: 80,
    minQty: 500,
    description: 'Flyers promocionais A5 e A6 em alta resolução offset para distribuição massiva e campanhas.',
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80',
    badge: 'Popular',
    inStock: true
  },
  {
    id: 'prod-9',
    name: 'Pastas Corporativas com Bolsa',
    category: 'impressao',
    price: 850,
    minQty: 50,
    description: 'Pastas institucionais personalizadas com bolsa para documentos e encaixe para cartão de visita.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    badge: 'Corporativo',
    inStock: true
  },
  {
    id: 'prod-10',
    name: 'Catálogos e Revistas Institucionais',
    category: 'impressao',
    price: 2400,
    minQty: 25,
    description: 'Impressão editorial em papel couché com acabamento brilhante ou mate e encadernação de precisão.',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-11',
    name: 'Embalagens e Caixas de Luxo',
    category: 'impressao',
    price: 1800,
    minQty: 100,
    description: 'Caixas de cartão personalizadas com estampagem em folha dourada ou prateada e corte geométrico.',
    imageUrl: '/servicos/embalagens_personalizadas.jpg',
    badge: 'Embalagem VIP',
    inStock: true
  },
  {
    id: 'prod-12',
    name: 'Sacos de Papel Personalizados',
    category: 'impressao',
    price: 950,
    minQty: 100,
    description: 'Sacos em papel Kraft ou couché com asas em cordão de algodão e acabamento luxuoso.',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-13',
    name: 'Blocos de Notas & Faturas Autocopiadas',
    category: 'impressao',
    price: 3200,
    minQty: 10,
    description: 'Livros de faturas e recibos autocopiativos em 2 ou 3 vias com numeração sequencial.',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-14',
    name: 'Autocolantes & Rótulos em Vinil',
    category: 'impressao',
    price: 50,
    minQty: 200,
    description: 'Rótulos adesivos cortados a laser, resistentes à humidade e adequados para garrafas e embalagens.',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-32',
    name: 'Envelopes Personalizados (DL & C4)',
    category: 'impressao',
    price: 120,
    minQty: 200,
    description: 'Envelopes com pala autocolante e impressão com cores institucionais em offset de alta definição.',
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-33',
    name: 'Calendários de Mesa e Parede',
    category: 'impressao',
    price: 1500,
    minQty: 50,
    description: 'Calendários institucionais com espiral metálica (wire-o) e suporte rígido para secretária.',
    imageUrl: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=600&q=80',
    badge: 'Fim de Ano',
    inStock: true
  },
  {
    id: 'prod-34',
    name: 'Diplomas e Certificados em Papel Especial',
    category: 'impressao',
    price: 450,
    minQty: 30,
    description: 'Impressão em cartolina texturada vergê ou linho 250g com detalhes metalizados em relevo.',
    imageUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-35',
    name: 'Desdobráveis e Trípticos Comerciais',
    category: 'impressao',
    price: 110,
    minQty: 300,
    description: 'Trípticos e dípticos A4 dobrados em alta precisão para apresentação de serviços e produtos.',
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },

  // --- 2. TÊXTIL & UNIFORMES ---
  {
    id: 'prod-3',
    name: 'Polos Corporativos Bordados Piquê',
    category: 'textil',
    price: 6500,
    minQty: 10,
    description: 'Camisas Polo 100% algodão piquê com bordado industrial de alta definição do seu logótipo.',
    imageUrl: '/servicos/polos_corporativos.jpg',
    badge: 'Destaque Têxtil',
    inStock: true
  },
  {
    id: 'prod-4',
    name: 'T-shirts Promocionais em Algodão',
    category: 'textil',
    price: 3800,
    minQty: 20,
    description: 'T-shirts 100% algodão 190g para eventos e feiras, com estamparia DTF e serigrafia durável.',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-15',
    name: 'Coletes Refletores de Segurança',
    category: 'textil',
    price: 4500,
    minQty: 10,
    description: 'Coletes de alta visibilidade com faixas refletoras normativas e personalização com logo nas costas e peito.',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
    badge: 'Segurança EPI',
    inStock: true
  },
  {
    id: 'prod-16',
    name: 'Fardamento Técnico & Macacões',
    category: 'textil',
    price: 18500,
    minQty: 5,
    description: 'Fardamento industrial de alta resistência com costuras duplas reforçadas para oficinas e indústrias.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-17',
    name: 'Bonés e Chapéus Bordados 3D',
    category: 'textil',
    price: 3200,
    minQty: 25,
    description: 'Bonés de 6 gomos em sarja pesada com fecho ajustável e bordado frontal em relevo 3D.',
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-18',
    name: 'Camisas Sociais Executivas',
    category: 'textil',
    price: 12000,
    minQty: 5,
    description: 'Camisas sociais de alfaiataria em algodão nobre com bordado discreto no peito ou punho.',
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-36',
    name: 'Batas Médicas e Laboratoriais',
    category: 'textil',
    price: 9800,
    minQty: 5,
    description: 'Batas brancas de manga comprida em tecido antimicrobiano com botões reforçados e bordado.',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-37',
    name: 'Aventais Personalizados para Restauração',
    category: 'textil',
    price: 4200,
    minQty: 10,
    description: 'Aventais de peito em sarja resistente com bolsos frontais e fivelas ajustáveis em metal.',
    imageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-38',
    name: 'Casacos Softshell Impermeáveis',
    category: 'textil',
    price: 26000,
    minQty: 5,
    description: 'Casacos térmicos corta-vento e repelentes de água com forro polar e bordado corporativo.',
    imageUrl: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-39',
    name: 'T-shirts Desportivas Dry-Fit',
    category: 'textil',
    price: 3600,
    minQty: 20,
    description: 'Camisolas técnicas 100% poliéster respirável para eventos desportivos, maratonas e torneios.',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },

  // --- 3. BRINDES CORPORATIVOS ---
  {
    id: 'prod-19',
    name: 'Kit de Brindes Executivo VIP',
    category: 'brindes',
    price: 24500,
    minQty: 5,
    description: 'Caixa de luxo contendo Garrafa Térmica Smart LED, Caneta de Metal Gravada, Agenda em Couro e Powerbank.',
    imageUrl: '/servicos/kit_brindes_vip.jpg',
    badge: 'Brinde VIP',
    inStock: true
  },
  {
    id: 'prod-6',
    name: 'Canetas Metálicas Gravadas a Laser',
    category: 'brindes',
    price: 1200,
    minQty: 50,
    description: 'Canetas executivas de metal com gravação personalizada a laser com acabamento luxuoso.',
    imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-7',
    name: 'Canecas de Cerâmica Sublimadas',
    category: 'brindes',
    price: 2800,
    minQty: 20,
    description: 'Canecas de cerâmica de alta qualidade com impressão fotográfica integral resistente ao micro-ondas.',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-20',
    name: 'Garrafas Térmicas Smart LED',
    category: 'brindes',
    price: 5500,
    minQty: 15,
    description: 'Garrafas térmicas em aço inox com display digital touch na tampa e isolamento a vácuo.',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-21',
    name: 'Sacos Ecológicos (Tote Bags)',
    category: 'brindes',
    price: 1800,
    minQty: 50,
    description: 'Sacos ecológicos em algodão cru ou lona com estampa serigráfica de grande durabilidade.',
    imageUrl: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-22',
    name: 'Agendas e Cadernos em Cortiça / Couro',
    category: 'brindes',
    price: 4200,
    minQty: 20,
    description: 'Agendas executivas com capa em pele sintética ou cortiça natural e fita marcadora.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-40',
    name: 'Pens USB Metálicas Personalizadas',
    category: 'brindes',
    price: 3500,
    minQty: 30,
    description: 'Memórias USB de 32GB em metal escovado com gravação a laser e caixa individual de oferta.',
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-41',
    name: 'Powerbanks Slim 10.000mAh',
    category: 'brindes',
    price: 9500,
    minQty: 10,
    description: 'Baterias portáteis finas com carga rápida, display LED e gravação retroiluminada da marca.',
    imageUrl: 'https://images.unsplash.com/photo-1609592807904-74727d530f25?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-42',
    name: 'Mochilas Executivas para Portátil',
    category: 'brindes',
    price: 16500,
    minQty: 10,
    description: 'Mochilas impermeáveis antifurto com compartimento almofadado para portátil de 15.6" e porta USB.',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-43',
    name: 'Lanyards & Fitas de Pescoço com Crachá',
    category: 'brindes',
    price: 450,
    minQty: 100,
    description: 'Fitas acetinadas de 20mm impressas a cores frente/verso com mosquetão metálico e fecho de segurança.',
    imageUrl: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },

  // --- 4. SINALÉTICA & STANDS ---
  {
    id: 'prod-5',
    name: 'Roll-ups Autoportantes (85x200cm)',
    category: 'sinaletica',
    price: 35000,
    minQty: 1,
    description: 'Estrutura roll-up de alumínio com lona anti-reflexo de alta gramagem e saco de transporte almofadado.',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e0ee26bf15a?auto=format&fit=crop&w=600&q=80',
    badge: 'Destaque Feiras',
    inStock: true
  },
  {
    id: 'prod-23',
    name: 'Reclames Luminosos 3D com LED',
    category: 'sinaletica',
    price: 180000,
    minQty: 1,
    description: 'Letreiros volumétricos em acrílico, aço inox ou PVC com iluminação interior em LED de baixo consumo.',
    imageUrl: '/servicos/sinaletica_led_1.jpg',
    badge: 'Fachadas 3D',
    inStock: true
  },
  {
    id: 'prod-24',
    name: 'Lonas Publicitárias com Ilhós',
    category: 'sinaletica',
    price: 12000,
    minQty: 1,
    description: 'Lonas em PVC resistente com reforço perimetral e ilhós metálicos para fachadas e outdoors.',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-25',
    name: 'Decoração e Vinil para Viaturas',
    category: 'sinaletica',
    price: 85000,
    minQty: 1,
    description: 'Decoração integral ou parcial de viaturas e carrinhas comerciais com vinil automotivo fundido.',
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-26',
    name: 'Balcão Promocional & Pop-up',
    category: 'sinaletica',
    price: 65000,
    minQty: 1,
    description: 'Balcões portáteis de montagem rápida com tampo resistente e impressão frontal personalizada.',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-44',
    name: 'Bandeiras Windbanner Publicitárias',
    category: 'sinaletica',
    price: 45000,
    minQty: 1,
    description: 'Estruturas de bandeira gota ou pena de 3 a 4 metros com base de água/cruzeta para eventos ao ar livre.',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-45',
    name: 'Painéis em Alucobond & Placas de Entrada',
    category: 'sinaletica',
    price: 55000,
    minQty: 1,
    description: 'Placas de identificação exterior em compósito de alumínio escovado com distanciadores em inox.',
    imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-46',
    name: 'Backdrops Estruturados para Eventos',
    category: 'sinaletica',
    price: 125000,
    minQty: 1,
    description: 'Painéis fotográficos modulares de grande escala (3x2.5m e 6x3m) para fotografias e fundos de palco.',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },

  // --- 5. DESIGN & BRANDING ---
  {
    id: 'prod-8',
    name: 'Logótipo & Manual de Marca',
    category: 'design',
    price: 150000,
    minQty: 1,
    description: 'Criação de identidade visual completa, paleta de cores, tipografia e manual de normas da marca.',
    imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
    badge: 'Branding VIP',
    inStock: true
  },
  {
    id: 'prod-27',
    name: 'Design Editorial para Relatórios & Revistas',
    category: 'design',
    price: 95000,
    minQty: 1,
    description: 'Paginação profissional e infografia para Relatórios & Contas, brochuras corporativas e revistas.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-47',
    name: 'Modelagem 3D de Stands & Embalagens',
    category: 'design',
    price: 80000,
    minQty: 1,
    description: 'Renderizações tridimensionais fotorrealistas de produtos, expositores e plantas de stands para feiras.',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },

  // --- 6. MARKETING & WEB ---
  {
    id: 'prod-28',
    name: 'Gestão Mensal de Redes Sociais',
    category: 'marketing',
    price: 120000,
    minQty: 1,
    description: 'Planeamento editorial, criação de artes visuais, vídeos curtos e publicação regular no Instagram/Facebook/LinkedIn.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-29',
    name: 'Criação de Website Institucional',
    category: 'marketing',
    price: 250000,
    minQty: 1,
    description: 'Desenvolvimento de portal web corporativo responsivo, rápido, otimizado para telemóveis e motores de busca.',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
    badge: 'Solução Digital',
    inStock: true
  },

  // --- 7. AUDIOVISUAL ---
  {
    id: 'prod-30',
    name: 'Vídeo Institucional Corporativo 4K',
    category: 'audiovisual',
    price: 320000,
    minQty: 1,
    description: 'Gravação cinematográfica nas instalações da sua empresa, com drones, captação de som profissional e edição de impacto.',
    imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-31',
    name: 'Cobertura de Eventos & Fotografia',
    category: 'audiovisual',
    price: 180000,
    minQty: 1,
    description: 'Equipa de fotógrafos e operadores de câmara profissionais para cobertura integral de feiras, lançamentos e galas.',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
    inStock: true
  }
];


