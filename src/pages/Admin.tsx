import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  collection, 
  addDoc, 
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  setDoc,
  doc,
  Timestamp, 
  onAuthStateChanged, 
  User,
  query,
  orderBy,
  onSnapshot
} from '../firebase';
import { 
  Loader2, 
  Plus, 
  LogOut, 
  LogIn, 
  FileText, 
  UtensilsCrossed, 
  LayoutDashboard, 
  Briefcase, 
  Settings as SettingsIcon,
  Trash2,
  TrendingUp,
  Users as UsersIcon,
  Eye,
  Save,
  CheckCircle2
} from 'lucide-react';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'blog' | 'recipe' | 'jobs' | 'settings'>('dashboard');
  
  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Job states
  const [jobTitle, setJobTitle] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [jobLocation, setJobLocation] = useState('Toshkent');
  const [jobSalary, setJobSalary] = useState('');

  // Settings states
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Oqsil',
    contactEmail: 'info@oqsil.uz',
    contactPhone: '+998 90 123 45 67',
    address: 'Toshkent sh., IT Park'
  });

  // Data lists
  const [blogs, setBlogs] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [stats, setStats] = useState({ blogs: 0, recipes: 0, jobs: 0, users: 0 });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u?.email === "asosiyxabar@gmail.com") {
        setIsAdmin(true);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Fetch data for dashboard and lists
  useEffect(() => {
    if (!isAdmin) return;

    const unsubBlogs = onSnapshot(collection(db, 'blogs'), (snap) => {
      setBlogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setStats(prev => ({ ...prev, blogs: snap.size }));
    });

    const unsubRecipes = onSnapshot(collection(db, 'recipes'), (snap) => {
      setRecipes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setStats(prev => ({ ...prev, recipes: snap.size }));
    });

    const unsubJobs = onSnapshot(collection(db, 'jobs'), (snap) => {
      setJobs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setStats(prev => ({ ...prev, jobs: snap.size }));
    });

    // Fetch settings
    getDoc(doc(db, 'settings', 'global')).then(docSnap => {
      if (docSnap.exists()) {
        setSiteSettings(docSnap.data() as any);
      }
    });

    return () => {
      unsubBlogs();
      unsubRecipes();
      unsubJobs();
    };
  }, [isAdmin]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (coll: string, id: string) => {
    if (!window.confirm('Haqiqatan ham o\'chirmoqchimisiz?')) return;
    try {
      await deleteDoc(doc(db, coll, id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'blogs'), {
        title,
        content,
        imageUrl,
        author: user?.displayName || 'Admin',
        authorUid: user?.uid,
        createdAt: Timestamp.now(),
        tags: []
      });
      setTitle(''); setContent(''); setImageUrl('');
      alert('Blog qo\'shildi!');
    } catch (err) { console.error(err); }
    setSubmitting(false);
  };

  const handleAddRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'recipes'), {
        title,
        instructions: content,
        imageUrl,
        calories: 450,
        protein: 15,
        fat: 12,
        carbs: 40,
        difficulty: 'O\'rtacha',
        ingredients: ['Masalliqlar...']
      });
      setTitle(''); setContent(''); setImageUrl('');
      alert('Retsept qo\'shildi!');
    } catch (err) { console.error(err); }
    setSubmitting(false);
  };

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'jobs'), {
        title: jobTitle,
        type: jobType,
        location: jobLocation,
        salary: jobSalary,
        createdAt: Timestamp.now()
      });
      setJobTitle(''); setJobSalary('');
      alert('Vakansiya qo\'shildi!');
    } catch (err) { console.error(err); }
    setSubmitting(false);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await setDoc(doc(db, 'settings', 'global'), siteSettings);
      alert('Sozlamalar saqlandi!');
    } catch (err) { console.error(err); }
    setSubmitting(false);
  };

  const seedData = async () => {
    if (!isAdmin) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'blogs'), {
        title: "Sog'lom ovqatlanish sirlari",
        content: "Sog'lom ovqatlanish — bu nafaqat vazn yo'qotish, balki o'zingizni yaxshi his qilishdir.",
        imageUrl: "https://picsum.photos/seed/blog1/800/600",
        author: user?.displayName || 'Admin',
        authorUid: user?.uid,
        createdAt: Timestamp.now(),
        tags: ["Salomatlik"]
      });
      await addDoc(collection(db, 'jobs'), {
        title: "AI Engineer",
        type: "Full-time",
        location: "Toshkent",
        salary: "2000$+",
        createdAt: Timestamp.now()
      });
      alert('Namunaviy ma\'lumotlar qo\'shildi!');
    } catch (err) { console.error(err); }
    setSubmitting(false);
  };

  if (loading) return <div className="pt-48 flex justify-center"><Loader2 className="animate-spin text-brand" size={48} /></div>;

  if (!user) {
    return (
      <div className="pt-48 pb-20 max-w-md mx-auto px-4 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
          <p className="text-slate-500 mb-8">Tizimga kirish uchun Google hisobingizdan foydalaning.</p>
          <button onClick={handleLogin} className="w-full bg-brand text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition-all">
            <LogIn size={20} /> Google bilan kirish
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="pt-48 pb-20 max-w-md mx-auto px-4 text-center">
        <div className="bg-red-50 p-10 rounded-3xl border border-red-100">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Ruxsat yo'q</h1>
          <p className="text-red-500 mb-8">Sizda admin huquqlari mavjud emas ({user.email}).</p>
          <button onClick={() => signOut(auth)} className="text-slate-600 font-bold">Chiqish</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900">Boshqaruv Paneli</h1>
          <p className="text-slate-500">Xush kelibsiz, {user.displayName}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-brand font-bold transition-colors">
            <Eye size={18} /> Saytni ko'rish
          </Link>
          <button onClick={seedData} disabled={submitting} className="text-brand font-bold hover:underline text-sm">
            Namunaviy ma'lumot
          </button>
          <button onClick={() => signOut(auth)} className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-xl font-bold hover:bg-red-50 hover:text-red-500 transition-all">
            <LogOut size={18} /> Chiqish
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'blog', label: 'Bloglar', icon: FileText },
            { id: 'recipe', label: 'Retseptlar', icon: UtensilsCrossed },
            { id: 'jobs', label: 'Vakansiyalar', icon: Briefcase },
            { id: 'settings', label: 'Sozlamalar', icon: SettingsIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'bg-white text-slate-500 hover:bg-brand-light hover:text-brand'}`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <div className="w-10 h-10 bg-brand-light text-brand rounded-xl flex items-center justify-center mb-4"><FileText size={20} /></div>
                    <div className="text-2xl font-bold">{stats.blogs}</div>
                    <div className="text-slate-500 text-sm">Bloglar</div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4"><UtensilsCrossed size={20} /></div>
                    <div className="text-2xl font-bold">{stats.recipes}</div>
                    <div className="text-slate-500 text-sm">Retseptlar</div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4"><Briefcase size={20} /></div>
                    <div className="text-2xl font-bold">{stats.jobs}</div>
                    <div className="text-slate-500 text-sm">Vakansiyalar</div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4"><UsersIcon size={20} /></div>
                    <div className="text-2xl font-bold">1.2K</div>
                    <div className="text-slate-500 text-sm">Foydalanuvchilar</div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><TrendingUp size={20} className="text-brand" /> So'nggi faollik</h3>
                  <div className="space-y-4">
                    {blogs.slice(0, 3).map(b => (
                      <div key={b.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400"><FileText size={18} /></div>
                          <div>
                            <div className="font-bold text-slate-900">{b.title}</div>
                            <div className="text-xs text-slate-500">Blog chop etildi</div>
                          </div>
                        </div>
                        <div className="text-xs text-slate-400">{b.createdAt?.toDate().toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {(activeTab === 'blog' || activeTab === 'recipe') && (
              <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <form onSubmit={activeTab === 'blog' ? handleAddBlog : handleAddRecipe} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                  <h3 className="text-xl font-bold mb-2">{activeTab === 'blog' ? 'Yangi blog qo\'shish' : 'Yangi retsept qo\'shish'}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Sarlavha</label>
                      <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Rasm URL</label>
                      <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand/20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Matn</label>
                    <textarea required rows={6} value={content} onChange={(e) => setContent(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand/20 resize-none"></textarea>
                  </div>
                  <button disabled={submitting} type="submit" className="w-full bg-brand text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition-all">
                    {submitting ? <Loader2 className="animate-spin" /> : <Plus size={20} />} Saqlash
                  </button>
                </form>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="text-xl font-bold mb-6">Mavjud {activeTab === 'blog' ? 'bloglar' : 'retseptlar'}</h3>
                  <div className="space-y-4">
                    {(activeTab === 'blog' ? blogs : recipes).map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <img src={item.imageUrl || 'https://picsum.photos/100'} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                          <div className="font-bold text-slate-900">{item.title}</div>
                        </div>
                        <button onClick={() => handleDelete(activeTab === 'blog' ? 'blogs' : 'recipes', item.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'jobs' && (
              <motion.div key="jobs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <form onSubmit={handleAddJob} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                  <h3 className="text-xl font-bold mb-2">Yangi vakansiya</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Lavozim</label>
                      <input required type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Ish turi</label>
                      <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand/20">
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Masofaviy</option>
                        <option>Freelance</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Manzil</label>
                      <input required type="text" value={jobLocation} onChange={(e) => setJobLocation(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Maosh</label>
                      <input type="text" value={jobSalary} onChange={(e) => setJobSalary(e.target.value)} placeholder="Masalan: 1000$+" className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand/20" />
                    </div>
                  </div>
                  <button disabled={submitting} type="submit" className="w-full bg-brand text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition-all">
                    {submitting ? <Loader2 className="animate-spin" /> : <Plus size={20} />} Vakansiyani qo'shish
                  </button>
                </form>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="text-xl font-bold mb-6">Ochiq vakansiyalar</h3>
                  <div className="space-y-4">
                    {jobs.map(job => (
                      <div key={job.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
                        <div>
                          <div className="font-bold text-slate-900 text-lg">{job.title}</div>
                          <div className="text-sm text-slate-500">{job.type} • {job.location}</div>
                        </div>
                        <button onClick={() => handleDelete('jobs', job.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <form onSubmit={handleSaveSettings} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                  <h3 className="text-xl font-bold mb-2">Sayt sozlamalari</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Sayt nomi</label>
                      <input required type="text" value={siteSettings.siteName} onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Email</label>
                      <input required type="email" value={siteSettings.contactEmail} onChange={(e) => setSiteSettings({...siteSettings, contactEmail: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Telefon</label>
                      <input required type="text" value={siteSettings.contactPhone} onChange={(e) => setSiteSettings({...siteSettings, contactPhone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Manzil</label>
                      <input required type="text" value={siteSettings.address} onChange={(e) => setSiteSettings({...siteSettings, address: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-brand/20" />
                    </div>
                  </div>
                  <button disabled={submitting} type="submit" className="w-full bg-brand text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition-all">
                    {submitting ? <Loader2 className="animate-spin" /> : <Save size={20} />} Sozlamalarni saqlash
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
