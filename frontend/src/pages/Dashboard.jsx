import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Book, BarChart2, Star, Sparkles, Plus, CheckCircle, ChevronLeft, ChevronRight, PenTool } from 'lucide-react';
import Book3D from '../components/Book3D';
import { reflectionsService } from '../services/api';
import './Dashboard.css';

const Dashboard = ({ user, books, onUpdateBookProgress, onSaveHighlight, goals = { read: 3, target: 10 }, onUpdateYearlyGoal }) => {
  const [sanctuaryMode, setSanctuaryMode] = useState(false);
  const [activeHighlightIndex, setActiveHighlightIndex] = useState(0);
  const [newNote, setNewNote] = useState('');
  const [journalBookId, setJournalBookId] = useState('');
  const [journalConfirm, setJournalConfirm] = useState(false);
  const [reflections, setReflections] = useState([]);

  // Sync journalBookId when books list loads
  useEffect(() => {
    if (books.length > 0 && !journalBookId) {
      const active = books.filter(b => b.category === 'currently-reading');
      if (active.length > 0) {
        setJournalBookId(active[0].id);
      } else {
        setJournalBookId(books[0].id);
      }
    }
  }, [books, journalBookId]);

  // Load reflections on mount/update
  useEffect(() => {
    const fetchReflections = async () => {
      try {
        const data = await reflectionsService.getAllReflections();
        setReflections(data);
      } catch (err) {
        console.error("Failed to load reflections:", err);
      }
    };
    if (user) {
      fetchReflections();
    }
  }, [user, books]);

  const activeBooks = books.filter(b => b.category === 'currently-reading');
  const completedBooks = books.filter(b => b.category === 'completed');
  
  // Format reflections to highlights structure expected by UI
  const allHighlights = reflections.map(r => ({
    text: r.content,
    date: r.createdAt,
    bookTitle: r.book?.title || 'Unknown Title',
    bookAuthor: r.book?.authors ? r.book.authors.join(', ') : 'Unknown Author'
  }));

  // Calculate favorite genre based on books in library
  const getFavoriteGenre = () => {
    const genreCounts = {};
    books.forEach(b => {
      if (b.genre) {
        genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1;
      }
    });
    
    let favorite = "None";
    let max = 0;
    
    Object.keys(genreCounts).forEach(g => {
      if (genreCounts[g] > max) {
        max = genreCounts[g];
        favorite = g;
      }
    });
    
    return {
      genre: favorite,
      count: max
    };
  };

  const favGenreData = getFavoriteGenre();

  // Toggle Sanctuary Mode
  const toggleSanctuary = () => {
    setSanctuaryMode(!sanctuaryMode);
    if (!sanctuaryMode) {
      document.body.classList.add('sanctuary-dark');
    } else {
      document.body.classList.remove('sanctuary-dark');
    }
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !journalBookId) return;

    await onSaveHighlight(journalBookId, newNote);
    setNewNote('');
    setJournalConfirm(true);
    setTimeout(() => setJournalConfirm(false), 3000);
    
    // Refresh reflections list
    try {
      const data = await reflectionsService.getAllReflections();
      setReflections(data);
    } catch (err) {
      console.error(err);
    }
  };

  const nextHighlight = () => {
    if (allHighlights.length === 0) return;
    setActiveHighlightIndex((prev) => (prev + 1) % allHighlights.length);
  };

  const prevHighlight = () => {
    if (allHighlights.length === 0) return;
    setActiveHighlightIndex((prev) => (prev - 1 + allHighlights.length) % allHighlights.length);
  };

  return (
    <div className={`dashboard-container ${sanctuaryMode ? 'sanctuary-focus' : ''}`}>
      
      {/* Top Banner Sanctuary Toggle */}
      <div className="dashboard-control-bar container">
        <div className="db-welcome">
          <span className="db-sub">Sanctuary Console</span>
          <h2>Welcome back, <span className="gold-text">{user?.name || 'Reader'}</span></h2>
        </div>
        <button 
          className={`btn-sanctuary ${sanctuaryMode ? 'active' : ''}`}
          onClick={toggleSanctuary}
        >
          <Sparkles size={16} />
          {sanctuaryMode ? 'Exit Focus Sanctuary' : 'Enter Focus Sanctuary'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!sanctuaryMode ? (
          /* Normal Dashboard Layout */
          <motion.div 
            key="normal-dashboard"
            className="dashboard-content container"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: varEase }}
          >
            
            {/* Grid Row 1: Yearly Goals & Favorite Genre Analytics */}
            <div className="db-row-goals">
              
              {/* Yearly Goals Card */}
              <div className="db-card goal-card">
                <div className="db-card-header" style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3>Yearly Reading Progress</h3>
                    <button 
                      onClick={() => {
                        const newGoal = prompt("Enter your new yearly reading goal:", goals.target);
                        if (newGoal && !isNaN(newGoal)) {
                          onUpdateYearlyGoal(parseInt(newGoal));
                        }
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gold)', display: 'flex', padding: 0 }}
                      title="Edit Yearly Goal"
                    >
                      <PenTool size={14} />
                    </button>
                  </div>
                  <span className="badge">{goals.read} / {goals.target} Books</span>
                </div>
                <div className="goal-track-container">
                  <div className="goal-track-bar">
                    <div 
                      className="goal-track-fill" 
                      style={{ width: `${(goals.read / goals.target) * 100}%` }}
                    />
                    
                    {/* Goal Milestone Markers */}
                    {Array.from({ length: goals.target }).map((_, idx) => {
                      const completed = idx < goals.read;
                      const matchedBook = completedBooks[idx];
                      return (
                        <div 
                          key={idx} 
                          className={`goal-marker ${completed ? 'completed' : ''}`}
                          style={{ left: `${((idx + 1) / goals.target) * 100}%` }}
                        >
                          <div className="goal-marker-dot" />
                          {matchedBook && (
                            <div className="goal-marker-tooltip">
                              <strong>{matchedBook.title}</strong>
                              <span>Read in 2026</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="goal-labels">
                    <span>Chronicle Start</span>
                    <span>Goal: {goals.target} Books</span>
                  </div>
                </div>
              </div>

              {/* Favorite Genre Card */}
              <div className="db-card genre-card">
                <div className="db-card-header">
                  <h3>Favorite Genre</h3>
                  <span className="badge-sub">Most Read Genre</span>
                </div>
                <div className="genre-card-content">
                  <div className="genre-icon-container">
                    <Book className="genre-icon-svg" size={32} />
                  </div>
                  <div className="genre-info-wrapper">
                    <h4 className="genre-title-name">{favGenreData.genre}</h4>
                    <p className="genre-subtitle-desc">{favGenreData.count} {favGenreData.count === 1 ? 'Volume' : 'Volumes'} Catalogued</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Grid Row 2: Currently Reading & Recent Highlights */}
            <div className="db-row-reading">
              
              {/* Currently Reading list */}
              <div className="db-card current-reading-card">
                <div className="db-card-header">
                  <h3>Currently Reading</h3>
                  <span className="count-circle">{activeBooks.length}</span>
                </div>
                <div className="current-books-list">
                  {activeBooks.map(book => (
                    <div key={book.id} className="current-book-item">
                      <div className="item-book-visual">
                        <Book3D 
                          title={book.title} 
                          author={book.author} 
                          coverColor={book.coverColor} 
                          progress={book.progress}
                          isOpen={false}
                        />
                      </div>
                      <div className="item-book-info">
                        <h4>{book.title}</h4>
                        <span className="author">By {book.author}</span>
                        <div className="item-progress-control">
                          <div className="item-progress-stats">
                            <span>{book.progress}% Completed</span>
                            <span>{book.pagesRead} / {book.totalPages} pages</span>
                          </div>
                          <div className="progress-slider-wrapper">
                            <input 
                              type="range" 
                              min="0" 
                              max={book.totalPages} 
                              value={book.pagesRead}
                              onChange={(e) => {
                                const pages = parseInt(e.target.value);
                                onUpdateBookProgress(book.id, pages);
                              }}
                              className="progress-input-range"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {activeBooks.length === 0 && (
                    <div className="empty-state">
                      <BookOpen size={24} />
                      <p>Your sanctuary desk is empty. Place a book here to begin.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Highlights Panel */}
              <div className="db-card highlights-card">
                <div className="db-card-header">
                  <h3>Recent Reflections</h3>
                  <div className="carousel-controls">
                    <button className="carousel-btn" onClick={prevHighlight}>
                      <ChevronLeft size={16} />
                    </button>
                    <button className="carousel-btn" onClick={nextHighlight}>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                <div className="highlights-carousel-viewport">
                  {allHighlights.length > 0 ? (
                    <motion.div 
                      key={activeHighlightIndex}
                      className="highlight-carousel-item"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="quote-icon">“</span>
                      <p className="highlight-quote-text">{allHighlights[activeHighlightIndex].text}</p>
                      <div className="highlight-quote-source">
                        <strong>{allHighlights[activeHighlightIndex].bookTitle}</strong>
                        <span>By {allHighlights[activeHighlightIndex].bookAuthor}</span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="empty-state">
                      <PenTool size={24} />
                      <p>No reflections captured yet. Enter sanctuary mode to log highlights.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </motion.div>
        ) : (
          /* Sanctuary Focus Mode Layout */
          <motion.div 
            key="sanctuary-dashboard"
            className="sanctuary-focused-grid container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            
            {/* Left side: The Open active Book */}
            <div className="focus-book-viewer">
              {activeBooks[0] ? (
                <div className="focused-book-container">
                  <div className="focused-book-details">
                    <span className="focus-reading-tag">Now Reading</span>
                    <h3>{activeBooks[0].title}</h3>
                    <p className="focus-reading-author">By {activeBooks[0].author}</p>
                    <div className="focus-meta-lines">
                      <div className="meta-line">
                        <span>Progress</span>
                        <span>{activeBooks[0].progress}%</span>
                      </div>
                      <div className="meta-line-bar">
                        <div className="meta-line-fill" style={{ width: `${activeBooks[0].progress}%` }} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="focused-3d-wrapper">
                    <Book3D 
                      title={activeBooks[0].title}
                      author={activeBooks[0].author}
                      coverColor={activeBooks[0].coverColor}
                      progress={activeBooks[0].progress}
                      isOpen={true}
                      showBookmark={true}
                    />
                  </div>
                </div>
              ) : (
                <div className="focused-book-empty">
                  <h3>Select a book to read</h3>
                  <p>Go to your Bookshelf and mark a book as "Currently Reading" to view it in sanctuary mode.</p>
                </div>
              )}
            </div>

            {/* Right side: Modern Writing Journal pad */}
            <div className="focus-journal-notebook">
              <div className="journal-header">
                <h3>The Journal</h3>
                <p>Record notes, quotes, or thoughts on your reading session.</p>
              </div>

              <form onSubmit={handleSaveNote} className="journal-form">
                <div className="journal-select-wrapper">
                  <label htmlFor="journal-book-select">Select Book</label>
                  <select 
                    id="journal-book-select"
                    value={journalBookId}
                    onChange={(e) => setJournalBookId(e.target.value)}
                  >
                    {books.map(b => (
                      <option key={b.id} value={b.id}>{b.title}</option>
                    ))}
                  </select>
                </div>

                <div className="journal-text-wrapper">
                  <label htmlFor="journal-textarea">Scribble Reflections</label>
                  <textarea 
                    id="journal-textarea"
                    placeholder="Capture a line you loved or jot down a reflection..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={6}
                    required
                  />
                </div>

                <div className="journal-submit-row">
                  <button type="submit" className="btn-primary journal-btn">
                    Save Highlight
                  </button>
                  <AnimatePresence>
                    {journalConfirm && (
                      <motion.span 
                        className="journal-saved-message"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <CheckCircle size={14} className="success-icon" />
                        Saved to Archive
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Easing token helper
const varEase = [0.16, 1, 0.3, 1];

export default Dashboard;
