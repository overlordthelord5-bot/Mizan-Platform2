import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { db } from './src/data/mockDatabase';
import { calculateEgyptianIncomeTaxEstimate } from './src/utils/finance';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// -----------------------------------------------------------------------------
// REST API ROUTES (/api/...)
// -----------------------------------------------------------------------------

// 1. Current User & Auth
app.get('/api/auth/me', (req, res) => {
  res.json({ success: true, user: db.getCurrentUser() });
});

app.post('/api/auth/switch-role', (req, res) => {
  const { role } = req.body;
  if (!['CUSTOMER', 'ACCOUNTANT', 'SUPER_ADMIN'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  const user = db.setCurrentUserRole(role);
  res.json({ success: true, user });
});

// 2. Accountants
app.get('/api/accountants', (req, res) => {
  const { search, governorate, specialty, minPrice, maxPrice, minRating, sortBy } = req.query;
  const accountants = db.getAccountants({
    search: search ? String(search) : undefined,
    governorate: governorate ? String(governorate) : undefined,
    specialty: specialty ? String(specialty) : undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    minRating: minRating ? Number(minRating) : undefined,
    sortBy: sortBy as any,
  });
  res.json({ success: true, count: accountants.length, data: accountants });
});

app.get('/api/accountants/:id', (req, res) => {
  const accountant = db.getAccountantById(req.params.id);
  if (!accountant) {
    return res.status(404).json({ error: 'المحاسب غير موجود' });
  }
  res.json({ success: true, data: accountant });
});

// 3. Categories & Services
app.get('/api/categories', (req, res) => {
  res.json({ success: true, data: db.getCategories() });
});

app.get('/api/services', (req, res) => {
  res.json({ success: true, data: db.getServices() });
});

app.get('/api/services/:id', (req, res) => {
  const service = db.getServiceById(req.params.id);
  if (!service) return res.status(404).json({ error: 'الخدمة غير موجودة' });
  res.json({ success: true, data: service });
});

// 4. Bookings
app.get('/api/bookings', (req, res) => {
  const user = db.getCurrentUser();
  const role = user.role === 'ACCOUNTANT' ? 'ACCOUNTANT' : 'CUSTOMER';
  const bookings = db.getBookings(role, user.id);
  res.json({ success: true, data: bookings });
});

app.get('/api/bookings/:id', (req, res) => {
  const booking = db.getBookingById(req.params.id);
  if (!booking) return res.status(404).json({ error: 'الحجز غير موجود' });
  res.json({ success: true, data: booking });
});

app.post('/api/bookings', (req, res) => {
  try {
    const { accountantId, serviceId, scheduledDate, startTime, customerNotes, attachedDocs } = req.body;
    if (!accountantId || !serviceId || !scheduledDate || !startTime) {
      return res.status(400).json({ error: 'جميع حقول الحجز الأساسية مطلوبة' });
    }
    const booking = db.createBooking({
      accountantId,
      serviceId,
      scheduledDate,
      startTime,
      customerNotes,
      attachedDocs,
    });
    res.status(201).json({ success: true, data: booking });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'فشل إنشاء الحجز' });
  }
});

