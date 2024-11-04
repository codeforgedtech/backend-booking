import React from 'react';

const LoginModal: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <input type="email" placeholder="Email" className="border p-2 w-full mb-4 rounded-md" />
        <input type="password" placeholder="Password" className="border p-2 w-full mb-4 rounded-md" />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Log In</button>
      </div>
    </div>
  );
};

export default LoginModal;