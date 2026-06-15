/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Camera, 
  BarChart3, 
  Lightbulb, 
  Leaf, 
  ArrowRight, 
  Zap,
  Target,
  Utensils,
  Search,
  Loader2,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";
import { Link } from 'react-router-dom';

// --- AI Service ---
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface NutritionResult {
  foodName: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  description: string;
  healthScore: number; // 1-10
}

async function analyzeFoodImage(base64Image: string): Promise<NutritionResult | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: "Analyze this food image and provide nutritional information in JSON format. The language should be Uzbek. Include foodName, calories, protein, fat, carbs, description (briefly why it's healthy or not), and a healthScore from 1 to 10." },
            { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] } }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            protein: { type: Type.NUMBER },
            fat: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            description: { type: Type.STRING },
            healthScore: { type: Type.NUMBER }
          },
          required: ["foodName", "calories", "protein", "fat", "carbs", "description", "healthScore"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
  } catch (error) {
    console.error("AI Analysis Error:", error);
  }
  return null;
}

const Scanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<NutritionResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setPreview(base64);
      setIsScanning(true);
      const res = await analyzeFoodImage(base64);
      setResult(res);
      setIsScanning(false);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setShowCamera(false);
    }
  };

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const base64 = canvas.toDataURL('image/jpeg');
      
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      
      setPreview(base64);
      setShowCamera(false);
      setIsScanning(true);
      analyzeFoodImage(base64).then(res => {
        setResult(res);
        setIsScanning(false);
      });
    }
  };

  return (
    <section id="scanner" className="py-24 bg-brand-light relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-brand font-semibold text-sm mb-4"
          >
            <Zap size={16} />
            <span>AI Skaner — Kelajak texnologiyasi</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">
            Ovqatingizni bir soniyada tahlil qiling
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Rasmga oling va Oqsil AI sizga uning tarkibidagi barcha ozuqa moddalarini aytib beradi.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-square max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-white relative group">
              {showCamera ? (
                <div className="relative w-full h-full">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <button 
                    onClick={takePhoto}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-brand flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                  >
                    <div className="w-10 h-10 bg-brand rounded-full" />
                  </button>
                </div>
              ) : preview ? (
                <div className="relative w-full h-full">
                  <img src={preview} alt="Food preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  {isScanning && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                      <Loader2 className="animate-spin mb-4" size={48} />
                      <span className="font-semibold text-lg">Tahlil qilinmoqda...</span>
                    </div>
                  )}
                  <button 
                    onClick={() => { setPreview(null); setResult(null); }}
                    className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 bg-brand-light rounded-2xl flex items-center justify-center text-brand mb-6">
                    <Camera size={40} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Rasm yuklang yoki oling</h3>
                  <p className="text-slate-500 mb-8">AI ovqat tarkibini aniqlashi uchun aniq rasm kerak</p>
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <button 
                      onClick={startCamera}
                      className="flex-1 bg-brand text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-brand-dark transition-colors"
                    >
                      <Camera size={20} />
                      Kamerani ochish
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
                    >
                      <Search size={20} />
                      Galereyadan tanlash
                    </button>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900 mb-1">{result.foodName}</h3>
                      <div className="flex items-center gap-2 text-brand font-semibold">
                        <CheckCircle2 size={18} />
                        <span>Tahlil muvaffaqiyatli</span>
                      </div>
                    </div>
                    <div className="bg-brand-light px-4 py-2 rounded-2xl text-center">
                      <div className="text-brand font-bold text-2xl">{result.healthScore}</div>
                      <div className="text-[10px] uppercase tracking-wider text-brand/70 font-bold">Sog'lomlik</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <div className="bg-slate-50 p-4 rounded-2xl text-center">
                      <div className="text-slate-500 text-xs font-semibold mb-1 uppercase">Kaloriya</div>
                      <div className="text-xl font-bold text-slate-900">{result.calories}</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl text-center">
                      <div className="text-slate-500 text-xs font-semibold mb-1 uppercase">Oqsil</div>
                      <div className="text-xl font-bold text-brand">{result.protein}g</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl text-center">
                      <div className="text-slate-500 text-xs font-semibold mb-1 uppercase">Yog'</div>
                      <div className="text-xl font-bold text-orange-500">{result.fat}g</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl text-center">
                      <div className="text-slate-500 text-xs font-semibold mb-1 uppercase">Uglevod</div>
                      <div className="text-xl font-bold text-blue-500">{result.carbs}g</div>
                    </div>
                  </div>

                  <div className="bg-brand-light/50 p-6 rounded-2xl border border-brand/10">
                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <Lightbulb size={18} className="text-brand" />
                      AI Tavsiyasi
                    </h4>
                    <p className="text-slate-700 leading-relaxed">{result.description}</p>
                  </div>

                  <button 
                    onClick={() => { setPreview(null); setResult(null); }}
                    className="w-full mt-8 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                  >
                    Yangi rasm skanerlash
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                      <Utensils size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Oson tahlil</h4>
                      <p className="text-slate-500">Murakkab jadvallarni o'rganish shart emas. Shunchaki rasmga oling.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
                      <Target size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Aniq natija</h4>
                      <p className="text-slate-500">Gemini AI texnologiyasi orqali 95% gacha aniqlikda tahlil.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center text-brand shrink-0">
                      <Leaf size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Sog'lom turmush</h4>
                      <p className="text-slate-500">Har bir ovqatingiz sizni maqsadingizga yaqinlashtiradi.</p>
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon: Icon, title, description, color }: any) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 hover:shadow-2xl transition-all"
  >
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6`}>
      <Icon size={28} />
    </div>
    <h3 className="text-2xl font-bold mb-4 text-slate-900">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </motion.div>
);

const StatsSection = () => {
  return (
    <section id="stats" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-8">
              Sizning muvaffaqiyatingiz — raqamlarda
            </h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center text-white shrink-0 font-bold">1</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Kunlik monitoring</h4>
                  <p className="text-slate-600">Har bir iste'mol qilingan mahsulot avtomatik tarzda kunlik hisobotingizga qo'shiladi.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center text-white shrink-0 font-bold">2</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Haftalik tahlil</h4>
                  <p className="text-slate-600">Hafta davomida qancha oqsil, yog' va uglevod olganingizni grafiklar orqali ko'ring.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl text-white relative z-10 overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold">Haftalik progress</h3>
                <div className="bg-white/10 px-3 py-1 rounded-lg text-xs font-medium">Mart 2026</div>
              </div>
              <div className="flex items-end justify-between gap-2 h-48 mb-8">
                {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1">
                    <motion.div 
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      className={`w-full rounded-t-lg ${i === 3 ? 'bg-brand' : 'bg-white/20'}`}
                    />
                    <span className="text-[10px] text-slate-400 font-medium uppercase">{['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sha', 'Ya'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <>
      <header className="pt-32 pb-20 md:pt-48 md:pb-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-brand font-semibold text-sm mb-6">
                <Leaf size={16} />
                <span>O'zbekistondagi birinchi AI Dietolog</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 leading-[1.1] mb-8">
                Sog'lom hayot <br />
                <span className="gradient-text">Oqsil</span> bilan boshlanadi
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
                Sun'iy intellekt yordamida ovqatlanishingizni nazorat qiling, vazningizni boshqaring va sog'lom turmush tarzini shakllantiring.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/admin" className="bg-brand hover:bg-brand-dark text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand/20 flex items-center justify-center gap-2 transition-all group">
                  Bepul boshlash
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2">
                  Ilovani yuklash
                </button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative">
              <div className="relative z-10 bg-white p-4 rounded-[3rem] shadow-2xl border border-slate-100 rotate-3 hover:rotate-0 transition-transform duration-500">
                <img src="https://picsum.photos/seed/healthy-food/800/1000" alt="Healthy food app" className="rounded-[2.5rem] w-full h-auto" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand/5 rounded-full blur-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </header>

      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">Nega aynan Oqsil?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Biz faqat kaloriya hisoblamaymiz. Biz sizga sog'lom turmush tarzini qurishda aqlli yordamchi bo'lamiz.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon={Camera} title="AI Skaner" description="Ovqat rasmini oling va uning tarkibidagi oqsil, yog', uglevod va kaloriyani bir zumda aniqlang." color="bg-brand-light text-brand" />
            <FeatureCard icon={BarChart3} title="Statistika" description="Kunlik, haftalik va oylik ovqatlanish statistikasini kuzatib boring va tahlil qiling." color="bg-blue-50 text-blue-600" />
            <FeatureCard icon={Lightbulb} title="AI Maslahat" description="Sizning maqsadlaringizga asoslangan shaxsiy ovqatlanish va mashg'ulot tavsiyalarini oling." color="bg-orange-50 text-orange-600" />
            <FeatureCard icon={Leaf} title="Sog'lom hayot" description="Sog'lom turmush tarzi bo'yicha foydali maqolalar, retseptlar va mutaxassis maslahatlari." color="bg-emerald-50 text-emerald-600" />
          </div>
        </div>
      </section>

      <Scanner />
      <StatsSection />
    </>
  );
}
