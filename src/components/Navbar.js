'use client';

export default function Navbar({ user, onLogout }) {
    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <nav className="navbar" id="navbar">
            <div className="navbar-inner">
                <div className="navbar-brand">
                    <div className="navbar-logo">📦</div>
                    <span>Inventory<span style={{ color: 'var(--accent-secondary)' }}>Pro</span></span>
                </div>

                <div className="navbar-actions">
                    {user && (
                        <>
                            <div className="navbar-user">
                                <div className="navbar-avatar" id="user-avatar">
                                    {getInitials(user.name)}
                                </div>
                                <span id="user-name">{user.name}</span>
                                <span style={{
                                    fontSize: '0.7rem',
                                    padding: '0.15rem 0.4rem',
                                    background: user.role === 'admin' ? 'rgba(108, 92, 231, 0.15)' : 'rgba(0, 206, 201, 0.15)',
                                    color: user.role === 'admin' ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                                    borderRadius: 'var(--radius-full)',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    {user.role}
                                </span>
                            </div>
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={onLogout}
                                id="logout-btn"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
