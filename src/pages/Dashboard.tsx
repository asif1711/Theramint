import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  User as UserIcon, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  TrendingUp,
  Users,
  CheckCircle,
  FileText,
  Plus,
  MessageSquare,
  BarChart3,
  Activity,
  Smile,
  Meh,
  Frown,
  Zap,
  Target,
  Video
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Cell
} from 'recharts';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mood, setMood] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const appRes = await fetch('/api/appointments/my');
      const appData = await appRes.json();
      setAppointments(appData);

      if (user?.role === 'ADMIN') {
        const anaRes = await fetch('/api/admin/analytics');
        const anaData = await anaRes.json();
        setAnalytics(anaData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  const moodOptions = [
    { label: 'Great', icon: Smile, color: 'text-mint-600', bg: 'bg-mint-50' },
    { label: 'Good', icon: Smile, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Okay', icon: Meh, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Bad', icon: Frown, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const chartData = [
    { day: 'Mon', stress: 65, energy: 40 },
    { day: 'Tue', stress: 50, energy: 55 },
    { day: 'Wed', stress: 45, energy: 70 },
    { day: 'Thu', stress: 30, energy: 85 },
    { day: 'Fri', stress: 20, energy: 90 },
    { day: 'Sat', stress: 15, energy: 95 },
    { day: 'Sun', stress: 10, energy: 100 },
  ];

  return (
    <div className="min-h-screen bg-sage-50 pt-12 pb-24">
      <div className="container mx-auto px-4 md:px-8">
        {/* Welcome Block */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 md:p-12 mb-8 shadow-xl shadow-mint-100/20 border border-mint-100/50 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-center gap-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-mint-100 flex items-center justify-center overflow-hidden">
                <UserIcon className="h-12 w-12 text-mint-600" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-mint-500 rounded-full border-4 border-white flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            </div>
            <div>
              <h1 className="serif text-4xl md:text-5xl font-bold text-sage-900 mb-2">Hello, {user.fullName.split(' ')[0]}</h1>
              <p className="text-zinc-500 font-medium text-lg">We're glad to see you taking care of yourself today.</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Quick Actions</p>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-xl border-mint-200 text-mint-700 bg-mint-50/50 hover:bg-mint-100">
                <Settings className="h-4 w-4 mr-2" /> Settings
              </Button>
              <Button onClick={logout} variant="ghost" className="rounded-xl text-rose-500 hover:bg-rose-50">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar / Left Column */}
          <div className="lg:col-span-1 space-y-8">
            {/* Mood Tracker */}
            <Card className="rounded-[2rem] border-none shadow-lg shadow-mint-100/20 bg-white p-6">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6">Daily Mood Check-in</h3>
              <div className="grid grid-cols-2 gap-3">
                {moodOptions.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => setMood(option.label)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all ${
                      mood === option.label 
                      ? `${option.bg} ring-2 ring-mint-500 shadow-inner` 
                      : 'bg-zinc-50 hover:bg-zinc-100 grayscale-[0.5] hover:grayscale-0'
                    }`}
                  >
                    <option.icon className={`h-8 w-8 ${option.color} mb-2`} />
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">{option.label}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid gap-4">
              {[
                { label: 'Next Session', value: 'Today, 2PM', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Completed', value: '12 Sessions', icon: Target, color: 'text-mint-600', bg: 'bg-mint-50' },
                { label: 'Growth', value: '+15%', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white p-4 rounded-2xl flex items-center gap-4 border border-mint-100/30">
                  <div className={`${stat.bg} p-3 rounded-xl`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-sm font-bold text-sage-900">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center Column - Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <Tabs defaultValue="overview" className="w-full">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                <TabsList className="bg-white/50 backdrop-blur-md p-1 rounded-2xl border border-mint-100">
                  <TabsTrigger value="overview" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-mint-600 data-[state=active]:text-white font-bold transition-all">Overview</TabsTrigger>
                  <TabsTrigger value="appointments" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-mint-600 data-[state=active]:text-white font-bold transition-all">Sessions</TabsTrigger>
                </TabsList>
                
                <Button className="rounded-xl bg-sage-900 text-white gap-2 font-bold px-6 h-12 shadow-lg shadow-sage-900/10">
                  <Plus className="h-4 w-4" /> Book New Session
                </Button>
              </div>

              <TabsContent value="overview" className="space-y-8">
                {/* Analytics Row */}
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="rounded-[2.5rem] border-none shadow-xl shadow-mint-100/20 bg-white p-8">
                    <CardHeader className="p-0 mb-6">
                      <CardTitle className="serif text-2xl text-sage-900">Wellness Journey</CardTitle>
                      <CardDescription className="text-zinc-500 font-medium tracking-tight">Visualizing your recovery progress over time</CardDescription>
                    </CardHeader>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                          <YAxis hide domain={[0, 100]} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: '#fff' }}
                            itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                          />
                          <Area type="monotone" dataKey="energy" stroke="#059669" strokeWidth={4} fillOpacity={1} fill="url(#colorWave)" />
                          <Area type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  <Card className="rounded-[2.5rem] border-none shadow-xl shadow-mint-100/20 bg-white p-8">
                    <CardHeader className="p-0 mb-6">
                      <CardTitle className="serif text-2xl text-sage-900">Session Focus</CardTitle>
                      <CardDescription className="text-zinc-500 font-medium tracking-tight">Distribution of therapeutic methodologies used</CardDescription>
                    </CardHeader>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'CBT', val: 40, color: '#059669' },
                          { name: 'ACT', val: 30, color: '#0891b2' },
                          { name: 'DBT', val: 20, color: '#f59e0b' },
                          { name: 'Humanistic', val: 10, color: '#dc2626' },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                          <YAxis hide />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: '#fff' }}
                            cursor={{ fill: '#f8fafc' }}
                          />
                          <Bar dataKey="val" radius={[12, 12, 0, 0]}>
                            {
                              [40, 30, 20, 10].map((v, i) => (
                                <Cell key={`cell-${i}`} fill={['#059669', '#0891b2', '#f59e0b', '#dc2626'][i]} />
                              ))
                            }
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </div>

                {/* Next Up Highlight */}
                <div className="space-y-6">
                  <h3 className="serif text-3xl font-bold px-2 text-sage-900">Next Highlight</h3>
                  {appointments.filter(a => a.status === 'CONFIRMED').length > 0 ? (
                    appointments.filter(a => a.status === 'CONFIRMED').slice(0, 1).map(app => (
                      <Card key={app.id} className="rounded-[2.5rem] border-none bg-sage-900 text-white p-10 relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                          <div className="flex items-center gap-8">
                            <div className="w-20 h-20 rounded-3xl bg-mint-500/20 backdrop-blur-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                              <Video className="h-10 w-10 text-mint-400" />
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <span className="bg-mint-500/20 text-mint-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{format(new Date(app.appointmentDate), 'EEEE, MMM dd')}</span>
                                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{app.appointmentTime}</span>
                              </div>
                              <h4 className="text-3xl font-bold mb-1">Session with {app.therapist.user.fullName}</h4>
                              <p className="text-mint-100/60 text-sm font-medium">Topic: Dealing with social anxiety in workplace</p>
                            </div>
                          </div>
                          <Button className="rounded-full bg-mint-500 text-sage-900 hover:bg-mint-400 font-bold px-10 h-14 text-sm transition-all hover:scale-105 active:scale-95 shadow-xl shadow-mint-500/20">
                            Join Session
                          </Button>
                        </div>
                        <div className="absolute top-0 right-0 w-96 h-96 bg-mint-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px]" />
                      </Card>
                    ))
                  ) : (
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-mint-100 flex flex-col items-center"
                    >
                      <div className="w-16 h-16 bg-mint-50 rounded-full flex items-center justify-center mb-6">
                        <Calendar className="h-8 w-8 text-mint-300" />
                      </div>
                      <h4 className="serif text-2xl font-bold text-sage-900 mb-2">Ready to take the next step?</h4>
                      <p className="text-zinc-500 font-medium max-w-sm mb-8 leading-relaxed">No upcoming sessions found. Consistency is key to sustainable mental well-being.</p>
                      <Button className="rounded-full bg-mint-600 text-white font-bold h-12 px-8 hover:bg-mint-700">Find a Therapist</Button>
                    </motion.div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="appointments" className="space-y-6">
                 {appointments.length > 0 ? (
                   <div className="grid gap-4">
                     {appointments.map(app => (
                       <motion.div 
                         key={app.id}
                         initial={{ opacity: 0, x: -20 }}
                         animate={{ opacity: 1, x: 0 }}
                       >
                         <Card className="rounded-3xl border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white p-6 border-l-[6px] border-mint-500 group overflow-hidden">
                           <div className="flex items-center justify-between">
                             <div className="flex items-center gap-6">
                               <div className="w-14 h-14 rounded-2xl bg-mint-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                 <Calendar className="h-6 w-6 text-mint-600" />
                               </div>
                               <div>
                                 <h4 className="text-lg font-bold text-sage-900">{app.therapist?.user.fullName}</h4>
                                 <p className="text-sm font-medium text-zinc-500">Scheduled for {format(new Date(app.appointmentDate), 'MMMM dd')} at {app.appointmentTime}</p>
                               </div>
                             </div>
                             <div className="flex items-center gap-4">
                               <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                 app.status === 'CONFIRMED' ? 'bg-mint-100 text-mint-700' : 'bg-zinc-100 text-zinc-600'
                               }`}>
                                 {app.status}
                               </span>
                               <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-mint-50">
                                 <ChevronRight className="h-5 w-5 text-zinc-400 group-hover:text-mint-600" />
                               </Button>
                             </div>
                           </div>
                         </Card>
                       </motion.div>
                     ))}
                   </div>
                 ) : (
                   <div className="py-24 text-center">
                      <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] mb-4">Empty Journey</p>
                      <p className="text-zinc-500">Your session history will begin appearing here once you book your first appointment.</p>
                   </div>
                 )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
