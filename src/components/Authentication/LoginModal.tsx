import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import homoligicLogo from '../../assets/homoligic.svg';

const LoginModal: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Invalid login credentials. Please try again.');
      console.error('Login error:', error.message);
    } else {
      console.log('Login successful');
      navigate('/'); // Redirect to the dashboard on successful login
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-80 flex items-center justify-center p-4">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="flex flex-col items-center">
            <div className="loader mb-4"></div>
            <p className="text-white text-lg">Logging in...</p>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
        <div className="text-center mb-6">
          <img src={homoligicLogo} alt="Homoligic Logo" className="mx-auto w-30 mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">Administration</h2>
          <p className="text-gray-500 mt-2">Logga in för att komma åt kontrollpanelen</p>
        </div>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 ${loading ? 'opacity-60' : ''}`}
        >
          {loading ? 'Loggar in...' : 'Logga in'}
        </button>
      </div>
    </div>
  );
};

export default LoginModal;



