'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { format, addDays, differenceInDays } from 'date-fns';
import { CarCard } from '@/app/components';
import { carApi, reservationApi } from '@/app/services/api';
import { Car, Reservation } from '@/app/types';
import { Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function ReserveContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const carId = searchParams.get('carId');

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [startDate, setStartDate] = useState(
    format(addDays(new Date(), 1), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(
    format(addDays(new Date(), 3), 'yyyy-MM-dd')
  );

  useEffect(() => {
    const fetchCar = async () => {
      if (!carId) {
        router.push('/');
        return;
      }

      setLoading(true);
      try {
        const cars = await carApi.getAvailableCars(
          format(addDays(new Date(), -30), 'yyyy-MM-dd'),
          format(addDays(new Date(), 365), 'yyyy-MM-dd')
        );
        const foundCar = cars.find((c) => c.id === parseInt(carId));
        if (foundCar) {
          setCar(foundCar);
        } else {
          setError('Car not found');
        }
      } catch (err) {
        console.error('Error fetching car:', err);
        setError('Failed to load car details');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [carId, router]);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    return differenceInDays(new Date(endDate), new Date(startDate)) + 1;
  };

  const calculateTotal = () => {
    return (calculateDays() * 19.99).toFixed(2);
  };

  const handleSubmit = async () => {
    if (!car || !startDate || !endDate) return;

    setSubmitting(true);
    setError('');

    try {
      const reservation: Omit<Reservation, 'id'> = {
        carId: car.id,
        startDay: startDate,
        endDay: endDate,
      };

      await reservationApi.createReservation(reservation);
      setSuccess(true);
    } catch (err) {
      console.error('Error creating reservation:', err);
      setError('Failed to create reservation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error && !car) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <h3 className="text-xl font-semibold text-red-600 mb-4">{error}</h3>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Cars
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-md p-12 text-center max-w-lg mx-auto">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Reservation Confirmed!
          </h2>
          <p className="text-slate-600 mb-6">
            Your reservation for the {car?.manufacturer} {car?.model} has been
            successfully created.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
            >
              Browse More Cars
            </Link>
            <Link
              href="/reservations"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-6 rounded-lg transition"
            >
              View Reservations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cars
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            {car && <CarCard car={car} />}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 h-fit">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Complete Your Reservation
            </h2>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Pick-up Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="font-semibold text-slate-900 mb-4">Price Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-slate-600">
                    <span>
                      $19.99 x {calculateDays()} day{calculateDays() !== 1 ? 's' : ''}
                    </span>
                    <span>${calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t border-slate-100">
                    <span>Total</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting || !startDate || !endDate}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium py-3 px-6 rounded-lg transition flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Confirm Reservation</span>
                )}
              </button>

              <p className="text-xs text-slate-500 text-center">
                By confirming, you agree to our rental terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReservePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      }
    >
      <ReserveContent />
    </Suspense>
  );
}
