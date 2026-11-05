import React, { useState, useEffect } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  Send,
  Paperclip,
  Clock,
  ShieldCheck,
  FileText,
  Star,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { Booking, Message } from '../types';

interface ConsultationRoomProps {
  booking: Booking;
  onLeaveRoom: () => void;
  onConsultationFinished: (bookingId: string) => void;
}

export const ConsultationRoom: React.FC<ConsultationRoomProps> = ({
  booking,
  onLeaveRoom,
  onConsultationFinished,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(45 * 60); // 45 minutes
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Fetch consultation messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/consultations/${booking.id}/messages`);
        const json = await res.json();
        if (json.success) {
          setMessages(json.data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchMessages();

    // Timer countdown
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [booking.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      const res = await fetch(`/api/consultations/${booking.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: inputText }),
      });
      const json = await res.json();
      if (json.success) {
        setMessages((prev) => [...prev, json.data]);
        setInputText('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAttachQuickDoc = async () => {
    const docName = 'tax_exemption_notes_2026.pdf';
    try {
      const res = await fetch(`/api/consultations/${booking.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'قام المستشار بمشاركة مستند التوصيات الضريبية الرسمية للجلسة.',
          attachmentUrl: '#',
          attachmentName: docName,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMessages((prev) => [...prev, json.data]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleEndConsultation = () => {
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    setIsSubmittingReview(true);
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          accountantId: booking.accountantId,
          rating: reviewRating,
          comment: reviewComment || 'استشارة ممتازة ومفيدة جداً، شكراً جزيلاً للمستشار.',
        }),
      });

      // Update status to COMPLETED
      await fetch(`/api/bookings/${booking.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' }),
      });

      onConsultationFinished(booking.id);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingReview(false);
      setShowReviewModal(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1725] text-white flex flex-col overflow-hidden">
      {/* Room Header */}
      <div className="bg-[#142B43] px-6 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#D6AE57]/40 bg-slate-800">
            <img src={booking.accountantAvatar} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">{booking.accountantName}</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                جلسة مباشرة
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {booking.serviceNameAr} • رقم الحجز: {booking.bookingNumber}
            </p>
          </div>
        </div>

        {/* Center: Session Countdown */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0B1725] border border-slate-700 text-xs">
          <Clock className="w-4 h-4 text-[#D6AE57]" />
          <span>الوقت المتبقي للجلسة:</span>
          <span className="font-mono font-bold text-[#D6AE57] text-sm">
            {formatTimer(secondsRemaining)}
          </span>
        </div>

        {/* Right: End Session Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleEndConsultation}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow cursor-pointer"
          >
            <PhoneOff className="w-4 h-4" />
            <span>إنهاء الاستشارة</span>
          </button>
        </div>
      </div>

      {/* Main Room Body: Left Stream & Right Chat */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Stream & Presentation View (7 Cols) */}
        <div className="lg:col-span-8 bg-[#0B1725] p-4 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-l border-slate-800">
          {/* Main Video Tile */}
          <div className="flex-1 rounded-2xl bg-gradient-to-br from-[#142B43] to-[#0A1624] border border-slate-800 relative overflow-hidden flex items-center justify-center shadow-inner">
            {isVideoOn ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={booking.accountantAvatar}
                  alt={booking.accountantName}
                  className="w-full h-full object-cover filter brightness-90 max-h-[520px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-[#0B1725]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-white">
                  <ShieldCheck className="w-4 h-4 text-[#D6AE57]" />
                  <span>{booking.accountantName} (محاسب قانوني معتمد)</span>
                </div>
              </div>
            ) : (
              <div className="text-center p-8">
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-500">
                  <VideoOff className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-slate-300">الكاميرا متوقفة</h4>
                <p className="text-xs text-slate-500">الاتصال الصوتي مشفر ومستمر</p>
              </div>
            )}

            {/* Self Video PIP (Picture in Picture) */}
            <div className="absolute top-4 left-4 w-32 sm:w-40 aspect-video rounded-xl bg-[#0B1725] border-2 border-[#D6AE57]/40 overflow-hidden shadow-2xl flex items-center justify-center">
              <span className="text-[11px] text-slate-300 font-semibold">أنت (العميل)</span>
            </div>
          </div>

          {/* Media Control Toolbar */}
          <div className="mt-4 py-2 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-2xl transition-all cursor-pointer ${
                isMicOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-600 text-white'
              }`}
              title={isMicOn ? 'كتم الميكروفون' : 'تشغيل الميكروفون'}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3 rounded-2xl transition-all cursor-pointer ${
                isVideoOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-600 text-white'
              }`}
              title={isVideoOn ? 'إيقاف الكاميرا' : 'تشغيل الكاميرا'}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-3 rounded-2xl transition-all cursor-pointer ${
                isScreenSharing ? 'bg-[#D6AE57] text-[#0B1725]' : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
              title="مشاركة الشاشة لمراجعة الفواتير"
            >
              <Monitor className="w-5 h-5" />
            </button>

            <button
              onClick={handleAttachQuickDoc}
              className="px-4 py-3 rounded-2xl bg-[#142B43] hover:bg-[#1A385A] border border-[#D6AE57]/30 text-xs font-semibold text-[#D6AE57] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>مشاركة مستند وتوصيات</span>
            </button>
          </div>
        </div>

        {/* Live Chat & Document Repository (4 Cols) */}
        <div className="lg:col-span-4 bg-[#142B43] flex flex-col justify-between h-full overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-700/80 bg-[#142B43] flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D6AE57]" />
              <span>المحادثة المباشرة وتبادل الملفات</span>
            </h3>
            <span className="text-[10px] text-slate-400">تشفير تام من طرف لطرف</span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg) => {
              const isMe = msg.senderRole === 'CUSTOMER';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-slate-400 mb-0.5 px-1">{msg.senderName}</span>
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                      isMe
                        ? 'bg-[#D6AE57] text-[#0B1725] rounded-br-none font-medium'
                        : 'bg-slate-800 text-white rounded-bl-none border border-slate-700'
                    }`}
                  >
                    <p>{msg.content}</p>

                    {msg.attachmentName && (
                      <div className="mt-2 pt-2 border-t border-black/10 flex items-center gap-2 bg-white/10 p-2 rounded-lg">
                        <FileText className="w-4 h-4 shrink-0" />
                        <span className="truncate underline font-bold">{msg.attachmentName}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-0.5 px-1">{msg.createdAt}</span>
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-[#0B1725] border-t border-slate-700/80 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب استفسارك أو أرسل ملاحظة..."
              className="flex-1 bg-slate-800 text-white placeholder-slate-400 text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-[#D6AE57]"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[#D6AE57] text-[#0B1725] hover:bg-[#E2C378] transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Review Modal on End Consultation */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-[#142B43] rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold font-['Cairo'] text-center mb-1">
              تقييم الاستشارة والمستشار
            </h3>
            <p className="text-xs text-slate-500 text-center mb-4">
              رأيك يساعدنا في الحفاظ على جودة المستشارين المعتمدين في مِيزان
            </p>

            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                تعليقك وتجربتك المهنية:
              </label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="اكتب تفاصيل تجربتك مع المستشار..."
                className="w-full bg-[#F5F7FA] text-xs text-[#142B43] rounded-xl p-3 border border-slate-200 focus:outline-none focus:border-[#D6AE57]"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isSubmittingReview}
                onClick={handleSubmitReview}
                className="flex-1 py-3 rounded-xl bg-[#142B43] hover:bg-[#D6AE57] text-white hover:text-[#0B1725] font-bold text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSubmittingReview ? 'جارٍ تسجيل التقييم...' : 'نشر التقييم وإنهاء الجلسة'}
              </button>
              <button
                type="button"
                onClick={onLeaveRoom}
                className="px-4 py-3 rounded-xl border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                تخطي
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
