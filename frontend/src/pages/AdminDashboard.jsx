import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [zones, setZones] = useState([]);
  const [types, setTypes] = useState([]);
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const zonesRes = await api.get('/analytics/zone-waste').catch(() => ({ data: [] }));
      const typesRes = await api.get('/analytics/type-waste').catch(() => ({ data: [] }));
      const usersRes = await api.get('/users').catch(() => ({ data: [] }));
      
      setZones(zonesRes.data);
      setTypes(typesRes.data);
      setUsersList(usersRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Logout</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Total Waste by Zone (kg)</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={zones}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="zoneName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalWaste" fill="#3b82f6" name="Total Waste" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Waste Breakdown by Type</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={types}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="totalWaste"
                    nameKey="wasteType"
                  >
                    {types.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Zone Alerts</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Zone Name</th>
                  <th className="py-2">Total Waste (kg)</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((zone, idx) => (
                  <tr key={idx} className={`border-b ${zone.totalWaste > 15 ? 'bg-red-50' : ''}`}>
                    <td className="py-3 px-2 font-semibold">{zone.zoneName}</td>
                    <td className="py-3 px-2">{Number(zone.totalWaste).toFixed(2)}</td>
                    <td className="py-3 px-2">
                      {zone.totalWaste > 15 ? (
                        <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold">High Waste Alert</span>
                      ) : (
                        <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-bold">Normal</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Registered Users & Organizations</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="py-3 px-4 font-bold text-gray-700">Name</th>
                  <th className="py-3 px-4 font-bold text-gray-700">Email</th>
                  <th className="py-3 px-4 font-bold text-gray-700">City / Zone</th>
                  <th className="py-3 px-4 font-bold text-gray-700">Account Type</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((usr) => (
                  <tr key={usr.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-800">{usr.name} {usr.role === 'ADMIN' && <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Admin</span>}</td>
                    <td className="py-3 px-4 text-gray-600">{usr.email}</td>
                    <td className="py-3 px-4"><span className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-700">{usr.cityZone}</span></td>
                    <td className="py-3 px-4 text-gray-700">
                      {usr.userType === 'SCHOOL' ? '🏫 School' : usr.userType === 'COMMERCIAL' ? '🏢 Commercial' : usr.userType === 'RESIDENTIAL' ? '🏠 Residential' : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
