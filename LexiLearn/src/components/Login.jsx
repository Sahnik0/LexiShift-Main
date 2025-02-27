import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn } from 'lucide-react';

function Login() {
  const { currentUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect if there's a specified return path, otherwise go to home
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    // If user is already logged in, redirect them
    if (currentUser) {
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, from]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Failed to sign in", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-black to-black" />
        
        {/* Floating orbs with different sizes and animations */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-400/10 blur-xl animate-float"
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `
                float-x ${Math.random() * 20 + 20}s infinite ease-in-out ${Math.random() * 10}s,
                float-y ${Math.random() * 15 + 15}s infinite ease-in-out ${Math.random() * 10}s,
                pulse ${Math.random() * 8 + 8}s infinite ease-in-out ${Math.random() * 5}s
              `
            }}
          />
        ))}

        {/* Additional glow effects */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="min-h-screen flex items-center justify-center px-4 relative">
        <div className="max-w-md w-full space-y-8 relative z-10">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-300% animate-gradient">
                Welcome to LexiLearn
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-4">
              Your journey to better learning starts here
            </p>
            <p className="text-md text-white/60">
              Please sign in to access all features and personalized content
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 hover:border-white/20 transition-colors">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all text-lg font-medium group"
            >
              <LogIn className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
              Sign in with Google
            </button>

            {/* Additional Info */}
            <div className="mt-6 text-center text-white/60">
              <p className="text-sm">
                By signing in, you agree to our{' '}
                <a href="/terms" className="text-blue-400 hover:text-blue-300">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float-x {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(30px); }
        }
        @keyframes float-y {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(30px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

export default Login;