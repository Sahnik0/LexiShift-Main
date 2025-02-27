"use client"
import './styles.css';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type React from "react"
import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence, useTransform, useScroll, useMotionValue, useSpring, useInView } from "framer-motion"
import {
  Brain,
  Users,
  FileText,
  GraduationCap,
  Github,
  Twitter,
  Linkedin,
  Mail,
  ChevronDown,
  BookOpen,
  Sparkles,
  MessageSquareMore,
  Menu,
  X,
  Home,
  Compass,
  Book,
  MessageCircle,
  Info,
  Sun,
  Moon,
  ArrowRight,
  Star
} from "lucide-react"

// Add these type declarations at the top of the file
declare global {
  interface Window {
    scrollTimeout: number;
  }
}

// Add type for FeatureCard props
interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  buttonText: string;
  link: string;
  index: number;
  theme: string;
}

// Add type for FloatingSparkle props
interface FloatingSparkleProps {
  delay?: number;
  size?: number;
  theme?: string;
}

// Improved Navbar with glass morphism effect
const Navbar = ({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", href: "#", icon: Home },
    { name: "Find Specialists", href: "#", icon: Compass },
    { name: "Community", href: "#", icon: Users },
    { name: "Text Converter", href: "#", icon: FileText },
    { name: "Learning Resources", href: "#", icon: Book },
    { name: "Digital Library", href: "#", icon: BookOpen },
    { name: "AI Chat Support", href: "#", icon: MessageCircle },
    { name: "About Us", href: "#about", icon: Info },
  ]

  return (
    <>
      {/* Main Navbar with enhanced glass morphism */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed w-full z-50 ${
          scrolled 
            ? `${theme === "dark" ? "bg-black/90" : "bg-white/90"} shadow-lg` 
            : `${theme === "dark" ? "bg-black/60" : "bg-white/60"}`
        } backdrop-blur-xl border-b ${theme === "dark" ? "border-gray-800/50" : "border-gray-200/50"} transition-all duration-300`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <motion.a
              href="#"
              className={`text-2xl font-bold hero-text-gradient ${
                theme === "light" ? "text-stroke-light" : ""
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center">
                <motion.span
                  animate={{ 
                    rotateY: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotateY: { duration: 5, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="inline-block mr-2"
                >
                  <Brain className="w-8 h-8 inline-block transform -translate-y-0.5" strokeWidth={1.5} />
                </motion.span>
                LEXISHIFT
              </span>
            </motion.a>

            {/* Desktop Navigation Links - New Addition */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.slice(0, 4).map((link) => {
                const Icon = link.icon
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      theme === "dark" ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-black hover:bg-black/10"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center">
                      <Icon className="w-4 h-4 mr-1" />
                      {link.name}
                    </span>
                  </motion.a>
                )
              })}
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1, rotate: theme === "dark" ? 180 : 0 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${theme === "dark" ? "bg-white/10 hover:bg-white/20" : "bg-black/10 hover:bg-black/20"}`}
              >
                {theme === "dark" ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-black" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full transition-colors ${theme === "dark" ? "bg-white/10 hover:bg-white/20" : "bg-black/10 hover:bg-black/20"}`}
              >
                <Menu className={`w-5 h-5 ${theme === "dark" ? "text-white" : "text-black"}`} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Overlay with improved animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />
        )}
      </AnimatePresence>

      {/* Enhanced Side Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className={`fixed right-0 top-0 h-full w-80 shadow-2xl z-50 ${
              theme === "dark" 
                ? "bg-gray-900/95 backdrop-blur-xl" 
                : "bg-white/95 backdrop-blur-xl border-l border-gray-200"
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className={`text-xl font-bold hero-text-gradient ${
                  theme === "light" ? "text-stroke-light" : ""
                }`}>Navigation</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className={`p-2 rounded-full transition-colors ${
                    theme === "dark"
                      ? "bg-white/10 hover:bg-white/20"
                      : "bg-black/10 hover:bg-black/20"
                  }`}
                >
                  <X className={`w-5 h-5 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`} />
                </motion.button>
              </div>

              <div className="space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-200 group ${
                        theme === "dark"
                          ? "text-gray-300 hover:text-white hover:bg-white/10"
                          : "text-gray-600 hover:text-black hover:bg-black/10"
                      }`}
                      onClick={() => setIsOpen(false)}
                      whileHover={{ x: 4, backgroundColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className={`w-5 h-5 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      } group-hover:scale-110 transition-transform duration-200`} />
                      <span>{link.name}</span>
                      <motion.div 
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ x: -5 }}
                        animate={{ x: 0 }}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </motion.a>
                  )
                })}
              </div>

              <div className="absolute bottom-8 left-6 right-6">
                <div className={`border-t pt-6 ${
                  theme === "dark" ? "border-gray-800" : "border-gray-200"
                }`}>
                  <div className="flex justify-center space-x-6">
                    {[
                      { icon: Twitter, href: "https://x.com/sahnik_biswas?t=sp2WgWJVyv6iQL5hzG6hJQ&s=09" },
                      { icon: Github, href: "https://github.com/Sahnik0" },
                      { icon: Linkedin, href: "https://www.linkedin.com/in/sahnik-biswas-8514012a7" },
                      { icon: Mail, href: "#" }
                    ].map(({ icon: Icon, href }) => (
                      <motion.a
                        key={href}
                        href={href}
                        className={`${
                          theme === "dark"
                            ? "text-gray-400 hover:text-white"
                            : "text-gray-400 hover:text-black"
                        } transition-colors`}
                        whileHover={{ scale: 1.2, y: -3 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Icon className="w-6 h-6" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Enhanced Feature Card with 3D hover effect
const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  buttonText,
  link,
  theme,
}: FeatureCardProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0, 1, 1, 0])

  // Handle navigation in same tab
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    window.location.href = link
  }

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      initial={{ y: 50, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`feature-card group perspective p-8 md:p-10 flex flex-col items-center text-center rounded-xl backdrop-blur-sm shadow-lg relative overflow-hidden ${
        theme === "dark"
          ? "bg-white/5 hover:bg-white/10 border border-white/10"
          : "bg-black/5 hover:bg-black/10 border border-gray-200"
      } transition-all duration-300 cursor-pointer hover:shadow-2xl`}
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
        theme === "dark" 
          ? "bg-gradient-to-br from-purple-600/20 via-blue-500/10 to-pink-500/20" 
          : "bg-gradient-to-br from-purple-600/10 via-blue-500/5 to-pink-500/10"
      }`} />
      
      <motion.div 
        className="relative z-10"
        whileHover={{ rotate: 360, scale: 1.2 }} 
        transition={{ duration: 0.8 }}
      >
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
          theme === "dark" ? "bg-white/10" : "bg-black/5"
        } group-hover:scale-110 transition-transform duration-300`}>
          <Icon 
            className={`w-12 h-12 ${
              theme === "dark" ? "text-white" : "text-black"
            }`} 
            strokeWidth={1.5} 
          />
        </div>
      </motion.div>
      
      <h3 
        className={`text-2xl font-bold mb-4 ${
          theme === "light" ? "text-stroke-light" : ""
        } group-hover:scale-105 transition-transform duration-300 relative z-10`}
      >
        {title}
      </h3>
      
      <p 
        className={`${
          theme === "dark" ? "text-gray-300" : "text-gray-700"
        } mb-8 text-lg leading-relaxed relative z-10`}
      >
        {description}
      </p>
      
      <motion.a
        href={link}
        onClick={handleClick}
        className={`${
          theme === "dark"
            ? "bg-white text-black hover:bg-gray-200"
            : "bg-black text-white hover:bg-gray-800"
        } px-8 py-3 rounded-full text-lg font-semibold transition-all flex items-center space-x-2 relative z-10`}
        whileHover={{ scale: 1.05, x: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>{buttonText}</span>
        <motion.span
          initial={{ x: 0 }}
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <ArrowRight className="w-5 h-5" />
        </motion.span>
      </motion.a>
      
      {/* Corner decoration */}
      <motion.div 
        className={`absolute top-0 right-0 w-20 h-20 ${
          theme === "dark" ? "bg-gradient-to-bl from-purple-500/20 to-transparent" : "bg-gradient-to-bl from-purple-500/10 to-transparent"
        } -mr-10 -mt-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />
    </motion.div>
  )
}

// Update the FloatingSparkle component with proper typing
const FloatingSparkle: React.FC<FloatingSparkleProps> = ({ delay = 0, size = 16, theme = "dark" }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay }}
    className="absolute"
  >
    <Sparkles className={`${theme === "dark" ? "text-white" : "text-black"} opacity-50`} size={size} />
  </motion.div>
)

// Enhanced sliding stories component
const SlidingStories = ({ theme }: { theme: string }) => {
  const stories = [
    {
      title: "Albert Einstein",
      description: "Despite struggling with dyslexia, Einstein revolutionized physics with his theory of relativity. His unique way of thinking, often attributed to his dyslexia, led to groundbreaking scientific discoveries.",
      icon: Star
    },
    {
      title: "Richard Branson",
      description: "The founder of Virgin Group credits his dyslexia for his business success. His different perspective and problem-solving abilities helped him build a global business empire.",
      icon: Star
    },
    {
      title: "Steven Spielberg",
      description: "Diagnosed with dyslexia at age 60, Spielberg's creative storytelling and visual thinking helped him become one of the most influential filmmakers in cinema history.",
      icon: Star
    },
    {
      title: "Tom Cruise",
      description: "Diagnosed with dyslexia at age 7, Cruise overcame reading challenges to become one of Hollywood's most successful actors, proving that dyslexia doesn't limit potential.",
      icon: Star
    },
    {
      title: "Walt Disney",
      description: "Despite his dyslexia, Disney built an entertainment empire and revolutionized animation, showing that creativity knows no bounds.",
      icon: Star
    },
    {
      title: "John Lennon",
      description: "The legendary Beatles musician had dyslexia but turned his unique perspective into groundbreaking musical innovations and artistic expressions.",
      icon: Star
    }
  ]

  // Duplicate the stories array for seamless loop
  const duplicatedStories = [...stories, ...stories]

  return (
    <div className="relative overflow-hidden py-10">
      {/* Add gradient masks for smooth fade effect */}
      <div className={`absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none
        ${theme === "dark" 
          ? "bg-gradient-to-r from-black to-transparent" 
          : "bg-gradient-to-r from-white to-transparent"}`} 
      />
      <div className={`absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none
        ${theme === "dark" 
          ? "bg-gradient-to-l from-black to-transparent" 
          : "bg-gradient-to-l from-white to-transparent"}`} 
      />

      <motion.div
        animate={{
          x: [0, -50 * stories.length],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
        className="flex gap-8"
      >
        {duplicatedStories.map((story, index) => {
          const Icon = story.icon;
          return (
            <motion.div
              key={index}
              className={`flex-shrink-0 w-[400px] p-8 rounded-xl backdrop-blur-sm shadow-lg relative overflow-hidden
                ${theme === "dark"
                  ? "bg-white/5 border border-white/10"
                  : "bg-black/5 border border-gray-200"
                } transition-all duration-300`}
              whileHover={{ 
                scale: 1.05,
                backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.2 }
              }}
            >
              {/* Animated background gradient */}
              <motion.div 
                className={`absolute top-0 left-0 right-0 h-1 ${
                  theme === "dark" ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                }`}
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
              
              <div className="flex items-start mb-4">
                <div className={`p-2 rounded-full ${
                  theme === "dark" ? "bg-white/10" : "bg-black/5"
                } mr-4`}>
                  <Icon className={`w-6 h-6 ${
                    theme === "dark" ? "text-purple-400" : "text-purple-600"
                  }`} />
                </div>
                <motion.h3 
                  className={`text-2xl font-bold ${theme === "light" ? "text-stroke-light" : ""}`}
                  whileHover={{ scale: 1.02 }}
                >
                  {story.title}
                </motion.h3>
              </div>
              
              <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"} leading-relaxed`}>
                {story.description}
              </p>
              
              {/* Decorative element */}
              <div className={`absolute bottom-3 right-3 opacity-10 ${theme === "dark" ? "text-white" : "text-black"}`}>
                <Sparkles size={24} />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  )
}

function App() {
  const featuresRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef)

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const springConfig = { damping: 25, stiffness: 700 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16)
      cursorY.set(e.clientY - 16)
    }

    window.addEventListener("mousemove", moveCursor)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
    }
  }, [cursorX, cursorY])

  const featuresScrollProgress = useScroll({
    target: featuresRef,
    offset: ["start end", "end start"],
  })

  const featuresScale = useTransform(featuresScrollProgress.scrollYProgress, [0, 1], [0.8, 1])
  const featuresOpacity = useTransform(featuresScrollProgress.scrollYProgress, [0, 0.2], [0, 1])

  const aboutScrollProgress = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"],
  })

  const aboutY = useTransform(aboutScrollProgress.scrollYProgress, [0, 1], [100, -100])
  const aboutOpacity = useTransform(aboutScrollProgress.scrollYProgress, [0, 0.3], [0, 1])

  const [theme, setTheme] = useState("dark")
  const [isScrolling, setIsScrolling] = useState(false)

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setTheme(savedTheme)
    }
    
    // Track scrolling for animations
    const handleScroll = () => {
      setIsScrolling(true)
      clearTimeout(window.scrollTimeout)
      window.scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
      }, 100) as unknown as number
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(window.scrollTimeout)
    }
  }, [])

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"} transition-colors duration-300`}
    >
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Enhanced custom cursor */}
      <motion.div
        className="custom-cursor"
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 9999,
          pointerEvents: "none",
        }}
      >
        <motion.div 
          className={`w-8 h-8 rounded-full ${theme === "dark" ? "bg-white" : "bg-black"} opacity-20 flex items-center justify-center`}
          animate={{ 
            scale: isScrolling ? 0.5 : 1,
            opacity: isScrolling ? 0.5 : 0.2
          }}
          transition={{ duration: 0.2 }}
        >
          {isScrolling && (
            <motion.div 
              className={`w-2 h-2 rounded-full ${theme === "dark" ? "bg-white" : "bg-black"}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Enhanced Hero Section */}
      <motion.div
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={isHeroInView ? { opacity: 1 } : { opacity: 0 }}
        className={`${theme === "dark" ? "gradient-bg" : "bg-white"} min-h-screen flex items-center relative overflow-hidden px-4 pt-16`}
      >
        {/* Enhanced sparkle effects */}
        <motion.div style={{ y, opacity }} className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-4 p-4">
          {Array.from({ length: 36 }).map((_, i) => (
            <FloatingSparkle 
              key={i} 
              delay={i * 0.1} 
              size={(i % 3 + 1) * 8}
              theme={theme}
            />
          ))}
        </motion.div>

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Enhanced Text Content */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-left space-y-8"
            >
              <div className="relative inline-block">
                <motion.div
                  animate={{ 
                    rotate: 360,
                    background: ["linear-gradient(to right, #8a2387, #e94057, #f27121)", "linear-gradient(to right, #f27121, #8a2387, #e94057)", "linear-gradient(to right, #e94057, #f27121, #8a2387)"]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                    background: { duration: 10, repeat: Number.POSITIVE_INFINITY }
                  }}
                  className="absolute inset-0 rounded-full blur-xl opacity-30"
                />
                <motion.h1 
                  className={`text-7xl xl:text-8xl font-bold hero-text-gradient tracking-tight relative z-10 ${
                    theme === "light" ? "text-stroke-heavy" : ""
                  }`}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                >
                  LEXISHIFT
                </motion.h1>
              </div>
              
              <motion.p
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className={`text-xl xl:text-2xl ${theme === "dark" ? "text-gray-300" : "text-gray-700"} leading-relaxed max-w-xl`}
              >
                Empowering dyslexic individuals with innovative tools and support for a brighter future
              </motion.p>
              
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex space-x-4"
              >
                <motion.button
                  onClick={scrollToFeatures}
                  className={`${
                    theme === "dark" 
                      ? "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                      : "bg-black text-white hover:bg-gray-800"
                  } px-12 py-4 rounded-full text-xl font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Side - Lottie Animation */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="flex justify-center items-center"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="relative w-[500px] h-[500px]"
              >
                <div className="absolute inset-0 w-full h-full blur-3xl bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full" />
                
                <DotLottieReact
                  src="https://lottie.host/05c826c4-9798-4c3c-9246-8e4ad3701edc/u28uCnJp6f.lottie"
                  loop
                  autoplay
                  className="relative z-10 w-full h-full"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 scroll-indicator cursor-pointer"
          onClick={scrollToFeatures}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <ChevronDown className={`w-10 h-10 ${theme === "dark" ? "text-white" : "text-black"} opacity-50`} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        ref={featuresRef}
        style={{ scale: featuresScale, opacity: featuresOpacity }}
        className={`py-24 md:py-32 px-4 ${theme === "dark" ? "bg-black" : "bg-white"}`}
      >
        <div className="container mx-auto max-w-7xl">
          <motion.h2
            className={`text-4xl md:text-6xl font-bold text-center mb-20 hero-text-gradient ${
              theme === "light" ? "text-stroke-heavy" : ""
            }`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Our Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Brain,
                title: "Consult a Doctor",
                description: "Connect with specialized healthcare professionals for personalized guidance and support.",
                buttonText: "Find Specialists",
                link: "#",
              },
              {
                icon: Users,
                title: "Community Support",
                description: "Join our vibrant community of individuals sharing experiences and support.",
                buttonText: "Join Community",
                link: "#",
              },
              {
                icon: FileText,
                title: "Dyslexia-Friendly Converter",
                description: "Transform any text into an easy-to-read format optimized for dyslexic readers.",
                buttonText: "Try Converter",
                link: "#",
              },
              {
                icon: GraduationCap,
                title: "Learning Platform",
                description: "Access specialized educational resources tailored to your learning style.",
                buttonText: "Start Learning",
                link: "#",
              },
              {
                icon: BookOpen,
                title: "Digital Library",
                description: "Access our extensive collection of dyslexia-friendly books and reading materials.",
                buttonText: "Browse Library",
                link: "#",
              },
              {
                icon: MessageSquareMore,
                title: "AI Therapist",
                description:
                  "Get instant help and guidance from our AI-powered Therapist, available 24/7 to assist with any questions.",
                buttonText: "Start Chat",
                link: "#",
              },
            ].map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} theme={theme} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Success Stories Section */}
      <motion.div
        id="about"
        ref={aboutRef}
        style={{ y: aboutY, opacity: aboutOpacity }}
        className={`py-24 md:py-32 px-4 ${
          theme === "dark" ? "bg-gradient-to-b from-black to-gray-900" : "bg-gradient-to-b from-white to-gray-100"
        }`}
      >
        <div className="container mx-auto max-w-7xl">
          <motion.div className="text-center mb-16">
            <h2 className={`text-4xl md:text-6xl font-bold mb-8 hero-text-gradient ${
              theme === "light" ? "text-stroke-heavy" : ""
            }`}>Success Stories</h2>
            <p className={`text-xl ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            } max-w-3xl mx-auto leading-relaxed`}>
              Discover inspiring stories of individuals who have overcome dyslexia and achieved remarkable success in their fields.
            </p>
          </motion.div>

          <SlidingStories theme={theme} />
        </div>
      </motion.div>

      {/* Footer */}
      <footer
        className={`${theme === "dark" ? "bg-black border-gray-800" : "bg-white border-gray-200"} border-t py-16 px-4`}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            <div>
              <h3 className={`text-2xl font-bold mb-6 hero-text-gradient ${
                theme === "light" ? "text-stroke-light" : ""
              }`}>
                LEXISHIFT
              </h3>
              <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} text-lg`}>
                Empowering dyslexic individuals worldwide
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="https://lexicare.vercel.app/"
                    className={`text-gray-400 hover:text-white transition-colors text-lg ${theme === "dark" ? "hover:text-white" : "hover:text-black"} light-theme:text-gray-600 light-theme:hover:text-black`}
                  >
                    Find Specialists
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/sahnik-biswas-8514012a7"
                    className={`text-gray-400 hover:text-white transition-colors text-lg ${theme === "dark" ? "hover:text-white" : "hover:text-black"} light-theme:text-gray-600 light-theme:hover:text-black`}
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/sahnik-biswas-8514012a7"
                    className={`text-gray-400 hover:text-white transition-colors text-lg ${theme === "dark" ? "hover:text-white" : "hover:text-black"} light-theme:text-gray-600 light-theme:hover:text-black`}
                  >
                    Text Converter
                  </a>
                </li>
                <li>
                  <a
                    href="https://lexilearn-neon.vercel.app/"
                    className={`text-gray-400 hover:text-white transition-colors text-lg ${theme === "dark" ? "hover:text-white" : "hover:text-black"} light-theme:text-gray-600 light-theme:hover:text-black`}
                  >
                    Learning Resources
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/sahnik-biswas-8514012a7"
                    className={`text-gray-400 hover:text-white transition-colors text-lg ${theme === "dark" ? "hover:text-white" : "hover:text-black"} light-theme:text-gray-600 light-theme:hover:text-black`}
                  >
                    Digital Library
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/sahnik-biswas-8514012a7"
                    className={`text-gray-400 hover:text-white transition-colors text-lg ${theme === "dark" ? "hover:text-white" : "hover:text-black"} light-theme:text-gray-600 light-theme:hover:text-black`}
                  >
                    AI Chat Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Contact</h4>
              <ul className="space-y-4">
                <li className="text-gray-400 text-lg light-theme:text-gray-600">Email: forloopdeloop@gmail.com</li>
                <li className="text-gray-400 text-lg light-theme:text-gray-600">Phone: +91 7407902174</li>
                <li className="text-gray-400 text-lg light-theme:text-gray-600">Address: Barasat</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Follow Us</h4>
              <div className="flex space-x-6">
                <motion.a
                  href="https://x.com/sahnik_biswas?t=sp2WgWJVyv6iQL5hzG6hJQ&s=09"
                  className="text-gray-400 hover:text-white transition-colors light-theme:hover:text-black"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Twitter className="w-8 h-8" strokeWidth={1.5} />
                </motion.a>
                <motion.a
                  href="https://www.linkedin.com/in/sahnik-biswas-8514012a7"
                  className="text-gray-400 hover:text-white transition-colors light-theme:hover:text-black"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Linkedin className="w-8 h-8" strokeWidth={1.5} />
                </motion.a>
                <motion.a
                  href="https://github.com/sanks011"
                  className="text-gray-400 hover:text-white transition-colors light-theme:hover:text-black"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Github className="w-8 h-8" strokeWidth={1.5} />
                </motion.a>
                <motion.a
                  href="forloopdeloop@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors light-theme:hover:text-black"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Mail className="w-8 h-8" strokeWidth={1.5} />
                </motion.a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-16 pt-8 text-center text-gray-400 light-theme:border-gray-200 light-theme:text-gray-600">
            <p className="text-lg mb-2">&copy; {new Date().getFullYear()} LEXISHIFT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;