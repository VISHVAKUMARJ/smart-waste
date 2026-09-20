import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data } = await api.get('/analytics/leaderboard');
      setLeaderboard(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Community Leaderboard</h1>
          <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Back to Dashboard</Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-left bg-gray-50 border-b">
                <th className="py-4 px-6 font-bold border-b">Rank</th>
                <th className="py-4 px-6 font-bold border-b">Name & Type</th>
                <th className="py-4 px-6 font-bold border-b">City / Zone</th>
                <th className="py-4 px-6 font-bold border-b text-right">Total Waste (kg)</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={entry.householdId || index} className={`border-b border-gray-100 hover:bg-gray-50 ${index < 3 ? 'bg-yellow-50' : ''}`}>
                  <td className="py-4 px-6 font-bold">
                    {index === 0 ? '🥇 1' : index === 1 ? '🥈 2' : index === 2 ? '🥉 3' : index + 1}
                  </td>
                  <td className="py-4 px-6 font-semibold">
                    {entry.householdName || entry.userName}
                    <div className="text-xs text-gray-500 font-normal mt-1">
                      {entry.userType === 'SCHOOL' ? '🏫 School' : entry.userType === 'COMMERCIAL' ? '🏢 Commercial' : '🏠 Residential'}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">{entry.cityZone}</span>
                  </td>
                  <td className="py-4 px-6 text-gray-800 text-right">{entry.totalWasteKg.toFixed(2)} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
          {leaderboard.length === 0 && (
            <div className="p-6 text-center text-gray-500">No data available yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
