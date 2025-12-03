import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CollegeSelector: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
  
  // List of colleges in Delhi/NCR
  const colleges = [
    { id: 'mait', name: 'MAIT', fullName: 'Maharaja Agrasen Institute of Technology' },
    { id: 'msit', name: 'MSIT', fullName: 'Maharaja Surajmal Institute of Technology' },
    { id: 'gtbit', name: 'GTBIT', fullName: 'Guru Tegh Bahadur Institute of Technology' },
    { id: 'adgips', name: 'ADGIPS', fullName: 'Akhilesh Das Gupta Institute of Technology & Management' },
    { id: 'nsut', name: 'NSUT', fullName: 'Netaji Subhas University of Technology' },
    { id: 'igdtuw', name: 'IGDTUW', fullName: 'Indira Gandhi Delhi Technical University for Women' },
    { id: 'dtu', name: 'DTU', fullName: 'Delhi Technological University' },
    { id: 'iitd', name: 'IIT Delhi', fullName: 'Indian Institute of Technology Delhi' },
    { id: 'iiitd', name: 'IIIT Delhi', fullName: 'Indraprastha Institute of Information Technology Delhi' },
    { id: 'hmritm', name: 'HMRITM', fullName: 'HMR Institute of Technology & Management' },
    { id: 'iitm', name: 'IITM', fullName: 'Institute of Innovation in Technology and Management' },
    { id: 'duc', name: 'DU Campuses', fullName: 'University of Delhi (North & South Campus)' },
    { id: 'usict', name: 'USICT', fullName: 'University School of Information, Communication & Technology' },
    { id: 'usar', name: 'USAR', fullName: 'University School of Automation & Robotics' },
    { id: 'bpit', name: 'BPIT', fullName: 'Bhagwan Parshuram Institute of Technology' },
    { id: 'bvcoe', name: 'BVCOE', fullName: 'Bharati Vidyapeeth College of Engineering' },
    { id: 'others', name: 'Others', fullName: 'Other Colleges' }
  ];

  const handleSelectCollege = (collegeId: string) => {
    setSelectedCollege(collegeId);
    // Navigate to groups page filtered by college
    navigate(`/groups?college=${collegeId}`);
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-pink-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Your College Community
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Connect with fellow students from your college to share rides, save money, and reduce your carbon footprint
          </p>
        </div>

        {/* College Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {colleges.map((college) => (
            <div 
              key={college.id}
              className={`ridepool-card p-6 text-center cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                selectedCollege === college.id 
                  ? 'ring-2 ring-pink-500 bg-pink-50' 
                  : 'hover:shadow-lg'
              }`}
              onClick={() => handleSelectCollege(college.id)}
            >
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {college.name.charAt(0)}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{college.name}</h3>
              <p className="text-sm text-gray-600">{college.fullName}</p>
              
              {selectedCollege === college.id && (
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Selected
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 ridepool-card p-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
              <div className="bg-gradient-to-br from-pink-500 to-purple-500 rounded-full p-6">
                <svg className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="md:w-2/3 md:pl-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Join Your College Group?</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Connect with classmates and batchmates for safer rides</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Reduce travel costs by sharing rides with familiar faces</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Contribute to sustainability by reducing carbon emissions</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Build lasting friendships and professional networks</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Don't see your college?</h3>
          <p className="text-gray-700 mb-6">Select "Others" to join a general community or suggest your college to be added</p>
          <button 
            onClick={() => handleSelectCollege('others')}
            className="ridepool-btn ridepool-btn-primary px-6 py-3 text-lg"
          >
            Explore All Communities
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollegeSelector;