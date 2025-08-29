import React, { useState } from 'react';
import { CheckCircle, Circle, BookOpen, User, Loader2, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { useBooks } from '../hooks/useBooks';
import { EditBookModal } from './EditBookModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { Book } from '../types/book';

interface BookListProps {
  books: Book[];
}

export const BookList: React.FC<BookListProps> = ({ books }) => {
  const { 
    isLoading, 
    error, 
    toggleBookStatus, 
    editBook,
    removeBook,
    isUpdating, 
    isEditing, 
    isDeleting 
  } = useBooks();

  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [showActions, setShowActions] = useState<number | null>(null);

  const handleToggleStatus = async (id: number, currentRead: boolean) => {
    try {
      await toggleBookStatus(id, !currentRead);
    } catch (error) {
      console.error('Błąd podczas aktualizacji statusu:', error);
    }
  };

  const handleEditBook = async (id: number, bookData: { title: string; author: string }) => {
    try {
      await editBook(id, bookData);
    } catch (error) {
      console.error('Błąd podczas edycji książki:', error);
    }
  };

  const handleDeleteBook = async (id: number) => {
    try {
      await removeBook(id);
    } catch (error) {
      console.error('Błąd podczas usuwania książki:', error);
    }
  };

  const toggleActions = (bookId: number) => {
    setShowActions(showActions === bookId ? null : bookId);
  };

  React.useEffect(() => {
    const handleClickOutside = (_event: MouseEvent) => {
      if (showActions !== null) {
        setShowActions(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showActions]);

  if (isLoading) {
    return (
      <div className="card text-center py-12">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Ładowanie książek...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-12">
        <div className="text-red-500 mb-4">
          <BookOpen className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Błąd podczas ładowania</h3>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-gray-400 mb-4">
          <BookOpen className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Brak książek</h3>
        <p className="text-gray-600">Dodaj swoją pierwszą książkę, aby rozpocząć!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {books.map((book) => (
        <div
          key={book.id}
          className={`card transition-all duration-200 hover:shadow-md ${
            book.read ? 'bg-green-50 border-green-200' : ''
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className={`text-lg font-semibold ${book.read ? 'text-green-800' : 'text-gray-900'}`}>
                  {book.title}
                </h3>
                {book.read && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Przeczytana
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                <span className="text-sm">{book.author}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              
              <button
                onClick={() => handleToggleStatus(book.id, book.read)}
                disabled={isUpdating}
                className={`p-2 rounded-lg transition-colors ${
                  book.read
                    ? 'text-green-600 hover:bg-green-100'
                    : 'text-gray-400 hover:bg-gray-100'
                }`}
                title={book.read ? 'Oznacz jako nieprzeczytaną' : 'Oznacz jako przeczytaną'}
              >
                {book.read ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </button>

            
              <div className="relative">
                                 <button
                   onClick={(e) => {
                     e.stopPropagation();
                     toggleActions(book.id);
                   }}
                   className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                   title="Więcej opcji"
                 >
                   <MoreVertical className="w-5 h-5" />
                 </button>

                              
                 {showActions === book.id && (
                   <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg dropdown-shadow z-10 min-w-[140px] animate-slide-up">
                    <button
                      onClick={() => {
                        setEditingBook(book);
                        setShowActions(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edytuj
                    </button>
                    <button
                      onClick={() => {
                        setDeletingBook(book);
                        setShowActions(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Usuń
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

     
      <EditBookModal
        book={editingBook}
        isOpen={!!editingBook}
        onClose={() => setEditingBook(null)}
        onSave={handleEditBook}
        isLoading={isEditing}
      />

      <DeleteConfirmModal
        book={deletingBook}
        isOpen={!!deletingBook}
        onClose={() => setDeletingBook(null)}
        onConfirm={handleDeleteBook}
        isLoading={isDeleting}
      />
    </div>
  );
};
