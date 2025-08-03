import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import img005 from './../assets/karafuu5.jpg';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL?.endsWith('/')
  ? process.env.REACT_APP_API_BASE_URL
  : process.env.REACT_APP_API_BASE_URL + '/';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

 const handleSubmit = async (event) => {
  event.preventDefault();
  setError('');

  try {
    const response = await axios.post(`${apiBaseUrl}customUser/me/`, {
      username,
      password,
    });

    const { access, refresh, role } = response.data;

    // Decode JWT token to check expiry and extract user ID
    const payload = JSON.parse(atob(access.split('.')[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      setError('Token expired. Please login again.');
      return;
    }

    // ✅ Save to localStorage
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('role', role);
    localStorage.setItem('username', username);
    localStorage.setItem('userId', payload.user_id); // ✅ Add this line

    console.log('Login successful', response.data);

    // Redirect based on role
    if (role === 'admin') {
      navigate('/main/admndash');
    } else if (['officer'].includes(role)) {
      navigate('/main/home');
    } else {
      setError('Unauthorized role');
      localStorage.clear();
    }

  } catch (err) {
    console.error('Login error', err);
    setError('Invalid username or password');
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-center mb-4">
          <img
            src={img005}
            alt="karafuu"
            className="w-24 h-24 rounded-full object-cover border-4 border-green-500 shadow-md"
          />
        </div>

        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block mb-1 font-medium text-gray-700">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium text-gray-700">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Login
          </button>

          <p className="text-center text-sm mt-4">
            Don't have an account?{' '}
            <Link to="/createAcc" className="text-green-600 hover:underline">Create Account</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
