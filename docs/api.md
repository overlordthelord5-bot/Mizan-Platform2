# توثيق واجهة البرمجة (REST API Specification) - منصة مِيزان

## Base URL
`/api`

---

## 1. المصادقة والجلسات (Authentication)
- `POST /api/auth/register` : تسجيل مستخدم جديد (عميل أو محاسب)
- `POST /api/auth/login` : تسجيل الدخول واسترجاع بيانات المستخدم والتوكن
- `GET /api/auth/me` : استعلام بيانات الجلسة الحالية
- `POST /api/auth/logout` : تسجيل الخروج
- `POST /api/auth/otp` : التحقق برمز التحقق OTP

---

## 2. المحاسبون (Accountants Directory)
- `GET /api/accountants` : البحث وتصفية المحاسبين (بالمحافظة، التخصص، السعر، التقييم، الترتيب)
- `GET /api/accountants/:id` : تفاصيل المحاسب الكاملة والتقييمات والمواعيد المتاحة
- `POST /api/accountants/verify` : رفع مستندات التوثيق للنقابة وسجل المحاسبين

---

## 3. الخدمات والتصنيفات (Services & Categories)
- `GET /api/services` : جلب شجرة التصنيفات والخدمات المتاحة
- `GET /api/services/:id` : تفاصيل خدمة محددة والمحاسبين المتاحين لها

---

## 4. الحجوزات (Bookings)
- `POST /api/bookings` : إنشاء حجز استشارة جديد مع التحقق من عدم التعارض الزمني
- `GET /api/bookings` : جلب قائمة حجوزات المستخدم (عميل / محاسب)
- `GET /api/bookings/:id` : تفاصيل الحجز وغرفة الاستشارة
- `PATCH /api/bookings/:id/status` : تحديث حالة الحجز (بدء، إنهاء، إلغاء)

---

## 5. المدفوعات والـ Sandbox (Payments & Gateway)
- `POST /api/payments/checkout` : بدء عملية الدفع وإنشاء تفاصيل السداد
- `POST /api/payments/process-sandbox` : محاكاة نجاح الدفع (Meeza / Fawry / Vodafone Cash / Card)
- `POST /api/payments/refund` : معالجة استرداد المبلغ وفق سياسة الإلغاء

---

## 6. غرفة الاستشارة الافتراضية (Consultation Room)
- `GET /api/consultations/:bookingId/messages` : جلب محادثات الاستشارة
- `POST /api/consultations/:bookingId/messages` : إرسال رسالة أو رابط مستند
- `POST /api/consultations/:bookingId/finish` : إنهاء الاستشارة وتحويل الأرباح

---

## 7. المحفظة وسحب الأرباح (Wallets & Payouts)
- `GET /api/wallets` : رصيد المحفظة وسجل العمولات والمعاملات
- `POST /api/wallets/withdraw` : تقديم طلب سحب أرباح للمحاسب

---

## 8. لوحة الإدارة (Admin Management)
- `GET /api/admin/metrics` : إحصائيات المنصة الإجمالية والأرباح والعمولات
- `GET /api/admin/verifications` : طلبات توثيق المحاسبين المعلقة
- `POST /api/admin/verifications/:id/decision` : اعتماد أو رفض توثيق محاسب
- `GET /api/admin/commission` : قراءة وتعديل نسبة عمولة المنصة
- `PATCH /api/admin/commission` : ضبط نسبة العمولة الجديدة (مثال: من 15% إلى أي نسبة)

---

## 9. المساعد الذكي (AI Financial Advisor)
- `POST /api/ai/consultant` : استفسار واستشارة أولية من الذكاء الاصطناعي مدعومة بـ Gemini
