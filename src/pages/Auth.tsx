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
  Briefcase, 
  Sparkles,
  Leaf,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode') || 'login';
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>((modeParam as 'login' | 'register') || 'login');
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [is2FAMode, setIs2FAMode] = useState(false);
  const [isVerifyMode, setIsVerifyMode] = useState(modeParam === 'verify');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'CLIENT' | 'THERAPIST'>('CLIENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [demoToken, setDemoToken] = useState<string | null>(null);

  React.useEffect(() => {
    if (modeParam === 'verify') {
      const token = searchParams.get('token');
      if (token) {
         handleVerifyEmail(token);
      }
    }
  }, [modeParam, searchParams]);

  React.useEffect(() => {
    if (modeParam === 'login' || modeParam === 'register') {
      setMode(modeParam as 'login' | 'register');
    }
  }, [modeParam]);

  const apiFetch = async (url: string, options: RequestInit) => {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      if (!res.ok) {
        const text = await res.text();
        console.error(`Non-JSON error from ${url}:`, text);
        throw new Error(`Server error (${res.status})`);
      }
      throw new Error('Invalid server response format');
    }

    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setMessage(data.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (token: string) => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      setMessage(data.message);
      setMode('login');
      setIsVerifyMode(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: twoFactorCode }),
      });
      window.location.href = data.user.role === 'ADMIN' ? '/admin' : '/dashboard';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const data = await apiFetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setMessage(data.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === 'login') {
        const data = await apiFetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (data.twoFactorRequired) {
          setIs2FAMode(true);
          setMessage(data.message);
          return;
        }

        window.location.href = data.user.role === 'ADMIN' ? '/admin' : '/dashboard';
      } else {
        const data = await apiFetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, fullName, role }),
        });
        
        setMessage(data.message);
        setMode('login');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-sage-50 py-4 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg z-10"
      >
        <div className="text-center mb-4">
          <h1 className="serif text-3xl font-bold text-sage-900 mb-1.5 tracking-wide">
            {is2FAMode ? 'Verify Identity' : (isForgotMode ? 'Reset Password' : (mode === 'login' ? 'Welcome Back' : 'Start Your Journey'))}
          </h1>
          <p className="text-sm text-zinc-500 font-normal leading-relaxed mt-1">
            {is2FAMode ? 'Enter the security code sent to your email.' : (isForgotMode ? 'Enter your email and we\'ll assist you with access.' : 'Connecting you to mindful mental healthcare professionals.')}
          </p>
        </div>

        <Card className="border-none shadow-2xl shadow-mint-200/20 rounded-[2rem] overflow-hidden bg-white/70 backdrop-blur-xl border border-white/50">
          {!isForgotMode && !is2FAMode && (
            <div className="p-1.5 flex h-14 bg-sage-100/50 border-b border-zinc-100/30">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 rounded-[1.5rem] font-bold text-xs transition-all ${mode === 'login' ? 'bg-white text-mint-700 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('register')}
                className={`flex-1 rounded-[1.5rem] font-bold text-xs transition-all ${mode === 'register' ? 'bg-white text-mint-700 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                Join Theramint
              </button>
            </div>
          )}

          <CardContent className="p-6 md:p-8">
            {is2FAMode ? (
              <form onSubmit={handle2FASubmit} className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">6-Digit Code</Label>
                  <Input 
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="h-20 text-center text-4xl font-black tracking-[0.5em] rounded-2xl border-zinc-100"
                    required
                  />
                  <p className="text-[10px] text-zinc-400 text-center font-medium">Haven't received it? Check your spam folder.</p>
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
                  className="w-full h-14 bg-mint-600 text-white rounded-[1.5rem] text-sm font-bold hover:bg-mint-700 transition-all shadow-xl shadow-mint-500/20"
                >
                  {loading ? 'Verifying...' : 'Complete Sign In'}
                </Button>

                <button 
                  type="button"
                  onClick={() => setIs2FAMode(false)}
                  className="w-full text-xs font-bold text-zinc-400 hover:text-zinc-600 transition-colors py-2"
                >
                   Try another account
                </button>
              </form>
            ) : isForgotMode ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                 <div className="space-y-2">
                  <Label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input 
                      type="email" 
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 pl-12 rounded-xl bg-white border-zinc-100 focus:ring-mint-500 shadow-sm"
                    />
                  </div>
                </div>

                {message && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-mint-50 text-mint-700 text-sm p-4 rounded-xl font-bold flex flex-col gap-2 border border-mint-100"
                  >
                    <div className="flex items-center gap-2">
                       <Sparkles className="h-4 w-4" />
                       {message}
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-rose-50 text-rose-600 text-sm p-4 rounded-xl font-bold flex items-center gap-2 border border-rose-100"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      {error}
                    </div>
                  </motion.div>
                )}

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-12 bg-mint-600 text-white rounded-xl text-sm font-bold hover:bg-mint-700 transition-all shadow-md shadow-mint-500/20 flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? 'Sending...' : 'Send Recovery Link'}
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <button 
                  type="button"
                  onClick={() => setIsForgotMode(false)}
                  className="w-full text-xs font-bold text-zinc-400 hover:text-zinc-600 transition-colors py-2"
                >
                   Back to Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                  {mode === 'register' && (
                    <motion.div
                      key="register-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Full Name</Label>
                        <div className="relative">
                          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                          <Input 
                            placeholder="Your complete name" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="h-12 pl-12 rounded-xl bg-white border-zinc-100 focus:ring-mint-500 shadow-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setRole('CLIENT')}
                          className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${role === 'CLIENT' ? 'border-mint-500 bg-mint-50/50 text-mint-700' : 'border-zinc-100 bg-zinc-50/30 text-zinc-400 hover:border-zinc-200'}`}
                        >
                          <UserIcon className="h-5 w-5" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Patient</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole('THERAPIST')}
                          className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${role === 'THERAPIST' ? 'border-mint-500 bg-mint-50/50 text-mint-700' : 'border-zinc-100 bg-zinc-50/30 text-zinc-400 hover:border-zinc-200'}`}
                        >
                          <Briefcase className="h-5 w-5" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Therapist</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input 
                      type="email" 
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 pl-12 rounded-xl bg-white border-zinc-100 focus:ring-mint-500 shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <Label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Password</Label>
                    {mode === 'login' && (
                      <button 
                        type="button" 
                        onClick={() => setIsForgotMode(true)}
                        className="text-xs font-bold text-mint-600 hover:text-mint-700"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input 
                      type="password" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 pl-12 rounded-xl bg-white border-zinc-100 focus:ring-mint-500 shadow-sm"
                    />
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-rose-50 text-rose-600 text-sm p-4 rounded-xl font-bold flex flex-col gap-3 border border-rose-100"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      {error}
                    </div>
                    {error.toLowerCase().includes('not verified') && (
                      <Button 
                        type="button" 
                        onClick={handleResendVerification}
                        className="bg-rose-600 text-white h-10 rounded-xl text-[10px] uppercase tracking-widest hover:bg-rose-700 w-full flex items-center justify-center gap-2 shadow-sm"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Resend Verification Email
                      </Button>
                    )}
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
            )}
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
