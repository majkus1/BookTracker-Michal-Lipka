import React, { useState } from 'react';
import { Header } from './components/Header';
import { Stats } from './components/Stats';
import { BookForm } from './components/BookForm';
import { BookList } from './components/BookList';
import { SearchBar } from './components/SearchBar';
import { useBooks } from './hooks/useBooks';
import { Book } from './types/book';

function App() {
  const { addBook, isCreating, books } = useBooks();
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);

  const handleAddBook = async (bookData: { title: string; author: string }) => {
    try {
      await addBook(bookData);
    } catch (error) {
      console.error('Błąd podczas dodawania książki:', error);
      
    }
  };

  const handleFilterChange = (newFilteredBooks: Book[]) => {
    setFilteredBooks(newFilteredBooks);
  };

  
  React.useEffect(() => {
    setFilteredBooks(books);
  }, [books]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Twoja biblioteka</h2>
        </div>

        <Stats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1">
            <BookForm onSubmit={handleAddBook} isLoading={isCreating} />
          </div>

        
          <div className="lg:col-span-2">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Lista książek</h3>
              <SearchBar books={books} onFilterChange={handleFilterChange} />
              <BookList books={filteredBooks} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
