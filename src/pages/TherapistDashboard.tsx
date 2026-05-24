import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  X,
  Users, 
  Calendar, 
  Activity, 
  MessageSquare, 
  Clock, 
  ChevronRight, 
  Search, 
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  FileText,
  Video,
  MapPin,
  ClipboardList,
  CreditCard,
  Bell,
  Trash2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { Notification, NotificationType } from '../components/Notification';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

export default function TherapistDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string, type: NotificationType } | null>(null);
  const [confirmingAction, setConfirmingAction] = useState<{ id: string, status: string } | null>(null);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const [inAppNotifications, setInAppNotifications] = useState([
    { id: '1', title: 'New Intake Request', message: 'Client Jane Doe requested an upcoming virtual consultation.', time: '5m ago', type: 'warning', read: false },
    { id: '2', title: 'Clinical Payroll Complete', message: 'Your monthly practice disbursement was processed securely.', time: '3h ago', type: 'success', read: false },
    { id: '3', title: 'Platform Security Update', message: 'Practitioner portal fully updated to clinical HIPAA HIPAA-2.4 compliance.', time: '1d ago', type: 'info', read: true },
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

  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED'>('ALL');

  const notify = (message: string, type: NotificationType = 'info') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, appRes] = await Promise.all([
        fetch('/api/therapist/analytics'),
        fetch('/api/appointments/my')
      ]);
      
      if (statsRes.ok) setStats(await statsRes.json());
      if (appRes.ok) setAppointments(await appRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    setIsProcessing(status);
    try {
      const res = await fetch(`/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setSelectedAppointment(null);
        setConfirmingAction(null);
        fetchDashboardData();
        setTimeout(() => notify(`Request ${status.toLowerCase()} successfully.`, 'success'), 500);
      } else {
        const data = await res.json();
        notify(data.error || 'Update failed', 'error');
      }
    } catch (err) {
      notify('An error occurred while updating status', 'error');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleUpdatePayment = async (id: string, paymentStatus: string) => {
    setIsProcessing('payment');
    try {
      const res = await fetch(`/api/appointments/${id}/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus })
      });
      if (res.ok) {
        if (selectedAppointment && selectedAppointment.id === id) {
          setSelectedAppointment({ ...selectedAppointment, paymentStatus });
        }
        fetchDashboardData();
        setTimeout(() => notify('Payment status updated successfully. Invoice has been sent to client.', 'success'), 500);
      } else {
        notify('Failed to update payment status', 'error');
      }
    } catch (err) {
      notify('An error occurred while updating payment', 'error');
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
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 border-4 border-mint-200 border-t-mint-600 rounded-full animate-spin" />
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Loading Clinical Workspace...</p>
      </div>
    </div>
  );

  const filteredAppointments = appointments.filter(a => {
    if (filter === 'ALL') return a.status !== 'CANCELLED';
    return a.status === filter;
  });

  const sessionDistribution = [
    { name: 'Mon', count: 4 },
    { name: 'Tue', count: 6 },
    { name: 'Wed', count: 3 },
    { name: 'Thu', count: 8 },
    { name: 'Fri', count: 5 },
  ];

  return (
    <div className="min-h-screen bg-zinc-50/50 pt-8 pb-24">
      <div className="container mx-auto px-4 md:px-8">
        {/* Therapist Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="px-3 py-1 bg-mint-100 text-mint-700 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-2">
                <Activity className="h-3 w-3" />
                Clinical Practice Active
              </div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Identity: {user?.fullName}
              </span>
            </div>
            <h1 className="serif text-4xl md:text-5xl font-bold text-zinc-900 tracking-wide">Practice Overview</h1>
          </div>
          
          <div className="flex items-center gap-3">
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => setShowNotificationsModal(true)}
               className="relative p-2.5 bg-white border border-zinc-200/80 rounded-full text-zinc-600 hover:text-zinc-950 shadow-sm flex items-center justify-center transition-all cursor-pointer h-10 w-10"
               title="Workspace Alerts"
             >
               <Bell className="h-4 w-4" />
               {inAppNotifications.some(n => !n.read) && (
                 <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white animate-pulse" />
               )}
             </motion.button>
             <div className="px-5 py-2 bg-mint-500/10 text-mint-700 text-[10px] font-bold uppercase tracking-widest rounded-xl flex items-center gap-2 h-10">
               <Video className="h-3 w-3" /> Professional Suite
             </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { 
              label: 'Active Clients', 
              value: stats?.totalClients || 0, 
              icon: Users,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
              filter: 'ALL'
            },
            { 
              label: 'Consultations Completed', 
              value: stats?.completedSessions || 0, 
              icon: CheckCircle2,
              color: 'text-mint-600',
              bg: 'bg-mint-50',
              filter: 'COMPLETED'
            },
            { 
              label: 'Pending Reviews', 
              value: appointments.filter(a => a.status === 'PENDING').length, 
              icon: AlertCircle,
              color: 'text-amber-600',
              bg: 'bg-amber-50',
              filter: 'PENDING'
            },
          ].map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setFilter(item.filter as any)}
              className="cursor-pointer"
            >
              <Card className={`rounded-3xl border-none shadow-sm overflow-hidden p-6 flex flex-row items-center gap-6 transition-all ${filter === item.filter ? 'ring-2 ring-zinc-900 bg-white' : 'bg-white hover:shadow-md'}`}>
                <div className={`${item.bg} p-4 rounded-2xl`}>
                  <item.icon className={`h-8 w-8 ${item.color}`} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-3xl font-bold text-zinc-900">{item.value}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="space-y-12">
          {/* Main Workspace - Schedule & Requests */}
          <div className="space-y-8">
            {selectedAppointment ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-10 ring-2 ring-mint-500/20">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block ${
                        selectedAppointment.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 
                        selectedAppointment.status === 'CONFIRMED' ? 'bg-mint-100 text-mint-700' : 'bg-zinc-100 text-zinc-400'
                      }`}>
                        {selectedAppointment.status} Request
                      </span>
                      <h3 className="serif text-4xl font-bold text-zinc-900 mb-2">Session with {selectedAppointment.client.fullName}</h3>
                      <p className="text-zinc-500 font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> {format(new Date(selectedAppointment.appointmentDate), 'EEEE, MMMM dd')} at {selectedAppointment.appointmentTime}
                      </p>
                    </div>
                    <Button variant="ghost" className="rounded-full h-10 w-10 p-0" onClick={() => setSelectedAppointment(null)}>
                      <X className="h-5 w-5 text-zinc-400" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div className="p-6 rounded-3xl bg-zinc-50">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Session Method</p>
                      <div className="flex items-center gap-3">
                        {selectedAppointment.sessionType === 'ONLINE' ? <Video className="h-5 w-5 text-mint-600" /> : <MapPin className="h-5 w-5 text-mint-600" />}
                        <p className="font-bold text-zinc-900">{selectedAppointment.sessionType === 'ONLINE' ? 'Virtual Consultation' : 'In-Person Visit'}</p>
                      </div>
                    </div>
                    <div className="p-6 rounded-3xl bg-zinc-50">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Payment Status</p>
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <CreditCard className={`h-5 w-5 ${selectedAppointment.paymentStatus === 'PAID' ? 'text-mint-600' : 'text-amber-600'}`} />
                           <p className="font-bold text-zinc-900">{selectedAppointment.paymentStatus === 'PAID' ? 'Paid Securely' : 'Awaiting Payment'}</p>
                         </div>
                         {selectedAppointment.paymentStatus !== 'PAID' && (
                           <motion.button 
                             whileHover={{ scale: 1.05 }}
                             whileTap={{ scale: 0.95 }}
                             className="px-6 h-10 bg-emerald-600 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50" 
                             onClick={() => handleUpdatePayment(selectedAppointment.id, 'PAID')}
                             disabled={isProcessing === 'payment'}
                           >
                             {isProcessing === 'payment' ? (
                               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full" />
                             ) : (
                               <>
                                 <CheckCircle2 className="h-4 w-4" />
                                 Mark Paid
                               </>
                             )}
                           </motion.button>
                         )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-zinc-50 mb-10">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Client Notes</p>
                    <p className="text-sm text-zinc-600 font-medium italic">"{selectedAppointment.notes || 'No notes provided by client'}"</p>
                  </div>

                    <div className="flex gap-4">
                    {selectedAppointment.status === 'PENDING' ? (
                      <>
                        <Button 
                          className="flex-1 rounded-2xl h-14 bg-zinc-900 text-white font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/20"
                          onClick={() => setConfirmingAction({ id: selectedAppointment.id, status: 'CONFIRMED' })}
                        >
                          Approve Consultation
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 rounded-2xl h-14 border-zinc-200 text-rose-600 font-bold hover:bg-rose-50"
                          onClick={() => setConfirmingAction({ id: selectedAppointment.id, status: 'REJECTED' })}
                        >
                          Decline Request
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full rounded-2xl h-14 border-zinc-200 text-zinc-400 font-bold hover:bg-zinc-50"
                        onClick={() => setSelectedAppointment(null)}
                      >
                        Back to Overview
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h3 className="serif text-3xl font-bold text-zinc-900">Appointment Queue</h3>
                  <div className="flex gap-2">
                    {(['ALL', 'PENDING', 'CONFIRMED'] as const).map((f) => (
                      <Button
                        key={f}
                        variant={filter === f ? 'default' : 'ghost'}
                        onClick={() => setFilter(f)}
                        className={`h-9 px-6 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                          filter === f ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/10' : 'text-zinc-500 hover:bg-zinc-100'
                        }`}
                      >
                        {f}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((app, idx) => {
                      const cleanSessionType = app.sessionType.replace('_', '-').toLowerCase();
                      return (
                        <motion.div
                          key={app.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => setSelectedAppointment(app)}
                          className={`group relative bg-white p-6 md:p-8 rounded-[2rem] border border-zinc-100 hover:border-mint-200 transition-all cursor-pointer hover:shadow-xl hover:shadow-zinc-900/5 ${
                            selectedAppointment?.id === app.id ? 'ring-2 ring-mint-500/20 border-mint-200' : ''
                          }`}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1.2fr_1.1fr_auto] items-center gap-6 md:gap-8">
                            {/* Client Info */}
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-2xl bg-mint-50 border border-mint-100 flex items-center justify-center font-bold text-mint-600 text-xl flex-shrink-0">
                                {app.client.fullName.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-lg text-zinc-900 group-hover:text-mint-700 transition-colors leading-tight mb-1.5 truncate">
                                  {app.client.fullName}
                                </p>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 capitalize bg-zinc-50 px-2.5 py-1 rounded-full w-fit">
                                  {app.sessionType === 'ONLINE' ? (
                                    <Video className="h-3 w-3 text-mint-600" />
                                  ) : (
                                    <MapPin className="h-3 w-3 text-mint-600" />
                                  )}
                                  <span>{cleanSessionType} Session</span>
                                </div>
                              </div>
                            </div>

                            {/* Date & Time */}
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-zinc-50 rounded-xl text-mint-600 flex-shrink-0">
                                <Calendar className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-semibold text-zinc-950 text-sm leading-tight">
                                  {format(new Date(app.appointmentDate), 'MMMM dd, yyyy')}
                                </p>
                                <p className="text-xs font-bold text-zinc-400 mt-1">
                                  {app.appointmentTime}
                                </p>
                              </div>
                            </div>

                            {/* Status & Payment */}
                            <div className="flex flex-col gap-1.5 md:items-start">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                                app.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200/50' : 
                                app.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' : 'bg-zinc-50 text-zinc-500 border-zinc-200/50'
                              }`}>
                                {app.status}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${app.paymentStatus === 'PAID' ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
                                <p className={`text-[10px] font-bold uppercase tracking-tight ${app.paymentStatus === 'PAID' ? 'text-emerald-600/95' : 'text-amber-500/95'}`}>
                                  {app.paymentStatus === 'PAID' ? 'Payment Verified' : 'Awaiting Payment'}
                                </p>
                              </div>
                            </div>
                            
                            {/* Navigation Indicator */}
                            <div className="flex justify-end md:pr-2">
                              <Button 
                                size="icon"
                                variant="ghost"
                                className="h-10 w-10 rounded-xl bg-zinc-50 text-zinc-400 group-hover:text-zinc-900 group-hover:bg-mint-50 group-hover:scale-105 transition-all"
                              >
                                <ChevronRight className="h-5 w-5" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="bg-white/50 border-2 border-dashed border-zinc-200 rounded-[3rem] py-24 text-center">
                      <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="h-10 w-10 text-zinc-300" />
                      </div>
                      <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">No matching appointments found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Row - Analytics & Insights */}
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <CardTitle className="serif text-xl text-zinc-900">Session Volume</CardTitle>
                  <CardDescription className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Weekly Distribution</CardDescription>
                </div>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sessionDistribution}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                    <YAxis axisLine={false} tickLine={false} hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: '#fff' }}
                    />
                    <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="rounded-[2.5rem] border-none bg-zinc-900 text-white p-8 relative overflow-hidden">
               <div className="relative z-10">
                 <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                   <TrendingUp className="h-6 w-6 text-mint-400" />
                 </div>
                 <h4 className="text-2xl font-bold mb-2">Practice Insights</h4>
                 <p className="text-zinc-400 text-xs font-medium mb-1 leading-relaxed">
                   Your client retention rate has increased by 14% this month. Keep up the empathetic work!
                 </p>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-mint-500/20 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />
            </Card>

            <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-100">
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-6 border-l-4 border-mint-500 pl-3">Session Records</h3>
              <div className="space-y-5">
                {stats?.recentRecords && stats.recentRecords.length > 0 ? (
                  stats.recentRecords.slice(0, 2).map((record: any) => (
                    <div key={record.id} className="group cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-400 group-hover:bg-mint-50 group-hover:text-mint-600 transition-colors">
                          {record.appointment.client.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-zinc-900">{record.appointment.client.fullName}</p>
                          <p className="text-[8px] text-zinc-400 font-bold uppercase">{format(new Date(record.createdAt), 'MMM dd, yyyy')}</p>
                        </div>
                      </div>
                      <p className="text-[11px] text-zinc-500 line-clamp-2 italic leading-relaxed">"{record.summary}"</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-[10px] font-bold text-zinc-300 uppercase">No recent records</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmingAction && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmingAction(null)}
              className="absolute inset-0 bg-white/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[3rem] p-12 max-w-sm w-full shadow-2xl border border-zinc-100"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${confirmingAction.status === 'CONFIRMED' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                {confirmingAction.status === 'CONFIRMED' ? (
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                ) : (
                  <XCircle className="h-8 w-8 text-rose-600" />
                )}
              </div>
              <h3 className="serif text-2xl font-bold text-zinc-900 mb-4 capitalize">{confirmingAction.status.toLowerCase()} Session?</h3>
              <p className="text-zinc-500 font-medium mb-8 leading-relaxed">
                {confirmingAction.status === 'CONFIRMED' 
                  ? 'Confirming will notify the client and finalize the appointment slot.'
                  : 'Declining this request will remove it from your pending list and notify the client.'}
              </p>
              <div className="flex flex-col gap-3">
                <Button 
                  className={`w-full h-14 rounded-2xl text-white font-bold shadow-lg transition-all disabled:opacity-50 ${
                    confirmingAction.status === 'CONFIRMED' ? 'bg-zinc-900 hover:bg-zinc-800 shadow-zinc-900/10' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/10'
                  }`}
                  onClick={() => handleUpdateStatus(confirmingAction.id, confirmingAction.status)}
                  disabled={isProcessing === confirmingAction.status}
                >
                  {isProcessing === confirmingAction.status ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full" />
                  ) : (
                    confirmingAction.status === 'CONFIRMED' ? 'Approve' : 'Confirm Decline'
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full h-14 rounded-2xl font-bold text-zinc-500"
                  onClick={() => setConfirmingAction(null)}
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
                  <h3 className="serif text-xl font-bold text-zinc-900 tracking-wide">Practice Alerts</h3>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">Stay updated on clinical activity</p>
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
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Active practice session synchronized with dispatch system</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
