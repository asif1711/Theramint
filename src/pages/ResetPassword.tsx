import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { 
  Heart, 
  ArrowRight, 
  Lock, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reset failed');
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sage-50 p-4">
        <Card className="max-w-md w-full p-8 text-center rounded-[2rem] border-none shadow-xl">
           <h2 className="serif text-2xl font-bold text-sage-900 mb-4">Invalid Link</h2>
           <p className="text-zinc-500 mb-6">The password reset link is missing or invalid.</p>
           <Link to="/auth?mode=login" className="w-full">
             <Button className="w-full rounded-xl bg-mint-600">Go to Login</Button>
           </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-mint-200/40 rounded-full blur-[100px]" />
        <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-mint-100/40 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl z-10"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="bg-mint-100 p-2 rounded-2xl group-hover:bg-mint-200 transition-colors">
              <Heart className="h-8 w-8 text-mint-600 fill-mint-600/20" />
            </div>
            <span className="serif text-3xl font-bold text-sage-900">Theramint</span>
          </Link>
          <h1 className="serif text-4xl font-bold text-sage-900 mb-2 tracking-wide">
            Create New Password
          </h1>
          <p className="text-zinc-500 font-medium tracking-tight">
            Please choose a strong password to secure your account.
          </p>
        </div>

        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white/70 backdrop-blur-xl border border-white/50">
          <CardContent className="p-10">
            {success ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-mint-100 text-mint-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="serif text-2xl font-bold text-sage-900 mb-4">Password Updated</h2>
                <p className="text-zinc-500 mb-8">Your password has been reset successfully. You can now sign in with your new credentials.</p>
                <Link to="/auth?mode=login" className="w-full">
                  <Button className="w-full h-14 bg-mint-600 text-white rounded-[1.5rem] text-sm font-bold shadow-xl shadow-mint-500/20">
                    Back to Sign In
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">New Password</Label>
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

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                    <Input 
                      type="password" 
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                  {loading ? 'Updating...' : 'Reset Password'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
