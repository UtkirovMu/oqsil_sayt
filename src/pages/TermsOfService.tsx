import React from 'react';
import { motion } from 'motion/react';

export default function TermsOfService() {
  return (
    <div className="pt-32 pb-20 max-w-4xl mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="prose prose-slate max-w-none"
      >
        <h1 className="text-4xl font-display font-bold mb-8">Foydalanish shartlari</h1>
        <p className="text-slate-600 mb-6">Oxirgi yangilanish: 7-aprel, 2026-yil</p>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">1. Umumiy qoidalar</h2>
          <p>Oqsil ilovasidan foydalanish orqali siz ushbu shartlarga rozilik bildirasiz. Ilova sun'iy intellekt yordamida ma'lumot beradi, ammo bu tibbiy maslahat o'rnini bosmaydi.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">2. Xizmatdan foydalanish</h2>
          <p>Foydalanuvchilar ilovadan faqat qonuniy maqsadlarda foydalanishlari shart. AI skaner natijalari taxminiy hisoblanadi.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">3. Maxfiylik</h2>
          <p>Sizning ma'lumotlaringiz bizning Maxfiylik siyosatimizga muvofiq himoya qilinadi.</p>
        </section>
      </motion.div>
    </div>
  );
}
