// frontend/client/components/DebugLangflow.tsx
// test Langflow connection

import React, { useState } from 'react';
import { testBackendConnection, checkBackendHealth } from '../api/client';

export default function DebugLangflow() {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState<boolean | null>(null);

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      const result = await testBackendConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({ success: false, error: error.message });
    }
    setIsLoading(false);
  };

  const handleHealthCheck = async () => {
    const health = await checkBackendHealth();
    setHealthStatus(health);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Langflow Debug Panel</h2>
      
      {/* Health Check */}
      <div className="mb-6">
        <button 
          onClick={handleHealthCheck}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Check Langflow Health
        </button>
        {healthStatus !== null && (
          <div className={`mt-2 p-2 rounded ${healthStatus ? 'bg-green-100' : 'bg-red-100'}`}>
            Status: {healthStatus ? '✅ Healthy' : '❌ Unhealthy'}
          </div>
        )}
      </div>

      {/* Connection Test */}
      <div className="mb-6">
        <button 
          onClick={handleTestConnection}
          disabled={isLoading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Langflow Connection'}
        </button>
      </div>

      {/* Results */}
      {testResult && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Test Results:</h3>
          <div className={`p-4 rounded-lg ${testResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="mb-2">
              <strong>Success:</strong> {testResult.success ? '✅ Yes' : '❌ No'}
            </div>
            {testResult.error && (
              <div className="mb-2">
                <strong>Error:</strong> <code className="bg-gray-100 p-1 rounded">{testResult.error}</code>
              </div>
            )}
            {testResult.response && (
              <div>
                <strong>Response:</strong>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                  {typeof testResult.response === 'string' 
                    ? testResult.response 
                    : JSON.stringify(testResult.response, null, 2)
                  }
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Configuration Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Current Configuration:</h3>
        <div className="text-sm space-y-1">
          <div><strong>Langflow URL:</strong> https://host-langflow-hhqneq.fly.dev</div>
          <div><strong>Flow ID:</strong> 24d4d254-05c4-49f2-bd0d-030d51aeca63</div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-2">Setup Instructions:</h3>
        <ol className="text-sm space-y-1 list-decimal list-inside">
          <li>Create your flow in Langflow with: Chat Input → Anthropic → Chat Output</li>
          <li>Save the flow and copy the Flow ID from the URL</li>
          <li>Add your Flow ID to .env.local as NEXT_PUBLIC_LANGFLOW_FLOW_ID</li>
          <li>Test the connection using the button above</li>
        </ol>
      </div>
    </div>
  );
}