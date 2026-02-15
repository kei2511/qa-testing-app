'use client';

import { useState } from 'react';

export default function LoginForm({ onLogin, onSwitchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Login failed');
                return;
            }

            onLogin(data.user, data.token);
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-card">
            <div className="auth-header">
                <h1>Welcome Back</h1>
                <p>Sign in to manage your inventory</p>
            </div>

            {error && (
                <div className="alert alert-error" id="login-error">
                    <span>⚠</span> {error}
                </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit} id="login-form">
                <div className="form-group">
                    <label className="form-label" htmlFor="login-email">Email</label>
                    <input
                        id="login-email"
                        className="form-input"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="login-password">Password</label>
                    <input
                        id="login-password"
                        className="form-input"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                    id="login-submit"
                    style={{ width: '100%', marginTop: '0.5rem' }}
                >
                    {loading ? (
                        <span className="loading-spinner"><span className="spinner"></span></span>
                    ) : (
                        'Sign In'
                    )}
                </button>
            </form>

            <div className="auth-footer">
                Don&apos;t have an account?{' '}
                <span className="auth-link" onClick={onSwitchToRegister} id="switch-to-register">
                    Create one
                </span>
            </div>

            <div className="auth-divider">Demo Credentials</div>
            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <code style={{ background: 'var(--bg-input)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    admin@example.com / password123
                </code>
            </div>
        </div>
    );
}
