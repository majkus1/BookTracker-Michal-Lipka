import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Book } from '../types/book';

interface SearchBarProps {
  books: Book[];
  onFilterChange: (filteredBooks: Book[]) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ books, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'read' | 'unread'>('all');

  const filteredBooks = useMemo(() => {
    let filtered = books;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(book => 
        statusFilter === 'read' ? book.read : !book.read
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [books, searchTerm, statusFilter]);

  
  React.useEffect(() => {
    onFilterChange(filteredBooks);
  }, [filteredBooks, onFilterChange]);

  const clearSearch = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  const hasActiveFilters = searchTerm.trim() || statusFilter !== 'all';

  return (
    <div className="card mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Wyszukaj po tytule lub autorze..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 pr-10"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

      
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'read' | 'unread')}
            className="input min-w-[140px]"
          >
            <option value="all">Wszystkie</option>
            <option value="read">Przeczytane</option>
            <option value="unread">Nieprzeczytane</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearSearch}
              className="btn-secondary flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Wyczyść
            </button>
          )}
        </div>
      </div>

     
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Znaleziono <span className="font-semibold">{filteredBooks.length}</span> z{' '}
            <span className="font-semibold">{books.length}</span> książek
          </p>
        </div>
      )}
    </div>
  );
};
