import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/api';
import './AuthPage.css';

const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (isLogin) {
        await authService.login(email, password);
        const userProfile = await authService.me();
        onLogin(userProfile);
      } else {
        await authService.signup(name, email, password);
        // Automatically login after signup
        await authService.login(email, password);
        const userProfile = await authService.me();
        onLogin(userProfile);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.response?.data?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-grid">
        
        {/* Left Side: Editorial Literary Quote Panel */}
        <div className="auth-editorial-panel">
          <div className="auth-panel-overlay" />
          <div className="auth-panel-content">
            <div className="auth-panel-logo">R</div>
            <div className="auth-quote-wrapper">
              <span className="auth-quote-mark">“</span>
              <blockquote className="auth-blockquote">
                I have sometimes dreamt, at least, that when the Day of Judgment dawns and the great conquerors and lawyers and statesmen come to receive their rewards... the Almighty will turn to Peter and will say, not without a certain envy when He sees us coming with our books under our arms, 'Look, these need no reward. We have nothing to give them here. They have loved reading.'
              </blockquote>
              <cite className="auth-quote-cite">— Virginia Woolf, *How Should One Read a Book?*</cite>
            </div>
            <div className="auth-panel-footer">
              <span>Readify Editorial Archive</span>
              <span>No. 42</span>
            </div>
          </div>
        </div>

        {/* Right Side: Cozy Form Console */}
        <div className="auth-form-panel">
          <div className="auth-form-header">
            <h2 className="auth-form-title">
              {isLogin ? 'Enter The Sanctuary' : 'Begin Your Chronicle'}
            </h2>
            <p className="auth-form-subtitle">
              {isLogin ? 'Provide your credentials to return to your library.' : 'Create an account to begin cataloging your library.'}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  className="auth-input-group"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label htmlFor="name">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    required 
                    placeholder="E.g., Julian Barnes"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="auth-input-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                required 
                placeholder="reader@readify.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="auth-input-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                required 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="auth-error-message" style={{ color: '#c94a29', fontSize: '0.9rem', marginBottom: '1rem', borderLeft: '2px solid #c94a29', paddingLeft: '0.75rem', fontFamily: 'var(--font-serif)' }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary auth-submit-btn" disabled={isLoading}>
              {isLoading ? (isLogin ? 'Verifying...' : 'Creating...') : (isLogin ? 'Access Shelf' : 'Create Library')}
            </button>
          </form>

          <div className="auth-toggle">
            <span>
              {isLogin ? "First time in the sanctuary?" : "Already cataloged here?"}
            </span>
            <button 
              className="auth-toggle-btn"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Create a new chronicle' : 'Access your existing shelf'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
