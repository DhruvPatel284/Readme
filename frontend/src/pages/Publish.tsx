import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {  toast } from 'react-hot-toast'
import { BACKEND_URL, RAG_URL } from '../config'
import { GrammarCorrection } from '../components/ui/GrammarCorrection'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import useContextedBlogs from '../context/theme'

// Grammar correction function (using OpenAI as an example)
const correctText = async (text: string) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${RAG_URL}/grammar-correction`,
      { text },
      {
        headers: {
          Authorization: `${token}`, // Add Bearer token
        },
      }
    );
    return response.data.correctedText
  } catch (error) {
    console.error('Error correcting text:', error)
    toast.error('Failed to correct text')
    return text
  }
}

// Category type definition
interface Category {
  id: number;
  name: string;
}

// Custom Button Component
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' }> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  ...props 
}) => {
  const baseStyle = 'px-4 py-2 rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
  const variantStyle = variant === 'primary' 
    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-black hover:from-purple-700 hover:to-blue-700' 
    : 'border border-purple-500 text-purple-500 hover:bg-purple-100'

  return (
    <button className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
      {children}
    </button>
  )
}

// Custom Input Component
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => {
  return (
    <input 
      className={`w-full px-3 py-2 bg-purple-500/20 border border-purple-500/50 rounded-md text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
      {...props}
    />
  )
}

// Custom Select Component
const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className = '', ...props }) => {
  return (
    <select 
      className={`w-full px-3 py-2 bg-purple-500/20 border border-purple-500/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
      {...props}
    />
  )
}

// Custom Textarea Component
const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className = '', ...props }) => {
  return (
    <textarea 
      className={`w-full px-3 py-2 bg-purple-500/20 border border-purple-500/50 rounded-md text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y ${className}`}
      {...props}
    />
  )
}

export const Publish: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [showCorrectionEffect, setShowCorrectionEffect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();
  const { setLoading, loading } = useContextedBlogs();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BACKEND_URL}/api/v1/category`, {
          headers: {
            Authorization: token,
          }
        });
        
        // Assuming the API returns an array of categories
        const categoriesData = Array.isArray(response.data) 
          ? response.data 
          : Array.isArray(response.data.categories) 
            ? response.data.categories 
            : [response.data.category]; // Handle single category object
            
        setCategories(categoriesData);
        
        // Set the first category as default if available
        if (categoriesData.length > 0) {
          setSelectedCategoryId(categoriesData[0].id);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handlePublish = useCallback(async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    if (!selectedCategoryId) {
      toast.error('Please select a category');
      return;
    }

    setIsPublishing(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/blog`, {
        title,
        content,
        categoryId: selectedCategoryId
      }, {
        headers: {
          Authorization: localStorage.getItem('token'),
        }
      });

      await axios.post(`${RAG_URL}/embed`, {
        title,
        content,
      });
      setLoading(!loading);
      toast.success('Blog Published Successfully!');
      // window.location.href = `/blog/${response.data.id}`
      navigate(`/blog/${response.data.id}?Published=true`);
    } catch (error) {
      console.error('Error publishing blog:', error);
      toast.error('Failed to publish blog');
    } finally {
      setIsPublishing(false);
    }
  }, [title, content, selectedCategoryId, navigate, loading, setLoading]);

  const handleCorrection = useCallback(async () => {
    if (!content.trim()) {
      toast.error('Please write some content to correct');
      return;
    }

    setIsCorrecting(true);
    try {
      const correctedText = await correctText(content);
      setContent(correctedText);
      setShowCorrectionEffect(true);
      setShowConfetti(true);
      toast.success('Content corrected successfully!');
    } catch (error) {
      console.error('Error correcting content:', error);
    } finally {
      setIsCorrecting(false);
    }
  }, [content]);

  useEffect(() => {
    if (showCorrectionEffect) {
      const timer = setTimeout(() => {
        setShowCorrectionEffect(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showCorrectionEffect]);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const wordCount = content.trim().split(/\s+/).length;

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
      <div className="container mx-auto px-4 py-8">
        <div className="w-full max-w-4xl mx-auto bg-black/50 backdrop-blur-md shadow-xl rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl md:text-4xl leading-tight md:leading-snug font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-600 mb-6">
              Create Your Blog Post
            </h1>
            <div className="space-y-6">
              <Input
                type="text"
                placeholder="Enter your title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl font-bold"
              />
              
              <div className="relative">
                {isLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2 text-purple-300">Loading categories...</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label htmlFor="category" className="block text-purple-300 text-sm font-medium">
                      Select Category
                    </label>
                    <Select
                      id="category"
                      value={selectedCategoryId || ''}
                      onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
                    >
                      <option value="" className='text-black' disabled selected>Choose a category</option>
                      {categories.map((category) => (
                        <option className='text-black font-semibold ' key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <AnimatePresence>
                  {showCorrectionEffect && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 bg-green-500/20 rounded-md pointer-events-none"
                    />
                  )}
                </AnimatePresence>
                <Textarea
                  placeholder="Write your blog content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  className={`transition-all duration-300 ${showCorrectionEffect ? 'ring-2 ring-green-500' : ''}`}
                />
              </div>
              <div className="flex justify-between items-center text-sm text-purple-300">
                <span>{wordCount} words</span>
                <span>{content.length} characters</span>
              </div>
            </div>
          </div>
          <div className="bg-black/30 px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-between">
              <GrammarCorrection 
                onCorrect={handleCorrection}
                isLoading={isCorrecting}
              />
              <Button 
                onClick={handlePublish} 
                disabled={isPublishing || !selectedCategoryId}
                className="w-full sm:w-auto"
              >
                {isPublishing ? 'Publishing...' : 'Publish Post'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
        />
      )}
    </div>
  );
};