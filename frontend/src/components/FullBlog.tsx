import React, { useState, useEffect } from 'react'
import { Blog } from "../hooks"
import { Appbar } from "./Appbar"
import axios from 'axios'
import { BACKEND_URL } from '../config'
import useContextedBlogs from '../context/theme'
import { useParams, useSearchParams } from 'react-router-dom'
import { AlertCircle, Flag, X } from 'lucide-react'

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
  const {blogs, getBlogs} = useContextedBlogs();
  const [searchParams] = useSearchParams();
  
  // Report related states
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportMessage, setReportMessage] = useState({ type: "", text: "" });

  // Predefined reasons for reporting
  const reportReasons = [
    "Inappropriate content",
    "Misinformation",
    "Hate speech or harassment",
    "Spam or scam",
    "Copyright violation",
    "Violence or self-harm",
    "Other"
  ];

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        console.log(searchParams.get('Published'));
        if(searchParams.get('Published')){
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("Authorization token not found");
          }
          const response = await axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers: { Authorization: token },
          });
          setBlog(response.data.blog)
        } else {
          const matchedBlog = blogs.find(blog => blog.id.toString() === id);
          if(matchedBlog)
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

  const handleReportSubmit = async () => {
    if (!selectedReason) {
      setReportMessage({
        type: "error",
        text: "Please select a reason for reporting"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      await axios.post(`${BACKEND_URL}/api/v1/report`, 
        {
          blogId: id,
          reason: selectedReason
        },
        {
          headers: { Authorization: token },
        }
      );

      setReportMessage({
        type: "success",
        text: "Thank you for reporting this blog. We'll review it shortly."
      });
      
      // Reset form after successful submission
      setSelectedReason("");
      
      // Close modal after a delay
      setTimeout(() => {
        setIsReportModalOpen(false);
        setReportMessage({ type: "", text: "" });
      }, 3000);
    } catch (error: any) {
      console.error("Failed to submit report:", error);
      setReportMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to submit report. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
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

  // Report Modal Component
  const ReportModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`w-full max-w-md p-6 rounded-lg shadow-lg ${
        isDarkMode 
          ? 'bg-gray-800 text-gray-100' 
          : 'bg-white text-gray-800'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <Flag className="mr-2" size={18} />
            Report Blog
          </h2>
          <button 
            onClick={() => {
              setIsReportModalOpen(false);
              setReportMessage({ type: "", text: "" });
              setSelectedReason("");
            }}
            className={`p-1 rounded-full ${
              isDarkMode 
                ? 'hover:bg-gray-700' 
                : 'hover:bg-gray-200'
            }`}
          >
            <X size={20} />
          </button>
        </div>
        
        {reportMessage.text && (
          <div className={`mb-4 p-3 rounded-md ${
            reportMessage.type === "error" 
              ? (isDarkMode ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-800')
              : (isDarkMode ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800')
          } flex items-start`}>
            <AlertCircle className="mr-2 flex-shrink-0 mt-1" size={16} />
            <span>{reportMessage.text}</span>
          </div>
        )}
        
        <div className="mb-4">
          <p className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Please select a reason for reporting this blog:
          </p>
          <div className="space-y-2 mt-3">
            {reportReasons.map((reason) => (
              <div key={reason} className="flex items-center">
                <input
                  type="radio"
                  id={reason}
                  name="reportReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={() => setSelectedReason(reason)}
                  className="mr-2"
                />
                <label 
                  htmlFor={reason} 
                  className={`cursor-pointer ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}
                >
                  {reason}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={() => {
              setIsReportModalOpen(false);
              setReportMessage({ type: "", text: "" });
              setSelectedReason("");
            }}
            className={`mr-2 px-4 py-2 rounded-md ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleReportSubmit}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-md ${
              isDarkMode 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            } flex items-center transition-colors duration-300 ${isSubmitting ? 'opacity-70' : ''}`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
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
                  <div className="flex justify-between items-start">
                    <div
                      className={`text-3xl md:text-5xl font-extrabold leading-tight md:leading-snug ${
                        isDarkMode
                          ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
                          : "text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-600"
                      }`}
                    >
                      {blog?.title}
                    </div>
                    
                    <button
                      onClick={() => setIsReportModalOpen(true)}
                      className={`flex items-center p-2 rounded-md ${
                        isDarkMode 
                          ? 'text-gray-400 hover:text-red-400 hover:bg-gray-800' 
                          : 'text-gray-500 hover:text-red-500 hover:bg-gray-100'
                      } transition-colors duration-300`}
                      title="Report this blog"
                    >
                      <Flag size={18} />
                    </button>
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
      
      {/* Report Modal */}
      {isReportModalOpen && <ReportModal />}
    </div>
  );
};