import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { statsAPI } from '../services/api.service';

const HomeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalGroups: 9,
    activeUsers: 22
  });
  const [loading, setLoading] = useState(true);
  const [recentGroups] = useState([
    {
      _id: '1',
      groupName: 'Delhi to Jodhpur',
      route: {
        pickup: { address: 'Maharaja Agrasen Institute of Technology' },
        drop: { address: 'Jodhpur' }
      },
      memberCount: 4,
      maxMembers: 4
    },
    {
      _id: '2',
      groupName: 'Exam journey to VIPS',
      route: {
        pickup: { address: 'Uttam Nagar West' },
        drop: { address: 'Vivekananda Institute of Professional Studies - Technical Campus' }
      },
      memberCount: 3,
      maxMembers: 4
    },
    {
      _id: '3',
      groupName: 'MAIT TO HMR',
      route: {
        pickup: { address: 'MAIT' },
        drop: { address: 'Hamidpur - 110036' }
      },
      memberCount: 4,
      maxMembers: 4
    }
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await statsAPI.getPublicStats();
        if (response.data.success) {
          setStats({
            totalGroups: response.data.data.totalGroups,
            activeUsers: response.data.data.totalUsers
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Fallback to default values
        setStats({
          totalGroups: 1247,
          activeUsers: 3117
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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

  // For authenticated users, show a simplified dashboard
  if (isAuthenticated) {
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
            background: linear-gradient(135deg, ${styles.primary}, ${styles.secondary});
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
            background: linear-gradient(145deg, ${styles.lightBg}, ${styles.lightBg2});
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
          {/* Dashboard Content for Authenticated Users */}
          <div className="py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-16 text-center animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-6 animate-float">
                  Welcome Back!
                </h1>
                <p className="mt-4 text-xl md:text-2xl max-w-3xl mx-auto" style={{ color: styles.textMedium }}>
                  Continue your journey with RideBuddy
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
                        Your Groups
                      </h3>
                      <p className="text-4xl font-bold mt-1 gradient-text">
                        3
                      </p>
                    </div>
                  </div>
                </div>
                <div className="enhanced-card p-8 hover:shadow-2xl">
                  <div className="flex items-center">
                    <div className="p-4 rounded-xl" style={{ background: `rgba(78, 205, 196, 0.2)` }}>
                      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: styles.secondary }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-6">
                      <h3 className="text-lg font-medium" style={{ color: styles.textLight }}>
                        Upcoming Rides
                      </h3>
                      <p className="text-4xl font-bold mt-1 gradient-text">
                        2
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="enhanced-card p-8 animate-fade-in mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-10 gradient-text">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Link 
                    to="/find-pool"
                    className="ridepool-dashboard-btn ridepool-dashboard-btn-primary py-10 px-6 rounded-2xl flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-2xl"
                  >
                    <svg className="h-14 w-14 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-xl font-bold">Find Pool</span>
                    <span className="text-base opacity-90 mt-2">Look for ride groups</span>
                  </Link>
                  
                  <Link 
                    to="/groups"
                    className="ridepool-dashboard-btn ridepool-dashboard-btn-secondary py-10 px-6 rounded-2xl flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-2xl"
                  >
                    <svg className="h-14 w-14 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-xl font-bold">My Groups</span>
                    <span className="text-base opacity-90 mt-2">View your groups</span>
                  </Link>
                  
                  <Link 
                    to="/profile"
                    className="ridepool-dashboard-btn ridepool-dashboard-btn-tertiary py-10 px-6 rounded-2xl flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-2xl"
                  >
                    <svg className="h-14 w-14 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xl font-bold">Profile</span>
                    <span className="text-base opacity-90 mt-2">Manage your account</span>
                  </Link>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="enhanced-card p-8 animate-fade-in">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold gradient-text">
                    Recent Activity
                  </h2>
                  <Link 
                    to="/groups"
                    className="text-lg font-medium transition-colors hover:opacity-80 px-6 py-3 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 transition-all duration-300"
                    style={{ color: styles.primary }}
                  >
                    View All
                  </Link>
                </div>
                
                <div className="space-y-6">
                  <div 
                    className="flex items-center p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-md hover:shadow-lg"
                    style={{ 
                      background: styles.lightBg2,
                      border: `1px solid ${styles.border}`
                    }}
                    onClick={() => navigate('/group/1')}
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
                        Delhi to Jodhpur
                      </h3>
                      <p className="text-base mt-1" style={{ color: styles.textLight }}>
                        Today at 9:00 AM
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span 
                        className="ridepool-dashboard-badge ridepool-dashboard-badge-success"
                      >
                        Confirmed
                      </span>
                    </div>
                  </div>
                  
                  <div 
                    className="flex items-center p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-md hover:shadow-lg"
                    style={{ 
                      background: styles.lightBg2,
                      border: `1px solid ${styles.border}`
                    }}
                    onClick={() => navigate('/group/2')}
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
                        Exam journey to VIPS
                      </h3>
                      <p className="text-base mt-1" style={{ color: styles.textLight }}>
                        Tomorrow at 2:30 PM
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span 
                        className="ridepool-dashboard-badge ridepool-dashboard-badge-warning"
                      >
                        Pending
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Professional Footer */}
          <footer className="bg-gray-900 text-white pt-16 pb-8 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {/* Company Info */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold" style={{ color: styles.primary }}>
                    RideBuddy
                  </h3>
                  <p className="text-gray-400">
                    Connecting students through shared rides, reducing costs and environmental impact on campus.
                  </p>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                
                {/* Quick Links */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                  <ul className="space-y-2">
                    <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                    <li><Link to="/find-pool" className="text-gray-400 hover:text-white transition-colors">Find Pool</Link></li>
                  </ul>
                </div>
                
                {/* Resources */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Resources</h4>
                  <ul className="space-y-2">
                    <li><Link to="/groups" className="text-gray-400 hover:text-white transition-colors">Groups</Link></li>
                    <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                  </ul>
                </div>
                
                {/* Contact Info */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>ridebuddyservices@gmail.com</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>+91 9717704058</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Delhi, India</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-gray-800 pt-8 mt-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <p className="text-gray-400 text-sm">
                    © {new Date().getFullYear()} RideBuddy. All rights reserved.
                  </p>
                  <div className="mt-4 md:mt-0 flex space-x-6">
                    <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                      Privacy Policy
                    </Link>
                    <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                      Terms of Service
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </>
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
          background: linear-gradient(135deg, ${styles.primary}, ${styles.secondary});
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
          background: linear-gradient(145deg, ${styles.lightBg}, ${styles.lightBg2});
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
                      {stats.activeUsers}
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
                          onClick={() => navigate('/login')}
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
                            <span 
                              className="ridepool-dashboard-badge ridepool-dashboard-badge-primary"
                            >
                              {group.memberCount}/{group.maxMembers}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p style={{ color: styles.textMedium }}>No recent activity to display</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-12">
                {/* Upcoming Rides */}
                <div className="enhanced-card p-8 animate-fade-in">
                  <h2 className="text-2xl md:text-3xl font-bold mb-10 gradient-text">
                    Why Choose RideBuddy?
                  </h2>
                  
                  <div className="space-y-8">
                    <div className="feature-card">
                      <div className="feature-icon bg-blue-100 text-blue-600">
                        👥
                      </div>
                      <h3 className="text-xl font-bold mb-3" style={{ color: styles.textDark }}>
                        Find Travel Buddies
                      </h3>
                      <p style={{ color: styles.textMedium }}>
                        Match with students traveling on similar routes and schedules in real-time.
                      </p>
                    </div>
                    
                    <div className="feature-card">
                      <div className="feature-icon bg-green-100 text-green-600">
                        💰
                      </div>
                      <h3 className="text-xl font-bold mb-3" style={{ color: styles.textDark }}>
                        Save Money
                      </h3>
                      <p style={{ color: styles.textMedium }}>
                        Split cab fares with fellow students and reduce your travel costs significantly.
                      </p>
                    </div>
                    
                    <div className="feature-card">
                      <div className="feature-icon bg-purple-100 text-purple-600">
                        🌍
                      </div>
                      <h3 className="text-xl font-bold mb-3" style={{ color: styles.textDark }}>
                        Go Green
                      </h3>
                      <p style={{ color: styles.textMedium }}>
                        Reduce carbon emissions by up to 75% and help create a cleaner campus.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="enhanced-card p-8 animate-fade-in">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 gradient-text">
                    Get in Touch
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: styles.textLight }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p style={{ color: styles.textMedium }}>Email</p>
                        <p className="font-medium" style={{ color: styles.textDark }}>ridebuddyservices@gmail.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: styles.textLight }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p style={{ color: styles.textMedium }}>Phone</p>
                        <p className="font-medium" style={{ color: styles.textDark }}>+91 9717704058</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: styles.textLight }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p style={{ color: styles.textMedium }}>Location</p>
                        <p className="font-medium" style={{ color: styles.textDark }}>Delhi, India</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <Link 
                      to="/contact"
                      className="ridepool-dashboard-btn ridepool-dashboard-btn-primary w-full py-3 rounded-xl flex items-center justify-center"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            {!isAuthenticated && (
              <div className="mt-20 enhanced-card p-12 text-center animate-fade-in">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
                  Ready to Start Saving?
                </h2>
                <p className="text-xl max-w-2xl mx-auto mb-10" style={{ color: styles.textMedium }}>
                  Join RideBuddy today and never ride alone again!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/register"
                    className="ridepool-dashboard-btn ridepool-dashboard-btn-primary px-8 py-4 text-lg rounded-xl flex items-center justify-center"
                  >
                    <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Sign Up Now
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Professional Footer - Added for non-authenticated users */}
        <footer className="bg-gray-900 text-white pt-16 pb-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {/* Company Info */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold" style={{ color: styles.primary }}>
                  RideBuddy
                </h3>
                <p className="text-gray-400">
                  Connecting students through shared rides, reducing costs and environmental impact on campus.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                  <li><Link to="/find-pool" className="text-gray-400 hover:text-white transition-colors">Find Pool</Link></li>
                </ul>
              </div>
              
              {/* Resources */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><Link to="/groups" className="text-gray-400 hover:text-white transition-colors">Groups</Link></li>
                  <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                </ul>
              </div>
              
              {/* Contact Info */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>ridebuddyservices@gmail.com</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+91 9717704058</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Delhi, India</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8 mt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} RideBuddy. All rights reserved.
                </p>
                <div className="mt-4 md:mt-0 flex space-x-6">
                  <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Privacy Policy
                  </Link>
                  <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};export default HomeDashboard;