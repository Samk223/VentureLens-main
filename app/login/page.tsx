'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft, Aperture } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
    // Removed auto-redirect to let user click Sign In
    const currentUserStr = localStorage.getItem('ps_currentUser');
    if (currentUserStr) {
      try {
        const currentUser = JSON.parse(currentUserStr);
        if (currentUser.email) {
          setEmail(currentUser.email);
          // We won't prefill password for security feel, but they can just type it
          // or we can prefill it so they just click "Sign In"
          if (currentUser.password) {
            setPassword(currentUser.password);
          }
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  if (!mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const usersStr = localStorage.getItem('ps_users');
    const users = usersStr ? JSON.parse(usersStr) : [];

    if (isLogin) {
      const user = users.find((u: any) => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem('ps_currentUser', JSON.stringify(user));
        router.push('/companies');
      } else {
        setError('Invalid email or password');
      }
    } else {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (users.some((u: any) => u.email === email)) {
        setError('Email already exists');
        return;
      }
      const newUser = { name, email, password, role: 'Analyst', photo: '' };
      users.push(newUser);
      localStorage.setItem('ps_users', JSON.stringify(users));
      localStorage.setItem('ps_currentUser', JSON.stringify(newUser));
      router.push('/companies');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f0f0f4] text-zinc-900 relative overflow-hidden selection:bg-blue-200">
      
      {/* Animated Background (Full Page) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#f0f0f4]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000015_1px,transparent_1px),linear-gradient(to_bottom,#00000015_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_90%,transparent_100%)] z-10"></div>
        
        <motion.div 
          className="absolute inset-0 flex items-center justify-center z-0 mix-blend-multiply opacity-90"
        >
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="w-[400%] h-[200%] flex gap-8 md:gap-16 transform -rotate-45"
          >
            {[...Array(20)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ opacity: [0.25, 0.6, 0.25] }}
                transition={{ duration: 3 + (i % 4), repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                className={`h-full blur-[32px] ${i % 2 === 0 ? 'w-40 md:w-80 bg-blue-400/80' : 'w-48 md:w-96 bg-indigo-400/80'}`} 
              />
            ))}
          </motion.div>
        </motion.div>

        <svg className="absolute inset-0 w-full h-full opacity-[0.3] mix-blend-overlay pointer-events-none z-20">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Left Side - Branding & Stats (Glassmorphic) */}
      <div className="relative z-10 w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-20 py-20 lg:py-0 bg-white/20 lg:bg-white/10 backdrop-blur-md border-b lg:border-b-0 lg:border-r border-white/30">
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold text-zinc-600 hover:text-zinc-900 transition-colors bg-white/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/40 shadow-sm">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        
        <div className="max-w-md mx-auto lg:mx-0">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="text-blue-600 p-1 bg-white/60 rounded-2xl shadow-sm border border-white/40">
              <Aperture className="w-12 h-12" />
            </div>
            <span className="text-3xl font-bold tracking-tighter">VentureLens</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-6xl font-bold tracking-tighter leading-[1.1] mb-8 text-zinc-900"
          >
            Venture Intelligence,<br />Redefined.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl text-zinc-600 mb-16 leading-relaxed font-medium"
          >
            The most powerful platform for modern investment teams to discover, enrich, and track high-growth startups.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-3 gap-8 border-t border-black/5 pt-10"
          >
            <div>
              <div className="text-3xl font-bold tracking-tighter mb-1">500+</div>
              <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Tracked</div>
            </div>
            <div>
              <div className="text-3xl font-bold tracking-tighter mb-1">12</div>
              <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Sectors</div>
            </div>
            <div>
              <div className="text-3xl font-bold tracking-tighter mb-1">Live</div>
              <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Signals</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Form (Deeper Glassmorphism) */}
      <div className="relative z-10 w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-20 py-20 lg:py-0 bg-white/40 lg:bg-white/20 backdrop-blur-2xl">
        <div className="max-w-md w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/40 backdrop-blur-xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-10"
          >
            <h2 className="text-4xl font-bold mb-3 tracking-tight">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-zinc-600 mb-10 font-medium">
              {isLogin ? 'Enter your credentials to continue' : 'Fill in your details to get started'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2 ml-1">Full name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-4 bg-white/50 border border-white/60 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all shadow-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2 ml-1">Email address</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-white/50 border border-white/60 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2 ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 bg-white/50 border border-white/60 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all shadow-sm pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2 ml-1">Confirm password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-5 py-4 bg-white/50 border border-white/60 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all shadow-sm pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm font-bold text-center bg-red-50/80 backdrop-blur-sm py-3 rounded-xl border border-red-100"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold text-lg hover:bg-black transition-all mt-4 shadow-xl shadow-black/10 active:scale-95"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </motion.button>
            </form>

            <div className="mt-8 text-center text-sm font-medium text-zinc-500">
              {isLogin ? (
                <>
                  Don't have an account?{' '}
                  <button onClick={() => { setIsLogin(false); setError(''); }} className="text-blue-600 font-bold hover:underline">
                    Create account &rarr;
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button onClick={() => { setIsLogin(true); setError(''); }} className="text-blue-600 font-bold hover:underline">
                    Sign in
                  </button>
                </>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-10 text-center text-xs text-zinc-400 font-medium leading-relaxed max-w-[280px] mx-auto"
          >
            Credentials are stored locally in your browser's localStorage for this preview.
          </motion.div>
        </div>
      </div>
    </div>
  );
}
