import React, { useState } from 'react';
import { X, Sparkles, Send, ShieldCheck, ArrowLeft, Bot, User, CheckCircle2 } from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookConsultation: () => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onBookConsultation,
}) => {
  const [messages, setMessages] = useState<
    { sender: 'AI' | 'USER'; text: string; source?: string }[]
  >([
    {
      sender: 'AI',
      text: 'مرحباً بك! أنا "مُستشار مِيزان الذكي". كيف يمكنني مساعدتك اليوم في توضيح الضرائب المصرية، منظومة الفاتورة الإلكترونية، أو تأسيس نشاطك التجاري؟',
      source: 'GEMINI_AI',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'هل نشاطي ملزم بالانضمام لمنظومة الفاتورة الإلكترونية؟',
    'ما هي الشريحة المعفاة من ضريبة الدخل السنوية في مصر؟',
    'ما الفرق بين تأسيس شركة الشخص الواحد والشركة ذات المسؤولية المحدودة؟',
    'متى يكون التسجيل في ضريبة القيمة المضافة إلزامياً؟',
  ];

  const handleSend = async (queryText?: string) => {
    const text = queryText || inputQuery;
    if (!text.trim()) return;

    const userMsg = { sender: 'USER' as const, text };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
      });
      const json = await res.json();
      if (json.success) {
        setMessages((prev) => [
          ...prev,
          { sender: 'AI', text: json.answer, source: json.source },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'AI',
          text: 'عذراً، حدث خطأ مؤقت في الاتصال. يمكنك دائماً مراجعة أحد محاسبينا القانونيين المعتمدين مباشرة.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[620px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#142B43] px-6 py-4 text-white flex items-center justify-between border-b border-[#D6AE57]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D6AE57] to-[#B88E33] p-0.5 shadow-sm">
              <div className="w-full h-full bg-[#142B43] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#D6AE57]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-['Cairo']">مُستشار مِيزان الذكي</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D6AE57]/20 text-[#D6AE57] border border-[#D6AE57]/30 font-semibold">
                  مساعد مالي مدعوم بالذكاء الاصطناعي
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                إرشادات ضريبية وتوجيه أولي استناداً للأنظمة المصرية
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#F5F7FA]">
          {messages.map((m, idx) => {
            const isAI = m.sender === 'AI';
            return (
              <div key={idx} className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}>
                {isAI && (
                  <div className="w-8 h-8 rounded-full bg-[#142B43] text-[#D6AE57] flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                    isAI
                      ? 'bg-white text-slate-800 border border-slate-200 rounded-tr-none'
                      : 'bg-[#142B43] text-white rounded-tl-none font-medium'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                {!isAI && (
                  <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center text-xs text-slate-500">
              <div className="w-8 h-8 rounded-full bg-[#142B43] text-[#D6AE57] flex items-center justify-center">
                <Sparkles className="w-4 h-4 animate-spin-slow" />
              </div>
              <span className="p-3 bg-white rounded-2xl border border-slate-200">
                المستشار الذكي يحلل القوانين واللوائح المصرية لإجابتك...
              </span>
            </div>
          )}
        </div>

        {/* Suggestion Prompt Chips */}
        <div className="px-4 py-2 bg-white border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] text-slate-400 shrink-0">مقترحات:</span>
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#D6AE57]/15 hover:text-[#B88E33] text-slate-600 text-[11px] transition-colors whitespace-nowrap cursor-pointer shrink-0"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Disclaimer & Action Bar */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 text-center sm:text-right">
            <ShieldCheck className="w-4 h-4 text-[#D6AE57] shrink-0" />
            <span>المعلومات للإرشاد والتوعية ولا تغني عن استشارة رسمية لمستنداتك.</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onBookConsultation();
            }}
            className="px-4 py-2 rounded-xl bg-[#D6AE57] hover:bg-[#E2C378] text-[#0B1725] font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>احجز مع محاسب معتمد الآن</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-[#0B1725] flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="اسأل المستشار الذكي عن الضرائب أو الفاتورة أو التأسيس..."
            className="flex-1 bg-slate-800 text-white placeholder-slate-400 text-xs rounded-xl px-4 py-3 border border-slate-700 focus:outline-none focus:border-[#D6AE57]"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="p-3 rounded-xl bg-[#D6AE57] text-[#0B1725] hover:bg-[#E2C378] transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
