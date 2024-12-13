import React, { useState, useEffect } from 'react'
import { Blog } from "../hooks"
import { Appbar } from "./Appbar"
import axios from 'axios'
import { BACKEND_URL } from '../config'
import useContextedBlogs from '../context/theme'
import { useParams, useSearchParams } from 'react-router-dom'

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

export const FullBlog = ({ id }: { id: string }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [blog, setBlog] = useState<Blog | null>(null);
  const {blogs , getBlogs} = useContextedBlogs();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        console.log(searchParams.get('Published'));
        if( searchParams.get('Published') ){
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("Authorization token not found");
          }
          const response = await axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers: { Authorization: token },
          });
          setBlog(response.data.blog)
        }else{
          const matchedBlog = blogs.find(blog => blog.id.toString() === id);
          if( matchedBlog )
            setBlog(matchedBlog);
        }
        
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, []);

  

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const SkeletonLine = ({ width }: { width: string }) => (
    <div className={`h-4 ${width} rounded-full ${isDarkMode ? 'bg-purple-700' : 'bg-gray-300'} animate-pulse`}></div>
  );

  const ContentSkeleton = () => (
    <div className="space-y-8 mt-[50px]">
      <div className={`h-14 w-3/4 rounded-full ${isDarkMode ? 'bg-purple-700' : 'bg-gray-300'} animate-pulse`}></div>
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-purple-700' : 'bg-gray-300'} animate-pulse`}></div>
        <div className="space-y-2 flex-1">
          <SkeletonLine width="w-1/4" />
          <SkeletonLine width="w-1/3" />
        </div>
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <SkeletonLine key={i} width="w-full" />
        ))}
      </div>
    </div>
  );

  const AuthorSkeleton = () => (
    <div className="space-y-4 mt-[50px]">
      <div className={`h-8 w-1/3 rounded-full ${isDarkMode ? 'bg-purple-700' : 'bg-gray-300'} animate-pulse`}></div>
      <div className="flex items-center space-x-4">
        <div className={`w-20 h-20 rounded-full ${isDarkMode ? 'bg-purple-700' : 'bg-gray-300'} animate-pulse`}></div>
        <div className="space-y-2 flex-1">
          <SkeletonLine width="w-1/2" />
          <SkeletonLine width="w-2/3" />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div
        className={`min-h-screen transition-colors duration-300 ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900"
            : "bg-gradient-to-br from-orange-100 via-rose-100 to-purple-100"
        }`}
      >
        <div className="flex justify-center">
          <div className="grid grid-cols-12 px-5 w-full max-w-screen-xl pt-8">
            <div className="col-span-12 md:col-span-8">
              {isLoading ? (
                <ContentSkeleton />
              ) : (
                <>
                  <div
                    className={`text-3xl md:text-5xl font-extrabold leading-tight md:leading-snug ${
                      isDarkMode
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
                        : "text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-600"
                    }`}
                  >
                    {blog?.title}
                  </div>
                  <div
                    className={`pt-2 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {formatDate(blog?.publishedDate || "")}
                  </div>
                  <div
                    className="pt-4 whitespace-pre-wrap"
                    style={{
                      color: isDarkMode ? "rgba(230, 230, 255, 1)" : "rgba(50, 50, 50, 1)",
                    }}
                  >
                    {blog?.content}
                  </div>
                </>
              )}
            </div>
            <div className="col-span-12 md:col-span-4 md:ml-16 mt-8 md:mt-0">
              {isLoading ? (
                <AuthorSkeleton />
              ) : (
                <div>
                  <div
                    className={`text-lg ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Author
                  </div>
                  <div className="flex w-full mt-2">
                    <div className="pr-4 flex flex-col justify-center">
                      <Avatar
                        name={blog?.author?.name || "Anonymous"}
                        isDarkMode={isDarkMode}
                      />
                    </div>
                    <div>
                      <div
                        className={`text-xl font-bold ${
                          isDarkMode ? "text-purple-200" : "text-indigo-600"
                        }`}
                      >
                        {blog?.author?.name || "Anonymous"}
                      </div>
                      <div
                        className={`pt-2 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Random catch phrase about the author's ability to grab
                        the user's attention
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {!isChatOpen && <div className="h-[50px]"></div>}
      </div>
    </div>

  );
};
