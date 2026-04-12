'use client';

import Link from 'next/link';
import { Car, Calendar, User } from 'lucide-react';

export default function Navbar() {
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
              <Link href="/reservations" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-slate-800 transition">
                <Calendar className="h-4 w-4" />
                <span>My Reservations</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-2 bg-slate-800 rounded-md">
              <User className="h-4 w-4" />
              <span className="text-sm">Guest User</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
