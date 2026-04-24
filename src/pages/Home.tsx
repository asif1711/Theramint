import React from 'react';
import { Button } from '../components/ui/button';
import { motion, useScroll, useTransform } from 'motion/react';
import { 
  ArrowRight, 
  Star, 
  CheckCircle, 
  Users, 
  User as UserIcon,
  Activity, 
  Sparkles, 
  Smile, 
  Shield, 
  ArrowUpRight, 
  Zap, 
  Heart, 
  Sun, 
  CloudRain,
  Video,
  Leaf,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <div className="flex flex-col min-h-screen bg-sage-50 text-sage-900 selection:bg-mint-200">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden px-4 md:px-8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center">
            {/* Left Column: Text & CTA */}
            <div className="max-w-2xl relative z-20">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint-100 text-mint-700 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 animate-pulse">
                  <Leaf className="h-3 w-3" />
                  <span>Licensed & Accredited Professionals</span>
                </div>
                
                <h1 className="serif text-5xl md:text-[85px] leading-[0.95] font-bold text-sage-900 mb-8 tracking-tighter">
                  Reconnect with your <span className="text-mint-600 relative">inner calm</span> through therapy.
                </h1>
                
                <p className="text-lg md:text-xl text-zinc-600 mb-12 leading-relaxed max-w-lg font-medium opacity-80">
                  Evidence-based counseling tailored to your unique journey. Find the professional support you need to thrive in every season of life.
                </p>

                <div className="flex flex-col gap-10">
                  <div className="flex flex-wrap gap-6">
                    <Link to="/auth?mode=register">
                      <Button size="lg" className="bg-sage-900 text-white hover:bg-zinc-800 rounded-full h-16 px-10 text-sm font-bold flex items-center justify-between min-w-[280px] shadow-2xl shadow-sage-900/10 group transition-all hover:scale-105 active:scale-95">
                        Start Your Journey Free
                        <div className="bg-white rounded-full p-1.5 ml-4 group-hover:translate-x-1 transition-transform">
                          <ArrowRight className="h-4 w-4 text-zinc-900" />
                        </div>
                      </Button>
                    </Link>
                    <Link to="/therapists">
                      <Button variant="ghost" className="h-16 px-8 text-sm font-bold border-2 border-mint-200 rounded-full hover:bg-mint-50 hover:border-mint-300 transition-all">
                        Explore Specialists
                      </Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40">
                    {[
                      { icon: ShieldCheck, label: 'Secure' },
                      { icon: Users, label: 'Top-Rated' },
                      { icon: Sparkles, label: 'Accredited' },
                      { icon: Activity, label: 'Science-Led' }
                    ].map((badge) => (
                      <div key={badge.label} className="flex items-center gap-2 group cursor-default hover:opacity-100 transition-opacity">
                        <badge.icon className="h-4 w-4" />
                        <span className="text-[10px] font-bold tracking-widest uppercase">{badge.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Visual Component */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative z-10"
              >
                {/* Main Masked Image Container with Dynamic Shape */}
                <div className="relative aspect-[1/1.1] overflow-hidden rounded-[5rem]" 
                     style={{ 
                       clipPath: 'polygon(15% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%, 0% 15%)',
                       boxShadow: '0 50px 100px -20px rgba(0,0,0,0.1)' 
                     }}>
                  <img 
                    src="/hero-banner.jpg" 
                    alt="Serene Therapy Environment"
                    className="w-full h-full object-cover transition-transform duration-[3s] hover:scale-110"
                  />
                  
                  {/* Glass Overlay Badges */}
                  <div className="absolute inset-0 bg-gradient-to-t from-sage-900/20 to-transparent" />
                  
                  <motion.div 
                    style={{ y: y1 }}
                    className="absolute top-12 left-12 bg-white/40 backdrop-blur-xl p-4 rounded-3xl border border-white/30 flex items-center gap-4 shadow-2xl"
                  >
                     <div className="w-10 h-10 rounded-full bg-mint-500 flex items-center justify-center">
                       <Smile className="h-6 w-6 text-white" />
                     </div>
                     <div className="leading-tight">
                        <p className="text-[10px] font-bold text-sage-900/50 uppercase tracking-widest">Mental Clarity</p>
                        <p className="text-sm font-bold text-sage-900">100% Focused</p>
                     </div>
                  </motion.div>

                  <motion.div 
                    style={{ y: y2 }}
                    className="absolute bottom-12 right-12 bg-sage-900/80 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/10 text-white min-w-[200px]"
                  >
                     <div className="flex justify-between items-start mb-4">
                        <Star className="h-5 w-5 text-mint-400 fill-mint-400" />
                        <ArrowUpRight className="h-4 w-4 text-white/30" />
                     </div>
                     <p className="text-2xl font-bold leading-tight mb-1">98%</p>
                     <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Recovery Success Rate</p>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Abstract Background Shapes */}
              <div className="absolute -top-20 -right-20 w-[140%] h-[140%] bg-mint-200/20 rounded-full blur-[120px] -z-10 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Partners - Social Proof */}
      <div className="py-24 border-y border-mint-100 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <p className="text-center text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] mb-16">Accredited by Global Mental Health Boards</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:opacity-80 transition-opacity">
            <span className="text-2xl font-bold tracking-tighter text-zinc-800">Psychology Today</span>
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full border-2 border-zinc-800 flex items-center justify-center font-black text-[8px]">T</div>
                <span className="text-xl font-bold text-zinc-800 uppercase tracking-tighter">therapyTribe</span>
            </div>
            <span className="text-2xl font-bold text-zinc-800 tracking-tight">GoodTherapy</span>
            <span className="text-2xl font-bold text-zinc-800 italic underline decoration-mint-500">theravive</span>
          </div>
        </div>
      </div>

      {/* Services section - Redesigned Grid */}
      <section className="py-32 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-24">
            <h2 className="serif text-5xl md:text-7xl font-bold text-sage-900 mb-8 leading-[1.05]">
              Building <span className="text-mint-600">resilience</span> for every stage of life
            </h2>
            <p className="text-lg text-zinc-600 font-medium opacity-80 leading-relaxed">
              Our multidisciplinary team addresses a spectrum of emotional and psychological needs through personalized, evidence-based interventions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: 'Individual Care', desc: 'Navigating professional burn-out, anxiety, and internal evolution through dedicated one-on-one sessions.', icon: UserIcon, bg: 'bg-white shadow-xl shadow-mint-100/20' },
              { title: 'Family Dynamics', desc: 'Strengthening relational bonds and resolving systemic group conflicts within a neutral, supportive space.', icon: Users, bg: 'bg-mint-100/40' },
              { title: 'Teen Therapy', desc: 'Specialized support for young minds navigating the complexities of identity, social dynamics, and growth.', icon: Activity, bg: 'bg-white shadow-xl shadow-mint-100/20' },
              { title: 'Couples Counsel', desc: 'Rebuilding intimacy and deepening partnership through structured communication and empathy training.', icon: Heart, bg: 'bg-mint-100/40' },
              { title: 'Trauma Informed', desc: 'Healed recovery through neuro-scientifically backed methods and compassionate trauma-informed guidance.', icon: Shield, bg: 'bg-white shadow-xl shadow-mint-100/20' },
              { title: 'Career Strategy', desc: 'Aligning professional ambitions with mental well-being through strategic coaching and stress management.', icon: Sparkles, bg: 'bg-mint-100/40' },
            ].map((service, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className={`p-10 rounded-[3rem] ${service.bg} border border-mint-100/20 transition-all duration-500 group`}
              >
                <div className="w-16 h-16 rounded-[1.5rem] bg-mint-500 text-white flex items-center justify-center mb-10 shadow-lg shadow-mint-500/10 group-hover:scale-110 transition-transform">
                  <service.icon className="h-8 w-8" />
                </div>
                <h3 className="serif text-2xl font-bold text-sage-900 mb-6">{service.title}</h3>
                <p className="text-zinc-500 font-medium text-sm leading-relaxed mb-10 opacity-80">{service.desc}</p>
                <Link to="/therapists" className="inline-flex items-center gap-3 text-xs font-bold text-mint-700 uppercase tracking-widest group-hover:text-sage-900 transition-colors">
                  Explore Specialists
                  <ArrowUpRight className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-all" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - Modern Gradient Block */}
      <section className="py-20 px-4 md:px-8">
        <div className="container mx-auto">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="rounded-[4rem] bg-sage-900 p-16 md:p-24 text-center overflow-hidden relative"
          >
             <div className="relative z-10 max-w-4xl mx-auto">
                <h2 className="serif text-4xl md:text-7xl text-white font-bold mb-10 leading-[1.05]">
                  Ready to take the first step towards your <span className="text-mint-400 italic">better self?</span>
                </h2>
                <p className="text-xl text-mint-100/60 mb-14 max-w-2xl mx-auto font-medium">
                  Join 2,000+ individuals monthly who choose Theramint for their mental healthcare journey. Professional support is just a click away.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link to="/auth?mode=register">
                    <Button size="lg" className="bg-mint-500 text-sage-900 hover:bg-mint-400 rounded-full h-16 px-12 text-sm font-black transition-transform hover:scale-105 active:scale-95 shadow-2xl shadow-mint-500/20">
                      Book Free Consultation
                    </Button>
                  </Link>
                  <Link to="/therapists">
                    <Button size="lg" variant="ghost" className="text-white h-16 px-10 rounded-full text-sm font-bold border-2 border-white/10 hover:bg-white/5 hover:border-white transition-all">
                      Find Therapist
                    </Button>
                  </Link>
                </div>
             </div>

             {/* Background Decoration */}
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-mint-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
             <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
