'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { mockCompanies } from '@/lib/data';
import { Plus, Trash2, Download, Building2, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export default function ListsPage() {
  const [mounted, setMounted] = useState(false);
  const { lists, addList, removeList, removeCompanyFromList } = useStore();
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      addList(newListName.trim());
      setNewListName('');
    }
  };

  const handleExportCSV = (listId: string, listName: string) => {
    const list = lists.find((l) => l.id === listId);
    if (!list) return;

    const companies = list.companyIds.map((id) => mockCompanies.find((c) => c.id === id)).filter(Boolean);
    if (companies.length === 0) {
      alert('List is empty');
      return;
    }

    const headers = ['Name', 'Domain', 'Sector', 'Stage', 'Location', 'Founded'];
    const rows = companies.map((c) => [
      `"${c!.name}"`,
      `"${c!.domain}"`,
      `"${c!.sector}"`,
      `"${c!.stage}"`,
      `"${c!.location}"`,
      c!.founded,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${listName.replace(/\s+/g, '_').toLowerCase()}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <h1 className="text-3xl font-display font-bold tracking-tight text-zinc-900">Lists</h1>
          <p className="text-zinc-500 mt-1">Manage your shortlisted startups and pipeline.</p>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-xl mb-8 transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-lg font-display font-medium text-zinc-900 mb-4">Create New List</h2>
        <form onSubmit={handleCreateList} className="flex gap-3">
          <input
            type="text"
            placeholder="e.g., AI Seed Startups, Q3 Watchlist..."
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="flex-1 px-4 py-2 bg-white/50 backdrop-blur-md border border-white/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all duration-200"
          />
          <button
            type="submit"
            disabled={!newListName.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-all duration-200 disabled:opacity-50 shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" /> Create List
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {lists.length === 0 ? (
          <div className="text-center py-16 bg-white/40 backdrop-blur-md border-2 border-dashed border-white/60 rounded-3xl text-zinc-500 shadow-sm">
            <List className="w-10 h-10 mx-auto mb-4 text-zinc-400" />
            <p>You haven&apos;t created any lists yet.</p>
            <p className="text-sm mt-1">Create a list above to start organizing companies.</p>
          </div>
        ) : (
          lists.map((list) => {
            const listCompanies = list.companyIds
              .map((id) => mockCompanies.find((c) => c.id === id))
              .filter(Boolean);

            return (
              <div key={list.id} className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl animate-in fade-in slide-in-from-bottom-4">
                <div className="px-8 py-5 border-b border-white/40 bg-white/40 backdrop-blur-md flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-semibold text-zinc-900">{list.name}</h3>
                    <span className="px-3 py-1 bg-white/60 border border-white/40 text-zinc-700 rounded-full text-xs font-medium shadow-sm">
                      {listCompanies.length} companies
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExportCSV(list.id, list.name)}
                      className="p-2 text-zinc-500 hover:text-blue-600 hover:bg-white/50 rounded-xl transition-all duration-200"
                      title="Export CSV"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeList(list.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50/50 rounded-xl transition-all duration-200"
                      title="Delete List"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {listCompanies.length === 0 ? (
                  <div className="px-8 py-10 text-center text-zinc-500 text-sm bg-white/20">
                    This list is empty. Go to the <Link href="/companies" className="text-blue-600 font-medium hover:underline">Companies page</Link> to add some.
                  </div>
                ) : (
                  <ul className="divide-y divide-white/20 bg-white/20">
                    {listCompanies.map((company) => (
                      <li key={company!.id} className="px-8 py-5 flex items-center justify-between hover:bg-white/40 transition-colors group">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-white/60 border border-white/40 shadow-sm flex items-center justify-center text-zinc-500">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <Link href={`/companies/${company!.id}`} className="font-medium text-zinc-900 hover:text-blue-600">
                              {company!.name}
                            </Link>
                            <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                              <span>{company!.sector}</span>
                              <span>&bull;</span>
                              <span>{company!.stage}</span>
                              <span>&bull;</span>
                              <a href={`https://${company!.domain}`} target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 flex items-center gap-0.5">
                                {company!.domain} <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeCompanyFromList(list.id, company!.id)}
                          className="text-zinc-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                          title="Remove from list"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}

function List({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="8" y1="6" x2="21" y2="6"></line>
      <line x1="8" y1="12" x2="21" y2="12"></line>
      <line x1="8" y1="18" x2="21" y2="18"></line>
      <line x1="3" y1="6" x2="3.01" y2="6"></line>
      <line x1="3" y1="12" x2="3.01" y2="12"></line>
      <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
  );
}
