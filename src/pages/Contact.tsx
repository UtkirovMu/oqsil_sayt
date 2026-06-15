import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4">
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Bog'lanish</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">Savollaringiz bormi? Biz bilan bog'laning.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
            <div className="w-12 h-12 bg-brand-light rounded-2xl flex items-center justify-center text-brand mb-6">
              <Mail size={24} />
            </div>
            <h3 className="font-bold text-xl mb-2">Email</h3>
            <p className="text-slate-500">info@oqsil.uz</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
            <div className="w-12 h-12 bg-brand-light rounded-2xl flex items-center justify-center text-brand mb-6">
              <Phone size={24} />
            </div>
            <h3 className="font-bold text-xl mb-2">Telefon</h3>
            <p className="text-slate-500">+998 90 123 45 67</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
            <div className="w-12 h-12 bg-brand-light rounded-2xl flex items-center justify-center text-brand mb-6">
              <MapPin size={24} />
            </div>
            <h3 className="font-bold text-xl mb-2">Manzil</h3>
            <p className="text-slate-500">Toshkent sh., IT Park</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          {sent ? (
            <div className="bg-brand-light p-12 rounded-3xl text-center border-2 border-brand/20">
              <div className="w-20 h-20 bg-brand rounded-full flex items-center justify-center text-white mx-auto mb-6">
                <Send size={40} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Xabaringiz yuborildi!</h2>
              <p className="text-slate-600">Tez orada siz bilan bog'lanamiz.</p>
              <button onClick={() => setSent(false)} className="mt-8 text-brand font-bold">Yana yuborish</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Ismingiz</label>
                  <input required type="text" className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email</label>
                  <input required type="email" className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Mavzu</label>
                <input required type="text" className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Xabar</label>
                <textarea required rows={5} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none resize-none"></textarea>
              </div>
              <button type="submit" className="w-full bg-brand text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-dark transition-all shadow-lg shadow-brand/20 flex items-center justify-center gap-2">
                Yuborish <Send size={20} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
