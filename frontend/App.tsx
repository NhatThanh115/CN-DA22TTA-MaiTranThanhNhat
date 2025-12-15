import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { 
  Languages, 
  Search,
  Menu,
  X,
  Home,
  Flame,
  ChevronDown,
  LogOut,
  UserCircle,
  Bot,
  Settings,
  Shield
} from "lucide-react";
import { Toaster } from "sonner";
import './i18n/config';

// Data
import { lessons, topics, courses, getCourseByLessonId } from "./data/courses";
import { getUserProgress, setCurrentUser, clearCurrentUser } from "./utils/progressTracker";
import { createUserProfile, getUserProfile, clearUserProfile } from "./utils/userProfile";
import { getAuthToken, removeAuthToken } from "./utils/api";

// UI Components
import { Input } from "./components/ui/input";

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "./components/ui/dropdown-menu";

// Feature Components
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { Sidebar } from "./components/Sidebar";
import { LoginPage } from "./components/LoginPage";
import { SignUpPage } from "./components/SignUpPage";
import { WelcomePage } from "./components/WelcomePage";
import { DashboardHome } from "./components/DashboardHome";
import { CourseView } from "./components/CourseView";
import { TopicLesson } from "./components/TopicLesson";
import { GrammarLesson } from "./components/GrammarLesson";
import { TopicProgressOverview } from "./components/TopicProgressOverview";
import { CoachPage } from "./components/CoachPage";
import { AccountPage } from "./components/AccountPage";
import { AdminPage } from "./components/AdminPage";
import { ContentSection } from "./components/ContentSection";
import { CreateLessonPage } from "./components/CreateLessonPage";
import { CreateTopicPage } from "./components/CreateTopicPage";


