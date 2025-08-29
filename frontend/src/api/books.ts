import axios from 'axios';
import { Book, CreateBookRequest, ApiResponse } from '../types/book';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const booksApi = {
  async getAllBooks(): Promise<Book[]> {
    const response = await api.get<ApiResponse<Book[]>>('/api/books');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Nie udało się pobrać książek');
  },

  async createBook(bookData: CreateBookRequest): Promise<Book> {
    const response = await api.post<ApiResponse<Book>>('/api/books', bookData);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Nie udało się utworzyć książki');
  },

  async updateBookStatus(id: number, read: boolean): Promise<Book> {
    const response = await api.patch<ApiResponse<Book>>(`/api/books/${id}`, { read });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Nie udało się zaktualizować książki');
  },

  async updateBook(id: number, bookData: CreateBookRequest): Promise<Book> {
    const response = await api.put<ApiResponse<Book>>(`/api/books/${id}`, bookData);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Nie udało się zaktualizować książki');
  },

  async deleteBook(id: number): Promise<void> {
    const response = await api.delete<ApiResponse<void>>(`/api/books/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Nie udało się usunąć książki');
    }
  },
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 404) {
      throw new Error('Endpoint nie został znaleziony');
    }
    if (error.response?.status >= 500) {
      throw new Error('Błąd serwera');
    }
    throw error;
  }
);
