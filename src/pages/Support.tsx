import React from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Search, 
  MessageCircle, 
  Mail, 
  Phone, 
  FileText, 
  HelpCircle,
  ArrowRight,
  Sparkles,
  Heart,
  ShieldCheck,
  Video
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Support() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-sage-50/50 pt-24 pb-32 relative overflow-hidden px-4">
        <div className="container mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint-100 text-mint-700 text-[10px] font-bold uppercase tracking-widest mb-8">
              <HelpCircle className="h-3 w-3" />
              <span>Dedicated Support Team</span>
            </div>
            <h1 className="serif text-5xl md:text-7xl font-bold text-sage-900 mb-8 tracking-tighter">
              How can we <span className="text-mint-600">help</span> you today?
            </h1>
            <p className="text-lg text-zinc-500 font-medium leading-relaxed max-w-2xl mx-auto mb-12">
              Whether you're looking for professional guidance, technical help, or just want to learn more about our platform, we're here for you.
            </p>

            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-zinc-400" />
              <Input 
                placeholder="Search topics: billing, scheduling, insurance..." 
                className="h-16 pl-16 pr-8 rounded-[2rem] bg-white border-mint-100 focus:ring-mint-500 text-lg shadow-xl shadow-mint-100/10"
              />
            </div>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-mint-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </section>

      {/* Support Cards */}
      <section className="py-32 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { 
                title: 'Help Center', 
                desc: 'Explore our comprehensive library of guides and frequently asked questions.',
                icon: FileText,
                color: 'text-blue-600',
                bg: 'bg-blue-50'
              },
              { 
                title: 'Live Chat', 
                desc: 'Speak directly with our support specialists for immediate assistance.',
                icon: MessageCircle,
                color: 'text-mint-600',
                bg: 'bg-mint-50'
              },
              { 
                title: 'Video Demo', 
                desc: 'Watch a quick overview of how to navigate the Theramint platform.',
                icon: Video,
                color: 'text-amber-600',
                bg: 'bg-amber-50'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-12 rounded-[3.5rem] border border-mint-100/50 shadow-xl shadow-mint-100/10 group transition-all"
              >
                <div className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`h-8 w-8 ${item.color}`} />
                </div>
                <h3 className="serif text-2xl font-bold text-sage-900 mb-4">{item.title}</h3>
                <p className="text-zinc-500 font-medium text-sm leading-relaxed mb-10 opacity-80">{item.desc}</p>
                <Button variant="ghost" className="p-0 text-xs font-bold uppercase tracking-widest text-mint-700 hover:bg-transparent flex items-center gap-2 group-hover:gap-4 transition-all">
                  Access Portal <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 px-4 bg-sage-50 selection:bg-mint-200">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto bg-white rounded-[4rem] overflow-hidden shadow-2xl shadow-mint-100 flex flex-col lg:flex-row">
            <div className="lg:w-1/2 p-12 lg:p-20 bg-sage-900 text-white relative overflow-hidden">
               <div className="relative z-10">
                 <h2 className="serif text-4xl font-bold mb-8 italic text-mint-400">Get in touch.</h2>
                 <p className="text-mint-100/60 font-medium mb-12">Our clinical and technical teams are standing by to support your mindful journey.</p>
                 
                 <div className="space-y-8">
                   <div className="flex items-center gap-6 group cursor-pointer">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-mint-500 transition-all">
                        <Mail className="h-5 w-5 group-hover:text-sage-900" />
                      </div>
                      <span className="font-bold opacity-80 group-hover:opacity-100 transition-opacity">support@theramint.org</span>
                   </div>
                   <div className="flex items-center gap-6 group cursor-pointer">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-mint-500 transition-all">
                        <Phone className="h-5 w-5 group-hover:text-sage-900" />
                      </div>
                      <span className="font-bold opacity-80 group-hover:opacity-100 transition-opacity">+1 (800) MENTAL-AID</span>
                   </div>
                   <div className="flex items-center gap-6 group cursor-pointer">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-mint-500 transition-all">
                        <ShieldCheck className="h-5 w-5 group-hover:text-sage-900" />
                      </div>
                      <span className="font-bold opacity-80 group-hover:opacity-100 transition-opacity">Global Reach • Local Care</span>
                   </div>
                 </div>
               </div>
               <div className="absolute top-0 right-0 w-64 h-64 bg-mint-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="lg:w-1/2 p-12 lg:p-20">
               <form className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">First Name</label>
                       <Input placeholder="Enter your name" className="h-14 rounded-2xl border-zinc-100 focus:ring-mint-500" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Email</label>
                       <Input type="email" placeholder="name@example.com" className="h-14 rounded-2xl border-zinc-100 focus:ring-mint-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">How can we help?</label>
                     <textarea className="w-full min-h-[160px] p-6 rounded-3xl border border-zinc-100 focus:ring-2 focus:ring-mint-500 focus:outline-none text-sm font-medium" placeholder="Describe your query or request..." />
                  </div>
                  <Button className="w-full h-16 bg-mint-600 text-white font-bold rounded-[1.5rem] hover:bg-mint-700 shadow-xl shadow-mint-500/20 transition-all active:scale-95">
                    Send Mindful Request
                  </Button>
               </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
