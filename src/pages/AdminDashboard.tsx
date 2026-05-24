import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  Activity, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  UserCheck,
  Clock,
  ShieldCheck,
  Settings,
  MessageSquare,
  Search,
  Filter,
  MoreVertical,
  Plus,
  Trash2,
  Edit2,
  X,
  UserPlus,
  Lock,
  Unlock,
  Check,
  Bell
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Notification, NotificationType } from '../components/Notification';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [view, setView] = useState<'OVERVIEW' | 'MANAGEMENT'>('OVERVIEW');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ message: string, type: NotificationType } | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const [inAppNotifications, setInAppNotifications] = useState([
    { id: '1', title: 'License Verification Queue', message: 'Dr. Evelyn Martinez submitted her updated practitioner credentials.', time: '10m ago', type: 'warning', read: false },
    { id: '2', title: 'Resource Clusters Healthy', message: 'Dynamic container nodes auto-calibrated load successfully.', time: '40m ago', type: 'success', read: false },
    { id: '3', title: 'Intrusion Block Audited', message: 'Auth rate limits tripped and blocked brute attempt from IP 198.51.100.42.', time: '2h ago', type: 'error', read: true },
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

  const [generatingReport, setGeneratingReport] = useState(false);

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    notify('Compiling administrative databases and synthesizing CSV report...', 'info');
    try {
      const res = await fetch('/api/admin/report/csv');
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const datestamp = format(new Date(), 'yyyyMMdd_HHmmss');
        a.download = `theramint_admin_report_${datestamp}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        notify('Administrative database report generated and downloaded successfully.', 'success');
      } else {
        notify('Failed to generate administrative report on the server.', 'error');
      }
    } catch (err: any) {
      console.error(err);
      notify('Network error encountered during report compile.', 'error');
    } finally {
      setGeneratingReport(false);
    }
  };
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    fullName: '',
    email: '',
    password: '',
    role: 'CLIENT',
    status: 'ACTIVE',
    therapistData: {
      specialization: '',
      experienceYears: '0',
      bio: '',
      qualifications: '',
      availabilityStatus: 'Available'
    }
  });

  useEffect(() => {
    fetchStats();
    if (view === 'MANAGEMENT') {
      fetchUsers();
    }
  }, [view]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (view === 'OVERVIEW') setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
        setShowConfirmDelete(null);
        notify('User identity purged successfully.', 'success');
      } else {
        notify('Failed to delete user.', 'error');
      }
    } catch (err) {
      notify('An error occurred during deletion.', 'error');
    }
  };

  const handleToggleStatus = async (user: any) => {
    const newStatus = user.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    try {
      const res = await fetch(`/api/admin/users/${user.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/admin/users';
    const method = editingUser ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      password: '', // Don't show password
      role: user.role,
      status: user.status,
      therapistData: user.therapistProfile ? {
        specialization: user.therapistProfile.specialization,
        experienceYears: String(user.therapistProfile.experienceYears),
        bio: user.therapistProfile.professionalBio,
        qualifications: user.therapistProfile.qualifications,
        availabilityStatus: user.therapistProfile.availabilityStatus
      } : {
        specialization: '',
        experienceYears: '0',
        bio: '',
        qualifications: '',
        availabilityStatus: 'Available'
      }
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({
      fullName: '',
      email: '',
      password: '',
      role: 'CLIENT',
      status: 'ACTIVE',
      therapistData: {
        specialization: '',
        experienceYears: '0',
        bio: '',
        qualifications: '',
        availabilityStatus: 'Available'
      }
    });
    setIsModalOpen(true);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-mint-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading Security Terminal...</p>
      </div>
    </div>
  );

  const revenueData = [
    { month: 'Jan', rev: 4500 },
    { month: 'Feb', rev: 5200 },
    { month: 'Mar', rev: 4800 },
    { month: 'Apr', rev: 6100 },
    { month: 'May', rev: 7500 },
    { month: 'Jun', rev: 8200 },
  ];

  const userGrowthData = [
    { date: '01/06', users: 120 },
    { date: '08/06', users: 154 },
    { date: '15/06', users: 198 },
    { date: '22/06', users: 245 },
    { date: '29/06', users: 312 },
  ];

  return (
    <div className="min-h-screen bg-zinc-50/50 pt-8 pb-24">
      <div className="container mx-auto px-4 md:px-8">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="px-3 py-1 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-2">
                <ShieldCheck className="h-3 w-3" />
                Administrative Terminal
              </div>
              <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">
                Last updated: {format(new Date(), 'HH:mm:ss')}
              </span>
            </div>
            <h1 className="serif text-4xl md:text-5xl font-bold text-zinc-900 tracking-wide">
              {view === 'OVERVIEW' ? 'System Overview' : 'Identity Management'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => setShowNotificationsModal(true)}
               className="relative p-2.5 bg-white border border-zinc-200/80 rounded-full text-zinc-600 hover:text-zinc-950 shadow-sm flex items-center justify-center transition-all cursor-pointer h-10 w-10 shrink-0"
               title="System Alerts"
             >
               <Bell className="h-4 w-4" />
               {inAppNotifications.some(n => !n.read) && (
                 <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white animate-pulse" />
               )}
             </motion.button>
             <div className="bg-zinc-100 p-1 rounded-2xl flex gap-1 mr-4">
               <button 
                onClick={() => setView('OVERVIEW')}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                  view === 'OVERVIEW' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'
                }`}
               >
                Overview
               </button>
               <button 
                onClick={() => setView('MANAGEMENT')}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                  view === 'MANAGEMENT' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'
                }`}
               >
                Users
               </button>
            </div>
            {view === 'MANAGEMENT' ? (
              <Button 
                onClick={openAddModal}
                className="rounded-xl bg-mint-600 text-white shadow-xl shadow-mint-900/10 h-11 px-6 font-bold hover:bg-mint-700"
              >
                <UserPlus className="h-4 w-4 mr-2" /> Add Account
              </Button>
            ) : (
              <Button 
                onClick={handleGenerateReport}
                disabled={generatingReport}
                className="rounded-xl bg-zinc-900 text-white shadow-xl shadow-zinc-900/10 h-11 px-6 font-bold hover:bg-zinc-800 disabled:opacity-50"
              >
                {generatingReport ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Compiling...
                  </>
                ) : (
                  'Generate Report'
                )}
              </Button>
            )}
          </div>
        </div>

        {view === 'OVERVIEW' ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { 
                  label: 'Total Active Users', 
                  value: stats?.totalUsers || 0, 
                  change: '+12.5%', 
                  up: true, 
                  icon: Users,
                  color: 'text-blue-600',
                  bg: 'bg-blue-50'
                },
                { 
                  label: 'Licensed Therapists', 
                  value: stats?.totalTherapists || 0, 
                  change: '+4.2%', 
                  up: true, 
                  icon: UserCheck,
                  color: 'text-mint-600',
                  bg: 'bg-mint-50'
                },
                { 
                  label: 'Monthly Sessions', 
                  value: stats?.totalAppointments || 0, 
                  change: '+18.7%', 
                  up: true, 
                  icon: Calendar,
                  color: 'text-amber-600',
                  bg: 'bg-amber-50'
                },
                { 
                  label: 'Completion Rate', 
                  value: `${Math.round((stats?.completedAppointments / stats?.totalAppointments || 0) * 100)}%`, 
                  change: '-1.4%', 
                  up: false, 
                  icon: Activity,
                  color: 'text-rose-600',
                  bg: 'bg-rose-50'
                },
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`${item.bg} p-3 rounded-2xl`}>
                          <item.icon className={`h-6 w-6 ${item.color}`} />
                        </div>
                        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${
                          item.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {item.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {item.change}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="text-3xl font-bold text-zinc-900">{item.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Chart Column */}
              <div className="lg:col-span-2 space-y-8">
                <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <CardTitle className="serif text-2xl text-zinc-900">Platform Utilization</CardTitle>
                      <CardDescription className="text-zinc-500 font-medium">Monthly revenue and appointment volume</CardDescription>
                    </div>
                    <div className="flex bg-zinc-100 p-1 rounded-xl">
                      <button className="px-4 py-1.5 bg-white text-zinc-900 text-xs font-bold rounded-lg shadow-sm">Revenue</button>
                      <button className="px-4 py-1.5 text-zinc-500 text-xs font-bold hover:text-zinc-900">Volume</button>
                    </div>
                  </div>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#18181b" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: '#fff' }}
                        />
                        <Area type="monotone" dataKey="rev" stroke="#18181b" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-8">
                    <CardHeader className="p-0 mb-6">
                      <CardTitle className="serif text-xl text-zinc-900">User Acquisition</CardTitle>
                    </CardHeader>
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={userGrowthData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                          <YAxis hide />
                          <Bar dataKey="users" fill="#bfdbfe" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-8">
                    <CardHeader className="p-0 mb-6 flex flex-row items-center justify-between">
                      <CardTitle className="serif text-xl text-zinc-900">Activity Logs</CardTitle>
                      <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-900 font-bold text-[10px]">View All</Button>
                    </CardHeader>
                    <div className="space-y-4">
                      {[
                        { action: 'New Therapist Applied', time: '2m ago', user: 'Dr. Sarah Smith' },
                        { action: 'Database Backup Complete', time: '14m ago', user: 'System' },
                        { action: 'Security Alert: Failed Login', time: '1h ago', user: 'IP: 192.168.1.1' },
                        { action: 'App Version v2.1.0 Deployed', time: '3h ago', user: 'DevOps' },
                      ].map((log, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 group hover:bg-zinc-100 transition-colors">
                          <div>
                            <p className="text-xs font-bold text-zinc-900">{log.action}</p>
                            <p className="text-[10px] text-zinc-400 font-medium">{log.user}</p>
                          </div>
                          <span className="text-[10px] font-bold text-zinc-400">{log.time}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>

              {/* Side Column */}
              <div className="space-y-8">
                <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-8">
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6">Quick Management</h3>
                  <div className="space-y-3 font-bold">
                    <Button 
                      onClick={() => setView('MANAGEMENT')}
                      className="w-full justify-start rounded-2xl h-14 bg-zinc-900 text-white gap-3 px-6 hover:translate-y-[-2px] transition-transform"
                    >
                      <Users className="h-5 w-5" /> Manage Users
                    </Button>
                    <Button variant="outline" className="w-full justify-start rounded-2xl h-14 border-zinc-200 bg-white text-zinc-900 gap-3 px-6 hover:bg-zinc-50 transition-colors">
                      <UserCheck className="h-5 w-5" /> Therapist Approvals
                    </Button>
                    <Button variant="outline" className="w-full justify-start rounded-2xl h-14 border-zinc-200 bg-white text-zinc-900 gap-3 px-6 hover:bg-zinc-50 transition-colors">
                      <MessageSquare className="h-5 w-5" /> Support Tickets
                    </Button>
                    <Button variant="outline" className="w-full justify-start rounded-2xl h-14 border-zinc-200 bg-white text-zinc-900 gap-3 px-6 hover:bg-zinc-50 transition-colors">
                      <Settings className="h-5 w-5" /> System Settings
                    </Button>
                  </div>
                </Card>

                 {/* Alerts Migrated to Header Modal */}

                <Card className="rounded-[2.5rem] border-none bg-mint-600 text-white p-8 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold mb-2">Growth Milestone</h4>
                    <p className="text-mint-50/70 text-sm font-medium mb-6 leading-relaxed">
                      You've surpassed 500 total sessions this month. Great system health!
                    </p>
                    <Button className="w-full rounded-xl bg-white text-mint-700 font-bold hover:bg-mint-50" onClick={fetchUsers}>
                      Refresh Feed
                    </Button>
                  </div>
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
                </Card>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
              <div className="p-8 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-50/30">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input 
                    placeholder="Search by name, email or role..." 
                    className="pl-12 h-12 rounded-2xl border-zinc-200 bg-white shadow-sm focus:ring-mint-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="rounded-xl border-zinc-200 font-bold h-10 px-4">
                    <Filter className="h-4 w-4 mr-2" /> Filters
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-100">
                      <th className="p-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Identify</th>
                      <th className="p-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Role</th>
                      <th className="p-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                      <th className="p-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Operations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(u => 
                      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      u.role.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map((u) => (
                      <tr key={u.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 transition-colors group">
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                              u.role === 'ADMIN' ? 'bg-zinc-900 text-white' : 
                              u.role === 'THERAPIST' ? 'bg-mint-100 text-mint-700' : 
                              'bg-indigo-100 text-indigo-700'
                            }`}>
                              {u.fullName.charAt(0)}
                            </div>
                            <div>
                               <p className="font-bold text-zinc-900 text-sm">{u.fullName}</p>
                               <p className="text-[10px] text-zinc-400 font-medium">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                             u.role === 'ADMIN' ? 'bg-zinc-900 text-white' : 
                             u.role === 'THERAPIST' ? 'bg-mint-50 text-mint-700' : 
                             'bg-indigo-50 text-indigo-700'
                           }`}>
                             {u.role}
                           </span>
                        </td>
                        <td className="p-6">
                           <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                             <span className={`text-[10px] font-bold uppercase tracking-widest ${u.status === 'ACTIVE' ? 'text-emerald-600' : 'text-rose-600'}`}>
                               {u.status}
                             </span>
                           </div>
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {u.email !== 'asif17111998@gmail.com' ? (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => openEditModal(u)}
                                  className="w-8 h-8 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleToggleStatus(u)}
                                  className={`w-8 h-8 rounded-lg hover:bg-zinc-100 ${u.status === 'ACTIVE' ? 'text-zinc-500' : 'text-amber-600'}`}
                                >
                                  {u.status === 'ACTIVE' ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                                </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setShowConfirmDelete(u.id)}
        className="w-8 h-8 rounded-lg hover:bg-rose-50 text-zinc-500 hover:text-rose-600"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
                              </>
                            ) : (
                               <div className="px-3 py-1 bg-zinc-100 rounded-lg text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                 System Protected
                               </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Management Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                 <div>
                   <h2 className="serif text-2xl font-bold text-zinc-900">{editingUser ? 'Update Security Identity' : 'New Account Provisioning'}</h2>
                   <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest mt-1">
                     {editingUser ? `ID: ${editingUser.id}` : 'Platform Registry'}
                   </p>
                 </div>
                 <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="rounded-xl hover:bg-white">
                   <X className="h-5 w-5" />
                 </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                 <form onSubmit={handleSaveUser} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Legal Full Name</Label>
                         <Input 
                           required 
                           value={formData.fullName} 
                           onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                           className="h-12 rounded-xl border-zinc-200"
                           placeholder="John Doe"
                         />
                      </div>
                      <div className="space-y-2">
                         <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Identity Email</Label>
                         <Input 
                           required 
                           type="email"
                           value={formData.email} 
                           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                           className="h-12 rounded-xl border-zinc-200"
                           placeholder="john@example.com"
                         />
                      </div>
                    </div>

                    {!editingUser && (
                      <div className="space-y-2">
                         <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Security Credential (Password)</Label>
                         <Input 
                           required 
                           type="password"
                           value={formData.password} 
                           onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                           className="h-12 rounded-xl border-zinc-200"
                           placeholder="••••••••"
                         />
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Resource Permission (Role)</Label>
                         <Select 
                           value={formData.role} 
                           onValueChange={(val) => setFormData({ ...formData, role: val })}
                         >
                           <SelectTrigger className="h-12 rounded-xl border-zinc-200 font-bold overflow-hidden">
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent className="rounded-xl border-zinc-100 shadow-xl">
                             <SelectItem value="CLIENT" className="font-bold">CLIENT</SelectItem>
                             <SelectItem value="THERAPIST" className="font-bold">THERAPIST</SelectItem>
                             <SelectItem value="ADMIN" className="font-bold">ADMIN</SelectItem>
                           </SelectContent>
                         </Select>
                      </div>
                      <div className="space-y-2">
                         <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Protocol Status</Label>
                         <Select 
                           value={formData.status} 
                           onValueChange={(val) => setFormData({ ...formData, status: val })}
                         >
                           <SelectTrigger className="h-12 rounded-xl border-zinc-200 font-bold">
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent className="rounded-xl border-zinc-100 shadow-xl">
                             <SelectItem value="ACTIVE" className="font-bold">ACTIVE</SelectItem>
                             <SelectItem value="DISABLED" className="font-bold">DISABLED</SelectItem>
                           </SelectContent>
                         </Select>
                      </div>
                    </div>

                    {formData.role === 'THERAPIST' && (
                      <div className="pt-6 border-t border-zinc-100 space-y-6">
                         <h3 className="text-sm font-bold text-zinc-900 border-l-4 border-mint-500 pl-3">Professional Dossier</h3>
                         
                         <div className="grid md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                             <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Core Specialization</Label>
                             <Input 
                               value={formData.therapistData.specialization} 
                               onChange={(e) => setFormData({ 
                                 ...formData, 
                                 therapistData: { ...formData.therapistData, specialization: e.target.value } 
                               })}
                               className="h-12 rounded-xl border-zinc-200"
                             />
                           </div>
                           <div className="space-y-2">
                             <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Experience (Years)</Label>
                             <Input 
                               type="number"
                               value={formData.therapistData.experienceYears} 
                               onChange={(e) => setFormData({ 
                                 ...formData, 
                                 therapistData: { ...formData.therapistData, experienceYears: e.target.value } 
                               })}
                               className="h-12 rounded-xl border-zinc-200"
                             />
                           </div>
                         </div>

                         <div className="space-y-2">
                           <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Qualifications & Degrees</Label>
                           <Input 
                             value={formData.therapistData.qualifications} 
                             onChange={(e) => setFormData({ 
                               ...formData, 
                               therapistData: { ...formData.therapistData, qualifications: e.target.value } 
                             })}
                             className="h-12 rounded-xl border-zinc-200"
                             placeholder="PhD in Psychology, Licensed LCSW"
                           />
                         </div>

                         <div className="space-y-2">
                           <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Professional Biography</Label>
                           <Textarea 
                             value={formData.therapistData.bio} 
                             onChange={(e) => setFormData({ 
                               ...formData, 
                               therapistData: { ...formData.therapistData, bio: e.target.value } 
                             })}
                             className="rounded-xl border-zinc-200 min-h-[100px]"
                             placeholder="Tell us about your therapeutic approach..."
                           />
                         </div>

                         <div className="space-y-2">
                           <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Availability Status</Label>
                           <Select 
                             value={formData.therapistData.availabilityStatus} 
                             onValueChange={(val) => setFormData({ 
                               ...formData, 
                               therapistData: { ...formData.therapistData, availabilityStatus: val } 
                             })}
                           >
                             <SelectTrigger className="h-12 rounded-xl border-zinc-200 font-bold">
                               <SelectValue />
                             </SelectTrigger>
                             <SelectContent className="rounded-xl border-zinc-100 shadow-xl font-bold">
                               <SelectItem value="Available">Available</SelectItem>
                               <SelectItem value="Busy">Busy</SelectItem>
                               <SelectItem value="Away">Away</SelectItem>
                             </SelectContent>
                           </Select>
                         </div>
                      </div>
                    )}

                    <div className="pt-8 flex gap-4">
                       <Button type="submit" className="flex-1 rounded-2xl h-14 bg-zinc-900 text-white font-bold text-lg shadow-xl hover:shadow-zinc-900/20">
                         {editingUser ? 'Commit Identity Data' : 'Execute Provision'}
                       </Button>
                       <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsModalOpen(false)}
                        className="px-8 rounded-2xl h-14 border-zinc-200 text-zinc-500 font-bold"
                       >
                         Abort
                       </Button>
                    </div>
                 </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showConfirmDelete && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmDelete(null)}
              className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[3rem] p-12 max-w-sm w-full shadow-2xl border border-zinc-100"
            >
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-8">
                <Trash2 className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="serif text-2xl font-bold text-zinc-900 mb-4">Purge Identity?</h3>
              <p className="text-zinc-500 font-medium mb-8 leading-relaxed">
                This action is IRREVERSIBLE. All associated consultation data, session notes, and billing history for this user will be permanently deleted from the platform.
              </p>
              <div className="flex flex-col gap-3">
                <Button 
                  className="w-full h-14 rounded-2xl bg-rose-600 text-white font-bold hover:bg-rose-700 shadow-lg shadow-rose-900/10"
                  onClick={() => handleDeleteUser(showConfirmDelete)}
                >
                  Confirm Permanent Deletion
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full h-14 rounded-2xl font-bold text-zinc-500"
                  onClick={() => setShowConfirmDelete(null)}
                >
                  Abort Action
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
                  <h3 className="serif text-xl font-bold text-zinc-900 tracking-wide">System Alerts</h3>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">Stay updated on infrastructure monitoring</p>
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
                          <div className={`w-2 h-2 rounded-full ${notif.type === 'success' ? 'bg-emerald-500' : notif.type === 'warning' ? 'bg-amber-500' : 'bg-rose-500'}`} />
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
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Active administrative session synchronized with monitoring services</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notifications */}
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
