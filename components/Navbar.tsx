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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-bidri-gold/30 px-4 md:px-6 py-3 md:py-4 flex justify-between items-center no-print">
        <div 
          className="cinzel font-bold cursor-pointer flex items-center gap-2 md:gap-3"
          onClick={() => setView(AppView.LANDING)}
        >
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 rounded-full border-2 border-yellow-600 shadow-[0_0_12px_rgba(197,160,89,0.5)] flex items-center justify-center">
            <span className="text-black font-bold text-[8px] md:text-xs">GNJ</span>
          </div>
          <div className="flex flex-col">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-amber-200 to-amber-400 text-xs md:text-base font-bold">
              GNJERBIF
            </span>
            <span className="text-[8px] md:text-[9px] text-gray-400 tracking-wider hidden sm:block">
              Bidri Art Skill Development Center
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-widest font-semibold">
          <button 
            onClick={() => setView(AppView.LANDING)} 
            className={`hover:text-amber-400 transition-colors ${currentView === AppView.LANDING ? 'text-bidri-gold border-b-2 border-bidri-gold pb-0.5' : 'text-gray-300'}`}
          >
            Home
          </button>
          <button 
            onClick={() => setView(AppView.COURSE_OVERVIEW)} 
            className={`hover:text-amber-400 transition-colors ${currentView === AppView.COURSE_OVERVIEW ? 'text-bidri-gold border-b-2 border-bidri-gold pb-0.5' : 'text-gray-300'}`}
          >
            Courses
          </button>
          <button 
            onClick={() => setView(AppView.ENROLLMENT_FORM)} 
            className={`hover:text-amber-400 transition-colors flex items-center gap-1.5 ${currentView === AppView.ENROLLMENT_FORM ? 'text-bidri-gold border-b-2 border-bidri-gold pb-0.5' : 'text-gray-300'}`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Enrollment Form
          </button>
          <a
            href="/Guru_Nanak_Bidri_Art_Enrollment_Form.docx"
            download
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
            title="Download blank Word document"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Offline Form
          </a>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button 
            onClick={() => setView(AppView.ENROLLMENT_FORM)}
            className="px-4 lg:px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black transition-all duration-300 font-bold text-xs lg:text-sm rounded-lg shadow-[0_0_15px_rgba(197,160,89,0.3)] transform hover:scale-105"
          >
            Apply Online →
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 text-bidri-gold"
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
        <div className="fixed inset-0 z-40 lg:hidden no-print">
          <div className="absolute inset-0 bg-black/95 pt-20 px-6">
            <div className="flex flex-col gap-5 text-center">
              <button 
                onClick={() => { setView(AppView.LANDING); setMobileMenuOpen(false); }} 
                className="text-lg uppercase tracking-widest py-3 border-b border-white/10 hover:text-bidri-gold transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => { setView(AppView.COURSE_OVERVIEW); setMobileMenuOpen(false); }} 
                className="text-lg uppercase tracking-widest py-3 border-b border-white/10 hover:text-bidri-gold transition-colors"
              >
                Courses
              </button>
              <button 
                onClick={() => { setView(AppView.ENROLLMENT_FORM); setMobileMenuOpen(false); }} 
                className="text-lg uppercase tracking-widest py-3 border-b border-white/10 text-amber-400 font-bold flex items-center justify-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Enrollment Form (/apply)
              </button>
              <a
                href="/Guru_Nanak_Bidri_Art_Enrollment_Form.docx"
                download
                className="text-sm uppercase tracking-widest py-3 border-b border-white/10 text-blue-400"
              >
                📥 Download Offline Form (.docx)
              </a>
              <button 
                onClick={() => { setView(AppView.ENROLLMENT_FORM); setMobileMenuOpen(false); }}
                className="mt-4 px-8 py-3.5 bg-amber-600 text-black font-bold uppercase tracking-widest rounded-xl shadow-lg"
              >
                Apply Online Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
