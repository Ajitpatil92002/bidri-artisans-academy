
import React from 'react';
import { ContentSection, Lesson } from '../types';

interface LessonViewProps {
  lesson: Lesson;
  moduleTitle: string;
  onBack: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  currentIndex: number;
  totalLessons: number;
}

const LessonView: React.FC<LessonViewProps> = ({ 
  lesson, 
  moduleTitle,
  onBack, 
  onPrevious, 
  onNext,
  currentIndex,
  totalLessons
}) => {

  const renderContentSection = (section: ContentSection, index: number) => {
    switch (section.type) {
      case 'heading':
        return (
          <h3 key={index} className="cinzel text-lg md:text-xl text-bidri-gold mt-8 md:mt-10 mb-3 md:mb-4 first:mt-0">
            {section.content}
          </h3>
        );
      case 'text':
        return (
          <p key={index} className="text-gray-300 leading-relaxed text-base md:text-lg mb-4 md:mb-6 font-light">
            {section.content}
          </p>
        );
      case 'image':
        return (
          <figure key={index} className="my-6 md:my-8">
            <div className="rounded-xl md:rounded-2xl overflow-hidden border border-white/10">
              <img 
                src={section.content} 
                alt={section.caption || 'Lesson image'} 
                className="w-full h-48 sm:h-64 md:h-80 object-cover"
              />
            </div>
            {section.caption && (
              <figcaption className="text-xs md:text-sm text-gray-500 mt-2 md:mt-3 text-center italic">
                {section.caption}
              </figcaption>
            )}
          </figure>
        );
      case 'list':
        return (
          <div key={index} className="my-4 md:my-6 p-4 md:p-6 bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl">
            <h4 className="text-xs md:text-sm font-bold text-bidri-gold uppercase tracking-widest mb-3 md:mb-4">
              {section.content}
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {section.items?.map((item, i) => (
                <li key={i} className="flex items-start gap-2 md:gap-3 text-gray-400 text-sm md:text-base">
                  <span className="text-bidri-gold mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pt-20 md:pt-24 pb-8 md:pb-12 px-4 md:px-6 max-w-5xl mx-auto">
      {/* Breadcrumb & Navigation */}
      <div className="mb-6 md:mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
          <button onClick={onBack} className="text-bidri-gold flex items-center gap-1 md:gap-2 hover:text-white transition-colors group flex-shrink-0">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> 
            <span className="cinzel tracking-widest text-xs md:text-sm">Back</span>
          </button>
          <span className="text-gray-600 hidden sm:block">/</span>
          <span className="text-gray-400 text-xs md:text-sm truncate hidden sm:block">{moduleTitle}</span>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <span className="text-[10px] md:text-xs text-gray-500">
            Lesson {currentIndex + 1} of {totalLessons}
          </span>
          <div className="w-20 md:w-24 h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-bidri-gold transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / totalLessons) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="rounded-xl md:rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] md:shadow-[0_0_50px_rgba(0,0,0,0.5)] group relative mb-6 md:mb-10">
        <img 
          src={lesson.image} 
          className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" 
          alt={lesson.title} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
          <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-4">
            <span className="px-2 md:px-3 py-1 bg-bidri-gold/20 border border-bidri-gold/30 rounded-full text-[10px] md:text-xs text-bidri-gold">
              {lesson.duration}
            </span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(star => (
                <div 
                  key={star} 
                  className={`w-1.5 md:w-2 h-1 rounded-full ${
                    star <= lesson.difficulty ? 'bg-bidri-gold' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
          <h1 className="cinzel text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white">{lesson.title}</h1>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="bg-white/[0.02] border border-white/5 p-5 sm:p-6 md:p-8 lg:p-10 rounded-2xl md:rounded-3xl backdrop-blur-sm">
        <div className="prose prose-invert max-w-none">
          {lesson.contentSections.map((section, idx) => renderContentSection(section, idx))}
        </div>
        
        {/* Key Materials */}
        {lesson.keyMaterials && lesson.keyMaterials.length > 0 && (
          <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/5">
            <h4 className="text-xs font-bold text-bidri-gold uppercase tracking-widest mb-3 md:mb-4">Key Materials</h4>
            <div className="flex flex-wrap gap-2">
              {lesson.keyMaterials.map((material, idx) => (
                <span 
                  key={idx}
                  className="px-3 md:px-4 py-1.5 md:py-2 bg-white/5 border border-white/10 rounded-full text-xs md:text-sm text-gray-400"
                >
                  {material}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/5">
        {onPrevious ? (
          <button 
            onClick={onPrevious}
            className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-bidri-gold/30 rounded-lg md:rounded-xl transition-all group"
          >
            <span className="text-lg md:text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <div className="text-left">
              <div className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-wider">Previous</div>
              <div className="text-xs md:text-sm text-white font-medium">Lesson</div>
            </div>
          </button>
        ) : (
          <div></div>
        )}
        
        {onNext ? (
          <button 
            onClick={onNext}
            className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 bg-bidri-gold/10 hover:bg-bidri-gold/20 border border-bidri-gold/30 hover:border-bidri-gold/50 rounded-lg md:rounded-xl transition-all group"
          >
            <div className="text-right">
              <div className="text-[9px] md:text-[10px] text-bidri-gold uppercase tracking-wider">Next</div>
              <div className="text-xs md:text-sm text-white font-medium">Continue →</div>
            </div>
          </button>
        ) : (
          <button 
            onClick={onBack}
            className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 bg-bidri-gold hover:bg-white text-black font-bold rounded-lg md:rounded-xl transition-all text-xs md:text-sm"
          >
            Complete Module ✓
          </button>
        )}
      </div>

      {/* Progress Card - Mobile friendly */}
      <div className="mt-6 bg-gradient-to-br from-gray-900 to-black p-4 md:p-6 rounded-xl md:rounded-2xl border border-white/10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h4 className="cinzel text-xs md:text-sm text-bidri-gold uppercase tracking-widest">Course Progress</h4>
            <p className="text-[10px] md:text-xs text-gray-400 mt-1">
              Lesson {currentIndex + 1} of {totalLessons}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg md:text-2xl font-bold text-bidri-gold">{Math.round(((currentIndex + 1) / totalLessons) * 100)}%</div>
          </div>
        </div>
        <div className="w-full bg-gray-800 h-1.5 md:h-2 rounded-full overflow-hidden mt-3">
          <div 
            className="bg-bidri-gold h-full shadow-[0_0_10px_#c5a059] transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / totalLessons) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LessonView;
