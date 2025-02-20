'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Button, Input, Card, CardBody, CardFooter } from '@nextui-org/react';

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
    <main className="relative flex justify-center items-center w-screen h-screen bg-background">
      {!isLoggedIn ? (
        <div className="absolute top-0 right-0 p-4">
          <Card>
            <CardBody>
              <form onSubmit={handleLogin} className="flex flex-col gap-3">
                <Input
                  type="text"
                  label="Enter Token"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  isRequired
                  className="w-64"
                />
                <Button type="submit" color="primary" fullWidth>
                  Log in
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
      ) : (
        <div className="absolute top-0 right-0 p-4">
          <Button onClick={handleLogout} color="danger" fullWidth>
            Log out
          </Button>
        </div>
      )}

      <div className="text-center px-6">
        <h1 className="text-4xl font-bold mb-6">
          Welcome to SDVTs Channel Viewer
        </h1>
        {isLoggedIn && (
          <>
            <p className="mb-4 text-lg">Click below to view channels</p>
            <Link href="/channels">
              <Button color="primary">View all Channels</Button>
            </Link>
          </>
        )}

        {isLoggedIn && (
          <>
            <p className="my-4 text-lg">Click below to create a channel</p>
            <Link href="/create">
              <Button color="secondary">Create Channel</Button>
            </Link>
          </>
        )}

        {isLoggedIn && (
          <>
            <p className="my-4 text-lg">Update Playlists</p>
            <Link href="/manage">
              <Button color="success">Update Playlists</Button>
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
