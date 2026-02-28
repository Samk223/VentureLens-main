'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { Bookmark, Play, Trash2, Search, Filter, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function SavedSearchesPage() {
  const [mounted, setMounted] = useState(false);
  const { savedSearches, deleteSearch } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="p-8 max-w-5xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-zinc-900">Saved Searches</h1>
          <p className="text-zinc-500 mt-1">Quickly re-run your common scouting workflows.</p>
        </div>
      </div>

      <div className="space-y-6">
        {savedSearches.length === 0 ? (
          <div className="text-center py-16 bg-white/40 backdrop-blur-md border-2 border-dashed border-white/60 rounded-3xl text-zinc-500 shadow-sm">
            <Bookmark className="w-10 h-10 mx-auto mb-4 text-zinc-400" />
            <p className="text-zinc-900 font-medium mb-1">You haven&apos;t saved any searches yet.</p>
            <p className="text-sm mb-6">Go to the <Link href="/companies" className="text-blue-600 font-medium hover:underline">Companies page</Link> to save a search.</p>
            <Link href="/companies" className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5">
              <Search className="w-4 h-4" /> Go to Companies <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedSearches.map((search) => {
              const queryParams = new URLSearchParams();
              if (search.filters.query) queryParams.set('query', search.filters.query);
              if (search.filters.sector) queryParams.set('sector', search.filters.sector);
              if (search.filters.stage) queryParams.set('stage', search.filters.stage);
              if (search.filters.location) queryParams.set('location', search.filters.location);

              const runUrl = `/companies?${queryParams.toString()}`;

              return (
                <div key={search.id} className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative group animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-xl font-semibold text-zinc-900 truncate pr-8">{search.name}</h3>
                    <button
                      onClick={() => deleteSearch(search.id)}
                      className="absolute top-8 right-8 text-zinc-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete search"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4 mb-8">
                    {search.filters.query && (
                      <div className="flex items-center gap-3 text-sm text-zinc-600 bg-white/40 p-3 rounded-xl border border-white/40">
                        <Search className="w-4 h-4 text-zinc-400" />
                        <span className="truncate font-medium">&quot;{search.filters.query}&quot;</span>
                      </div>
                    )}
                    {(search.filters.sector || search.filters.stage || search.filters.location) && (
                      <div className="flex items-start gap-3 text-sm text-zinc-600 bg-white/40 p-3 rounded-xl border border-white/40">
                        <Filter className="w-4 h-4 text-zinc-400 mt-0.5" />
                        <div className="flex flex-wrap gap-2">
                          {search.filters.sector && (
                            <span className="px-3 py-1 bg-white/60 border border-white/40 rounded-lg text-xs font-medium text-zinc-700 shadow-sm">{search.filters.sector}</span>
                          )}
                          {search.filters.stage && (
                            <span className="px-3 py-1 bg-white/60 border border-white/40 rounded-lg text-xs font-medium text-zinc-700 shadow-sm">{search.filters.stage}</span>
                          )}
                          {search.filters.location && (
                            <span className="px-3 py-1 bg-white/60 border border-white/40 rounded-lg text-xs font-medium text-zinc-700 shadow-sm">{search.filters.location}</span>
                          )}
                        </div>
                      </div>
                    )}
                    {!search.filters.query && !search.filters.sector && !search.filters.stage && !search.filters.location && (
                      <div className="text-sm text-zinc-500 italic bg-white/40 p-3 rounded-xl border border-white/40">No filters applied</div>
                    )}
                  </div>

                  <Link
                    href={runUrl}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Play className="w-4 h-4" /> Run Search
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
