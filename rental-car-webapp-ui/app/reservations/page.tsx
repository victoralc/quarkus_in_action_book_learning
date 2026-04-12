'use client';

import { useState, useEffect } from 'react';
import { ReservationCard } from '@/app/components';
import { reservationApi, rentalApi } from '@/app/services/api';
import { Reservation } from '@/app/types';
import { Loader2, Calendar, RefreshCw } from 'lucide-react';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [startingRental, setStartingRental] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const data = await reservationApi.getAllReservations();
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      showMessage('error', 'Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;

    setDeleting(id);
    try {
      await reservationApi.deleteReservation(id);
      setReservations((prev) => prev.filter((r) => r.id !== id));
      showMessage('success', 'Reservation cancelled successfully');
    } catch (error) {
      console.error('Error deleting reservation:', error);
      showMessage('error', 'Failed to cancel reservation');
    } finally {
      setDeleting(null);
    }
  };

  const handleStartRental = async (reservationId: number) => {
    setStartingRental(reservationId);
    try {
      await rentalApi.start('anonymous', reservationId);
      showMessage('success', 'Rental started successfully!');
      await fetchReservations();
    } catch (error) {
      console.error('Error starting rental:', error);
      showMessage('error', 'Failed to start rental. The rental service may be unavailable.');
    } finally {
      setStartingRental(null);
    }
  };

  const upcomingReservations = reservations.filter((r) => {
    const endDate = new Date(r.endDay);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return endDate >= today;
  });

  const pastReservations = reservations.filter((r) => {
    const endDate = new Date(r.endDay);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return endDate < today;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">My Reservations</h1>
              <p className="text-slate-300 mt-1">
                Manage your car rentals and reservations
              </p>
            </div>
            <button
              onClick={fetchReservations}
              className="bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg transition flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {message && (
          <div
            className={`${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            } p-4 rounded-lg mb-6`}
          >
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>
        ) : reservations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No reservations yet
            </h3>
            <p className="text-slate-600 mb-6">
              Start by browsing our available cars and making your first reservation.
            </p>
            <a
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
            >
              Browse Cars
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {upcomingReservations.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  Active & Upcoming ({upcomingReservations.length})
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {upcomingReservations.map((reservation) => (
                    <ReservationCard
                      key={reservation.id}
                      reservation={reservation}
                      onDelete={handleDelete}
                      onStartRental={handleStartRental}
                    />
                  ))}
                </div>
              </div>
            )}

            {pastReservations.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  Past Reservations ({pastReservations.length})
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {pastReservations.map((reservation) => (
                    <ReservationCard
                      key={reservation.id}
                      reservation={reservation}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {(deleting !== null || startingRental !== null) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span>Processing...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
