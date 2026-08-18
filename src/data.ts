import { Service, Project, Testimonial, StoreProduct } from './types';
import heroShowcaseImage from './assets/images/hero_showcase_1782469342727.jpg';

export const HERO_IMAGE_PATH = heroShowcaseImage;

export const SERVICES: Service[] = [
  {
    id: 'impressao',
    title: 'Impressão Gráfica',
    iconName: 'Printer',
    description: 'Offset e digital de alta qualidade, cartões, flyers, catálogos e folhetos.',
    fullDescription: 'Oferecemos soluções de impressão de última geração, combinando tecnologia offset para grandes volumes e impressão digital para pequenas tiragens com máxima fidelidade de cores e acabamentos premium.',
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
  {
    id: 'prod-1',
    name: 'Cartões de Visita Premium',
    category: 'impressao',
    price: 150,
    minQty: 100,
    description: 'Cartões de visita em papel couché 350g com laminação mate ou brilho.',
    imageUrl: 'https://images.unsplash.com/photo-1589149098258-3e9102ca63d3?auto=format&fit=crop&w=600&q=80',
    badge: 'Popular',
    inStock: true
  },
  {
    id: 'prod-2',
    name: 'Panfletos e Flyers',
    category: 'impressao',
    price: 80,
    minQty: 500,
    description: 'Flyers promocionais A5/A6 em alta resolução offset para distribuição massiva.',
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80',
    badge: 'Mais Vendido',
    inStock: true
  },
  {
    id: 'prod-3',
    name: 'Polos Corporativos Bordados',
    category: 'textil',
    price: 6500,
    minQty: 10,
    description: 'Camisas Polo 100% algodão piquê com bordado de alta precisão do seu logótipo.',
    imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80',
    badge: 'Recomendado',
    inStock: true
  },
  {
    id: 'prod-4',
    name: 'T-shirts Promocionais',
    category: 'textil',
    price: 3800,
    minQty: 20,
    description: 'T-shirts em algodão ou poliéster para eventos, com impressão serigráfica durável.',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 'prod-5',
    name: 'Roll-ups e Pop-ups Promocionais',
    category: 'sinaletica',
    price: 35000,
    minQty: 1,
    description: 'Estruturas roll-up de alumínio 85x200cm com lona fotográfica de alta gramagem e saco de transporte.',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e0ee26bf15a?auto=format&fit=crop&w=600&q=80',
    badge: 'Destaque Feiras',
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
    name: 'Canecas de Cerâmica & Garrafas Térmicas',
    category: 'brindes',
    price: 2800,
    minQty: 20,
    description: 'Canecas sublimadas com personalização integral e garrafas térmicas em aço inox.',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
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
  }
];

