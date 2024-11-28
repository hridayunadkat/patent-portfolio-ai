import React, { useState } from 'react';
import { Search, Filter, FileText, TrendingUp, Shield } from 'lucide-react';

// Mock data for patent search
const mockPatents = [
  {
    id: 'P001',
    title: 'Vaping Device with Removable Pouch',
    company: 'TechVape Inc.',
    filingDate: '2023-06-15',
    status: 'Active',
    relevanceScore: 85
  },
  {
    id: 'P002',
    title: 'Tobacco-Free Nicotine Delivery System',
    company: 'InnoNictech',
    filingDate: '2023-05-22',
    status: 'Pending',
    relevanceScore: 72
  },
  {
    id: 'P003',
    title: 'Advanced Heating Element for E-Cigarettes',
    company: 'SmartSmoke Technologies',
    filingDate: '2023-07-01',
    status: 'Active',
    relevanceScore: 65
  }
];

const PatentPortfolioTool = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    activeOnly: false,
    companyFilter: '',
    minRelevance: 0
  });
  const [selectedPatent, setSelectedPatent] = useState(null);

  const filteredPatents = mockPatents.filter(patent => 
    patent.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filters.activeOnly ? patent.status === 'Active' : true) &&
    (filters.companyFilter ? patent.company.includes(filters.companyFilter) : true) &&
    patent.relevanceScore >= filters.minRelevance
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-blue-800 flex items-center">
          <Shield className="mr-3 text-blue-600" /> Patent Portfolio AI</h1>
        <div className="flex space-x-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center">
            <TrendingUp className="mr-2" /> Insights
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center">
            <FileText className="mr-2" /> Generate Claim Chart
          </button>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2 flex items-center">
            <Search className="mr-2 text-blue-600" /> Patent Search
          </h3>
          <input 
            type="text" 
            placeholder="Search patents..."
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
              onChange={(e) => setFilters({...filters, companyFilter: e.target.value})}
            >
              <option value="">All Companies</option>
              <option value="TechVape">TechVape Inc.</option>
              <option value="InnoNictech">InnoNictech</option>
            </select>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                className="mr-2"
                checked={filters.activeOnly}
                onChange={(e) => setFilters({...filters, activeOnly: e.target.checked})}
              />
              <label>Active Patents Only</label>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2 flex items-center">
            <TrendingUp className="mr-2 text-blue-600" /> Relevance Score
          </h3>
          <input 
            type="range" 
            min="0" 
            max="100" 
            className="w-full"
            value={filters.minRelevance}
            onChange={(e) => setFilters({...filters, minRelevance: Number(e.target.value)})}
          />
          <div className="text-center">Min Relevance: {filters.minRelevance}</div>
        </div>
      </div>

      <div className="bg-white shadow rounded">
        <table className="w-full">
          <thead className="bg-blue-50">
            <tr>
              <th className="p-3 text-left">Patent ID</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-left">Filing Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Relevance</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatents.map(patent => (
              <tr 
                key={patent.id} 
                className="hover:bg-blue-100 cursor-pointer"
                onClick={() => setSelectedPatent(patent)}
              >
                <td className="p-3">{patent.id}</td>
                <td className="p-3">{patent.title}</td>
                <td className="p-3">{patent.company}</td>
                <td className="p-3">{patent.filingDate}</td>
                <td className="p-3">
                  <span className={`
                    px-2 py-1 rounded text-xs 
                    ${patent.status === 'Active' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}
                  `}>
                    {patent.status}
                  </span>
                </td>
                <td className="p-3">{patent.relevanceScore}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPatent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Patent Details</h2>
            <p><strong>ID:</strong> {selectedPatent.id}</p>
            <p><strong>Title:</strong> {selectedPatent.title}</p>
            <p><strong>Company:</strong> {selectedPatent.company}</p>
            <p><strong>Filing Date:</strong> {selectedPatent.filingDate}</p>
            <p><strong>Status:</strong> {selectedPatent.status}</p>
            <p><strong>Relevance Score:</strong> {selectedPatent.relevanceScore}%</p>
            <button 
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => setSelectedPatent(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatentPortfolioTool;