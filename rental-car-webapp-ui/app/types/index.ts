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
