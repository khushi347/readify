import React, { useState, useEffect } from 'react';
import { Award, Calendar, BookOpen, Clock, PenTool } from 'lucide-react';
import { reflectionsService } from '../services/api';
import './Profile.css';

const Profile = ({ user, books }) => {
  const [reflections, setReflections] = useState([]);

  useEffect(() => {
    const loadReflections = async () => {
      try {
        const data = await reflectionsService.getAllReflections();
        setReflections(data);
      } catch (err) {
        console.error("Failed to load reflections in Profile:", err);
      }
    };
    loadReflections();
  }, [books]);

  const completedBooks = books.filter(b => b.category === 'completed');
  const currentlyReading = books.filter(b => b.category === 'currently-reading');
  const toRead = books.filter(b => b.category === 'to-read');
  
  const totalPagesRead = books.reduce((sum, b) => sum + b.pagesRead, 0);
  const totalHighlights = reflections.length;

  // Define Achievements Stamps
  const badges = [
    {
      id: 'archivist',
      title: 'Dedicated Archivist',
      desc: 'Finished 3 or more volumes.',
      unlocked: completedBooks.length >= 3,
    },
    {
      id: 'nocturnal',
      title: 'Thought Curator',
      desc: 'Logged 3 or more custom reflections.',
      unlocked: totalHighlights >= 3,
    },
    {
      id: 'completionist',
      title: 'Parnassus Inhabitant',
      desc: 'Completed at least 1 book.',
      unlocked: completedBooks.length >= 1,
    }
  ];

  // Dynamic timeline items from books & reflections
  const timelineEvents = [];
  
  books.forEach(book => {
    // Finished event
    if (book.category === 'completed') {
      timelineEvents.push({
        date: book.updatedAt ? new Date(book.updatedAt) : new Date(),
        type: 'completion',
        title: `Completed ${book.title}`,
        desc: `Logged 100% completion (rating: ${book.rating} stars).`
      });
    }

    // Added event
    timelineEvents.push({
      date: book.createdAt ? new Date(book.createdAt) : new Date(),
      type: 'addition',
      title: `Placed ${book.title} on Shelf`,
      desc: `Registered as '${book.category.replace('-', ' ')}'.`
    });
  });

  // Highlights event from reflections
  reflections.forEach(h => {
    timelineEvents.push({
      date: new Date(h.createdAt),
      type: 'highlight',
      title: `Captured snippet in ${h.book?.title || 'Unknown Title'}`,
      desc: `“${h.content}”`
    });
  });

  // Sort timeline chronologically
  const sortedTimeline = timelineEvents.sort((a, b) => b.date - a.date).slice(0, 8);

  return (
    <div className="profile-container container">
      
      <div className="profile-header">
        <span className="db-sub">Reader Profile</span>
        <h2>Your Chronicle Timeline</h2>
        <p>A historical overview of your reading habits, achievements, and milestones.</p>
      </div>

      {/* Stats Summary Panel */}
      <div className="profile-stats-grid">
        <div className="profile-stat-card">
          <BookOpen size={20} className="stat-icon" />
          <div className="stat-value">{books.length}</div>
          <div className="stat-label">Total Volumes</div>
        </div>
        <div className="profile-stat-card">
          <Award size={20} className="stat-icon" />
          <div className="stat-value">{completedBooks.length}</div>
          <div className="stat-label font-gold">Volumes Read</div>
        </div>
        <div className="profile-stat-card">
          <Clock size={20} className="stat-icon" />
          <div className="stat-value">{totalPagesRead}</div>
          <div className="stat-label">Pages Logged</div>
        </div>
        <div className="profile-stat-card">
          <PenTool size={20} className="stat-icon" />
          <div className="stat-value">{totalHighlights}</div>
          <div className="stat-label">Reflections Saved</div>
        </div>
      </div>

      {/* Row: Stamps on left, Timeline on right */}
      <div className="profile-content-row">
        
        {/* Achievements Column */}
        <div className="profile-stamps-col">
          <h3 className="section-title">Archival Stamps</h3>
          <div className="stamps-list">
            {badges.map((b) => (
              <div key={b.id} className={`stamp-item ${b.unlocked ? 'unlocked' : 'locked'}`}>
                <div className="stamp-circle">
                  <span>R</span>
                </div>
                <div className="stamp-info">
                  <h4>{b.title}</h4>
                  <p>{b.desc}</p>
                  <span className="stamp-status">
                    {b.unlocked ? '✓ Seal Unlocked' : 'Locked'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Column */}
        <div className="profile-timeline-col">
          <h3 className="section-title">Activity Chronology</h3>
          <div className="timeline-tree">
            {sortedTimeline.map((ev, idx) => (
              <div key={idx} className="timeline-node">
                <div className="node-marker-line">
                  <div className={`node-marker ${ev.type}`} />
                  {idx !== sortedTimeline.length - 1 && <div className="node-line" />}
                </div>
                <div className="node-content">
                  <div className="node-meta">
                    <span className="node-date">{ev.date.toLocaleDateString()}</span>
                    <span className={`node-tag ${ev.type}`}>{ev.type}</span>
                  </div>
                  <h4 className="node-title">{ev.title}</h4>
                  <p className="node-desc">{ev.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Profile;
