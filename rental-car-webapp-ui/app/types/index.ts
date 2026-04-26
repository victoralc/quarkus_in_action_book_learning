export interface Car {
  id: number;
  licensePlateNumber: string;
  manufacturer: string;
  model: string;
}

export interface Reservation {
  id?: number;
  carId: number;
  userId?: string;
  startDay: string;
  endDay: string;
  car?: Car;
}

export interface Rental {
  id: number;
  userId: string;
  reservationId: number;
  startDate: string;
}

export interface Invoice {
  reservation: Reservation;
  price: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
