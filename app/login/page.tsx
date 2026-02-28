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
    <div className="min-h-screen flex bg-[#f0f0f4] text-zinc-900 relative overflow-hidden selection:bg-blue-200">
      
      {/* Animated Background with Parallax, Grids, and Noise */}
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

      <div className="relative z-10 flex w-full min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-20 relative bg-white/10 backdrop-blur-md border-r border-white/20">
          <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 shadow-sm">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="text-blue-600 p-1">
                <Aperture className="w-12 h-12" />
              </div>
              <span className="text-2xl font-bold tracking-tight">VentureLens</span>
            </div>
            
            <h1 className="text-5xl font-bold tracking-tight leading-tight mb-6">
              Discover and track<br />high-potential startups
            </h1>
            
            <p className="text-lg text-zinc-500 mb-16 leading-relaxed font-medium">
              Advanced company intelligence platform for investors, analysts, and operators. Filter, track, and analyze companies with precision.
            </p>

            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold mb-1">500+</div>
                <div className="text-sm text-zinc-500 font-medium">Companies tracked</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">12</div>
                <div className="text-sm text-zinc-500 font-medium">Sectors covered</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">Real-time</div>
                <div className="text-sm text-zinc-500 font-medium">Signal tracking</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-20 relative bg-white/30 backdrop-blur-2xl">
          <Link href="/" className="lg:hidden absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 shadow-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md w-full mx-auto"
          >
            <h2 className="text-3xl font-bold mb-2">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-zinc-500 mb-8 text-sm font-medium">
              {isLogin ? 'Enter your credentials to continue' : 'Fill in your details to get started'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Full name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/50 border border-zinc-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/50 border border-zinc-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/50 border border-zinc-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Confirm password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/50 border border-zinc-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {error && <div className="text-red-500 text-sm text-center bg-red-50/50 py-2 rounded-lg border border-red-100">{error}</div>}

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-base hover:bg-blue-700 transition-colors mt-2 shadow-lg shadow-blue-600/20"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </motion.button>
            </form>

            <div className="mt-6 text-center text-sm text-zinc-500">
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

            <div className="mt-8 pt-6 border-t border-zinc-200/50 text-center text-xs text-zinc-400 leading-relaxed font-medium">
              Credentials are stored locally in your browser's localStorage. Data persists across sessions but is cleared if you clear browser data.
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
