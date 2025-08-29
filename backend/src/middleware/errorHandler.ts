import { Request, Response } from 'express';

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response
): void => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Wystąpił błąd serwera';

  console.error(`Błąd ${statusCode}: ${message}`, {
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    error: error.stack,
  });

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: `Endpoint ${req.method} ${req.url} nie został znaleziony`,
  });
};
