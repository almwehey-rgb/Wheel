# دوّرها (Spin It)

عجلة حظ (Wheel of Names) بسيطة تشتغل بالكامل داخل المتصفح — بدون سيرفر خلفي.
اكتب قائمة أسماء وخلّها تختار واحد عشوائي لأي قرعة: ديوانية، توزيع أدوار، اختيار فريق، إلخ.

A single-page Wheel of Names app that runs entirely in the browser — no backend.
Add a list of names and let the wheel pick one at random for any draw: a gathering, chore rotation, team picks, and more.

## المميزات / Features

- عجلة ملونة مرسومة بـ CSS (conic-gradient) — بدون صور
- أصوات تكتكة وفوز مولّدة بالكود عبر Web Audio API
- عربي/إنجليزي مع تبديل فوري لاتجاه الصفحة (RTL ↔ LTR)
- حفظ تلقائي للأسماء والإعدادات والسجل في localStorage
- خيار حذف الفائز تلقائياً بعد كل لفة، وزر تراجع عن آخر لفة
- سجل لآخر 50 لفة
- تصميم متجاوب يعمل على الجوال واللابتوب وشاشات التلفزيون

## التقنية / Tech

React + Vite, no backend. Everything (state, sounds, wheel rendering) runs client-side.

## التطوير / Development

```bash
npm install
npm run dev      # local dev server
npm run build    # production build
npm run lint     # oxlint
```
