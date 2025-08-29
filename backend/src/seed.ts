import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleBooks = [
  {
    title: 'Dziady cz. III',
    author: 'Adam Mickiewicz',
    read: true,
  },
  {
    title: 'Harry Potter i Kamień Filozoficzny',
    author: 'J.K. Rowling',
    read: false,
  }
];

async function main() {
  console.log('Rozpoczynam seedowanie bazy danych...');

  
  await prisma.book.deleteMany();
  console.log('Usunięto istniejące książki');

  
  for (const book of sampleBooks) {
    await prisma.book.create({
      data: book,
    });
    console.log(`Dodano książkę: ${book.title} - ${book.author}`);
  }

  console.log('Seedowanie zakończone pomyślnie!');
}

main()
  .catch((e) => {
    console.error('Błąd podczas seedowania:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
