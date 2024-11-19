import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Download } from 'lucide-react';
import { ReportVisualization } from '../../types/report';
import { useReportStore } from '../../stores/reportStore';
import { useFormStore } from '../../stores/formStore';

interface VisualizationPreviewProps {
  visualization: ReportVisualization;
}

const VisualizationPreview: React.FC<VisualizationPreviewProps> = ({
  visualization,
}) => {
  const { getReportData } = useReportStore();
  const { forms } = useFormStore();
  const data = getReportData(visualization);

  const getFieldLabel = (fieldId: string) => {
    for (const formId of visualization.formIds) {
      const form = forms.find((f) => f.id === formId);
      const field = form?.fields.find((f) => f.id === fieldId);
      if (field) return field.label;
    }
    return fieldId;
  };

  const exportData = (format: 'csv' | 'excel') => {
    const headers = visualization.selectedFields.map(getFieldLabel);
    const rows = data.map((row) =>
      visualization.selectedFields.map((fieldId) =>
        row.responses?.[fieldId] ?? row[fieldId]
      )
    );

    if (format === 'csv') {
      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${visualization.title}_${new Date().toISOString()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Para Excel, usamos un formato CSV que Excel puede abrir
      const csvContent = [
        headers.join('\t'),
        ...rows.map((row) => row.join('\t')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${visualization.title}_${new Date().toISOString()}.xls`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderExportButtons = () => (
    <div className="flex justify-end space-x-2 mb-4">
      <button
        onClick={() => exportData('csv')}
        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        <Download className="h-4 w-4 mr-2" />
        CSV
      </button>
      <button
        onClick={() => exportData('excel')}
        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        <Download className="h-4 w-4 mr-2" />
        Excel
      </button>
    </div>
  );

  if (visualization.type === 'table') {
    return (
      <div>
        {renderExportButtons()}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {visualization.selectedFields.map((fieldId) => (
                  <th
                    key={fieldId}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {getFieldLabel(fieldId)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, index) => (
                <tr key={index}>
                  {visualization.selectedFields.map((fieldId) => (
                    <td
                      key={fieldId}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {row.responses?.[fieldId] ?? row[fieldId]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const chartData = data.map((row) => {
    const item: any = {};
    visualization.selectedFields.forEach((fieldId) => {
      item[getFieldLabel(fieldId)] = row.responses?.[fieldId] ?? row[fieldId];
    });
    return item;
  });

  return (
    <div>
      {renderExportButtons()}
      {visualization.type === 'bar' && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={getFieldLabel(visualization.selectedFields[0])} />
            <YAxis />
            <Tooltip />
            <Legend />
            {visualization.selectedFields.slice(1).map((fieldId) => (
              <Bar
                key={fieldId}
                dataKey={getFieldLabel(fieldId)}
                fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}

      {visualization.type === 'line' && (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={getFieldLabel(visualization.selectedFields[0])} />
            <YAxis />
            <Tooltip />
            <Legend />
            {visualization.selectedFields.slice(1).map((fieldId) => (
              <Line
                key={fieldId}
                type="monotone"
                dataKey={getFieldLabel(fieldId)}
                stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}

      {visualization.type === 'pie' && (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey={getFieldLabel(visualization.selectedFields[1])}
              nameKey={getFieldLabel(visualization.selectedFields[0])}
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label
            />
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default VisualizationPreview;