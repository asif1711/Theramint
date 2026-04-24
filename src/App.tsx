import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Heart } from 'lucide-react';

// Lazy load pages for performance
import Home from './pages/Home';
import Auth from './pages/Auth';
import Therapists from './pages/Therapists';
import TherapistDetails from './pages/TherapistDetails';
import Dashboard from './pages/Dashboard';
import Support from './pages/Support';
import Documentation from './pages/Documentation';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/auth?mode=login" />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/therapists" element={<Therapists />} />
              <Route path="/therapists/:id" element={<TherapistDetails />} />
              <Route path="/support" element={<Support />} />
              <Route path="/documentation" element={<Documentation />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Redirect any unknown route to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <footer className="bg-sage-100 border-t border-mint-200 pt-24 pb-12 overflow-hidden relative">
            <div className="container mx-auto px-4 md:px-8 relative z-10">
              <div className="grid md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-2">
                  <div className="flex items-center gap-2 mb-6 group">
                    <Heart className="h-6 w-6 text-mint-600 fill-mint-600/20" />
                    <span className="serif text-2xl font-bold text-sage-900">Theramint</span>
                  </div>
                  <p className="text-zinc-500 max-w-sm mb-6 leading-relaxed font-medium">
                    Connecting individuals with certified mental health professionals through a modern, secure, and compassionate digital ecosystem designed for holistic well-being.
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-sage-900 uppercase tracking-[0.2em] mb-6">Explore</h4>
                  <ul className="space-y-4">
                    <li><Link to="/therapists" className="text-zinc-500 hover:text-mint-700 font-medium transition-colors">Find a Therapist</Link></li>
                    <li><Link to="/about" className="text-zinc-500 hover:text-mint-700 font-medium transition-colors">Our Approach</Link></li>
                    <li><Link to="/support" className="text-zinc-500 hover:text-mint-700 font-medium transition-colors">Help Center</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-sage-900 uppercase tracking-[0.2em] mb-6">Social Interaction</h4>
                  <ul className="space-y-4">
                    <li><a href="#" className="text-zinc-500 hover:text-mint-700 font-medium transition-colors">Instagram</a></li>
                    <li><a href="#" className="text-zinc-500 hover:text-mint-700 font-medium transition-colors">LinkedIn</a></li>
                    <li><a href="#" className="text-zinc-500 hover:text-mint-700 font-medium transition-colors">Twitter X</a></li>
                  </ul>
                </div>
              </div>
              <div className="pt-8 border-t border-mint-200 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-400 text-[11px] font-bold uppercase tracking-widest">
                <p>© 2026 Theramint Online Therapy. Mindful Care Ecosystem.</p>
                <div className="flex gap-8">
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
