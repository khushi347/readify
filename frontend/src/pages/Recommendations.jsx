import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, ArrowRight, CheckCircle, Plus, BookOpen } from 'lucide-react';
import Book3D from '../components/Book3D';
import { booksService, getBookCoverColor } from '../services/api';
import './Recommendations.css';

const Recommendations = ({ libraryBooks, onAddBookToLibrary }) => {
  const [selectedMood, setSelectedMood] = useState('reflective');
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favoriteGenre, setFavoriteGenre] = useState('');

  const moods = [
    { id: 'reflective', label: 'Reflective', desc: 'Poetic, gentle, and deep' },
    { id: 'analytical', label: 'Analytical', desc: 'Fact-driven, logical, and structured' },
    { id: 'escapist', label: 'Escapist', desc: 'Grand scale fantasy, sci-fi, and myth' },
    { id: 'compelling', label: 'Compelling', desc: 'Fast, urgent classics and dramas' },
    { id: 'personalized', label: 'Your Genre', desc: 'Tailored to your reading history' }
  ];

  useEffect(() => {
    const loadRecommendations = async () => {
      setIsLoading(true);
      try {
        if (selectedMood === 'personalized') {
          try {
            const data = await booksService.getRecommendations();
            setFavoriteGenre(data.favoriteGenre || 'Unknown');
            setBooks(data.recommendations.slice(0, 4).map(b => ({
              id: b.bookId,
              bookId: b.bookId,
              title: b.title,
              author: b.authors ? b.authors.join(', ') : 'Unknown Author',
              coverColor: getBookCoverColor(b.title),
              synopsis: b.synopsis || 'No synopsis available.',
              totalPages: b.totalPages || null,
              whyRead: `Recommended because your favorite library genre is "${data.favoriteGenre}".`
            })));
          } catch (err) {
            console.error("Personalized recommendations error:", err);
            setBooks([]);
          }
        } else {
          // Map mood to queries
          const moodQueries = {
            reflective: 'poetry philosophy memoir',
            analytical: 'science history psychology',
            escapist: 'fantasy sci-fi adventure',
            compelling: 'mystery thriller drama'
          };
          const query = moodQueries[selectedMood];
          const results = await booksService.search(query);
          
          const moodExplanations = {
            reflective: 'Provides deep philosophical insights and emotional resonance.',
            analytical: 'Features structured, data-driven analysis of key concepts.',
            escapist: 'Offers an immersive journey into beautifully constructed imaginary worlds.',
            compelling: 'Contains high-stakes narrative speed and dramatic tension.'
          };

          setBooks(results.slice(0, 4).map(b => ({
            id: b.bookId,
            bookId: b.bookId,
            title: b.title,
            author: b.authors ? b.authors.join(', ') : 'Unknown Author',
            coverColor: getBookCoverColor(b.title),
            synopsis: b.synopsis || 'No synopsis available.',
            totalPages: b.totalPages || null,
            whyRead: moodExplanations[selectedMood]
          })));
        }
      } catch (err) {
        console.error("Failed to load recommendations:", err);
        setBooks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendations();
  }, [selectedMood]);

  const handleAddRecommendation = (book) => {
    onAddBookToLibrary({
      ...book,
      progress: 0,
      pagesRead: 0,
      rating: 0,
      highlights: [],
      category: 'to-read'
    });
  };

  const isBookInLibrary = (bookId) => {
    return libraryBooks.some(b => b.bookId === bookId);
  };

  return (
    <div className="recommendations-container container">
      
      <div className="recs-header">
        <span className="db-sub">Literary Oracle</span>
        <h2>Curated Recommendations</h2>
        <p>Declare your current reading disposition, and let Readify suggest your next volume.</p>
      </div>

      {/* Mood Selector row */}
      <div className="mood-selectors-grid">
        {moods.map((mood) => (
          <button 
            key={mood.id} 
            className={`mood-button ${selectedMood === mood.id ? 'active' : ''}`}
            onClick={() => setSelectedMood(mood.id)}
          >
            <Compass size={18} className="mood-icon" />
            <div className="mood-btn-text">
              <strong>{mood.label}</strong>
              <span>{mood.desc}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Recommendations Display Panel */}
      <div className="recs-viewport">
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedMood}
            className="recs-cards-row"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            {isLoading ? (
              <div className="search-empty-state" style={{ width: '100%' }}>
                <div className="loading-spinner" style={{ border: '3px solid #e5dcd3', borderTop: '3px solid var(--color-gold)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem auto' }} />
                <h3>Consulting Oracle...</h3>
                <p>Retrieving select works from the global catalogs.</p>
              </div>
            ) : books.length > 0 ? (
              books.map((book) => {
                const added = isBookInLibrary(book.bookId);
                return (
                  <div key={book.bookId} className="rec-card-box">
                    <div className="rec-card-body">
                      
                      <div className="rec-card-left">
                        <div className="rec-book-visual-wrapper">
                          <Book3D 
                            title={book.title} 
                            author={book.author} 
                            coverColor={book.coverColor} 
                            progress={0}
                            isOpen={false}
                          />
                        </div>
                      </div>

                      <div className="rec-card-right">
                        <span className="rec-editorial-stamp">
                          <Sparkles size={12} /> Editorial Choice
                        </span>
                        <h3>{book.title}</h3>
                        <span className="rec-author">By {book.author}</span>
                        
                        <div className="editorial-divider" style={{ margin: '1rem 0' }} />
                        
                        <p className="rec-synopsis">{book.synopsis}</p>
                        
                        <div className="rec-why-box">
                          <strong>Why you should read this:</strong>
                          <p>{book.whyRead}</p>
                        </div>

                        <div className="rec-actions">
                          {added ? (
                            <button className="btn-primary rec-add-btn added" disabled>
                              <CheckCircle size={14} /> Added to Shelf
                            </button>
                          ) : (
                            <button className="btn-primary rec-add-btn" onClick={() => handleAddRecommendation(book)}>
                              <Plus size={14} /> Add to Shelf <ArrowRight size={12} style={{ marginLeft: '4px' }} />
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })
            ) : (
              <div className="search-empty-state" style={{ width: '100%' }}>
                <BookOpen size={32} />
                <h3>Oracle is Silent</h3>
                {selectedMood === 'personalized' ? (
                  <p>Add and categorize books on your shelf to establish a genre pattern for recommendations.</p>
                ) : (
                  <p>No titles were found for this reading disposition at the moment.</p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
};

export default Recommendations;
