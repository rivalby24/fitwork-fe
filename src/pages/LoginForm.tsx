import React, { useState } from 'react';
import Footer from '@/components/Footer';
function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md">
          {isLogin ? (
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Login to FitWork</h2>
              <div className="mb-4">
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-300"
              >
                Login
              </button>
              <div className="text-center mt-4">
                <a href="#" className="text-sm text-gray-600 hover:underline">Forgot password?</a>
              </div>
              <div className="text-center mt-4">
                <span className="text-sm text-gray-600">
                  Don't have an account?
                  <button
                    onClick={toggleAuthMode}
                    className="ml-1 text-blue-600 hover:underline"
                  >
                    Sign up
                  </button>
                </span>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Create Your FitWork Account</h2>
              <div className="mb-4">
                <label htmlFor="fullName" className="sr-only">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="signupEmail" className="sr-only">Email address</label>
                <input
                  type="email"
                  id="signupEmail"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="signupPassword" className="sr-only">Password</label>
                <input
                  type="password"
                  id="signupPassword"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-300"
              >
                Register
              </button>
              <div className="text-center mt-4">
                <span className="text-sm text-gray-600">
                  Already have an account?
                  <button
                    onClick={toggleAuthMode}
                    className="ml-1 text-blue-600 hover:underline"
                  >
                    Login
                  </button>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;