
// import { Avatar } from "./BlogCard"
// import { Link } from "react-router-dom"

// export const Appbar = () => {
//     return <div className="border-b flex justify-between px-10 py-4">
//         <Link to={'/blogs'} className="flex flex-col justify-center cursor-pointer">
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

// import React, { useState } from 'react';
// import { Avatar } from "./BlogCard";
// import { Link, useNavigate } from "react-router-dom";

// export const Appbar = () => {
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const navigate = useNavigate();

//   const toggleDropdown = () => {
//     setDropdownVisible(!dropdownVisible);
//   };

//   const handleLogout = () => {
//     // Clear JWT or any authentication tokens here
//     localStorage.removeItem('jwt');
//     navigate('/signin');
//   };

//   return (
//     <nav className=" p-4">
//       <div className="container mx-auto flex items-center justify-between">
//         <div className="text-black text-xl font-semibold">
//           <Link to='/blogs' className="hover:text-gray-300">
//             Medium
//           </Link>
//         </div>
//         <div className="flex items-center space-x-4">
//           <Link to="/publish" className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">
//             New
//           </Link>
//           <div className="relative">
//             <button onClick={toggleDropdown} className="focus:outline-none">
//               <Avatar size={"big"} name="hhh" />
//             </button>
//             {dropdownVisible && (
//               <div className="absolute bg-slate-250 right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-transform transform duration-200 origin-top-right">
//                 <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
//                   <Link
//                     to='/myblogs'
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition duration-150 ease-in-out"
//                     role="menuitem"
//                   >
//                     My Blogs
//                   </Link>
//                   <button
//                     onClick={handleLogout}
//                     className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition duration-150 ease-in-out"
//                     role="menuitem"
//                   >
//                     Log Out
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

import React, { useState } from 'react';
import { Avatar } from "./BlogCard";
import { Link, useNavigate } from "react-router-dom";

export const Appbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    // Clear JWT or any authentication tokens here
    localStorage.removeItem('token');

    navigate('/');
    
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-white text-xl font-semibold">
          <Link to='/blogs' className="hover:text-gray-300">
            Medium
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to="/publish"
            className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 transition duration-150 ease-in-out"
          >
            New
          </Link>
          <div className="relative">
            <button onClick={toggleDropdown} className="focus:outline-none">
              <Avatar size={"big"} name="hhh" />
            </button>
            {dropdownVisible && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-transform transform duration-200 origin-top-right">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <Link
                    to='/myblogs'
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition duration-150 ease-in-out"
                    role="menuitem"
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
        </div>
      </div>
    </nav>
  );
};

