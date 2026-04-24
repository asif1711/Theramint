import React from 'react';
import { 
  Book, 
  Code, 
  Lock, 
  Server, 
  Shield, 
  Zap,
  ArrowRight,
  Heart,
  Terminal,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Documentation() {
  return (
    <div className="min-h-screen bg-sage-50 pb-32">
      {/* Immersive Doc Header */}
      <section className="pt-32 pb-24 px-4 overflow-hidden relative">
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint-100 text-mint-700 text-[10px] font-bold uppercase tracking-[0.2em] mb-10 border border-mint-200/50">
               <Terminal className="h-4 w-4" />
               <span>Version 2.4.0 • Stability Patch</span>
            </div>
            <h1 className="serif text-5xl md:text-8xl font-bold text-sage-900 mb-8 tracking-tighter leading-[0.9]">
              Engineering <span className="text-mint-600 block">Compassion.</span>
            </h1>
            <p className="text-xl text-zinc-500 font-medium leading-relaxed max-w-2xl mx-auto opacity-70">
              The technical foundation of Theramint's secure, empathetic digital ecosystem. Learn how we build for mental wellness.
            </p>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-full h-[800px] bg-gradient-to-b from-mint-100/20 to-transparent pointer-events-none -z-10" />
      </section>

      <div className="container mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 hidden lg:block sticky top-32 h-fit">
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-10 pl-4 border-l-2 border-mint-500">Core Architecture</h4>
            <div className="space-y-2">
              {[
                'Platform Overview',
                'Security Protocols',
                'Clinical Integration',
                'API Endpoints',
                'Design System',
                'Privacy Governance'
              ].map((item, i) => (
                <button
                  key={i}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${i === 0 ? 'bg-mint-100 text-mint-700' : 'text-zinc-500 hover:bg-mint-50 hover:text-sage-900'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Main Doc Content */}
          <div className="lg:col-span-9 space-y-24">
            <section className="bg-white p-12 lg:p-20 rounded-[3.5rem] shadow-xl shadow-mint-100/10 border border-mint-100/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                 <Heart className="h-64 w-64 text-mint-600 fill-mint-600" />
              </div>
              
              <div className="relative z-10 max-w-3xl">
                 <h2 className="serif text-4xl font-bold text-sage-900 mb-8">Integrated Ecosystem</h2>
                 <p className="text-lg text-zinc-600 leading-relaxed font-medium opacity-80 mb-12">
                   Theramint isn't just a video platform; it's a vertically integrated mental health ecosystem. By combining encrypted tele-health, real-time mood analytics, and clinical administrative tools, we create a unified space for transformation.
                 </p>
                 
                 <div className="grid md:grid-cols-2 gap-10">
                   {[
                     { 
                       title: 'Security First', 
                       desc: 'End-to-end encryption for every session and health record.',
                       icon: Shield,
                       accent: 'bg-blue-600'
                     },
                     { 
                       title: 'Scalable Growth', 
                       desc: 'Cloud-native architecture designed for 100% uptime.',
                       icon: Server,
                       accent: 'bg-mint-600'
                     },
                     { 
                       title: 'Clinical Accuracy', 
                       desc: 'AI-assisted insights for professional diagnosis and growth.',
                       icon: Activity,
                       accent: 'bg-amber-600'
                     },
                     { 
                       title: 'Modern UI/UX', 
                       desc: 'Accessibility-led design system for stressed minds.',
                       icon: Layers,
                       accent: 'bg-rose-600'
                     }
                   ].map((feature, i) => (
                     <div key={i} className="flex gap-6 group">
                        <div className={`w-12 h-12 rounded-2xl ${feature.accent} text-white flex-shrink-0 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
                           <feature.icon className="h-6 w-6" />
                        </div>
                        <div>
                           <h4 className="text-lg font-bold text-sage-900 mb-2">{feature.title}</h4>
                           <p className="text-sm text-zinc-500 font-medium leading-relaxed opacity-80">{feature.desc}</p>
                        </div>
                     </div>
                   ))}
                 </div>
              </div>
            </section>

            <section className="grid md:grid-cols-2 gap-10">
               <div className="bg-sage-900 p-12 rounded-[3.5rem] text-white relative overflow-hidden group">
                  <h3 className="serif text-3xl font-bold mb-6 text-mint-400">Developer API</h3>
                  <p className="text-mint-100/50 mb-10 text-sm font-medium leading-relaxed">Build custom integrations with our robust GraphQL and REST endpoints. Start building in minutes.</p>
                  <code className="block bg-black/40 p-6 rounded-2xl text-xs font-mono text-mint-400 mb-10 border border-white/5 overflow-x-auto">
                    GET /api/v1/sessions/active
                    <br/>
                    Authorization: Bearer [TOKEN]
                  </code>
                  <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white group-hover:gap-4 transition-all hover:text-mint-400">
                    Explore API Docs <ArrowRight className="h-4 w-4" />
                  </button>
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-mint-500/5 rounded-full blur-[80px]" />
               </div>

               <div className="bg-mint-100 p-12 rounded-[3.5rem] relative overflow-hidden group">
                  <h3 className="serif text-3xl font-bold mb-6 text-sage-900">Clinical Guide</h3>
                  <p className="text-sage-900/50 mb-10 text-sm font-medium leading-relaxed">A comprehensive framework for therapists to onboard and master digital counseling techniques.</p>
                  <div className="space-y-4 mb-10">
                     {[
                       'Session Preparation',
                       'Digital Ethical Standards',
                       'EMR Integration',
                       'Billing & Compliance'
                     ].map((step, k) => (
                       <div key={k} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-mint-500 flex items-center justify-center text-[10px] font-bold text-white">{k+1}</div>
                          <span className="text-sm font-bold text-sage-900/80">{step}</span>
                       </div>
                     ))}
                  </div>
                  <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sage-900 group-hover:gap-4 transition-all hover:text-mint-700">
                    Read the Guide <ArrowRight className="h-4 w-4" />
                  </button>
               </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
