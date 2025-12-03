import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface College {
  id: string;
  name: string;
  fullName: string;
  city: string;
  type: string;
}

const CollegeSelectorModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Updated list of colleges in Delhi/NCR as per your request
  const colleges: College[] = [
    { id: 'mait', name: 'MAIT', fullName: 'Maharaja Agrasen Institute of Technology', city: 'Delhi', type: 'Private' },
    { id: 'msit', name: 'MSIT', fullName: 'Maharaja Surajmal Institute of Technology', city: 'Delhi', type: 'Private' },
    { id: 'gtbit', name: 'GTBIT', fullName: 'Guru Tegh Bahadur Institute of Technology', city: 'Delhi', type: 'Private' },
    { id: 'adgips', name: 'ADGIPS', fullName: 'Akhilesh Das Gupta Institute of Technology & Management', city: 'Delhi', type: 'Private' },
    { id: 'nsut', name: 'NSUT', fullName: 'Netaji Subhas University of Technology', city: 'Delhi', type: 'State' },
    { id: 'dtu', name: 'DTU', fullName: 'Delhi Technological University', city: 'Delhi', type: 'State' },
    { id: 'iitd', name: 'IIT Delhi', fullName: 'Indian Institute of Technology Delhi', city: 'Delhi', type: 'IIT' },
    { id: 'iiitd', name: 'IIIT Delhi', fullName: 'Indraprastha Institute of Information Technology Delhi', city: 'Delhi', type: 'IIIT' },
    { id: 'bpit', name: 'BPIT', fullName: 'Bhagwan Parshuram Institute of Technology', city: 'Delhi', type: 'Private' },
    { id: 'igdtuw', name: 'IGDTUW', fullName: 'Indira Gandhi Delhi Technical University for Women', city: 'Delhi', type: 'State' },
    { id: 'du_north', name: 'DU North Campus', fullName: 'University of Delhi (North Campus)', city: 'Delhi', type: 'Central' },
    { id: 'du_south', name: 'DU South Campus', fullName: 'University of Delhi (South Campus)', city: 'Delhi', type: 'Central' },
    { id: 'usar', name: 'USAR', fullName: 'University School of Automation & Robotics', city: 'Delhi', type: 'State' },
    { id: 'usict', name: 'USICT', fullName: 'University School of Information, Communication & Technology', city: 'Delhi', type: 'State' },
  ];

  // Filter colleges based on search term
  const filteredColleges = colleges.filter(college => 
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCollege = (collegeId: string) => {
    // Navigate to groups page filtered by college
    navigate(`/groups?college=${collegeId}`);
    onClose();
  };

  // Group colleges by type for better organization
  const groupByType = (colleges: College[]) => {
    return colleges.reduce((groups: Record<string, College[]>, college) => {
      if (!groups[college.type]) {
        groups[college.type] = [];
      }
      groups[college.type].push(college);
      return groups;
    }, {});
  };

  const groupedColleges = groupByType(filteredColleges);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Select Your College</h2>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-purple-100 mt-2">Connect with students from your college to share rides and save money</p>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Search for your college..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* College List */}
        <div className="overflow-y-auto flex-grow p-6">
          {searchTerm ? (
            // Show filtered results
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Results</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredColleges.map((college) => (
                  <div 
                    key={college.id}
                    className="ridepool-card p-4 text-center cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    onClick={() => handleSelectCollege(college.id)}
                  >
                    <div className="mb-3">
                      <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-white font-bold">
                          {college.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-900">{college.name}</h4>
                    <p className="text-sm text-gray-600 truncate">{college.fullName}</p>
                    <p className="text-xs text-gray-500 mt-1">{college.city}</p>
                  </div>
                ))}
                
                {filteredColleges.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No colleges found</h3>
                    <p className="mt-1 text-gray-500">Try adjusting your search terms</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Show organized groups
            <div className="space-y-8">
              {Object.entries(groupedColleges).map(([type, colleges]) => (
                <div key={type}>
                  <div className="flex items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{type} Universities</h3>
                    <div className="ml-3 flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {colleges.length}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {colleges.map((college) => (
                      <div 
                        key={college.id}
                        className="ridepool-card p-4 text-center cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        onClick={() => handleSelectCollege(college.id)}
                      >
                        <div className="mb-3">
                          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <span className="text-white font-bold">
                              {college.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <h4 className="font-bold text-gray-900">{college.name}</h4>
                        <p className="text-sm text-gray-600 truncate">{college.fullName}</p>
                        <p className="text-xs text-gray-500 mt-1">{college.city}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Don't see your college? You can still join general groups or create your own!
            </p>
            <button 
              onClick={() => navigate('/groups')}
              className="ridepool-btn ridepool-btn-primary px-4 py-2 text-sm"
            >
              View All Groups
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeSelectorModal;