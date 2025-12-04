import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ViewOnlyRouteProps {
  children: React.ReactNode;
  featureName: string;
}

const ViewOnlyRoute: React.FC<ViewOnlyRouteProps> = ({ children, featureName }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // Function to handle actions that require authentication
  const handleProtectedAction = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
    }
    // If authenticated, the action will proceed normally
    return isAuthenticated;
  };

  // Expose the function globally for child components to use
  useEffect(() => {
    (window as any).handleProtectedAction = handleProtectedAction;
    
    return () => {
      delete (window as any).handleProtectedAction;
    };
  }, [isAuthenticated]);

  const closeAuthPrompt = () => {
    setShowAuthPrompt(false);
  };

  const goToLogin = () => {
    navigate('/login');
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <>
      {children}
      
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Authentication Required</h3>
            <p className="mb-6">
              You need to be signed in to use {featureName}. Please log in or create an account to continue.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={goToLogin}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
              >
                Log In
              </button>
              <button
                onClick={goToRegister}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md transition-colors"
              >
                Register
              </button>
              <button
                onClick={closeAuthPrompt}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewOnlyRoute;