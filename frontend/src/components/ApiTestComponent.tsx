import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApiTestComponent: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testApiConnection();
  }, []);

  const testApiConnection = async () => {
    try {
      setStatus('Testing API connection...');
      setError(null);
      
      // Test the base API endpoint
      const healthResponse = await axios.get('/api/health');
      setResponse(healthResponse.data);
      setStatus('API connection successful!');
    } catch (err: any) {
      setError(`API connection failed: ${err.message}`);
      setStatus('API connection failed');
      console.error('API Test Error:', err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">API Connection Test</h2>
      <div className="mb-4">
        <p className="text-lg">
          <span className="font-semibold">Status:</span> {status}
        </p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}
      
      {response && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          <h3 className="font-semibold">API Response:</h3>
          <pre className="mt-2 text-sm overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
      
      <button
        onClick={testApiConnection}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Retest Connection
      </button>
    </div>
  );
};

export default ApiTestComponent;