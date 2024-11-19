import React from 'react';
import { FileText, Calendar, Download, Eye, Trash2, User, Users } from 'lucide-react';
import { Report } from '../../types/report';
import { useAuthStore } from '../../stores/authStore';

interface ReportListProps {
  reports: Report[];
  onReportClick: (report: Report) => void;
  onDelete: (reportId: string) => void;
  onDownload: (report: Report) => void;
}

const ReportList: React.FC<ReportListProps> = ({
  reports,
  onReportClick,
  onDelete,
  onDownload,
}) => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'coordinador_general';

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {reports.map((report) => (
          <li key={report.id}>
            <div className="px-4 py-4 flex items-center justify-between sm:px-6">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <p className="ml-3 text-sm font-medium text-gray-900">
                      {report.title}
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    {report.permissions.users.length > 0 && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 mr-2">
                        <User className="h-3 w-3 mr-1" />
                        {report.permissions.users.length} usuarios
                      </span>
                    )}
                    {report.permissions.roles.length > 0 && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        <Users className="h-3 w-3 mr-1" />
                        {report.permissions.roles.length} roles
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    {report.description && (
                      <p className="flex items-center text-sm text-gray-500">
                        {report.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    <p>
                      Generado: {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="ml-4 flex space-x-2">
                <button
                  onClick={() => onReportClick(report)}
                  className="p-2 text-gray-400 hover:text-gray-500"
                  title="Ver informe"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDownload(report)}
                  className="p-2 text-gray-400 hover:text-gray-500"
                  title="Descargar informe"
                >
                  <Download className="h-5 w-5" />
                </button>
                {isAdmin && (
                  <button
                    onClick={() => onDelete(report.id)}
                    className="p-2 text-red-400 hover:text-red-500"
                    title="Eliminar informe"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
        {reports.length === 0 && (
          <li className="px-4 py-8 text-center text-gray-500">
            No se encontraron informes
          </li>
        )}
      </ul>
    </div>
  );
};

export default ReportList;