import Link from 'next/link';

export default function Page() {
  return (
    <main className="flex justify-center items-center w-screen h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Channel Engine</h1>
        <p className="mb-4">Click below to create a channel</p>
        <Link
          href="/create"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded duration-150"
        >
          Create Channel
        </Link>
        <p className="my-4">Click below to view channels</p>
        <Link
          href="/channels"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded duration-150"
        >
          View Channels
        </Link>
        <p className="my-4">Click below to manage channels</p>
        <Link
          href="/manage"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded duration-150"
        >
          Manage Channels
        </Link>
      </div>
    </main>
  );
}
