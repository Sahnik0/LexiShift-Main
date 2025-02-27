// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase/firebase';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

import VoiceAssistant from './pages/VoiceAssistant';

const App = () => {
  const [user] = useAuthState(auth);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route 
            path="/voice-assistant" 
            element={user ? <VoiceAssistant /> : <Navigate to="/signin" />} 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;