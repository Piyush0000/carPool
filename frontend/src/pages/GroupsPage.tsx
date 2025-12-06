// Simplified GroupsPage.tsx - Direct approach to show groups to all users

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { groupAPI } from '../services/api.service';

interface GroupMember {
  user: {
    _id: string;
    name: string;
    year?: string;
    branch?: string;
  };
  role: string;
}

interface Group {
  _id: string;
  groupName: string;
  members: GroupMember[];
  route: {
    pickup: { address: string };
    drop: { address: string };
  };
  seatCount: number;
  status: string;
  description?: string;
  dateTime: string;
  createdAt: string;
  isMember?: boolean;
  canJoin?: boolean;
}

const GroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Load groups - always use public endpoint for simplicity
  const loadGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Always use the public endpoint to get groups
      const response = await groupAPI.getAllPublic();
      setGroups(response.data.data);
    } catch (err: any) {
      console.error('Error loading groups:', err);
      setError('Failed to load groups. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadGroups();
  }, []);
  
  // Handle group join
  const handleJoinGroup = async (groupId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      await groupAPI.join(groupId);
      // Reload groups to update membership status
      loadGroups();
    } catch (err: any) {
      console.error('Error joining group:', err);
      const errorMessage = err.response?.data?.message || 'Failed to join group';
      setError(errorMessage);
      setTimeout(() => setError(null), 3000);
    }
  };
  
  // Handle group detail navigation
  const goToGroupDetail = (groupId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/group/${groupId}`);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="spinner w-16 h-16"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Student Groups
              </h1>
              <p className="mt-2 text-gray-700">
                Connect with fellow students traveling on similar routes
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    setShowCreateForm(!showCreateForm);
                    setError(null);
                  } else {
                    navigate('/register');
                  }
                }}
                className="ridepool-btn ridepool-btn-primary"
              >
                {isAuthenticated ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Group
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Sign Up
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-slideInLeft">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {/* Groups List */}
        <div className="ridepool-card p-6 animate-fadeIn">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Available Groups
          </h2>
          
          {groups.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Ready to start sharing rides?</h3>
              <p className="mt-2 text-base text-gray-500">
                Create your first group to connect with fellow students traveling on similar routes.
              </p>
              <div className="mt-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1 ml-4">
                        <button 
                          onClick={() => {
                            if (isAuthenticated) {
                              setShowCreateForm(true);
                            } else {
                              navigate('/register');
                            }
                          }}
                          className="focus:outline-none"
                        >
                          <span className="absolute inset-0" aria-hidden="true" />
                          <p className="text-sm font-medium text-gray-900">Create New Group</p>
                          <p className="text-sm text-gray-500">Start a new ride sharing group</p>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1 ml-4">
                        <button 
                          onClick={() => navigate('/find-pool')}
                          className="focus:outline-none"
                        >
                          <span className="absolute inset-0" aria-hidden="true" />
                          <p className="text-sm font-medium text-gray-900">Find Groups</p>
                          <p className="text-sm text-gray-500">Search for existing groups</p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {!isAuthenticated && (
                  <div className="mt-8">
                    <p className="text-sm text-gray-500">
                      Already have an account?{' '}
                      <button 
                        onClick={() => navigate('/login')}
                        className="font-medium text-purple-600 hover:text-purple-500"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <div 
                  key={group._id} 
                  className="ridepool-card p-5 cursor-pointer animate-slideInLeft"
                  onClick={() => goToGroupDetail(group._id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{group.groupName}</h3>
                    <span className={`ridepool-badge ${
                      group.status === 'Open' ? 'bg-green-100 text-green-800' :
                      group.status === 'Locked' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {group.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="line-clamp-1">{group.route.pickup.address}</span>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="line-clamp-1">{group.route.drop.address}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {new Date(group.dateTime).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      {group.members.length}/{group.seatCount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupsPage;