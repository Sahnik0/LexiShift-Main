"use client"

import { Link } from "react-router-dom"
import { BookOpen, Brain, Users, Lightbulb, ArrowRight, Mouse, ChevronDown, Sparkles, Star } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import "@dotlottie/player-component"
import { useAuth } from "../contexts/AuthContext"

function Home() {
  const { currentUser } = useAuth();
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <div id="home" ref={heroRef} className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-black to-black" />
          {/* Improved animated background elements with smoother parallax effect */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-400/10 blur-xl"
              style={{
                width: Math.random() * 100 + 50 + "px",
                height: Math.random() * 100 + 50 + "px",
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                transform: `translate(-50%, -50%) translateY(${scrollY * (Math.random() * 0.2)}px)`,
                transition: "transform 0.2s cubic-bezier(0.33, 1, 0.68, 1)",
                animation: `float ${Math.random() * 7 + 10}s infinite ease-in-out`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="relative">
                <h1 className="text-6xl md:text-7xl xl:text-8xl font-bold leading-tight">
                  <span
                    className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-300% animate-gradient"
                    style={{
                      transform: `translateX(${-scrollY * 0.1}px)`,
                      transition: "transform 0.3s ease-out",
                    }}
                  >
                    Empowering
                  </span>
                  <span
                    className="block mt-2"
                    style={{
                      transform: `translateX(${-scrollY * 0.05}px)`,
                      transition: "transform 0.3s ease-out",
                    }}
                  >
                    Learning
                    <Sparkles className="inline-block ml-4 h-8 w-8 text-blue-400 animate-pulse" />
                  </span>
                  <span
                    className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400"
                    style={{
                      transform: `translateX(${-scrollY * 0.02}px)`,
                      transition: "transform 0.3s ease-out",
                    }}
                  >
                    For All
                  </span>
                </h1>
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
              </div>

              <p className="text-xl md:text-2xl text-white/80 relative z-10">
                Empowering teachers, parents, and students with innovative resources and support
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/screening" className="group relative px-8 py-4 rounded-full overflow-hidden">
                  <span className="relative z-10 flex items-center text-white font-medium">
                    Start Screening
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-blue-500/30 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                </Link>
                <Link
                  to="/learn-more"
                  className="group px-8 py-4 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
                >
                  Learn more
                </Link>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div
                style={{
                  transform: `translateX(${scrollY * 0.1}px) rotate(${scrollY * 0.01}deg)`,
                  transition: "transform 0.3s ease-out",
                }}
                className="relative z-10"
              >
                <dotlottie-player
                  src="https://lottie.host/b00608f4-c994-4750-8dc0-f79455707de9/UOIefDW0qB.lottie"
                  background="transparent"
                  speed="1"
                  style={{ width: "100%", height: "100%" }}
                  loop
                  autoplay
                  className="drop-shadow-2xl"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent blur-3xl" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-white/60">
            <Mouse className="h-6 w-6" />
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Features Section - Improved hover effects */}
      <div id="features" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900/10 to-black" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our Features
             
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Comprehensive tools and resources for supporting dyslexic learners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<BookOpen className="h-8 w-8" />}
              title="Educational Resources"
              description="Access comprehensive guides and materials for effective learning"
              delay={0}
            />
            <FeatureCard
              icon={<Brain className="h-8 w-8" />}
              title="Screening Tools"
              description="Early identification and assessment resources"
              delay={200}
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Lexishift Community"
              description="Connect with others and share experiences"
              delay={400}
            />
            <FeatureCard
              icon={<Lightbulb className="h-8 w-8" />}
              title="Teaching Strategies"
              description="Proven methods for supporting dyslexic learners"
              delay={600}
            />
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div id="journey" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-black to-black" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our Journey
             
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              The evolution of supporting dyslexic learners through the years
            </p>
          </div>

          <div className="space-y-12">
            <TimelineItem
              year="2018"
              title="Platform Founded"
              description="Our journey began with a passion for inclusive education and supporting dyslexic learners."
            />
            <TimelineItem
              year="2019"
              title="First Major Release"
              description="Launched comprehensive screening tools and educational resources for teachers and parents."
            />
          </div>
        </div>
      </div>

{/* Call to Action - Updated to check for logged-in user */}
<div id="contact" className="py-32 relative overflow-hidden">
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-black to-black" />
    {/* Animated particles with smoother animation */}
    {[...Array(10)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-blue-400/20 blur-xl"
        style={{
          width: Math.random() * 200 + 100 + "px",
          height: Math.random() * 200 + 100 + "px",
          left: Math.random() * 100 + "%",
          top: Math.random() * 100 + "%",
          transform: "translate(-50%, -50%)",
          animation: `float ${Math.random() * 7 + 10}s infinite ease-in-out`,
        }}
      />
    ))}
  </div>

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
    <div className="text-center">
      <h2 className="text-6xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-300% animate-gradient">
        Get in Touch
      </h2>
      <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
        Join our community and help support dyslexic learners
      </p>
      <Link
        to={currentUser ? "/screening" : "/login"}
        className="group inline-flex items-center relative px-8 py-4 rounded-full overflow-hidden"
      >
        <span className="relative z-10 flex items-center text-white font-medium">
          Get Started
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-blue-500/30 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
      </Link>
    </div>
  </div>
</div>

      {/* Footer */}
      <footer className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Brain className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">
                  LexiLearn
                </span>
              </div>
              <p className="text-white/60">Empowering dyslexic learners through innovative education solutions.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-white/60 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/resources" className="text-white/60 hover:text-white transition-colors">
                    Resources
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-white/60 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/help" className="text-white/60 hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-white/60 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-white/60 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-center text-white/60">© {new Date().getFullYear()} LexiLearn. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Improved FeatureCard with subtle hover effect
function FeatureCard({ icon, title, description, delay }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className={`group p-6 rounded-2xl transition-all duration-500 transform cursor-pointer ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
      style={{
        transitionDelay: `${delay}ms`,
        transform: isHovered ? "scale(1.02)" : "scale(1)",
        transition: "transform 0.3s ease-out, opacity 0.5s ease-out",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Content with glass effect */}
      <div className="relative z-10 bg-black/60 rounded-xl p-6 backdrop-blur-lg border border-white/10 h-full transition-all duration-300 group-hover:border-blue-500/30 group-hover:shadow-lg group-hover:shadow-blue-600/10">
        <div className="text-blue-400 mb-4 transform transition-transform duration-300 group-hover:scale-110">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-white/60">{description}</p>
      </div>
    </div>
  )
}

function TimelineItem({ year, title, description }) {
  const [isVisible, setIsVisible] = useState(false)
  const itemRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (itemRef.current) {
      observer.observe(itemRef.current)
    }

    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={itemRef}
      className={`flex gap-8 items-start transform transition-all duration-700 ${
        isVisible ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
      }`}
    >
      <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-white">
        {year}
      </div>
      <div className="flex-1 p-6 rounded-2xl bg-black/60 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-colors">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-white/60">{description}</p>
      </div>
    </div>
  )
}

// Add keyframes for the gradient animation
const style = document.createElement("style")
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translate(-50%, -50%); }
    50% { transform: translate(-50%, calc(-50% - 20px)); }
  }
  
  @keyframes gradient {
    0% { background-position: 0% center; }
    100% { background-position: -200% center; }
  }
  
  .bg-300\% {
    background-size: 300% auto;
  }
  
  .animate-gradient {
    animation: gradient 8s linear infinite;
  }
`
document.head.appendChild(style)

export default Home