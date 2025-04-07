import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Github, Linkedin, Mail, MessageCircle, Sparkles, Brain, Users } from 'lucide-react';
import { Button } from '../components/ui/Moving-Border';
import Spline from '@splinetool/react-spline';

export const Homepage = () => {
  const navigate = useNavigate();
  const isUserSignedIn = () => localStorage.getItem('token') !== null;

  return (
    <div className="min-h-screen bg-[#0B1120] text-gray-100 overflow-hidden">
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] opacity-50" />
        
        <main className="container mx-auto px-4 py-16 relative z-10">
          {/* Hero Section */}
          <section className="text-center mb-24 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl -z-10" />
            <h1 className="text-3xl md:text-6xl font-bold mb-6 animate-float">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                Read-Me-Blog
              </span>
            </h1>
            <p className="text-xl text-blue-100/80 mb-8 max-w-2xl mx-auto transform hover:scale-105 transition-transform duration-300">
              Discover insightful articles and engage with our AI-powered chatbot for an enhanced learning experience.
            </p>
          </section>

          {/* Features Grid */}
          <section className="grid md:grid-cols-2 gap-8 max-w-4xl  mx-auto mb-24">
            {[
              {
                title: "Blog",
                icon: BookOpen,
                description: "Explore our collection of articles on various topics. Stay informed and inspired with our latest posts.",
                link: isUserSignedIn() ? '/blogs' : '/signin',
                buttonText: "Visit Blog",
                buttonIcon: Sparkles
              },
              {
                title: "RAG Chatbot",
                icon: MessageCircle,
                description: "Interact with our AI-powered chatbot. Get answers to your questions and dive deeper into our content.",
                link: { pathname: isUserSignedIn() ? '/blogs' : '/signin', search: '?isChatOpen=true' },
                buttonText: "Start Chatting",
                buttonIcon: Brain
              }
            ].map((feature, index) => (
              <div key={index} className="group">
                {/* <Button className="" borderRadius="0.75rem" duration={4000} > */}
                
                <div className="relative p-7 rounded-2xl transform transition-all duration-500 
                              hover:scale-[1.02] overflow-hidden
                              bg-gradient-to-br from-[#1a1f35]/90 to-[#111827]/90
                              border-2 border-blue-700/50 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 opacity-0 
                                group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="text-2xl flex items-center justify-center mb-6">
                    <feature.icon className="mr-3 h-8 w-8 text-blue-400 group-hover:text-indigo-400 transition-colors duration-300" />
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                      {feature.title}
                    </span>
                  </div>
                  <p className="text-center text-blue-100/80 mb-8 group-hover:text-blue-50 transition-colors duration-300">
                    {feature.description}
                  </p>
                  <div className="text-center">
                    <Link to={feature.link}
                          className="inline-flex items-center px-6 py-3 rounded-full
                                   bg-gradient-to-r from-blue-600 to-indigo-600
                                   text-white font-semibold transform transition-all duration-300 
                                   hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 
                                   border border-blue-400/20 group">
                      {feature.buttonText}
                      <feature.buttonIcon className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
                {/* </Button> */}
              </div>
              
            ))}
          </section>

          {/* Why Choose Us Section */}
          <section className="mb-24 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-indigo-500/10 rounded-3xl blur-3xl -z-10" />
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              Why Choose Read-Me-Blog?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  title: "Insightful Content",
                  description: "Curated articles on a wide range of topics to expand your knowledge.",
                  icon: BookOpen
                },
                {
                  title: "AI-Powered Assistance",
                  description: "Get instant answers and dive deeper with our RAG-enhanced chatbot.",
                  icon: Brain
                },
                {
                  title: "User-Friendly Experience",
                  description: "Elegant interface designed for easy navigation and readability.",
                  icon: Users
                }
              ].map((feature, index) => (
                <Button className='' duration={3000} borderRadius='0.75rem'  >
                <div key={index} className="group p-6 rounded-xl transform transition-all duration-500 
                                         hover:scale-[1.02] bg-gradient-to-br from-[#1a1f35]/90 to-[#111827]/90
                                         border border-blue-900/50 backdrop-blur-sm">
                  <feature.icon className="h-8 w-8 text-blue-400 group-hover:text-indigo-400 transition-colors duration-300 mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-3 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                    {feature.title}
                  </h3>
                  <p className="text-blue-100/80 text-center group-hover:text-blue-50 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
                </Button>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-blue-900/30 mt-16 backdrop-blur-sm bg-[#0B1120]/80 relative z-10">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  Read-Me-Blog
                </Link>
                <p className="text-sm text-blue-200/50 mt-2">© 2024 BlogRAG. All rights reserved.</p>
              </div>
              <div className="flex space-x-6 items-center">
                {[
                  { icon: Github, url: "https://github.com/kunj3740/" },
                  { icon: Linkedin, url: "https://www.linkedin.com/in/kunj-dave-b874302b1/" },
                  { icon: Mail, url: "mailto:kunjdave694@gmail.com" }
                ].map((social, index) => (
                  <Link key={index} to={social.url} target="_blank"
                        className="text-blue-400 hover:text-indigo-400 transform transition-all duration-300 hover:scale-110">
                    <social.icon size={24} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Homepage;