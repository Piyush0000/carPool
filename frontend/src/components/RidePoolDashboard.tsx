import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RidePoolDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalGroups: 0
  });
  const [recentGroups, setRecentGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user groups
      const groupsResponse = await axios.get('/api/group/mygroups');
      
      // Mock stats data (in a real app, this would come from the backend)
      setStats({
        totalGroups: groupsResponse.data.data.length
      });
      
      // Set recent groups
      setRecentGroups(groupsResponse.data.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = () => {
    navigate('/groups');
  };

  const handleJoinGroup = () => {
    navigate('/find-pool');
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
      `}</style>

      <div className="min-h-screen bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold" style={{ color: styles.textDark }}>
              Welcome to Ride Pool
            </h1>
            <p className="mt-4 text-xl" style={{ color: styles.textMedium }}>
              Save money, reduce emissions, and connect with fellow students
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 mb-12">
            <div className="ridepool-dashboard-card p-8">
              <div className="flex items-center">
                <div className="p-4 rounded-lg" style={{ background: `rgba(255, 107, 107, 0.2)` }}>
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: styles.primary }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-6">
                  <h3 className="text-lg font-medium" style={{ color: styles.textLight }}>
                    Total Groups
                  </h3>
                  <p className="text-3xl font-bold mt-1" style={{ color: styles.textDark }}>
                    {stats.totalGroups}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Environmental Impact Message */}
          <div className="ridepool-dashboard-card mb-12 p-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="p-4 rounded-lg" style={{ background: `rgba(6, 214, 160, 0.2)` }}>
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: styles.success }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-2xl font-bold" style={{ color: styles.textDark }}>
                  Share Rides, Save the Environment
                </h3>
                <p className="mt-4 text-lg leading-relaxed" style={{ color: styles.textMedium }}>
                  Every cab share makes a difference. By choosing to ride together, you're reducing carbon emissions, 
                  decreasing traffic congestion, and helping create a cleaner, greener campus for everyone.
                </p>
                <div className="mt-6 p-6 rounded-xl" style={{ background: styles.lightBg2 }}>
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
              <div className="ridepool-dashboard-card p-8">
                <h2 className="text-2xl font-bold mb-10" style={{ color: styles.textDark }}>
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <button 
                    onClick={handleCreateGroup}
                    className="ridepool-dashboard-btn ridepool-dashboard-btn-primary py-8 px-6 rounded-2xl flex flex-col items-center justify-center hover:scale-105 transition-transform"
                  >
                    <svg className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-xl font-medium">Create Group</span>
                    <span className="text-base opacity-90 mt-3">Start a new ride pool</span>
                  </button>
                  
                  <button 
                    onClick={handleJoinGroup}
                    className="ridepool-dashboard-btn ridepool-dashboard-btn-secondary py-8 px-6 rounded-2xl flex flex-col items-center justify-center hover:scale-105 transition-transform"
                  >
                    <svg className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span className="text-xl font-medium">Join Group</span>
                    <span className="text-base opacity-90 mt-3">Find existing pools</span>
                  </button>
                  
                  <button 
                    onClick={() => navigate('/groups')}
                    className="ridepool-dashboard-btn ridepool-dashboard-btn-tertiary py-8 px-6 rounded-2xl flex flex-col items-center justify-center hover:scale-105 transition-transform"
                  >
                    <svg className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-xl font-medium">All Groups</span>
                    <span className="text-base opacity-90 mt-3">Browse all groups</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="ridepool-dashboard-card p-8">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-2xl font-bold" style={{ color: styles.textDark }}>
                    Recent Groups
                  </h2>
                  <button 
                    onClick={() => navigate('/groups')}
                    className="text-lg font-medium transition-colors hover:opacity-80"
                    style={{ color: styles.primary }}
                  >
                    View All
                  </button>
                </div>
                
                {recentGroups.length > 0 ? (
                  <div className="space-y-6">
                    {recentGroups.map((group) => (
                      <div 
                        key={group._id} 
                        className="flex items-center p-6 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                        style={{ 
                          background: styles.lightBg2,
                          border: `1px solid ${styles.border}`
                        }}
                        onClick={() => navigate(`/group/${group._id}`)}
                      >
                        <div 
                          className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${styles.primary}, ${styles.secondary})`
                          }}
                        >
                          <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="ml-6 flex-1">
                          <h3 className="text-xl font-medium" style={{ color: styles.textDark }}>
                            {group.groupName}
                          </h3>
                          <p className="text-base mt-1" style={{ color: styles.textLight }}>
                            {group.route?.pickup?.address?.split(',')[0]} → {group.route?.drop?.address?.split(',')[0]}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span className="ridepool-dashboard-badge ridepool-dashboard-badge-primary text-lg px-4 py-2">
                            {group.members?.length || 0}/{group.seatCount || 0}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: styles.textLight }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="mt-6 text-xl font-medium" style={{ color: styles.textDark }}>
                      No groups yet
                    </h3>
                    <p className="mt-3 text-lg" style={{ color: styles.textLight }}>
                      Get started by creating your first group.
                    </p>
                    <div className="mt-10">
                      <button
                        onClick={handleCreateGroup}
                        className="ridepool-dashboard-btn ridepool-dashboard-btn-primary px-8 py-4 rounded-xl text-lg font-semibold hover:scale-105 transition-transform"
                      >
                        Create Group
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-12">
              {/* Upcoming Rides */}
              <div className="ridepool-dashboard-card p-8">
                <h2 className="text-2xl font-bold mb-10" style={{ color: styles.textDark }}>
                  Upcoming Rides
                </h2>
                <div className="space-y-6">
                  <div className="p-6 rounded-xl" style={{ 
                    background: styles.lightBg2,
                    border: `1px solid ${styles.border}`
                  }}>
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-medium" style={{ color: styles.textDark }}>
                        Morning Ride
                      </h3>
                      <span className="ridepool-dashboard-badge ridepool-dashboard-badge-success text-lg px-4 py-2">
                        Tomorrow
                      </span>
                    </div>
                    <p className="text-base mt-3" style={{ color: styles.textLight }}>
                      8:00 AM • Main Gate → Academic Block
                    </p>
                    <div className="flex items-center mt-5">
                      <div className="flex -space-x-3">
                        <div 
                          className="w-8 h-8 rounded-full"
                          style={{
                            background: `linear-gradient(135deg, ${styles.primary}, ${styles.secondary})`
                          }}
                        ></div>
                        <div 
                          className="w-8 h-8 rounded-full"
                          style={{
                            background: `linear-gradient(135deg, ${styles.secondary}, ${styles.success})`
                          }}
                        ></div>
                      </div>
                      <span className="text-base ml-4" style={{ color: styles.textLight }}>
                        2 members
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 rounded-xl" style={{ 
                    background: styles.lightBg2,
                    border: `1px solid ${styles.border}`
                  }}>
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-medium" style={{ color: styles.textDark }}>
                        Evening Ride
                      </h3>
                      <span className="ridepool-dashboard-badge ridepool-dashboard-badge-warning text-lg px-4 py-2">
                        Fri, 5:30 PM
                      </span>
                    </div>
                    <p className="text-base mt-3" style={{ color: styles.textLight }}>
                      5:30 PM • Academic Block → Main Gate
                    </p>
                    <div className="flex items-center mt-5">
                      <div className="flex -space-x-3">
                        <div 
                          className="w-8 h-8 rounded-full"
                          style={{
                            background: `linear-gradient(135deg, ${styles.primary}, ${styles.secondary})`
                          }}
                        ></div>
                        <div 
                          className="w-8 h-8 rounded-full"
                          style={{
                            background: `linear-gradient(135deg, ${styles.secondary}, ${styles.success})`
                          }}
                        ></div>
                        <div 
                          className="w-8 h-8 rounded-full"
                          style={{
                            background: `linear-gradient(135deg, ${styles.warning}, ${styles.accent})`
                          }}
                        ></div>
                      </div>
                      <span className="text-base ml-4" style={{ color: styles.textLight }}>
                        3 members
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RidePoolDashboard;