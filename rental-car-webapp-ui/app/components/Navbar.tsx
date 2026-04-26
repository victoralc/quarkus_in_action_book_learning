'use client';

import Link from 'next/link';
import { Car, Calendar, User, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, loading, logout } = useAuth();

  if (loading) {
    return (
      <nav className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <Car className="h-6 w-6" />
                <span className="font-bold text-xl">RentCar</span>
              </Link>
            </div>
            <div className="flex items-center">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 hover:text-slate-300 transition">
              <Car className="h-6 w-6" />
              <span className="font-bold text-xl">RentCar</span>
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link href="/" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-slate-800 transition">
                <Car className="h-4 w-4" />
                <span>Cars</span>
              </Link>
              {isAuthenticated && (
                <Link href="/reservations" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-slate-800 transition">
                  <Calendar className="h-4 w-4" />
                  <span>My Reservations</span>
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 px-3 py-2 bg-slate-800 rounded-md">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{user?.firstName}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-slate-800 transition text-slate-300 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition"
              >
                <User className="h-4 w-4" />
                <span className="text-sm">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
