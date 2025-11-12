"use client";

import React, { useEffect } from "react";
import { Content } from "@/types/content";

interface ContentModalProps {
  content: Content | null;
  onClose: () => void;
}

const ContentModal: React.FC<ContentModalProps> = ({ content, onClose }) => {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!content) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
  className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative animate-fadeIn
             max-h-screen overflow-y-auto"
  onClick={(e) => e.stopPropagation()} // prevent outside click from closing
>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-3 text-gray-900">{content.title}</h2>

        <p className="text-gray-600 text-sm mb-4">
          <strong>Category:</strong> {content.category || "—"}
        </p>

        <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-wrap">
          {content.summary}
        </p>

        <div className="text-gray-600 text-sm">
          <p className="mb-2">
            <strong>Source:</strong>{" "}
            {content.source_url ? (
              <a
                href={content.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {content.source_url}
              </a>
            ) : (
              "N/A"
            )}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(content.created_at).toLocaleString()}
          </p>
        </div>

        {/* Raw Text Section */}
        {content.raw_text && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Full Text
            </h3>
            <p className="text-gray-700 text-sm whitespace-pre-wrap">
              {content.raw_text.slice(0, 1000)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentModal;
