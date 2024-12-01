import React, { useState } from 'react';
import { Search, Filter, FileText, TrendingUp, Shield, List } from 'lucide-react';

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
    status: 'Inactive',
    relevanceScore: 75,
  },
];

const PatentPortfolioTool = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    activeOnly: false,
    companyFilter: '',
    minRelevance: 0,
  });
  const [uploadedPatents, setUploadedPatents] = useState([]);
  const [showPatentLog, setShowPatentLog] = useState(false);

  const [showPopup, setShowPopup] = useState(false); // Popup visibility
  const [newPatent, setNewPatent] = useState({
    title: '',
    company: '',
    filingDate: '',
    description: '',
  });

  const handleAuth = () => {
    const { username, password } = authForm;
    if (isLoginMode) {
      const user = users.find((u) => u.username === username && u.password === password);
      if (user) {
        setCurrentUser(user);
        setError('');
      } else {
        setError('Invalid username or password.');
      }
    } else {
      if (users.find((u) => u.username === username)) {
        setError('Username already exists.');
      } else {
        setUsers([...users, { username, password }]);
        setError('');
        setIsLoginMode(true);
      }
    }
  };

  const handleGeneratePatent = () => {
    setShowPopup(true); // Open popup
  };

  const handlePopupSubmit = () => {
    if (!newPatent.title || !newPatent.company || !newPatent.filingDate || !newPatent.description) {
      alert('Please fill in all fields.');
      return;
    }

    const newPatentEntry = {
      id: `U${uploadedPatents.length + 1}`,
      title: newPatent.title,
      company: newPatent.company,
      filingDate: newPatent.filingDate,
      status: 'Pending',
      relevanceScore: Math.floor(Math.random() * 100),
    };

    setUploadedPatents([...uploadedPatents, newPatentEntry]);
    setNewPatent({ title: '', company: '', filingDate: '', description: '' }); // Reset form
    setShowPopup(false); // Close popup
  };

  const handlePopupClose = () => {
    setNewPatent({ title: '', company: '', filingDate: '', description: '' });
    setShowPopup(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500';
      case 'Pending':
        return 'bg-yellow-500';
      case 'Inactive':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredPatents = mockPatents.filter(
    (patent) =>
      patent.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.activeOnly ? patent.status === 'Active' : true) &&
      (filters.companyFilter ? patent.company.includes(filters.companyFilter) : true) &&
      patent.relevanceScore >= filters.minRelevance
  );

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

  return (
    <div>
      <div className={`${showPopup ? 'blur-md' : ''} max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl`}>
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
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
            onClick={handleGeneratePatent}
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

        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Patent ID</th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Company</th>
              <th className="px-4 py-2 text-left">Filing Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Relevance Score</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatents.map((patent) => (
              <tr key={patent.id}>
                <td className="border px-4 py-2">{patent.id}</td>
                <td className="border px-4 py-2">{patent.title}</td>
                <td className="border px-4 py-2">{patent.company}</td>
                <td className="border px-4 py-2">{patent.filingDate}</td>
                <td className="border px-4 py-2">
                  <span
                    className={`text-white rounded-full text-sm ${getStatusColor(patent.status)}`}
                  >
                    {patent.status}
                  </span>
                </td>
                <td className="border px-4 py-2">{patent.relevanceScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup Form */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Add New Patent</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                className="w-full p-2 border rounded"
                value={newPatent.title}
                onChange={(e) => setNewPatent({ ...newPatent, title: e.target.value })}
              />
              <input
                type="text"
                placeholder="Company"
                className="w-full p-2 border rounded"
                value={newPatent.company}
                onChange={(e) => setNewPatent({ ...newPatent, company: e.target.value })}
              />
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={newPatent.filingDate}
                onChange={(e) => setNewPatent({ ...newPatent, filingDate: e.target.value })}
              />
              <textarea
                placeholder="Description"
                className="w-full p-2 border rounded"
                value={newPatent.description}
                onChange={(e) => setNewPatent({ ...newPatent, description: e.target.value })}
              />
              <div className="flex justify-between">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={handlePopupSubmit}
                >
                  Submit
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  onClick={handlePopupClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatentPortfolioTool;
