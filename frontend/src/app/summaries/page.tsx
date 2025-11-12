"use client";

import React, { useState, useEffect } from "react";
import { Content } from "@/types/content";
import ProtectedRoute from "@/utils/protectedRoute";
import api from "@/lib/api";
import ContentModal from "@/components/ui/contentmodal";
import EditContentModal from "@/components/ui/editContentModal";
const Summaries = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editContent, setEditContent] = useState<Content | null>(null);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  const fetchContents = async (searchQuery?: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/contents`, {
        params: { query: searchQuery || "" },
      });
      setContents(response.data.contents || []);
    } catch (err) {
      console.error("Error fetching contents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const handleSearch = () => {
    fetchContents(query);
  };

  const handleDelete = async (id: number) => {
    // if (!confirm("Delete this content?")) return;
    try {
      await api.delete(`/contents/${id}`);
      setContents(contents.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting content:", err);
      alert("Failed to delete content.");
    }
  };

  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Summaries</h1>

        {/* Search Bar */}
        <div className="flex gap-2 mb-6 max-sm:flex-col sm:flex-row">
          <input
            type="text"
            placeholder="Search summaries..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
          <button
            onClick={handleSearch}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Search
          </button>
          <button
            onClick={() => fetchContents(query)}
            disabled={loading}
            aria-label="Refresh summaries"
            className="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Content Grid */}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : contents.length === 0 ? (
          <p className="text-gray-500">No summaries found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((content) => (
              <div
                key={content.id}
                className="bg-white shadow-md rounded-xl p-5 border hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold mb-2">
                  {content.title || "Untitled"}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                  {content.summary}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span className="capitalize">{content.category}</span>
                  <span>
                    {new Date(content.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between mt-4 gap-2">
                  <button
                    onClick={() => setSelectedContent(content)}
                    className="text-black hover:underline text-sm"
                  >
                    Read More
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(content.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setEditContent(content)}
                      className="text-blue-500 hover:underline text-sm"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ✅ Modal appears here */}
        {selectedContent && (
          <ContentModal
            content={selectedContent}
            onClose={() => setSelectedContent(null)}
          />
        )}
        {editContent && (
          <EditContentModal
            content={editContent}
            onClose={() => setEditContent(null)}
            onUpdated={() => fetchContents()}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Summaries;
