import { Request, Response } from 'express';
import { BookService } from '../services/bookService';
import { BookResponse } from '../types/book';
import { createBookSchema, updateBookSchema, bookIdSchema } from '../validation/bookSchemas';

const bookService = new BookService();

export class BookController {
  async getAllBooks(_req: Request, res: Response<BookResponse>): Promise<void> {
    try {
      const books = await bookService.getAllBooks();
      res.json({
        success: true,
        data: books,
        message: 'Książki zostały pobrane pomyślnie',
      });
    } catch (error) {
      console.error('Błąd w kontrolerze getAllBooks:', error);
      res.status(500).json({
        success: false,
        error: 'Wystąpił błąd serwera',
      });
    }
  }

  async createBook(req: Request, res: Response<BookResponse>): Promise<void> {
    try {
      const validatedData = createBookSchema.parse(req.body);
      const newBook = await bookService.createBook(validatedData);
      
      res.status(201).json({
        success: true,
        data: newBook,
        message: 'Książka została utworzona pomyślnie',
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          error: 'Nieprawidłowe dane wejściowe',
        });
        return;
      }
      
      console.error('Błąd w kontrolerze createBook:', error);
      res.status(500).json({
        success: false,
        error: 'Wystąpił błąd serwera',
      });
    }
  }

  async updateBookStatus(req: Request, res: Response<BookResponse>): Promise<void> {
    try {
      const { id } = bookIdSchema.parse(req.params);
      const validatedData = updateBookSchema.parse(req.body);
      
      const existingBook = await bookService.getBookById(id);
      if (!existingBook) {
        res.status(404).json({
          success: false,
          error: 'Książka nie została znaleziona',
        });
        return;
      }

      const updatedBook = await bookService.updateBookStatus(id, validatedData.read);
      
      res.json({
        success: true,
        data: updatedBook,
        message: 'Status książki został zaktualizowany pomyślnie',
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          error: 'Nieprawidłowe dane wejściowe',
        });
        return;
      }
      
      console.error('Błąd w kontrolerze updateBookStatus:', error);
      res.status(500).json({
        success: false,
        error: 'Wystąpił błąd serwera',
      });
    }
  }

  async updateBook(req: Request, res: Response<BookResponse>): Promise<void> {
    try {
      const { id } = bookIdSchema.parse(req.params);
      const validatedData = createBookSchema.parse(req.body);
      
      const existingBook = await bookService.getBookById(id);
      if (!existingBook) {
        res.status(404).json({
          success: false,
          error: 'Książka nie została znaleziona',
        });
        return;
      }

      const updatedBook = await bookService.updateBook(id, validatedData);
      
      res.json({
        success: true,
        data: updatedBook,
        message: 'Książka została zaktualizowana pomyślnie',
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          error: 'Nieprawidłowe dane wejściowe',
        });
        return;
      }
      
      console.error('Błąd w kontrolerze updateBook:', error);
      res.status(500).json({
        success: false,
        error: 'Wystąpił błąd serwera',
      });
    }
  }

  async deleteBook(req: Request, res: Response<BookResponse>): Promise<void> {
    try {
      const { id } = bookIdSchema.parse(req.params);
      
      const existingBook = await bookService.getBookById(id);
      if (!existingBook) {
        res.status(404).json({
          success: false,
          error: 'Książka nie została znaleziona',
        });
        return;
      }

      await bookService.deleteBook(id);
      
      res.json({
        success: true,
        message: 'Książka została usunięta pomyślnie',
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          error: 'Nieprawidłowe dane wejściowe',
        });
        return;
      }
      
      console.error('Błąd w kontrolerze deleteBook:', error);
      res.status(500).json({
        success: false,
        error: 'Wystąpił błąd serwera',
      });
    }
  }
}
