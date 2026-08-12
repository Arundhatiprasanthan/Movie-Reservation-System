import React, { useState } from 'react';
import { Eye, EyeOff, ShieldAlert } from 'lucide-react';

export default function SignInModal({ isOpen, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('USER'); // 'USER' (Member) | 'ADMIN' (Administrator)
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Handle Demo Autofill (Matching Figma requirement)
  const handleAutofill = (demoUser) => {
    setError('');
    setActiveTab('signin');
    if (demoUser === 'member') {
      setEmail('alex.rivera@example.com');
      setPassword('memberPass123');
    } else if (demoUser === 'admin') {
      setEmail('morgan.adeyemi@admin.com');
      setPassword('adminPass123');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const isDemoAdmin = email.includes('admin') || role === 'ADMIN';
      const userSession = {
        name: activeTab === 'register' ? fullName || (role === 'ADMIN' ? 'Morgan Adeyemi' : 'Alex Rivera') : (isDemoAdmin ? 'Morgan Adeyemi' : 'Alex Rivera'),
        email: email,
        role: isDemoAdmin ? 'ADMIN' : 'USER',
        token: 'mock-jwt-token-' + Date.now()
      };

      onSuccess(userSession);
    }, 800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        {/* Title */}
        <h2 className="auth-title">
          {activeTab === 'signin' ? 'Sign In' : 'Register'}
        </h2>

        {/* Tab Switcher */}
        <div className="tab-switcher">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'signin' ? 'active' : ''}`}
            onClick={() => { setActiveTab('signin'); setError(''); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setError(''); }}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="auth-error-box">
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="auth-form">
          {activeTab === 'register' && (
            <div className="form-group">
              <label className="form-label">FULL NAME</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Alex Rivera"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">EMAIL ADDRESS</label>
            <div className="input-wrapper">
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">PASSWORD</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="input-icon-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* ACCOUNT ROLE Section (Matching Figma screenshot exactly: Member | Administrator) */}
          {activeTab === 'register' && (
            <div className="form-group">
              <label className="form-label">ACCOUNT ROLE</label>
              <div className="role-switcher">
                <button
                  type="button"
                  className={`role-btn ${role === 'USER' ? 'active' : ''}`}
                  onClick={() => setRole('USER')}
                >
                  Member
                </button>
                <button
                  type="button"
                  className={`role-btn ${role === 'ADMIN' ? 'active' : ''}`}
                  onClick={() => setRole('ADMIN')}
                >
                  Administrator
                </button>
              </div>
            </div>
          )}

          {/* Demo Accounts Panel for Sign In */}
          {activeTab === 'signin' && (
            <div className="demo-accounts-box">
              <div className="demo-title">Demo accounts — click to autofill:</div>
              <div className="demo-list">
                <button
                  type="button"
                  className="demo-item-btn"
                  onClick={() => handleAutofill('member')}
                >
                  <span className="demo-link-text">Member — Alex Rivera</span>
                </button>
                <button
                  type="button"
                  className="demo-item-btn"
                  onClick={() => handleAutofill('admin')}
                >
                  <span className="demo-link-text">Admin — Morgan Adeyemi</span>
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner"></div>
                <span>Authenticating...</span>
              </>
            ) : (
              <span>{activeTab === 'signin' ? 'Sign In' : 'Register'}</span>
            )}
          </button>
        </form>

        {/* Cancel Button */}
        <button type="button" className="cancel-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
