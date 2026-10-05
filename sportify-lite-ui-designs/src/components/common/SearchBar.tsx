import React, { useState } from 'react';
import { Search, Mic, X } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  onClear?: () => void;
  autoFocus?: boolean;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'What do you want to play?',
  value,
  onChange,
  onClear,
  autoFocus = false,
  className = '',
}) => {
  const [isListening, setIsListening] = useState(false);

  const handleMicClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simulate interactive voice search affordance
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      if (!value) {
        onChange('Bollywood');
      }
    }, 1800);
  };

  return (
    <div
      className={`relative flex items-center bg-slate-900/80 hover:bg-slate-800/90 focus-within:bg-slate-900 border border-white/10 focus-within:border-emerald-500/50 rounded-full transition-all duration-200 shadow-inner group ${className}`}
    >
      <div className="pl-4 pr-2 text-slate-400 group-focus-within:text-emerald-400 transition-colors">
        <Search className="w-4 h-4" />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={isListening ? 'Listening for track name or artist...' : placeholder}
        autoFocus={autoFocus}
        className="w-full py-2.5 pr-2 bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none selection:bg-emerald-500/30"
      />

      {value && (
        <button
          onClick={() => {
            onChange('');
            onClear?.();
          }}
          className="p-1 mr-1 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          title="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Mic voice search icon */}
      <button
        onClick={handleMicClick}
        className={`p-2 mr-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all ${
          isListening ? 'text-emerald-400 bg-emerald-500/20 animate-pulse' : ''
        }`}
        title="Search with voice"
      >
        <Mic className="w-4 h-4" />
      </button>
    </div>
  );
};
