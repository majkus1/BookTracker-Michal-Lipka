import { Router } from 'express';
import { BookController } from '../controllers/bookController';

const router = Router();
const bookController = new BookController();

// GET /api/books - pobranie listy książek
router.get('/', bookController.getAllBooks.bind(bookController));

// POST /api/books - dodanie nowej książki
router.post('/', bookController.createBook.bind(bookController));

// PATCH /api/books/:id - aktualizacja statusu książki
router.patch('/:id', bookController.updateBookStatus.bind(bookController));

// PUT /api/books/:id - edycja książki
router.put('/:id', bookController.updateBook.bind(bookController));

// DELETE /api/books/:id - usunięcie książki
router.delete('/:id', bookController.deleteBook.bind(bookController));

export default router;
