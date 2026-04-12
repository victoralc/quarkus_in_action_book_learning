'use client';

import { Car } from '@/app/types';
import { Car as CarIcon, Calendar } from 'lucide-react';
import Link from 'next/link';

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-8 flex items-center justify-center">
        <CarIcon className="h-24 w-24 text-white/80" />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {car.manufacturer} {car.model}
            </h3>
            <p className="text-slate-500 text-sm mt-1">{car.licensePlateNumber}</p>
          </div>
          <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
            Available
          </span>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <span className="text-2xl font-bold text-slate-900">$19.99/day</span>
          <Link
            href={`/reserve?carId=${car.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center space-x-2"
          >
            <Calendar className="h-4 w-4" />
            <span>Reserve</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
