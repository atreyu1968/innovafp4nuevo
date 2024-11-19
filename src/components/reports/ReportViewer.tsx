import React, { useState, useEffect } from 'react';
import { X, Download, Share2, ExternalLink } from 'lucide-react';
import { Report } from '../../types/report';
import { useUserStore } from '../../stores/userStore';
import { useNotifications } from '../../components/notifications/NotificationProvider';
import { saveAs } from 'file-saver';

interface ReportViewerProps {
  report: Report;
  onClose: () => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ report, onClose }) => {
  const { users } = useUserStore();
  const { showNotification } = useNotifications();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        const response = await fetch(report.output.url);
        if (!response.ok) throw new Error('Error al cargar el informe');
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setObjectUrl(url);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar el informe. Por favor, inténtalo de nuevo.');
        setLoading(false);
      }
    };

    loadReport();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [report.output.url]);

  const handleDownload = async () => {
    try {
      const response = await fetch(report.output.url);
      if (!response.ok) throw new Error('Error al descargar el informe');
      
      const blob = await response.blob();
      saveAs(blob, `${report.title}.docx`);
      
      showNotification('success', 'Informe descargado correctamente');
    } catch (error) {
      showNotification('error', 'Error al descargar el informe');
    }
  };

  const handleShare = () => {
    showNotification('info', 'Funcionalidad de compartir en desarrollo');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${
      isFullscreen ? 'fixed inset-0 z-50' : ''
    }`}>
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
          <p className="mt-1 text-sm text-gray-500">
            Generado el {new Date(report.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Descargar
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Compartir
          </button>
          <button
            onClick={toggleFullscreen}
            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            {isFullscreen ? 'Salir' : 'Pantalla completa'}
          </button>
          {!isFullscreen && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className={`${isFullscreen ? 'h-[calc(100vh-120px)]' : 'h-[calc(100vh-300px)]'} p-6`}>
        {objectUrl && (
          <iframe
            src={objectUrl}
            className="w-full h-full border-0"
            title={report.title}
          />
        )}
      </div>

      {!isFullscreen && (
        <div className="px-6 py-4 bg-gray-50 border-t">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Permisos de acceso</h4>
          <div className="space-y-2">
            {report.permissions.users.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-700">Usuarios:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {report.permissions.users.map(userId => {
                    const user = users.find(u => u.id === userId);
                    return user ? (
                      <span key={userId} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {user.nombre} {user.apellidos}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {report.permissions.roles.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-700">Roles:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {report.permissions.roles.map(role => (
                    <span key={role} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      {role === 'gestor' ? 'Gestor' :
                       role === 'coordinador_subred' ? 'Coordinador de Subred' :
                       'Coordinador General'}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportViewer;