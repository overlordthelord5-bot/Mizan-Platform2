# دليل النشر والتشغيل (Deployment Guide) - منصة مِيزان

## 1. المتطلبات الأساسية
- Node.js 20+
- PostgreSQL 15+
- Redis (اختياري للكاش والمهام)
- Docker & Docker Compose (للبيئات الحاوية)

## 2. التشغيل المحلي (Local Development)
```bash
# تثبيت الحزم
npm install

# إعداد ملف البيئة
cp .env.example .env

# تشغيل خادم التطوير المدمج (Express Backend + Vite Frontend)
npm run dev
```

## 3. التشغيل عبر Docker Compose
```bash
docker-compose up -d --build
```

التطبيق سيعمل مباشرة على المنفذ `3000` (أو المنفذ المحدد في متغير البيئة `PORT`).
