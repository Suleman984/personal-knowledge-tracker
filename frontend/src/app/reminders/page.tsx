"use client";

import React, { useEffect, useState } from "react";
import { Bell, Loader2, Edit2, Trash2, RefreshCw } from "lucide-react";
import ProtectedRoute from "@/utils/protectedRoute";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "@/lib/api";
import { Reminder } from "@/types/reminder";


const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newDate, setNewDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchReminders();
  }, []);

  // ✅ Fetch all reminders
  const fetchReminders = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/reminders/`);
      setReminders(response.data.reminders || []);
    } catch (err) {
      console.error("Error fetching reminders:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle reminder on/off
  const toggleReminder = async (id: number, currentState: boolean) => {
    try {
      await api.put(`/api/reminders/${id}/toggle`, { is_set: !currentState });
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_set: !currentState } : r))
      );
    } catch (err) {
      console.error("Error toggling reminder:", err);
    }
  };

  // ✅ Edit reminder date
  const updateReminderDate = async (id: number) => {
    if (!newDate) return;
    try {
      await api.put(`/reminders/${id}/edit`, { schedule_for: newDate });
      setReminders((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, schedule_for: newDate.toISOString() } : r
        )
      );
      setEditingId(null);
      setNewDate(null);
    } catch (err) {
      console.error("Error updating reminder date:", err);
    }
  };

  // ✅ Delete reminder
  const deleteReminder = async (id: number) => {
    try {
      await api.delete(`/api/reminders/${id}`);
      setReminders((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Error deleting reminder:", err);
    }
  };

  if (loading && reminders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Reminders</h1>
          <button
            onClick={fetchReminders}
            disabled={loading}
            aria-label="Refresh reminders"
            className={`inline-flex items-center space-x-2 px-3 py-1 rounded-md text-sm border ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <RefreshCw size={16} />
            )}
            <span>{loading ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>

        {reminders.length === 0 ? (
          <div className="bg-white shadow-md rounded-xl p-8 text-center">
            <Bell className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500">No reminders yet.</p>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-xl p-6 overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4">Summary Title</th>
                  <th className="py-2 px-4">Scheduled For</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reminders.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{r.title || `Content #${r.content_id}`}</td>
                    <td className="py-2 px-4">
                      {editingId === r.id ? (
                        <div className="flex items-center space-x-2">
                          <DatePicker
                            selected={newDate}
                            onChange={(date) => setNewDate(date)}
                            showTimeSelect
                            dateFormat="Pp"
                            className="border rounded-md p-1 text-sm"
                          />
                          <button
                            onClick={() => updateReminderDate(r.id)}
                            className="bg-black text-white px-2 py-1 rounded-md text-sm"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        new Date(r.schedule_for).toLocaleString()
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {r.is_sent ? (
                        <span className="text-blue-600 font-medium">Sent</span>
                      ) : r.is_set ? (
                        <span className="text-green-600 font-medium">Active</span>
                      ) : (
                        <span className="text-gray-400 font-medium">Paused</span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-right space-x-3">
                      <button
                        onClick={() => toggleReminder(r.id, r.is_set)}
                        className={`px-3 py-1 rounded-md text-sm ${
                          r.is_set
                            ? "bg-gray-200 hover:bg-gray-300"
                            : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                      >
                        {r.is_set ? "Pause" : "Activate"}
                      </button>
                      <button
                        onClick={() => setEditingId(r.id)}
                        className="text-gray-500 hover:text-black"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteReminder(r.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Reminders;
