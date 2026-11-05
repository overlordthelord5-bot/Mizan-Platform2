# وثيقة المعمارية الفنية لمنصة مِيزان | MEEZAN Architecture Documentation

## 1. نظرة عامة (System Overview)
تم تصميم منصة **مِيزان** كمنصة موثوقة وعالية الأمان لربط العملاء والمؤسسات الناشئة في مصر بالمحاسبين والمستشارين الماليين والضريبيين المعتمدين.
تعتمد المنصة على معمارية Full-Stack تفاعلية تدمج بين واجهة مستخدم سريعة الاستجابة مبنية بـ React وTypeScript وTailwind CSS، وخادم Backend متطور مبني بـ Express وTypeScript وموثق بـ REST API، مع قاعدة بيانات علائقية كاملة.

---

## 2. المخطط المعماري (Architectural Blueprint)

```
[ Client Applications ]
  │
  ├── Web Browser (Desktop / Tablet / Mobile) ── (RTL Arabic / LTR English)
  │     ├── Tailwind CSS Fintech Theme
  │     ├── Interactive 3D Gold Balance (Three.js / WebGL)
  │     └── Responsive Dashboards (Customer / Accountant / Admin)
  │
[ API & Service Gateway ]
  │
  ├── Express.js Application Server
  │     ├── Authentication & RBAC Middleware (JWT / Secure Cookie / Role Guards)
  │     ├── Booking State Machine Engine
  │     ├── Commission Engine (15% Platform / 85% Accountant Split)
  │     ├── Egyptian Sandbox Payment Processor (Fawry, Meeza, InstaPay, Vodafone Cash, Cards)
  │     ├── Virtual Consultation Socket / Room Service
  │     └── Meezan AI Advisory Service (Powered by Gemini API)
  │
[ Data & Persistence Layer ]
  │
  ├── PostgreSQL Relational Database (Prisma ORM)
  │     ├── 40+ Relational Tables
  │     ├── Financial Audit Logs
  │     └── Strict Foreign Keys & Indexes
```

---

## 3. محرك احتساب العمولة وتدفق المعاملات المالية (Financial Flow)
- لكل استشارة سعر أساسي يحدده المحاسب أو تصنيف الخدمة.
- يتم تطبيق نسبة عمولة المنصة `platformFeeRate` (الافتراضية: 15% قابلة للتعديل من الإدارة).
- مثال:
  - قيمة الاستشارة: `1,000 ج.م`
  - عمولة المنصة (15%): `150 ج.م`
  - مستحق المحاسب (85%): `850 ج.م`
- يتم الاحتفاظ بالمستحقات في محفظة المحاسب (`Wallet`) كـ `Pending Balance` أثناء الاستشارة، وتتحول إلى `Available Balance` فور تأكيد إتمام الاستشارة.

---

## 4. آلة حالات الحجز (Booking State Machine)
المسار الحرج لكل حجز يخضع لآلة حالات صارمة:
1. `DRAFT`: إعداد وتحديد الموعد.
2. `PENDING_PAYMENT`: تم اختيار الموعد، بانتظار سداد الدفعة خلال مهلة محددة.
3. `PAID`: تم السداد بنجاح عبر بوابة الدفع.
4. `CONFIRMED`: تأكيد الحجز وتخصيص قاعة الاستشارة الافتراضية.
5. `IN_PROGRESS`: وقت الاستشارة وبدء الاتصال.
6. `COMPLETED`: إنهاء الاستشارة وتحويل الأرباح للمحفظة وفتح إمكانية التقييم.
7. `CANCELLED / REFUNDED / DISPUTED`: حالات الإلغاء والاسترداد والنزاع وفق الشروط.
