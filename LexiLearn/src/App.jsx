import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AudioProvider } from './contexts/AudioContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { AIProvider } from './contexts/AIContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Resources from './components/Resources';
import Screening from './components/Screening';
import Support from './components/Support';
import Learning from './components/Learning';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/fonts.css';

function App() {
  console.log('App component rendering...');
  return (
    <AuthProvider>
      <AudioProvider>
        <ProgressProvider>
          <SettingsProvider>
            <AIProvider>
              <Router>
                <div className="min-h-screen bg-gray-50">
                  <Navbar />
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    } />
                    <Route path="/about" element={<About />} />
                    <Route path="/resources" element={
                      <ProtectedRoute>
                        <Resources />
                      </ProtectedRoute>
                    } />
                    <Route path="/screening" element={
                      <ProtectedRoute>
                        <Screening />
                      </ProtectedRoute>
                    } />
                    <Route path="/support" element={
                      <ProtectedRoute>
                        <Support />
                      </ProtectedRoute>
                    } />
                    <Route path="/learning" element={
                      <ProtectedRoute>
                        <Learning />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </div>
              </Router>
            </AIProvider>
          </SettingsProvider>
        </ProgressProvider>
      </AudioProvider>
    </AuthProvider>
  );
}

export default App;