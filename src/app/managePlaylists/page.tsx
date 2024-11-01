"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Channel {
    id: string;
    name: string;
    type: string;
    url: string;
}

interface DeleteResponse {
    message?: string;
    error?: string;
    details?: string;
}

export default function Home() {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState(new Set<string>());
    const [deleteInProgress, setDeleteInProgress] = useState(false);

    const fetchChannels = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch('/api/getChannels', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            });

            if (response.ok) {
                const data = await response.json();
                setChannels(data);
                console.log("Channels fetched successfully:", data);
            } else {
                const errorData = await response.json();
                console.error('Failed to fetch channels:', {
                    status: response.status,
                    error: errorData
                });
                setError(`Failed to fetch channels: ${errorData.error || response.statusText}`);
            }
        } catch (error) {
            console.error('Error fetching channels:', error);
            setError('Failed to fetch channels. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchChannels();
    }, []);

    const toggleSelect = (id: string) => {
        setSelectedItems((prev) => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };

    const deleteSelected = async () => {
        setDeleteInProgress(true);
        setError(null);
        const results: { id: string; success: boolean; error?: string }[] = [];

        try {
            for (const id of selectedItems) {
                try {
                    console.log(`Attempting to delete channel ${id}`);
                    const response = await fetch(`/api/managePlaylist?id=${encodeURIComponent(id)}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                    });

                    let data;
                    const textResponse = await response.text();
                    try {
                        data = textResponse ? JSON.parse(textResponse) : {};
                    } catch (e) {
                        console.error('Failed to parse response:', textResponse);
                        data = { error: 'Invalid response format' };
                    }

                    if (!response.ok) {
                        console.error(`Error deleting channel ${id}:`, {
                            status: response.status,
                            data: data
                        });
                        results.push({
                            id,
                            success: false,
                            error: data.error || `HTTP ${response.status}: ${response.statusText}`
                        });
                    } else {
                        console.log(`Successfully deleted channel ${id}`);
                        results.push({ id, success: true });
                    }
                } catch (error) {
                    console.error(`Error processing delete for channel ${id}:`, error);
                    results.push({
                        id,
                        success: false,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    });
                }
            }

            const failures = results.filter(r => !r.success);
            if (failures.length > 0) {
                setError(`Failed to delete some channels: ${failures.map(f => `${f.id} (${f.error})`).join(', ')}`);
            }

            await fetchChannels();
            setSelectedItems(new Set());
        } catch (error) {
            console.error('Error in delete operation:', error);
            setError('Failed to complete delete operation. Please try again.');
        } finally {
            setDeleteInProgress(false);
        }
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

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="text-center p-4">Loading channels...</div>
                ) : (
                    <>
                        <ul className="mb-6 space-y-4">
                            {channels.map((channel) => (
                                <li key={channel.id} className="flex items-center justify-between p-4 bg-white/90 rounded shadow-md">
                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.has(channel.id)}
                                            onChange={() => toggleSelect(channel.id)}
                                            className="h-5 w-5 text-blue-500 focus:ring-blue-300"
                                            disabled={deleteInProgress}
                                        />
                                        <span className="text-gray-700 font-semibold">{channel.name}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={deleteSelected}
                            className={`bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 ${
                                (deleteInProgress || selectedItems.size === 0) ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={deleteInProgress || selectedItems.size === 0}
                        >
                            {deleteInProgress ? 'Deleting...' : 'Delete Selected'}
                        </button>
                    </>
                )}
            </div>
        </main>
    );
}
