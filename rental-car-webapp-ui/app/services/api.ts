import axios from 'axios';
import { Car, Reservation, Rental, AuthResponse, LoginCredentials, RegisterData } from '@/app/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const carApi = {
  getAvailableCars: async (startDate: string, endDate: string): Promise<Car[]> => {
    const response = await api.get('/reservation/availability', {
      params: { startDate, endDate },
    });
    return response.data;
  },
};

export const reservationApi = {
  createReservation: async (reservation: Omit<Reservation, 'id'>): Promise<Reservation> => {
    const response = await api.post('/reservation', reservation);
    return response.data;
  },

  getAllReservations: async (): Promise<Reservation[]> => {
    const response = await api.get('/reservation/all');
    return response.data;
  },

  getReservation: async (id: number): Promise<Reservation> => {
    const response = await api.get(`/admin/reservation/${id}`);
    return response.data;
  },

  updateReservation: async (id: number, reservation: Partial<Reservation>): Promise<Reservation> => {
    const response = await api.put(`/admin/reservation/${id}`, reservation);
    return response.data;
  },

  deleteReservation: async (id: number): Promise<void> => {
    await api.delete(`/admin/reservation/${id}`);
  },
};

export const rentalApi = {
  start: async (userId: string, reservationId: number): Promise<Rental> => {
    const response = await api.post(`/rental/start/${userId}/${reservationId}`);
    return response.data;
  },
};

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  validateToken: async (): Promise<boolean> => {
    const response = await api.get('/auth/validate');
    return response.data;
  },
};
