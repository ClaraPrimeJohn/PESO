import { useState } from 'react';
import { useActivity } from './ActivityContext';

const GodView = () => {
  const [filter, setFilter] = useState('all');
  const { logs } = useActivity();

  const getActivityColor = (activity) => {
    const colors = {
      'API Request': 'bg-blue-50 border-blue-200',
      'API Response': 'bg-green-50 border-green-200',
      'API Error': 'bg-red-50 border-red-200',
      'Page View': 'bg-purple-50 border-purple-200',
      'Authentication': 'bg-yellow-50 border-yellow-200',
      'Error': 'bg-red-100 border-red-300'
    };
    return colors[activity] || 'bg-gray-50 border-gray-200';
  };

  const filterLogs = (log) => {
    if (filter === 'all') return true;
    return log.type.toLowerCase().includes(filter.toLowerCase());
  };

  const formatLogDetails = (details) => {
    if (typeof details === 'object') {
      return Object.entries(details)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join('\n');
    }
    return details;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-mono">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border-2 border-gray-300 rounded p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b-2 border-gray-200">
            <div>
              <h1 className="text-xl font-bold text-gray-800">SYSTEM ACTIVITY MONITOR</h1>
              <p className="text-sm text-gray-600 mt-1">Real-time user activity tracking</p>
            </div>
            
            {/* Filter */}
            <select
              className="px-3 py-2 bg-gray-100 border-2 border-gray-300 rounded font-mono text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">ALL ACTIVITIES</option>
              <option value="api">API CALLS</option>
              <option value="page">PAGE VIEWS</option>
              <option value="auth">AUTH EVENTS</option>
              <option value="error">ERRORS</option>
            </select>
          </div>

          {/* Logs */}
          <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
            {logs.filter(filterLogs).map((log) => (
              <div
                key={log.id}
                className={`p-3 rounded border-2 ${getActivityColor(log.type)}`}
              >
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="font-bold">{log.type}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <pre className="text-xs bg-white p-2 rounded whitespace-pre-wrap border border-gray-200">
                  {formatLogDetails(log.details)}
                </pre>
              </div>
            ))}

            {logs.length === 0 && (
              <div className="text-center py-10 text-gray-500 border-2 border-dashed border-gray-300 rounded">
                NO ACTIVITY LOGS YET
                <br />
                <span className="text-xs">Start interacting with the application to see logs</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t-2 border-gray-200 text-xs text-gray-500">
            Showing {logs.filter(filterLogs).length} activities
          </div>
        </div>
      </div>
    </div>
  );
};

export default GodView;