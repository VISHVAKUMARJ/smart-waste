import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cityZone, setCityZone] = useState('CHENNAI');
  const [userType, setUserType] = useState('RESIDENTIAL');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup({ name, email, password, cityZone, userType });
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Email might be in use.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name / Organization</label>
            <input className="w-full p-2 border rounded" required type="text" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input className="w-full p-2 border rounded" required type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">City / Zone</label>
            <select className="w-full p-2 border rounded" value={cityZone} onChange={e => setCityZone(e.target.value)}>
              <option value="CHENNAI">Chennai</option>
              <option value="MUMBAI">Mumbai</option>
              <option value="DELHI">Delhi</option>
              <option value="BANGALORE">Bangalore</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Account Type</label>
            <select className="w-full p-2 border rounded" value={userType} onChange={e => setUserType(e.target.value)}>
              <option value="RESIDENTIAL">Residential (Household)</option>
              <option value="SCHOOL">School / Education</option>
              <option value="COMMERCIAL">Commercial / Business</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input className="w-full p-2 border rounded" required type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition">
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account? <Link to="/login" className="text-green-500 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
