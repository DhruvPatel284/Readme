import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { Flag, Trash2, ExternalLink, AlertCircle, Search, Filter, RefreshCw, UserX, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ReportedBlog {
  id: number;
  reason: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  blog: {
    id: number;
    title: string;
    content: string;
    author: {
      id: number;
      name: string;
      username: string;
      isBlocked?: boolean;
    }
  };
  reporter: {
    id: number;
    name: string;
    username: string;
  };
}

export const AdminReportedBlogs = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [reports, setReports] = useState<ReportedBlog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [expandedReportId, setExpandedReportId] = useState<number | null>(null);
  const [deletingReportId, setDeletingReportId] = useState<number | null>(null);
  const [blockingUserId, setBlockingUserId] = useState<number | null>(null);
  const [unblockingUserId, setUnblockingUserId] = useState<number | null>(null);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authorization token not found');
      }
      
      const response = await axios.get(`${BACKEND_URL}/api/v1/report/admin/all`, {
        headers: { Authorization: token },
      });
      
      // Fetch blocked status for each author
      const reportsWithBlockStatus = await Promise.all(
        response.data.reports.map(async (report: ReportedBlog) => {
          try {
            const userResponse = await axios.get(`${BACKEND_URL}/api/v1/user/admin/users`, {
              headers: { Authorization: token },
            });
            
            const authorData = userResponse.data.users.find((user: any) => user.id === report.blog.author.id);
            if (authorData) {
              report.blog.author.isBlocked = authorData.isBlocked;
            }
            return report;
          } catch (error) {
            console.error('Failed to fetch author status:', error);
            return report;
          }
        })
      );
      
      setReports(reportsWithBlockStatus);
    } catch (error: any) {
      console.error('Failed to fetch reports:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to load reports. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDeleteReport = async (reportId: number) => {
    try {
      setDeletingReportId(reportId);
      setErrorMessage('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authorization token not found');
      }
      
      await axios.delete(`${BACKEND_URL}/api/v1/report/admin/delete/${reportId}?isAdmin=true`, {
        headers: { Authorization: token },
      });
      
      // Remove the deleted report from state
      setReports(reports.filter(report => report.id !== reportId));
      setSuccessMessage('Report deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error: any) {
      console.error('Failed to delete report:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to delete report. Please try again.');
    } finally {
      setDeletingReportId(null);
    }
  };

  const toggleExpandReport = (reportId: number) => {
    if (expandedReportId === reportId) {
      setExpandedReportId(null);
    } else {
      setExpandedReportId(reportId);
    }
  };

  const handleBlockUser = async (userId: number) => {
    try {
      setBlockingUserId(userId);
      setErrorMessage('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authorization token not found');
      }
      
      await axios.post(`${BACKEND_URL}/api/v1/user/admin/block/${userId}`, {}, {
        headers: { Authorization: token },
      });
      
      // Update the reports with the new blocked status
      setReports(reports.map(report => {
        if (report.blog.author.id === userId) {
          return {
            ...report,
            blog: {
              ...report.blog,
              author: {
                ...report.blog.author,
                isBlocked: true
              }
            }
          };
        }
        return report;
      }));
      
      setSuccessMessage('User blocked successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error: any) {
      console.error('Failed to block user:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to block user. Please try again.');
    } finally {
      setBlockingUserId(null);
    }
  };

  const handleUnblockUser = async (userId: number) => {
    try {
      setUnblockingUserId(userId);
      setErrorMessage('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authorization token not found');
      }
      
      await axios.post(`${BACKEND_URL}/api/v1/user/admin/unblock/${userId}`, {}, {
        headers: { Authorization: token },
      });
      
      // Update the reports with the new blocked status
      setReports(reports.map(report => {
        if (report.blog.author.id === userId) {
          return {
            ...report,
            blog: {
              ...report.blog,
              author: {
                ...report.blog.author,
                isBlocked: false
              }
            }
          };
        }
        return report;
      }));
      
      setSuccessMessage('User unblocked successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error: any) {
      console.error('Failed to unblock user:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to unblock user. Please try again.');
    } finally {
      setUnblockingUserId(null);
    }
  };

  // Filter and search reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporter.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.blog.author.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply filter
    if (filterBy === 'all') return matchesSearch;
    return matchesSearch && report.status === filterBy.toUpperCase();
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Truncate content for preview
  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode
        ? "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-gray-100"
        : "bg-gradient-to-br from-orange-100 via-rose-100 to-purple-100 text-gray-800"
    }`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl md:text-3xl font-bold ${
            isDarkMode
              ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
              : "text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-600"
          }`}>
            Reported Blogs
          </h1>
          <button 
            onClick={() => fetchReports()}
            className={`flex items-center p-2 rounded-md ${
              isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                : 'bg-white hover:bg-gray-100 text-gray-700'
            } transition-colors duration-300`}
            title="Refresh reports"
          >
            <RefreshCw size={18} />
            <span className="ml-2 hidden md:inline">Refresh</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className={`relative flex-grow ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 w-full rounded-md ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 focus:border-purple-500 text-white' 
                  : 'bg-white border-gray-300 focus:border-indigo-500 text-gray-800'
              } border focus:ring-2 focus:ring-opacity-50 transition-colors duration-300`}
            />
          </div>
          <div className="flex items-center">
            <div className={`mr-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <Filter size={18} />
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {errorMessage && (
          <div className={`mb-4 p-4 rounded-md ${
            isDarkMode ? 'bg-red-900/70 text-red-100' : 'bg-red-100 text-red-800'
          } flex items-center`}>
            <AlertCircle className="mr-2" size={20} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className={`mb-4 p-4 rounded-md ${
            isDarkMode ? 'bg-green-900/70 text-green-100' : 'bg-green-100 text-green-800'
          } flex items-center`}>
            <div className="mr-2">✓</div>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className={`p-6 rounded-lg shadow-md ${
                isDarkMode ? 'bg-gray-800/50' : 'bg-white'
              } animate-pulse`}>
                <div className="flex items-center justify-between">
                  <div className={`h-6 w-1/3 rounded ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                  }`}></div>
                  <div className={`h-6 w-24 rounded ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                  }`}></div>
                </div>
                <div className={`mt-4 h-4 w-3/4 rounded ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                }`}></div>
                <div className="mt-6 space-y-2">
                  <div className={`h-4 rounded ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                  }`}></div>
                  <div className={`h-4 rounded ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredReports.length === 0 ? (
          <div className={`p-8 text-center rounded-lg shadow-md ${
            isDarkMode ? 'bg-gray-800/50' : 'bg-white'
          }`}>
            <div className="mx-auto w-16 h-16 mb-4 opacity-50">
              <Flag size={64} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
            </div>
            <h3 className="text-xl font-semibold mb-2">No reports found</h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
              {searchTerm || filterBy !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'There are no reported blogs at this time'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredReports.map((report) => (
              <div 
                key={report.id} 
                className={`p-6 rounded-lg shadow-md ${
                  isDarkMode ? 'bg-gray-800/80' : 'bg-white'
                } transition-all duration-300 hover:shadow-lg border ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <div className="flex flex-wrap justify-between items-start mb-4">
                  <div>
                    <h2 className={`text-xl font-bold mb-1 ${
                      isDarkMode ? 'text-purple-300' : 'text-indigo-600'
                    }`}>
                      {report.blog.title}
                    </h2>
                    <div className={`flex items-center ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <span className="mr-3">ID: #{report.id}</span>
                      <span className="mr-3">•</span>
                      <span>{formatDate(report.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                    <Link
                      to={`/blog/${report.blog.id}`}
                      target="_blank"
                      className={`p-2 rounded-md flex items-center ${
                        isDarkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                      title="View blog"
                    >
                      <ExternalLink size={16} />
                    </Link>
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      disabled={deletingReportId === report.id}
                      className={`p-2 rounded-md flex items-center ${
                        isDarkMode 
                          ? 'bg-red-800/50 hover:bg-red-700 text-red-200' 
                          : 'bg-red-100 hover:bg-red-200 text-red-700'
                      }`}
                      title="Delete report"
                    >
                      {deletingReportId === report.id ? (
                        <span className="animate-pulse">•••</span>
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div className={`p-3 rounded-md mb-4 ${
                  isDarkMode ? 'bg-red-900/30' : 'bg-red-50'
                } flex items-start`}>
                  <Flag className={`mr-2 flex-shrink-0 ${
                    isDarkMode ? 'text-red-300' : 'text-red-500'
                  }`} size={16} />
                  <div>
                    <span className={`font-medium ${
                      isDarkMode ? 'text-red-300' : 'text-red-600'
                    }`}>
                      Report reason: 
                    </span>
                    <span className="ml-2">{report.reason}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className={`text-sm font-semibold mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Reported by
                    </h3>
                    <div className={`flex items-center ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      <div className={`w-8 h-8 rounded-full mr-2 flex items-center justify-center ${
                        isDarkMode ? 'bg-purple-900 text-purple-200' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {report.reporter.name ? report.reporter.name[0].toUpperCase() : report.reporter.username[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{report.reporter.name || report.reporter.username}</div>
                        <div className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          @ {report.reporter.username}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className={`text-sm font-semibold mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Blog author
                    </h3>
                    <div className={`flex items-center justify-between ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full mr-2 flex items-center justify-center ${
                          isDarkMode ? 'bg-purple-900 text-purple-200' : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {report.blog.author.name ? report.blog.author.name[0].toUpperCase() : report.blog.author.username[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{report.blog.author.name || report.blog.author.username}</div>
                          <div className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            @{report.blog.author.username}
                          </div>
                        </div>
                      </div>
                      
                      {/* Block/Unblock Author Button */}
                      {report.blog.author.isBlocked ? (
                        <button
                          onClick={() => handleUnblockUser(report.blog.author.id)}
                          disabled={unblockingUserId === report.blog.author.id}
                          className={`px-3 py-1 rounded-md flex items-center ${
                            isDarkMode 
                              ? 'bg-green-800/50 hover:bg-green-700 text-green-200' 
                              : 'bg-green-100 hover:bg-green-200 text-green-700'
                          }`}
                          title="Unblock user"
                        >
                          {unblockingUserId === report.blog.author.id ? (
                            <span className="animate-pulse">Unblocking...</span>
                          ) : (
                            <>
                              <UserCheck size={14} className="mr-1" />
                              <span>Unblock</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBlockUser(report.blog.author.id)}
                          disabled={blockingUserId === report.blog.author.id}
                          className={`px-3 py-1 rounded-md flex items-center ${
                            isDarkMode 
                              ? 'bg-red-800/50 hover:bg-red-700 text-red-200' 
                              : 'bg-red-100 hover:bg-red-200 text-red-700'
                          }`}
                          title="Block user"
                        >
                          {blockingUserId === report.blog.author.id ? (
                            <span className="animate-pulse">Blocking...</span>
                          ) : (
                            <>
                              <UserX size={14} className="mr-1" />
                              <span>Block</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <button 
                    onClick={() => toggleExpandReport(report.id)}
                    className={`text-sm ${
                      isDarkMode 
                        ? 'text-purple-400 hover:text-purple-300' 
                        : 'text-indigo-600 hover:text-indigo-700'
                    }`}
                  >
                    {expandedReportId === report.id ? 'Hide content' : 'Show blog content'}
                  </button>
                  
                  {expandedReportId === report.id && (
                    <div className={`mt-3 p-4 rounded-md ${
                      isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                    }`}>
                      <p className="whitespace-pre-wrap">
                        {report.blog.content}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};