"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Check if token is present
    if (token) {
      setIsLoggedIn(true); // If token exists, user is logged in
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove the token from localStorage
    setIsLoggedIn(false); // Update login state
  };

  return (
    <main className="relative flex justify-center items-center w-screen h-screen">

      {!isLoggedIn ? (
        <div className="absolute top-0 right-0 p-4">
          <Link href="/auth" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded duration-150">
            Log in
          </Link>
        </div>
      ) : (
        <div className="absolute top-0 right-0 p-4">
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded duration-150"
          >
            Log out
          </button>
        </div>
      )}

      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to *INSERT NAME*</h1>
        <p className="mb-4">Click below to view channels</p>
        <Link href="/channels" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded duration-150">
          View Channels
        </Link>

        {isLoggedIn && (
          <>
            <p className="my-4">Click below to create a channel</p>
            <Link href="/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded duration-150">
              Create Channel
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
