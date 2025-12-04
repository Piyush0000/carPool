import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const HomeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalGroups: 0,
    userGroups: 0
  });
  const [recentGroups, setRecentGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      if (isAuthenticated) {
        // Fetch all groups and user groups for authenticated users
        const [allGroupsResponse, userGroupsResponse] = await Promise.all([
          axios.get('/api/group'),
          axios.get('/api/group/mygroups')
        ]);
        
        setStats({
          totalGroups: allGroupsResponse.data.data.length,
          userGroups: userGroupsResponse.data.data.length
        });
        
        // Set recent groups
        setRecentGroups(userGroupsResponse.data.data.slice(0, 3));
      } else {
        // Fetch only public groups for non-authenticated users
        const publicGroupsResponse = await axios.get('/api/group/public');
        
        setStats({
          totalGroups: publicGroupsResponse.data.data.length,
          userGroups: 0
        });
        
        // For non-authenticated users, show recent public groups
        const publicGroups = publicGroupsResponse.data.data.slice(0, 3);
        setRecentGroups(publicGroups);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
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

      <div className="min-h-screen bg-white relative">
        {/* Promotional Ad - EYE-CATCHING - Positioned in top-right corner */}
        <div className="fixed top-24 right-4 z-20 animate-pulse-slow transform hover:scale-[1.02] transition-all duration-300 w-72 md:w-80 shadow-2xl rounded-2xl overflow-hidden border-2 border-pink-300">
          <div className="p-4 bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 rounded-2xl">
            <div className="flex flex-col items-center justify-between gap-3">
              <div className="flex items-center w-full">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center animate-pulse">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-bold text-purple-900">🚕 Booking Cabs by Group - Coming Soon!</h3>
                </div>
              </div>
              <div className="flex items-center space-x-2 w-full">
                <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs font-bold animate-pulse">
                  🔥 EXCLUSIVE
                </span>
                <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-xs font-bold">
                  🎯 GROUP DISCOUNTS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-16 text-center animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-6 animate-float">
                Explore Ride Pool
              </h1>
              <p className="mt-4 text-xl md:text-2xl max-w-3xl mx-auto" style={{ color: styles.textMedium }}>
                See what our platform offers and join today
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16 animate-fade-in">
              <div className="enhanced-card p-8 hover:shadow-2xl">
                <div className="flex items-center">
                  <div className="p-4 rounded-xl" style={{ background: `rgba(255, 107, 107, 0.2)` }}>
                    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: styles.primary }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-lg font-medium" style={{ color: styles.textLight }}>
                      Total Groups
                    </h3>
                    <p className="text-4xl font-bold mt-1 gradient-text">
                      {stats.totalGroups}
                    </p>
                  </div>
                </div>
              </div>
              <div className="enhanced-card p-8 hover:shadow-2xl">
                <div className="flex items-center">
                  <div className="p-4 rounded-xl" style={{ background: `rgba(78, 205, 196, 0.2)` }}>
                    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: styles.secondary }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-lg font-medium" style={{ color: styles.textLight }}>
                      Active Users
                    </h3>
                    <p className="text-4xl font-bold mt-1 gradient-text">
                      {Math.floor(stats.totalGroups * 2.5)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Environmental Impact Message */}
            <div className="enhanced-card mb-16 p-8 animate-fade-in">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="p-5 rounded-2xl" style={{ background: `rgba(6, 214, 160, 0.2)` }}>
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: styles.success }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold gradient-text mb-4">
                    Share Rides, Save the Environment
                  </h3>
                  <p className="text-lg leading-relaxed mb-6" style={{ color: styles.textMedium }}>
                    Every cab share makes a difference. By choosing to ride together, you're reducing carbon emissions, 
                    decreasing traffic congestion, and helping create a cleaner, greener campus for everyone.
                  </p>
                  <div className="p-6 rounded-2xl" style={{ background: styles.lightBg2 }}>
                    <p className="text-lg" style={{ color: styles.success }}>
                      <span className="font-bold">Did you know?</span> A single shared cab can reduce CO2 emissions by up to 75% 
                      compared to individual rides. Keep sharing to make an even bigger impact!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-12">
                {/* Quick Actions */}
                <div className="enhanced-card p-8 animate-fade-in">
                  <h2 className="text-2xl md:text-3xl font-bold mb-10 gradient-text">
                    Get Started
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Link 
                      to="/register"
                      className="ridepool-dashboard-btn ridepool-dashboard-btn-primary py-10 px-6 rounded-2xl flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-2xl"
                    >
                      <svg className="h-14 w-14 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      <span className="text-xl font-bold">Sign Up</span>
                      <span className="text-base opacity-90 mt-2">Create an account</span>
                    </Link>
                    
                    <Link 
                      to="/login"
                      className="ridepool-dashboard-btn ridepool-dashboard-btn-secondary py-10 px-6 rounded-2xl flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-2xl"
                    >
                      <svg className="h-14 w-14 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span className="text-xl font-bold">Login</span>
                      <span className="text-base opacity-90 mt-2">Access your account</span>
                    </Link>
                    
                    <Link 
                      to="/groups"
                      className="ridepool-dashboard-btn ridepool-dashboard-btn-tertiary py-10 px-6 rounded-2xl flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-2xl"
                    >
                      <svg className="h-14 w-14 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-xl font-bold">View Groups</span>
                      <span className="text-base opacity-90 mt-2">See all groups</span>
                    </Link>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="enhanced-card p-8 animate-fade-in">
                  <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold gradient-text">
                      Popular Groups
                    </h2>
                    <Link 
                      to="/groups"
                      className="text-lg font-medium transition-colors hover:opacity-80 px-6 py-3 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 transition-all duration-300"
                      style={{ color: styles.primary }}
                    >
                      View All
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
              </div>

              {/* Right Column */}
              <div className="space-y-12">
                {/* Upcoming Rides */}
                <div className="enhanced-card p-8 animate-fade-in">
                  <h2 className="text-2xl md:text-3xl font-bold mb-10 gradient-text">
                    Upcoming Rides
                  </h2>
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300" style={{ 
                      background: styles.lightBg2,
                      border: `1px solid ${styles.border}`
                    }}>
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold" style={{ color: styles.textDark }}>
                          Morning Ride
                        </h3>
                        <span className="ridepool-dashboard-badge ridepool-dashboard-badge-success text-lg px-4 py-2 font-bold">
                          Tomorrow
                        </span>
                      </div>
                      <p className="text-base mt-3" style={{ color: styles.textLight }}>
                        8:00 AM • Main Gate → Academic Block
                      </p>
                      <div className="flex items-center mt-5">
                        <div className="flex -space-x-3">
                          <div 
                            className="w-10 h-10 rounded-full border-2 border-white"
                            style={{
                              background: `linear-gradient(135deg, ${styles.primary}, ${styles.secondary})`
                            }}
                          ></div>
                          <div 
                            className="w-10 h-10 rounded-full border-2 border-white"
                            style={{
                              background: `linear-gradient(135deg, ${styles.secondary}, ${styles.success})`
                            }}
                          ></div>
                        </div>
                        <span className="text-base ml-4 font-medium" style={{ color: styles.textLight }}>
                          2 members
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300" style={{ 
                      background: styles.lightBg2,
                      border: `1px solid ${styles.border}`
                    }}>
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold" style={{ color: styles.textDark }}>
                          Evening Ride
                        </h3>
                        <span className="ridepool-dashboard-badge ridepool-dashboard-badge-warning text-lg px-4 py-2 font-bold">
                          Fri, 5:30 PM
                        </span>
                      </div>
                      <p className="text-base mt-3" style={{ color: styles.textLight }}>
                        5:30 PM • Academic Block → Main Gate
                      </p>
                      <div className="flex items-center mt-5">
                        <div className="flex -space-x-3">
                          <div 
                            className="w-10 h-10 rounded-full border-2 border-white"
                            style={{
                              background: `linear-gradient(135deg, ${styles.primary}, ${styles.secondary})`
                            }}
                          ></div>
                          <div 
                            className="w-10 h-10 rounded-full border-2 border-white"
                            style={{
                              background: `linear-gradient(135deg, ${styles.secondary}, ${styles.success})`
                            }}
                          ></div>
                          <div 
                            className="w-10 h-10 rounded-full border-2 border-white"
                            style={{
                              background: `linear-gradient(135deg, ${styles.warning}, ${styles.accent})`
                            }}
                          ></div>
                        </div>
                        <span className="text-base ml-4 font-medium" style={{ color: styles.textLight }}>
                          3 members
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section for non-authenticated users */}
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

            {/* CTA Section for non-authenticated users */}
            <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <div className="enhanced-card p-12 animate-fade-in bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border-2 border-purple-100">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 gradient-text">
                    Ready to Start Saving?
                  </h2>
                  <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
                    Join RideBuddy today and never ride alone again!
                  </p>
                  <Link to="/register" className="ridepool-dashboard-btn ridepool-dashboard-btn-primary px-10 py-4 text-lg font-bold rounded-2xl hover:scale-105 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-2xl">
                    <svg className="w-6 h-6 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Sign Up Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeDashboard;