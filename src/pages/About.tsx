import React from 'react';
import { motion } from 'motion/react';
import { Users, Target, Zap, Leaf } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4">
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Biz haqimizda</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">Oqsil — bu sog'lom hayot sari tashlangan birinchi qadamdir.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
        <div>
          <h2 className="text-3xl font-bold mb-6 text-slate-900">Bizning missiyamiz</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            Bizning asosiy maqsadimiz — har bir inson uchun sog'lom ovqatlanishni oson, qulay va tushunarli qilish. 
            Sun'iy intellekt texnologiyalari yordamida biz ovqatlanish madaniyatini yangi bosqichga olib chiqmoqchimiz.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-brand-light p-6 rounded-2xl">
              <div className="text-brand font-bold text-3xl mb-2">10K+</div>
              <div className="text-slate-600 text-sm">Foydalanuvchilar</div>
            </div>
            <div className="bg-brand-light p-6 rounded-2xl">
              <div className="text-brand font-bold text-3xl mb-2">98%</div>
              <div className="text-slate-600 text-sm">AI Aniqligi</div>
            </div>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-brand to-emerald-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-white p-2 rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <img 
              src="/ceo_profile.png" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800";
              }}
              alt="Oqsil Muassis va Bosh Direktor" 
              className="rounded-2xl w-full object-cover aspect-[3/4]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl text-white border border-white/10 shadow-lg">
              <p className="font-display font-semibold text-xl">Muzaffar O'tkirov</p>
              <p className="text-brand font-medium text-sm">Oqsil — Muassis & CEO</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {[
          { icon: Users, title: "Jamoa", text: "Tajribali dietologlar va AI muhandislari." },
          { icon: Target, title: "Maqsad", text: "Sog'lom millat va sog'lom kelajak." },
          { icon: Zap, title: "Tezlik", text: "Bir soniyada to'liq tahlil." },
          { icon: Leaf, title: "Tabiiylik", text: "Tabiiy va sog'lom taomlar targ'iboti." }
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 text-center">
            <div className="w-12 h-12 bg-brand-light rounded-2xl flex items-center justify-center text-brand mx-auto mb-6">
              <item.icon size={24} />
            </div>
            <h3 className="font-bold text-xl mb-2">{item.title}</h3>
            <p className="text-slate-500 text-sm">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
