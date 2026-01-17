
import React from 'react';
import { BIDRI_COURSE } from '../constants';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const totalLessons = BIDRI_COURSE.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-0">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/bidri_hero.png" 
            className="w-full h-full object-cover opacity-40"
            alt="Bidriware background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bidri-black via-transparent to-bidri-black"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 md:px-6 max-w-4xl py-12">
          <h2 className="cinzel text-gray-500 text-sm md:text-xl tracking-[0.3em] md:tracking-[0.5em] mb-3 md:mb-4">ESTABLISHED 1422 AD</h2>
          <h1 className="cinzel text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold mb-4 md:mb-6 text-white leading-tight">
            The Alchemy of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-white to-gray-400">Silver & Soil</span>
          </h1>
          <p className="text-sm md:text-lg lg:text-xl text-gray-300 mb-8 md:mb-10 max-w-2xl mx-auto font-light leading-relaxed px-2">
            {BIDRI_COURSE.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 bg-white text-black font-bold text-base md:text-lg hover:bg-gray-200 transition-all rounded-sm"
            >
              Begin Apprenticeship
            </button>
            <button className="w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 border border-white text-white font-bold text-base md:text-lg hover:bg-white/10 transition-all rounded-sm">
              View History
            </button>
          </div>
        </div>
      </section>

      {/* Course Card Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-[#050505] to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="cinzel text-bidri-gold tracking-[0.3em] md:tracking-[0.5em] text-xs md:text-sm mb-3 md:mb-4 uppercase">Available Courses</h2>
            <h3 className="cinzel text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">Master the Ancient Art</h3>
          </div>

          {/* Main Course Card */}
          <div 
            onClick={onStart}
            className="group cursor-pointer max-w-4xl mx-auto bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden hover:border-bidri-gold/50 transition-all duration-500 hover:shadow-[0_0_60px_rgba(197,160,89,0.15)]"
          >
            <div className="flex flex-col md:grid md:grid-cols-2 gap-0">
              <div className="h-48 sm:h-64 md:h-auto overflow-hidden relative">
                <img 
                  src="/images/bidri_products.png"
                  alt="Bidri Course"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/60"></div>
              </div>
              
              <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center">
                <span className="text-[9px] md:text-[10px] text-bidri-gold font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase mb-3 md:mb-4 block">
                  Comprehensive Course
                </span>
                <h4 className="cinzel text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4 group-hover:text-bidri-gold transition-colors">
                  {BIDRI_COURSE.title}
                </h4>
                <p className="text-gray-400 mb-5 md:mb-6 font-light leading-relaxed text-sm md:text-base">
                  {BIDRI_COURSE.subtitle}
                </p>
                
                <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8">
                  <div className="text-center p-2 md:p-3 bg-white/5 rounded-lg md:rounded-xl">
                    <div className="text-lg md:text-2xl font-bold text-white">{BIDRI_COURSE.modules.length}</div>
                    <div className="text-[8px] md:text-[10px] text-gray-500 uppercase tracking-wider">Modules</div>
                  </div>
                  <div className="text-center p-2 md:p-3 bg-white/5 rounded-lg md:rounded-xl">
                    <div className="text-lg md:text-2xl font-bold text-white">{totalLessons}</div>
                    <div className="text-[8px] md:text-[10px] text-gray-500 uppercase tracking-wider">Lessons</div>
                  </div>
                  <div className="text-center p-2 md:p-3 bg-white/5 rounded-lg md:rounded-xl">
                    <div className="text-lg md:text-2xl font-bold text-white">8+</div>
                    <div className="text-[8px] md:text-[10px] text-gray-500 uppercase tracking-wider">Hours</div>
                  </div>
                </div>

                <button className="w-full py-3 md:py-4 bg-bidri-gold text-black font-bold uppercase tracking-widest rounded-lg md:rounded-xl hover:bg-white transition-all group-hover:shadow-[0_10px_30px_rgba(197,160,89,0.3)] text-sm md:text-base">
                  Start Learning →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
          <div className="p-6 md:p-8 border border-white/5 bg-white/5 rounded-xl">
            <div className="text-bidri-gold text-2xl md:text-4xl mb-3 md:mb-4 italic cinzel">01.</div>
            <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 cinzel">Interactive Modules</h3>
            <p className="text-gray-400 text-sm md:text-base">High-definition content across {BIDRI_COURSE.modules.length} comprehensive modules covering everything from history to advanced techniques.</p>
          </div>
          <div className="p-6 md:p-8 border border-white/5 bg-white/5 rounded-xl">
            <div className="text-bidri-gold text-2xl md:text-4xl mb-3 md:mb-4 italic cinzel">02.</div>
            <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 cinzel">AI Mentorship</h3>
            <p className="text-gray-400 text-sm md:text-base">Ask our Gemini-powered Master Artisan any technical question about alloy composition or design.</p>
          </div>
          <div className="p-6 md:p-8 border border-white/5 bg-white/5 rounded-xl">
            <div className="text-bidri-gold text-2xl md:text-4xl mb-3 md:mb-4 italic cinzel">03.</div>
            <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 cinzel">Rich Visual Content</h3>
            <p className="text-gray-400 text-sm md:text-base">Each lesson features detailed images, step-by-step techniques, and historical context for complete understanding.</p>
          </div>
        </div>
      </section>

      {/* Module Preview Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="cinzel text-gray-500 tracking-[0.3em] md:tracking-[0.5em] text-[10px] md:text-xs mb-3 md:mb-4 uppercase">What You'll Learn</h2>
            <h3 className="cinzel text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">Course Modules</h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
            {BIDRI_COURSE.modules.map((module, idx) => (
              <div 
                key={module.id}
                className="group bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 hover:border-bidri-gold/30 transition-all cursor-pointer"
                onClick={onStart}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-bidri-gold/10 flex items-center justify-center mb-3 md:mb-4 group-hover:bg-bidri-gold/20 transition-colors">
                  <span className="text-bidri-gold font-bold text-sm md:text-base">{idx + 1}</span>
                </div>
                <h4 className="cinzel text-sm md:text-lg font-bold text-white mb-1 md:mb-2 group-hover:text-bidri-gold transition-colors line-clamp-2">
                  {module.title}
                </h4>
                <p className="text-[10px] md:text-xs text-gray-500">
                  {module.lessons.length} lessons
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
