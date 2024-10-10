'use client'

import React from 'react'
import { Link } from "react-router-dom"
import { CalendarIcon, ClockIcon, TagIcon } from "lucide-react"

interface BlogCardProps {
  id: number
  authorName: string
  title: string
  content: string
  publishedDate: Date
  tags?: string[]
  isDarkMode?: boolean
}

const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(dateObj)
}

const estimateReadTime = (content: string): number => {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

function Avatar({ name, isDarkMode }: { name: string; isDarkMode?: boolean }) {
  return (
    <div className={`w-12 h-12 rounded-full border-2 ${
      isDarkMode 
        ? 'border-purple-400 bg-purple-900 text-purple-100' 
        : 'border-indigo-400 bg-indigo-100 text-indigo-900'
    } flex items-center justify-center transition-colors duration-300`}>
      <span className="text-lg font-bold">{name[0].toUpperCase()}</span>
    </div>
  )
}

function Badge({ children, isDarkMode }: { children: React.ReactNode; isDarkMode?: boolean }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
      isDarkMode 
        ? 'bg-purple-900 text-purple-100' 
        : 'bg-indigo-100 text-indigo-800'
    } transition-colors duration-300`}>
      <TagIcon className="w-3 h-3 mr-1" />
      {children}
    </span>
  )
}

export function BlogCard({
  id,
  authorName,
  title,
  content,
  publishedDate,
  tags = [],
  isDarkMode = true
}: BlogCardProps) {
  const readTime = estimateReadTime(content)

  return (
    <Link to={`/blog/${id}`} className="block">
      <div className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 ${
        isDarkMode 
          ? 'bg-gray-800 text-gray-100' 
          : 'bg-white text-gray-900'
      }`}>
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar name={authorName} isDarkMode={isDarkMode} />
            <div>
              <h3 className={`text-lg font-semibold ${
                isDarkMode ? 'text-purple-300' : 'text-indigo-700'
              }`}>{authorName}</h3>
              <div className={`flex items-center text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <CalendarIcon className="mr-1 h-3 w-3" />
                {formatDate(publishedDate)}
              </div>
            </div>
          </div>
          <h2 className={`text-2xl font-bold mb-2 line-clamp-2 ${
            isDarkMode ? 'text-purple-100' : 'text-indigo-900'
          }`}>{title}</h2>
          <p className={`mb-4 line-clamp-3 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>{content}</p>
          <div className="flex justify-between items-center">
            <div className={`flex items-center text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <ClockIcon className="mr-1 h-4 w-4" />
              {readTime} min read
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} isDarkMode={isDarkMode}>{tag}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}