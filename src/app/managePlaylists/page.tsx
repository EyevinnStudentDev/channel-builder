"use client";

import { FormEvent, use, useEffect, useState } from 'react';

import Link from 'next/link';

export default function Home() {
  // Mock data representing items
  const [items, setItems] = useState([
  ])
  
    const [channels, setChannels] = useState<Channel[]>([]);
  
    // get channels from OSAAS api
      useEffect(() => {
        const fetchChannels = async () => {
          try {
            const response = await fetch('/api/getChannels', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              cache: 'no-store', // disable cache
            });
    
            if (response.ok) {
              const data = await response.json();
              setChannels(data);
              console.log("SUCCESS:", data);
            } else {
              console.error('Failed to fetch channels:', response.statusText);
            }
          } catch (error) {
            console.error('Error fetching channels:', error);
          }
        };
        fetchChannels();
      }, []);
  ;

  interface Channel {
    id: string;
    name: string;
    type: string;
    url: string;
  }
  
  // State to track selected items
  const [selectedItems, setSelectedItems] = useState(new Set());

  // Handle selection toggle
  const toggleSelect = (id: unknown) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  // Handle delete of selected items
  const deleteSelected = () => {
    //right now does nothing, API webhook needs to be added
  };

  return (
    <main className="flex flex-col items-center w-screen h-screen">
      <div className="absolute top-0 right-0 p-4">
        <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded duration-150">
          Back to Home
        </Link>
      </div>

      <div className="w-2/3 mt-20 p-8 bg-gradient-to-br from-blue-200 to-blue-400 rounded-lg shadow-lg text-center">
        <h1 className="text-white text-4xl font-bold mb-6 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] underline">
          Admin Panel
        </h1>

        {/* Item List */}
        <ul className="mb-6 space-y-4">
          {channels.map((channel) => (
            <li key={channel.id} className="flex items-center justify-between p-4 bg-white/90 rounded shadow-md">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedItems.has(channel.id)}
                  onChange={() => toggleSelect(channel.id)}
                  className="h-5 w-5 text-blue-500 focus:ring-blue-300"
                />
                <span className="text-gray-700 font-semibold">{channel.id}</span>
              </label>
            </li>
          ))}
        </ul>

        {/* Delete Button */}
        <button
          onClick={deleteSelected}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200"
          disabled={selectedItems.size === 0}
        >
          Delete Selected
        </button>
      </div>
    </main>
  );
}
