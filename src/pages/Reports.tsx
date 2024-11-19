import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useReportStore } from '../stores/reportStore';
import { Report } from '../types/report';
import ReportList from '../components/reports/ReportList';
import ReportViewer from '../components/reports/ReportViewer';
import { useNotifications } from '../components/notifications/NotificationProvider';

const Reports = () => {
  const [showViewer, setShowViewer] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const { user } = useAuthStore();
  const { reports, deleteReport } = useReportStore();
  const { showNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar informes según permisos del usuario
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const hasPermission = report.createdBy === user?.id ||
                         report.permissions.users.includes(user?.id || '') ||
                         report.permissions.roles.includes(user?.role || '') ||
                         (user?.subred && report.permissions.subnets.includes(user.subred));
    
    return matchesSearch && hasPermission;
  });

  const handleDelete = (reportId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este informe?')) {
      deleteReport(reportId);
      showNotification('success', 'Informe eliminado correctamente');
    }
  };

  const handleDownload = async (report: Report) => {
    try {
      const response = await fetch(report.output.url);
      if (!response.ok) throw new Error('Error al descargar el informe');
      
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${report.title}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      showNotification('error', 'Error al descargar el informe');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Informes</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de informes generados
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-lg">
          <input
            type="text"
            placeholder="Buscar informes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {showViewer && selectedReport ? (
        <ReportViewer
          report={selectedReport}
          onClose={() => {
            setShowViewer(false);
            setSelectedReport(null);
          }}
        />
      ) : (
        <ReportList
          reports={filteredReports}
          onReportClick={(report) => {
            setSelectedReport(report);
            setShowViewer(true);
          }}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
};

export default Reports;