
import { useState, useEffect } from 'react'
import { Blog } from "../hooks"
import { Appbar } from "./Appbar"
import { Send, X, Sun, Moon } from "lucide-react"

interface ThemeProps {
  isDarkMode: boolean;
}

function Avatar({ name, isDarkMode }: { name: string; isDarkMode: boolean }) {
  return (
    <div className={`w-12 h-12 border-slate-400 border-2 rounded-full flex items-center justify-center transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-purple-900 text-purple-100' 
        : 'bg-indigo-100 text-indigo-900'
    }`}>
      <span className="text-xl font-bold">{name[0].toUpperCase()}</span>
    </div>
  )
}

const formatDate = (date: string | Date): string => {
  const dateObj = (typeof date === "string") ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  };
  return dateObj.toLocaleDateString('en-GB', options);
};

const Chatbot = ({ isOpen, setIsOpen, isDarkMode }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void; isDarkMode: boolean }) => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([])
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, isUser: true }])
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "Thanks for your message! This is a demo response.", isUser: false }])
      }, 1000)
      setInputValue('')
    }
  }

  return (
    <div className={`fixed inset-y-0 right-0 w-full md:w-1/2 shadow-lg transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} ${
      isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
    }`}>
      <div className="flex flex-col h-full">
        <div className={`flex justify-between items-center p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className="text-xl font-bold">Chatbot</h2>
          <button onClick={() => setIsOpen(false)} className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-grow overflow-auto p-4">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-3 rounded-lg ${
                message.isUser 
                  ? (isDarkMode ? 'bg-purple-600 text-white' : 'bg-indigo-500 text-white')
                  : (isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-200 text-gray-800')
              }`}>
                {message.text}
              </span>
            </div>
          ))}
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
            <button type="submit" className={`p-3 transition-colors ${
              isDarkMode 
                ? 'bg-purple-600 text-white hover:bg-purple-700' 
                : 'bg-indigo-500 text-white hover:bg-indigo-600'
            }`}>
              <Send className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const FullBlog = ({ blog }: {blog: Blog}) => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    setIsDarkMode(savedTheme === 'dark')
    setIsLoading(false)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode)
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800' : 'bg-gradient-to-br from-orange-100 via-rose-100 to-purple-100'
    }`}>
      <Appbar />
      <div className="flex justify-center">
        <div className="grid grid-cols-12 px-5 w-full max-w-screen-xl pt-8">
          <div className="col-span-12 md:col-span-8">
            {isLoading ? (
              <Skeleton isDarkMode={isDarkMode} />
            ) : (
              <>
                <div className={`text-3xl md:text-5xl font-extrabold leading-tight md:leading-snug ${
                  isDarkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600' 
                            : 'text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-600'
                }`}>
                  {blog.title}
                </div>
                <div className={`pt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formatDate(blog.publishedDate)}
                </div>
                <div className="pt-4 whitespace-pre-wrap text-purple-200">
                  {blog.content}
                </div>
              </>
            )}
          </div>
          {!isChatOpen && (
            <div className="col-span-12 md:col-span-4 md:ml-16 mt-8 md:mt-0">
              {isLoading ? (
                <Skeleton isDarkMode={isDarkMode} />
              ) : (
                <div>
                  <div className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Author
                  </div>
                  <div className="flex w-full mt-2">
                    <div className="pr-4 flex flex-col justify-center">
                      <Avatar name={blog.author.name || "Anonymous"} isDarkMode={isDarkMode} />
                    </div>
                    <div>
                      <div className={`text-xl font-bold ${
                        isDarkMode ? 'text-purple-200' : 'text-indigo-600'
                      }`}>
                        {blog.author.name || "Anonymous"}
                      </div>
                      <div className={`pt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Random catch phrase about the author's ability to grab the user's attention
                      </div>
                    </div>
                  </div>  
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="h-[50px]"></div>
      <Chatbot isOpen={isChatOpen} setIsOpen={setIsChatOpen} isDarkMode={isDarkMode} />
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)} 
          className={`fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${
            isDarkMode 
              ? 'bg-purple-600 text-white hover:bg-purple-700' 
              : 'bg-indigo-500 text-white hover:bg-indigo-600'
          }`}
        >
          <Send className="w-6 h-6" />
        </button>
      )}
      <button
        onClick={toggleDarkMode}
        className={`fixed bottom-4 left-4 p-2 rounded-full transition-colors ${
          isDarkMode 
            ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        }`}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>
    </div>
  )
}
export const Skeleton = ({ isDarkMode }: ThemeProps) => {
  return (

    <div className={`animate-pulse h-screen w-screen flex flex-col justify-center items-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      
      <div className="mb-6 w-full max-w-screen-lg">
        <div className={`h-10 md:h-14 rounded-lg ${isDarkMode ? 'bg-purple-700' : 'bg-rose-300'}`}></div>
      </div>
      <div className="mb-4 w-full max-w-screen-lg">
        <div className={`h-6 w-1/4 rounded-lg ${isDarkMode ? 'bg-purple-600' : 'bg-rose-200'}`}></div>
      </div>
      <div className="space-y-4 w-full max-w-screen-lg">
        {[...Array(3)].map((_, index) => (
          <div key={index} className={`h-4 rounded-lg ${isDarkMode ? 'bg-purple-700' : 'bg-rose-200'}`}></div>
        ))}
      </div>
      <div className="mt-8 flex items-center w-full max-w-screen-lg">
        <div className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-purple-700' : 'bg-rose-300'}`}></div>
        <div className="ml-4">
          <div className={`h-5 w-24 rounded-lg ${isDarkMode ? 'bg-purple-600' : 'bg-rose-200'}`}></div>
          <div className={`mt-2 h-4 w-40 rounded-lg ${isDarkMode ? 'bg-purple-700' : 'bg-rose-200'}`}></div>
        </div>
      </div>
    </div>
  );
};
