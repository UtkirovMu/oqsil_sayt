import React from 'react';
import { motion } from 'motion/react';

export default function PrivacyPolicy() {
  return (
    <div className="pt-32 pb-20 max-w-4xl mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="prose prose-slate max-w-none"
      >
        <h1 className="text-4xl font-display font-bold mb-8">Maxfiylik siyosati</h1>
        <p className="text-slate-600 mb-6">Oxirgi yangilanish: 7-aprel, 2026-yil</p>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">1. Ma'lumotlarni yig'ish</h2>
          <p>Biz sizning ovqatlanish odatlaringiz va skaner qilingan rasmlarni faqat tahlil qilish maqsadida yig'amiz.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">2. Ma'lumotlarni himoya qilish</h2>
          <p>Sizning shaxsiy ma'lumotlaringiz uchinchi shaxslarga sotilmaydi va xavfsiz serverlarda saqlanadi.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">3. Cookie fayllar</h2>
          <p>Ilova tajribasini yaxshilash uchun cookie fayllardan foydalanamiz.</p>
        </section>
      </motion.div>
    </div>
  );
}
