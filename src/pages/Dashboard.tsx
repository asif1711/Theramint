import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  User as UserIcon, 
  TrendingUp,
  MessageSquare,
  Smile,
  Meh,
  Frown,
  Video,
  MapPin,
  Sparkles,
  ClipboardList,
  Settings,
  X,
  Calendar,
  CreditCard,
  History,
  AlertCircle,
  Clock,
  CheckCircle2,
  Bell,
  Trash2,
  Check
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area
} from 'recharts';
import { Notification, NotificationType } from '../components/Notification';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mood, setMood] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string, type: NotificationType } | null>(null);
  const [showConfirmCancel, setShowConfirmCancel] = useState<string | null>(null);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const [inAppNotifications, setInAppNotifications] = useState([
    { id: '1', title: 'Consultation Scheduled', message: 'Dr. Finley confirmed your session scheduled on May 25.', time: '5m ago', type: 'success', read: false },
    { id: '2', title: 'Wellness Calibration Complete', message: 'Standardized metrics have compiled into your personal velocity reports.', time: '1h ago', type: 'info', read: false },
    { id: '3', title: 'Outstanding Invoice #TM-3209', message: 'Your checkout statement is ready for secure online payment.', time: '1d ago', type: 'warning', read: true },
  ]);

  const markAsRead = (id: string) => {
    setInAppNotifications(inAppNotifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setInAppNotifications(inAppNotifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setInAppNotifications(inAppNotifications.map(n => ({ ...n, read: true })));
  };

  const notify = (message: string, type: NotificationType = 'info') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const appRes = await fetch('/api/appointments/my');
      const appData = await appRes.json();
      setAppointments(appData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    setIsProcessing('cancelling');
    try {
      const res = await fetch(`/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' })
      });
      if (res.ok) {
        setSelectedSession(null);
        setShowConfirmCancel(null);
        fetchDashboardData();
        setTimeout(() => notify('Session cancelled successfully.', 'success'), 500);
      } else {
        const data = await res.json();
        notify(data.error || 'Failed to cancel session', 'error');
      }
    } catch (err) {
      notify('An error occurred while cancelling the session', 'error');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReschedule = async (id: string) => {
    if (!newDate || !newTime) return notify('Please select both a date and time', 'warning');
    setIsProcessing('rescheduling');
    try {
      const res = await fetch(`/api/appointments/${id}/reschedule`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newDate, time: newTime })
      });
      if (res.ok) {
        setSelectedSession(null);
        setIsRescheduling(false);
        fetchDashboardData();
        setTimeout(() => notify('Session rescheduled successfully. Awaiting therapist confirmation.', 'success'), 500);
      } else {
        const data = await res.json();
        notify(data.error || 'Failed to reschedule', 'error');
      }
    } catch (err) {
      notify('An error occurred during rescheduling', 'error');
    } finally {
      setIsProcessing(null);
    }
  };

  const handlePayment = async (id: string) => {
    setIsProcessing('payment');
    try {
      const res = await fetch(`/api/appointments/${id}/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: 'PAID' })
      });
      if (res.ok) {
        fetchDashboardData();
        setTimeout(() => notify('Payment successful! Your invoice has been sent to your email.', 'success'), 500);
      } else {
        const data = await res.json();
        notify(data.error || 'Payment failed', 'error');
      }
    } catch (err) {
      notify('An error occurred during payment', 'error');
    } finally {
      setIsProcessing(null);
    }
  };

  useEffect(() => {
    if (!loading) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [loading]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfcfb]">
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-12 h-12 bg-mint-200 rounded-full blur-xl" 
      />
    </div>
  );

  if (!user) return null;

  const upcomingAppointments = appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'PENDING').sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());

  const moodOptions = [
    { label: 'Great', icon: Smile, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Good', icon: Smile, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Okay', icon: Meh, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Rough', icon: Frown, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const chartData = [
    { day: 'M', wellness: 65 },
    { day: 'T', wellness: 70 },
    { day: 'W', wellness: 68 },
    { day: 'T', wellness: 85 },
    { day: 'F', wellness: 90 },
    { day: 'S', wellness: 95 },
    { day: 'S', wellness: 100 },
  ];

  return (
    <div className="min-h-screen bg-[#fdfcfb] pt-12 pb-32">
      <div className="container mx-auto px-4 md:px-12 max-w-6xl">
        {/* Soft Header */}
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[10px] font-bold text-mint-600 uppercase tracking-[0.3em] mb-4"
            >
              Personal Sanctuary
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="serif text-5xl md:text-6xl font-bold text-zinc-900 tracking-wide"
            >
              Peace, {user.fullName.split(' ')[0]}.
            </motion.h1>
          </div>
          <div className="flex items-center gap-4">
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => setShowNotificationsModal(true)}
               className="relative p-2.5 bg-white border border-zinc-200/80 rounded-full text-zinc-600 hover:text-zinc-950 shadow-sm flex items-center justify-center transition-all cursor-pointer h-10 w-10"
               title="Workplace Notifications"
             >
               <Bell className="h-4 w-4" />
               {inAppNotifications.some(n => !n.read) && (
                 <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white animate-pulse" />
               )}
             </motion.button>
             <div className="text-right hidden md:block">
               <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{format(new Date(), 'EEEE, MMMM do')}</p>
               <p className="text-sm font-medium text-zinc-500">Mindfulness Day 12</p>
             </div>
             <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center border border-zinc-200/50">
               <UserIcon className="h-6 w-6 text-zinc-400" />
             </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Focus Area */}
          <div className="lg:col-span-8 space-y-12">
            
            <AnimatePresence mode="wait">
              {selectedSession ? (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="rounded-[3rem] border-none shadow-2xl bg-white p-12 relative overflow-hidden ring-1 ring-zinc-100">
                    <div className="flex items-start justify-between mb-12">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-mint-50 flex items-center justify-center text-mint-600">
                          {selectedSession.sessionType === 'ONLINE' ? <Video className="h-8 w-8" /> : <MapPin className="h-8 w-8" />}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-mint-600 uppercase tracking-widest mb-1">Session Management</p>
                          <h3 className="serif text-3xl font-bold text-zinc-900">With {selectedSession.therapist.user.fullName}</h3>
                        </div>
                      </div>
                      <Button variant="ghost" className="rounded-full w-12 h-12 p-0 bg-zinc-50 hover:bg-zinc-100" onClick={() => { setSelectedSession(null); setIsRescheduling(false); }}>
                        <X className="h-5 w-5 text-zinc-400" />
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                      <div className="p-8 rounded-[2rem] bg-zinc-50 border border-zinc-100">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Calendar className="h-3 w-3" /> Scheduled For
                        </p>
                        <p className="text-xl font-bold text-zinc-900 mb-1">{format(new Date(selectedSession.appointmentDate), 'EEEE, MMMM dd')}</p>
                        <p className="text-sm font-medium text-zinc-500">{selectedSession.appointmentTime}</p>
                      </div>
                      <div className="p-8 rounded-[2rem] bg-zinc-50 border border-zinc-100">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <CreditCard className="h-3 w-3" /> Payment Info
                        </p>
                        <p className="text-xl font-bold text-zinc-900 mb-1">
                          {selectedSession.paymentStatus === 'PAID' ? 'Paid Securely' : 'Payment Required'}
                        </p>
                        {selectedSession.paymentStatus !== 'PAID' && (
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="mt-2 w-full h-12 bg-zinc-900 text-white rounded-2xl font-bold text-xs shadow-lg shadow-zinc-900/10 hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50" 
                            onClick={() => handlePayment(selectedSession.id)}
                            disabled={isProcessing === 'payment'}
                          >
                            {isProcessing === 'payment' ? (
                              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full" />
                            ) : (
                              <>
                                <CreditCard className="h-3.5 w-3.5" />
                                Pay Now Online
                              </>
                            )}
                          </motion.button>
                        )}
                      </div>
                    </div>

                    {isRescheduling ? (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-12 p-8 rounded-[2rem] border border-mint-100 bg-mint-50/20"
                      >
                        <h4 className="font-bold text-zinc-900 mb-6 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-mint-600" />
                          Choose New Time
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                           <div className="relative group">
                             <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-mint-600 pointer-events-none z-10" />
                             <input 
                               type="date" 
                               className="w-full bg-white border-2 border-mint-50 rounded-3xl pl-14 pr-4 h-16 font-bold text-sm focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 outline-none transition-all shadow-sm hover:border-mint-100"
                               onChange={(e) => setNewDate(e.target.value)}
                               style={{ colorScheme: 'light' }}
                             />
                           </div>
                           <div className="relative group">
                             <Clock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-mint-600 pointer-events-none z-10" />
                             <select 
                               className="w-full bg-white border-2 border-mint-50 rounded-3xl pl-14 pr-10 h-16 font-bold text-sm focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 outline-none transition-all shadow-sm hover:border-mint-100 appearance-none cursor-pointer"
                               onChange={(e) => setNewTime(e.target.value)}
                             >
                               <option value="">Select Time Slot</option>
                               <optgroup label="Morning">
                                 <option value="09:00 AM">09:00 AM</option>
                                 <option value="10:00 AM">10:00 AM</option>
                                 <option value="11:00 AM">11:00 AM</option>
                               </optgroup>
                               <optgroup label="Afternoon">
                                 <option value="01:00 PM">01:00 PM</option>
                                 <option value="02:00 PM">02:00 PM</option>
                                 <option value="03:00 PM">03:00 PM</option>
                                 <option value="04:00 PM">04:00 PM</option>
                               </optgroup>
                             </select>
                             <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                               <Sparkles className="h-4 w-4 text-mint-500" />
                             </div>
                           </div>
                        </div>
                        <div className="flex gap-4">
                          <Button 
                            className="flex-1 rounded-[1.5rem] h-16 bg-zinc-900 text-white font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10 active:scale-[0.98] disabled:opacity-50" 
                            onClick={() => handleReschedule(selectedSession.id)}
                            disabled={isProcessing === 'rescheduling'}
                          >
                            {isProcessing === 'rescheduling' ? (
                              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full" />
                            ) : (
                              'Update Appointment'
                            )}
                          </Button>
                          <Button 
                            variant="ghost" 
                            className="rounded-[1.5rem] h-16 px-8 font-bold hover:bg-zinc-100 transition-all" 
                            onClick={() => setIsRescheduling(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col md:flex-row gap-4">
                         <div className="flex-1 flex gap-4">
                            <Button className="flex-1 rounded-2xl h-16 bg-zinc-900 text-white font-bold shadow-xl shadow-zinc-900/10 hover:shadow-2xl transition-all" onClick={() => setIsRescheduling(true)}>
                              <History className="h-5 w-5 mr-3" /> Reschedule
                            </Button>
                            <Button variant="outline" className="flex-1 rounded-2xl h-16 border-rose-100 text-rose-600 font-bold hover:bg-rose-50 transition-colors" onClick={() => setShowConfirmCancel(selectedSession.id)}>
                              <AlertCircle className="h-5 w-5 mr-3" /> Cancel Session
                            </Button>
                         </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  className="space-y-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Quick Mood Action */}
                  <section>
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-8">How are you feeling today?</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {moodOptions.map((option) => (
                        <motion.button
                          key={option.label}
                          whileHover={{ y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setMood(option.label)}
                          className={`p-8 rounded-[2rem] border-none flex flex-col items-center justify-center gap-4 transition-all ${
                            mood === option.label 
                            ? `${option.bg} shadow-lg shadow-zinc-200/50` 
                            : 'bg-white shadow-sm hover:shadow-md'
                          }`}
                        >
                          <option.icon className={`h-10 w-10 ${mood === option.label ? option.color : 'text-zinc-300'}`} />
                          <span className={`text-xs font-bold uppercase tracking-widest ${mood === option.label ? 'text-zinc-900' : 'text-zinc-400'}`}>
                            {option.label}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </section>

                  {/* Upcoming Hero */}
                  <section>
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Your Upcoming Connections</h3>
                    </div>
                    
                      {upcomingAppointments.length > 0 ? (
                      <div className="grid gap-6">
                        {upcomingAppointments.map((app, idx) => (
                          <Card 
                            key={app.id} 
                            onClick={() => setSelectedSession(app)}
                            className={`rounded-[2.5rem] border-none p-10 relative overflow-hidden group shadow-xl cursor-pointer transition-all hover:translate-y-[-4px] active:scale-[0.99] ${idx === 0 ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900 border border-zinc-100'}`}
                          >
                              <div className="relative z-10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                  <div className="flex items-center gap-6">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${idx === 0 ? 'bg-white/10' : 'bg-zinc-50'}`}>
                                      {app.sessionType === 'ONLINE' ? (
                                        <Video className={`h-6 w-6 ${idx === 0 ? 'text-mint-400' : 'text-mint-600'}`} />
                                      ) : (
                                        <MapPin className={`h-6 w-6 ${idx === 0 ? 'text-mint-400' : 'text-mint-600'}`} />
                                      )}
                                    </div>
                                    <div>
                                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${idx === 0 ? 'text-mint-400' : 'text-mint-600'}`}>
                                        {app.status === 'PENDING' ? 'Awaiting Confirmation' : 'Scheduled Session'}
                                      </p>
                                      <h4 className="text-2xl font-bold mb-1">With {app.therapist.user.fullName}</h4>
                                      <p className={`text-xs font-medium ${idx === 0 ? 'text-white/50' : 'text-zinc-400'}`}>
                                        {format(new Date(app.appointmentDate), 'EEEE, MMMM dd')} • {app.appointmentTime}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <Button variant="ghost" className={`rounded-full h-10 px-6 font-bold text-[10px] uppercase tracking-widest ${idx === 0 ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100'}`}>
                                      Manage
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              {idx === 0 && <div className="absolute top-0 right-0 w-64 h-64 bg-mint-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />}
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-[3rem] p-16 text-center border-2 border-dashed border-zinc-100 flex flex-col items-center"
                      >
                          <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                            <Sparkles className="h-8 w-8 text-zinc-300" />
                          </div>
                          <h4 className="serif text-2xl font-bold text-zinc-900 mb-2">A fresh start awaits.</h4>
                          <p className="text-zinc-500 font-medium max-w-sm mb-8">You haven't scheduled a session yet. Finding the right voice to talk to is the first step.</p>
                          <Button className="rounded-full bg-zinc-900 text-white font-bold h-12 px-10 hover:bg-zinc-800">
                            <Link to="/therapists">Connect with Experts</Link>
                          </Button>
                      </motion.div>
                    )}
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Stats & Reflection */}
          <div className="lg:col-span-4 space-y-12">
            <section>
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-8">Reflect</h3>
              <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-8">
                 <div className="flex items-center justify-between mb-8">
                   <p className="text-xs font-bold text-zinc-900">Wellness Velocity</p>
                   <TrendingUp className="h-4 w-4 text-emerald-500" />
                 </div>
                 <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="wells" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="wellness" stroke="#10b981" strokeWidth={3} fill="url(#wells)" />
                        <XAxis dataKey="day" hide />
                        <YAxis hide />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>
                 <p className="mt-6 text-[11px] font-medium text-zinc-400 leading-relaxed">
                   Consistency is your power. You've attended session 3 times this month, improving focus by 12%.
                 </p>
              </Card>
            </section>

            <section>
               <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-8">Reflect & Prepare</h3>
               <div className="grid gap-3">
                  <div className="w-full flex items-center rounded-2xl h-14 border border-zinc-100 bg-white text-zinc-400 gap-3 px-6 font-bold shadow-sm opacity-60">
                    <MessageSquare className="h-5 w-5" /> Chat History Locked
                  </div>
                  <div className="w-full flex items-center rounded-2xl h-14 border border-zinc-100 bg-white text-zinc-400 gap-3 px-6 font-bold shadow-sm opacity-60">
                    <ClipboardList className="h-5 w-5" /> Progress Journal Locked
                  </div>
                  <div className="w-full flex items-center rounded-2xl h-14 border border-zinc-100 bg-white text-zinc-400 gap-3 px-6 font-bold shadow-sm opacity-60">
                    <Settings className="h-5 w-5" /> Wellness Plan Locked
                  </div>
               </div>
            </section>

            <section className="bg-rose-50 p-10 rounded-[3rem] relative overflow-hidden group border border-rose-100">
               <Smile className="h-12 w-12 text-rose-300 mb-6 group-hover:rotate-12 transition-transform" />
               <h4 className="serif text-2xl font-bold text-zinc-900 mb-2">Need Help?</h4>
               <p className="text-zinc-600 text-sm font-medium leading-relaxed mb-6">If you are in immediate danger or need urgent help, please contact emergency services.</p>
               <div className="w-full rounded-2xl bg-white text-rose-600 font-bold border border-rose-200 shadow-sm h-12 flex items-center justify-center text-sm uppercase tracking-widest">
                 Crisis Support Active
               </div>
            </section>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmCancel && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmCancel(null)}
              className="absolute inset-0 bg-white/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[3rem] p-12 max-w-sm w-full shadow-2xl border border-zinc-100"
            >
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-8">
                <AlertCircle className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="serif text-2xl font-bold text-zinc-900 mb-4">Are you sure?</h3>
              <p className="text-zinc-500 font-medium mb-8 leading-relaxed">
                Cancelling this session will notify your therapist and may be subject to our cancellation policy.
              </p>
              <div className="flex flex-col gap-3">
                <Button 
                  className="w-full h-14 rounded-2xl bg-rose-600 text-white font-bold hover:bg-rose-700 shadow-lg shadow-rose-900/10 disabled:opacity-50"
                  onClick={() => handleCancel(showConfirmCancel)}
                  disabled={isProcessing === 'cancelling'}
                >
                  {isProcessing === 'cancelling' ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full" />
                  ) : (
                    'Confirm Cancellation'
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full h-14 rounded-2xl font-bold text-zinc-500"
                  onClick={() => setShowConfirmCancel(null)}
                >
                  Go Back
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Centered Notifications Popup Overlay */}
      <AnimatePresence>
        {showNotificationsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-[2rem] shadow-2xl border border-zinc-100 max-w-lg w-full overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <div>
                  <h3 className="serif text-xl font-bold text-zinc-900 tracking-wide">Sanctuary Alerts</h3>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">Stay updated on your health activities</p>
                </div>
                <div className="flex items-center gap-2">
                  {inAppNotifications.some(n => !n.read) && (
                    <Button 
                      onClick={markAllAsRead}
                      variant="ghost" 
                      size="sm"
                      className="text-xs h-8 px-3 text-mint-600 hover:text-mint-700 bg-mint-50/50 hover:bg-mint-50 rounded-lg flex items-center gap-1.5 font-bold"
                    >
                      <Check className="h-4 w-4" />
                      <span>Mark all read</span>
                    </Button>
                  )}
                  <button 
                    onClick={() => setShowNotificationsModal(false)}
                    className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 max-h-[400px] overflow-y-auto space-y-3">
                <AnimatePresence initial={false}>
                  {inAppNotifications.length > 0 ? (
                    inAppNotifications.map((notif) => (
                      <motion.div
                        key={notif.id}
                        onClick={() => {
                          markAsRead(notif.id);
                          setShowNotificationsModal(false);
                        }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: notif.read ? 0.6 : 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, x: -30, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                        className={`p-4 rounded-xl border border-zinc-100 flex gap-4 relative group transition-all hover:bg-zinc-50 cursor-pointer ${!notif.read ? 'bg-mint-50/10 border-mint-100/30 shadow-sm' : 'bg-white'}`}
                      >
                        <div className="flex-shrink-0 mt-1">
                          <div className={`w-2 h-2 rounded-full ${notif.type === 'success' ? 'bg-emerald-500' : notif.type === 'warning' ? 'bg-amber-500' : 'bg-sky-500'}`} />
                        </div>
                        <div className="flex-1 min-w-0 pr-6">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-bold text-xs text-zinc-900 leading-tight">{notif.title}</p>
                            <span className="text-[9px] font-bold text-zinc-400 uppercase flex-shrink-0">{notif.time}</span>
                          </div>
                          <p className="text-[11px] text-zinc-500 leading-normal mt-1">{notif.message}</p>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded bg-zinc-50 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-zinc-200">
                        <Bell className="h-6 w-6 text-zinc-300" />
                      </div>
                      <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">No active notifications</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="p-4 bg-zinc-50 border-t border-zinc-100 text-center">
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Active sanctuary session synced with client dispatch system</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Notification */}
      <AnimatePresence>
        {notification && (
          <Notification 
            message={notification.message} 
            type={notification.type} 
            onClose={() => setNotification(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
