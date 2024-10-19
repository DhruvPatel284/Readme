import { Link, useNavigate } from 'react-router-dom';
import { Appbar } from '../components/Appbar';
import { BookOpen, Github, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';


export const Homepage = () => {
  const navigate = useNavigate();

  // Function to check if the user is signed in by looking for a JWT in localStorage
  const isUserSignedIn = () => {
    return localStorage.getItem('token') !== null;
  };

  const handleViewMoreClick = () => {
    navigate('/blogs');
  };

  const handleLoginClick = () => {
    navigate('/signin');
  };

  return (
    
        <div className="min-h-screen bg-gradient-to-br from-gray-900  to-violet-900 text-gray-100">
          <div className='shadow-md shadow-slate-600'>
            <Appbar />
          </div>
          <main className="container mx-auto px-4 py-16">
            <section className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl leading-tight md:leading-snug font-bold mb-4 text-transparent bg-gradient-to-r bg-clip-text from-blue-500 to-green-600">Welcome to Read-Me-Blog</h1>
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
                  <Link to={ isUserSignedIn() ? '/blogs' : '/signin'} className="bg-purple-500 font-semibold text-black px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
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
                  <Link to= {{pathname: isUserSignedIn()  ? '/blogs' : '/signin',
                        search: '?isChatOpen=true'}} 
                       className="bg-purple-500 text-black font-semibold px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                    Start Chatting
                  </Link>
                </div>
              </div>
            </section>

            <section className="mt-16 text-center">
              <h2 className="text-2xl font-bold mb-4 leading-tight md:leading-snug  text-transparent bg-gradient-to-r bg-clip-text from-green-400 to-blue-600">Why Choose Read-Me-Blog?</h2>
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
                    Read-Me-Blog
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">© 2024 BlogRAG. All rights reserved.</p>
                </div>
                <div className="flex justify-evenly items-center w-[30%] md:w-[12%] mt-2 md:mt-0">
                  <Link to={"https://github.com/kunj3740/"} target="_blank">
                    <Github size={20} />
                  </Link>
                  <Link
                    to={"https://www.linkedin.com/in/kunj-dave-b874302b1/"}
                    target="_blank"
                  >
                    <Linkedin size={20} />
                  </Link>
                  <Link to={"mailto:kunjdave694@gmail.com"} target="_blank">
                    <Mail size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
   
  );
}; 
export default Homepage;