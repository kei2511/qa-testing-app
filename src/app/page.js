'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';

export default function HomePage() {
  const [mode, setMode] = useState('login');
  const router = useRouter();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleAuth = (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    router.push('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {mode === 'login' ? (
        <LoginForm
          onLogin={handleAuth}
          onSwitchToRegister={() => setMode('register')}
        />
      ) : (
        <RegisterForm
          onRegister={handleAuth}
          onSwitchToLogin={() => setMode('login')}
        />
      )}
    </div>
  );
}
