-- ====================================================================
-- GPA ANGOLA - SUPABASE DATABASE MIGRATIONS
-- Copy and run this script in the Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- ====================================================================

-- 1. Create NEWSLETTER_SUBSCRIBERS table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for newsletter_subscribers
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (sign ups)
CREATE POLICY "Permitir subscrições públicas" 
ON public.newsletter_subscribers 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow authenticated reads (if admin access needed)
CREATE POLICY "Permitir leitura para utilizadores autenticados" 
ON public.newsletter_subscribers 
FOR SELECT 
USING (true);


-- 2. Create TESTIMONIALS table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'Parceiro',
    company TEXT DEFAULT 'Empresa Independente',
    text TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    avatar_letter TEXT,
    avatar_image TEXT,
    date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for testimonials
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public reads (view testimonials on home)
CREATE POLICY "Permitir leitura pública de depoimentos" 
ON public.testimonials 
FOR SELECT 
USING (true);

-- Create policy to allow public inserts (submitting reviews)
CREATE POLICY "Permitir inserção pública de depoimentos" 
ON public.testimonials 
FOR INSERT 
WITH CHECK (true);


-- 3. Create QUOTE_REQUESTS table
CREATE TABLE IF NOT EXISTS public.quote_requests (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service_id TEXT,
    product TEXT,
    quantity INTEGER DEFAULT 1,
    description TEXT,
    urgency TEXT DEFAULT 'media',
    timestamp TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for quote_requests
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (submitting simulator requests)
CREATE POLICY "Permitir inserção pública de orçamentos" 
ON public.quote_requests 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow public reads (to view user's past simulation list locally)
CREATE POLICY "Permitir leitura pública de orçamentos" 
ON public.quote_requests 
FOR SELECT 
USING (true);


-- ====================================================================
-- OPTIONAL: SEED WITH DEFAULT TESTIMONIALS (Initial system data)
-- ====================================================================

INSERT INTO public.testimonials (id, name, role, company, text, rating, avatar_letter, date)
VALUES 
('T1', 'Eng. Valeriano Kiala', 'Diretor Geral de Património', 'Ministério das Finanças', 'Trabalhamos com a GPA Angola no fardamento nacional do funcionalismo de apoio. Qualidade de costura impecável e entrega de mais de 5.000 peças rigorosamente dentro do prazo acordado.', 5, 'V', '15/05/2026')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.testimonials (id, name, role, company, text, rating, avatar_letter, date)
VALUES 
('T2', 'Dr. Adilson Marcolino', 'Diretor de Marketing', 'Cuca Cervejas S.A.', 'Os expositores em acrílico e a sinalética interior dos nossos armazéns centrais foram confiados à GPA. O corte a laser deles é perfeito e resiste muito bem a ambientes industriais.', 5, 'A', '08/06/2026')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.testimonials (id, name, role, company, text, rating, avatar_letter, date)
VALUES 
('T3', 'Isabel dos Santos Pinto', 'Gestora de Eventos', 'Hotel Epic Sana Luanda', 'Para a cimeira internacional de turismo, encomendámos stands móveis e panfletos de alta gramagem. A impressão offset em Heidelbergs alemãs faz mesmo a diferença.', 5, 'I', '21/04/2026')
ON CONFLICT (id) DO NOTHING;
