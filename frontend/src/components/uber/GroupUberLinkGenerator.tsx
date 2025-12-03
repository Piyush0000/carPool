import React, { useState } from 'react';

interface GroupUberLinkGeneratorProps {
  groupId: string;
}

const GroupUberLinkGenerator: React.FC<GroupUberLinkGeneratorProps> = ({ groupId }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://rideshare.example.com/join/${groupId}`)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  // In a real implementation, this would generate a proper Uber link
  // For now, we're using a placeholder
  const uberLink = `https://rideshare.example.com/join/${groupId}`;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Share Your Ride</h3>
      <p className="text-gray-600 mb-4">
        Share this link with your group members to invite them to join your ride:
      </p>
      
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={uberLink}
          readOnly
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleCopy}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
        >
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      
      {isCopied && (
        <div className="text-green-500 font-medium">
          Link copied to clipboard!
        </div>
      )}
      
      <div className="mt-6">
        <h4 className="font-medium mb-2">How it works:</h4>
        <ol className="list-decimal list-inside text-gray-600 space-y-1">
          <li>Copy the link above</li>
          <li>Share it with your group members</li>
          <li>They can join your ride by clicking the link</li>
          <li>Coordinate pickup details in the group chat</li>
        </ol>
      </div>
    </div>
  );
};

export default GroupUberLinkGenerator;