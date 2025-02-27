// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { Brain, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  // Track scroll position for navbar transparency effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Navigation Bar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed w-full py-4 px-6 z-50 transition-all duration-500 ${
          scrollPosition > 50 
            ? 'bg-gray-900/90 backdrop-blur-md shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="group flex items-center space-x-2"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <motion.div
              animate={{ 
                rotate: isHovering ? [0, 15, -15, 0] : 0,
                scale: isHovering ? [1, 1.1, 1] : 1
              }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <Brain className="h-9 w-9 text-teal-400 filter drop-shadow-glow" />
              <motion.div 
                className="absolute inset-0 bg-teal-400 rounded-full blur-xl opacity-30"
                animate={{ scale: isHovering ? [1, 1.5, 1] : 1 }}
                transition={{ duration: 0.6 }}
              />
            </motion.div>
            
            <motion.span 
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-300"
              animate={{ 
                backgroundPosition: isHovering ? ["0% 50%", "100% 50%"] : "0% 50%" 
              }}
              transition={{ duration: isHovering ? 1.5 : 0, repeat: isHovering ? Infinity : 0, repeatType: "reverse" }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Dyslu
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              <a href="#features" className="text-gray-300 hover:text-teal-400 relative px-1 py-2 group">
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-400 to-emerald-300 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-teal-400 relative px-1 py-2 group">
                Pricing
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-400 to-emerald-300 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>

            {!auth.currentUser ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/signin"
                  className="text-gray-300 hover:text-teal-400 transition-colors duration-300 relative overflow-hidden group px-4 py-2"
                >
                  <span className="relative z-10">Sign In</span>
                  <span className="absolute inset-0 bg-gray-800 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                </Link>
                <Link
                  to="/signup"
                  className="relative inline-block group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-6 py-2 rounded-lg inline-block transform group-hover:translate-y-[-2px] group-hover:shadow-lg transition-all duration-300">
                    Sign Up
                  </span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-teal-400 transition-colors duration-300 relative overflow-hidden group px-4 py-2"
                >
                  <span className="relative z-10">Dashboard</span>
                  <span className="absolute inset-0 bg-gray-800 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="relative inline-block group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg blur-sm opacity-0 group-hover:opacity-70 transition-opacity duration-300"></span>
                  <span className="relative border border-red-500 text-white px-6 py-2 rounded-lg inline-block transform group-hover:translate-y-[-2px] group-hover:shadow-lg group-hover:bg-red-600 transition-all duration-300">
                    Sign Out
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleMenu}
            className="md:hidden text-gray-300 focus:outline-none p-2"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-teal-400" />
            ) : (
              <Menu className="h-6 w-6 text-teal-400" />
            )}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 right-0 bg-gray-900/95 backdrop-blur-md z-40 md:hidden border-t border-gray-800 shadow-2xl"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-col px-6 py-6 space-y-6"
            >
              <a
                href="#features"
                className="flex items-center text-gray-300 hover:text-teal-400 transition-colors group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="w-1 h-8 bg-gradient-to-b from-teal-400 to-emerald-400 rounded-full mr-3 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></span>
                Features
              </a>
              <a
                href="#pricing"
                className="flex items-center text-gray-300 hover:text-teal-400 transition-colors group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="w-1 h-8 bg-gradient-to-b from-teal-400 to-emerald-400 rounded-full mr-3 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></span>
                Pricing
              </a>
              
              {!auth.currentUser ? (
                <div className="space-y-4 pt-2">
                  <Link
                    to="/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center text-gray-300 border border-gray-700 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-teal-400 transition-all duration-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 py-3 rounded-lg hover:shadow-glow-teal transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center text-gray-300 border border-gray-700 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-teal-400 transition-all duration-300"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-center border border-red-500 text-gray-300 px-4 py-3 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
};

export default Navbar;