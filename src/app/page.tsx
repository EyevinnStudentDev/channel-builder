"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      router.push('/auth');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput) {
      Cookies.set('authToken', tokenInput); // Simulate setting token on login
      setIsLoggedIn(true);
      setTokenInput(''); // Clear input field
      router.refresh(); // Refresh to reflect login state change
    }
  };

  const handleLogout = () => {
    Cookies.remove('authToken');
    setIsLoggedIn(false);
    router.push('/auth');
  };

  return (
    <main className="relative flex justify-center items-center w-screen h-screen">
      {!isLoggedIn ? (
        <div className="absolute top-0 right-0 p-4">
          <form onSubmit={handleLogin} className="flex flex-col items-center gap-2">
            <input
              type="text"
              placeholder="Enter token"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
            <button
              type="submit"
              className="btn btn-primary w-full max-w-xs"
            >
              Log in
            </button>
          </form>
        </div>
      ) : (
        <div className="absolute top-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className="btn btn-error w-full max-w-xs"
          >
            Log out
          </button>
        </div>
      )}

      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">Welcome to SDVT's Channel Viewer</h1>
        <p className="mb-4">Click below to view channels</p>
        <Link href="/channels" className="btn btn-primary">
          View all Channels
        </Link>

        {isLoggedIn && (
          <>
            <p className="my-4">Click below to create a channel</p>
            <Link href="/create" className="btn btn-secondary">
              Create Channel
            </Link>
          </>
        )}

        {isLoggedIn && (
          <>
            <p className="my-4">Handle playlists </p>
            <Link href="/managePlaylists" className="btn btn-accent">
              Manage playlists
            </Link>
          </>
        )}
        
        {isLoggedIn && (
  <>
    <p className="my-4">Update Playlists</p>
    <Link href="/manage" className="btn btn-info">
      Update Playlists
    </Link>
  </>
)}

      </div>
    </main>
  );
}
