import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Avatar from '../common/Avatar';
import { NAV_LINKS, SITE_NAME } from '../../constants';
import { cn } from '../../utils';

export default function Navbar() {
  const { user, profile, signOut, isMentor } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className={cn('navbar', scrolled && 'navbar--scrolled')}>
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-primary">상담</span>
          <span className="navbar__logo-secondary">공간</span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar__links">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => cn('navbar__link', isActive && 'navbar__link--active')}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right actions */}
        <div className="navbar__actions">
          <button className="navbar__theme-btn" onClick={toggleTheme}>
            {theme === 'light' ? '\uD83C\uDF19' : '\u2600\uFE0F'}
          </button>

          {user ? (
            <div style={{ position: 'relative' }}>
              <button className="navbar__user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <Avatar src={profile?.avatar_url} name={profile?.full_name} size="sm" />
                <span className="navbar__user-name">{profile?.full_name}</span>
              </button>
              {dropdownOpen && (
                <>
                  <div className="navbar__dropdown-overlay" onClick={() => setDropdownOpen(false)} />
                  <div className="navbar__dropdown">
                    <Link to="/profile" className="navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
                      👤 프로필
                    </Link>
                    <Link
                      to={isMentor ? '/mentor-dashboard' : '/dashboard'}
                      className="navbar__dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      📊 대시보드
                    </Link>
                    <div className="navbar__dropdown-divider" />
                    <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={handleSignOut}>
                      🚪 로그아웃
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="navbar__auth">
              <Link to="/login" className="navbar__auth-btn navbar__auth-btn--login">로그인</Link>
              <Link to="/register" className="navbar__auth-btn navbar__auth-btn--register">회원가입</Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            className={cn('navbar__hamburger', mobileOpen && 'navbar__hamburger--open')}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="navbar__hamburger-line" />
            <span className="navbar__hamburger-line" />
            <span className="navbar__hamburger-line" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn('navbar__mobile-menu', mobileOpen && 'navbar__mobile-menu--open')}>
        <div className="container navbar__mobile-links">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => cn('navbar__mobile-link', isActive && 'navbar__mobile-link--active')}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          {!user && (
            <div className="navbar__mobile-auth">
              <Link to="/login" className="navbar__auth-btn navbar__auth-btn--login" onClick={() => setMobileOpen(false)}>
                로그인
              </Link>
              <Link to="/register" className="navbar__auth-btn navbar__auth-btn--register" onClick={() => setMobileOpen(false)}>
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
