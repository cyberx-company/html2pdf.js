# 🚀 كيف تشغّل المشروع محلياً

## خطوة 1️⃣: شغّل الخادم المحلي

```bash
cd /home/user/html2pdf.js
python3 -m http.server 8080
```

أو باستخدام Node.js:
```bash
npx http-server -p 8080
```

## خطوة 2️⃣: افتح المتصفح

افتح أحد هذه الروابط:

### 🎨 الديمو التفاعلي (موصى به):
```
http://localhost:8080/examples/advanced-demo.html
```

### 📚 عرض الملفات:
```
http://localhost:8080/
```

## خطوة 3️⃣: جرّب الميزات!

في صفحة الديمو، جرّب:

1. **تصدير ULTRA** - جودة 300 DPI خيالية
2. **تصدير مع علامة مائية** - شوف التأثير
3. **تصدير متعدد الصيغ** - PDF + PNG + JPEG دفعة واحدة
4. **استخدام القوالب** - جاهزة لكل استخدام
5. **معالجة دفعات** - شوف السرعة

---

## 🛠️ طرق بديلة للتشغيل:

### باستخدام PHP:
```bash
php -S localhost:8080
```

### باستخدام Ruby:
```bash
ruby -run -ehttpd . -p8080
```

### باستخدام Node.js live-server:
```bash
npm install -g live-server
live-server --port=8080
```

---

## 📝 استخدام مباشر في HTML:

إذا تبغى تستخدمه في صفحتك:

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Test</title>
</head>
<body>
  <div id="content">
    <h1>مرحباً بالعالم!</h1>
    <p>هذا محتوى للتصدير</p>
  </div>

  <button onclick="exportToPDF()">تصدير PDF</button>

  <!-- المكتبات -->
  <script src="dist/html2pdf.bundle.min.js"></script>
  <script src="src/plugin/advanced-exporter.js"></script>
  <script src="src/advanced.js"></script>

  <script>
    function exportToPDF() {
      html2pdf.advanced('#content', {
        quality: html2pdf.QUALITY_PRESETS.HIGH,
        watermark: 'نسختي الخاصة'
      })
      .then(result => result.save('my-document.pdf'));
    }
  </script>
</body>
</html>
```

---

## 🐛 حل المشاكل:

### المنفذ 8080 مستخدم؟
```bash
# جرّب منفذ آخر
python3 -m http.server 8888
# ثم افتح: http://localhost:8888/examples/advanced-demo.html
```

### الصفحة لا تعمل؟
تأكد من:
1. ✅ أنك في مجلد المشروع الصحيح
2. ✅ ملف html2pdf.bundle.min.js موجود في dist/
3. ✅ المتصفح يدعم ES6

### الملفات لا تظهر؟
```bash
# تأكد من المسار
pwd
# يجب أن يكون: /home/user/html2pdf.js

# تأكد من الملفات
ls -la src/plugin/advanced-exporter.js
ls -la examples/advanced-demo.html
```

---

## 🎉 استمتع!

الآن عندك نظام تصدير خورافي يشتغل محلياً! 🔥

للمزيد من المعلومات:
- 📖 [ADVANCED_FEATURES.md](ADVANCED_FEATURES.md) - توثيق كامل
- ⚡ [QUICK_START_ADVANCED.md](QUICK_START_ADVANCED.md) - دليل سريع
- 🎨 [examples/advanced-demo.html](examples/advanced-demo.html) - ديمو تفاعلي

---

**Made with 💜**
