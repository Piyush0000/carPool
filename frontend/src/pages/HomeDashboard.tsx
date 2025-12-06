import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api.service';

const HomeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalGroups: 0,
    userGroups: 0,
    totalUsers: 0
  });
  const [showAd, setShowAd] = useState(true);
  const [recentGroups, setRecentGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showingUserGroups, setShowingUserGroups] = useState(true); // Track if we're showing user's groups or all groups

  useEffect(() => {
    fetchDashboardData();
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      if (isAuthenticated) {
        console.log('Fetching authenticated user stats...'); // Debug log
        
        // Fetch all groups, user groups, and user count for authenticated users
        const [allGroupsResponse, userGroupsResponse, userCountResponse] = await Promise.all([
          api.get('/api/group'),
          api.get('/api/group/mygroups'),
          api.get('/api/users/count')
        ]);
        
        console.log('Authenticated user stats:', { 
          allGroupsResponse: allGroupsResponse.data, 
          userGroupsResponse: userGroupsResponse.data,
          userCountResponse: userCountResponse.data
        }); // Debug log
        
        setStats({
          totalGroups: allGroupsResponse.data.data.length,
          userGroups: userGroupsResponse.data.data.length,
          totalUsers: userCountResponse.data.count || 0
        });
        
        // If user has no groups, show recent public groups instead
        if (userGroupsResponse.data.data.length === 0) {
          setRecentGroups(allGroupsResponse.data.data.slice(0, 3));
          setShowingUserGroups(false);
        } else {
          // Set recent groups from user's groups
          setRecentGroups(userGroupsResponse.data.data.slice(0, 3));
          setShowingUserGroups(true);
        }
      } else {
        console.log('Fetching public user stats...'); // Debug log
        
        // Fetch all groups and user count for non-authenticated users
        const [allGroupsResponse, userCountResponse] = await Promise.all([
          api.get('/api/group/public'),
          api.get('/api/users/count')
        ]);
        
        console.log('Public user stats:', { 
          groups: allGroupsResponse.data,
          users: userCountResponse.data
        }); // Debug log
        
        setStats({
          totalGroups: allGroupsResponse.data.count || 0,
          userGroups: 0,
          totalUsers: userCountResponse.data.count || 0
        });
        
        // For non-authenticated users, show recent public groups
        const publicGroups = allGroupsResponse.data.data.slice(0, 3);
        setRecentGroups(publicGroups);
        setShowingUserGroups(false);
      }
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      console.error('Error details:', error.response?.data || error.message); // More detailed error log
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAd = () => {
    setShowAd(false);
  };

  // Component-specific styles
  const styles = {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    accent: '#FFD166',
    warning: '#FF9F1C',
    success: '#06D6A0',
    info: '#118AB2',
    purple: '#9B5DE5',
    textDark: '#212529',
    textMedium: '#495057',
    textLight: '#6C757D',
    border: '#DEE2E6',
    lightBg: '#FFFFFF',
    lightBg2: '#F8F9FA',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse w-16 h-16 rounded-full" style={{
          background: `linear-gradient(135deg, ${styles.primary}, ${styles.secondary})`,
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}></div>
      </div>
    );
  }

  return (
    <>
      {/* Component-specific CSS */}
      <style>{`
        .ridepool-dashboard-card {
          background: ${styles.lightBg};
          border: 1px solid ${styles.border};
          border-radius: 16px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }
        
        .ridepool-dashboard-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -6px rgba(0, 0, 0, 0.2);
          border-color: ${styles.primary};
        }
        
        .ridepool-dashboard-btn {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: none;
          cursor: pointer;
          padding: 12px 24px;
          font-size: 1rem;
          text-decoration: none;
        }
        
        .ridepool-dashboard-btn-primary {
          background: linear-gradient(135deg, ${styles.primary}, ${styles.secondary});
          color: white;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
        }
        
        .ridepool-dashboard-btn-primary:hover {
          box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
          transform: translateY(-3px);
        }
        
        .ridepool-dashboard-btn-secondary {
          background: linear-gradient(135deg, ${styles.accent}, ${styles.purple});
          color: white;
          box-shadow: 0 4px 15px rgba(255, 209, 102, 0.4);
        }
        
        .ridepool-dashboard-btn-secondary:hover {
          box-shadow: 0 6px 20px rgba(255, 209, 102, 0.6);
          transform: translateY(-3px);
        }
        
        .ridepool-dashboard-btn-tertiary {
          background: linear-gradient(135deg, ${styles.info}, ${styles.primary});
          color: white;
          box-shadow: 0 4px 15px rgba(17, 138, 178, 0.4);
        }
        
        .ridepool-dashboard-btn-tertiary:hover {
          box-shadow: 0 6px 20px rgba(17, 138, 178, 0.6);
          transform: translateY(-3px);
        }
        
        .ridepool-dashboard-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .ridepool-dashboard-badge-primary {
          background: linear-gradient(135deg, ${styles.primary}, ${styles.secondary});
          color: white;
          box-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
        }
        
        .ridepool-dashboard-badge-success {
          background: linear-gradient(135deg, ${styles.success}, ${styles.secondary});
          color: white;
          box-shadow: 0 2px 4px rgba(6, 214, 160, 0.3);
        }
        
        .ridepool-dashboard-badge-warning {
          background: linear-gradient(135deg, ${styles.warning}, ${styles.accent});
          color: white;
          box-shadow: 0 2px 4px rgba(255, 159, 28, 0.3);
        }
        
        @media (max-width: 768px) {
          .ridepool-dashboard-card {
            border-radius: 12px;
          }
          
          .ridepool-dashboard-btn {
            border-radius: 10px;
            padding: 10px 20px;
            font-size: 0.9rem;
          }
        }
        
        /* Brand logo styles */
        .brand-logo {
          background: linear-gradient(135deg, #FF6B6B, #4ECDC4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 800;
          letter-spacing: -0.05em;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        /* Feature card styles */
        .feature-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          padding: 2rem;
          border: 1px solid #e5e7eb;
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -6px rgba(0, 0, 0, 0.1);
        }
        
        .feature-icon {
          font-size: 2.5rem;
          width: 4rem;
          height: 4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 1rem;
          margin-bottom: 1.5rem;
        }
        
        /* Animations */
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(255, 107, 107, 0.8);
          }
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s infinite;
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out forwards;
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out forwards;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        /* Enhanced card styles */
        .enhanced-card {
          background: linear-gradient(145deg, #ffffff, #f0f0f0);
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          overflow: hidden;
        }
        
        .enhanced-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }
        
        /* Gradient text */
        .gradient-text {
          background: linear-gradient(135deg, ${styles.primary}, ${styles.secondary});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        /* Section spacing */
        .section-spacing {
          padding: 4rem 0;
        }
        
        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .section-spacing {
            padding: 3rem 0;
          }
        }
        
        @media (max-width: 768px) {
          .section-spacing {
            padding: 2rem 0;
          }
        }
      `}</style>

      {loading ? (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-pulse w-16 h-16 rounded-full" style={{
            background: `linear-gradient(135deg, ${styles.primary}, ${styles.secondary})`,
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}></div>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
          {/* Header with animated background */}
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-20 md:py-24">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            
            {/* Advertisement Banner under Navbar */}
            {showAd && (
              <div className="fixed top-20 right-4 z-50">
                <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 max-w-xs relative">
                  {/* Close Button */}
                  <button 
                    onClick={handleCloseAd}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <div className="flex items-start">
                    <div className="bg-gradient-to-r from-yellow-400 to-red-500 p-2 rounded-lg mr-3">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">🚕 Booking Cabs by Group</h3>
                      <p className="text-xs text-gray-600 mt-1">🔥 EXCLUSIVE 🎯 GROUP DISCOUNTS</p>
                      <p className="text-xs text-gray-500 mt-1">Coming Soon!</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 animate-float">
                Welcome to <span className="brand-logo-light">RideBuddy</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto px-4 mb-10 animate-fade-in">
                Your smart campus mobility solution
              </p>
              
              {/* Stats Section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto animate-slideInUp">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stats.totalGroups}+</div>
                  <div className="text-lg text-white/80">Active Groups</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stats.totalUsers}+</div>
                  <div className="text-lg text-white/80">Community Members</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stats.userGroups}</div>
                  <div className="text-lg text-white/80">Your Groups</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {/* Environmental Impact Message */}
              <div className="ridepool-card mb-10 p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start">
                  <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                    <div className="p-3 md:p-4 rounded-lg bg-green-500 bg-opacity-20">
                      <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                      Share Rides, Save the Environment
                    </h3>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                      Every cab share makes a difference. By choosing to ride together, you're reducing carbon emissions, 
                      decreasing traffic congestion, and helping create a cleaner, greener campus for everyone.
                    </p>
                    <div className="p-4 md:p-6 bg-gray-50 rounded-xl">
                      <p className="text-base md:text-lg text-green-600">
                        <span className="font-bold">Did you know?</span> A single shared cab can reduce CO2 emissions by up to 75% 
                        compared to individual rides. Keep sharing to make an even bigger impact!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity Section */}
              <div className="mb-16">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {isAuthenticated ? (showingUserGroups ? 'Your Groups' : 'Available Groups') : 'Popular Groups'}
                  </h2>
                  <Link 
                    to={isAuthenticated ? "/groups" : "/register"}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
                  >
                    {isAuthenticated ? 'View All Groups' : 'Join Community'}
                    <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>

                {recentGroups.length > 0 ? (
                  <div className="space-y-6">
                    {recentGroups.map((group) => (
                      <div 
                        key={group._id} 
                        className="flex items-center p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-md hover:shadow-lg"
                        style={{ 
                          background: styles.lightBg2,
                          border: `1px solid ${styles.border}`
                        }}
                        onClick={() => {
                          if (isAuthenticated) {
                            navigate(`/group/${group._id}`);
                          } else {
                            navigate('/groups');
                          }
                        }}
                      >
                        <div 
                          className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${styles.primary}, ${styles.secondary})`
                          }}
                        >
                          <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="ml-6 flex-1">
                          <h3 className="text-xl font-bold" style={{ color: styles.textDark }}>
                            {group.groupName}
                          </h3>
                          <p className="text-base mt-1" style={{ color: styles.textLight }}>
                            {group.route?.pickup?.address?.split(',')[0]} → {group.route?.drop?.address?.split(',')[0]}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span className="ridepool-dashboard-badge ridepool-dashboard-badge-primary text-lg px-4 py-2 font-bold">
                            {group.members?.length || 0}/{group.seatCount || 0}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <svg className="mx-auto h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: styles.textLight }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="mt-6 text-2xl font-bold" style={{ color: styles.textDark }}>
                      No groups available
                    </h3>
                    <p className="mt-3 text-lg" style={{ color: styles.textLight }}>
                      Check back later for new groups.
                    </p>
                    <div className="mt-10">
                      <Link
                        to="/register"
                        className="ridepool-dashboard-btn ridepool-dashboard-btn-primary px-10 py-4 rounded-2xl text-lg font-bold hover:scale-105 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-2xl"
                      >
                        Sign Up to Create Group
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Features Section */}
              <div className="mb-16">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Why Students Love RideBuddy
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Discover the benefits of campus carpooling
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="feature-card">
                    <div className="feature-icon bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Save Money
                    </h3>
                    <p className="text-lg text-gray-700">
                      Split the cost of rides with friends and save money on transportation.
                    </p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon bg-gradient-to-r from-pink-500 to-red-500 text-white">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Reduce Traffic
                    </h3>
                    <p className="text-lg text-gray-700">
                      Fewer cars on the road mean less traffic and a smoother commute.
                    </p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon bg-gradient-to-r from-green-500 to-teal-500 text-white">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Save the Environment
                    </h3>
                    <p className="text-lg text-gray-700">
                      Reduce your carbon footprint by sharing rides and reducing emissions.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              {!isAuthenticated && (
                <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100 mt-20 rounded-3xl">
                  <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 animate-fade-in">
                      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 gradient-text">
                        Get in Touch
                      </h2>
                      <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                        Have questions or feedback? We'd love to hear from you.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Contact Info Card */}
                      <div className="enhanced-card p-8 bg-white rounded-2xl shadow-2xl hover:shadow-2xl transition-all duration-300">
                        <div className="text-center">
                          <div className="feature-icon mx-auto mb-6 bg-indigo-100 text-indigo-600 rounded-2xl">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-6 gradient-text">
                            Contact Information
                          </h3>
                          <div className="space-y-6">
                            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50">
                              <p className="font-semibold text-gray-900 text-lg">Email</p>
                              <p className="text-gray-700 text-lg">ridebuddyservices@gmail.com</p>
                            </div>
                            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50">
                              <p className="font-semibold text-gray-900 text-lg">Phone</p>
                              <p className="text-gray-700 text-lg">+91 9717704058</p>
                            </div>
                            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50">
                              <p className="font-semibold text-gray-900 text-lg">Location</p>
                              <p className="text-gray-700 text-lg">Delhi, India</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Form Card */}
                      <div className="enhanced-card p-8 bg-white rounded-2xl shadow-2xl hover:shadow-2xl transition-all duration-300">
                        <div className="text-center">
                          <div className="feature-icon mx-auto mb-6 bg-indigo-100 text-indigo-600 rounded-2xl">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-6 gradient-text">
                            Quick Message
                          </h3>
                          <p className="text-gray-700 mb-8 text-lg">
                            Need immediate assistance? Send us a quick message.
                          </p>
                          <Link to="/contact" className="ridepool-dashboard-btn ridepool-dashboard-btn-primary w-full py-4 text-lg font-bold rounded-2xl hover:scale-105 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-2xl">
                            Contact Us
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomeDashboard;