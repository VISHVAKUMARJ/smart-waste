import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [logs, setLogs] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [tip, setTip] = useState('');
  
  const [formData, setFormData] = useState({ wasteType: 'WET', quantityKg: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [logsRes, leaderRes] = await Promise.all([
        api.get('/waste-logs/me'),
        api.get('/analytics/leaderboard')
      ]);
      setLogs(logsRes.data);
      setLeaderboard(leaderRes.data);

      if (logsRes.data.length > 0) {
        const lastLog = logsRes.data[logsRes.data.length - 1];
        fetchTip(lastLog.wasteType);
      } else {
        fetchTip('WET');
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const fetchTip = async (type) => {
    try {
      const { data } = await api.get(`/tips/${type}`);
      setTip(data[0] || 'Reduce, reuse, recycle!');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/waste-logs', { ...formData, quantityKg: parseFloat(formData.quantityKg) });
      setFormData({ wasteType: 'WET', quantityKg: '' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const getRank = () => {
    const index = leaderboard.findIndex(entry => entry.householdId === user.householdId);
    return index !== -1 ? index + 1 : 'N/A';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {user.name}</h1>
          <div className="flex gap-4">
            <Link to="/leaderboard" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">View Leaderboard</Link>
            <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Logout</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Your Rank</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">#{getRank()}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500 md:col-span-2">
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Recycling Tip</h3>
            <p className="text-lg text-gray-700 mt-2 italic">"{tip}"</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Log Waste</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Waste Type</label>
                <select 
                  className="w-full p-2 border rounded" 
                  value={formData.wasteType} 
                  onChange={e => setFormData({...formData, wasteType: e.target.value})}
                >
                  <option value="WET">Wet</option>
                  <option value="DRY">Dry</option>
                  <option value="E_WASTE">E-Waste</option>
                  <option value="HAZARDOUS">Hazardous</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Quantity (kg)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0"
                  className="w-full p-2 border rounded" 
                  value={formData.quantityKg} 
                  onChange={e => setFormData({...formData, quantityKg: e.target.value})} 
                  required 
                />
              </div>
              <button type="submit" className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600">
                Log Entry
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
            <h2 className="text-xl font-bold mb-4">Past Entries</h2>
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs yet. Start tracking your waste!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2">Date</th>
                      <th className="py-2">Type</th>
                      <th className="py-2">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.slice().reverse().map(log => (
                      <tr key={log.id} className="border-b border-gray-100">
                        <td className="py-3">{new Date(log.loggedAt).toLocaleDateString()}</td>
                        <td className="py-3">
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">{log.wasteType}</span>
                        </td>
                        <td className="py-3">{log.quantityKg} kg</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
