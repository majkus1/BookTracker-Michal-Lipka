import React from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';
import { Book } from '../types/book';

interface DeleteConfirmModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number) => Promise<void>;
  isLoading: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  book,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}) => {
  if (!isOpen || !book) return null;

  const handleConfirm = async () => {
    try {
      await onConfirm(book.id);
      onClose();
    } catch (error) {
      console.error('Błąd podczas usuwania książki:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 animate-fade-in">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Usuń książkę</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Czy na pewno chcesz usunąć tę książkę?
              </h3>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600">
              <div className="font-medium text-gray-900 mb-1">Książka do usunięcia:</div>
              <div className="text-lg font-semibold text-gray-900">{book.title}</div>
              <div className="text-gray-600">Autor: {book.author}</div>
              <div className="text-gray-500 text-xs mt-1">
                Status: {book.read ? 'Przeczytana' : 'Nieprzeczytana'}
              </div>
            </div>
          </div>

         
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn-secondary flex-1"
            >
              Anuluj
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className="btn flex-1 bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Usuwanie...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Usuń książkę
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
