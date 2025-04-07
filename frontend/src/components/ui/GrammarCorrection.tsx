import React from 'react';
import { Wand2 } from 'lucide-react';

interface GrammarCorrectionProps {
  onCorrect: () => void;
  isLoading: boolean;
}

export const GrammarCorrection: React.FC<GrammarCorrectionProps> = ({ onCorrect, isLoading }) => {
  return (
    <div className="relative group flex justify-center sm:justify-start">
      <button
        onClick={onCorrect}
        disabled={isLoading}
        className="flex  justify-center items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black rounded-md transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto w-full text-center"
      >
        <Wand2 className="w-5 h-5" />
        <span className="text-sm sm:text-base">{isLoading ? 'Correcting...' : 'AI Grammar Check'}</span>
      </button>

      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-xs sm:text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        Let AI fix grammar & improve writing
      </div>
    </div>
  );
};