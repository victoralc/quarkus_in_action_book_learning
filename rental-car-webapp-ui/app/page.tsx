'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { format, addDays } from 'date-fns';
import { CarCard } from '@/app/components';
import { carApi } from '@/app/services/api';
import { Car as CarIcon, Search, Loader2 } from 'lucide-react';
import { Car } from '@/app/types';

function HomeContent() {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [startDate, setStartDate] = useState(
    format(addDays(new Date(), 1), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(
    format(addDays(new Date(), 3), 'yyyy-MM-dd')
  );

  useEffect(() => {
    const carId = searchParams.get('carId');
    if (carId) {
      setStartDate(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
      setEndDate(format(addDays(new Date(), 3), 'yyyy-MM-dd'));
    }
    searchCars();
  }, [searchParams]);

  const searchCars = async () => {
    if (!startDate || !endDate) return;

    setSearching(true);
    setLoading(true);
    try {
      const availableCars = await carApi.getAvailableCars(startDate, endDate);
      setCars(availableCars);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setCars([]);
    } finally {
      setSearching(false);
      setLoading(false);
    }
  };

  const handleDateChange = (type: 'start' | 'end', date: string) => {
    if (type === 'start') {
      setStartDate(date);
      if (endDate && date > endDate) {
        setEndDate(date);
      }
    } else {
      setEndDate(date);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white text-center mb-2">
            Find Your Perfect Rental Car
          </h1>
          <p className="text-slate-300 text-center mb-8">
            Choose from our wide selection of vehicles for your next trip
          </p>

          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl mx-auto">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleDateChange('start', e.target.value)}
                  min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleDateChange('end', e.target.value)}
                  min={startDate}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={searchCars}
                disabled={searching || !startDate || !endDate}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium py-3 px-6 rounded-lg transition flex items-center space-x-2"
              >
                {searching ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {loading ? 'Searching...' : `${cars.length} Cars Available`}
          </h2>
          <p className="text-slate-600">
            {startDate && endDate && (
              <>
                {format(new Date(startDate), 'MMM d')} -{' '}
                {format(new Date(endDate), 'MMM d, yyyy')}
              </>
            )}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>
        ) : cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <CarIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No cars available
            </h3>
            <p className="text-slate-600">
              Try selecting different dates to find available vehicles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
