import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Check, ArrowRight, ArrowLeft, Upload, FileText, 
  Trash2, ShieldCheck, HelpCircle, History, Sparkles, AlertCircle 
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { SERVICES } from '../data';
import { QuoteRequest } from '../types';
import { getQuoteHistory, addQuoteRequest } from '../supabaseClient';
import { SiteConfig } from '../firebaseClient';

interface QuoteCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
  initialProductName?: string;
  siteConfig?: SiteConfig | null;
}

export default function QuoteCalculator({ isOpen, onClose, initialServiceId, initialProductName, siteConfig }: QuoteCalculatorProps) {
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState('');
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState(100);
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [materialOption, setMaterialOption] = useState('standard');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'baixa' | 'media' | 'alta'>('media');
  
  // Contacts
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // File upload simulation
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [submittedRequest, setSubmittedRequest] = useState<QuoteRequest | null>(null);

  // Past requests history (Local Storage + Supabase)
  const [history, setHistory] = useState<QuoteRequest[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history & set initial selections
  useEffect(() => {
    async function load() {
      const data = await getQuoteHistory();
      setHistory(data);
    }
    load();
  }, []);

  // Set initial selections when pre-filled props arrive
  useEffect(() => {
    if (initialServiceId) {
      setServiceId(initialServiceId);
      const matched = SERVICES.find(s => s.id === initialServiceId);
      if (matched && matched.typicalProducts.length > 0) {
        setProduct(initialProductName || matched.typicalProducts[0]);
      }
      setStep(2); // Skip step 1 since service is pre-selected
    }
  }, [initialServiceId, initialProductName]);

  const selectedService = SERVICES.find(s => s.id === serviceId);

  // Dynamic products list depending on category
  const availableProducts = selectedService ? selectedService.typicalProducts : [];

  // Price calculations in Kwanza (Kz) using dynamic rates from siteConfig if available
  const calculatePrice = () => {
    if (!serviceId) return 0;
    
    let baseRate = 0;
    let unitCost = 0;

    const defaultPrices: Record<string, number> = {
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
    };

    const hasSpecificProduct = product && (
      (siteConfig?.productPrices && siteConfig.productPrices[product] !== undefined) || 
      defaultPrices[product] !== undefined
    );

    if (hasSpecificProduct) {
      unitCost = siteConfig?.productPrices?.[product] ?? defaultPrices[product];
      const flatFeeProducts = [
        'Logótipo & Manual de Marca', 'Design de Embalagens', 'Artes de Redes Sociais', 'Design de Flyers e Banners', 'Layouts para Stands',
        'Pacotes Mensais de Social Media', 'Configuração de Campanhas de Anúncios', 'Copywriting de Vendas', 'Landing Pages para Conversão', 'Auditoria de Presença Digital',
        'Vídeos Institucionais', 'Spots Publicitários de 15s/30s', 'Vídeo Reportagem de Eventos', 'Sessões Fotográficas de Equipa', 'Motion Graphics Explicativos',
        'Decoração Integral ou Parcial de Viaturas', 'Stands Personalizados (Carpintaria)', 'Stands Modulares para Feiras', 'Balcões de Atendimento e Displays',
        'Backdrops de Conferência Gigantes', 'Roll-ups e Pop-ups Promocionais'
      ];
      
      if (flatFeeProducts.includes(product)) {
        baseRate = 0;
      } else {
        baseRate = 10000; 
      }
    } else {
      const rates = {
        impressao_base: siteConfig?.rate_impressao_base ?? 5000,
        impressao_unit: siteConfig?.rate_impressao_unit ?? 250,
        textil_base: siteConfig?.rate_textil_base ?? 12000,
        textil_unit: siteConfig?.rate_textil_unit ?? 4500,
        design_base: siteConfig?.rate_design_base ?? 25000,
        design_unit: siteConfig?.rate_design_unit ?? 0,
        marketing_base: siteConfig?.rate_marketing_base ?? 60000,
        marketing_unit: siteConfig?.rate_marketing_unit ?? 0,
        audiovisual_base: siteConfig?.rate_audiovisual_base ?? 85000,
        audiovisual_unit: siteConfig?.rate_audiovisual_unit ?? 0,
        brindes_base: siteConfig?.rate_brindes_base ?? 8000,
        brindes_unit: siteConfig?.rate_brindes_unit ?? 1500,
        sinaletica_base: siteConfig?.rate_sinaletica_base ?? 35000,
        sinaletica_unit: siteConfig?.rate_sinaletica_unit ?? 12000,
        stands_base: siteConfig?.rate_stands_base ?? 250000,
        stands_unit: siteConfig?.rate_stands_unit ?? 0,
      };

      switch (serviceId) {
        case 'impressao':
          baseRate = rates.impressao_base;
          unitCost = rates.impressao_unit;
          break;
        case 'textil':
          baseRate = rates.textil_base;
          unitCost = rates.textil_unit;
          break;
        case 'design':
          baseRate = rates.design_base;
          unitCost = rates.design_unit;
          break;
        case 'marketing':
          baseRate = rates.marketing_base;
          unitCost = rates.marketing_unit;
          break;
        case 'audiovisual':
          baseRate = rates.audiovisual_base;
          unitCost = rates.audiovisual_unit;
          break;
        case 'brindes':
          baseRate = rates.brindes_base;
          unitCost = rates.brindes_unit;
          break;
        case 'sinaletica':
          baseRate = rates.sinaletica_base;
          unitCost = rates.sinaletica_unit;
          break;
        case 'stands':
          baseRate = rates.stands_base;
          unitCost = rates.stands_unit;
          break;
        default:
          baseRate = 10000;
          unitCost = 0;
      }
    }

    // Material tier factor
    let tierMultiplier = 1;
    if (materialOption === 'premium') tierMultiplier = 1.35;
    if (materialOption === 'luxury') tierMultiplier = 1.75;

    let subtotal = (baseRate + (unitCost * quantity)) * tierMultiplier;

    // Bulk Discount - higher scale gives lower unit cost
    let discount = 0;
    if (quantity >= 50 && quantity < 250) {
      discount = 0.05; // 5%
    } else if (quantity >= 250 && quantity < 1000) {
      discount = 0.15; // 15%
    } else if (quantity >= 1000 && quantity < 10000) {
      discount = 0.30; // 30%
    } else if (quantity >= 10000) {
      discount = 0.45; // 45% for high scale
    }
    subtotal = subtotal * (1 - discount);

    // Urgency rush fee
    if (urgency === 'alta') {
      subtotal *= 1.25; // 25% rush charge
    } else if (urgency === 'baixa') {
      subtotal *= 0.95; // 5% early discount
    }

    return Math.round(subtotal);
  };

  const currentPrice = calculatePrice();

  // Drag and drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesList = Array.from(e.dataTransfer.files).map((f: any) => ({
        name: f.name,
        size: (f.size / 1024).toFixed(1) + ' KB'
      }));
      setUploadedFiles(prev => [...prev, ...filesList]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesList = Array.from(e.target.files).map((f: any) => ({
        name: f.name,
        size: (f.size / 1024).toFixed(1) + ' KB'
      }));
      setUploadedFiles(prev => [...prev, ...filesList]);
    }
  };

  const removeFile = (idx: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  // Submit quote request
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !email.trim() || !phone.trim()) {
      setFormError('Por favor, preencha todos os dados de contacto!');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const newRequest: QuoteRequest = {
        id: 'REQ-' + Math.floor(Math.random() * 900000 + 100000),
        clientName,
        email,
        phone,
        serviceId,
        product: product || 'Solução Personalizada',
        quantity: isUnlimited ? -1 : quantity,
        description,
        urgency,
        timestamp: new Date().toLocaleDateString('pt-AO') + ' ' + new Date().toLocaleTimeString('pt-AO')
      };

      setHistory(prev => [newRequest, ...prev]);
      addQuoteRequest(newRequest);

      setSubmittedRequest(newRequest);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const generatePDFReceipt = () => {
    if (!submittedRequest) return;
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Color Palette Definitions
      const purpleColor = [31, 23, 75]; // #1f174b
      const orangeColor = [242, 94, 34]; // #f25e22
      const darkGray = [40, 40, 40];
      const lightGray = [120, 120, 120];

      // Draw Elegant Background Borders & Watermarks
      doc.setDrawColor(240, 240, 240);
      doc.setFillColor(250, 250, 252);
      doc.rect(5, 5, 200, 287, 'F'); // Main background card
      doc.setLineWidth(0.5);
      doc.setDrawColor(orangeColor[0], orangeColor[1], orangeColor[2]);
      doc.line(5, 5, 205, 5); // Orange line at the top

      // Header Section
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(26);
      doc.setTextColor(purpleColor[0], purpleColor[1], purpleColor[2]);
      doc.text('GPA', 15, 22);

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(orangeColor[0], orangeColor[1], orangeColor[2]);
      doc.text('GRUPO DE PRODUÇÃO ATIVA', 15, 27);

      // Document Title on the right
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(purpleColor[0], purpleColor[1], purpleColor[2]);
      doc.text('SIMULAÇÃO DE ORÇAMENTO', 130, 20);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.text(`Ref: ${submittedRequest.id}`, 130, 25);
      doc.text(`Data: ${submittedRequest.timestamp}`, 130, 30);
      doc.text(`Validade: 30 dias a contar desta data`, 130, 35);

      // Horizontal separator line
      doc.setLineWidth(0.3);
      doc.setDrawColor(220, 220, 225);
      doc.line(15, 42, 195, 42);

      // Company & Client Grid Layout
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(purpleColor[0], purpleColor[1], purpleColor[2]);
      doc.text('EMISSOR:', 15, 50);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.text('GPA Angola (Serviços Gráficos)', 15, 56);
      doc.text('Produção Industrial Gráfica e Têxtil em Luanda', 15, 62);
      doc.text('WhatsApp: +244 994 943 828', 15, 68);
      doc.text('Email: comercial@gpa.co.ao', 15, 74);

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(purpleColor[0], purpleColor[1], purpleColor[2]);
      doc.text('CLIENTE INTERESSADO:', 110, 50);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.text(submittedRequest.clientName, 110, 56);
      doc.text(`Telefone: ${submittedRequest.phone}`, 110, 62);
      doc.text(`Email: ${submittedRequest.email}`, 110, 68);

      // Horizontal separator line
      doc.line(15, 82, 195, 82);

      // Quote Description Table Section
      doc.setFillColor(245, 245, 248);
      doc.rect(15, 90, 180, 8, 'F'); // Table Header background

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(purpleColor[0], purpleColor[1], purpleColor[2]);
      doc.text('ESPECIFICAÇÃO DO PROJETO', 18, 95.5);
      doc.text('DETALHE DA CONFIGURAÇÃO', 110, 95.5);

      // Table Rows
      let currentY = 106;
      const drawRow = (label: string, value: string) => {
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        doc.text(label, 18, currentY);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        
        const splitVal = doc.splitTextToSize(value, 80);
        doc.text(splitVal, 110, currentY);

        doc.setDrawColor(235, 235, 240);
        doc.line(15, currentY + 4, 195, currentY + 4);
        currentY += 12;
      };

      const matchedService = SERVICES.find(s => s.id === submittedRequest.serviceId);
      drawRow('Categoria de Serviço:', matchedService ? matchedService.title : 'Serviço Personalizado');
      drawRow('Artigo Selecionado:', submittedRequest.product);
      drawRow('Quantidade Pretendida:', submittedRequest.quantity === -1 ? 'Ilimitada (Grandes Tiragens)' : `${submittedRequest.quantity.toLocaleString('pt-AO')} un.`);
      drawRow('Nível de Acabamento:', materialOption === 'standard' ? 'Económico (Standard)' : materialOption === 'premium' ? 'Premium (Gama Média)' : 'Luxo (Gama Alta)');
      drawRow('Urgência de Entrega:', urgency === 'baixa' ? 'Económica' : urgency === 'media' ? 'Normal / Padrão' : 'Urgente (Taxa de Prontidão)');
      drawRow('Instruções Adicionais:', submittedRequest.description || 'Nenhuma especificação adicional descrita.');

      // Pricing Summary Box
      currentY += 5;
      doc.setFillColor(253, 246, 243); // Subtle light orange background
      doc.rect(15, currentY, 180, 24, 'F');
      doc.setDrawColor(orangeColor[0], orangeColor[1], orangeColor[2]);
      doc.setLineWidth(0.4);
      doc.rect(15, currentY, 180, 24, 'D');

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(purpleColor[0], purpleColor[1], purpleColor[2]);
      doc.text('ESTIMATIVA DE CUSTO:', 22, currentY + 9);

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(orangeColor[0], orangeColor[1], orangeColor[2]);
      if (submittedRequest.quantity === -1) {
        doc.text('SOB CONSULTA (Preço de Escala Industrial / Atendimento Direto)', 22, currentY + 16);
      } else {
        doc.text(`${currentPrice.toLocaleString('pt-AO')} Kz (AOA)`, 22, currentY + 16);
      }

      // Information about price
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.text('* Esta é uma simulação preliminar e não substitui uma fatura pró-forma oficial emitida pelo departamento comercial da GPA Angola.', 22, currentY + 21);

      // Company Signature & Quality Watermarks
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(purpleColor[0], purpleColor[1], purpleColor[2]);
      doc.text('GARANTIA DE QUALIDADE GPA ANGOLA', 15, 260);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
      const footerTexts = [
        'A GPA Angola dispõe de tecnologia avançada de ponta para impressão digital, offset e fabrico industrial.',
        'Ao submeter esta simulação, os nossos gestores entram em contacto para verificar pormenores.',
        'Garantimos rigor milimétrico, cumprimento rigoroso de prazos de entrega e satisfação total.'
      ];
      footerTexts.forEach((txt, idx) => {
        doc.text(txt, 15, 265 + (idx * 4));
      });

      // Signature Area
      doc.setDrawColor(200, 200, 205);
      doc.line(140, 268, 190, 268);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('GPA Angola Comercial', 148, 272);

      // Save PDF File
      doc.save(`GPA_Angola_Orcamento_${submittedRequest.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Houve um erro ao gerar o comprovante em PDF.');
    }
  };


  const resetCalculator = () => {
    setStep(1);
    setServiceId('');
    setProduct('');
    setQuantity(100);
    setIsUnlimited(false);
    setMaterialOption('standard');
    setDescription('');
    setUrgency('media');
    setClientName('');
    setEmail('');
    setPhone('');
    setUploadedFiles([]);
    setIsSuccess(false);
    setSubmittedRequest(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Dark overlay backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-purple-dark/85 backdrop-blur-sm"
      ></motion.div>

      {/* Main Dialog Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[92vh] flex flex-col md:flex-row"
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full cursor-pointer transition-colors z-20"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: ACTIVE WORKSPACE & FORM (7 cols) */}
        <div className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto max-h-[60vh] md:max-h-full">
          
          {/* Header & Tabs */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-brand-orange/10 text-brand-orange rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-brand-purple">
                  Simulador de Orçamentos
                </h3>
                <span className="text-xs text-gray-400 font-sans mt-0.5 block">
                  Estime o custo do seu projeto gráfico de forma automática
                </span>
              </div>
            </div>

            {/* History Toggle button */}
            {history.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center space-x-1.5 text-xs font-semibold font-mono text-slate-800 hover:text-brand-orange transition-colors bg-gray-100 py-1.5 px-3 rounded-lg cursor-pointer"
              >
                <History className="w-3.5 h-3.5" />
                <span>{showHistory ? 'Voltar' : `Histórico (${history.length})`}</span>
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            
            {/* PAST REQUESTS HISTORY SHEET */}
            {showHistory ? (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-mono font-bold tracking-wider text-gray-500 uppercase">Seus Pedidos Recentes</h4>
                  <button 
                    onClick={() => {
                      if (confirm('Deseja limpar todo o seu histórico de simulações?')) {
                        localStorage.removeItem('gpa_quote_history');
                        setHistory([]);
                        setShowHistory(false);
                      }
                    }}
                    className="text-xs text-red-500 font-bold flex items-center space-x-1 hover:underline cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Apagar tudo</span>
                  </button>
                </div>

                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {history.map((req) => {
                    const serv = SERVICES.find(s => s.id === req.serviceId);
                    return (
                      <div key={req.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-150 relative space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-mono font-bold text-brand-orange">{req.id}</span>
                            <h5 className="font-display font-bold text-sm text-slate-900 mt-0.5">{req.product}</h5>
                            <p className="text-[11px] text-gray-400 font-mono mt-0.5">{req.timestamp}</p>
                          </div>
                          <span className="text-[10px] font-semibold bg-green-100 text-green-700 py-0.5 px-2.5 rounded-full uppercase tracking-wide">
                            Pendente de Análise
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs font-sans border-t border-gray-200/60 pt-2 mt-2">
                          <div>
                            <span className="text-gray-400 block text-[10px] uppercase font-mono">Qtd.</span>
                            <span className="font-bold text-slate-800">
                              {req.quantity === -1 ? 'Ilimitada' : `${req.quantity} un.`}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[10px] uppercase font-mono">Urgência</span>
                            <span className="font-bold text-slate-800 capitalize">{req.urgency}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[10px] uppercase font-mono">Contacto</span>
                            <span className="font-bold text-slate-800 truncate block max-w-[80px]" title={req.phone}>{req.phone}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ) : isSuccess ? (
              
              /* SUCCESS SCREEN WITH CONFETTI-LIKE PRESENTATION */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-10 space-y-6"
              >
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-2xl font-display font-black text-brand-purple">Orçamento Simulado com Sucesso!</h4>
                  <p className="text-sm text-gray-500 font-sans max-w-md mx-auto">
                    Obrigado, <span className="font-semibold text-slate-950">{clientName}</span>. O seu pedido foi registado na nossa central de produção sob o número de referência <span className="font-mono font-bold text-brand-orange">{submittedRequest?.id}</span>.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-2xl max-w-sm mx-auto text-left space-y-3 border border-slate-800 shadow-md">
                  <span className="text-[10px] font-mono text-brand-orange font-bold uppercase">Resumo da Simulação</span>
                  <div className="space-y-1.5 text-xs font-sans">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Produto:</span>
                      <span className="font-bold">{product}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Quantidade:</span>
                      <span className="font-bold">{isUnlimited ? 'Ilimitada / Grandes Tiragens' : `${quantity} un.`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Preço:</span>
                      <span className="font-bold text-brand-orange text-xs uppercase tracking-wider">Sob consulta / Linha de Atendimento</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <a
                    href={`https://wa.me/${siteConfig?.companyPhones && siteConfig.companyPhones.length > 0 ? siteConfig.companyPhones[0].replace(/\s+/g, '').replace('+', '') : '244994943828'}?text=${encodeURIComponent(
                      `📋 *SOLICITAÇÃO DE ORÇAMENTO - GPA ANGOLA*\n` +
                      `-----------------------------------------------\n` +
                      `🔖 *Ref:* ${submittedRequest?.id || 'GPA-REQ'}\n` +
                      `📦 *Produto / Serviço:* ${product || 'Produção Gráfica'}\n` +
                      `🔢 *Quantidade:* ${isUnlimited ? 'Ilimitada (Produção Industrial)' : `${quantity.toLocaleString('pt-AO')} unidades`}\n` +
                      `💎 *Linha de Acabamento:* ${materialOption === 'standard' ? 'Económica' : materialOption === 'premium' ? 'Premium' : 'Luxo'}\n` +
                      `⚡ *Urgência:* ${urgency === 'baixa' ? 'Económica (-5%)' : urgency === 'media' ? 'Normal (Padrão)' : 'Urgente (+25%)'}\n` +
                      `💰 *Valor Estimado:* ${isUnlimited ? 'Sob Consulta' : `${currentPrice.toLocaleString('pt-AO')} Kz`}\n` +
                      `-----------------------------------------------\n` +
                      `👤 *Cliente / Empresa:* ${clientName}\n` +
                      `📧 *Email:* ${email}\n` +
                      `📞 *Contacto:* ${phone}\n` +
                      `💬 *Notas:* ${description || 'Sem observações adicionais'}\n` +
                      `-----------------------------------------------\n` +
                      `_Mensagem gerada via gpa.co.ao_`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white font-display font-bold py-3.5 px-6 rounded-xl text-xs sm:text-sm shadow-lg hover:shadow-green-500/20 flex items-center justify-center space-x-2 w-full sm:w-auto cursor-pointer transition-all"
                  >
                    <span>Falar no WhatsApp (Atendimento)</span>
                  </a>

                  <button
                    onClick={generatePDFReceipt}
                    type="button"
                    className="bg-brand-purple hover:bg-brand-purple/90 text-white font-display font-bold py-3 px-6 rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center space-x-2 w-full sm:w-auto cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Descarregar Comprovante PDF</span>
                  </button>

                  <button
                    onClick={resetCalculator}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-display font-semibold py-3 px-6 rounded-xl text-xs sm:text-sm transition-colors w-full sm:w-auto cursor-pointer"
                  >
                    Fazer nova simulação
                  </button>
                </div>
              </motion.div>
            ) : (
              
              /* LIVE MULTI-STEP CONVERSATIONAL FORM FORM */
              <div key="form" className="space-y-6">
                
                {/* Step Indicators */}
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className={`h-2 rounded-full flex-1 transition-all duration-300 ${
                        s === step
                          ? 'bg-brand-orange w-8'
                          : s < step
                          ? 'bg-slate-900'
                          : 'bg-gray-200'
                      }`}
                    ></div>
                  ))}
                </div>

                {/* STEP 1: SERVICE CATEGORY SELECTION */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h4 className="text-base font-display font-extrabold text-slate-900">
                      Passo 1: Qual é o tipo de serviço que procura?
                    </h4>
                    <div className="grid grid-cols-2 gap-3.5">
                      {SERVICES.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setServiceId(s.id);
                            // Auto populate first product
                            if (s.typicalProducts.length > 0) {
                              setProduct(s.typicalProducts[0]);
                            }
                            setStep(2);
                          }}
                          className={`p-4 rounded-xl text-left border cursor-pointer transition-all ${
                            serviceId === s.id
                              ? 'border-brand-orange bg-brand-orange/5 ring-2 ring-brand-orange/10'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <span className="font-display font-bold text-sm text-slate-900 block">
                            {s.title}
                          </span>
                          <span className="text-[11px] text-gray-500 font-sans mt-1 line-clamp-1">
                            {s.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: PRODUCT & QUANTITY DETAILS */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <h4 className="text-base font-display font-extrabold text-slate-900">
                      Passo 2: Configurar Produto & Tiragem
                    </h4>

                    {/* Product Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold tracking-wider text-gray-400 uppercase">Escolha o Artigo</label>
                      <select
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 rounded-xl p-3 text-sm font-sans text-gray-800 outline-none transition-all"
                      >
                        {availableProducts.map((p, i) => (
                          <option key={i} value={p}>{p}</option>
                        ))}
                        <option value="Outro Artigo Customizado">Outro Artigo (Especificar no passo 3)</option>
                      </select>
                    </div>

                    {/* Quantity Selector Slider */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-mono font-bold">
                        <span className="text-gray-400 uppercase">Quantidade Pretendida</span>
                        <div className="flex items-center space-x-2">
                          {isUnlimited ? (
                            <span className="bg-brand-orange/15 text-brand-orange py-1 px-2.5 rounded-full text-xs font-bold font-display animate-pulse">
                              Ilimitado / Produção Contínua
                            </span>
                          ) : (
                            <input
                              type="number"
                              min="1"
                              value={quantity}
                              onChange={(e) => {
                                const val = Math.max(1, parseInt(e.target.value) || 1);
                                setQuantity(val);
                              }}
                              className="w-24 bg-gray-50 border border-gray-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/15 rounded-lg py-1 px-2 text-right text-xs font-bold text-brand-orange outline-none"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => setIsUnlimited(!isUnlimited)}
                            className={`py-1 px-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                              isUnlimited 
                                ? 'bg-brand-purple text-white hover:bg-brand-purple/90' 
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {isUnlimited ? "Definir Qtd" : "Tornar Ilimitado"}
                          </button>
                        </div>
                      </div>

                      {!isUnlimited && (
                        <>
                          <input
                            type="range"
                            min="1"
                            max="1000000"
                            step={quantity < 100 ? 5 : quantity < 1000 ? 50 : quantity < 10000 ? 500 : quantity < 100000 ? 5000 : 50000}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                          />
                          <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                            <span>1 un.</span>
                            <span>1.000 un.</span>
                            <span>100.000 un.</span>
                            <span>1.000.000 un.</span>
                          </div>

                          {/* Warning for quantity below minimum recommended */}
                          {(() => {
                            const defaultMinQtys: Record<string, number> = {
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
                            };
                            const minQty = product ? (siteConfig?.productMinQtys?.[product] ?? defaultMinQtys[product] ?? 1) : 1;
                            if (quantity < minQty) {
                              return (
                                <div className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200/50 rounded-lg p-2.5 mt-2 flex items-start space-x-1.5 font-sans leading-snug">
                                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                                  <span>
                                    <strong>Quantidade Abaixo do Mínimo:</strong> O mínimo recomendado no PDF é de {minQty.toLocaleString('pt-AO')} un. Poderão ser aplicadas taxas de acerto de máquina.
                                  </span>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </>
                      )}
                    </div>

                    {/* Material Quality selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold tracking-wider text-gray-400 uppercase">Gama / Acabamento</label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {[
                          { val: 'standard', label: 'Económica', desc: 'Material Standard' },
                          { val: 'premium', label: 'Premium', desc: 'Fosco + UV (+35%)' },
                          { val: 'luxury', label: 'Luxo', desc: 'Gama Alta (+75%)' },
                        ].map((o) => (
                          <button
                            key={o.val}
                            type="button"
                            onClick={() => setMaterialOption(o.val)}
                            className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                              materialOption === o.val
                                ? 'border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange/20'
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <span className="font-display font-bold text-xs text-slate-900 block">{o.label}</span>
                            <span className="text-[9px] text-gray-400 block mt-0.5">{o.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: SPECIFICATIONS, DESCRIPTION & FILE UPLOAD */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <h4 className="text-base font-display font-extrabold text-slate-900">
                      Passo 3: Pormenores do Design & Logótipo
                    </h4>

                    {/* Text description */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold tracking-wider text-gray-400 uppercase">Indique os Pormenores do seu Pedido</label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ex: T-shirts pretas com logo dourado no peito e slogan na costa..."
                        className="w-full bg-gray-50 border border-gray-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 rounded-xl p-3 text-sm font-sans text-gray-800 outline-none placeholder-gray-400 focus:outline-none resize-none transition-all"
                      ></textarea>
                    </div>

                    {/* Drag and drop file uploader (USABILITY PATTERN REQUESTED) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold tracking-wider text-gray-400 uppercase">Anexar Logótipo ou Esboço</label>
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all ${
                          isDragging 
                            ? 'border-brand-orange bg-brand-orange/5' 
                            : 'border-gray-200 bg-gray-50 hover:bg-gray-100/70'
                        }`}
                      >
                        <input
                          type="file"
                          id="calc-file-upload"
                          multiple
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <label htmlFor="calc-file-upload" className="cursor-pointer block space-y-2">
                          <Upload className="w-8 h-8 text-brand-orange mx-auto opacity-80" />
                          <div className="text-xs font-sans text-gray-600">
                            <span className="font-bold text-brand-orange">Arraste e solte</span> ou <span className="underline">navegue</span> para carregar ficheiro
                          </div>
                          <span className="text-[10px] text-gray-400 block font-mono">Formatos suportados: PNG, JPG, PDF, SVG, AI (Máx. 10MB)</span>
                        </label>
                      </div>

                      {/* Uploaded files list */}
                      {uploadedFiles.length > 0 && (
                        <div className="space-y-2 mt-2 max-h-24 overflow-y-auto">
                          {uploadedFiles.map((file, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-xl border border-gray-100 text-xs font-sans">
                              <div className="flex items-center space-x-2 text-gray-700 font-semibold truncate max-w-[200px]">
                                <FileText className="w-4 h-4 text-brand-orange flex-shrink-0" />
                                <span className="truncate">{file.name}</span>
                              </div>
                              <div className="flex items-center space-x-2.5">
                                <span className="text-gray-400 font-mono">{file.size}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFile(i)}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                  title="Remover ficheiro"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Urgency selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold tracking-wider text-gray-400 uppercase">Urgência na Produção</label>
                      <div className="flex bg-gray-100 p-1.5 rounded-xl gap-1">
                        {[
                          { val: 'baixa', label: 'Económica (-5%)', desc: 'Prazos flexíveis' },
                          { val: 'media', label: 'Normal (Padrão)', desc: 'Produção padrão' },
                          { val: 'alta', label: 'Urgente (+25%)', desc: 'Tiragem prioritária' },
                        ].map((u) => (
                          <button
                            key={u.val}
                            type="button"
                            onClick={() => setUrgency(u.val as any)}
                            className={`flex-1 py-2 px-3 rounded-lg text-center cursor-pointer transition-all ${
                              urgency === u.val
                                ? 'bg-white text-slate-900 font-bold shadow-sm ring-1 ring-black/5'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-white/40 text-xs'
                            }`}
                          >
                            <span className="font-display font-bold text-xs block">{u.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: CONTACT & DETAILS */}
                {step === 4 && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h4 className="text-base font-display font-extrabold text-slate-900">
                        Passo 4: Dados de Contacto para Envio
                      </h4>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold tracking-wider text-gray-400 uppercase">Seu Nome / Nome da Empresa</label>
                        <input
                          type="text"
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="Ex: Manuel Antunes"
                          className="w-full bg-gray-50 border border-gray-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 rounded-xl p-3 text-sm font-sans text-gray-800 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold tracking-wider text-gray-400 uppercase">Endereço de Email</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Ex: manuel@empresa.co.ao"
                          className="w-full bg-gray-50 border border-gray-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 rounded-xl p-3 text-sm font-sans text-gray-800 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold tracking-wider text-gray-400 uppercase">Contacto Telefónico (Angola)</label>
                        <div className="flex">
                          <span className="bg-gray-100 border border-r-0 border-gray-200 text-gray-500 rounded-l-xl p-3 text-sm font-mono flex items-center justify-center">+244</span>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Ex: 923 456 789"
                            className="w-full bg-gray-50 border border-gray-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 rounded-r-xl p-3 text-sm font-sans text-gray-800 outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Policy note */}
                      <div className="flex items-start space-x-2.5 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                        <AlertCircle className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" />
                        <span className="text-[10px] text-gray-400 leading-snug">
                          Ao submeter o seu pedido, os nossos comerciais analisarão os ficheiros anexados e enviarão a cotação oficial em PDF para o seu email nas 2 horas seguintes.
                        </span>
                      </div>

                    </motion.div>
                  </form>
                )}

                {formError && (
                  <div className="bg-red-50 text-red-600 border border-red-200/60 rounded-xl p-3 text-xs font-sans text-center mb-4">
                    {formError}
                  </div>
                )}

                {/* Form Navigation Buttons */}
                <div className="border-t border-gray-100 pt-5 mt-4 flex items-center justify-between">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="flex items-center space-x-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-xl font-display font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Anterior</span>
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {step < 4 ? (
                    <button
                      type="button"
                      disabled={step === 1 && !serviceId}
                      onClick={() => setStep(step + 1)}
                      className={`flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-5 rounded-xl font-display font-bold text-xs transition-all cursor-pointer ${
                        step === 1 && !serviceId ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <span>Seguinte</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex items-center space-x-1.5 bg-brand-orange hover:bg-brand-orange-hover text-white py-2.5 px-6 rounded-xl font-display font-bold text-xs transition-all cursor-pointer shadow-md"
                    >
                      {isSubmitting ? (
                        <span>Enviando...</span>
                      ) : (
                        <>
                          <span>Submeter Simulação</span>
                          <Check className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>

              </div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: PRICE RUNNING SUMMARY PANEL (3 cols) */}
        <div className="w-full md:w-80 bg-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800 relative">
          
          {/* Decorative glowing spheres */}
          <div className="absolute top-10 right-0 w-48 h-48 bg-brand-orange/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="space-y-6 relative z-10">
            <h4 className="text-xs font-mono font-bold tracking-wider text-brand-orange uppercase">Estimativa Financeira</h4>

            {serviceId ? (
              <div className="space-y-5">
                
                {/* Selected item status header */}
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-[10px] font-mono text-gray-400 font-bold block uppercase">Serviço Pretendido</span>
                  <span className="font-display font-bold text-sm block text-white mt-1">
                    {SERVICES.find(s => s.id === serviceId)?.title}
                  </span>
                  
                  {product && (
                    <span className="text-xs text-gray-300 block mt-1">
                      Artigo: <span className="font-semibold text-brand-orange">{product}</span>
                    </span>
                  )}
                </div>

                {/* Sub-item pricing block */}
                <div className="space-y-2.5 text-xs font-sans">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Quantidade:</span>
                    <span className="font-bold">{isUnlimited ? "Ilimitada" : `${quantity.toLocaleString('pt-AO')} un.`}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-300">Gama Material:</span>
                    <span className="font-bold capitalize">{materialOption}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-300">Urgência:</span>
                    <span className="font-bold capitalize">{urgency}</span>
                  </div>

                  {!isUnlimited && quantity >= 50 && (
                    <div className="flex justify-between text-green-400">
                      <span>Desconto Volume:</span>
                      <span className="font-bold">
                        {quantity >= 1000 ? '-30%' : quantity >= 250 ? '-15%' : '-5%'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Total pricing display with large fonts */}
                <div className="bg-white/5 p-4 rounded-xl border border-slate-800 mt-4 space-y-2">
                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest font-bold">Preço Estimado</span>
                  <div className="font-display font-black text-xl text-brand-orange">
                    {isUnlimited ? "Sob Consulta (Alta Escala)" : `${currentPrice.toLocaleString('pt-AO')} Kz`}
                  </div>
                  <span className="text-[9px] text-gray-300 block font-sans leading-snug">
                    {isUnlimited 
                      ? "A produção industrial de grande escala e contínua é cotada sob medida para garantir o preço mais baixo de Angola." 
                      : "Esta é uma simulação com base em taxas padrão. O valor exato será confirmado no orçamento enviado em PDF."}
                  </span>
                </div>

              </div>
            ) : (
              
              /* Default screen prior to choosing a service category */
              <div className="text-center py-10 space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl max-w-[100px] mx-auto text-gray-300">
                  <AlertCircle className="w-8 h-8 text-brand-orange mx-auto animate-pulse" />
                </div>
                <p className="text-xs text-gray-300 font-sans leading-relaxed">
                  Por favor, escolha uma categoria de serviço no formulário à esquerda para desbloquear a calculadora dinâmica.
                </p>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-800 mt-6 relative z-10 space-y-2">
            <div className="flex items-center space-x-2 text-[10px] text-gray-300 font-sans font-medium">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span>Garantia de Preço Justo GPA</span>
            </div>
            <p className="text-[9px] text-gray-400 font-sans leading-relaxed">
              Os nossos preços corporativos são actualizados semanalmente com base no custo de mercado da matéria prima.
            </p>
          </div>

        </div>

      </motion.div>
    </div>
  );
}
