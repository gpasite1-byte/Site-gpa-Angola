export interface Service {
  id: string;
  title: string;
  iconName: string;
  description: string;
  fullDescription: string;
  features: string[];
  typicalProducts: string[];
}

export interface Project {
  id: string;
  title: string;
  category: string; // e.g. 'impressao', 'textil', etc.
  categoryLabel: string;
  client: string;
  year: string;
  description: string;
  image: string;
  images?: string[];
  details?: { label: string; value: string }[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  avatarLetter: string;
  avatarImage?: string;
  date: string;
}

export interface QuoteRequest {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  serviceId: string;
  product: string;
  quantity: number;
  description: string;
  urgency: 'baixa' | 'media' | 'alta';
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  whatsappLink?: string;
  showRepsList?: boolean;
}

export interface AssistantChatSession {
  id: string;
  clientName: string;
  lastActive: string;
  messages: ChatMessage[];
  assignedRep?: {
    id: string;
    name: string;
    whatsappNumber: string;
  } | null;
}

export interface Partner {
  id: string;
  name: string;
  imageUrl?: string;
  logoText?: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  order: number;
}

export interface StoreProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  minQty: number;
  description: string;
  imageUrl: string;
  badge?: string;
  inStock?: boolean;
}


