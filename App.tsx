import React, { useState, useEffect } from 'react';
import CourseOverview from './components/CourseOverview';
import LandingPage from './components/LandingPage';
import LessonView from './components/LessonView';
import Navbar from './components/Navbar';
import EnrollmentForm from './components/EnrollmentForm';
import { getLessonNavigation } from './constants';
import { AppView, Lesson } from './types';

interface LessonWithModule extends Lesson {
  moduleId: string;
  moduleTitle: string;
}

const App: React.FC = () => {
  // Sync view with URL pathname or hash (e.g. /apply or #apply)
  const getInitialView = (): AppView => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.includes('/apply') || hash.includes('#apply')) {
      return AppView.ENROLLMENT_FORM;
    }
    if (path.includes('/courses') || hash.includes('#courses')) {
      return AppView.COURSE_OVERVIEW;
    }
    return AppView.LANDING;
  };

  const [view, setView] = useState<AppView>(getInitialView);
  const [selectedLesson, setSelectedLesson] = useState<LessonWithModule | null>(null);
  const [targetCourseLevel, setTargetCourseLevel] = useState<'Basic' | 'Intermediate' | 'Advanced' | undefined>(undefined);

  // Sync URL history
  const handleSetView = (newView: AppView) => {
    setView(newView);
    if (newView === AppView.ENROLLMENT_FORM) {
      window.history.pushState({}, '', '/apply');
    } else if (newView === AppView.COURSE_OVERVIEW) {
      window.history.pushState({}, '', '/courses');
    } else if (newView === AppView.LANDING) {
      window.history.pushState({}, '', '/');
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setView(getInitialView());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectLesson = (lesson: LessonWithModule) => {
    setSelectedLesson(lesson);
    setView(AppView.LESSON_VIEW);
  };

  const handleStartCourse = () => {
    handleSetView(AppView.COURSE_OVERVIEW);
  };

  const handleOpenEnrollment = (level?: 'Basic' | 'Intermediate' | 'Advanced') => {
    if (level) setTargetCourseLevel(level);
    handleSetView(AppView.ENROLLMENT_FORM);
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
        return (
          <LandingPage 
            onStart={handleStartCourse} 
            onOpenApply={() => handleOpenEnrollment()}
          />
        );
      case AppView.COURSE_OVERVIEW:
        return (
          <CourseOverview 
            onSelectLesson={handleSelectLesson} 
            onApply={() => handleOpenEnrollment()}
          />
        );
      case AppView.ENROLLMENT_FORM:
        return (
          <EnrollmentForm 
            onBack={() => handleSetView(AppView.LANDING)}
            initialCourseLevel={targetCourseLevel}
          />
        );
      case AppView.LESSON_VIEW:
        if (!selectedLesson) return null;
        const nav = getLessonNavigation(selectedLesson.id);
        return (
          <LessonView 
            lesson={selectedLesson}
            moduleTitle={selectedLesson.moduleTitle}
            onBack={() => handleSetView(AppView.COURSE_OVERVIEW)}
            onPrevious={nav.previous ? () => handleNavigateLesson('prev') : undefined}
            onNext={nav.next ? () => handleNavigateLesson('next') : undefined}
            currentIndex={nav.currentIndex}
            totalLessons={nav.totalLessons}
          />
        );
      default:
        return <LandingPage onStart={handleStartCourse} onOpenApply={() => handleOpenEnrollment()} />;
    }
  };

  return (
    <div className="min-h-screen bg-bidri-black text-bidri-silver">
      <Navbar currentView={view} setView={handleSetView} />
      <main>
        {renderContent()}
      </main>
      
      {/* Footer (hidden during browser print) */}
      <footer className="border-t border-white/5 py-12 px-6 bg-black no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <div className="cinzel text-xl font-bold opacity-80 text-amber-300">GNJERBIF</div>
            <div className="text-[10px] text-gray-500 max-w-xs text-center md:text-left mt-1">
              Guru Nanak Jhira Entrepreneurship Research and Business Incubation Foundation
            </div>
            <div className="text-[10px] text-gray-600 mt-1">
              NIDHI DST iTBI Center • Bidar, Karnataka
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-400 uppercase tracking-widest">
            <button onClick={() => handleSetView(AppView.LANDING)} className="hover:text-amber-400 transition-colors">Home</button>
            <button onClick={() => handleSetView(AppView.COURSE_OVERVIEW)} className="hover:text-amber-400 transition-colors">Courses</button>
            <button onClick={() => handleSetView(AppView.ENROLLMENT_FORM)} className="hover:text-amber-400 text-amber-400 transition-colors">Admission / Apply</button>
            <a href="/Guru_Nanak_Bidri_Art_Enrollment_Form.docx" download className="hover:text-amber-400 transition-colors">Download .DOCX</a>
          </div>
          <div className="text-gray-600 text-[10px] text-center md:text-right">
            <div>&copy; 2026 GNJERBIF - Bidri Art Skill Center. All Rights Reserved.</div>
            <div className="text-gray-700 mt-0.5">Approved under DST NIDHI iTBI Initiative</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
