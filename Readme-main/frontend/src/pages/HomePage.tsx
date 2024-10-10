// import { useNavigate } from 'react-router-dom';
// import { Appbar } from '../components/Appbar';


// export const Homepage = () => {
//   const navigate = useNavigate();

//   // Function to check if the user is signed in by looking for a JWT in localStorage
//   const isUserSignedIn = () => {
//     return localStorage.getItem('token') !== null;
//   };

//   const handleViewMoreClick = () => {
//     navigate('/blogs');
//   };

//   const handleLoginClick = () => {
//     navigate('/signin');
//   };

//   return (
//     <div className="min-h-screen w-full bg-slate-300">
//         <div className='shadow-md shadow-slate-600'>
//           <Appbar />
//         </div>
//       {/* Main Content Container */}
//       <div className="flex flex-col md:flex-row bg-slat-50">
//         {/* Hero Section */}
//         <section className="flex flex-col items-start text-left  py-20 md:w-[47%] px-8">
//           <h1 className="text-3xl  font-bold mb-4 text-slate-700">Read-Me : Your Destination for Quality Content</h1>
//           <p className="text-gray-600 mt-2 mb-8">
//          ReadMe is committed to delivering high-quality content that captivates and educates. From  in-depth articles to quick reads, our blog is your one-stop destination for all  things    interesting and enlightening.
//           </p>
          
//           {isUserSignedIn() ? (
//             <button
//               className="bg-blue-600 text-white hover:bg-blue-700 font-bold rounded-full md:w-[30%] md:rounded px-6 py-2 "
//               onClick={handleViewMoreClick}
//             >
//               View more
//             </button>
//           ) : (
//             <button
//               className="bg-blue-600 text-white px-6 py-2 rounded-full"
//               onClick={handleLoginClick}
//             >
//               View more
//             </button>
//           )}
//         </section>

//         {/* Template Preview Section */}
//         <section className="flex justify-center  items-center py-20  md:w-[57%]">
//           <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-8">
//             <img src="../images/home1.jpg" alt="Template 1" className="hover:scale-110   shadow-slate-400  transition-all shadow-xl shadow-slate-300  border-2  rounded-lg max-h-[200px] max-w-[300px]" />
//             <img src="../images/home2.jpg" alt="Template 2" className="hover:scale-110  shadow-slate-400 transition-all shadow-xl shadow-slate-300  border-2 rounded-lg max-h-[200px] min-w-[300px]" />
//             <img src="../images/home3.jpg" alt="Template 3" className="hover:scale-110  shadow-slate-400 transition-all shadow-xl shadow-slate-300 border-2 rounded-lg max-h-[200px] min-w-[300px]" />
//             <img src="../images/home4.jpg" alt="Template 4" className="hover:scale-110    shadow-slate-400  transition-all shadow-xl  shadow-slate-300 rounded-lg  border-2 max-h-[200px] min-w-[300px] max-w-[300px] min-h-[200px]" />
//           </div>
//           {/* <div className='h-[200px]'>
//             <img src="../images/bloghome.jpg" alt="" />
//           </div> */}
//         </section>
//       </div>
//     </div>
//   );
// }; 
// export default Homepage;

import React from "react";
import {Link} from 'react-router-dom';
import { BookOpen, MessageCircle, Moon, Search } from "lucide-react";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-purple-500">
            BlogRAG
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link to="/blog" className="hover:text-purple-500 transition-colors">
              Blog
            </Link>
            <Link to="/chatbot" className="hover:text-purple-500 transition-colors">
              Chatbot
            </Link>
            <Link to="/about" className="hover:text-purple-500 transition-colors">
              About
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
              <Moon className="h-5 w-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <img src="/placeholder-user.jpg" alt="User" className="rounded-full" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to BlogRAG</h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Discover insightful articles and engage with our AI-powered chatbot for an enhanced learning experience.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-gray-800 border border-gray-700 hover:border-purple-500 transition-colors p-6 rounded-lg">
            <div className="text-2xl flex items-center justify-center mb-4">
              <BookOpen className="mr-2 h-6 w-6 text-purple-500" />
              Blog
            </div>
            <p className="text-center text-gray-400 mb-6">
              Explore our collection of articles on various topics. Stay informed and inspired with our latest posts.
            </p>
            <div className="text-center">
              <Link to="/blog" className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                Visit Blog
              </Link>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 hover:border-purple-500 transition-colors p-6 rounded-lg">
            <div className="text-2xl flex items-center justify-center mb-4">
              <MessageCircle className="mr-2 h-6 w-6 text-purple-500" />
              RAG Chatbot
            </div>
            <p className="text-center text-gray-400 mb-6">
              Interact with our AI-powered chatbot. Get answers to your questions and dive deeper into our content.
            </p>
            <div className="text-center">
              <Link to="/chatbot" className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                Start Chatting
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Why Choose BlogRAG?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold mb-2">Insightful Content</h3>
              <p className="text-gray-400">
                Curated articles on a wide range of topics to expand your knowledge.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Assistance</h3>
              <p className="text-gray-400">
                Get instant answers and dive deeper with our RAG-enhanced chatbot.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">User-Friendly Experience</h3>
              <p className="text-gray-400">
                Elegant interface designed for easy navigation and readability.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link to="/" className="text-xl font-bold text-purple-500">
                BlogRAG
              </Link>
              <p className="text-sm text-gray-500 mt-1">© 2024 BlogRAG. All rights reserved.</p>
            </div>
            <nav className="flex space-x-4">
              <Link to="/terms" className="text-sm text-gray-400 hover:text-purple-500 transition-colors">
                Terms
              </Link>
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-purple-500 transition-colors">
                Privacy
              </Link>
              <Link to="/cookies" className="text-sm text-gray-400 hover:text-purple-500 transition-colors">
                Cookies
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
