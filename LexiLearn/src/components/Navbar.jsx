import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, User, LogOut, GraduationCap, Menu, X, Brain, BookMarked, ScreenShare, HeartHandshake } from 'lucide-react';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (location.pathname === '/support') {
    return null;
  }
  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-50 p-2 rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-105"
        aria-label="Toggle menu"
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <span className={`block h-0.5 w-6 bg-white transform transition-all duration-300 ease-in-out 
            ${isOpen ? 'rotate-45 translate-y-2.5' : 'hover:w-4'}`} />
          <span className={`block h-0.5 bg-white transition-all duration-300 ease-in-out origin-left
            ${isOpen ? 'opacity-0 w-0' : 'w-6'}`} />
          <span className={`block h-0.5 bg-white transform transition-all duration-300 ease-in-out 
            ${isOpen ? '-rotate-45 -translate-y-2.5 w-6' : 'w-5 hover:w-6'}`} />
        </div>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav className={`fixed top-0 left-0 h-full w-72 bg-gray-900 z-40 transform transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <Link to="/" className="flex items-center mt-16 p-6 space-x-3" onClick={() => setIsOpen(false)}>
            <Brain className="h-6 w-6 text-blue-400 transition-transform duration-300 hover:scale-110" />
            <span className="text-lg font-bold text-white hover:text-blue-400 transition-colors duration-300">
              LexiLearn
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex-1 py-8 space-y-2">
            <NavLink to="/" onClick={() => setIsOpen(false)}>
              <GraduationCap className="h-5 w-5 mr-3" />
              Home
            </NavLink>
            <NavLink to="/learning" onClick={() => setIsOpen(false)}>
              <BookMarked className="h-5 w-5 mr-3" />
              Learning
            </NavLink>
            <NavLink to="/resources" onClick={() => setIsOpen(false)}>
              <BookOpen className="h-5 w-5 mr-3" />
              Resources
            </NavLink>
            <NavLink to="/screening" onClick={() => setIsOpen(false)}>
              <ScreenShare className="h-5 w-5 mr-3" />
              Screening
            </NavLink>
          </div>

          {/* User Section */}
          <div className="p-6 border-t border-white/10">
            {currentUser ? (
              <div className="space-y-4">
                <div className="flex items-center text-sm text-white/80 p-2 rounded-lg bg-white/5">
                  <User className="h-4 w-4 mr-2" />
                  <span className="truncate">{currentUser.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-red-400 rounded-lg hover:bg-white/5 transition-all duration-300 hover:translate-x-1"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="block w-full px-4 py-2 text-center rounded-lg bg-blue-600 text-white font-medium transition-all duration-300 hover:bg-blue-700 hover:scale-[0.98] active:scale-[0.97]"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

function NavLink({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center px-6 py-3 text-white/90 hover:bg-white/5 hover:text-white transition-all duration-300 hover:translate-x-2 group"
    >
      <div className="flex items-center">
        <span className="transform transition-transform duration-300 group-hover:scale-110">
          {children}
        </span>
      </div>
    </Link>
  );
}

export default Navbar;