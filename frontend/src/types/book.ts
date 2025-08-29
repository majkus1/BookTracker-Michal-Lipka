export interface Book {
  id: number;
  title: string;
  author: string;
  read: boolean;
}

export interface CreateBookRequest {
  title: string;
  author: string;
}

export interface UpdateBookRequest {
  read: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
