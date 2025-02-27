import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const lottieRef = useRef(null);
  const heroRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);
  
  // Particle effect
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    const generateParticles = () => {
      return Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 1,
        velocity: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.7 ? '#3AA673' : '#4FC7A1', // Use brand colors
      }));
    };
    
    setParticles(generateParticles());
    
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          y: p.y < window.innerHeight ? p.y + p.velocity : 0,
        })),
      );
    }, 50);
    
    const handleResize = () => {
      setParticles(generateParticles());
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Dynamically import the dotlottie player
    const script = document.createElement('script');
    script.src = "https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs";
    script.type = "module";
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleGetStarted = () => {
    if (auth.currentUser) {
      navigate('/voice-assistant');
    } else {
      navigate('/signin');
    }
  };

  const handleChoosePlan = (plan) => {
    if (auth.currentUser) {
      navigate(`/subscription?plan=${plan}`);
    } else {
      navigate('/signin');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden relative">
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
          />
        ))}
      </div>
      
      {/* Decorative gradient orbs */}
      <div className="fixed top-1/4 -left-32 w-64 h-64 rounded-full bg-teal-500/20 blur-3xl z-0"></div>
      <div className="fixed bottom-1/4 -right-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl z-0"></div>
      
  
      {/* Hero Section */}
      <motion.div 
        ref={heroRef}
        style={{ y }}
        className="w-full max-w-6xl px-6 py-20 flex flex-col md:flex-row items-center justify-between z-10 relative"
      >
        {/* Left Side Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 text-center md:text-left mb-12 md:mb-0"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-gray-100">Your AI</span>
            <span className="text-teal-400"> Therapy</span>
            <span className="text-gray-100"> Assistant</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Dyslu helps you navigate life's challenges with personalized AI-powered 
            therapy sessions available anytime, anywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/learn-more')}
              className="px-8 py-3 rounded-full border border-teal-500 text-teal-400 font-medium hover:bg-teal-900 hover:bg-opacity-20 transition-all duration-300"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>

        {/* Right Side Animation */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 flex justify-center relative"
          ref={lottieRef}
        >
          {/* Glow effect behind the lottie animation */}
          <div className="absolute inset-0 w-full h-full bg-teal-500/10 rounded-full blur-3xl"></div>
          <dotlottie-player 
            src="https://lottie.host/5bdc2942-d2d3-4089-9fed-e6a613c83905/XdDVLwDT7p.lottie" 
            background="transparent" 
            speed="1" 
            style={{ width: "400px", height: "400px", position: "relative", zIndex: "1" }} 
            loop 
            autoplay
          ></dotlottie-player>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <section id="features" className="w-full py-20 z-10 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-teal-400">Why Choose Dyslu?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience therapy on your terms with our advanced AI-powered assistant
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-700/50 hover:border-teal-500/30 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-teal-900/30 rounded-full flex items-center justify-center mb-6 group-hover:bg-teal-900/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Available 24/7</h3>
              <p className="text-gray-400">
                Access therapeutic support whenever you need it, without waiting for appointments.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-700/50 hover:border-teal-500/30 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-teal-900/30 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Complete Privacy</h3>
              <p className="text-gray-400">
                Your conversations are private and secure, with end-to-end encryption.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-700/50 hover:border-teal-500/30 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-teal-900/30 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Personalized Support</h3>
              <p className="text-gray-400">
                Advanced AI that adapts to your unique needs and personal growth journey.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="w-full py-20 z-10 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-teal-400">Choose Your Plan</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Find the perfect plan that suits your therapy needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(76, 199, 161, 0.1), 0 10px 10px -5px rgba(76, 199, 161, 0.04)" }}
              className="bg-gray-900/60 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-800 hover:border-teal-500/30 transition-all duration-300"
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                <div className="flex items-end mb-6">
                  <span className="text-4xl font-bold text-white">$0</span>
                  <span className="text-gray-400 ml-1">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-400">
                    <svg className="w-5 h-5 mr-2 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    10 sessions per month
                  </li>
                  <li className="flex items-center text-gray-400">
                    <svg className="w-5 h-5 mr-2 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Basic session tools
                  </li>
                  <li className="flex items-center text-gray-400">
                    <svg className="w-5 h-5 mr-2 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Email support
                  </li>
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChoosePlan('free')}
                  className="w-full py-3 rounded-lg bg-gray-800 text-teal-400 border border-teal-500 hover:bg-teal-900 hover:bg-opacity-20 transition-all duration-300"
                >
                  Get Started
                </motion.button>
              </div>
            </motion.div>

            {/* Pro Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(76, 199, 161, 0.1), 0 10px 10px -5px rgba(76, 199, 161, 0.04)" }}
              className="bg-gray-900/60 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border-2 border-teal-500 transform scale-105 z-20"
            >
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-center py-2">
                <span className="text-gray-900 font-medium">Most Popular</span>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <div className="flex items-end mb-6">
                  <span className="text-4xl font-bold text-white">$9.99</span>
                  <span className="text-gray-400 ml-1">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-400">
                    <svg className="w-5 h-5 mr-2 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Unlimited sessions
                  </li>
                  <li className="flex items-center text-gray-400">
                    <svg className="w-5 h-5 mr-2 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Advanced therapy tools
                  </li>
                  <li className="flex items-center text-gray-400">
                    <svg className="w-5 h-5 mr-2 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Progress tracking
                  </li>
                  <li className="flex items-center text-gray-400">
                    <svg className="w-5 h-5 mr-2 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Priority support
                  </li>
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChoosePlan('pro')}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Choose Plan
                </motion.button>
              </div>
            </motion.div>

            {/* Premium Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(76, 199, 161, 0.1), 0 10px 10px -5px rgba(76, 199, 161, 0.04)" }}
              className="bg-gray-900/60 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-800 hover:border-teal-500/30 transition-all duration-300"
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
                <div className="flex items-end mb-6">
                  <span className="text-4xl font-bold text-white">$19.99</span>
                  <span className="text-gray-400 ml-1">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-400">
                    <svg className="w-5 h-5 mr-2 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Everything in Pro
                  </li>
                  <li className="flex items-center text-gray-400">
                    <svg className="w-5 h-5 mr-2 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Voice sessions
                  </li>
                  <li className="flex items-center text-gray-400">
                    <svg className="w-5 h-5 mr-2 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Personalized insights
                  </li>
                  <li className="flex items-center text-gray-400">
                    <svg className="w-5 h-5 mr-2 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    24/7 premium support
                  </li>
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChoosePlan('premium')}
                  className="w-full py-3 rounded-lg bg-gray-800 text-teal-400 border border-teal-500 hover:bg-teal-900 hover:bg-opacity-20 transition-all duration-300"
                >
                  Choose Plan
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-20 z-10 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-teal-400">What Our Users Say</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              See how Dyslu has helped people improve their mental wellbeing
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-700/50 hover:border-teal-500/30 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500/30 to-emerald-500/30 rounded-full flex items-center justify-center mr-4">
                  <span className="text-teal-400 font-bold">JD</span>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white">Jamie D.</h4>
                  <p className="text-gray-400">Pro User</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "Dyslu has been a life-changing companion during my anxiety recovery. Being able to talk through my thoughts anytime has made a huge difference in my daily life."
              </p>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-700/50 hover:border-teal-500/30 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500/30 to-emerald-500/30 rounded-full flex items-center justify-center mr-4">
                  <span className="text-teal-400 font-bold">SM</span>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white">Sarah M.</h4>
                  <p className="text-gray-400">Premium User</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "I was skeptical about AI therapy, but Dyslu surprised me with its insightful responses. The voice sessions feel surprisingly natural and have helped me through some tough times."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 z-10 relative">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-12 text-center shadow-lg"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">Begin Your Wellness Journey Today</h2>
            <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
              Take the first step toward better mental health with Dyslu's supportive AI therapy assistant.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="px-8 py-3 rounded-full bg-white text-teal-600 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Now
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-950 py-12 z-10 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h3 className="text-2xl font-bold text-teal-400 mb-4">Dyslu</h3>
              <p className="text-gray-400 max-w-xs">
                AI-powered therapy assistant for better mental wellbeing.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-16 gap-y-4">
              <a href="/about" className="text-gray-400 hover:text-teal-400 transition-colors">About</a>
              <a href="/privacy" className="text-gray-400 hover:text-teal-400 transition-colors">Privacy</a>
              <a href="/terms" className="text-gray-400 hover:text-teal-400 transition-colors">Terms</a>
              <a href="/contact" className="text-gray-400 hover:text-teal-400 transition-colors">Contact</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Dyslu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;