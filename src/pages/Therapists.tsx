import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  ChevronRight, 
  Filter, 
  User as UserIcon,
  Sparkles,
  Shield,
  Video,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TherapistImage } from '../components/TherapistImage';

export default function Therapists() {
  const [therapists, setTherapists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      const res = await fetch('/api/therapists');
      const data = await res.json();
      setTherapists(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTherapists = therapists.filter(t => {
    const matchesSearch = t.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (t.specialization && t.specialization.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = category === 'All' || (t.specialization && t.specialization.includes(category));
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Anxiety', 'Depression', 'CBT', 'Family', 'Trauma', 'Stress'];

  return (
    <div className="min-h-screen bg-sage-50 pb-32">
      {/* Header Section with New Green Theme */}
      <section className="bg-white border-b border-mint-100 pt-12 pb-10 relative overflow-hidden px-4">
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint-50 text-mint-600 text-[10px] font-bold uppercase tracking-widest mb-6 border border-mint-100/50">
              <Sparkles className="h-3 w-3" />
              <span>Certified Specialists Only</span>
            </div>
            <h1 className="serif text-4xl md:text-5xl font-bold text-sage-900 mb-6 tracking-wide">
              Meet our world-class <span className="text-mint-600 italic">specialists.</span>
            </h1>
            <p className="text-base text-zinc-500 font-medium leading-relaxed max-w-2xl mx-auto mb-8 opacity-80">
              Every therapist at Theramint undergoes a rigorous 4-step verification process to ensure you receive the highest standard of compassionate care.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <Input 
                   placeholder="Search by name, specialty, or focus area..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="h-14 pl-14 pr-6 rounded-3xl bg-sage-50/50 border-mint-100 focus:ring-mint-500 text-base shadow-sm"
                />
              </div>
              <Button size="lg" className="h-14 px-8 rounded-3xl bg-mint-600 text-white font-bold hover:bg-mint-700 transition-all shadow-md shadow-mint-600/10">
                Search
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-mint-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-mint-50 rounded-full blur-3xl" />
      </section>

      {/* Categories Filter */}
      <div className="container mx-auto px-4 mt-6 mb-8 overflow-x-auto scrollbar-hide py-2 flex justify-center">
        <div className="flex gap-4 p-1 bg-white rounded-[2rem] shadow-sm border border-mint-100">
           {categories.map((cat) => (
             <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`h-12 px-8 rounded-[1.5rem] text-sm font-bold transition-all whitespace-nowrap ${
                  category === cat ? 'bg-mint-600 text-white shadow-lg shadow-mint-500/20' : 'text-zinc-500 hover:text-sage-900 hover:bg-mint-50'
                }`}
             >
                {cat}
             </button>
           ))}
        </div>
      </div>

      {/* Therapists Grid */}
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredTherapists.map((therapist, index) => (
              <motion.div
                key={therapist.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link to={`/therapists/${therapist.id}`}>
                  <Card className="rounded-[2.5rem] border-none bg-white shadow-xl shadow-mint-100/10 overflow-hidden hover:shadow-2xl hover:shadow-mint-200/20 transition-all duration-500 group">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <TherapistImage 
                        fullName={therapist.user.fullName}
                        alt={therapist.user.fullName}
                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-sage-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="absolute top-6 left-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[9px] font-bold uppercase tracking-widest text-mint-700 shadow-sm">
                         <Shield className="h-3 w-3" />
                         <span>Verified</span>
                      </div>

                      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500">
                          <Button size="sm" className="rounded-full bg-white text-sage-900 font-bold px-6 h-10 border-none shadow-xl pointer-events-auto">
                             View Profile
                          </Button>
                          <div className="p-3 bg-mint-500 rounded-full shadow-xl pointer-events-auto">
                             <Video className="h-4 w-4 text-sage-900" />
                          </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-8 pt-10 relative">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="serif text-2xl font-bold text-sage-900 mb-1 group-hover:text-mint-700 transition-colors">{therapist.user.fullName}</h3>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Senior Research Consultant</p>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full text-xs font-bold ring-1 ring-amber-100">
                          <Star className="h-3 w-3 fill-amber-600" />
                          <span>4.9</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-8">
                        {therapist.specialization && [therapist.specialization].map((spec: string) => (
                          <span key={spec} className="px-5 py-2 bg-sage-50 text-sage-900/60 rounded-full text-[10px] font-bold uppercase tracking-widest border border-sage-100">
                            {spec}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-8 border-t border-sage-50">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-mint-50 rounded-xl">
                               <Clock className="h-4 w-4 text-mint-600" />
                            </div>
                            <span className="text-xs font-bold text-zinc-500 tracking-tight">Active today</span>
                         </div>
                         <div className="text-right">
                           <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-[0.2em] mb-1">Session Starts</p>
                           <p className="text-lg font-black text-sage-900">$120<span className="text-xs font-medium text-zinc-400">/hr</span></p>
                         </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredTherapists.length === 0 && !loading && (
          <div className="py-40 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-mint-50 rounded-full flex items-center justify-center mb-8">
               <Search className="h-10 w-10 text-mint-200" />
            </div>
            <h3 className="serif text-3xl font-bold text-sage-900 mb-2">No results found</h3>
            <p className="text-zinc-500 font-medium">Try adjusting your filters or search term.</p>
            <Button variant="link" onClick={() => { setSearchTerm(''); setCategory('All'); }} className="text-mint-700 font-bold mt-4 uppercase tracking-widest text-[10px]">
               Reset all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
