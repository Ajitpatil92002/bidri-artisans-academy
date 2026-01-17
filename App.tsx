
import React, { useState } from 'react';
import CourseOverview from './components/CourseOverview';
import LandingPage from './components/LandingPage';
import LessonView from './components/LessonView';
import Navbar from './components/Navbar';
import { getLessonNavigation } from './constants';
import { AppView, Lesson } from './types';

interface LessonWithModule extends Lesson {
  moduleId: string;
  moduleTitle: string;
}

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [selectedLesson, setSelectedLesson] = useState<LessonWithModule | null>(null);

  const handleSelectLesson = (lesson: LessonWithModule) => {
    setSelectedLesson(lesson);
    setView(AppView.LESSON_VIEW);
  };

  const handleStartCourse = () => {
    setView(AppView.COURSE_OVERVIEW);
  };

  const handleNavigateLesson = (direction: 'prev' | 'next') => {
    if (!selectedLesson) return;
    
    const nav = getLessonNavigation(selectedLesson.id);
    const targetLesson = direction === 'prev' ? nav.previous : nav.next;
    
    if (targetLesson) {
      setSelectedLesson(targetLesson as LessonWithModule);
    }
  };

  const renderContent = () => {
    switch (view) {
      case AppView.LANDING:
        return <LandingPage onStart={handleStartCourse} />;
      case AppView.COURSE_OVERVIEW:
        return <CourseOverview onSelectLesson={handleSelectLesson} />;
      case AppView.LESSON_VIEW:
        if (!selectedLesson) return null;
        const nav = getLessonNavigation(selectedLesson.id);
        return (
          <LessonView 
            lesson={selectedLesson}
            moduleTitle={selectedLesson.moduleTitle}
            onBack={() => setView(AppView.COURSE_OVERVIEW)}
            onPrevious={nav.previous ? () => handleNavigateLesson('prev') : undefined}
            onNext={nav.next ? () => handleNavigateLesson('next') : undefined}
            currentIndex={nav.currentIndex}
            totalLessons={nav.totalLessons}
          />
        );
      default:
        return <LandingPage onStart={handleStartCourse} />;
    }
  };

  return (
    <div className="min-h-screen bg-bidri-black text-bidri-silver">
      <Navbar currentView={view} setView={setView} />
      <main>
        {renderContent()}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <div className="cinzel text-xl font-bold opacity-80">GNJERBIF</div>
            <div className="text-[10px] text-gray-500 max-w-xs text-center md:text-left">
              Guru Nanak Jhira Entrepreneurship Research and Business Incubation Foundation
            </div>
          </div>
          <div className="flex gap-8 text-xs text-gray-500 uppercase tracking-widest">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
            <span>About Bidar</span>
          </div>
          <div className="text-gray-600 text-[10px] text-center">
            &copy; 2024 GNJERBIF - Bidri Art Course. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
