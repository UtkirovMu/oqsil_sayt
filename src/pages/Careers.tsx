import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Briefcase, MapPin, Clock, Loader2 } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, db } from '../firebase';

interface Job {
  id: string;
  title: string;
  type: string;
  location: string;
  salary: string;
}

export default function Careers() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Job[];
      setJobs(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4">
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Karyera</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">Oqsil jamoasiga qo'shiling va sog'lom kelajakni birga quring.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-brand" size={48} />
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid gap-6 max-w-4xl mx-auto">
          {jobs.map((job) => (
            <motion.div 
              key={job.id}
              whileHover={{ x: 10 }}
              className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6"
            >
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{job.title}</h3>
                <div className="flex gap-6 text-slate-500 text-sm">
                  <span className="flex items-center gap-1"><Briefcase size={14} /> {job.type}</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {job.salary}</span>
                </div>
              </div>
              <button className="bg-brand text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-dark transition-all shrink-0">
                Ariza topshirish
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Hozircha bo'sh ish o'rinlari yo'q</h3>
          <p className="text-slate-500">Keyinroq yana tekshirib ko'ring.</p>
        </div>
      )}
    </div>
  );
}
