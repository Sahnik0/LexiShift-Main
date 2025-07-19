import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AudioProvider } from './contexts/AudioContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { AIProvider } from './contexts/AIContext';
import { ErrorBoundary } from './components/ErrorComponents';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Resources from './components/Resources';
import Screening from './components/Screening';
import Support from './components/Support';
import Learning from './components/Learning';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { LoadingSpinner } from './components/LoadingComponents';
import { Suspense, lazy } from 'react';
import './styles/fonts.css';

// Lazy load components for better performance
const LazyLearning = lazy(() => import('./components/Learning'));
const LazyResources = lazy(() => import('./components/Resources'));
const LazyScreening = lazy(() => import('./components/Screening'));

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AudioProvider>
          <ProgressProvider>
            <SettingsProvider>
              <AIProvider>
                <Router>
                  <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <main className="transition-all duration-300 ease-in-out">
                      <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
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
                              <LazyResources />
                            </ProtectedRoute>
                          } />
                          <Route path="/screening" element={
                            <ProtectedRoute>
                              <LazyScreening />
                            </ProtectedRoute>
                          } />
                          <Route path="/support" element={
                            <ProtectedRoute>
                              <Support />
                            </ProtectedRoute>
                          } />
                          <Route path="/learning" element={
                            <ProtectedRoute>
                              <LazyLearning />
                            </ProtectedRoute>
                          } />
                        </Routes>
                      </Suspense>
                    </main>
                  </div>
                </Router>
              </AIProvider>
            </SettingsProvider>
          </ProgressProvider>
        </AudioProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
