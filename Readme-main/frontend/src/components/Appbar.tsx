

// import { Avatar } from "./BlogCard"
// import { Link } from "react-router-dom"

// export const Appbar = () => {
//     return <div className="shadow-md  flex justify-between items-center h-[70px] px-10 py-4 ">
//         <Link to={'/blogs'} className=" text-2xl font-bold   cursor-pointer">
//                 Medium
//         </Link>
//         <div>
//             <Link to={`/publish`}>
//                 <button type="button" className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 ">New</button>
//             </Link>

//             <Avatar size={"big"} name="hhh" />
//         </div>
//     </div>
// }
import  { useState, useEffect } from 'react';
import { Avatar } from "./BlogCard";
import { Link, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"
interface MyToken {
  name: string;
  username:string;
  id: string;
}
export const Appbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = ()=>{
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      try {
        //@ts-ignore
        const decodedToken = jwtDecode<MyToken>(token);
        setUsername(decodedToken.username);
      } catch (error) {
        console.error('Failed to decode token', error);
      }
    }
    }
    getUser();
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="p-4 w-full shadow-md shadow-slate-100">
      <div className="container mx-auto flex items-center justify-between ">
        <div className="text-black text-xl font-semibold ml-5">
          <Link to='/blogs' className="hover:text-gray-300">
            Read-Me
          </Link>
        </div>
        <div className="flex items-center justify-center space-x-4">
          {isLoggedIn ? (
            <>
              <Link
                to="/publish"
                className="mr-4  text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 transition duration-150 ease-in-out"
              >
                New
              </Link>
              <div className="">
                <button onClick={toggleDropdown} className="focus:outline-none mb-2">
                  <Avatar size={"big"}  name={username}/>
                </button>
                {dropdownVisible && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-transform transform duration-200 origin-top-right">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <Link
                        to='/myblogs'
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition duration-150 ease-in-out"
                        role="menuitem"
                        onClick={() => { navigate('/myblogs'); }}
                      >
                        My Blogs
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition duration-150 ease-in-out"
                        role="menuitem"
                      >
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
              className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 transition duration-150 ease-in-out"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
