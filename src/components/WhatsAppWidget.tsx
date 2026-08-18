import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, MessageCircle, ArrowRight, UserCheck } from 'lucide-react';
import { ChatMessage } from '../types';
import { getAdminUsers, AdminUser, saveAssistantChatSession, getNextCommercialRotation } from '../firebaseClient';

interface WhatsAppWidgetProps {
  companyPhones?: string[];
}

export default function WhatsAppWidget({ companyPhones }: WhatsAppWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [unreadCount, setUnreadCount] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [onlineReps, setOnlineReps] = useState<AdminUser[]>([]);

  // Setup Session ID dynamically
  const sessionIdRef = useRef<string>('');
  if (!sessionIdRef.current) {
    let sId = localStorage.getItem('gpa_chat_session_id');
    if (!sId) {
      sId = 'session_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      localStorage.setItem('gpa_chat_session_id', sId);
    }
    sessionIdRef.current = sId;
  }

  // Sync messages to Firestore in real-time
  useEffect(() => {
    if (messages.length > 0) {
      const sessionId = sessionIdRef.current;
      const clientName = localStorage.getItem('gpa_client_name') || `Cliente #${sessionId.slice(-4).toUpperCase()}`;
      
      saveAssistantChatSession({
        id: sessionId,
        clientName: clientName,
        lastActive: new Date().toISOString(),
        messages: messages
      }).catch(err => {
        console.warn('[Firestore] Error saving assistant chat:', err);
      });
    }
  }, [messages]);

  const primaryPhone = companyPhones && companyPhones.length > 0 ? companyPhones[0] : '+244 994 943 828';
  const cleanPrimaryPhone = primaryPhone.replace(/\s+/g, '').replace('+', '').replace('-', '');

  // Fetch online commercial reps from Firestore
  useEffect(() => {
    async function fetchOnlineReps() {
      try {
        const admins = await getAdminUsers();
        // Filter admins that are online and have a WhatsApp number
        const online = admins.filter(u => u.isOnline && u.whatsappNumber);
        setOnlineReps(online);
      } catch (err) {
        console.warn('Error fetching online reps:', err);
      }
    }
    fetchOnlineReps();
    const interval = setInterval(fetchOnlineReps, 20000); // refresh every 20s
    return () => clearInterval(interval);
  }, []);

  // Initialize with greeting
  useEffect(() => {
    setMessages([
      {
        id: 'msg-init',
        sender: 'bot',
        text: 'Olá! Bem-vindo à GPA Angola. Eu sou o Lito, o vosso assistente comercial virtual da nossa central industrial. Como posso impulsionar o seu negócio hoje?',
        timestamp: new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  const suggestAnswers = [
    { text: '📍 Onde fica a fábrica?', tag: 'local' },
    { text: '📞 Falar com Comercial', tag: 'comercial' },
    { text: '👔 Fazem fardamento têxtil?', tag: 'textil' },
    { text: '⚡ Como pedir orçamento?', tag: 'orcamento' }
  ];

  const triggerBotResponse = async (userText: string) => {
    let botText = '';
    let waLink: string | undefined = undefined;
    let shouldShowReps = false;
    const low = userText.toLowerCase();

    if (low.includes('local') || low.includes('onde') || low.includes('fábrica') || low.includes('morada') || low.includes('luanda')) {
      botText = 'A nossa fábrica principal e escritórios estão localizados no Município de Belas/Cabolombo, Av. Lúcio Lara, Zona Verde III, Rua 53 Porta n.º 01, Luanda, Angola. Ficamos abertos de Segunda a Sexta das 8:00 às 17:00, e aos Sábados até às 12:00. Venha fazer uma visita!';
    } else if (low.includes('comercial') || low.includes('comerciais') || low.includes('vendedor') || low.includes('vendedores') || low.includes('atendimento') || low.includes('ajuda') || low.includes('suporte') || low.includes('falar')) {
      const rep = await getNextCommercialRotation();
      if (rep) {
        const cleanRepPhone = (rep.whatsappNumber || '').replace(/\s+/g, '').replace('+', '').replace('-', '');
        botText = `Com certeza! O seu pedido de atendimento foi reencaminhado em sistema para o especialista *${rep.name}*, que está de serviço neste momento para o apoiar. Por favor, clique no botão verde abaixo para iniciar o chat directamente com ele no WhatsApp!`;
        waLink = `https://wa.me/${cleanRepPhone}?text=${encodeURIComponent(`Olá ${rep.name}! Solicito atendimento comercial da GPA Angola.`)}`;
      } else {
        botText = `Com certeza! De momento a nossa equipa comercial directa está fora de linha, mas pode falar directamente com o nosso atendimento geral ligando para o telemóvel ${primaryPhone} ou clicando no botão abaixo para nos enviar uma mensagem!`;
        waLink = `https://wa.me/${cleanPrimaryPhone}?text=${encodeURIComponent(`Olá GPA Angola! Preciso de atendimento comercial.`)}`;
      }
    } else if (low.includes('contacto') || low.includes('telefone') || low.includes('ligar') || low.includes('email') || low.includes('geral')) {
      botText = `Pode falar directamente com a nossa equipa comercial ligando para o telemóvel ${primaryPhone} ou enviando um email para atendimento@gpaangola.co.ao. Respondemos muito rápido!`;
    } else if (low.includes('farda') || low.includes('têxtil') || low.includes('camisete') || low.includes('polo') || low.includes('estamparia')) {
      botText = 'Sim! Somos especialistas em fardamento e estamparia têxtil. Personalizamos polos de algodão premium, t-shirts promocionais para campanhas, coletes refletores e fardas completas com bordado computadorizado ou serigrafia.';
    } else if (low.includes('orçamento') || low.includes('preço') || low.includes('quanto custa') || low.includes('estimativa')) {
      botText = 'Para obter preços na hora, utilize o nosso "Simulador de Orçamentos" clicando no botão laranja no topo do site! É muito simples e dá-lhe uma estimativa personalizada com apoio da nossa equipa.';
    } else if (low.includes('olá') || low.includes('bom dia') || low.includes('boa tarde') || low.includes('boa noite') || low.includes('ola')) {
      botText = 'Olá! Que bom falar consigo. Eu sou o Lito, o vosso assistente comercial virtual. Temos soluções prontas em impressão gráfica, sinalética exterior, brindes corporativos e stands. O que gostaria de produzir hoje?';
    } else {
      // General question fallback, but let's route to next commercial if any online rep is found!
      const rep = await getNextCommercialRotation();
      if (rep) {
        const cleanRepPhone = (rep.whatsappNumber || '').replace(/\s+/g, '').replace('+', '').replace('-', '');
        botText = `Excelente questão! Para falar directamente com o nosso especialista humano de serviço, *${rep.name}*, e obter uma resposta personalizada sobre a sua dúvida, clique no botão abaixo para iniciar o WhatsApp:`;
        waLink = `https://wa.me/${cleanRepPhone}?text=${encodeURIComponent(`Olá ${rep.name}! Gostaria de esclarecer uma dúvida sobre: ${userText}`)}`;
      } else {
        botText = 'Excelente questão! Para falar diretamente com o nosso atendimento humano sobre a sua dúvida e obter uma resposta personalizada, por favor clique no botão abaixo para me enviar esta mensagem via WhatsApp:';
        waLink = `https://wa.me/${cleanPrimaryPhone}?text=${encodeURIComponent(`Olá GPA Angola! Tenho uma questão sobre: ${userText}`)}`;
      }
    }

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: 'bot-' + Math.random(),
          sender: 'bot',
          text: botText,
          timestamp: new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' }),
          whatsappLink: waLink,
          showRepsList: shouldShowReps
        }
      ]);
    }, 400);
  };

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const newMsg: ChatMessage = {
      id: 'usr-' + Math.random(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Trigger bot automated feedback
    triggerBotResponse(textToSend);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      
      {/* Floating launcher icon button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={isOpen ? () => setIsOpen(false) : handleOpen}
        className="relative bg-whatsapp-official hover:bg-whatsapp-dark text-white p-4 sm:p-4.5 rounded-full shadow-2xl flex items-center justify-center cursor-pointer"
        title="Falar no WhatsApp"
      >
        <MessageCircle className="w-6.5 h-6.5" />
        
        {/* Unread dot badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </motion.button>

      {/* Expanded chat drawer interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30, x: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30, x: 10 }}
            transition={{ type: 'spring', damping: 22, stiffness: 220 }}
            className="absolute bottom-16 sm:bottom-18 right-0 w-[320px] sm:w-[360px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-150 flex flex-col h-[450px] z-50"
          >
            {/* Widget Green Header */}
            <div className="bg-whatsapp-dark text-white p-4 flex items-center justify-between shadow-sm relative">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 border border-white/25 flex items-center justify-center font-display font-extrabold text-base uppercase">
                    Li
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-whatsapp-official border-2 border-whatsapp-dark rounded-full"></span>
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm leading-none">Lito - Assistente Comercial</h4>
                  <span className="text-[10px] opacity-85 mt-1 block">● Resposta instantânea</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable messages thread */}
            <div 
              ref={scrollRef}
              className="flex-1 p-4 bg-gray-50 overflow-y-auto space-y-3 scroll-smooth"
            >
              {messages.map((msg) => {
                const isBot = msg.sender === 'bot';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 shadow-xs text-xs font-sans leading-relaxed ${
                        isBot
                          ? 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                          : 'bg-whatsapp-official text-white rounded-tr-none'
                      }`}
                    >
                      <p>{msg.text}</p>
                      
                      {msg.showRepsList && onlineReps.length > 0 && (
                        <div className="mt-3 space-y-2 border-t border-gray-100 pt-2.5">
                          <p className="text-[9px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Comerciais Disponíveis:</p>
                          {onlineReps.map((rep) => {
                            const repCleanPhone = (rep.whatsappNumber || '').replace(/\s+/g, '').replace('+', '').replace('-', '');
                            return (
                              <div key={rep.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 p-2 rounded-xl">
                                <div className="flex items-center space-x-2 min-w-0">
                                  <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                  </span>
                                  <p className="text-[11px] font-bold text-gray-800 truncate">{rep.name}</p>
                                </div>
                                <a
                                  href={`https://wa.me/${repCleanPhone}?text=${encodeURIComponent(`Olá ${rep.name}! Gostaria de falar com o comercial sobre um atendimento da GPA Angola.`)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-bold py-1 px-2.5 rounded-lg transition-all"
                                >
                                  Falar
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {msg.whatsappLink && (
                        <div className="mt-2 pt-1">
                          <a
                            href={msg.whatsappLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-sm transition-all"
                          >
                            <span>Enviar via WhatsApp</span>
                            <ArrowRight className="w-3 h-3" />
                          </a>
                        </div>
                      )}

                      <span className={`block text-[8px] text-right mt-1 font-mono ${isBot ? 'text-gray-400' : 'text-white/80'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Suggestion tap pills */}
            <div className="p-2 border-t border-gray-100 bg-white flex flex-wrap gap-1.5 justify-center max-h-24 overflow-y-auto">
              {suggestAnswers.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s.text)}
                  className="bg-gray-100 hover:bg-whatsapp-official/10 hover:text-whatsapp-dark text-gray-600 text-[10px] font-sans font-semibold py-1 px-2.5 rounded-full border border-gray-150 transition-colors cursor-pointer"
                >
                  {s.text}
                </button>
              ))}
            </div>

            {/* Chat Input row */}
            <div className="p-3 border-t border-gray-150 bg-white flex items-center space-x-2">
              <input
                type="text"
                placeholder="Escreva a sua mensagem..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend(inputText);
                }}
                className="flex-1 bg-gray-50 border border-gray-200 focus:border-whatsapp-official focus:ring-1 focus:ring-whatsapp-official/15 rounded-xl py-2 px-3 text-xs font-sans text-gray-800 placeholder-gray-400 focus:outline-none transition-all"
              />
              <button
                onClick={() => handleSend(inputText)}
                className="bg-whatsapp-official hover:bg-whatsapp-dark text-white p-2 rounded-xl transition-colors cursor-pointer"
                title="Enviar"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Direct Human link footer bar */}
            <div className="bg-whatsapp-official/10 border-t border-whatsapp-official/20 py-2.5 px-4 text-center text-[10px] font-semibold text-whatsapp-dark hover:bg-whatsapp-official/20 transition-colors flex flex-col items-center justify-center space-y-1">
              {onlineReps.length > 0 ? (
                <div className="flex items-center space-x-1.5 justify-center">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Comerciais online disponíveis para si acima!</span>
                </div>
              ) : (
                <a
                  href={`https://wa.me/${cleanPrimaryPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center space-x-1"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Chamar operador humano no WhatsApp oficial</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
