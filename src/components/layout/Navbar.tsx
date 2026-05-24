import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { getAssetUrl } from '@/lib/utils';

import { 
  Heart, 
  Video,
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  LogIn,
  LayoutDashboard, 
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion, AnimatePresence } from 'motion/react';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const NavLinks = () => {
    const location = useLocation();
    const activePath = location.pathname;

    const navItems = [
      { path: '/', label: 'Home' },
      { path: '/therapists', label: 'Therapists' },
      { path: '/about', label: 'About' },
      { path: '/support', label: 'Support' }
    ];

    const adminItems = [
      { path: '/admin', label: 'Management' },
      { path: '/documentation', label: 'System Docs' }
    ];

    const itemsToRender = user?.role === 'ADMIN' ? adminItems : user?.role === 'THERAPIST' ? [] : navItems;

    return (
      <>
        {itemsToRender.map((item) => {
          const isActive = activePath === item.path;
          return (
            <div key={item.path} className="relative py-2 shrink-0">
              <Link 
                to={item.path} 
                className={`text-[12px] font-bold uppercase tracking-[0.14em] transition-colors duration-300 ${
                  isActive ? 'text-mint-700' : 'text-zinc-600 hover:text-mint-700'
                }`}
              >
                {item.label}
              </Link>
              {isActive && (
                <motion.div 
                  layoutId="nav-underline" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-mint-500 rounded-full hidden md:block"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
            </div>
          );
        })}
      </>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-sage-50/80 backdrop-blur-md border-b border-mint-100/50">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <img 
                src={getAssetUrl('/logo.png')}
                alt="Theramint Logo" 
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  // Fallback if logo not found
                  e.currentTarget.style.display = 'none';
                }}
              />
            </motion.div>
            <div className="flex flex-col leading-none">
              <span className="serif text-xl font-bold text-sage-900">Theramint</span>
              <span className="text-[9px] text-mint-600 font-bold uppercase tracking-[0.2em]">Mindful Care</span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <NavLinks />
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {user.role === 'ADMIN' ? (
                <Link to="/admin">
                  <Button variant="ghost" className="gap-2 text-zinc-900 hover:bg-zinc-100 rounded-xl font-bold bg-zinc-50 border border-zinc-200 shadow-sm transition-all hover:translate-y-[-1px]">
                    <ShieldCheck className="h-4 w-4 text-zinc-600" />
                    Management
                  </Button>
                </Link>
              ) : (
                <Link to="/dashboard">
                  <Button variant="ghost" className="gap-2 text-sage-900 hover:bg-mint-50 rounded-xl font-bold">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              )}
              <div className="h-8 w-px bg-mint-200" />
              <Button onClick={handleLogout} variant="ghost" className="h-10 w-10 p-0 rounded-full hover:bg-rose-50 text-rose-500">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/auth?mode=login">
                <Button variant="outline" className="border-mint-200/85 text-zinc-700 hover:text-mint-700 hover:border-mint-400 hover:bg-mint-50/50 rounded-full h-10 px-5 font-bold flex items-center gap-2 text-xs shadow-sm transition-all duration-300 hover:scale-105 active:scale-95">
                  <LogIn className="h-3.5 w-3.5 text-mint-600" />
                  <span>Log In</span>
                </Button>
              </Link>
              <Link to="/auth?mode=register">
                <Button className="rounded-full px-6 py-5 bg-mint-600 text-white hover:bg-mint-700 flex items-center gap-3 font-bold text-sm shadow-lg shadow-mint-100 border-none transition-all hover:translate-y-[-2px]">
                  Book Now
                  <div className="bg-white/20 rounded-full p-1.5">
                    <Video className="h-3 w-3" />
                  </div>
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger render={
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            } />
            <SheetContent side="right" className="p-0">
              <div className="flex flex-col h-full bg-white p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <img 
                      src={getAssetUrl('/logo.png')}
                      alt="Theramint Logo" 
                      className="h-8 w-8 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span className="serif text-xl font-bold text-sage-900">Theramint</span>
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <NavLinks />
                </div>
                <div className="mt-auto pt-8 border-t">
                  {user ? (
                    <div className="flex flex-col gap-4">
                      {user.role === 'ADMIN' ? (
                        <Link to="/admin" onClick={() => setIsOpen(false)}>
                          <Button className="w-full justify-start gap-2" variant="ghost">
                            <ShieldCheck className="h-4 w-4" />
                            Management
                          </Button>
                        </Link>
                      ) : (
                        <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                          <Button className="w-full justify-start gap-2" variant="ghost">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                          </Button>
                        </Link>
                      )}
                      <Button onClick={handleLogout} className="w-full justify-start gap-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700" variant="ghost">
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <Link to="/auth?mode=login" onClick={() => setIsOpen(false)}>
                        <Button className="w-full border-mint-200 text-zinc-700 hover:text-mint-700 hover:bg-mint-50/55 rounded-xl py-2.5 font-bold flex items-center justify-center gap-2" variant="outline">
                          <LogIn className="h-4 w-4 text-mint-600" />
                          <span>Login</span>
                        </Button>
                      </Link>
                      <Link to="/auth?mode=register" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-mint-600 hover:bg-mint-700 text-white rounded-xl font-bold py-2.5">Book Now</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
