import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Heart, 
  ArrowRight, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  Briefcase, 
  GraduationCap,
  Sparkles,
  Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode') || 'login';
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(modeParam as 'login' | 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'CLIENT' | 'THERAPIST'>('CLIENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({ email, password, fullName, role });
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-48 -left-48 w-96 h-96 bg-mint-200/40 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-48 -right-48 w-96 h-96 bg-mint-100/40 rounded-full blur-[100px]" 
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl z-10"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="bg-mint-100 p-2 rounded-2xl group-hover:bg-mint-200 transition-colors">
              <Heart className="h-8 w-8 text-mint-600 fill-mint-600/20" />
            </div>
            <span className="serif text-3xl font-bold text-sage-900">Theramint</span>
          </Link>
          <h1 className="serif text-4xl font-bold text-sage-900 mb-2">
            {mode === 'login' ? 'Welcome back' : 'Start your journey'}
          </h1>
          <p className="text-zinc-500 font-medium tracking-tight">
            Connecting you to mindful mental healthcare professionals.
          </p>
        </div>

        <Card className="border-none shadow-2xl shadow-mint-200/30 rounded-[2.5rem] overflow-hidden bg-white/70 backdrop-blur-xl border border-white/50">
          <div className="p-1.5 flex h-16 bg-sage-100/50">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 rounded-[2rem] font-bold text-sm transition-all ${mode === 'login' ? 'bg-white text-mint-700 shadow-lg' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 rounded-[2rem] font-bold text-sm transition-all ${mode === 'register' ? 'bg-white text-mint-700 shadow-lg' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              Join Theramint
            </button>
          </div>

          <CardContent className="p-10 pt-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {mode === 'register' && (
                  <motion.div
                    key="register-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Full Name</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                        <Input 
                          placeholder="Your complete name" 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          className="h-14 pl-12 rounded-2xl bg-white border-zinc-100 focus:ring-mint-500 shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setRole('CLIENT')}
                        className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${role === 'CLIENT' ? 'border-mint-500 bg-mint-50 text-mint-700' : 'border-zinc-100 bg-zinc-50/50 text-zinc-400 hover:border-zinc-200'}`}
                      >
                        <UserIcon className="h-6 w-6" />
                        <span className="text-xs font-bold uppercase">Patient</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('THERAPIST')}
                        className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${role === 'THERAPIST' ? 'border-mint-500 bg-mint-50 text-mint-700' : 'border-zinc-100 bg-zinc-50/50 text-zinc-400 hover:border-zinc-200'}`}
                      >
                        <Briefcase className="h-6 w-6" />
                        <span className="text-xs font-bold uppercase">Therapist</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                  <Input 
                    type="email" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-14 pl-12 rounded-2xl bg-white border-zinc-100 focus:ring-mint-500 shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <Label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Password</Label>
                  {mode === 'login' && (
                    <button type="button" className="text-xs font-bold text-mint-600 hover:text-mint-700">Forgot?</button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                  <Input 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-14 pl-12 rounded-2xl bg-white border-zinc-100 focus:ring-mint-500 shadow-sm"
                  />
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-rose-50 text-rose-600 text-sm p-4 rounded-xl font-bold flex items-center gap-2 border border-rose-100"
                >
                  <Sparkles className="h-4 w-4" />
                  {error}
                </motion.div>
              )}

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 bg-mint-600 text-white rounded-[1.5rem] text-sm font-bold hover:bg-mint-700 transition-all shadow-xl shadow-mint-500/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                   <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                   />
                ) : (
                  <>
                    {mode === 'login' ? 'Sign Into Workspace' : 'Create My Account'}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <div className="px-10 pb-10 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4 w-full">
              <div className="h-px bg-zinc-100 flex-1" />
              <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest px-2">Trust Badges</span>
              <div className="h-px bg-zinc-100 flex-1" />
            </div>
            <div className="flex justify-center gap-8 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700">
               <ShieldCheck className="h-8 w-8 text-zinc-900" />
               <Leaf className="h-8 w-8 text-zinc-900" />
               <Sparkles className="h-8 w-8 text-zinc-900" />
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
