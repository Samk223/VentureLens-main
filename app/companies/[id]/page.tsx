'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockCompanies } from '@/lib/data';
import { useStore } from '@/store/useStore';
import { formatDistanceToNow, format } from 'date-fns';
import { ArrowLeft, ExternalLink, Sparkles, Plus, Check, Loader2, Calendar, MapPin, Tag, Download, EyeOff, Trash2, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'motion/react';

export default function CompanyProfilePage() {
  const [mounted, setMounted] = useState(false);
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;
  
  const company = mockCompanies.find((c) => c.id === companyId);
  
  const [note, setNote] = useState('');
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentData, setEnrichmentData] = useState<any>(null);
  const [showEnrichment, setShowEnrichment] = useState(true);
  const [enrichmentHistoryCount, setEnrichmentHistoryCount] = useState(0);
  const [showListDropdown, setShowListDropdown] = useState(false);

  const [showNoteSuccess, setShowNoteSuccess] = useState(false);
  const [showEnrichError, setShowEnrichError] = useState(false);

  const { notes, saveNote, lists, addCompanyToList, removeCompanyFromList } = useStore();

  useEffect(() => {
    setMounted(true);
    if (notes[companyId]) {
      setNote(notes[companyId]);
    }
    // Load cached enrichment data if available
    const cached = localStorage.getItem(`enrichment_${companyId}`);
    if (cached) {
      setEnrichmentData(JSON.parse(cached));
    }
    const historyCount = localStorage.getItem(`enrichment_count_${companyId}`);
    if (historyCount) {
      setEnrichmentHistoryCount(parseInt(historyCount, 10));
    }
  }, [companyId, notes]);

  if (!mounted) {
    return null;
  }

  if (!company) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-semibold">Company not found</h1>
        <button onClick={() => router.back()} className="mt-4 text-blue-600 hover:underline">Go back</button>
      </div>
    );
  }

  const handleSaveNote = () => {
    saveNote(companyId, note);
    setShowNoteSuccess(true);
    setTimeout(() => setShowNoteSuccess(false), 3000);
  };

  const handleEnrich = async () => {
    setIsEnriching(true);
    setShowEnrichment(true);
    try {
      const response = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ website: company.domain, companyName: company.name }),
      });
      
      if (!response.ok) throw new Error('Failed to enrich');
      
      const data = await response.json();
      setEnrichmentData(data);
      localStorage.setItem(`enrichment_${companyId}`, JSON.stringify(data));
      
      const newCount = enrichmentHistoryCount + 1;
      setEnrichmentHistoryCount(newCount);
      localStorage.setItem(`enrichment_count_${companyId}`, newCount.toString());
    } catch (error) {
      console.error(error);
      setShowEnrichError(true);
      setTimeout(() => setShowEnrichError(false), 5000);
    } finally {
      setIsEnriching(false);
    }
  };

  const handleDeleteEnrichment = () => {
    setEnrichmentData(null);
    setEnrichmentHistoryCount(0);
    localStorage.removeItem(`enrichment_${companyId}`);
    localStorage.removeItem(`enrichment_count_${companyId}`);
  };

  const handleDownloadPDF = () => {
    if (!enrichmentData) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`${company.name} - AI Enrichment`, 20, 20);
    
    doc.setFontSize(14);
    doc.text('Summary', 20, 40);
    doc.setFontSize(10);
    const splitSummary = doc.splitTextToSize(enrichmentData.summary || '', 170);
    doc.text(splitSummary, 20, 50);
    
    let y = 50 + (splitSummary.length * 5) + 10;
    
    doc.setFontSize(14);
    doc.text('What They Do', 20, y);
    doc.setFontSize(10);
    y += 10;
    enrichmentData.whatTheyDo?.forEach((item: string) => {
      const splitItem = doc.splitTextToSize(`• ${item}`, 170);
      doc.text(splitItem, 20, y);
      y += (splitItem.length * 5);
    });
    
    y += 10;
    doc.setFontSize(14);
    doc.text('Keywords', 20, y);
    doc.setFontSize(10);
    y += 10;
    doc.text(enrichmentData.keywords?.join(', ') || '', 20, y);
    
    y += 15;
    doc.setFontSize(14);
    doc.text('Derived Signals', 20, y);
    doc.setFontSize(10);
    y += 10;
    enrichmentData.derivedSignals?.forEach((item: string) => {
      const splitItem = doc.splitTextToSize(`• ${item}`, 170);
      doc.text(splitItem, 20, y);
      y += (splitItem.length * 5);
    });

    doc.save(`${company.name}_Enrichment.pdf`);
  };

  const handleDeleteNote = () => {
    setNote('');
    saveNote(companyId, '');
  };

  const toggleList = (listId: string) => {
    const list = lists.find(l => l.id === listId);
    if (list?.companyIds.includes(companyId)) {
      removeCompanyFromList(listId, companyId);
    } else {
      addCompanyToList(listId, companyId);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="p-8 max-w-5xl mx-auto"
    >
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to companies
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column: Profile & Signals */}
        <div className="flex-1 space-y-8">
          {/* Header Card */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-xl transition-all duration-300 hover:shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-display font-bold text-zinc-900 tracking-tight">{company.name}</h1>
                <div className="flex flex-col">
                  <a 
                    href={`https://${company.domain}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 mt-1 text-sm font-medium"
                  >
                    {company.domain} <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-[10px] text-zinc-400 mt-0.5 italic">
                    Note: Mock domain for demo purposes.
                  </span>
                </div>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowListDropdown(!showListDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Save to List
                </button>
                
                <AnimatePresence>
                  {showListDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-64 bg-white/90 backdrop-blur-2xl border border-white/60 rounded-2xl shadow-xl z-10 p-1.5 overflow-hidden"
                    >
                      {lists.length === 0 ? (
                        <div className="px-3 py-3 text-sm text-zinc-500 text-center">No lists created yet.</div>
                      ) : (
                        <div className="space-y-0.5">
                          {lists.map(list => {
                            const isAdded = list.companyIds.includes(companyId);
                            return (
                              <button
                                key={list.id}
                                onClick={() => toggleList(list.id)}
                                className="w-full text-left px-3 py-2.5 text-sm hover:bg-zinc-100/80 rounded-xl transition-colors flex items-center justify-between group"
                              >
                                <span className="truncate text-zinc-700 group-hover:text-zinc-900">{list.name}</span>
                                {isAdded && <Check className="w-4 h-4 text-blue-600" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      <div className="border-t border-zinc-200/50 mt-1.5 pt-1.5">
                        <Link href="/lists" className="block px-3 py-2.5 text-sm text-blue-600 hover:bg-blue-50/80 rounded-xl transition-colors font-medium text-center">
                          Manage Lists
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <p className="text-zinc-600 text-lg leading-relaxed mb-6">
              {company.description}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
              <div className="flex items-center gap-1.5 bg-white/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/40 shadow-sm">
                <Tag className="w-4 h-4" /> {company.sector}
              </div>
              <div className="flex items-center gap-1.5 bg-white/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/40 shadow-sm">
                <Calendar className="w-4 h-4" /> Founded {company.founded}
              </div>
              <div className="flex items-center gap-1.5 bg-white/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/40 shadow-sm">
                <MapPin className="w-4 h-4" /> {company.location}
              </div>
              <div className="flex items-center gap-1.5 bg-white/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/40 shadow-sm font-medium text-zinc-700">
                Stage: {company.stage}
              </div>
            </div>
          </div>

          {/* Enrichment Section (Left Side) */}
          {enrichmentData && showEnrichment && (
            <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-indigo-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" /> Enrichment
                </h3>
                <div className="flex items-center gap-4 text-sm font-medium">
                  <button onClick={handleDownloadPDF} className="flex items-center gap-1.5 text-zinc-600 hover:text-zinc-900 transition-colors">
                    <Download className="w-4 h-4" /> Download
                  </button>
                  <button onClick={() => setShowEnrichment(false)} className="flex items-center gap-1.5 text-zinc-600 hover:text-zinc-900 transition-colors">
                    <EyeOff className="w-4 h-4" /> Hide
                  </button>
                  <button onClick={handleDeleteEnrichment} className="flex items-center gap-1.5 text-red-500 hover:text-red-700 transition-colors">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm text-zinc-500 mb-1">Summary</h4>
                  <p className="text-zinc-900 leading-relaxed">{enrichmentData.summary}</p>
                </div>

                <div>
                  <h4 className="text-sm text-zinc-500 mb-2">What They Do</h4>
                  <ul className="list-disc pl-5 space-y-1 text-zinc-900">
                    {enrichmentData.whatTheyDo?.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm text-zinc-500 mb-2">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {enrichmentData.keywords?.map((kw: string) => (
                      <span key={kw} className="px-4 py-1.5 bg-white/50 backdrop-blur-md border border-white/40 text-zinc-700 rounded-xl text-sm shadow-sm">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm text-zinc-500 mb-2">Derived Signals</h4>
                  <ul className="list-disc pl-5 space-y-1 text-zinc-900">
                    {enrichmentData.derivedSignals?.map((item: string, i: number) => (
                      <li key={i} className="text-blue-600">{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm text-zinc-500 mb-2">Sources</h4>
                  <ul className="space-y-1">
                    {enrichmentData.sources?.map((src: string, i: number) => (
                      <li key={i}>
                        <a href={src} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 text-sm">
                          {src} <ExternalLink className="w-3 h-3" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-zinc-100 text-sm text-zinc-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Enrichment History ({enrichmentHistoryCount} time{enrichmentHistoryCount !== 1 ? 's' : ''})
                  <br />
                  Enriched {formatDistanceToNow(new Date(enrichmentData.timestamp))} ago
                </div>
              </div>
            </div>
          )}

          {/* Signals Timeline */}
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Recent Signals</h3>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent">
              {company.signals?.map((signal, idx) => (
                <div key={signal.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-zinc-100 text-zinc-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <div className="w-2 h-2 rounded-full bg-zinc-400" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/60 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{signal.type}</span>
                      <time className="text-xs text-zinc-500">{format(new Date(signal.date), 'MMM d, yyyy')}</time>
                    </div>
                    <p className="text-sm text-zinc-700">{signal.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Enrichment & Notes */}
        <div className="w-full md:w-80 space-y-6">
          {/* AI Enrichment Card */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <h3 className="text-base font-semibold text-zinc-900">AI Enrichment</h3>
            </div>
            
            <p className="text-sm text-zinc-500 mb-4 leading-relaxed">
              Pull live data from the company&apos;s public website to extract summary, keywords, and thesis alignment.
            </p>

            {showEnrichError && (
              <p className="text-xs text-red-500 mb-3 animate-in fade-in">
                Failed to enrich. Please try again later.
              </p>
            )}

            <button
              onClick={handleEnrich}
              disabled={isEnriching}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-70"
            >
              {isEnriching ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Fetching website data...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Enrich Profile</>
              )}
            </button>

            {enrichmentData && (
              <p className="text-xs text-zinc-400 text-center mt-3">
                Last enriched {formatDistanceToNow(new Date(enrichmentData.timestamp))} ago
              </p>
            )}
          </div>

          {/* Details Card */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-sm font-semibold text-zinc-900 mb-4">Details</h3>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500">Employees</span>
              <span className="text-zinc-900">5-10</span>
            </div>
          </div>

          {/* Notes Card */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-zinc-900" />
              <h3 className="text-base font-semibold text-zinc-900">Analyst Notes</h3>
            </div>
            
            {!note ? (
              <p className="text-sm text-zinc-500 mb-4">No notes yet.</p>
            ) : (
              <div className="mb-4 bg-white/50 backdrop-blur-md p-4 rounded-xl border border-white/40 shadow-sm relative group">
                <p className="text-sm text-zinc-900 whitespace-pre-wrap">{note}</p>
                <button 
                  onClick={handleDeleteNote}
                  className="absolute top-2 right-2 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="space-y-3">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note..."
                className="w-full h-24 p-4 bg-white/50 backdrop-blur-md border border-white/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none text-zinc-900 shadow-sm transition-all duration-200"
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveNote}
                  className="flex-1 px-4 py-2 bg-blue-400 text-white rounded-md text-sm font-medium hover:bg-blue-500 transition-colors"
                >
                  Save Note
                </button>
                {showNoteSuccess && (
                  <span className="text-xs text-green-600 font-medium animate-in fade-in">
                    Saved!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
