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
      <section className="relative pt-6 pb-10 overflow-hidden px-4 md:px-8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-center">
            {/* Left Column: Text & CTA */}
            <div className="max-w-2xl relative z-20">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mint-100 text-mint-700 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                  <Leaf className="h-3 w-3" />
                  <span>Licensed & Accredited Professionals</span>
                </div>
                
                <h1 className="serif text-4xl md:text-[68px] leading-[1.05] font-bold text-sage-900 mb-6 tracking-wide">
                  Reconnect with your <span className="text-mint-600 relative">inner calm</span> through therapy.
                </h1>
                
                <p className="text-lg text-zinc-600 mb-8 leading-relaxed max-w-lg font-medium opacity-80">
                  Evidence-based counseling tailored to your unique journey. Find the professional support you need to thrive in every season of life.
                </p>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-wrap gap-4">
                    <Link to="/auth?mode=register">
                      <Button size="lg" className="bg-mint-600 text-white hover:bg-mint-700 rounded-full h-14 px-8 text-sm font-bold flex items-center justify-between min-w-[260px] shadow-lg shadow-mint-600/20 group transition-all hover:scale-105 active:scale-95">
                        Start Your Journey Free
                        <div className="bg-white rounded-full p-1.5 ml-4 group-hover:translate-x-1 transition-transform">
                          <ArrowRight className="h-4 w-4 text-mint-700" />
                        </div>
                      </Button>
                    </Link>
                    <Link to="/therapists">
                      <Button variant="ghost" className="h-14 px-8 text-sm font-bold border-2 border-mint-200 text-mint-700 rounded-full hover:bg-mint-50 hover:border-mint-300 transition-all">
                        Explore Specialists
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Visual Component */}
            <div className="relative lg:-mt-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 0 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative z-10"
              >
                {/* Main Masked Image Container with Dynamic Shape */}
                <div className="relative aspect-[1/1.1] overflow-hidden rounded-tl-[8rem] rounded-br-[8rem] rounded-tr-[2.5rem] rounded-bl-[2.5rem] shadow-xl" 
                     style={{ 
                       marginTop: '0px',
                       boxShadow: '0 30px 60px -15px rgba(0,0,0,0.08)' 
                     }}>
                  <img 
                    src={`${import.meta.env.BASE_URL}hero-banner.jpg`} 
                    alt="Serene Therapy Environment"
                    className="w-full h-full object-cover transition-transform duration-[3s] scale-100 hover:scale-110"
                  />
                  
                  {/* Glass Overlay Badges */}
                  <div className="absolute inset-0 bg-gradient-to-t from-sage-900/10 to-transparent" />
                  
                  <motion.div 
                    style={{ y: y1 ,marginTop: '20px'}}
                    className="absolute top-8 left-8 bg-white/60 backdrop-blur-xl p-3 rounded-2xl border border-white/40 flex items-center gap-3 shadow-xl"
                  >
                     <div className="w-8 h-8 rounded-full bg-mint-500 flex items-center justify-center">
                       <Smile className="h-5 w-5 text-white" />
                     </div>
                     <div className="leading-tight">
                        <p className="text-[8px] font-bold text-sage-900/60 uppercase tracking-widest">Mental Clarity</p>
                        <p className="text-xs font-bold text-sage-900">100% Focused</p>
                     </div>
                  </motion.div>

                  <motion.div 
                    style={{ y: y2, marginBottom: '25px' }}
                    className="absolute bottom-8 right-8 bg-sage-900/80 backdrop-blur-xl p-4 rounded-[2rem] border border-white/10 text-white min-w-[170px] shadow-xl"
                  >
                     <div className="flex justify-between items-start mb-2">
                        <Star className="h-4 w-4 text-mint-400 fill-mint-400" />
                        <ArrowUpRight className="h-3 w-3 text-white/30" />
                     </div>
                     <p className="text-xl font-bold leading-tight mb-0.5">98%</p>
                     <p className="text-[8px] uppercase font-bold tracking-widest opacity-60">Recovery Success Rate</p>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Abstract Background Shapes */}
              <div className="absolute -top-10 -right-10 w-[120%] h-[120%] bg-mint-200/10 rounded-full blur-[100px] -z-10 animate-pulse" />
            </div>
          </div>

          {/* Full-width Badges Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 bg-sage-50/40 border border-mint-100/50 rounded-2xl md:rounded-full px-8 py-5 w-full shadow-sm grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 items-center backdrop-blur-sm"
          >
            {[
              { icon: ShieldCheck, label: 'Secure' },
              { icon: Users, label: 'Top-Rated' },
              { icon: Sparkles, label: 'Accredited' },
              { icon: Activity, label: 'Science-Led' }
            ].map((badge) => (
              <div key={badge.label} className="flex items-center justify-center gap-3 group cursor-default">
                <div className="p-1.5 rounded-full bg-mint-100/40">
                  <badge.icon className="h-4 w-4 text-mint-600" />
                </div>
                <span className="text-xs font-bold tracking-[0.14em] uppercase text-sage-900/70 whitespace-nowrap">{badge.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Partners - Social Proof */}
      <div className="py-6 border-y border-mint-100/50 bg-[#fafcfb]">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="text-center text-xs md:text-sm font-bold text-mint-700/60 uppercase tracking-[0.25em] mb-4">Accredited by Global Mental Health Boards</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-stretch justify-center">
            {[
              { name: 'Psychology Today', element: <span className="text-base md:text-lg font-bold tracking-tight text-sage-800">Psychology Today</span> },
              { name: 'therapyTribe', element: <span className="text-base md:text-lg font-bold text-sage-800 uppercase tracking-wide">therapyTribe</span> },
              { name: 'GoodTherapy', element: <span className="text-base md:text-lg font-bold tracking-tight text-sage-800">GoodTherapy</span> },
              { name: 'theravive', element: <span className="text-base md:text-lg font-bold text-sage-800 italic decoration-mint-400/80 underline decoration-2 underline-offset-4">theravive</span> }
            ].map((partner, index) => (
              <div 
                key={index} 
                className="flex items-center justify-center bg-white border border-mint-100/40 rounded-xl py-3 px-4 shadow-sm shadow-mint-100/5 hover:border-mint-200 hover:shadow-md transition-all duration-300 cursor-default"
              >
                <div className="opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-opacity duration-300">
                  {partner.element}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services section - Redesigned Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="serif text-4xl md:text-5xl font-bold text-sage-900 mb-4 leading-[1.1]">
              Building <span className="text-mint-600">resilience</span> for every stage of life
            </h2>
            <p className="text-base text-zinc-600 font-medium opacity-80 leading-relaxed">
              Our multidisciplinary team addresses a spectrum of emotional and psychological needs through personalized, evidence-based interventions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Individual Care', desc: 'Navigating professional burn-out, anxiety, and internal evolution through dedicated one-on-one sessions.', icon: UserIcon, bg: 'bg-white shadow-lg shadow-mint-100/10' },
              { title: 'Family Dynamics', desc: 'Strengthening relational bonds and resolving systemic group conflicts within a supportive space.', icon: Users, bg: 'bg-mint-50/60' },
              { title: 'Teen Therapy', desc: 'Specialized support for young minds navigating the complexities of identity, social dynamics, and growth.', icon: Activity, bg: 'bg-white shadow-lg shadow-mint-100/10' },
              { title: 'Couples Counsel', desc: 'Rebuilding intimacy and deepening partnership through structured communication and empathy training.', icon: Heart, bg: 'bg-mint-50/60' },
              { title: 'Trauma Informed', desc: 'Healed recovery through neuro-scientifically backed methods and compassionate trauma guidance.', icon: Shield, bg: 'bg-white shadow-lg shadow-mint-100/10' },
              { title: 'Career Strategy', desc: 'Aligning professional ambitions with mental well-being through coaching and stress management.', icon: Sparkles, bg: 'bg-mint-50/60' },
            ].map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: idx * 0.05, ease: [0.21, 0.85, 0.4, 1] }}
                whileHover={{ y: -6 }}
                className={`p-8 rounded-[2rem] ${service.bg} border border-mint-100/30 transition-all duration-300 group`}
              >
                <div className="w-12 h-12 rounded-[1rem] bg-mint-500 text-white flex items-center justify-center mb-6 shadow-md shadow-mint-500/10 group-hover:scale-110 transition-transform">
                  <service.icon className="h-5 w-5" />
                </div>
                <h3 className="serif text-xl font-bold text-sage-900 mb-3">{service.title}</h3>
                <p className="text-zinc-500 font-medium text-xs leading-relaxed mb-6 opacity-80">{service.desc}</p>
                <Link to="/therapists" className="inline-flex items-center gap-2 text-[10px] font-bold text-mint-700 uppercase tracking-widest group-hover:text-sage-900 transition-colors">
                  Explore Specialists
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-all" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - Modern Gradient Block */}
      <section className="py-12 px-4 md:px-8">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.21, 0.85, 0.4, 1] }}
            whileHover={{ scale: 1.005 }}
            className="rounded-[2.5rem] bg-sage-900 p-10 md:p-14 text-center overflow-hidden relative"
          >
             <div className="relative z-10 max-w-4xl mx-auto">
                <h2 className="serif text-3xl md:text-5xl text-white font-bold mb-6 leading-[1.1]">
                  Ready to take the first step towards your <span className="text-mint-400 italic">better self?</span>
                </h2>
                <p className="text-base text-mint-100/60 mb-8 max-w-2xl mx-auto font-medium">
                  Join 2,000+ individuals monthly who choose Theramint for their mental healthcare journey. Professional support is just a click away.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/auth?mode=register">
                    <Button size="lg" className="bg-mint-600 text-white hover:bg-mint-700 rounded-full h-14 px-10 text-sm font-bold transition-transform hover:scale-105 active:scale-95 shadow-md shadow-mint-600/20">
                      Book Free Consultation
                    </Button>
                  </Link>
                  <Link to="/therapists">
                    <Button size="lg" variant="ghost" className="text-white h-14 px-10 rounded-full text-sm font-bold border border-white/20 bg-transparent hover:bg-white hover:text-sage-900 hover:border-white transition-all shadow-sm transform hover:scale-105 active:scale-95">
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
