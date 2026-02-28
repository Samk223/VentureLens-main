'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/components/Sidebar';
import { motion, AnimatePresence } from 'motion/react';

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}

export function CustomSelect({ value, onChange, options, placeholder }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-40 px-4 py-2.5 text-sm bg-white/60 backdrop-blur-xl border border-white/60 rounded-xl shadow-sm hover:bg-white/80 transition-all duration-300",
          isOpen && "ring-2 ring-blue-500/20 border-blue-500/30 bg-white/90 shadow-md"
        )}
      >
        <span className="truncate text-zinc-700 font-medium">{value || placeholder}</span>
        <ChevronDown className={cn("w-4 h-4 text-zinc-400 transition-transform duration-300", isOpen && "rotate-180 text-blue-500")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 w-full mt-2 bg-white/90 backdrop-blur-2xl border border-white/60 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5">
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center w-full px-3 py-2 text-sm text-left rounded-xl transition-all duration-200",
                  !value 
                    ? "text-blue-700 font-medium bg-blue-50/80 shadow-sm" 
                    : "text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900"
                )}
              >
                <span className="flex-1 truncate">{placeholder}</span>
                {!value && <Check className="w-4 h-4 text-blue-600" />}
              </button>
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center w-full px-3 py-2 text-sm text-left rounded-xl transition-all duration-200",
                    value === option 
                      ? "text-blue-700 font-medium bg-blue-50/80 shadow-sm" 
                      : "text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900"
                  )}
                >
                  <span className="flex-1 truncate">{option}</span>
                  {value === option && <Check className="w-4 h-4 text-blue-600" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
