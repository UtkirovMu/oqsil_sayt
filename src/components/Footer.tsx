import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-bold text-xl">O</div>
              <span className="text-2xl font-display font-bold">Oqsil</span>
            </div>
            <p className="text-slate-400 mb-6">Sun'iy intellekt yordamida sog'lom turmush tarzini shakllantiring.</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand transition-colors"><Instagram size={20} /></a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand transition-colors"><Twitter size={20} /></a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand transition-colors"><Facebook size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Mahsulot</h4>
            <ul className="space-y-4 text-slate-400">
              <li><Link to="/#scanner" className="hover:text-white transition-colors">AI Skaner</Link></li>
              <li><Link to="/#stats" className="hover:text-white transition-colors">Statistika</Link></li>
              <li><Link to="/#features" className="hover:text-white transition-colors">AI Maslahat</Link></li>
              <li><Link to="/recipes" className="hover:text-white transition-colors">Retseptlar</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Kompaniya</h4>
            <ul className="space-y-4 text-slate-400">
              <li><Link to="/about" className="hover:text-white transition-colors">Biz haqimizda</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Karyera</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Bog'lanish</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Huquqiy</h4>
            <ul className="space-y-4 text-slate-400">
              <li><Link to="/terms" className="hover:text-white transition-colors">Foydalanish shartlari</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Maxfiylik siyosati</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 text-center text-slate-500 text-sm">
          <p>© 2026 Oqsil AI. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
