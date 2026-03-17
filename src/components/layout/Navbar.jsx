import { useState, useEffect, useRef } from 'react';
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
  const [navDropdown, setNavDropdown] = useState(null);
  const navDropdownRef = useRef(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (navDropdownRef.current && !navDropdownRef.current.contains(e.target)) {
        setNavDropdown(null);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setDropdownOpen(false);
    navigate('/');
  };

  const renderDesktopLink = (link, idx) => {
    if (link.type === 'divider') {
      return <span key={`div-${idx}`} className="navbar__divider" />;
    }

    if (link.children) {
      return (
        <div key={link.label} className="navbar__dropdown-wrap" ref={navDropdownRef}>
          <button
            className={cn('navbar__link navbar__link--has-children', navDropdown === link.label && 'navbar__link--active')}
            onClick={() => setNavDropdown(navDropdown === link.label ? null : link.label)}
          >
            {link.label} <i className="fa-solid fa-chevron-down navbar__link-arrow" />
          </button>
          {navDropdown === link.label && (
            <div className="navbar__nav-dropdown">
              {link.children.map(child => (
                <NavLink
                  key={child.path}
                  to={child.path}
                  className="navbar__nav-dropdown-item"
                  onClick={() => setNavDropdown(null)}
                >
                  <i className={child.icon} />
                  <span>{child.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={link.path}
        to={link.path}
        className={({ isActive }) => cn('navbar__link', isActive && 'navbar__link--active')}
      >
        {link.label}
      </NavLink>
    );
  };

  const renderMobileLink = (link, idx) => {
    if (link.type === 'divider') {
      return <div key={`div-${idx}`} className="navbar__mobile-divider" />;
    }

    if (link.children) {
      const isExpanded = mobileExpanded === link.label;
      return (
        <div key={link.label} className="navbar__mobile-group">
          <button
            className={cn('navbar__mobile-link navbar__mobile-link--parent', isExpanded && 'navbar__mobile-link--expanded')}
            onClick={() => setMobileExpanded(isExpanded ? null : link.label)}
          >
            {link.label}
            <i className={cn('fa-solid fa-chevron-down navbar__mobile-arrow', isExpanded && 'navbar__mobile-arrow--open')} />
          </button>
          {isExpanded && (
            <div className="navbar__mobile-children">
              {link.children.map(child => (
                <NavLink
                  key={child.path}
                  to={child.path}
                  className={({ isActive }) => cn('navbar__mobile-child', isActive && 'navbar__mobile-child--active')}
                  onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                >
                  <i className={child.icon} />
                  <span>{child.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={link.path}
        to={link.path}
        className={({ isActive }) => cn('navbar__mobile-link', isActive && 'navbar__mobile-link--active')}
        onClick={() => setMobileOpen(false)}
      >
        {link.label}
      </NavLink>
    );
  };

  return (
    <nav className={cn('navbar', scrolled && 'navbar--scrolled')}>
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-primary">Career</span>
          <span className="navbar__logo-secondary">Navigator</span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar__links">
          {NAV_LINKS.map((link, idx) => renderDesktopLink(link, idx))}
        </div>

        {/* Right actions */}
        <div className="navbar__actions">
          <button className="navbar__theme-btn" onClick={toggleTheme}>
            <i className={theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun'} />
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
                      <i className="fa-solid fa-user" /> 프로필
                    </Link>
                    <Link
                      to={isMentor ? '/mentor-dashboard' : '/dashboard'}
                      className="navbar__dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i className="fa-solid fa-chart-bar" /> 대시보드
                    </Link>
                    <div className="navbar__dropdown-divider" />
                    <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={handleSignOut}>
                      <i className="fa-solid fa-right-from-bracket" /> 로그아웃
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
          {NAV_LINKS.map((link, idx) => renderMobileLink(link, idx))}
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
