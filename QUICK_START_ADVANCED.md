# 🚀 Quick Start - HTML2PDF Advanced

دليل سريع للبدء مع نظام التصدير المتقدم

---

## ⚡ تثبيت سريع

```html
<!-- HTML2PDF Base -->
<script src="dist/html2pdf.bundle.min.js"></script>

<!-- Advanced Features -->
<script src="src/plugin/advanced-exporter.js"></script>
<script src="src/advanced.js"></script>
```

---

## 🎯 أمثلة سريعة

### 1. تصدير بسيط بجودة عالية

```javascript
// HTML element
const element = document.getElementById('content');

// تصدير
html2pdf.advanced(element, {
  quality: html2pdf.QUALITY_PRESETS.HIGH
})
.then(result => {
  result.save('document.pdf');
});
```

### 2. تصدير مع علامة مائية

```javascript
html2pdf.advanced(element, {
  watermark: 'CONFIDENTIAL',
  quality: html2pdf.QUALITY_PRESETS.HIGH
})
.then(result => result.save('confidential.pdf'));
```

### 3. تصدير بعدة صيغ

```javascript
html2pdf.advanced(element, {
  format: 'multi',
  formats: ['pdf', 'png', 'jpeg']
})
.then(results => {
  // تحميل كل الصيغ
  for (const [format, data] of Object.entries(results)) {
    // data.save(`document.${format}`);
  }
});
```

### 4. استخدام القوالب الجاهزة

```javascript
// للطباعة
html2pdf.advanced(element, {
  template: 'PRINT_READY'
})
.then(result => result.save('print-ready.pdf'));

// للإيميل (حجم صغير)
html2pdf.advanced(element, {
  template: 'EMAIL_FRIENDLY'
})
.then(result => result.save('email.pdf'));

// عرض تقديمي
html2pdf.advanced(element, {
  template: 'PRESENTATION'
})
.then(result => result.save('presentation.pdf'));
```

### 5. تصدير مع رأس وتذييل

```javascript
html2pdf.advanced(element, {
  header: {
    text: 'تقريري - صفحة {page}',
    fontSize: 12
  },
  footer: {
    text: '© 2025 شركتي',
    fontSize: 10
  }
})
.then(result => result.save('with-header-footer.pdf'));
```

### 6. تتبع التقدم

```javascript
const exporter = html2pdf.createAdvancedExporter();

exporter.onProgress(progress => {
  console.log(`التقدم: ${progress.percent}%`);
  console.log(`المرحلة: ${progress.stage}`);
});

const result = await exporter.export(element, {
  quality: html2pdf.QUALITY_PRESETS.ULTRA
});

await exporter.download(result, 'my-document');
```

### 7. تصدير دفعات

```javascript
const elements = [
  document.getElementById('page1'),
  document.getElementById('page2'),
  document.getElementById('page3')
];

html2pdf.advancedBatch(elements, {
  quality: html2pdf.QUALITY_PRESETS.BALANCED
})
.onProgress(progress => {
  console.log(`معالجة ${progress.data.current} من ${progress.data.total}`);
})
.then(results => {
  console.log(`تم تصدير ${results.results.length} مستندات`);
});
```

---

## 🎨 خيارات متقدمة

### كل الخيارات في مثال واحد

```javascript
html2pdf.advanced(element, {
  // الصيغة
  format: 'pdf', // 'pdf', 'png', 'jpeg', 'webp', 'svg', 'multi'

  // الجودة
  quality: html2pdf.QUALITY_PRESETS.HIGH,

  // القالب
  template: 'PRINT_READY',

  // علامة مائية
  watermark: {
    text: 'DRAFT',
    fontSize: '72px',
    color: 'rgba(255, 0, 0, 0.5)',
    opacity: 0.15
  },

  // خلفية
  background: {
    image: 'background.jpg',
    size: 'cover'
  },

  // رأس الصفحة
  header: {
    text: 'عنوان - صفحة {page}',
    fontSize: 12,
    color: '#333'
  },

  // تذييل
  footer: {
    text: '© 2025',
    fontSize: 10,
    color: '#666'
  },

  // البيانات الوصفية
  metadata: {
    title: 'عنوان المستند',
    author: 'اسم المؤلف',
    subject: 'الموضوع',
    keywords: 'كلمات, مفتاحية'
  },

  // الأمان
  security: {
    password: 'my-password'
  },

  // تحليل ذكي
  contentAnalysis: true,
  autoOptimize: true,

  // المعالجة
  progressive: true,
  useCache: true,
  timeout: 60000
})
.then(result => {
  result.save('advanced-document.pdf');
});
```

