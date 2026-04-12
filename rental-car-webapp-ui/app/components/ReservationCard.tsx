'use client';

import { Reservation } from '@/app/types';
import { format } from 'date-fns';
import { Car, Calendar, Clock, Trash2 } from 'lucide-react';

interface ReservationCardProps {
  reservation: Reservation;
  onDelete?: (id: number) => void;
  onStartRental?: (id: number) => void;
}

export default function ReservationCard({ reservation, onDelete, onStartRental }: ReservationCardProps) {
  const startDate = new Date(reservation.startDay);
  const endDate = new Date(reservation.endDay);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const canStartRental = startDate <= today && onStartRental;
  const isPast = endDate < today;

  const calculateDays = () => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const calculateTotal = () => {
    return (calculateDays() * 19.99).toFixed(2);
  };

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${isPast ? 'opacity-60' : ''}`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="bg-slate-100 p-3 rounded-lg">
              <Car className="h-6 w-6 text-slate-600" />
            </div>
            <div>
              {reservation.car ? (
                <>
                  <h3 className="text-lg font-bold text-slate-900">
                    {reservation.car.manufacturer} {reservation.car.model}
                  </h3>
                  <p className="text-slate-500 text-sm">{reservation.car.licensePlateNumber}</p>
                </>
              ) : (
                <h3 className="text-lg font-bold text-slate-900">Car ID: {reservation.carId}</h3>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isPast ? (
              <span className="bg-slate-100 text-slate-600 text-sm font-medium px-3 py-1 rounded-full">
                Completed
              </span>
            ) : canStartRental ? (
              <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                Ready to Rent
              </span>
            ) : (
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                Upcoming
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Pick-up Date</p>
              <p className="font-medium text-slate-900">{format(startDate, 'MMM d, yyyy')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Return Date</p>
              <p className="font-medium text-slate-900">{format(endDate, 'MMM d, yyyy')}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2 text-slate-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{calculateDays()} days</span>
            <span className="text-slate-300">|</span>
            <span className="font-bold text-slate-900">${calculateTotal()}</span>
          </div>
          <div className="flex items-center space-x-2">
            {canStartRental && (
              <button
                onClick={() => onStartRental?.(reservation.id!)}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition"
              >
                Start Rental
              </button>
            )}
            {onDelete && !isPast && (
              <button
                onClick={() => onDelete(reservation.id!)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
