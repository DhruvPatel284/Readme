'use client'

import React, { useCallback,useState, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Toaster, toast } from 'react-hot-toast'
import { BACKEND_URL, RAG_URL } from '../config'
import { Appbar } from '../components/Appbar'




// Custom Button Component
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' }> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  ...props 
}) => {
  const baseStyle = 'px-4 py-2 rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
  const variantStyle = variant === 'primary' 
    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700' 
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

// Custom Textarea Component
const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className = '', ...props }) => {
  return (
    <textarea 
      className={`w-full px-3 py-2 bg-purple-500/20 border border-purple-500/50 rounded-md text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y ${className}`}
      {...props}
    />
  )
}

// Icon components
const BoldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>

const ItalicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>

const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>

const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>

export const Publish: React.FC = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const navigate = useNavigate()
  const handlePublish = useCallback(async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in both title and content')
      return
    }

    setIsPublishing(true)
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/blog`, {
        title,
        content
      }, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })

      await axios.post(`${RAG_URL}`, {
        title,
        content
      })

      toast.success('Blog Published Successfully!')
      navigate(`/blog/${response.data.id}`)
    } catch (error) {
      toast.error('Error publishing blog!')
    } finally {
      setIsPublishing(false)
    }
  }, [title, content, navigate])

  const wordCount = content.trim().split(/\s+/).length

  return (
    <div className="min-h-screen transition-colors duration-300  bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
      <Toaster position="top-center" />
      <Appbar />
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
              <div className="space-y-2">
                <Textarea
                    placeholder="Write your blog content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    />
              </div>
              <div className="flex justify-between items-center text-sm text-purple-300">
                <span>{wordCount} words</span>
                <span>{content.length} characters</span>
              </div>
            </div>
          </div>
          <div className="bg-black/30 px-6 py-4 flex justify-between items-center">
            
            <Button
              onClick={handlePublish}
              disabled={isPublishing}
            >
              {isPublishing ? 'Publishing...' : 'Publish Post'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}