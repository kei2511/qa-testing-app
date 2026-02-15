'use client';

import { useState } from 'react';

export default function RegisterForm({ onRegister, onSwitchToLogin }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Registration failed');
                return;
            }

            onRegister(data.user, data.token);
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-card">
            <div className="auth-header">
                <h1>Create Account</h1>
                <p>Start managing your product inventory</p>
            </div>

            {error && (
                <div className="alert alert-error" id="register-error">
                    <span>⚠</span> {error}
                </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit} id="register-form">
                <div className="form-group">
                    <label className="form-label" htmlFor="register-name">Full Name</label>
                    <input
                        id="register-name"
                        className="form-input"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoComplete="name"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="register-email">Email</label>
                    <input
                        id="register-email"
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
                    <label className="form-label" htmlFor="register-password">Password</label>
                    <input
                        id="register-password"
                        className="form-input"
                        type="password"
                        placeholder="Minimum 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        autoComplete="new-password"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="register-confirm-password">Confirm Password</label>
                    <input
                        id="register-confirm-password"
                        className="form-input"
                        type="password"
                        placeholder="Repeat your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        autoComplete="new-password"
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                    id="register-submit"
                    style={{ width: '100%', marginTop: '0.5rem' }}
                >
                    {loading ? (
                        <span className="loading-spinner"><span className="spinner"></span></span>
                    ) : (
                        'Create Account'
                    )}
                </button>
            </form>

            <div className="auth-footer">
                Already have an account?{' '}
                <span className="auth-link" onClick={onSwitchToLogin} id="switch-to-login">
                    Sign in
                </span>
            </div>
        </div>
    );
}
