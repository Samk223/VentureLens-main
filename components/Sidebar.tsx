'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Building2, List, Bookmark, Search, ChevronRight, ChevronLeft, LogOut, User, Aperture, Home } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Companies', href: '/companies', icon: Building2 },
  { name: 'Lists', href: '/lists', icon: List },
  { name: 'Saved Searches', href: '/saved', icon: Bookmark },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchHints, setShowSearchHints] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentUser = localStorage.getItem('ps_currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchHints(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.toLowerCase().trim();
    if (q === 'companies') router.push('/companies');
    else if (q === 'lists') router.push('/lists');
    else if (q === 'saved' || q === 'saved searches') router.push('/saved');
    else if (q === 'profile') router.push('/profile');
    else if (q) router.push(`/companies?query=${encodeURIComponent(q)}`);
    setShowSearchHints(false);
    setSearchQuery('');
  };

  const handleSignOut = () => {
    localStorage.removeItem('ps_currentUser');
    router.push('/');
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isExpanded ? 220 : 80 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex flex-col border border-white/60 bg-gradient-to-b from-white/80 to-white/40 backdrop-blur-2xl shadow-[0_16px_40px_-10px_rgba(0,0,0,0.08),0_0_20px_-5px_rgba(255,255,255,0.5)] sticky top-4 h-[calc(100vh-2rem)] ml-4 mr-2 rounded-[2rem] z-50"
    >
      <div className={cn("p-5 flex items-center", isExpanded ? "justify-start gap-4" : "justify-center")}>
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 shrink-0 relative group outline-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.6)] transition-all duration-300"
          >
            <Aperture className="w-8 h-8" strokeWidth={1.5} />
          </motion.div>
        </motion.button>
        <AnimatePresence>
          {isExpanded && (
            <motion.span 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="font-display font-bold text-xl text-zinc-900 tracking-tight whitespace-nowrap overflow-hidden"
            >
              VentureLens
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className={cn("px-4 pb-4", !isExpanded && "hidden")} ref={searchRef}>
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Global search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearchHints(true)}
            className="w-full bg-zinc-50/50 border border-zinc-200/80 rounded-xl py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-zinc-900 shadow-sm transition-all placeholder:text-zinc-400"
          />
          <AnimatePresence>
            {showSearchHints && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-2xl border border-zinc-200/80 rounded-2xl shadow-xl p-2 z-50 overflow-hidden"
              >
                <p className="text-xs font-medium text-zinc-400 mb-2 px-2 uppercase tracking-wider">Try searching for:</p>
                <ul className="text-sm space-y-1">
                  <li><button type="button" onClick={() => { setSearchQuery('companies'); handleSearch({ preventDefault: () => {} } as any); }} className="w-full text-left px-3 py-2 hover:bg-zinc-50 rounded-xl text-zinc-700 transition-colors">companies</button></li>
                  <li><button type="button" onClick={() => { setSearchQuery('lists'); handleSearch({ preventDefault: () => {} } as any); }} className="w-full text-left px-3 py-2 hover:bg-zinc-50 rounded-xl text-zinc-700 transition-colors">lists</button></li>
                  <li><button type="button" onClick={() => { setSearchQuery('saved'); handleSearch({ preventDefault: () => {} } as any); }} className="w-full text-left px-3 py-2 hover:bg-zinc-50 rounded-xl text-zinc-700 transition-colors">saved</button></li>
                  <li><button type="button" onClick={() => { setSearchQuery('AI'); handleSearch({ preventDefault: () => {} } as any); }} className="w-full text-left px-3 py-2 hover:bg-zinc-50 rounded-xl text-zinc-700 transition-colors">AI (search companies)</button></li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      <nav className="flex-1 px-3 mt-2 space-y-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center rounded-xl transition-all duration-200 relative group',
                isExpanded ? 'px-3 py-3 gap-3' : 'justify-center p-3 mx-auto w-12',
                isActive
                  ? 'bg-zinc-900 text-white shadow-md'
                  : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
              )}
              title={!isExpanded ? item.name : undefined}
            >
              <item.icon className={cn("w-5 h-5 shrink-0 transition-colors", isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-900")} />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 flex flex-col gap-2 border-t border-zinc-100">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "flex items-center rounded-xl text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-all duration-200",
            isExpanded ? "px-3 py-3 gap-3" : "justify-center p-3 mx-auto w-12"
          )}
        >
          {isExpanded ? <ChevronLeft className="w-5 h-5 shrink-0" /> : <ChevronRight className="w-5 h-5 shrink-0" />}
          <AnimatePresence>
            {isExpanded && (
              <motion.span 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <div className="relative mt-1" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={cn(
              "flex items-center rounded-2xl transition-all duration-200 w-full",
              isExpanded ? "p-2 hover:bg-zinc-100 gap-3" : "justify-center p-2 mx-auto w-12 hover:bg-zinc-100"
            )}
          >
            {user?.photo ? (
              <img src={user.photo} alt="Profile" className="w-9 h-9 rounded-full object-cover shrink-0 border border-zinc-200 shadow-sm" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium text-white shrink-0 shadow-sm shadow-blue-600/20">
                {userInitial}
              </div>
            )}
            <AnimatePresence>
              {isExpanded && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-start overflow-hidden"
                >
                  <span className="text-sm font-semibold text-zinc-900 truncate w-full text-left">{user?.name || 'User'}</span>
                  <span className="text-xs text-zinc-500 truncate w-full text-left font-medium">{user?.role || 'Analyst'}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={cn(
                  "absolute bottom-full left-0 mb-3 bg-white/95 backdrop-blur-2xl border border-zinc-200/80 rounded-2xl shadow-xl p-1.5 min-w-[200px] z-50 overflow-hidden",
                  !isExpanded && "left-14"
                )}
              >
                <div className="px-3 py-3 border-b border-zinc-100 mb-1">
                  <p className="text-sm font-semibold text-zinc-900 truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">{user?.email}</p>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-xl transition-colors"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <User className="w-4 h-4 text-zinc-400" /> Edit Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-1"
                >
                  <LogOut className="w-4 h-4 text-red-500" /> Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
