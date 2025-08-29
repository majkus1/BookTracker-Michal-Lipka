import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { booksApi } from '../api/books';
import { CreateBookRequest } from '../types/book';

export const useBooks = () => {
  const queryClient = useQueryClient();

  const {
    data: books = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['books'],
    queryFn: booksApi.getAllBooks,
  });

  
  const createBookMutation = useMutation({
    mutationFn: booksApi.createBook,
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  
  const updateBookStatusMutation = useMutation({
    mutationFn: ({ id, read }: { id: number; read: boolean }) =>
      booksApi.updateBookStatus(id, read),
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

 
  const updateBookMutation = useMutation({
    mutationFn: ({ id, bookData }: { id: number; bookData: CreateBookRequest }) =>
      booksApi.updateBook(id, bookData),
    onSuccess: () => {
    
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });


  const deleteBookMutation = useMutation({
    mutationFn: booksApi.deleteBook,
    onSuccess: () => {
    
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });


  const addBook = (bookData: CreateBookRequest) => {
    return createBookMutation.mutateAsync(bookData);
  };

 
  const toggleBookStatus = (id: number, read: boolean) => {
    return updateBookStatusMutation.mutateAsync({ id, read });
  };


  const editBook = (id: number, bookData: CreateBookRequest) => {
    return updateBookMutation.mutateAsync({ id, bookData });
  };


  const removeBook = (id: number) => {
    return deleteBookMutation.mutateAsync(id);
  };

 
  const totalBooks = books.length;
  const readBooks = books.filter(book => book.read).length;
  const unreadBooks = totalBooks - readBooks;

  return {
  
    books,
    totalBooks,
    readBooks,
    unreadBooks,
    
    
    isLoading,
    error,
    
    
    addBook,
    toggleBookStatus,
    editBook,
    removeBook,
    refetch,
    
   
    isCreating: createBookMutation.isPending,
    isUpdating: updateBookStatusMutation.isPending,
    isEditing: updateBookMutation.isPending,
    isDeleting: deleteBookMutation.isPending,
  };
};
