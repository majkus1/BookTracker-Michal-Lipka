import React from 'react';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';
import { useBooks } from '../hooks/useBooks';

export const Stats: React.FC = () => {
  const { totalBooks, readBooks, unreadBooks } = useBooks();

  const stats = [
    {
      label: 'Wszystkie książki',
      value: totalBooks,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Przeczytane',
      value: readBooks,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Do przeczytania',
      value: unreadBooks,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="card text-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.bgColor} mb-4`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};
