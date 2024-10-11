"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Create a router instance

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login validation
    if (username === 'admin' && password === 'password') {
      localStorage.setItem('authToken', 'yourToken'); // Set a token in localStorage
      router.push('/'); // Redirect to homepage after successful login
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <main className="relative flex justify-center items-center w-screen h-screen">
      <div className="absolute top-0 right-0 p-4">
        <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded duration-150">
          Back to Home
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-3xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              className="mt-1 p-2 border border-gray-300 rounded w-full bg-gray-100"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 border border-gray-300 rounded w-full bg-gray-100"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full duration-150">
            Log in
          </button>
        </form>
      </div>
    </main>
  );
}
