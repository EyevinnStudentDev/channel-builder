"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Channel {
  id: string;
  name: string;
  type: string;
  url: string;
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
      const response = await fetch("/api/getChannels", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        setChannels(data);
        console.log("Channels fetched successfully:", data);
      } else {
        const errorData = await response.json();
        console.error("Failed to fetch channels:", {
          status: response.status,
          error: errorData,
        });
        setError(`Failed to fetch channels: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching channels:", error);
      setError("Failed to fetch channels. Please try again.");
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

    try {
      for (const id of selectedItems) {
        const response = await fetch(`/api/managePlaylist?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to delete channel ${id}: ${errorData.error}`);
        }
      }

      await fetchChannels();
      setSelectedItems(new Set());
    } catch (error) {
      setError("Failed to delete some channels. Please try again.");
    } finally {
      setDeleteInProgress(false);
    }
  };

  return (
    <main className="flex flex-col items-center w-screen h-screen bg-base-300 text-base-content p-4">
      <div className="absolute top-0 left-0 p-4">
        <Link href="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
      <div className="w-2/3 mt-20 p-8 card bg-base-100 shadow-xl">
        <h1 className="text-4xl font-bold mb-6 text-center">Admin Panel</h1>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="text-center p-4">Loading channels...</div>
        ) : (
          <>
            <ul className="mb-6 space-y-4">
              {channels.map((channel) => (
                <li key={channel.id} className="card bg-base-200 shadow-md p-4">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(channel.id)}
                        onChange={() => toggleSelect(channel.id)}
                        className="checkbox checkbox-primary"
                        disabled={deleteInProgress}
                      />
                      <span className="font-semibold">{channel.name}</span>
                    </label>
                  </div>
                </li>
              ))}
            </ul>

            <button
              onClick={deleteSelected}
              className={`btn btn-error ${
                deleteInProgress || selectedItems.size === 0 ? "btn-disabled" : ""
              }`}
              disabled={deleteInProgress || selectedItems.size === 0}
            >
              {deleteInProgress ? "Deleting..." : "Delete Selected"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