---

## 📊 مستويات الجودة

```javascript
// ULTRA - جودة خيالية (300 DPI)
html2pdf.QUALITY_PRESETS.ULTRA

// HIGH - جودة عالية (200 DPI)
html2pdf.QUALITY_PRESETS.HIGH

// BALANCED - متوازن (150 DPI) - الافتراضي
html2pdf.QUALITY_PRESETS.BALANCED

// OPTIMIZED - محسّن (96 DPI)
html2pdf.QUALITY_PRESETS.OPTIMIZED

// COMPACT - مضغوط (72 DPI)
html2pdf.QUALITY_PRESETS.COMPACT
```

---

## 🎪 القوالب المتاحة

```javascript
'PRINT_READY'       // جاهز للطباعة (300 DPI, CMYK)
'EMAIL_FRIENDLY'    // للإيميل (حجم صغير < 5MB)
'PRESENTATION'      // عرض تقديمي (16:9, أفقي)
'ARCHIVE'           // أرشيف (PDF 1.7, خطوط مضمّنة)
'SCREEN_OPTIMIZED'  // محسّن للشاشة (RGB)
'SOCIAL_MEDIA'      // سوشال ميديا (PNG, 1200x630)
```

---

## 🔥 Use Cases شائعة

### تقرير مالي

```javascript
html2pdf.advanced('#financial-report', {
  template: 'PRINT_READY',
  watermark: 'CONFIDENTIAL',
  header: { text: 'Q4 Report - Page {page}' },
  footer: { text: '© 2025 Company' },
  metadata: {
    title: 'Q4 Financial Report',
    author: 'Finance Dept'
  }
})
.then(r => r.save('q4-report.pdf'));
```

### فاتورة

```javascript
html2pdf.advanced('#invoice', {
  template: 'EMAIL_FRIENDLY',
  header: { text: 'Invoice #{number}' },
  footer: { text: 'Thank you for your business' }
})
.then(r => r.save('invoice.pdf'));
```

### شهادة

```javascript
html2pdf.advanced('#certificate', {
  template: 'PRINT_READY',
  quality: html2pdf.QUALITY_PRESETS.ULTRA,
  pageSize: 'a4',
  landscape: true
})
.then(r => r.save('certificate.pdf'));
```

### بوست سوشال ميديا

```javascript
html2pdf.advanced('#post', {
  template: 'SOCIAL_MEDIA',
  watermark: '@YourBrand'
})
.then(r => r.save('social-post.png'));
```

---

## 📈 نصائح للأداء

1. **استخدم الجودة المناسبة**
   - للويب: `OPTIMIZED` or `BALANCED`
   - للطباعة: `HIGH` or `ULTRA`
   - للإيميل: `COMPACT` or قالب `EMAIL_FRIENDLY`

2. **فعّل الذاكرة المؤقتة**
```javascript
const exporter = html2pdf.createAdvancedExporter({
  useCache: true
});
```

3. **استخدم القوالب الجاهزة**
```javascript
{ template: 'EMAIL_FRIENDLY' } // محسّن مسبقاً
```

4. **معالجة دفعات معقولة**
```javascript
{ batchSize: 5 } // لا تبالغ في الحجم
```

---

## 🎓 مزيد من المعلومات

- **توثيق كامل**: [ADVANCED_FEATURES.md](ADVANCED_FEATURES.md)
- **أمثلة تفاعلية**: [examples/advanced-demo.html](examples/advanced-demo.html)
- **API Reference**: راجع التوثيق الكامل

---

## 🤝 المساعدة

واجهت مشكلة؟
- راجع [ADVANCED_FEATURES.md](ADVANCED_FEATURES.md)
- شاهد [examples/advanced-demo.html](examples/advanced-demo.html)
- افتح issue على GitHub

---

**🔥 ابدأ الآن واستمتع بنظام تصدير خورافي! 🔥**

© 2025 HTML2PDF Advanced
