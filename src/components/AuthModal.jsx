import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Eye, EyeOff, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student Evaluator');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'signup') {
      if (!name.trim() || !regNo.trim() || !email.trim() || !password.trim()) {
        setErrorMsg('Please fill in all required fields.');
        return;
      }

      const newUser = {
        name: name.trim(),
        regNo: regNo.trim(),
        email: email.trim(),
        role: role,
        initials: name.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        favorites: []
      };

      // Save user session
      localStorage.setItem('aeropulse_user', JSON.stringify(newUser));
      setSuccessMsg(`Account created successfully! Welcome, ${newUser.name}.`);
      
      setTimeout(() => {
        onLoginSuccess(newUser);
        onClose();
      }, 900);

    } else {
      // Login Mode
      if (!email.trim() || !password.trim()) {
        setErrorMsg('Please enter your email/register number and password.');
        return;
      }

      const derivedName = email.includes('@') ? email.split('@')[0] : email;
      const loggedUser = {
        name: derivedName.charAt(0).toUpperCase() + derivedName.slice(1),
        regNo: email.includes('@') ? '212222040015' : email,
        email: email.includes('@') ? email : `${email}@aeropulse.io`,
        role: 'Authenticated Member',
        initials: derivedName.substring(0, 2).toUpperCase(),
        favorites: []
      };

      localStorage.setItem('aeropulse_user', JSON.stringify(loggedUser));
      setSuccessMsg(`Welcome back, ${loggedUser.name}!`);

      setTimeout(() => {
        onLoginSuccess(loggedUser);
        onClose();
      }, 700);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 10, 20, 0.85)',
      backdropFilter: 'blur(16px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: '2rem', border: '1px solid var(--border-glow)', position: 'relative' }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn-secondary"
          style={{ position: 'absolute', top: '16px', right: '16px', padding: '0.4rem', borderRadius: '50%' }}
        >
          <X size={18} />
        </button>

        {/* Modal Header Tabs */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.15rem',
              fontWeight: 800,
              color: mode === 'login' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              cursor: 'pointer',
              borderBottom: mode === 'login' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              paddingBottom: '0.35rem',
              transition: 'all 0.2s ease'
            }}
          >
            Sign In
          </button>
          
          <button
            onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.15rem',
              fontWeight: 800,
              color: mode === 'signup' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              cursor: 'pointer',
              borderBottom: mode === 'signup' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              paddingBottom: '0.35rem',
              transition: 'all 0.2s ease'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid #f43f5e', color: '#f87171', borderRadius: '10px', padding: '0.65rem 0.85rem', fontSize: '0.8rem', marginBottom: '1rem' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', borderRadius: '10px', padding: '0.65rem 0.85rem', fontSize: '0.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Sign Up Specific Fields */}
          {mode === 'signup' && (
            <>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                  Full Name
                </label>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid var(--border-color)', padding: '0.2rem 0.6rem' }}>
                  <User size={16} color="var(--text-muted)" />
                  <input
                    type="text"
                    placeholder="e.g. Anup S"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', padding: '0.5rem 0.6rem', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                  Register Number / Student ID
                </label>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid var(--border-color)', padding: '0.2rem 0.6rem' }}>
                  <ShieldCheck size={16} color="var(--text-muted)" />
                  <input
                    type="text"
                    placeholder="e.g. 212222040015"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    required
                    style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', padding: '0.5rem 0.6rem', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                  Account Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ width: '100%', background: 'rgba(15,22,38,0.9)', color: '#fff', border: '1px solid var(--border-color)', padding: '0.55rem 0.75rem', borderRadius: '10px', fontSize: '0.85rem', outline: 'none' }}
                >
                  <option value="Student Evaluator">Student Evaluator</option>
                  <option value="Systems Engineer">Systems Engineer</option>
                  <option value="Researcher">Environmental Researcher</option>
                  <option value="Guest User">Guest Visitor</option>
                </select>
              </div>
            </>
          )}

          {/* Email / ID Input */}
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
              {mode === 'signup' ? 'Email Address' : 'Email or Register Number'}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid var(--border-color)', padding: '0.2rem 0.6rem' }}>
              <Mail size={16} color="var(--text-muted)" />
              <input
                type="text"
                placeholder={mode === 'signup' ? 'student@aeropulse.io' : 'e.g. 212222040015 or email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', padding: '0.5rem 0.6rem', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
              Password
            </label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid var(--border-color)', padding: '0.2rem 0.6rem' }}>
              <Lock size={16} color="var(--text-muted)" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', padding: '0.5rem 0.6rem', fontSize: '0.85rem', outline: 'none' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.75rem' }}>
            {mode === 'signup' ? 'Create Free Account' : 'Sign In'} <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer Mode Switch */}
        <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {mode === 'signup' ? (
            <span>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setMode('login'); }} style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 700 }}>Sign In</a></span>
          ) : (
            <span>Don't have an account yet? <a href="#" onClick={(e) => { e.preventDefault(); setMode('signup'); }} style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 700 }}>Sign Up</a></span>
          )}
        </div>

      </div>
    </div>
  );
}
