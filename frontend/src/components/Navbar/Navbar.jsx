import { useEffect, useState } from "react";
import {
  Settings,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Home,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./navbar.css";
import { useAuthStore } from "../../stores/useAuthStore";

export default function Navbar() {
  const { logout, authUser } = useAuthStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    logout();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".dropdown-menu") &&
        !e.target.closest(".profile-button")
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar" onClick={() => setIsProfileDropdownOpen(false)}>
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo */}
          <Link
            to={"/"}
            onClick={() => setIsProfileDropdownOpen(false)}
            className="logo-link"
          >
            <div className="logo-container">
              <div className="logo-icon-wrapper">
                <div className="logo-icon">
                  <img src="/logo.jpg" alt="Logo" />
                </div>
                <div className="logo-blur" />
              </div>
              <div className="logo-text">
                <h1 className="logo-title">To-Do Board</h1>
                <p className="logo-subtitle">
                  A Real-Time Collaborative To-Do Board
                </p>
              </div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div>
            <div className="desktop-menu" onClick={(e) => e.stopPropagation()}>
              {authUser && (
                <div className="profile-dropdown">
                  <button
                    onClick={toggleProfileDropdown}
                    className="profile-button"
                  >
                    {authUser?.profilePic ? (
                      <img
                        src={authUser.profilePic}
                        alt="Profile"
                        className="profile-avatar"
                      />
                    ) : (
                      <div className="profile-avatar-default">
                        <User />
                      </div>
                    )}
                    <span className="profile-name">{authUser.fullName}</span>
                    <ChevronDown
                      className={`chevron-icon ${
                        isProfileDropdownOpen ? "rotated" : ""
                      }`}
                    />
                  </button>

                  {isProfileDropdownOpen && (
                    <div
                      className="dropdown-menu"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="dropdown-content">
                        <div className="dropdown-header">
                          <p className="user-name">{authUser.fullName}</p>
                          <p className="user-email">{authUser.email}</p>
                        </div>
                        <Link
                          to={"/"}
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="dropdown-item"
                        >
                          <Home />
                          <span>Home</span>
                        </Link>
                        <Link
                          to={"/activitylog"}
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="dropdown-item"
                        >
                          <Settings />
                          <span>Action Log</span>
                        </Link>
                        <Link
                          to={"/profile"}
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="dropdown-item"
                        >
                          <User />
                          <span>View Profile</span>
                        </Link>
                        <hr className="dropdown-divider" />
                        <button
                          onClick={handleLogout}
                          className="dropdown-item logout"
                        >
                          <LogOut />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div>
              <button onClick={toggleMobileMenu} className="mobile-menu-button">
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-content">
              {/* Profile Section */}
              <div className="mobile-profile-section">
                {authUser?.profilePic ? (
                  <img
                    src={authUser.profilePic}
                    alt="Profile"
                    className="profile-avatar"
                  />
                ) : (
                  <div className="mobile-profile-avatar">
                    <User />
                  </div>
                )}
                <div className="mobile-profile-info">
                  <p className="user-name">{authUser.fullName}</p>
                  <p className="user-email">{authUser.email}</p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="mobile-menu-items">
                <Link
                  to={"/"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mobile-menu-item"
                >
                  <Home />
                  <span>Home</span>
                </Link>
                <Link
                  to={"/activitylog"}
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="mobile-menu-item"
                >
                  <Settings />
                  <span>Action Log</span>
                </Link>
                <Link
                  to={"/profile"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mobile-menu-item"
                >
                  <User />
                  <span>View Profile</span>
                </Link>
                <button onClick={handleLogout} className="dropdown-item logout">
                  <LogOut />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
