import { Bot } from 'lucide-react';

interface GyaniAIButtonProps {
  setIsChatOpen: (isOpen: boolean) => void;
  isDarkMode: boolean;
}

export default function GyaniAIButton({ setIsChatOpen, isDarkMode }: GyaniAIButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative group">
        {/* Hover Text */}
        <span
          className={`absolute text-md font-medium bottom-full mb-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            isDarkMode
              ? 'bg-slate-700 text-slate-200'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          Ask AI
        </span>

        {/* Button */}
        <button
          onClick={() => setIsChatOpen(true)}
          className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
            isDarkMode
              ? 'bg-gradient-to-r from-blue-300 to-purple-400 text-black'
              : 'bg-gradient-to-r from-blue-400 to-purple-500 text-white'
          }`}
        >
          <Bot className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}