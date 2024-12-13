import { Link, useNavigate } from 'react-router-dom';
import { Appbar } from '../components/Appbar';
import { BookOpen, Github, Linkedin, Mail, MessageCircle, Sparkles, Brain, Users } from 'lucide-react';

export const Homepage = () => {
  const navigate = useNavigate();
  const isUserSignedIn = () => localStorage.getItem('token') !== null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 overflow-hidden">
      <div className="bg-mesh relative">
        <div className="bg-lines" />
        
        
        <main className="container mx-auto px-4 py-16 relative z-10">
          {/* Hero Section */}
          <section className="text-center mb-24 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-cyan-500/5 to-transparent rounded-full blur-3xl -z-10 animate-pulse-slow" />
            <h1 className="text-3xl md:text-6xl font-bold mb-6 animate-float">
              <span className="text-gradient">Read-Me-Blog</span>
            </h1>
            <p className="text-xl text-gray-400/90 mb-8 max-w-2xl mx-auto transform hover:scale-105 transition-transform duration-300">
              Discover insightful articles and engage with our AI-powered chatbot for an enhanced learning experience.
            </p>
          </section>

          {/* Features Grid */}
          <section className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24">
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
                <div className="glass-card neon-border p-8 rounded-2xl transform transition-all duration-500 
                              hover:scale-[1.02] hover:bg-gray-800/40 animate-border relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-cyan-500/5 opacity-0 
                                group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="text-2xl flex items-center justify-center mb-6">
                    <feature.icon className="mr-3 h-8 w-8 text-violet-400 group-hover:text-cyan-400 transition-colors duration-300 animate-float" />
                    <span className="text-gradient font-bold">{feature.title}</span>
                  </div>
                  <p className="text-center text-gray-400/90 mb-8 group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                  <div className="text-center">
                    <Link to={feature.link}
                          className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 
                                   text-white font-semibold transform transition-all duration-300 hover:scale-105 hover:shadow-lg
                                   hover:shadow-violet-500/25 group">
                      {feature.buttonText}
                      <feature.buttonIcon className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Why Choose Us Section */}
          <section className="mb-24 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-cyan-500/5 rounded-3xl blur-3xl -z-10 animate-pulse-slow" />
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gradient animate-float">
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
                <div key={index} className="group glass-card neon-border p-6 rounded-xl
                                         transform transition-all duration-500 hover:scale-[1.02] hover:bg-gray-800/40">
                  <feature.icon className="h-8 w-8 text-violet-400 group-hover:text-cyan-400 transition-colors duration-300 mb-4 mx-auto animate-float" />
                  <h3 className="text-xl font-semibold mb-3 text-center group-hover:text-gradient transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400/90 text-center group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 mt-16 backdrop-blur-sm bg-black/40 relative z-10">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <Link to="/" className="text-2xl font-bold text-gradient">
                  Read-Me-Blog
                </Link>
                <p className="text-sm text-gray-500 mt-2">© 2024 BlogRAG. All rights reserved.</p>
              </div>
              <div className="flex space-x-6 items-center">
                {[
                  { icon: Github, url: "https://github.com/kunj3740/" },
                  { icon: Linkedin, url: "https://www.linkedin.com/in/kunj-dave-b874302b1/" },
                  { icon: Mail, url: "mailto:kunjdave694@gmail.com" }
                ].map((social, index) => (
                  <Link key={index} to={social.url} target="_blank"
                        className="text-gray-400 hover:text-violet-400 transform transition-all duration-300 hover:scale-110">
                    <social.icon size={24} className="hover:animate-float" />
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