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

export interface BookResponse {
  success: boolean;
  data?: Book | Book[];
  message?: string;
  error?: string;
}
