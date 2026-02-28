'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { mockCompanies } from '@/lib/data';
import { useStore } from '@/store/useStore';
import { Search, Filter, BookmarkPlus, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { CustomSelect } from '@/components/CustomSelect';
import { motion } from 'motion/react';

function CompaniesContent() {
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [sector, setSector] = useState(searchParams.get('sector') || '');
  const [stage, setStage] = useState(searchParams.get('stage') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  
  const [sortField, setSortField] = useState<'name' | 'founded'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const saveSearch = useStore((state) => state.saveSearch);

  const sectors = Array.from(new Set(mockCompanies.map((c) => c.sector)));
  const stages = Array.from(new Set(mockCompanies.map((c) => c.stage)));
  const locations = Array.from(new Set(mockCompanies.map((c) => c.location)));

  useEffect(() => {
    setQuery(searchParams.get('query') || '');
    setSector(searchParams.get('sector') || '');
    setStage(searchParams.get('stage') || '');
    setLocation(searchParams.get('location') || '');
  }, [searchParams]);

  const filteredCompanies = useMemo(() => {
    return mockCompanies
      .filter((c) => {
        const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase()) || c.description.toLowerCase().includes(query.toLowerCase());
        const matchesSector = sector ? c.sector === sector : true;
        const matchesStage = stage ? c.stage === stage : true;
        const matchesLocation = location ? c.location === location : true;
        return matchesQuery && matchesSector && matchesStage && matchesLocation;
      })
      .sort((a, b) => {
        if (sortField === 'name') {
          return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else {
          return sortOrder === 'asc' ? a.founded - b.founded : b.founded - a.founded;
        }
      });
  }, [query, sector, stage, location, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const paginatedCompanies = filteredCompanies.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const [isSavingSearch, setIsSavingSearch] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleSaveSearch = () => {
    if (!searchName) {
      setIsSavingSearch(true);
      return;
    }
    saveSearch(searchName, { query, sector, stage, location });
    setSearchName('');
    setIsSavingSearch(false);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const toggleSort = (field: 'name' | 'founded') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="p-8 max-w-7xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-zinc-900">Companies</h1>
          <p className="text-zinc-500 mt-1">Discover and filter startups based on your thesis.</p>
        </div>
        <div className="flex items-center gap-3">
          {isSavingSearch ? (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
              <input
                type="text"
                placeholder="Search name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                autoFocus
                className="px-4 py-2 bg-white/50 backdrop-blur-md border border-white/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all duration-200"
                onKeyDown={(e) => e.key === 'Enter' && handleSaveSearch()}
              />
              <button
                onClick={handleSaveSearch}
                className="px-4 py-2 bg-zinc-900 text-white rounded-md text-sm font-medium hover:bg-zinc-800"
              >
                Save
              </button>
              <button
                onClick={() => setIsSavingSearch(false)}
                className="px-3 py-2 text-zinc-500 hover:text-zinc-900 text-sm"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={handleSaveSearch}
              className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md border border-white/40 rounded-xl text-sm font-medium text-zinc-700 hover:bg-white/80 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <BookmarkPlus className="w-4 h-4" />
              Save Search
            </button>
          )}
          {showSaveSuccess && (
            <span className="text-sm text-green-600 font-medium animate-in fade-in">
              Search saved!
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search companies or keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/60 backdrop-blur-md border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm shadow-sm transition-all duration-200"
          />
        </div>
        <div className="flex gap-3">
          <CustomSelect
            value={sector}
            onChange={setSector}
            options={sectors}
            placeholder="All Sectors"
          />
          <CustomSelect
            value={stage}
            onChange={setStage}
            options={stages}
            placeholder="All Stages"
          />
          <CustomSelect
            value={location}
            onChange={setLocation}
            options={locations}
            placeholder="All Locations"
          />
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl overflow-hidden shadow-xl transition-all duration-300">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/40 border-b border-white/40 text-zinc-500 backdrop-blur-md">
            <tr>
              <th className="px-6 py-3 font-medium cursor-pointer hover:text-zinc-900" onClick={() => toggleSort('name')}>
                <div className="flex items-center gap-1">
                  Company <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="px-6 py-3 font-medium">Sector</th>
              <th className="px-6 py-3 font-medium">Stage</th>
              <th className="px-6 py-3 font-medium">Location</th>
              <th className="px-6 py-3 font-medium cursor-pointer hover:text-zinc-900" onClick={() => toggleSort('founded')}>
                <div className="flex items-center gap-1">
                  Founded <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20">
            {paginatedCompanies.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                  No companies found matching your criteria.
                </td>
              </tr>
            ) : (
              paginatedCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-white/40 transition-colors group">
                  <td className="px-6 py-4">
                    <Link href={`/companies/${company.id}`} className="block">
                      <div className="font-medium text-zinc-900 group-hover:text-blue-600 transition-colors">{company.name}</div>
                      <div className="text-zinc-500 text-xs mt-0.5 truncate max-w-xs">{company.description}</div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/60 border border-white/40 text-zinc-700 shadow-sm">
                      {company.sector}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-600">{company.stage}</td>
                  <td className="px-6 py-4 text-zinc-600">{company.location}</td>
                  <td className="px-6 py-4 text-zinc-600">{company.founded}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-zinc-500">
            Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredCompanies.length)} of {filteredCompanies.length} results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 bg-white/60 backdrop-blur-md border border-white/40 rounded-xl disabled:opacity-50 hover:bg-white/80 transition-all duration-200 shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 bg-white/60 backdrop-blur-md border border-white/40 rounded-xl disabled:opacity-50 hover:bg-white/80 transition-all duration-200 shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function CompaniesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-500">Loading companies...</div>}>
      <CompaniesContent />
    </Suspense>
  );
}

