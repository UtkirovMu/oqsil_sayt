import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Asosiy', path: '/' },
    { name: 'AI Skaner', path: '/#scanner' },
    { name: 'Retseptlar', path: '/recipes' },
    { name: 'Blog', path: '/blog' },
    { name: 'Biz haqimizda', path: '/about' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-bold text-xl">O</div>
            <span className="text-2xl font-display font-bold text-slate-900">Oqsil</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="text-slate-600 hover:text-brand transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
            <button className="bg-brand hover:bg-brand-dark text-white px-6 py-2 rounded-full font-semibold transition-all shadow-lg shadow-brand/20">
              Ilovani yuklash
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)} 
                  className="text-lg font-medium text-slate-600"
                >
                  {link.name}
                </Link>
              ))}
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-brand text-white px-6 py-3 rounded-xl font-semibold w-full text-center"
              >
                Ilovani yuklash
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