export default function App() {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState("welcome");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; email?: string; role?: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const progress = getUserProgress();

  // Restore session on page load
  useEffect(() => {
    const token = getAuthToken();
    const profile = getUserProfile();
    
    if (token && profile) {
      // Restore user session from localStorage
      setCurrentUser(profile.username);
      setUser({
        username: profile.username,
        email: profile.email,
        role: profile.role || 'user'
      });
      setCurrentView("home");
    }
    setIsLoading(false);
  }, []);

  // Determine current course based on the current view
  const getCurrentCourse = () => {
    if (currentView.startsWith("course-")) {
      return currentView;
    }
    
    if (lessons[currentView]) {
      const topic = topics.find(t => t.lessons.some(l => l.id === currentView));
      if (topic) {
        const course = courses.find(c => c.topics.some(t => t.id === topic.id));
        if (course) {
          return course.id;
        }
      }
    }
    
    return 'course-a1';
  };

  const currentCourse = getCurrentCourse();

  // Determine if sidebar should be shown
  const isCourseView = currentView.startsWith("course-");
  const showSidebar = user && 
    currentView !== "home" && 
    currentView !== "welcome" && 
    currentView !== "progress" && 
    currentView !== "coach" && 
    currentView !== "login" && 
    currentView !== "signup" && 
    currentView !== "account" && 
    currentView !== "admin" &&
    currentView !== "create-lesson" &&
    currentView !== "create-topic" &&
    !isCourseView;

  const handleLogin = (username: string, role: string, userId?: string) => {
    // Set current user for progress tracking
    setCurrentUser(username);
    
    // Cast role to proper type (backend returns 'admin', 'student', 'moderator', etc.)
    const typedRole = (role === 'admin' || role === 'moderator') ? role : 'user' as const;
    setUser({ username, role: typedRole });
    
    // Update local profile with role and id from backend
    const profile = getUserProfile();
    if (!profile) {
      createUserProfile(username, '', { role: typedRole, id: userId });
    } else {
      // Update role and id if they changed
      createUserProfile(username, profile.email || '', { ...profile, role: typedRole, id: userId });
    }
    setCurrentView("home");
  };

  const handleSignUp = (username: string, email: string) => {
    // Set current user for progress tracking
    setCurrentUser(username);
    
    const role = username.toLowerCase() === 'admin' ? 'admin' : 'user';
    setUser({ username, email, role });
    createUserProfile(username, email, { role });
    setCurrentView("home");
  };

  const handleLogout = () => {
    // Clear current user for progress tracking
    clearCurrentUser();
    // Remove auth token
    removeAuthToken();
    
    setUser(null);
    clearUserProfile();
    setCurrentView("welcome");
  };

  // Search functionality
  const searchLessons = () => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: Array<{ id: string; title: string; description: string; difficulty: string }> = [];

    Object.entries(lessons).forEach(([id, lesson]) => {
      if (
        lesson.title.toLowerCase().includes(query) ||
        lesson.description.toLowerCase().includes(query)
      ) {
        const course = getCourseByLessonId(id);
        results.push({
          id,
          title: lesson.title,
          description: lesson.description,
          difficulty: course?.level || 'A1'
        });
      }
    });

    return results.slice(0, 5);
  };

  const handleSearchSelect = (lessonId: string) => {
    setCurrentView(lessonId);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const renderContent = () => {
    // Unauthenticated views
    if (!user) {
      switch (currentView) {
        case "login":
          return (
            <LoginPage 
              onLogin={handleLogin} 
              onNavigateToSignUp={() => setCurrentView("signup")}
              onNavigateToHome={() => setCurrentView("welcome")}
            />
          );

        case "signup":
          return (
            <SignUpPage 
              onSignUp={handleSignUp} 
              onNavigateToLogin={() => setCurrentView("login")}
              onNavigateToHome={() => setCurrentView("welcome")}
            />
          );

        default:
          return (
            <WelcomePage
              onNavigateToLogin={() => setCurrentView("login")}
              onNavigateToSignUp={() => setCurrentView("signup")}
            />
          );
      }
    }

    // Authenticated views
    if (currentView.startsWith("course-")) {
      return (
        <CourseView 
          courseId={currentView} 
          onNavigate={setCurrentView}
          onBack={() => setCurrentView("home")}
        />
      );
    }

    if (lessons[currentView]) {
      const lesson = lessons[currentView];
      const course = getCourseByLessonId(lesson.id);
      return (
        <TopicLesson
          lessonId={lesson.id}
          title={lesson.title}
          description={lesson.description}
          difficulty={course?.level}
          keyPoints={lesson.keyPoints}
          media={lesson.media}
          examples={lesson.examples}
          practiceExercise={lesson.exercises?.[0] ? {
            question: lesson.exercises[0].question,
            options: lesson.exercises[0].options,
            correctAnswer: lesson.exercises[0].correctAnswer,
            explanation: lesson.exercises[0].explanation
          } : undefined}
          onNavigate={setCurrentView}
        />
      );
    }

    switch (currentView) {
      case "home":
      case "welcome":
        return <DashboardHome user={user} onNavigate={setCurrentView} />;

      case "grammar-lessons":
        return (
          <div>
            <GrammarLesson />
          </div>
        );

      case "progress":
        return (
          <div>
            <h1 className="mb-6">📈 {t('progress.title')}</h1>
            <TopicProgressOverview />
          </div>
        );

      case "coach":
        return <CoachPage />;

      case "account":
        return <AccountPage user={user} />;

      case "settings":
        return (
          <div>
            <h1 className="mb-6">⚙️ {t('nav.settings')}</h1>
            <TopicProgressOverview />
          </div>
        );

      case "admin":
        return <AdminPage currentUser={user} onNavigate={setCurrentView} />;

      case "create-lesson":
        return <CreateLessonPage onNavigate={setCurrentView} />;

      case "create-topic":
        return <CreateTopicPage onNavigate={setCurrentView} />;

      default:
        return (
          <ContentSection
            title={t('common.welcomeTitle')}
            description={t('common.welcomeDescription')}
            examples={[
              { text: t('common.chooseTopicMessage') },
            ]}
          />
        );
    }
  };

  const showMainUI = user && currentView !== "login" && currentView !== "signup" && currentView !== "welcome";

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      
      {/* Top Navigation Bar */}
      {showMainUI && (
        <nav className="bg-[#225d9c] text-white h-16 fixed top-0 left-0 right-0 z-50 shadow-lg">
          <div className="h-full flex items-center justify-between px-4">
            {/* Left Section */}
            <div className="flex items-center gap-6">
              <button
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView("home")}>
                <Languages className="w-8 h-8" />
                <span className="text-xl hidden sm:inline">TVEnglish</span>
              </div>
              
              <div className="hidden md:flex items-center gap-4">
                <button 
                  onClick={() => setCurrentView("home")}
                  className={`flex items-center gap-2 hover:bg-[#1a4a7a] px-3 py-2 rounded transition-colors ${
                    currentView === "home" ? "bg-[#1a4a7a]" : ""
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>{t('nav.home')}</span>
                </button>

                <button 
                  onClick={() => setCurrentView("coach")}
                  className={`flex items-center gap-2 hover:bg-[#1a4a7a] px-3 py-2 rounded transition-colors ${
                    currentView === "coach" ? "bg-[#1a4a7a]" : ""
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  <span>{t('nav.coach')}</span>
                </button>
              </div>
            </div>
            
            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative hidden lg:block">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                  <Input
                    type="text"
                    placeholder={t('nav.searchLessons') || 'Search lessons...'}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchResults(e.target.value.trim().length > 0);
                    }}
                    onFocus={() => setShowSearchResults(searchQuery.trim().length > 0)}
                    className="w-64 pl-10 pr-4 py-2 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40"
                  />
                </div>
                
                {/* Search Results Dropdown */}
                {showSearchResults && searchLessons().length > 0 && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border-2 border-gray-200 max-h-96 overflow-y-auto z-50">
                    {searchLessons().map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleSearchSelect(result.id)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b last:border-b-0 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="text-gray-900">{result.title}</div>
                            <div className="text-sm text-gray-600 line-clamp-1">{result.description}</div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded shrink-0 ${
                            result.difficulty === 'A1' ? 'bg-green-100 text-green-700' :
                            result.difficulty === 'A2' ? 'bg-blue-100 text-blue-700' :
                            result.difficulty === 'B1' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {result.difficulty}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {/* No Results */}
                {showSearchResults && searchQuery.trim().length > 0 && searchLessons().length === 0 && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border-2 border-gray-200 p-4 z-50">
                    <p className="text-gray-600 text-sm text-center">{t('nav.noResults') || 'No lessons found'}</p>
                  </div>
                )}
              </div>
              
              {/* Study Streak */}
              {progress.studyStreak > 0 && (
                <div className="hidden md:flex items-center gap-2 bg-[#e8c02e]/20 border border-[#e8c02e] px-3 py-1.5 rounded-full">
                  <Flame className="w-4 h-4 text-[#e8c02e]" />
                  <span className="text-sm">{progress.studyStreak} {t('dashboard.stats.streak')}</span>
                </div>
              )}
              
              <LanguageSwitcher />
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:bg-[#1a4a7a] px-3 py-2 rounded transition-colors">
                    <UserCircle className="w-4 h-4" />
                    <span>{user?.username}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>{t('nav.accountLabel')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setCurrentView("account")}
                    className="cursor-pointer"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    <span>{t('nav.account')}</span>
                  </DropdownMenuItem>
                  {(user?.role === 'admin' || user?.role === 'moderator') && (
                    <DropdownMenuItem
                      onClick={() => setCurrentView("admin")}
                      className="cursor-pointer"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      <span>{t('nav.admin')}</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>{t('nav.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>
      )}

      {/* Sidebar - Desktop */}
      {showSidebar && showMainUI && (
        <div className="hidden lg:block">
          <Sidebar currentView={currentView} onNavigate={setCurrentView} selectedCourse={currentCourse} />
        </div>
      )}

      {/* Sidebar - Mobile */}
      {mobileMenuOpen && showMainUI && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40 pt-16" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-[#f3f4f6] w-64 h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <Sidebar 
              currentView={currentView} 
              onNavigate={(view) => {
                setCurrentView(view);
                setMobileMenuOpen(false);
              }} 
              selectedCourse={currentCourse} 
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={showMainUI ? `pt-16 min-h-screen ${showSidebar ? 'lg:pl-64' : ''}` : ''}>
        {showMainUI ? (
          <div className="max-w-5xl mx-auto p-6 lg:p-8">
            {renderContent()}
          </div>
        ) : (
          renderContent()
        )}
      </main>

      {/* Footer */}
      {showMainUI && (
        <footer className={`bg-[#282a35] text-white/80 py-8 mt-16 ${showSidebar ? 'lg:pl-64' : ''}`}>
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="text-white mb-3">Top Tutorials</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Vocabulary</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Grammar</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Speaking</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Listening</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white mb-3">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Exercises</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Quizzes</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Certificates</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white mb-3">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white mb-3">Follow Us</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/20 pt-8 text-center text-sm">
              <p>&copy; 2025 TVEnglish. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}