import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { AlertTriangle } from 'lucide-react';

interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex items-center space-x-3 text-red-600 mb-4">
          <AlertTriangle className="h-6 w-6" />
          <h2 className="text-lg font-semibold">Ha ocurrido un error</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta recargar la página.
        </p>
        <pre className="bg-gray-50 p-4 rounded text-sm text-gray-700 mb-4">
          {error.message}
        </pre>
        <button
          onClick={resetErrorBoundary}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
};

export const ErrorBoundaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Opcional: Realizar acciones de limpieza al reintentar
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};