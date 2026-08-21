import React, { useState } from 'react';
import { BIDRI_COURSE } from '../constants';
import { Lesson } from '../types';

interface LessonWithModule extends Lesson {
  moduleId: string;
  moduleTitle: string;
}

interface CourseOverviewProps {
  onSelectLesson: (lesson: LessonWithModule) => void;
  onApply?: () => void;
}

const CourseOverview: React.FC<CourseOverviewProps> = ({ onSelectLesson, onApply }) => {
  const [expandedModule, setExpandedModule] = useState<string | null>(BIDRI_COURSE.modules[0]?.id || null);

  const totalLessons = BIDRI_COURSE.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  const handleModuleClick = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const handleLessonClick = (lesson: Lesson, moduleId: string, moduleTitle: string) => {
    onSelectLesson({
      ...lesson,
      moduleId,
      moduleTitle
    });
  };

  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-24 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 md:mb-16 text-center relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[4rem] sm:text-[6rem] md:text-[8rem] font-bold text-white/5 cinzel select-none hidden md:block">HERITAGE</div>
        <h2 className="cinzel text-bidri-gold tracking-[0.4em] md:tracking-[0.6em] text-[10px] md:text-sm mb-3 md:mb-4 relative z-10 uppercase">Grand Curriculum</h2>
        <h1 className="cinzel text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 relative z-10 leading-tight">
          {BIDRI_COURSE.title}
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-lg font-light leading-relaxed px-2">
          {BIDRI_COURSE.subtitle}
        </p>
        
        {/* Stats */}
        <div className="flex justify-center gap-6 md:gap-8 mt-8 md:mt-10">
          <div className="text-center">
            <div className="text-xl md:text-3xl font-bold text-white">{BIDRI_COURSE.modules.length}</div>
            <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider">Modules</div>
          </div>
          <div className="w-px bg-white/10"></div>
          <div className="text-center">
            <div className="text-xl md:text-3xl font-bold text-white">{totalLessons}</div>
            <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider">Lessons</div>
          </div>
          <div className="w-px bg-white/10"></div>
          <div className="text-center">
            <div className="text-xl md:text-3xl font-bold text-white">8+</div>
            <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider">Hours</div>
          </div>
        </div>

        {/* Apply CTA Header Bar */}
        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={onApply}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg flex items-center gap-2"
          >
            <span>📝</span> Apply for Skill Certification
          </button>
          <a
            href="/Guru_Nanak_Bidri_Art_Enrollment_Form.docx"
            download
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-lg border border-white/20 flex items-center gap-1.5"
          >
            <span>📥</span> Download Form (.docx)
          </a>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-4 md:space-y-6">
        {BIDRI_COURSE.modules.map((module, moduleIdx) => {
          const isExpanded = expandedModule === module.id;
          
          return (
            <div 
              key={module.id}
              className={`bg-gradient-to-b from-white/[0.05] to-transparent border rounded-xl md:rounded-2xl overflow-hidden transition-all duration-500 ${
                isExpanded ? 'border-bidri-gold/30' : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Module Header */}
              <div 
                className="p-4 sm:p-5 md:p-6 lg:p-8 cursor-pointer flex items-start gap-3 md:gap-6"
                onClick={() => handleModuleClick(module.id)}
              >
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-colors ${
                    isExpanded ? 'bg-bidri-gold text-black' : 'bg-white/5 text-bidri-gold'
                  }`}>
                    <span className="font-bold text-base md:text-xl">{moduleIdx + 1}</span>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                    <span className="text-[9px] md:text-[10px] text-bidri-gold font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase">
                      Module {moduleIdx + 1}
                    </span>
                    <span className="text-[9px] md:text-[10px] text-gray-600">•</span>
                    <span className="text-[9px] md:text-[10px] text-gray-500">{module.lessons.length} lessons</span>
                  </div>
                  <h3 className={`cinzel text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-1 md:mb-2 transition-colors ${
                    isExpanded ? 'text-bidri-gold' : 'text-white'
                  }`}>
                    {module.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-400 font-light line-clamp-2 hidden sm:block">
                    {module.description}
                  </p>
                </div>

                <div className="flex-shrink-0 hidden lg:block">
                  <div className="w-24 h-16 md:w-32 md:h-20 rounded-lg md:rounded-xl overflow-hidden">
                    <img 
                      src={module.image} 
                      alt={module.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex-shrink-0 flex items-center">
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-all ${
                    isExpanded 
                      ? 'bg-bidri-gold border-bidri-gold text-black rotate-180' 
                      : 'border-white/20 text-gray-400 hover:border-white/40'
                  }`}>
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Lessons List (Expandable) */}
              <div className={`overflow-hidden transition-all duration-500 ${
                isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-4 sm:px-5 md:px-6 lg:px-8 pb-4 sm:pb-5 md:pb-6 lg:pb-8">
                  <div className="border-t border-white/5 pt-4 md:pt-6">
                    <div className="grid gap-2 md:gap-3">
                      {module.lessons.map((lesson, lessonIdx) => (
                        <div
                          key={lesson.id}
                          onClick={() => handleLessonClick(lesson, module.id, module.title)}
                          className="group flex items-center gap-2 sm:gap-3 md:gap-4 p-3 md:p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-bidri-gold/30 rounded-lg md:rounded-xl cursor-pointer transition-all"
                        >
                          <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg bg-white/5 flex items-center justify-center text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-500 group-hover:text-bidri-gold group-hover:bg-bidri-gold/10 transition-colors">
                            {moduleIdx + 1}.{lessonIdx + 1}
                          </div>
                          
                          <div className="flex-shrink-0 w-12 h-9 md:w-16 md:h-12 rounded-lg overflow-hidden hidden sm:block">
                            <img 
                              src={lesson.image} 
                              alt={lesson.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>

                          <div className="flex-1 min-w-0 overflow-hidden">
                            <h4 className="font-semibold text-white group-hover:text-bidri-gold transition-colors text-xs sm:text-sm md:text-base truncate">
                              {lesson.title}
                            </h4>
                            <p className="text-[10px] md:text-xs text-gray-500 truncate hidden sm:block">{lesson.description}</p>
                          </div>

                          <div className="flex-shrink-0 flex items-center gap-2 md:gap-4">
                            <div className="hidden md:flex flex-col items-end">
                              <span className="text-[10px] md:text-xs text-gray-500">{lesson.duration}</span>
                              <div className="flex gap-0.5 mt-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <div 
                                    key={star} 
                                    className={`w-1.5 md:w-2 h-1 rounded-full ${
                                      star <= lesson.difficulty ? 'bg-bidri-gold' : 'bg-gray-700'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            
                            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-bidri-gold group-hover:border-bidri-gold group-hover:text-black transition-all text-xs sm:text-sm">
                              →
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enrollment Card */}
      <div className="mt-10 md:mt-16 p-6 md:p-8 bg-gradient-to-r from-amber-900/20 via-black to-amber-950/20 border border-bidri-gold/40 rounded-xl md:rounded-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <span className="text-amber-400 font-bold text-[10px] uppercase tracking-widest block mb-1">
              Affiliated with GN JERBI Foundation
            </span>
            <h4 className="cinzel text-lg md:text-2xl font-bold text-white mb-2">Ready to Become a Certified Bidri Artisan?</h4>
            <p className="text-xs md:text-sm text-gray-300 max-w-xl">
              Register online or download our offline registration application form for regular batches in Bidar.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={onApply}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg"
            >
              Fill Online Form (/apply)
            </button>
            <a
              href="/Guru_Nanak_Bidri_Art_Enrollment_Form.docx"
              download
              className="px-5 py-3 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 text-center font-bold text-xs uppercase tracking-wider rounded-xl"
            >
              Offline Form (.docx)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;
