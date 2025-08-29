import React, { useState } from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { CreateBookRequest } from '../types/book';

interface BookFormProps {
  onSubmit: (bookData: CreateBookRequest) => Promise<void>;
  isLoading: boolean;
}

export const BookForm: React.FC<BookFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<CreateBookRequest>({
    title: '',
    author: '',
  });

  const [errors, setErrors] = useState<Partial<CreateBookRequest>>({});

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
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      
      setFormData({ title: '', author: '' });
      setErrors({});
    } catch (error) {
      console.error('Błąd podczas dodawania książki:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    

    if (errors[name as keyof CreateBookRequest]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="card animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900">Dodaj nową książkę</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Tytuł książki
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`input ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="np. Dziady"
            disabled={isLoading}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
            Autor
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            className={`input ${errors.author ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="np. Adam Mickiewicz"
            disabled={isLoading}
          />
          {errors.author && (
            <p className="mt-1 text-sm text-red-600">{errors.author}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !formData.title.trim() || !formData.author.trim()}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Dodawanie książki...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Dodaj książkę
            </>
          )}
        </button>
      </form>
    </div>
  );
};
