import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Book3D from '../components/Book3D';
import './LandingPage.css';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = ({ onEnterApp }) => {
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const bookWrapperRef = useRef(null);
  const bookContainerRef = useRef(null);
  
  // Elements for scroll milestones
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const step4Ref = useRef(null);

  useEffect(() => {
    // Parallax mouse effect on Hero Book before scroll starts
    const handleMouseMove = (e) => {
      if (window.scrollY > window.innerHeight * 0.5) return;
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 30;
      const yPos = (clientY / window.innerHeight - 0.5) * 30;
      
      gsap.to('.hero-book-wrapper', {
        rotateY: -20 + xPos,
        rotateX: 10 - yPos,
        duration: 0.8,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // GSAP ScrollTrigger Timeline for Storyteller Pinned Section
    const ctx = gsap.context(() => {
      // 1. Fade in Hero Elements
      gsap.from('.hero-title span', {
        y: 80,
        opacity: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: 'power4.out'
      });

      gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 0.6,
        ease: 'power3.out'
      });

      gsap.from('.hero-book-container', {
        opacity: 0,
        scale: 0.9,
        duration: 1.2,
        delay: 0.4,
        ease: 'power4.out'
      });

      // 2. Storytelling timeline pinned scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: '+=300%', // 3 full screens of scroll
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      // Step 1 -> Step 2: Book rotates and moves center
      tl.to(bookWrapperRef.current, {
        x: '0%',
        rotateY: 0,
        rotateX: 0,
        scale: 1.2,
        duration: 1,
      })
      // Open the cover (simulate by adding class or directly animating DOM)
      .to('.landing-story-book .book-cover-front', {
        rotateY: -130,
        duration: 1.5,
        ease: 'power2.inOut'
      }, '-=0.5')
      .to('.landing-story-book .book-page.page-1', { rotateY: -20, translateZ: 0.8, duration: 1.5 }, '-=1.5')
      .to('.landing-story-book .book-page.page-2', { rotateY: -15, translateZ: 0.5, duration: 1.5 }, '-=1.5')
      .to('.landing-story-book .book-page.page-3', { rotateY: -10, translateZ: 0.2, duration: 1.5 }, '-=1.5')
      .to('.landing-story-book .book-page.page-4', { rotateY: -5, duration: 1.5 }, '-=1.5')
      .to('.landing-story-book .book-bookmark-ribbon', { translateY: 10, duration: 1.5 }, '-=1.5')
      .to('.landing-story-book .book-page-content', { opacity: 1, rotateY: 0, duration: 1 }, '-=0.8');

      // Step 2 -> Step 3: Extract highlight cards
      tl.to('.landing-story-book .page-text-snippet', {
        color: '#C5A073',
        textShadow: '0 0 8px rgba(197, 160, 115, 0.4)',
        duration: 0.8
      })
      .from('.floating-highlight-card', {
        opacity: 0,
        x: -40,
        scale: 0.8,
        stagger: 0.3,
        duration: 1.2,
        ease: 'power3.out'
      }, '-=0.2');

      // Step 3 -> Step 4: Close book and transition into library display
      tl.to('.floating-highlight-card', {
        opacity: 0,
        y: -30,
        stagger: 0.1,
        duration: 0.8
      })
      .to('.landing-story-book .book-cover-front', {
        rotateY: 0,
        duration: 1.2,
        ease: 'power2.inOut'
      })
      .to('.landing-story-book .book-page', { rotateY: 0, translateZ: 0, duration: 1.2 }, '-=1.2')
      .to('.landing-story-book .book-page-content', { opacity: 0, duration: 0.5 }, '-=1.2')
      .to(bookWrapperRef.current, {
        rotateY: -90, // show spine
        x: '-25%',
        scale: 1,
        duration: 1
      }, '-=0.4')
      .from('.story-shelf-line', {
        width: 0,
        opacity: 0,
        duration: 0.8
      }, '-=0.5')
      .from('.other-shelf-books .shelf-book-spine', {
        opacity: 0,
        y: 50,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.5');

      // Pin the text steps synchronously
      gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: '+=300%',
          scrub: 1
        }
      })
      .to(step1Ref.current, { opacity: 0, y: -50, duration: 1 })
      .to(step2Ref.current, { opacity: 1, y: 0, duration: 1 })
      .to(step2Ref.current, { opacity: 0, y: -50, duration: 1, delay: 0.5 })
      .to(step3Ref.current, { opacity: 1, y: 0, duration: 1 })
      .to(step3Ref.current, { opacity: 0, y: -50, duration: 1, delay: 0.5 })
      .to(step4Ref.current, { opacity: 1, y: 0, duration: 1 });
      
    }, containerRef);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      ctx.revert(); // clean up GSAP triggers
    };
  }, []);

  return (
    <div className="landing-container" ref={containerRef}>
      
      {/* 1. Cinematic Hero Section */}
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-content">
            <h1 className="hero-title">
              <span>The Art of</span> <br />
              <span className="italic gold-text">Reading, Redefined.</span>
            </h1>
            <p className="hero-subtitle">
              A premium, distraction-free sanctuary designed to track progress, catalog volumes, and capture literary reflections.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={onEnterApp}>
                Enter Sanctuary
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => {
                  triggerRef.current.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore The Journey
              </button>
            </div>
          </div>
          
          <div className="hero-book-container">
            <div className="hero-book-wrapper">
              <Book3D 
                title="The Odyssey of Words" 
                author="Homer & Scholars" 
                coverColor="linear-gradient(135deg, #1C150E 0%, #3E2F20 100%)"
                showBookmark={true}
              />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <span className="scroll-text">Scroll to Begin</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* 2. Scroll-Pinned Storyteller Section */}
      <section className="storyteller-trigger" ref={triggerRef}>
        <div className="storyteller-layout">
          
          {/* Left Canvas: Holds the transforming 3D book */}
          <div className="storyteller-canvas">
            <div className="shelf-decorator">
              <div className="story-shelf-line" />
            </div>

            <div className="book-stage" ref={bookWrapperRef}>
              <div className="landing-story-book">
                <Book3D 
                  title="Days at the Morisaki Bookshop" 
                  author="Satoshi Yagisawa" 
                  coverColor="linear-gradient(135deg, #9C4B33 0%, #5E2618 100%)"
                  progress={65}
                  showBookmark={true}
                />
              </div>

              {/* Auxiliary Books on shelf that appear in step 4 */}
              <div className="other-shelf-books">
                <div className="shelf-book-spine spine-gold">
                  <span>Marginalia</span>
                </div>
                <div className="shelf-book-spine spine-dark">
                  <span>The Archivist</span>
                </div>
                <div className="shelf-book-spine spine-cream">
                  <span>Essays</span>
                </div>
              </div>
            </div>

            {/* Floating Highlight Cards (appear in step 3) */}
            <div className="floating-highlight-cards-container">
              <div className="floating-highlight-card card-1">
                <span className="quote-mark">“</span>
                <p>We read to know we are not alone.</p>
                <span className="quote-author">— C.S. Lewis</span>
              </div>
              <div className="floating-highlight-card card-2">
                <span className="quote-mark">“</span>
                <p>Books are a uniquely portable magic.</p>
                <span className="quote-author">— Stephen King</span>
              </div>
            </div>
          </div>

          {/* Right Narrative panels */}
          <div className="storyteller-narrative">
            
            {/* Step 1: Your Shelf */}
            <div className="narrative-step active-step" ref={step1Ref}>
              <span className="step-num">01 / Library</span>
              <h2 className="step-heading">Your Personal Archive</h2>
              <p className="step-description">
                A digital sanctuary for your physical library. Organize your volumes on custom brass shelves, cataloged by your reading progress. Experience a library that feels tactile and alive.
              </p>
            </div>

            {/* Step 2: Tracking Progress */}
            <div className="narrative-step" ref={step2Ref} style={{ opacity: 0, transform: 'translateY(50px)' }}>
              <span className="step-num">02 / Goals</span>
              <h2 className="step-heading">Refined Progress Tracking</h2>
              <p className="step-description">
                Place your virtual bookmark and watch the pages stack. Set yearly reading goals and log progress in a visually stunning interface that emphasizes focus over metric overload.
              </p>
            </div>

            {/* Step 3: Highlights & Reflections */}
            <div className="narrative-step" ref={step3Ref} style={{ opacity: 0, transform: 'translateY(50px)' }}>
              <span className="step-num">03 / Thoughts</span>
              <h2 className="step-heading">Capture the Essence</h2>
              <p className="step-description">
                Extract your thoughts. Readify isolates key snippets, reviews, and personal reflections, formatting them into beautiful editorial quote cards that are easy to browse and search.
              </p>
            </div>

            {/* Step 4: The Core App */}
            <div className="narrative-step" ref={step4Ref} style={{ opacity: 0, transform: 'translateY(50px)' }}>
              <span className="step-num">04 / Sanctuary</span>
              <h2 className="step-heading">Step Inside</h2>
              <p className="step-description">
                Ready to transform your library? Join a refined space designed to catalog your thoughts and nurture your love of letters.
              </p>
              <button className="btn-primary storyteller-cta" onClick={onEnterApp}>
                Enter Sanctuary
              </button>
            </div>

          </div>
          
        </div>
      </section>

      {/* 3. Cinematic Footer CTA */}
      <section className="landing-footer-section">
        <div className="footer-bg-image" style={{ backgroundImage: `url(/hero.png)` }} />
        <div className="footer-overlay" />
        <div className="footer-content">
          <div className="footer-logo">R</div>
          <h2 className="footer-heading">Begin Your Literary Journey</h2>
          <p className="footer-subtext">
            Join thousands of deliberate readers who choose sanctuary over screen time.
          </p>
          <button className="btn-primary btn-large" onClick={onEnterApp}>
            Access Your Bookshelf
          </button>
          <div className="footer-editorial-info">
            <span>Readify v1.2</span>
            <span>•</span>
            <span>Designed for Readers</span>
            <span>•</span>
            <span>Est. 2026</span>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
