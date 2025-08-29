import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { Book, CreateBookRequest } from '../types/book';

interface EditBookModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, bookData: CreateBookRequest) => Promise<void>;
  isLoading: boolean;
}

export const EditBookModal: React.FC<EditBookModalProps> = ({
  book,
  isOpen,
  onClose,
  onSave,
  isLoading,
}) => {
  const [formData, setFormData] = useState<CreateBookRequest>({
    title: '',
    author: '',
  });

  const [errors, setErrors] = useState<Partial<CreateBookRequest>>({});

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
      });
      setErrors({});
    }
  }, [book]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateBookRequest> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tytuł jest wymagany';
    }
    if (!formData.author.trim()) {
      newErrors.author = 'Autor jest wymagany';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !book) return;

    try {
      await onSave(book.id, formData);
      onClose();
    } catch (error) {
      console.error('Błąd podczas edycji książki:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    
    if (errors[name as keyof CreateBookRequest]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 animate-fade-in">
   
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edytuj książkę</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-2">
              Tytuł książki *
            </label>
            <input
              type="text"
              id="edit-title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`input ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="np. Władca Pierścieni"
              disabled={isLoading}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="edit-author" className="block text-sm font-medium text-gray-700 mb-2">
              Autor *
            </label>
            <input
              type="text"
              id="edit-author"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className={`input ${errors.author ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="np. J.R.R. Tolkien"
              disabled={isLoading}
            />
            {errors.author && (
              <p className="mt-1 text-sm text-red-600">{errors.author}</p>
            )}
          </div>

        
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn-secondary flex-1"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.title.trim() || !formData.author.trim()}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Zapisywanie...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Zapisz zmiany
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
