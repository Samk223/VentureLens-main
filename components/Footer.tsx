import { Logo } from '@/components/Logo';

export function Footer() {
  return (
    <footer className="relative bg-white/40 backdrop-blur-xl border border-white/60 mx-4 mb-4 mt-12 rounded-[2rem] shadow-sm overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 py-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="text-blue-600 p-2 bg-white/60 rounded-xl shadow-sm border border-white/40">
              <Logo className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-800">VentureLens</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm font-medium text-zinc-500">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-zinc-200/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500">© 2026 VentureLens. All rights reserved.</p>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>Advanced company intelligence platform.</span>
          </div>
        </div>
      </div>
      
      {/* Subtle background elements instead of massive text */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>
    </footer>
  );
}
