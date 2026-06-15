import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, query, orderBy, onSnapshot, db } from '../firebase';
import { Loader2, Calendar, User, FileText } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  imageUrl?: string;
  createdAt: any;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      setPosts(postsData);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Oqsil Blog</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">Sog'lom ovqatlanish va turmush tarzi haqidagi eng so'nggi maqolalar.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-brand" size={48} />
        </div>
      ) : posts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-100 hover:shadow-xl transition-all"
            >
              <img 
                src={post.imageUrl || `https://picsum.photos/seed/${post.id}/800/600`} 
                alt={post.title}
                className="w-full h-48 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {post.createdAt?.toDate().toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">{post.title}</h3>
                <p className="text-slate-600 line-clamp-3 mb-6">{post.content}</p>
                <button className="text-brand font-bold flex items-center gap-2 hover:gap-3 transition-all">
                  Batafsil o'qish <span className="text-xl">→</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <FileText size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Hozircha maqolalar yo'q</h3>
          <p className="text-slate-500">Tez orada yangi maqolalar qo'shiladi.</p>
        </div>
      )}
    </div>
  );
}
