import { createClient } from '@supabase/supabase-js';
import { Testimonial, QuoteRequest } from './types';
import { TESTIMONIALS } from './data';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Log configuration status in development
if (!isSupabaseConfigured) {
  console.warn(
    'Supabase: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY are missing. Falling back to local storage.'
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * --- TESTIMONIALS ---
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  if (!supabase) {
    const stored = localStorage.getItem('gpa_testimonials');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return TESTIMONIALS;
      }
    }
    return TESTIMONIALS;
  }

  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    if (data && data.length > 0) {
      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        role: item.role,
        company: item.company,
        text: item.text,
        rating: item.rating,
        avatarLetter: item.avatar_letter || item.name.charAt(0).toUpperCase(),
        avatarImage: item.avatar_image || undefined,
        date: item.date || new Date(item.created_at).toLocaleDateString('pt-AO')
      }));
    }
  } catch (error) {
    console.error('Error fetching testimonials from Supabase:', error);
  }

  // Fallback if DB fetch fails
  const stored = localStorage.getItem('gpa_testimonials');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return TESTIMONIALS;
    }
  }
  return TESTIMONIALS;
}

export async function addTestimonial(testimonial: Testimonial): Promise<void> {
  // Always save to localStorage first as secondary fallback / immediate response
  const stored = localStorage.getItem('gpa_testimonials');
  let currentList: Testimonial[] = [];
  if (stored) {
    try {
      currentList = JSON.parse(stored);
    } catch (e) {
      currentList = [...TESTIMONIALS];
    }
  } else {
    currentList = [...TESTIMONIALS];
  }
  const updatedList = [testimonial, ...currentList];
  localStorage.setItem('gpa_testimonials', JSON.stringify(updatedList));

  if (!supabase) return;

  try {
    const { error } = await supabase.from('testimonials').insert([
      {
        id: testimonial.id,
        name: testimonial.name,
        role: testimonial.role,
        company: testimonial.company,
        text: testimonial.text,
        rating: testimonial.rating,
        avatar_letter: testimonial.avatarLetter,
        avatar_image: testimonial.avatarImage || null,
        date: testimonial.date
      }
    ]);

    if (error) throw error;
  } catch (error) {
    console.error('Error adding testimonial to Supabase:', error);
  }
}

/**
 * --- QUOTE REQUESTS ---
 */
export async function getQuoteHistory(): Promise<QuoteRequest[]> {
  const stored = localStorage.getItem('gpa_quote_history');
  let localHistory: QuoteRequest[] = [];
  if (stored) {
    try {
      localHistory = JSON.parse(stored);
    } catch (e) {
      localHistory = [];
    }
  }

  if (!supabase) return localHistory;

  try {
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (data && data.length > 0) {
      const dbHistory = data.map((item: any) => ({
        id: item.id,
        clientName: item.client_name,
        email: item.email,
        phone: item.phone,
        serviceId: item.service_id,
        product: item.product,
        quantity: item.quantity,
        description: item.description,
        urgency: item.urgency,
        timestamp: item.timestamp || new Date(item.created_at).toLocaleDateString('pt-AO')
      }));
      // Merge unique keys to preserve any local history
      const uniqueHistory = [...dbHistory];
      localHistory.forEach(localItem => {
        if (!uniqueHistory.some(dbItem => dbItem.id === localItem.id)) {
          uniqueHistory.push(localItem);
        }
      });
      return uniqueHistory;
    }
  } catch (error) {
    console.error('Error fetching quote history from Supabase:', error);
  }

  return localHistory;
}

export async function addQuoteRequest(request: QuoteRequest): Promise<void> {
  // Save to localStorage
  const stored = localStorage.getItem('gpa_quote_history');
  let currentList: QuoteRequest[] = [];
  if (stored) {
    try {
      currentList = JSON.parse(stored);
    } catch (e) {
      currentList = [];
    }
  }
  const updatedList = [request, ...currentList];
  localStorage.setItem('gpa_quote_history', JSON.stringify(updatedList));

  if (!supabase) return;

  try {
    const { error } = await supabase.from('quote_requests').insert([
      {
        id: request.id,
        client_name: request.clientName,
        email: request.email,
        phone: request.phone,
        service_id: request.serviceId,
        product: request.product,
        quantity: request.quantity,
        description: request.description,
        urgency: request.urgency,
        timestamp: request.timestamp
      }
    ]);

    if (error) throw error;
  } catch (error) {
    console.error('Error adding quote request to Supabase:', error);
  }
}

/**
 * --- NEWSLETTER SUBSCRIBERS ---
 */
export async function addNewsletterSubscriber(email: string): Promise<void> {
  // Store subscription flag locally
  localStorage.setItem('gpa_subscribed', 'true');

  if (!supabase) return;

  try {
    const { error } = await supabase.from('newsletter_subscribers').insert([
      {
        email: email
      }
    ]);

    if (error) throw error;
  } catch (error) {
    console.error('Error adding newsletter subscriber to Supabase:', error);
  }
}
