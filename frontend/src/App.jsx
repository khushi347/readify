import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Search as SearchIcon, Compass, User, LogOut, Layout, Menu, X } from 'lucide-react';
import PageTransition from './components/PageTransition';
import './App.css';

// Import Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Bookshelf from './pages/Bookshelf';
import Search from './pages/Search';
import Recommendations from './pages/Recommendations';
import Profile from './pages/Profile';

// Import API Services
import {
  authService,
  shelfService,
  dashboardService,
  reflectionsService,
  mapStatusToFrontend,
  mapStatusToBackend,
  getBookCoverColor
} from './services/api';

function App() {
  const [view, setView] = useState('landing'); // landing, auth, dashboard, bookshelf, search, recommendations, profile
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [sanctuaryMode, setSanctuaryMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Helper to format backend book object
  const formatBackendBook = (b) => {
    const totalPages = b.totalPages || null;
    const progress = b.progress || 0;
    return {
      id: b._id,
      bookId: b.bookId,
      title: b.title,
      author: b.authors ? b.authors.join(', ') : 'Unknown Author',
      coverColor: b.coverColor || getBookCoverColor(b.title),
      category: mapStatusToFrontend(b.status),
      genre: b.genre || 'Unknown',
      progress: progress,
      totalPages: totalPages,
      pagesRead: totalPages ? Math.round((progress / 100) * totalPages) : 0,
      rating: b.rating || 0,
      review: b.review || '',
      synopsis: b.synopsis || 'No synopsis available.',
      highlights: [],
      createdAt: b.createdAt,
      updatedAt: b.updatedAt
    };
  };

  // Sync Sanctuary Focus mode state from dashboard to App root class
  useEffect(() => {
    if (view !== 'dashboard') {
      document.body.classList.remove('sanctuary-dark');
      setSanctuaryMode(false);
    }
    setIsMobileMenuOpen(false);
  }, [view]);

  // Auth initialization check on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('readify_token');
      if (token) {
        try {
          setIsLoading(true);
          const userData = await authService.me();
          setUser(userData);
          // Load shelf and summary data
          const shelfBooks = await shelfService.getBooks();
          setBooks(shelfBooks.map(formatBackendBook));
          const summary = await dashboardService.getSummary();
          setDashboardSummary(summary);
          setView('dashboard');
        } catch (err) {
          console.error("Token verification failed:", err);
          authService.logout();
          setUser(null);
          setView('landing');
        } finally {
          setIsLoading(false);
        }
      }
    };
    initAuth();

    // Listen to global unauthorized event
    const handleUnauthorized = () => {
      setUser(null);
      setBooks([]);
      setDashboardSummary(null);
      setView('landing');
    };

    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth-unauthorized', handleUnauthorized);
    };
  }, []);

  // Fetch everything for logged-in user
  const fetchLibraryData = async () => {
    try {
      setIsLoading(true);
      const shelfBooks = await shelfService.getBooks();
      setBooks(shelfBooks.map(formatBackendBook));
      const summary = await dashboardService.getSummary();
      setDashboardSummary(summary);
    } catch (err) {
      console.error("Failed to load library data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Log progress updates
  const handleUpdateBookProgress = async (bookId, pagesReadOrProgress) => {
    try {
      const book = books.find(b => b.id === bookId);
      if (!book) return;
      
      let progress;
      if (book.totalPages) {
        progress = Math.min(100, Math.round((pagesReadOrProgress / book.totalPages) * 100));
      } else {
        progress = Math.min(100, pagesReadOrProgress);
      }

      const updated = await shelfService.updateBook(bookId, { progress });
      setBooks(prevBooks =>
        prevBooks.map(b => b.id === bookId ? {
          ...b,
          progress: updated.progress,
          pagesRead: b.totalPages ? Math.round((updated.progress / 100) * b.totalPages) : 0,
          category: mapStatusToFrontend(updated.status)
        } : b)
      );

      // Refresh dashboard summary
      const summary = await dashboardService.getSummary();
      setDashboardSummary(summary);
    } catch (err) {
      console.error("Failed to update progress:", err);
    }
  };

  // Log shelf moves
  const handleUpdateBookStatus = async (bookId, status) => {
    try {
      const backendStatus = mapStatusToBackend(status);
      const updated = await shelfService.updateBook(bookId, { status: backendStatus });
      setBooks(prevBooks =>
        prevBooks.map(b => b.id === bookId ? {
          ...b,
          category: mapStatusToFrontend(updated.status),
          progress: updated.progress,
          pagesRead: b.totalPages ? Math.round((updated.progress / 100) * b.totalPages) : 0
        } : b)
      );

      // Refresh dashboard summary
      const summary = await dashboardService.getSummary();
      setDashboardSummary(summary);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Log star ratings
  const handleUpdateBookRating = async (bookId, rating) => {
    try {
      const updated = await shelfService.updateBook(bookId, { rating });
      setBooks(prevBooks =>
        prevBooks.map(b => b.id === bookId ? { ...b, rating: updated.rating } : b)
      );
    } catch (err) {
      console.error("Failed to update rating:", err);
    }
  };

  // Log highlights (Reflections)
  const handleSaveHighlight = async (bookId, highlightText) => {
    try {
      await reflectionsService.addReflection(bookId, highlightText);
      // reflections are managed independently
    } catch (err) {
      console.error("Failed to save reflection:", err);
    }
  };

  // Add search book to library
  const handleAddBookToLibrary = async (newBook) => {
    try {
      const bookData = {
        bookId: newBook.bookId || String(newBook.id),
        title: newBook.title,
        authors: Array.isArray(newBook.authors) ? newBook.authors : [newBook.author],
        thumbnail: newBook.thumbnail || '',
        genre: newBook.genre || 'Unknown',
        totalPages: newBook.totalPages || null,
        status: 'want_to_read',
        progress: 0
      };
      const added = await shelfService.addBook(bookData);
      setBooks(prevBooks => [...prevBooks, formatBackendBook(added)]);

      // Refresh summary
      const summary = await dashboardService.getSummary();
      setDashboardSummary(summary);
    } catch (err) {
      console.error("Failed to add book to library:", err);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await shelfService.deleteBook(bookId);
      setBooks(prevBooks => prevBooks.filter(b => b.id !== bookId));
      const summary = await dashboardService.getSummary();
      setDashboardSummary(summary);
    } catch (err) {
      console.error("Failed to delete book:", err);
    }
  };

  const handleUpdateYearlyGoal = async (goalValue) => {
    try {
      await dashboardService.updateGoal(goalValue);
      const summary = await dashboardService.getSummary();
      setDashboardSummary(summary);
    } catch (err) {
      console.error("Failed to update yearly goal:", err);
    }
  };

  const handleLogin = async (userData) => {
    setUser(userData);
    await fetchLibraryData();
    setView('dashboard');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setBooks([]);
    setDashboardSummary(null);
    setView('landing');
  };

  // Calculate dynamic goals progress using backend summary values
  const completedCount = books.filter(b => b.category === 'completed').length;
  const yearlyGoalData = {
    read: dashboardSummary?.yearlyReadingGoal?.completed ?? completedCount,
    target: dashboardSummary?.yearlyReadingGoal?.goal ?? 20
  };

  const handleSanctuaryToggleFromDashboard = (isFocused) => {
    setSanctuaryMode(isFocused);
  };

  return (
    <>
      {/* Global Editorial Header (Navigation Bar) */}
      {user && !document.body.classList.contains('sanctuary-dark') && (
        <header className="global-editorial-header">
          <div className="nav-container container">
            <div className="nav-logo" onClick={() => setView('dashboard')}>
              <span className="logo-initial">R</span>
              <span className="logo-text">Readify</span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="nav-links desktop-only">
              <button 
                className={`nav-link-btn ${view === 'dashboard' ? 'active' : ''}`}
                onClick={() => setView('dashboard')}
              >
                <Layout size={14} className="nav-icon" />
                <span className="nav-text">Dashboard</span>
                {view === 'dashboard' && (
                  <motion.div 
                    layoutId="activeNavIndicator" 
                    className="active-nav-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
              <button 
                className={`nav-link-btn ${view === 'bookshelf' ? 'active' : ''}`}
                onClick={() => setView('bookshelf')}
              >
                <BookOpen size={14} className="nav-icon" />
                <span className="nav-text">Bookshelf</span>
                {view === 'bookshelf' && (
                  <motion.div 
                    layoutId="activeNavIndicator" 
                    className="active-nav-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
              <button 
                className={`nav-link-btn ${view === 'search' ? 'active' : ''}`}
                onClick={() => setView('search')}
              >
                <SearchIcon size={14} className="nav-icon" />
                <span className="nav-text">Search</span>
                {view === 'search' && (
                  <motion.div 
                    layoutId="activeNavIndicator" 
                    className="active-nav-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
              <button 
                className={`nav-link-btn ${view === 'recommendations' ? 'active' : ''}`}
                onClick={() => setView('recommendations')}
              >
                <Compass size={14} className="nav-icon" />
                <span className="nav-text">Recommendations</span>
                {view === 'recommendations' && (
                  <motion.div 
                    layoutId="activeNavIndicator" 
                    className="active-nav-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
              <button 
                className={`nav-link-btn ${view === 'profile' ? 'active' : ''}`}
                onClick={() => setView('profile')}
              >
                <User size={14} className="nav-icon" />
                <span className="nav-text">Profile</span>
                {view === 'profile' && (
                  <motion.div 
                    layoutId="activeNavIndicator" 
                    className="active-nav-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            </nav>

            {/* Desktop Profile Section */}
            <div className="nav-profile-control desktop-only">
              <div className="nav-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="nav-profile-info">
                <span className="nav-user-name">{user.name}</span>
                <span className="nav-user-role">Bibliophile</span>
              </div>
              <button className="nav-logout-btn" onClick={handleLogout} title="Log Out">
                <LogOut size={14} />
              </button>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button 
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Drawer (Drop-down Navigation) */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                className="mobile-nav-drawer"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <nav className="mobile-nav-links">
                  <button 
                    className={`mobile-nav-link-btn ${view === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setView('dashboard')}
                  >
                    <Layout size={16} className="nav-icon" />
                    <span className="nav-text">Dashboard</span>
                  </button>
                  <button 
                    className={`mobile-nav-link-btn ${view === 'bookshelf' ? 'active' : ''}`}
                    onClick={() => setView('bookshelf')}
                  >
                    <BookOpen size={16} className="nav-icon" />
                    <span className="nav-text">Bookshelf</span>
                  </button>
                  <button 
                    className={`mobile-nav-link-btn ${view === 'search' ? 'active' : ''}`}
                    onClick={() => setView('search')}
                  >
                    <SearchIcon size={16} className="nav-icon" />
                    <span className="nav-text">Search</span>
                  </button>
                  <button 
                    className={`mobile-nav-link-btn ${view === 'recommendations' ? 'active' : ''}`}
                    onClick={() => setView('recommendations')}
                  >
                    <Compass size={16} className="nav-icon" />
                    <span className="nav-text">Recommendations</span>
                  </button>
                  <button 
                    className={`mobile-nav-link-btn ${view === 'profile' ? 'active' : ''}`}
                    onClick={() => setView('profile')}
                  >
                    <User size={16} className="nav-icon" />
                    <span className="nav-text">Profile</span>
                  </button>
                </nav>
                
                <div className="mobile-nav-profile">
                  <div className="mobile-profile-left">
                    <div className="nav-avatar">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="nav-profile-info">
                      <span className="nav-user-name">{user.name}</span>
                      <span className="nav-user-role">Bibliophile</span>
                    </div>
                  </div>
                  <button className="mobile-logout-btn" onClick={handleLogout}>
                    <LogOut size={14} />
                    <span>Log Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      )}

      {/* Main View Router */}
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <PageTransition key="landing">
            <LandingPage onEnterApp={() => setView('auth')} />
          </PageTransition>
        )}

        {view === 'auth' && (
          <PageTransition key="auth">
            <AuthPage onLogin={handleLogin} />
          </PageTransition>
        )}

        {view === 'dashboard' && (
          <PageTransition key="dashboard">
            <Dashboard 
              user={user}
              books={books}
              onUpdateBookProgress={handleUpdateBookProgress}
              onSaveHighlight={handleSaveHighlight}
              goals={yearlyGoalData}
              onUpdateYearlyGoal={handleUpdateYearlyGoal}
            />
          </PageTransition>
        )}

        {view === 'bookshelf' && (
          <PageTransition key="bookshelf">
            <Bookshelf 
              books={books}
              onUpdateBookProgress={handleUpdateBookProgress}
              onUpdateBookStatus={handleUpdateBookStatus}
              onUpdateBookRating={handleUpdateBookRating}
              onDeleteBook={handleDeleteBook}
            />
          </PageTransition>
        )}

        {view === 'search' && (
          <PageTransition key="search">
            <Search 
              libraryBooks={books}
              onAddBookToLibrary={handleAddBookToLibrary}
            />
          </PageTransition>
        )}

        {view === 'recommendations' && (
          <PageTransition key="recommendations">
            <Recommendations 
              libraryBooks={books}
              onAddBookToLibrary={handleAddBookToLibrary}
            />
          </PageTransition>
        )}

        {view === 'profile' && (
          <PageTransition key="profile">
            <Profile 
              user={user}
              books={books}
            />
          </PageTransition>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
