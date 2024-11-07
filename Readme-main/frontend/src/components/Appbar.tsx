import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from 'react-hot-toast';
import { PenSquare, User, LogOut, Sun, Moon } from 'lucide-react';

interface MyToken {
  name: string;
  username: string;
  id: string;
}
const isEdge = /Edg/.test(navigator.userAgent)

function Avatar({ name, isDarkMode }: { name: string; isDarkMode: boolean }) {
  return (
    <div className={`w-10 h-10 rounded-full border-2 ${
      isDarkMode 
        ? 'border-purple-400 bg-purple-900 text-purple-100' 
        : 'border-indigo-400 bg-indigo-100 text-indigo-900'
    } flex items-center justify-center transition-all duration-300 hover:bg-opacity-80`}>
      <span className="text-lg font-medium">{name[0].toUpperCase()}</span>
    </div>
  )
}

export const Appbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = () => {
      const token = localStorage.getItem('token');
      console.log(token)
      if (token) {
        setIsLoggedIn(true);
        try {
          const decodedToken = jwtDecode<MyToken>(token);
          setUsername(decodedToken.username);
        } catch (error) {
          console.error('Failed to decode token', error);
        }
      }
    }
    getUser();

    // Check for saved theme preference
  }, []);

  useEffect(() => {
    // Apply theme to body
    document.body.classList.toggle('dark', isDarkMode);
    // Save theme preference
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    toast.success("Logged Out!", {
      style: {
        background: isDarkMode ? '#4B5563' : '#ffffff',
        color: isDarkMode ? '#E5E7EB' : '#1F2937',
      },
      iconTheme: {
        primary: '#10B981',
        secondary: isDarkMode ? '#1F2937' : '#ffffff',
      },
    });
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  
  return (
    <nav className={`${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-orange-100 via-rose-100 to-purple-100'} p-4 w-full shadow-lg shadow-purple-800 transition-colors duration-300`}>
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/blogs" className={`text-xl font-semibold items-center ${isEdge ? 'ml-3' : 'ml-[5%]' } flex`}>
          <div className='h-[30px] mr-2'>
            <img className='rounded h-[30px]' src="../images/articlenew.jpg" alt="Read-Me Logo" />
          </div>
          <div className={`text-2xl font-bold ${isDarkMode ? 'text-purple-300' : 'text-indigo-600'}`}>
            Read-Me
          </div>
        </Link>
        <div className={`flex items-center justify-center space-x-4 ${isEdge ? '' : 'md:mr-[3%]' }`}>
                
          {isLoggedIn ? (
            <>
              <Link
                to="/publish"
                className={`mr-4 font-medium rounded-full text-sm px-5 py-2.5 text-center transition duration-300 ease-in-out flex items-center ${
                  isDarkMode 
                    ? 'text-gray-900 bg-purple-400 hover:bg-purple-500' 
                    : 'text-white bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                <PenSquare className="w-4 h-4 mr-2" />
                New
              </Link>
              <div className="relative">
                <button 
                  onClick={toggleDropdown} 
                  className="focus:outline-none "
                  aria-haspopup="true"
                  aria-expanded={dropdownVisible}
                >
                  <Avatar name={username} isDarkMode={isDarkMode} />
                </button>
                {dropdownVisible && (
                  <div className={`absolute  right-0 mt-2 w-48 rounded-md shadow-lg ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  } ring-1 ring-black ring-opacity-5 transition-all duration-200 origin-top-right`}>
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <Link
                        to='/myblogs'
                        className={`flex items-center px-4 py-2 text-sm ${
                          isDarkMode 
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        } transition duration-150 ease-in-out`}
                        role="menuitem"
                        onClick={() => { navigate('/myblogs'); setDropdownVisible(false); }}
                      >
                        <User className="w-4 h-4 mr-2" />
                        My Blogs
                      </Link>
                      <button
                        onClick={() => { handleLogout(); setDropdownVisible(false); }}
                        className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                          isDarkMode 
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        } transition duration-150 ease-in-out`}
                        role="menuitem"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/signin"
              className={`font-medium rounded-full text-sm px-5 py-2.5 text-center transition duration-300 ease-in-out ${
                isDarkMode 
                  ? 'text-gray-900 bg-purple-400 hover:bg-purple-500' 
                  : 'text-white bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};