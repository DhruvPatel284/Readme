import React from 'react'
import { Appbar } from '../components/Appbar';

export const Home = () => {
    return (
        <div className="min-h-screen w-full">
          <Appbar />
    
          {/* Main Content Container */}
          <div className="flex flex-col md:flex-row">
            {/* Hero Section */}
            <section className="flex flex-col items-start text-left bg-blue-50 py-20 md:w-1/2 px-8">
              <h1 className="text-3xl font-bold mb-4">Free Tailwind CSS Templates</h1>
              <p className="text-gray-600 mb-8">Free and Premium Tailwind CSS templates specially crafted for - Startup, App, SaaS, Landing Page, and Business websites. Create and launch your web projects with ready-to-use and hand-crafted Tailwind Templates.</p>
              
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full">All Templates</button>
            </section>
      
            {/* Template Preview Section */}
            <section className="flex justify-center items-center py-20 bg-blue-50 md:w-1/2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <img src="https://placehold.co/300x200" alt="Template 1" className="shadow-lg rounded-lg" />
                <img src="https://placehold.co/300x200" alt="Template 2" className="shadow-lg rounded-lg" />
                <img src="https://placehold.co/300x200" alt="Template 3" className="shadow-lg rounded-lg" />
                <img src="https://placehold.co/300x200" alt="Template 4" className="shadow-lg rounded-lg" />
              </div>
            </section>
          </div>
        </div>
      );
}
