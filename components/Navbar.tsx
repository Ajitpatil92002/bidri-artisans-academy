
import React, { useState } from 'react';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setView, currentView }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-bidri-gold/30 px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
        <div 
          className="cinzel font-bold cursor-pointer flex items-center gap-2 md:gap-3"
          onClick={() => setView(AppView.LANDING)}
        >
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-gray-200 to-gray-500 rounded-full border-2 border-yellow-600 shadow-[0_0_10px_rgba(197,160,89,0.5)] flex items-center justify-center">
            <span className="text-black font-bold text-[8px] md:text-xs">GNJ</span>
          </div>
          <div className="flex flex-col">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400 text-xs md:text-base">
              GNJERBIF
            </span>
            <span className="text-[8px] md:text-[9px] text-gray-500 tracking-wider hidden sm:block">Bidri Art Course</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-8 text-sm uppercase tracking-widest font-semibold">
          <button onClick={() => setView(AppView.LANDING)} className={`hover:text-yellow-500 transition-colors ${currentView === AppView.LANDING ? 'text-bidri-gold' : ''}`}>Home</button>
          <button onClick={() => setView(AppView.COURSE_OVERVIEW)} className={`hover:text-yellow-500 transition-colors ${currentView === AppView.COURSE_OVERVIEW ? 'text-bidri-gold' : ''}`}>Courses</button>
          <button className="text-gray-500 cursor-not-allowed">Gallery</button>
        </div>

        {/* Desktop CTA */}
        <button 
          onClick={() => setView(AppView.COURSE_OVERVIEW)}
          className="hidden md:block px-4 lg:px-6 py-2 border border-bidri-gold text-bidri-gold hover:bg-bidri-gold hover:text-black transition-all duration-300 font-bold text-xs lg:text-sm"
        >
          START LEARNING
        </button>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-bidri-gold"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/95 pt-20 px-6">
            <div className="flex flex-col gap-6 text-center">
              <button 
                onClick={() => { setView(AppView.LANDING); setMobileMenuOpen(false); }} 
                className="text-xl uppercase tracking-widest py-4 border-b border-white/10 hover:text-bidri-gold transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => { setView(AppView.COURSE_OVERVIEW); setMobileMenuOpen(false); }} 
                className="text-xl uppercase tracking-widest py-4 border-b border-white/10 hover:text-bidri-gold transition-colors"
              >
                Courses
              </button>
              <button className="text-xl uppercase tracking-widest py-4 border-b border-white/10 text-gray-500">
                Gallery
              </button>
              <button 
                onClick={() => { setView(AppView.COURSE_OVERVIEW); setMobileMenuOpen(false); }}
                className="mt-6 px-8 py-4 bg-bidri-gold text-black font-bold uppercase tracking-widest"
              >
                Start Learning
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
