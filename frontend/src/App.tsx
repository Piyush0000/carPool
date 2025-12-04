import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import HomeDashboard from './pages/HomeDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import FindPool from './pages/FindPool';
import GroupDetail from './pages/GroupDetail';
import Profile from './pages/Profile';
// import RidePoolDashboard from './components/RidePoolDashboard';
import GroupsPage from './pages/GroupsPage';
import GroupChatPage from './pages/GroupChatPage';
import EmailVerification from './pages/EmailVerification';
import AdminPanel from './pages/AdminPanel';
import AdminRoute from './components/AdminRoute';
import ContactUs from './pages/ContactUs';
import ViewOnlyRoute from './components/ViewOnlyRoute';
import './index.css';
import './styles/RidePool.css';

// Background Animation Component
const BackgroundAnimation: React.FC = () => {
  return (
    <>
      <div className="background-blob background-blob-1"></div>
      <div className="background-blob background-blob-2"></div>
    </>
  );
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token && !isAuthenticated) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, token]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-16 h-16"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Public Route Component
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen text-gray-900 relative">
            <BackgroundAnimation />
            <Routes>
              <Route path="/" element={
                <PublicRoute>
                  <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-grow pt-16">
                      <HomeDashboard />
                    </main>
                  </div>
                </PublicRoute>
              } />
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />
              <Route path="/contact" element={
                <PublicRoute>
                  <ContactUs />
                </PublicRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-grow pt-16">
                      <HomeDashboard />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/find-pool" element={
                <PublicRoute>
                  <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-grow pt-16">
                      <ViewOnlyRoute featureName="Find Pool">
                        <FindPool />
                      </ViewOnlyRoute>
                    </main>
                  </div>
                </PublicRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminRoute>
                    <div className="min-h-screen flex flex-col">
                      <Navbar />
                      <main className="flex-grow pt-16">
                        <AdminPanel />
                      </main>
                    </div>
                  </AdminRoute>
                </ProtectedRoute>
              } />
              <Route path="/group/:id" element={
                <ProtectedRoute>
                  <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-grow pt-16">
                      <GroupDetail />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/group/create" element={
                <Navigate to="/groups" replace />
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-grow pt-16">
                      <Profile />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/groups" element={
                <PublicRoute>
                  <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-grow pt-16">
                      <ViewOnlyRoute featureName="Groups">
                        <GroupsPage />
                      </ViewOnlyRoute>
                    </main>
                  </div>
                </PublicRoute>
              } />
              <Route path="/group-chat/:groupId" element={
                <ProtectedRoute>
                  <GroupChatPage />
                </ProtectedRoute>
              } />
              <Route path="/verify-email" element={<EmailVerification />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;