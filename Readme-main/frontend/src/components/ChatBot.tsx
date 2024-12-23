
import React, { useState, useEffect, useRef } from 'react';
import { Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { RAG_URL } from '../config';

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatbotProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isDarkMode: boolean;
  initialMessage?: string;
}

export const Chatbot: React.FC<ChatbotProps> = ({
  isOpen,
  setIsOpen,
  isDarkMode,
  initialMessage = 'Hi there! How can I help you today?',
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ text: initialMessage, isUser: false }]);
    }
  }, [isOpen, initialMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newMessages = [...messages, { text: inputValue, isUser: true }];
      setMessages([...newMessages, { text: 'Gyani is thinking...', isUser: false }]);
      setInputValue('');

      try {
        const response = await axios.post(`${RAG_URL}/question`, { inputValue });

        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }

        const botMessage = response.data.response;
        setMessages([
          ...newMessages,
          { text: botMessage, isUser: false }
        ]);
      } catch (error) {
        console.error('Error fetching response:', error);
        setMessages([
          ...newMessages,
          { text: 'Sorry, something went wrong.', isUser: false }
        ]);
      } finally {
        // Remove the "Gyani is thinking..." message
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message.text !== 'Gyani is thinking...')
        );
      }
    }
  };

  const formatMessage = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-lg">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`fixed inset-y-0 right-0 w-full md:w-[500px] shadow-lg ${
            isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
          }`}
        >
          <div className="flex flex-col h-full">
            <div
              className={`flex justify-between items-center p-4 border-b ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <h2 className="text-xl text-center font-bold">Gyani AI</h2>
              <button
                onClick={() => setIsOpen(false)}
                className={`rounded-full p-2 transition-colors ${
                  isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-grow overflow-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-lg ${
                      message.isUser
                        ? isDarkMode
                          ? 'bg-purple-600 text-white'
                          : 'bg-indigo-500 text-white'
                        : isDarkMode
                        ? 'bg-gray-800 text-gray-100'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">
                      {formatMessage(message.text)}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`flex rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white border'}`}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className={`flex-grow p-3 focus:outline-none ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}
                />
                <button
                  type="submit"
                  className={`p-3 transition-colors ${
                    isDarkMode ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-indigo-500 text-white hover:bg-indigo-600'
                  }`}
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
