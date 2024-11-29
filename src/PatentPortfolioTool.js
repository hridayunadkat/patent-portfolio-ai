import React, { useState } from 'react';
import { Search, Filter, FileText, TrendingUp, Shield, List, User } from 'lucide-react';

// Mock data for aerospace patent search
const mockPatents = [
  {
    id: 'A001',
    title: 'Advanced Wing Design for Supersonic Aircraft',
    company: 'AeroDynamics Corp.',
    filingDate: '2023-03-10',
    status: 'Active',
    relevanceScore: 92,
  },
  {
    id: 'A002',
    title: 'Reusable Rocket Propulsion System',
    company: 'SpaceInnovations Inc.',
    filingDate: '2023-01-15',
    status: 'Pending',
    relevanceScore: 88,
  },
  {
    id: 'A003',
    title: 'Lightweight Composite Material for Spacecraft',
    company: 'AstroMaterials Ltd.',
    filingDate: '2023-04-05',
    status: 'Active',
    relevanceScore: 75,
  },
];

const PatentPortfolioTool = () => {
  const [users, setUsers] = useState([]); // Store user data
  const [currentUser, setCurrentUser] = useState(null); // Track logged-in user
  const [authForm, setAuthForm] = useState({ username: '', password: '' }); // Form inputs
  const [isLoginMode, setIsLoginMode] = useState(true); // Switch between login/register modes
  const [error, setError] = useState(''); // Display authentication errors

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    activeOnly: false,
    companyFilter: '',
    minRelevance: 0,
  });
  const [uploadedPatents, setUploadedPatents] = useState([]); // Store uploaded patents in Patent Log
  const [showPatentLog, setShowPatentLog] = useState(false);

  const handleAuth = () => {
    const { username, password } = authForm;

    if (isLoginMode) {
      // Login logic
      const user = users.find((u) => u.username === username && u.password === password);
      if (user) {
        setCurrentUser(user);
        setError('');
      } else {
        setError('Invalid username or password.');
      }
    } else {
      // Register logic
      if (users.find((u) => u.username === username)) {
        setError('Username already exists.');
      } else {
        setUsers([...users, { username, password }]);
        setError('');
        setIsLoginMode(true); // Switch to login mode after registration
      }
    }
  };

  // Modified handleGeneratePatent to only add the patent to the Patent Log
  const handleGeneratePatent = () => {
    const newPatent = {
      id: `U${uploadedPatents.length + 1}`,
      title: `User Generated Patent ${uploadedPatents.length + 1}`,
      company: currentUser.username,
      filingDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      relevanceScore: Math.floor(Math.random() * 100),
    };
    setUploadedPatents([...uploadedPatents, newPatent]); // Add to Patent Log only
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-xl font-bold text-center mb-4">{isLoginMode ? 'Login' : 'Register'}</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 border rounded"
            value={authForm.username}
            onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={authForm.password}
            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleAuth}
          >
            {isLoginMode ? 'Login' : 'Register'}
          </button>
          <button
            className="w-full text-blue-500 underline"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError('');
            }}
          >
            {isLoginMode ? "Don't have an account? Register" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    );
  }

  const filteredPatents = mockPatents.filter(
    (patent) =>
      patent.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.activeOnly ? patent.status === 'Active' : true) &&
      (filters.companyFilter ? patent.company.includes(filters.companyFilter) : true) &&
      patent.relevanceScore >= filters.minRelevance
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-blue-800 flex items-center">
          <Shield className="mr-3 text-blue-600" /> Aerospace Patent Portfolio
        </h1>
        <div className="flex space-x-2 items-center">
          <span>Welcome, {currentUser.username}!</span>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => setCurrentUser(null)}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex justify-between mb-4">
        <button
          className="bg-transparent text-gray-500 px-4 py-2 rounded hover:bg-gray-100 flex items-center"
          onClick={handleGeneratePatent} // Calls handleGeneratePatent to generate a patent
        >
          <FileText className="mr-2" /> Generate Patent
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
          onClick={() => setShowPatentLog(!showPatentLog)}
        >
          <List className="mr-2" /> Patent Log
        </button>
      </div>

      {showPatentLog && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h3 className="font-bold mb-2">Uploaded Patents:</h3>
          {uploadedPatents.length > 0 ? (
            <ul className="list-disc list-inside">
              {uploadedPatents.map((patent) => (
                <li key={patent.id}>
                  {patent.title} - {patent.filingDate}
                </li>
              ))}
            </ul>
          ) : (
            <p>No patents uploaded yet.</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2 flex items-center">
            <Search className="mr-2 text-blue-600" /> Patent Search
          </h3>
          <input
            type="text"
            placeholder="Search aerospace patents..."
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2 flex items-center">
            <Filter className="mr-2 text-blue-600" /> Filters
          </h3>
          <div className="space-y-2">
            <select
              className="w-full p-2 border rounded"
              value={filters.companyFilter}
              onChange={(e) =>
                setFilters({ ...filters, companyFilter: e.target.value })
              }
            >
              <option value="">All Companies</option>
              <option value="AeroDynamics">AeroDynamics Corp.</option>
              <option value="SpaceInnovations">SpaceInnovations Inc.</option>
              <option value="AstroMaterials">AstroMaterials Ltd.</option>
            </select>
            <div className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={filters.activeOnly}
                onChange={(e) =>
                  setFilters({ ...filters, activeOnly: e.target.checked })
                }
              />
              <label>Active Patents Only</label>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2 flex items-center">
            <TrendingUp className="mr-2 text-blue-600" /> Relevance Filter
          </h3>
          <input
            type="number"
            placeholder="Min Relevance"
            className="w-full p-2 border rounded"
            value={filters.minRelevance}
            onChange={(e) =>
              setFilters({ ...filters, minRelevance: e.target.value })
            }
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-xl mb-4">Patent List</h3>
        <table className="min-w-full border-collapse table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">Patent ID</th>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Company</th>
              <th className="border px-4 py-2">Filing Date</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Relevance</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatents.map((patent) => (
              <tr key={patent.id}>
                <td className="border px-4 py-2">{patent.id}</td>
                <td className="border px-4 py-2">{patent.title}</td>
                <td className="border px-4 py-2">{patent.company}</td>
                <td className="border px-4 py-2">{patent.filingDate}</td>
                <td className="border px-4 py-2">{patent.status}</td>
                <td className="border px-4 py-2">{patent.relevanceScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatentPortfolioTool;
