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
  Filter
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
  Area
} from 'recharts';
import { motion } from 'motion/react';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

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
      setLoading(false);
    }
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
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
            <h1 className="serif text-4xl md:text-5xl font-bold text-zinc-900">System Overview</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl border-zinc-200 bg-white shadow-sm hover:bg-zinc-50 h-11 px-6 font-bold">
              <Search className="h-4 w-4 mr-2" /> Search Data
            </Button>
            <Button className="rounded-xl bg-zinc-900 text-white shadow-xl shadow-zinc-900/10 h-11 px-6 font-bold hover:bg-zinc-800">
              Generate Report
            </Button>
          </div>
        </div>

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
                <Button className="w-full justify-start rounded-2xl h-14 bg-zinc-900 text-white gap-3 px-6 hover:translate-y-[-2px] transition-transform">
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

            <Card className="rounded-[2.5rem] border-none bg-mint-600 text-white p-8 relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-2">Growth Milestone</h4>
                <p className="text-mint-50/70 text-sm font-medium mb-6 leading-relaxed">
                  You've surpassed 500 total sessions this month. Great system health!
                </p>
                <Button className="w-full rounded-xl bg-white text-mint-700 font-bold hover:bg-mint-50">
                  Share Success
                </Button>
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