app.patch('/api/bookings/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const updated = db.updateBookingStatus(req.params.id, status);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 5. Payments (Sandbox & E-Wallets)
app.post('/api/payments/process-sandbox', (req, res) => {
  try {
    const { bookingId, paymentMethod } = req.body;
    if (!bookingId) return res.status(400).json({ error: 'رقم الحجز مطلوب' });
    const booking = db.processSandboxPayment(bookingId, paymentMethod);
    res.json({
      success: true,
      message: 'تم سداد الاستشارة وتأكيد الحجز بنجاح',
      data: booking,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 6. Consultation Messages
app.get('/api/consultations/:bookingId/messages', (req, res) => {
  const messages = db.getConsultationMessages(req.params.bookingId);
  res.json({ success: true, data: messages });
});

app.post('/api/consultations/:bookingId/messages', (req, res) => {
  try {
    const { content, attachmentUrl, attachmentName } = req.body;
    if (!content && !attachmentUrl) {
      return res.status(400).json({ error: 'نص الرسالة أو المستند مطلوب' });
    }
    const message = db.sendMessage({
      bookingId: req.params.bookingId,
      content: content || 'مستند مرفق',
      attachmentUrl,
      attachmentName,
    });
    res.json({ success: true, data: message });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 7. Reviews
app.post('/api/reviews', (req, res) => {
  try {
    const { bookingId, accountantId, rating, comment } = req.body;
    if (!bookingId || !accountantId || !rating || !comment) {
      return res.status(400).json({ error: 'جميع بيانات التقييم مطلوبة' });
    }
    db.addReview({ bookingId, accountantId, rating: Number(rating), comment });
    res.json({ success: true, message: 'تم نشر التقييم بنجاح' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 8. Wallets & Withdrawals
app.get('/api/wallets', (req, res) => {
  const balance = db.getWalletBalance();
  const transactions = db.getWalletTransactions();
  res.json({ success: true, data: { balance, transactions } });
});

app.post('/api/wallets/withdraw', (req, res) => {
  try {
    const { amount, method, details } = req.body;
    if (!amount || Number(amount) <= 0 || !method || !details) {
      return res.status(400).json({ error: 'بيانات السحب غير مكتملة' });
    }
    const tx = db.requestWithdrawal(Number(amount), method, details);
    res.json({ success: true, message: 'تم تقديم طلب السحب بنجاح وجارٍ التحويل', data: tx });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 9. Admin Endpoints
app.get('/api/admin/metrics', (req, res) => {
  res.json({ success: true, data: db.getPlatformMetrics() });
});

app.get('/api/admin/commission', (req, res) => {
  const metrics = db.getPlatformMetrics();
  res.json({ success: true, rate: metrics.platformCommissionRate });
});

app.patch('/api/admin/commission', (req, res) => {
  const { rate } = req.body;
  if (typeof rate !== 'number' || rate < 0 || rate > 1) {
    return res.status(400).json({ error: 'نسبة العمولة يجب أن تكون بين 0 و 1 (مثال: 0.15 لـ 15%)' });
  }
  const updatedRate = db.setPlatformCommissionRate(rate);
  res.json({ success: true, rate: updatedRate, message: `تم تحديث عمولة المنصة إلى ${updatedRate * 100}%` });
});

app.get('/api/admin/verifications', (req, res) => {
  res.json({ success: true, data: db.getPendingVerifications() });
});

app.post('/api/admin/verifications/:id/decision', (req, res) => {
  try {
    const { decision } = req.body;
    if (!['VERIFIED', 'REJECTED'].includes(decision)) {
      return res.status(400).json({ error: 'قرار غير صالح' });
    }
    const accountant = db.decideVerification(req.params.id, decision);
    res.json({ success: true, data: accountant });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 10. Egyptian Income Tax Estimator
app.post('/api/tax/estimate', (req, res) => {
  const { annualNetIncome } = req.body;
  if (typeof annualNetIncome !== 'number') {
    return res.status(400).json({ error: 'صافي الدخل السنوي بالجنيه المصري مطلوب' });
  }
  const estimate = calculateEgyptianIncomeTaxEstimate(annualNetIncome);
  res.json({ success: true, data: estimate });
});

// 11. AI Accounting & Tax Consultant (Gemini API)
app.post('/api/ai/consultant', async (req, res) => {
  const { query, userContext } = req.body;
  if (!query) return res.status(400).json({ error: 'الاستفسار مطلوب' });

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `أنت "مُستشار مِيزان الذكي" - المساعد المالي والضريبي الذكي لمنصة مِيزان (MEEZAN) في مصر.
مهمتك:
1. تقديم إجابات دقيقة واحترافية ومبسطة استناداً إلى القوانين واللوائح المصرية (قانون ضريبة الدخل 91/2005 وتعديلاته حتى 2024، قانون ضريبة القيمة المضافة 67/2016، منظومة الفاتورة الإلكترونية والإيصال الإلكتروني لمصلحة الضرائب المصرية ETA، وتأسيس الشركات لدى GAFI).
2. الشريحة المعفاة الحالية من ضريبة الدخل 40,000 جنيه مصري.
3. حد التسجيل العام في ضريبة القيمة المضافة هو 500,000 جنيه، في حين أن المهن الحرة والخدمات الاستشارية (الجدول) تخضع دون حد تسجيل.
4. إيضاح أن هذه الإرشادات للتوعية والتوجيه الأولي ولا تغني عن استشارة محاسب قانوني معتمد عبر المنصة.
5. اقتراح نوع التخصص أو الخدمة المحاسبية المناسبة لحالة المستخدم.

سؤال المستخدم: "${query}"
سياق إضافي: ${JSON.stringify(userContext || {})}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return res.json({
        success: true,
        answer: response.text,
        source: 'GEMINI_AI',
      });
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to rule advisor:', err.message);
    }
  }

  // Structured Knowledge-Base Fallback (Egyptian Domain Expert)
  const qLower = query.toLowerCase();
  let answer = '';

  if (qLower.includes('فاتورة') || qLower.includes('إيصال') || qLower.includes('ختم')) {
    answer = `وفقاً لمنظومة مصلحة الضرائب المصرية (ETA):
1. **الفاتورة الإلكترونية (B2B):** ملزمة لكافة الشركات والمهن الحرة عند التعامل مع ممولين أو شركات أخرى. تتطلب استخراج ختم إلكتروني من شركات معتمدة (مثل Egypt Trust أو MCSD).
2. **الإيصال الإلكتروني (B2C):** ملزم عند التعامل مع المستهلك النهائي.
3. **تكويد الأصناف:** يتم بنظامي GS1 العالمي أو EGS المحلي بربطه مع معيار GPC.
💡 ننصحك بحجز استشارة مع "د. شريف الألفي" لمراجعة حسابك على بوابة الضرائب وتكويد منتجاتك.`;
  } else if (qLower.includes('تأسيس') || qLower.includes('شركة') || qLower.includes('سجل')) {
    answer = `لتأسيس نشاط تجاري في مصر أمام الهيئة العامة للاستثمار (GAFI):
1. **شركة الشخص الواحد (Single-Member):** مناسبة للأنشطة الفردية التي ترغب في مسؤولية محدودة برأس مال منفصل.
2. **الشركة ذات المسؤولية المحدودة (LLC):** تتطلب شريكين على الأقل وتوفر حماية كاملة للمؤسسين من الديون الشخصية.
3. **المنشأة الفردية:** أسهل في التأسيس لكن الذمة المالية غير منفصلة عن صاحبها.
💡 بإمكانك حجز استشارة تأسيس مع "أ. محمود عبد الرحمن" لتحديد الكيان القانوني الأوفر ضريبياً.`;
  } else if (qLower.includes('قيمة مضافة') || qLower.includes('vat')) {
    answer = `ضريبة القيمة المضافة في مصر (قانون 67 لسنة 2016):
- النسبة العامة: 14% على السلع والخدمات.
- حد التسجيل الإلزامي العام للأنشطة التجارية والصناعية: 500,000 جنيه مصري إيرادات سنوية.
- مهن الجدول والخدمات المهنية والاستشارية: تخضع للضريبة بنسبة 10% دون اشتراط الوصول لحد التسجيل.
- تقديم الإقرار: شهرياً خلال الشهر التالي لانتهاء الفترة الضريبية لتفادي غرامات التأخير.`;
  } else if (qLower.includes('دخل') || qLower.includes('إقرار') || qLower.includes('شريحة')) {
    answer = `ضريبة الدخل السنوية في مصر (قانون 91 لسنة 2005):
- الشريحة الأولى معفاة بالكامل حتى 40,000 جنيه سنوياً.
- الشرائح التالية تصاعدية (10%، 15%، 20%، 22.5%، حتى 25%).
- المهن الحرة تمنح إمكانية خصم 10% مصروفات حكمية من الإيراد الإجمالي في حال عدم مسك دفاتر منتظمة.
💡 يمكنك استخدام حاسبة الضرائب المتوفرة بالمنصة لمعرفة الضريبة التقديرية بدقة.`;
  } else {
    answer = `مرحباً بك في مِيزان. بناءً على استفسارك، ننصحك باختيار أحد المحاسبين القانونيين المعتمدين لدينا المتخصصين في هذا المجال لحجز جلسة فحص تفصيلية لمستنداتك وموقفك الضريبي بأمان وسرية تامة.`;
  }

  res.json({
    success: true,
    answer,
    source: 'RULE_ENGINE',
  });
});

// -----------------------------------------------------------------------------
// VITE DEV SERVER / PRODUCTION STATIC SERVING
// -----------------------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`MEEZAN Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
