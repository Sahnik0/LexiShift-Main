import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      navigate('/voice-assistant');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/voice-assistant');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950 text-white">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full max-w-md bg-gray-900 bg-opacity-60 backdrop-blur-lg p-8 rounded-xl shadow-lg"
      >
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2 text-2xl font-bold text-white">
            <Brain className="h-10 w-10 text-teal-400" />
            <span>Dyslu</span>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center text-white mb-6">Create Account</h2>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-red-600 text-white px-4 py-3 rounded-md mb-4 text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Full Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" 
            required 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" 
            required 
          />
          <input 
            type="password" 
            placeholder="Confirm Password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" 
            required 
          />

          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            type="submit" 
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all"
          >
            Sign Up
          </motion.button>
        </form>

        <div className="my-6 flex items-center justify-center">
          <span className="border-b border-gray-700 w-full"></span>
          <span className="px-2 text-gray-400">or</span>
          <span className="border-b border-gray-700 w-full"></span>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          onClick={handleGoogleSignIn} 
          className="w-full bg-white text-gray-800 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-100 transition-all"
        >
          <img src="https://logos-world.net/wp-content/uploads/2020/09/Google-Symbol.png" alt="Google" className="w-11 h-6" />
          <span>Sign up with Google</span>
        </motion.button>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <button 
            onClick={() => navigate('/signin')} 
            className="text-teal-400 hover:text-teal-300 transition-all"
          >
            Sign In
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUp;