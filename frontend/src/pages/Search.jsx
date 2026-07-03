import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Plus, CheckCircle, Clock, BookOpen } from 'lucide-react';
import Book3D from '../components/Book3D';
import { booksService, getBookCoverColor } from '../services/api';
import './Search.css';

const Search = ({ libraryBooks, onAddBookToLibrary }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [maxPages, setMaxPages] = useState(500);

  // Perform backend search
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setIsLoading(true);
      const data = await booksService.search(searchQuery);
      setSearchResults(data.map(b => ({
        ...b,
        author: b.authors ? b.authors.join(', ') : 'Unknown Author',
        coverColor: getBookCoverColor(b.title)
      })));
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch(query);
  };

  // Perform search on mount with a default term (e.g. "literature") to have interesting catalog initially
  useEffect(() => {
    performSearch("literature");
  }, []);

  const filteredBooks = searchResults.filter(book => {
    const matchesPages = !book.totalPages || book.totalPages <= maxPages;
    return matchesPages;
  });

  const isBookInLibrary = (bookId) => {
    return libraryBooks.some(b => b.bookId === bookId);
  };

  const handleAddBook = (book) => {
    onAddBookToLibrary({
      ...book,
      progress: 0,
      pagesRead: 0,
      rating: 0,
      highlights: [],
      category: 'to-read'
    });
  };

  return (
    <div className="search-container container">
      <div className="search-header">
        <span className="db-sub">Discover Catalog</span>
        <h2>Search Library Archives</h2>
        <p>Browse through volumes of classic and modern literature, and place them on your shelf.</p>
      </div>

      {/* Floating Search Controls */}
      <div className="search-bar-drawer">
        <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
          <SearchIcon className="search-bar-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search by title, author, or keyword... (Press Enter to search)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
        </form>

        {/* Page filter slider */}
        <div className="search-filter-pages">
          <div className="filter-label-row">
            <span>Length Limit</span>
            <strong>{maxPages} pages</strong>
          </div>
          <input 
            type="range" 
            min="100" 
            max="600" 
            step="50"
            value={maxPages}
            onChange={(e) => setMaxPages(parseInt(e.target.value))}
            className="filter-range-slider"
          />
        </div>
      </div>

      {/* Results grid */}
      <div className="search-results-grid">
        {isLoading ? (
          <div className="search-empty-state" style={{ gridColumn: '1 / -1' }}>
            <div className="loading-spinner" style={{ border: '3px solid #e5dcd3', borderTop: '3px solid var(--color-gold)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem auto' }} />
            <h3>Searching Archives...</h3>
            <p>Scanning global catalogs for matching manuscripts.</p>
          </div>
        ) : (
          filteredBooks.map((book) => {
            const added = isBookInLibrary(book.bookId);
            return (
              <div key={book.bookId} className="search-result-card">
                <div className="result-book-visual">
                  <Book3D 
                    title={book.title} 
                    author={book.author} 
                    coverColor={book.coverColor} 
                    progress={0}
                    isOpen={false}
                  />
                </div>

                <div className="result-info">
                  <div className="result-main-meta">
                    <h3>{book.title}</h3>
                    <span className="author">By {book.author}</span>
                    <div className="editorial-divider" style={{ margin: '0.75rem 0' }} />
                    <p className="synopsis">{book.synopsis}</p>
                  </div>

                  <div className="result-footer-meta">
                    <span className="pages-label">
                      <Clock size={12} /> {book.totalPages ? `${book.totalPages} pages` : 'Percentage tracking'}
                    </span>
                    
                    {added ? (
                      <button className="add-shelf-btn added" disabled>
                        <CheckCircle size={14} /> Added to Shelf
                      </button>
                    ) : (
                      <button className="add-shelf-btn" onClick={() => handleAddBook(book)}>
                        <Plus size={14} /> Place on Shelf
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {!isLoading && filteredBooks.length === 0 && (
          <div className="search-empty-state" style={{ gridColumn: '1 / -1' }}>
            <BookOpen size={32} />
            <h3>No Records Uncovered</h3>
            <p>We couldn't locate any manuscripts fitting your criteria. Try adjusting your query or page constraints.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Search;
