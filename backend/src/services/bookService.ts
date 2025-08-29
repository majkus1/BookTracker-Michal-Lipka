import { PrismaClient } from '@prisma/client';
import { Book, CreateBookRequest } from '../types/book';

const prisma = new PrismaClient();

export class BookService {
  async getAllBooks(): Promise<Book[]> {
    try {
      const books = await prisma.book.findMany({
        orderBy: {
          id: 'desc',
        },
      });
      return books;
    } catch (error) {
      console.error('Błąd podczas pobierania książek:', error);
      if (error instanceof Error && error.message.includes('table') && error.message.includes('does not exist')) {
        console.error('BŁĄD BAZY DANYCH: Tabela books nie istnieje. Uruchom prisma migrate deploy.');
        throw new Error('Błąd bazy danych: Tabela books nie istnieje. Sprawdź migracje.');
      }
      throw new Error('Nie udało się pobrać książek');
    }
  }

  async createBook(bookData: CreateBookRequest): Promise<Book> {
    try {
      const book = await prisma.book.create({
        data: {
          title: bookData.title.trim(),
          author: bookData.author.trim(),
          read: false,
        },
      });
      return book;
    } catch (error) {
      console.error('Błąd podczas tworzenia książki:', error);
      throw new Error('Nie udało się utworzyć książki');
    }
  }

  async updateBookStatus(id: number, read: boolean): Promise<Book> {
    try {
      const book = await prisma.book.update({
        where: { id },
        data: { read },
      });
      return book;
    } catch (error) {
      console.error('Błąd podczas aktualizacji książki:', error);
      throw new Error('Nie udało się zaktualizować książki');
    }
  }

  async getBookById(id: number): Promise<Book | null> {
    try {
      const book = await prisma.book.findUnique({
        where: { id },
      });
      return book;
    } catch (error) {
      console.error('Błąd podczas pobierania książki:', error);
      throw new Error('Nie udało się pobrać książki');
    }
  }

  async updateBook(id: number, bookData: CreateBookRequest): Promise<Book> {
    try {
      const existingBook = await prisma.book.findUnique({
        where: { id },
      });

      if (!existingBook) {
        throw new Error('Książka nie została znaleziona');
      }

      const book = await prisma.book.update({
        where: { id },
        data: {
          title: bookData.title.trim(),
          author: bookData.author.trim(),
        },
      });
      return book;
    } catch (error) {
      console.error('Błąd podczas aktualizacji książki:', error);
      if (error instanceof Error && error.message === 'Książka nie została znaleziona') {
        throw error;
      }
      throw new Error('Nie udało się zaktualizować książki');
    }
  }

  async deleteBook(id: number): Promise<void> {
    try {
      const existingBook = await prisma.book.findUnique({
        where: { id },
      });

      if (!existingBook) {
        throw new Error('Książka nie została znaleziona');
      }

      await prisma.book.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Błąd podczas usuwania książki:', error);
      if (error instanceof Error && error.message === 'Książka nie została znaleziona') {
        throw error;
      }
      throw new Error('Nie udało się usunąć książki');
    }
  }
}
