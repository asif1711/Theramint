import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Calendar } from '../components/ui/calendar';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight,
  Star, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  MessageCircle, 
  ShieldCheck, 
  Award,
  Video,
  ExternalLink,
  Sparkles,
  Heart,
  ChevronRight,
  Calendar as CalendarIcon
} from 'lucide-react';
import { format } from 'date-fns';

export default function TherapistDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [therapist, setTherapist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];

  useEffect(() => {
    fetchTherapist();
  }, [id]);

  const fetchTherapist = async () => {
    try {
      const res = await fetch(`/api/therapists/${id}`);
      const data = await res.json();
      setTherapist(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!user) {
      navigate('/auth?mode=login');
      return;
    }
    if (!selectedDate || !selectedTime) {
      setMessage("Please select a date and time slot.");
      return;
    }

    setBookingLoading(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          therapistId: therapist.id,
          date: selectedDate,
          time: selectedTime,
          sessionType: 'Video Consultation'
        }),
      });
      if (res.ok) {
        navigate('/dashboard?tab=appointments&success=true');
      } else {
        const err = await res.json();
        setMessage(err.error || "Booking failed");
      }
    } catch (err) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-sage-50 flex items-center justify-center">
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }} className="w-10 h-10 border-4 border-mint-200 border-t-mint-600 rounded-full" />
  </div>;
  
  if (!therapist) return <div className="min-h-screen bg-sage-50 flex items-center justify-center">Therapist not found.</div>;

  return (
    <div className="min-h-screen bg-white selection:bg-mint-200">
      {/* Immersive Header */}
      <div className="bg-sage-50/50 pt-24 pb-32 relative overflow-hidden px-4">
        <div className="container mx-auto relative z-10">
          <Link to="/therapists" className="inline-flex items-center gap-2 text-zinc-500 hover:text-mint-700 transition-all font-bold uppercase tracking-widest text-[10px] mb-12 group">
            <div className="bg-white p-2 rounded-xl group-hover:-translate-x-1 transition-transform">
              <ArrowLeft className="h-4 w-4" />
            </div>
            Back to specialists
          </Link>

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative"
            >
              <div className="w-56 h-56 md:w-80 md:h-80 rounded-[4rem] overflow-hidden border-[12px] border-white shadow-2xl shadow-mint-100/50">
                <img 
                  src={therapist.avatarUrl || `https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800`} 
                  alt={therapist.user.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-3xl shadow-xl flex items-center gap-3">
                 <div className="w-10 h-10 bg-mint-500 rounded-2xl flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-white" />
                 </div>
                 <div className="leading-none pr-4">
                   <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Board Verified</p>
                   <p className="text-sm font-bold text-sage-900">Accredited</p>
                 </div>
              </div>
            </motion.div>

            <div className="flex-1 text-center lg:text-left space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint-100 text-mint-700 text-[10px] font-bold uppercase tracking-widest">
                  <Sparkles className="h-3 w-3" />
                  <span>Licensed Clinical Specialist</span>
                </div>
                <h1 className="serif text-5xl md:text-7xl font-bold text-sage-900 tracking-tighter">{therapist.user.fullName}</h1>
                <p className="text-2xl font-bold text-mint-600 bg-mint-50 w-fit px-6 py-2 rounded-2xl mx-auto lg:mx-0">{therapist.specialization || therapist.specialties[0]}</p>
              </div>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Patient Rating</span>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                    <span className="text-xl font-bold text-sage-900">4.9</span>
                    <span className="text-zinc-500 font-medium">(142)</span>
                  </div>
                </div>
                <div className="w-px h-12 bg-mint-100/50 hidden md:block" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Clinical Experience</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span className="text-xl font-bold text-sage-900">{therapist.experienceYears}+ Years</span>
                  </div>
                </div>
                <div className="w-px h-12 bg-mint-100/50 hidden md:block" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Primary Qualification</span>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-mint-600" />
                    <span className="text-xl font-bold text-sage-900">{therapist.qualifications.split(',')[0]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-mint-100/20 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2 -z-10" />
      </div>

      {/* Main Narrative Content */}
      <div className="container mx-auto px-4 md:px-8 py-24">
        <div className="grid lg:grid-cols-12 gap-20">
          <div className="lg:col-span-7 space-y-20">
            <section>
              <h2 className="serif text-4xl font-bold text-sage-900 mb-8">Professional Philosophy</h2>
              <p className="text-xl text-zinc-600 leading-relaxed font-normal opacity-80">
                {therapist.professionalBio || "Dedicated to fostering a supportive and safe environment for individuals to explore their inner landscapes. My approach combines evidence-based cognitive strategies with deeply empathetic humanistic care, ensuring every person feels seen, heard, and empowered to evolve."}
              </p>
            </section>

            <section className="bg-sage-50 p-12 rounded-[3.5rem] border border-mint-100/50">
              <div className="flex items-center gap-4 mb-10">
                 <div className="w-12 h-12 bg-mint-600 rounded-2xl flex items-center justify-center">
                    <Video className="h-6 w-6 text-white" />
                 </div>
                 <h3 className="serif text-3xl font-bold text-sage-900">Session Environment</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {[
                  { label: 'Methodology', val: 'Integrative CBT', icon: Heart },
                  { label: 'Platform', val: 'Secure HD Video', icon: Video },
                  { label: 'Avg. Duration', val: '50 Minutes', icon: Clock },
                  { label: 'Documentation', val: 'Digital Follow-ups', icon: ExternalLink }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-mint-50 flex items-center gap-5">
                    <div className="p-3 bg-mint-50 rounded-2xl">
                       <item.icon className="h-5 w-5 text-mint-600" />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{item.label}</p>
                       <p className="text-sm font-bold text-sage-900">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-10">
                <h3 className="serif text-3xl font-bold text-sage-900">Verified Patient Reviews</h3>
                <div className="flex gap-2">
                   {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-mint-500 text-mint-500" />)}
                </div>
              </div>
              <div className="space-y-10">
                {[1, 2].map(i => (
                  <Card key={i} className="border-none shadow-sm bg-white p-8 rounded-[2.5rem] relative overflow-hidden group">
                    <div className="relative z-10">
                      <p className="text-lg text-zinc-600 mb-6 italic leading-relaxed">"An incredibly professional experience. I felt more progress in three sessions than I have in months elsewhere. Truly personalized care."</p>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-mint-100 flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-mint-600" />
                        </div>
                        <p className="text-sm font-bold text-sage-900 uppercase tracking-widest">Verified User • 12 Sessions Completed</p>
                      </div>
                    </div>
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-mint-50/50 rounded-full group-hover:scale-150 transition-transform duration-700" />
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Majestic Booking Floating Sidebar */}
          <div className="lg:col-span-5 h-fit lg:sticky lg:top-24">
            <Card className="border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] rounded-[3.5rem] bg-sage-900 p-10 text-white overflow-hidden relative">
              <div className="relative z-10 flex flex-col gap-10">
                <div>
                   <h3 className="serif text-4xl font-bold mb-2">Book a Session</h3>
                   <p className="text-mint-100/40 text-sm font-medium tracking-tight">Select your preferred date to view clinical availability.</p>
                </div>

                <div className="space-y-10">
                  <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10">
                    <label className="text-[11px] font-bold text-mint-400 uppercase tracking-[0.2em] mb-6 block text-center">Calendar Perspective</label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="bg-transparent border-none text-white selection:bg-mint-500 data-[state=selected]:bg-mint-500"
                    />
                  </div>

                  <div className="space-y-6">
                    <label className="text-[11px] font-bold text-mint-400 uppercase tracking-[0.2em] block text-center">Available Intervals</label>
                    <div className="grid grid-cols-2 gap-3">
                      {timeSlots.map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-4 rounded-2xl text-[11px] font-bold tracking-widest transition-all ${
                            selectedTime === time 
                            ? 'bg-mint-500 text-sage-900 shadow-xl shadow-mint-500/20 scale-105' 
                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {message && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-5 rounded-2xl text-xs font-bold text-center uppercase tracking-widest ${message.includes('success') ? 'bg-mint-500 text-sage-900' : 'bg-red-500/20 text-red-300 border border-red-500/20'}`}
                    >
                      {message}
                    </motion.div>
                  )}

                  <div className="pt-4">
                    <Button 
                      onClick={handleBook}
                      disabled={bookingLoading}
                      className="w-full h-16 bg-mint-500 text-sage-900 rounded-[2rem] text-sm font-black hover:bg-mint-400 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-mint-500/20 gap-3 group"
                    >
                      {bookingLoading ? 'Requesting Appointment...' : 'Secure Your Session'}
                      <div className="bg-sage-900/10 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </Button>
                    <div className="mt-6 flex items-center justify-center gap-2 opacity-40">
                       <ShieldCheck className="h-3 w-3" />
                       <p className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encrypted Selection</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Background Art */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-mint-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
