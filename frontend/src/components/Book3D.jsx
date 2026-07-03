import React from 'react';
import './Book3D.css';

const Book3D = ({ 
  title = "Untitled", 
  author = "Unknown Author", 
  coverColor = "linear-gradient(135deg, #3a2212 0%, #1c1007 100%)", 
  progress = 0, 
  isOpen = false, 
  onClick = null,
  showBookmark = false
}) => {
  return (
    <div className={`book-container ${isOpen ? 'is-open' : ''}`} onClick={onClick}>
      <div className="book-3d">
        {/* Front Cover */}
        <div className="book-cover-front" style={{ background: coverColor }}>
          <div className="book-cover-design">
            <div className="book-cover-border">
              <div className="book-cover-title">{title}</div>
              <div className="book-cover-author">{author}</div>
              <div className="book-cover-gold-seal">R</div>
            </div>
          </div>
          {/* Progress foil at the bottom */}
          {progress > 0 && (
            <div className="book-cover-progress-bar" style={{ width: `${progress}%` }} />
          )}
        </div>

        {/* Spine */}
        <div className="book-spine" style={{ background: coverColor }}>
          <div className="book-spine-text">{title}</div>
        </div>

        {/* Pages stack inside */}
        <div className="book-pages">
          <div className="book-page page-1">
            <div className="book-page-content">
              <h3>{title}</h3>
              <p className="page-meta">By {author}</p>
              <div className="page-divider-ornament">~</div>
              <p className="page-text-snippet">
                "In the silence of the library, the world resolves itself into words, and the mind finds its true companion..."
              </p>
              <div className="page-number">1</div>
            </div>
          </div>
          <div className="book-page page-2" />
          <div className="book-page page-3" />
          <div className="book-page page-4" />
        </div>

        {/* Golden Bookmark ribbon */}
        {showBookmark && (
          <div className="book-bookmark-ribbon" />
        )}

        {/* Back Cover */}
        <div className="book-cover-back" style={{ background: coverColor }} />
      </div>
    </div>
  );
};

export default Book3D;
