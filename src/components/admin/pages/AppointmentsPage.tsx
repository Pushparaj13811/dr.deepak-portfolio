import { useState, useEffect } from "react";
import { Button } from "../../shared/Button";
import type { Appointment } from "../../../types";

interface AppointmentsPageProps {
  onBack: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function AppointmentsPage({ onBack, onSuccess, onError }: AppointmentsPageProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/appointments", {
        credentials: "include",
      });
      const data = await res.json();
      setAppointments(data.data || []);
    } catch (error) {
      onError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: "confirmed" | "cancelled") => {
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });

      const result = await res.json();

      if (result.success) {
        onSuccess(`Appointment ${status} successfully!`);
        await loadAppointments();
      } else {
        onError(result.error || "Failed to update appointment status");
      }
    } catch (error) {
      onError("Network error. Please try again.");
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === "all") return true;
    return apt.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Appointment Requests</h1>
              <p className="mt-2 text-gray-600">View and manage appointment requests</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All ({appointments.length})
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  filter === "pending"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pending ({appointments.filter((a) => a.status === "pending").length})
              </button>
              <button
                onClick={() => setFilter("confirmed")}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  filter === "confirmed"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Confirmed ({appointments.filter((a) => a.status === "confirmed").length})
              </button>
              <button
                onClick={() => setFilter("cancelled")}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  filter === "cancelled"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Cancelled ({appointments.filter((a) => a.status === "cancelled").length})
              </button>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {filter === "all" ? "All Appointments" : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Appointments`}
            </h2>
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filter === "all"
                    ? "No appointment requests yet."
                    : `No ${filter} appointments.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-gray-900">{appointment.patient_name}</h3>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(appointment.status)}`}>
                            {appointment.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="mt-2 space-y-1">
                          <p className="text-gray-600">
                            <span className="font-medium">Email:</span> {appointment.email}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Phone:</span> {appointment.phone}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Preferred Date:</span> {appointment.preferred_date}
                          </p>
                          {appointment.message && (
                            <p className="text-gray-600">
                              <span className="font-medium">Message:</span> {appointment.message}
                            </p>
                          )}
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Requested:</span> {formatDate(appointment.created_at)}
                          </p>
                        </div>
                      </div>
                      {appointment.status === "pending" && (
                        <div className="flex gap-2 ml-4">
                          <Button
                            onClick={() => handleStatusUpdate(appointment.id, "confirmed")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => handleStatusUpdate(appointment.id, "cancelled")}
                            className="text-red-600 hover:text-red-800"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
