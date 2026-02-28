'use client';

import Link from 'next/link';
import { 
  ArrowRight, Sparkles, Filter, FileText, Download, 
  CheckCircle2, Zap, Users, BarChart3, Globe, Mail, MessageSquare, Check, Shield, Lock,
  Search, Command, Aperture
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState } from 'react';

const smoothEase = [0.16, 1, 0.3, 1];

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax transforms
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yMockup = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Contact Form State
  const [contactForm, setContactForm] = useState({ firstName: '', lastName: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Demo Form State
  const [demoEmail, setDemoEmail] = useState('');
  const [demoStatus, setDemoStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Toast State
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.firstName || !contactForm.lastName || !contactForm.email || !contactForm.message) return;
    
    setContactStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      if (res.ok) {
        setContactStatus('success');
        setContactForm({ firstName: '', lastName: '', email: '', message: '' });
        showToast('Message sent! Check your email for confirmation.');
      } else {
        setContactStatus('error');
        showToast('Failed to send message.');
      }
    } catch (error) {
      setContactStatus('error');
      showToast('An error occurred.');
    }
  };

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoEmail) return;

    setDemoStatus('loading');
    try {
      const res = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail }),
      });
      if (res.ok) {
        setDemoStatus('success');
        setDemoEmail('');
        showToast('Demo invitation sent! Check your email.');
      } else {
        setDemoStatus('error');
        showToast('Failed to send invitation.');
      }
    } catch (error) {
      setDemoStatus('error');
      showToast('An error occurred.');
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f0f0f4] text-zinc-900 selection:bg-blue-200 font-sans relative overflow-x-hidden">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-zinc-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Animated Background with Parallax, Grids, and Noise */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#f0f0f4]">
        {/* Prominent Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000015_1px,transparent_1px),linear-gradient(to_bottom,#00000015_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_90%,transparent_100%)] z-10"></div>
        
        {/* Diagonal Stripes Animation (Balanced Prominence) */}
        <motion.div 
          style={{ y: yBg }}
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

        {/* Noise Overlay for texture */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.3] mix-blend-overlay pointer-events-none z-20">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Floating Glassmorphic Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none">
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: smoothEase }}
          className="pointer-events-auto flex items-center p-1.5 bg-white/60 backdrop-blur-2xl border border-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-full"
        >
          <div className="flex items-center gap-1 px-2 sm:px-4">
            <Link href="#features" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 px-4 py-2 rounded-full hover:bg-black/5 transition-all duration-300">Features</Link>
            <Link href="#pricing" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 px-4 py-2 rounded-full hover:bg-black/5 transition-all duration-300">Pricing</Link>
            <Link href="#contact" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 px-4 py-2 rounded-full hover:bg-black/5 transition-all duration-300">Contact</Link>
            <Link href="/login" className="hidden sm:block text-sm font-medium text-zinc-600 hover:text-zinc-900 px-4 py-2 rounded-full hover:bg-black/5 transition-all duration-300">Sign In</Link>
          </div>
          <Link href="#demo-section" className="bg-zinc-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-black transition-all duration-300 shrink-0 ml-1 hover:shadow-lg hover:shadow-zinc-900/20 active:scale-95">
            Book a demo
          </Link>
        </motion.nav>
      </div>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 md:pt-40 md:pb-32 flex flex-col items-center">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto relative z-10 w-full">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: smoothEase }}
            className="text-6xl md:text-[5.5rem] font-display font-bold tracking-tighter leading-[1.05] mb-8 text-zinc-900"
          >
            Venture Intelligence,<br />Accelerated by AI.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
            className="text-xl md:text-2xl text-zinc-500 mb-12 max-w-3xl leading-relaxed font-medium tracking-tight"
          >
            Discover, enrich, and track high-growth startups in seconds. Built for modern investment teams who demand precision.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: smoothEase }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-20"
          >
            <Link href="/login" className="group flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] active:scale-95">
              Start Scouting <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link href="#features" className="flex items-center gap-2 bg-white text-zinc-900 border border-zinc-200 shadow-sm px-8 py-4 rounded-full font-bold text-lg hover:bg-zinc-50 transition-all duration-300 active:scale-95">
              Explore Platform
            </Link>
          </motion.div>
        </div>

        {/* Raycast-style Command Palette Mockup (Reverted to Image Version) */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: smoothEase }}
          className="relative w-full max-w-3xl rounded-2xl border border-zinc-200/80 bg-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] overflow-hidden text-left z-20"
        >
          <div className="flex items-center px-6 py-5 border-b border-zinc-100">
            <Search className="w-5 h-5 text-zinc-400 mr-4" />
            <span className="text-zinc-500 text-lg font-medium">Enrich company or search signals...</span>
          </div>
          <div className="p-2">
            <div className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em]">Suggestions</div>
            
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-blue-50/50 cursor-pointer mb-1">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <Sparkles className="w-5 h-5 text-white"/>
                </div>
                <div>
                  <div className="text-blue-900 font-bold text-base">Analyze Stripe</div>
                  <div className="text-blue-600/70 text-sm font-medium">Extract summary, tech stack, and signals from stripe.com</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-100/80 px-2.5 py-1.5 rounded-lg border border-blue-200/50">
                <Command className="w-3 h-3 text-blue-700"/>
                <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">Enter</span>
              </div>
            </div>

            <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-zinc-50 cursor-pointer transition-colors mb-1 group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center group-hover:bg-white transition-colors">
                  <Filter className="w-5 h-5 text-zinc-500"/>
                </div>
                <div>
                  <div className="text-zinc-800 font-bold text-base">Filter Startups</div>
                  <div className="text-zinc-500 text-sm font-medium">Show Series A companies in San Francisco</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-zinc-50 cursor-pointer transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center group-hover:bg-white transition-colors">
                  <Download className="w-5 h-5 text-zinc-500"/>
                </div>
                <div>
                  <div className="text-zinc-800 font-bold text-base">Generate Tear-sheet</div>
                  <div className="text-zinc-500 text-sm font-medium">Export Vercel profile to PDF</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Trusted By Section (Infinite Marquee) */}
      <section className="relative z-10 py-16 border-y border-zinc-200/50 bg-white/40 backdrop-blur-md overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center mb-12">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-bold text-zinc-400 uppercase tracking-[0.2em]"
          >
            Trusted by analysts at leading funds
          </motion.p>
        </div>
        
        <div className="relative flex items-center">
          {/* Gradient Masks for smooth edge fading */}
          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#f0f0f4] to-transparent z-20 pointer-events-none hidden md:block"></div>
          <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#f0f0f4] to-transparent z-20 pointer-events-none hidden md:block"></div>
          
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex flex-nowrap gap-16 md:gap-32 items-center whitespace-nowrap opacity-40 grayscale hover:opacity-70 transition-opacity duration-700"
          >
            {/* Triple the items to ensure the marquee never shows a gap on wide screens */}
            {[...Array(3)].map((_, groupIdx) => (
              <div key={groupIdx} className="flex items-center gap-16 md:gap-32">
                {['Sequoia', 'Andreessen Horowitz', 'Lightspeed', 'Founders Fund', 'Index Ventures'].map((name, i) => (
                  <span 
                    key={`${groupIdx}-${i}`} 
                    className="text-2xl md:text-4xl font-bold tracking-tighter text-zinc-900 select-none"
                  >
                    {name}
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section (Clean Raycast-style Bento Grid) */}
      <section id="features" className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 md:text-center max-w-3xl md:mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter text-zinc-900 mb-6">Everything you need to build your thesis.</h2>
            <p className="text-xl text-zinc-500 leading-relaxed tracking-tight">Stop manually scraping websites and building spreadsheets. VentureLens automates your entire research workflow with beautiful precision.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Feature 1: AI Enrichment */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="bg-white p-8 rounded-[2rem] border border-zinc-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] md:col-span-2 lg:col-span-2 lg:row-span-2 flex flex-col group"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 ease-out">
                <Sparkles className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-3xl font-display font-bold tracking-tight text-zinc-900 mb-4">Live AI Enrichment</h3>
              <p className="text-lg text-zinc-500 leading-relaxed mb-8 flex-grow tracking-tight">
                Don't wait for pitch decks. Extract summaries, tech stacks, and derived signals instantly from any company website using Gemini AI.
              </p>
              
              <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 mb-8">
                <ul className="space-y-4">
                  {['Instant website parsing', 'Automated keyword extraction', 'Thesis alignment scoring'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-base font-medium text-zinc-700">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-zinc-100 flex items-center justify-between mt-auto">
                <div>
                  <div className="text-4xl font-bold text-zinc-900 tracking-tighter">15+</div>
                  <div className="text-sm font-bold text-zinc-400 uppercase tracking-wider mt-1">Hours saved / week</div>
                </div>
                <div className="w-14 h-14 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-zinc-400" />
                </div>
              </div>
            </motion.div>

            {/* Feature 2: Advanced Filtering */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.6, delay: 0.1, ease: smoothEase }}
              className="bg-zinc-900 p-8 rounded-[2rem] border border-zinc-800 shadow-xl text-white md:col-span-1 lg:col-span-2 flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:scale-150 transition-transform duration-1000 ease-out"></div>
              <div>
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10 relative z-10 group-hover:scale-110 transition-transform duration-500 ease-out">
                  <Filter className="w-7 h-7 text-zinc-200" />
                </div>
                <h3 className="text-2xl font-display font-bold tracking-tight mb-4 relative z-10">Advanced Filtering</h3>
                <p className="text-lg text-zinc-400 leading-relaxed mb-8 relative z-10 tracking-tight">
                  Cut through the noise. Filter by stage, sector, and location, and save your thesis-driven searches for later.
                </p>
              </div>
              <div className="pt-6 border-t border-zinc-800 flex items-center justify-between relative z-10">
                <div>
                  <div className="text-3xl font-bold text-white tracking-tighter">50+</div>
                  <div className="text-sm font-bold text-zinc-500 uppercase tracking-wider mt-1">Data points / company</div>
                </div>
              </div>
            </motion.div>

            {/* Feature 3: Analyst Workspaces */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.6, delay: 0.2, ease: smoothEase }}
              className="bg-white p-8 rounded-[2rem] border border-zinc-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 ease-out">
                  <FileText className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-display font-bold tracking-tight text-zinc-900 mb-4">Analyst Workspaces</h3>
                <p className="text-zinc-500 leading-relaxed mb-8 tracking-tight">
                  Create custom lists, track recent signals, and write private notes directly on company profiles.
                </p>
              </div>
              <div className="pt-6 border-t border-zinc-100">
                <div className="text-3xl font-bold text-zinc-900 tracking-tighter">∞</div >
                <div className="text-sm font-bold text-zinc-400 uppercase tracking-wider mt-1">Custom lists</div>
              </div>
            </motion.div>

            {/* Feature 4: Exportable Intelligence */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.6, delay: 0.3, ease: smoothEase }}
              className="bg-white p-8 rounded-[2rem] border border-zinc-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 ease-out">
                  <Download className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-2xl font-display font-bold tracking-tight text-zinc-900 mb-4">Exportable Intel</h3>
                <p className="text-zinc-500 leading-relaxed mb-8 tracking-tight">
                  Generate clean, professional PDF tear-sheets for your Monday partner meetings with a single click.
                </p>
              </div>
              <div className="pt-6 border-t border-zinc-100">
                <div className="text-3xl font-bold text-zinc-900 tracking-tighter">1-Click</div>
                <div className="text-sm font-bold text-zinc-400 uppercase tracking-wider mt-1">PDF Generation</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-32 bg-white border-y border-zinc-200/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter text-zinc-900 mb-6">Simple, transparent pricing.</h2>
            <p className="text-xl text-zinc-500 tracking-tight">Choose the plan that fits your firm's needs. Upgrade or downgrade at any time.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {/* Starter Plan */}
            <motion.div 
              whileHover={{ y: -8 }}
              transition={{ duration: 0.5, ease: smoothEase }}
              className="bg-zinc-50 border border-zinc-200/80 rounded-[2.5rem] p-10 flex flex-col"
            >
              <h3 className="text-2xl font-display font-bold tracking-tight text-zinc-900 mb-3">Starter</h3>
              <p className="text-zinc-500 text-base mb-8 h-12 tracking-tight">Perfect for individual analysts building their initial thesis.</p>
              <div className="mb-8">
                <span className="text-5xl font-bold tracking-tighter text-zinc-900">$0</span>
                <span className="text-zinc-400 font-medium">/month</span>
              </div>
              <ul className="space-y-5 mb-10 flex-1">
                {['50 searches per month', 'Basic filtering', 'Create up to 3 lists', 'Community support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-4 text-base text-zinc-700 font-medium tracking-tight">
                    <div className="w-6 h-6 rounded-full bg-zinc-200/50 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-zinc-500" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/login" className="w-full py-4 px-6 bg-white border border-zinc-200 text-zinc-900 rounded-2xl font-bold text-center hover:bg-zinc-50 transition-all duration-300 shadow-sm active:scale-95">
                Get Started
              </Link>
            </motion.div>

            {/* Pro Plan (Highlighted) */}
            <motion.div 
              whileHover={{ y: -8 }}
              transition={{ duration: 0.5, ease: smoothEase }}
              className="bg-zinc-900 rounded-[2.5rem] p-10 shadow-2xl shadow-blue-900/10 flex flex-col relative transform md:-translate-y-8 border border-zinc-800"
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg shadow-blue-600/30">
                Most Popular
              </div>
              <h3 className="text-2xl font-display font-bold tracking-tight text-white mb-3 mt-2">Pro</h3>
              <p className="text-zinc-400 text-base mb-8 h-12 tracking-tight">For active investors who need deep, automated intelligence.</p>
              <div className="mb-8">
                <span className="text-5xl font-bold tracking-tighter text-white">$49</span>
                <span className="text-zinc-500 font-medium">/month</span>
              </div>
              <ul className="space-y-5 mb-10 flex-1">
                {['Unlimited searches', 'Live AI Enrichment', 'Unlimited lists & notes', 'PDF Tear-sheet exports', 'Priority support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-4 text-base text-zinc-300 font-medium tracking-tight">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/login" className="w-full py-4 px-6 bg-blue-600 text-white rounded-2xl font-bold text-center hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-600/20 active:scale-95">
                Start 14-Day Trial
              </Link>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div 
              whileHover={{ y: -8 }}
              transition={{ duration: 0.5, ease: smoothEase }}
              className="bg-zinc-50 border border-zinc-200/80 rounded-[2.5rem] p-10 flex flex-col"
            >
              <h3 className="text-2xl font-display font-bold tracking-tight text-zinc-900 mb-3">Enterprise</h3>
              <p className="text-zinc-500 text-base mb-8 h-12 tracking-tight">For entire funds needing custom integrations and scale.</p>
              <div className="mb-8">
                <span className="text-5xl font-bold tracking-tighter text-zinc-900">Custom</span>
              </div>
              <ul className="space-y-5 mb-10 flex-1">
                {['Everything in Pro', 'API Access', 'Custom CRM integrations', 'SSO / SAML', 'Dedicated account manager'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-4 text-base text-zinc-700 font-medium tracking-tight">
                    <div className="w-6 h-6 rounded-full bg-zinc-200/50 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-zinc-500" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="#contact" className="w-full py-4 px-6 bg-white border border-zinc-200 text-zinc-900 rounded-2xl font-bold text-center hover:bg-zinc-50 transition-all duration-300 shadow-sm active:scale-95">
                Contact Sales
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter text-zinc-900 mb-6">Get in touch</h2>
              <p className="text-xl text-zinc-500 mb-12 max-w-md leading-relaxed tracking-tight">
                Have questions about our Enterprise plan or want to see a custom demo? Our team is ready to help.
              </p>
              
              <div className="space-y-8">
                <motion.div whileHover={{ x: 8 }} transition={{ ease: smoothEase }} className="flex items-center gap-6 cursor-pointer group">
                  <div className="w-16 h-16 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:border-blue-200 transition-colors duration-300">
                    <Mail className="w-7 h-7 text-zinc-400 group-hover:text-blue-600 transition-colors duration-300" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-zinc-900">Email us</div>
                    <div className="text-zinc-500 font-medium">hello@venturelens.com</div>
                  </div>
                </motion.div>
                <motion.div whileHover={{ x: 8 }} transition={{ ease: smoothEase }} className="flex items-center gap-6 cursor-pointer group">
                  <div className="w-16 h-16 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:border-blue-200 transition-colors duration-300">
                    <Globe className="w-7 h-7 text-zinc-400 group-hover:text-blue-600 transition-colors duration-300" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-zinc-900">Office</div>
                    <div className="text-zinc-500 font-medium">New Delhi, India</div>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="bg-white border border-zinc-200/80 rounded-[2.5rem] p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden"
            >
              <form className="space-y-6 relative z-10" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-zinc-800 mb-2">First Name</label>
                    <input 
                      type="text" 
                      required
                      value={contactForm.firstName}
                      onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
                      className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300" 
                      placeholder="Jane" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-800 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      required
                      value={contactForm.lastName}
                      onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
                      className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300" 
                      placeholder="Doe" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-800 mb-2">Work Email</label>
                  <input 
                    type="email" 
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300" 
                    placeholder="jane@fund.com" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-800 mb-2">Message</label>
                  <textarea 
                    rows={4} 
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none transition-all duration-300" 
                    placeholder="How can we help?"
                  ></textarea>
                </div>
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={contactStatus === 'loading'}
                  className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold text-lg hover:bg-black transition-colors duration-300 mt-2 disabled:opacity-70"
                >
                  {contactStatus === 'loading' ? 'Sending...' : 'Send Message'}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer (Rounded Card Design) */}
      <div className="relative z-10 px-4 pb-4 sm:px-6 sm:pb-6">
        <footer className="relative bg-[#0a0a0a] rounded-[3rem] overflow-hidden border border-zinc-800 shadow-2xl">
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          
          {/* Subtle Glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-8 py-20 md:px-16 md:py-24">
            {/* Top CTA Section */}
            <div id="demo-section" className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-24 scroll-mt-32">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-medium text-zinc-400 mb-3 tracking-tight">Try VentureLens</h2>
                <p className="text-5xl md:text-6xl font-display font-bold text-white tracking-tighter">Schedule your demo today</p>
              </div>
              <div className="w-full lg:w-auto">
                <form className="flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-2 w-full max-w-lg transition-all duration-500 focus-within:bg-white/10 focus-within:border-white/20" onSubmit={handleDemoSubmit}>
                  <input 
                    type="email" 
                    required
                    value={demoEmail}
                    onChange={(e) => setDemoEmail(e.target.value)}
                    placeholder="Enter your work email" 
                    className="flex-1 bg-transparent px-6 py-3 text-white placeholder:text-zinc-500 focus:outline-none text-base [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]" 
                  />
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    type="submit" 
                    disabled={demoStatus === 'loading'}
                    className="bg-white text-zinc-900 px-8 py-3.5 rounded-full text-base font-bold hover:bg-zinc-200 transition-colors disabled:opacity-70"
                  >
                    {demoStatus === 'loading' ? 'Sending...' : 'Book a demo'}
                  </motion.button>
                </form>
              </div>
            </div>

            {/* Middle Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
              {/* Brand & Badges */}
              <div className="lg:col-span-4 flex flex-col justify-between">
                <div className="flex items-center gap-3 mb-12">
                  <div className="text-blue-500 p-1">
                    <Aperture className="w-10 h-10" />
                  </div>
                  <span className="font-bold text-3xl tracking-tight text-white">VentureLens</span>
                </div>
                <div className="flex items-center gap-6">
                  {/* Mock Badges */}
                  <motion.div whileHover={{ y: -4 }} transition={{ ease: smoothEase }} className="flex items-center gap-4 cursor-pointer">
                    <div className="w-14 h-14 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-900">
                      <Shield className="w-6 h-6 text-zinc-400" />
                    </div>
                    <div className="text-sm text-zinc-500 font-medium leading-snug">SOC 2 Type II<br/>Compliant</div>
                  </motion.div>
                  <motion.div whileHover={{ y: -4 }} transition={{ ease: smoothEase }} className="flex items-center gap-4 cursor-pointer">
                    <div className="w-14 h-14 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-900">
                      <Lock className="w-6 h-6 text-zinc-400" />
                    </div>
                    <div className="text-sm text-zinc-500 font-medium leading-snug">GDPR<br/>Ready</div>
                  </motion.div>
                </div>
              </div>

              {/* Links */}
              <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-10 lg:pl-12">
                <div>
                  <h4 className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-8">Company</h4>
                  <ul className="space-y-5 text-base font-medium">
                    <li><Link href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-zinc-400 hover:text-white transition-colors duration-300">About Us</Link></li>
                    <li><button onClick={() => showToast('No recruitments active at the moment.')} className="text-zinc-400 hover:text-white transition-colors duration-300 flex items-center gap-3">Careers</button></li>
                    <li><Link href="#contact" className="text-zinc-400 hover:text-white transition-colors duration-300">Submit your startup</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-8">Resources</h4>
                  <ul className="space-y-5 text-base font-medium">
                    <li><Link href="#pricing" className="text-zinc-400 hover:text-white transition-colors duration-300">Pricing</Link></li>
                    <li><Link href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-zinc-400 hover:text-white transition-colors duration-300">Blog</Link></li>
                    <li><Link href="#features" className="text-zinc-400 hover:text-white transition-colors duration-300">API documentation</Link></li>
                    <li><Link href="#contact" className="text-zinc-400 hover:text-white transition-colors duration-300">Support</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-8">Case Studies</h4>
                  <ul className="space-y-5 text-base font-medium">
                    <li><button onClick={() => showToast('Coming soon!')} className="text-zinc-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">Valo Ventures <span className="text-zinc-700 group-hover:text-zinc-500 transition-colors">×</span> VL</button></li>
                    <li><button onClick={() => showToast('Coming soon!')} className="text-zinc-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">Bedrock <span className="text-zinc-700 group-hover:text-zinc-500 transition-colors">×</span> VL</button></li>
                    <li><button onClick={() => showToast('Coming soon!')} className="text-zinc-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">MVP Ventures <span className="text-zinc-700 group-hover:text-zinc-500 transition-colors">×</span> VL</button></li>
                    <li><button onClick={() => showToast('Coming soon!')} className="text-zinc-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group">Ridge Ventures <span className="text-zinc-700 group-hover:text-zinc-500 transition-colors">×</span> VL</button></li>
                    <li><button onClick={() => showToast('Coming soon!')} className="text-zinc-500 hover:text-white transition-colors duration-300 flex items-center gap-2 mt-4 group">View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></button></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="pt-10 border-t border-zinc-800/50 flex flex-col md:flex-row items-center justify-between gap-6 text-base font-medium text-zinc-500">
              <p>All rights reserved © {new Date().getFullYear()} VentureLens</p>
              <div className="flex items-center gap-8">
                <button onClick={() => showToast('Coming soon!')} className="hover:text-white transition-colors duration-300">Privacy Policy</button>
                <button onClick={() => showToast('Coming soon!')} className="hover:text-white transition-colors duration-300">Terms of Service</button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
