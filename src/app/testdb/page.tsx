"use client";

import { useEffect, useState } from 'react';

export default function DbTestPage() {
  const [data, setData] = useState<any[]>([]);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // fetch data from database
  useEffect(() => {
    fetchData();
  }, []);

  // API call to get data from database
  const fetchData = async () => {
    try {
      const response = await fetch('/api/getData');
      if (response.ok) {
        const result = await response.json();
        setData(result.data);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // add new data to database
  const addData = async () => {
    try {
      const response = await fetch('/api/postData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          description: newDescription,
        }),
      });

      if (response.ok) {
        console.log('Data added successfully');
        fetchData(); // refresh data after adding entry
        setNewName(''); // reset input
        setNewDescription('');
      } else {
        console.error('Failed to add data');
      }
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  return (
    <main className="flex flex-col items-center w-screen h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Database Test Page</h1>

      <div className="mb-4">
        <h2 className="text-xl">Add New Entry</h2>
        <input
          type="text"
          placeholder="Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={addData} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>

      <div>
        <h2 className="text-xl mb-2">Database Entries</h2>
        {data.length > 0 ? (
          <ul className="list-disc">
            {data.map((item, index) => (
              <li key={index} className="p-2">
                <strong>Name:</strong> {item.name} | <strong>Description:</strong> {item.description}
              </li>
            ))}
          </ul>
        ) : (
          <p>No data found</p>
        )}
      </div>
    </main>
  );
}
