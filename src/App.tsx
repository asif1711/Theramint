import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import ScrollToTop from './components/layout/ScrollToTop';
import { Heart, Instagram, Linkedin, Twitter } from 'lucide-react';

// Lazy load pages for performance
import Home from './pages/Home';
import Auth from './pages/Auth';
import Therapists from './pages/Therapists';
import TherapistDetails from './pages/TherapistDetails';
import Dashboard from './pages/Dashboard';
import TherapistDashboard from './pages/TherapistDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Support from './pages/Support';
import Documentation from './pages/Documentation';
import ResetPassword from './pages/ResetPassword';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen w-screen flex items-center justify-center font-bold text-mint-600 uppercase tracking-widest text-xs">Initializing Session...</div>;
  if (!user) return <Navigate to="/auth?mode=login" />;
  
  // Role based access for standard dashboard
  if (user.role === 'ADMIN') return <Navigate to="/admin" />;
  
  return <>{children}</>;
}

function RoleBasedDashboard() {
  const { user } = useAuth();
  if (user?.role === 'THERAPIST') return <TherapistDashboard />;
  if (user?.role === 'ADMIN') return <Navigate to="/admin" />;
  return <Dashboard />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen w-screen flex items-center justify-center font-bold text-mint-600 uppercase tracking-widest text-xs">Verifying Credentials...</div>;
  if (!user || user.role !== 'ADMIN') return <Navigate to="/" />;
  return <>{children}</>;
}

function PublicOnlyRoute({ children, exclusive = false }: { children: React.ReactNode, exclusive?: boolean }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  
  // Admin shouldn't see normal pages if requested
  if (user?.role === 'ADMIN' && exclusive) return <Navigate to="/admin" />;
  if (user?.role === 'THERAPIST' && exclusive) return <Navigate to="/dashboard" />;
  
  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/therapists" element={<PublicOnlyRoute exclusive><Therapists /></PublicOnlyRoute>} />
              <Route path="/therapists/:id" element={<PublicOnlyRoute exclusive><TherapistDetails /></PublicOnlyRoute>} />
              <Route path="/support" element={<PublicOnlyRoute exclusive><Support /></PublicOnlyRoute>} />
              <Route 
                path="/documentation" 
                element={
                  <AdminRoute>
                    <Documentation />
                  </AdminRoute>
                } 
              />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <RoleBasedDashboard />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />

              {/* Redirect any unknown route to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <footer className="bg-sage-100 border-t border-mint-200 pt-12 pb-8 overflow-hidden relative">
            <div className="container mx-auto px-4 md:px-8 relative z-10">
              <div className="grid md:grid-cols-4 gap-8 mb-8">
                <div className="col-span-2">
                  <div className="flex items-center gap-2 mb-4 group">
                    <img 
                      src="/logo.png" 
                      alt="Theramint Logo" 
                      className="h-10 w-10 object-contain"
                    />
                    <span className="serif text-xl font-bold text-sage-900">Theramint</span>
                  </div>
                  <p className="text-zinc-500 max-w-sm mb-4 leading-relaxed text-sm font-medium">
                    Connecting individuals with certified mental health professionals through a modern, secure, and compassionate digital ecosystem designed for holistic well-being.
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-sage-900 uppercase tracking-[0.2em] mb-4">Explore</h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link to="/therapists" className="text-zinc-500 hover:text-mint-700 font-medium transition-colors">Find a Therapist</Link></li>
                    <li><Link to="/about" className="text-zinc-500 hover:text-mint-700 font-medium transition-colors">Our Approach</Link></li>
                    <li><Link to="/support" className="text-zinc-500 hover:text-mint-700 font-medium transition-colors">Help Center</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-sage-900 uppercase tracking-[0.2em] mb-4">Social Interaction</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="#" className="text-zinc-500 hover:text-mint-700 font-medium transition-colors flex items-center gap-2 group/link">
                        <Instagram className="h-4 w-4 text-zinc-400 group-hover/link:text-mint-600 transition-colors" />
                        <span>Instagram</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-zinc-500 hover:text-mint-700 font-medium transition-colors flex items-center gap-2 group/link">
                        <Linkedin className="h-4 w-4 text-zinc-400 group-hover/link:text-mint-600 transition-colors" />
                        <span>LinkedIn</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-zinc-500 hover:text-mint-700 font-medium transition-colors flex items-center gap-2 group/link">
                        <Twitter className="h-4 w-4 text-zinc-400 group-hover/link:text-mint-600 transition-colors" />
                        <span>Twitter X</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="pt-6 border-t border-mint-200 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                <p className="font-display font-medium text-sm md:text-base normal-case tracking-normal text-zinc-500">© 2026 Theramint Online Therapy</p>
                <div className="flex gap-6">
                  <a href="#" className="hover:text-sage-900 transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-sage-900 transition-colors">Terms of Service</a>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-mint-200/20 rounded-full blur-[100px]" />
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}
