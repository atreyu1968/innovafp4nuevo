import React from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { ExternalLink } from 'lucide-react';
import { DashboardWidget } from '../../types/dashboard';
import { useDashboardStore } from '../../stores/dashboardStore';
import { useFormStore } from '../../stores/formStore';
import PivotTableWidget from './PivotTableWidget';

interface DashboardWidgetPreviewProps {
  widget: DashboardWidget;
  isEditing?: boolean;
}

const DashboardWidgetPreview: React.FC<DashboardWidgetPreviewProps> = ({ widget, isEditing = false }) => {
  const { getWidgetData } = useDashboardStore();
  const { forms } = useFormStore();

  const getFieldLabel = (fieldId: string) => {
    for (const formId of widget.config.formIds || []) {
      const form = forms.find((f) => f.id === formId);
      const field = form?.fields.find((f) => f.id === fieldId);
      if (field) return field.label;
    }
    return fieldId;
  };

  if (widget.type === 'text') {
    return (
      <div
        className="h-full w-full overflow-auto p-4"
        style={{
          backgroundColor: widget.config.backgroundColor || 'transparent',
          color: widget.config.textColor || 'inherit',
          textAlign: widget.config.textAlign || 'left',
          borderRadius: widget.config.borderRadius || '0.375rem',
          padding: widget.config.padding || '1rem',
          fontSize: widget.config.fontSize === 'large' ? '1.25rem' : 
                   widget.config.fontSize === 'small' ? '0.875rem' : '1rem'
        }}
      >
        {widget.config.content}
      </div>
    );
  }

  if (widget.type === 'link') {
    return (
      <div className="h-full w-full p-4 flex flex-wrap gap-2">
        {widget.config.links?.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors"
            style={{
              backgroundColor: link.color || '#3b82f6',
              color: '#ffffff'
            }}
          >
            {link.icon && <span className="mr-2">{link.icon}</span>}
            {link.text}
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        ))}
      </div>
    );
  }

  if (widget.type === 'pivot') {
    return <PivotTableWidget widget={widget} />;
  }

  if (widget.type === 'table') {
    const data = getWidgetData(widget);
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {widget.config.fields?.map((fieldId) => (
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
                {widget.config.fields?.map((fieldId) => (
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
    );
  }

  if (widget.type === 'chart') {
    const data = getWidgetData(widget);
    const chartData = data.map((row) => {
      const item: any = {};
      widget.config.fields?.forEach((fieldId) => {
        item[getFieldLabel(fieldId)] = row.responses?.[fieldId] ?? row[fieldId];
      });
      return item;
    });

    const commonProps = {
      width: '100%',
      height: 300,
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    const renderChart = () => {
      switch (widget.config.chartType) {
        case 'bar':
          return (
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={getFieldLabel(widget.config.fields?.[0] || '')} />
              <YAxis />
              <Tooltip />
              <Legend />
              {widget.config.fields?.slice(1).map((fieldId, index) => (
                <Bar
                  key={fieldId}
                  dataKey={getFieldLabel(fieldId)}
                  fill={widget.config.colors?.[index] || `#${Math.floor(Math.random()*16777215).toString(16)}`}
                />
              ))}
            </BarChart>
          );

        case 'line':
          return (
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={getFieldLabel(widget.config.fields?.[0] || '')} />
              <YAxis />
              <Tooltip />
              <Legend />
              {widget.config.fields?.slice(1).map((fieldId, index) => (
                <Line
                  key={fieldId}
                  type="monotone"
                  dataKey={getFieldLabel(fieldId)}
                  stroke={widget.config.colors?.[index] || `#${Math.floor(Math.random()*16777215).toString(16)}`}
                />
              ))}
            </LineChart>
          );

        case 'area':
          return (
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={getFieldLabel(widget.config.fields?.[0] || '')} />
              <YAxis />
              <Tooltip />
              <Legend />
              {widget.config.fields?.slice(1).map((fieldId, index) => (
                <Area
                  key={fieldId}
                  type="monotone"
                  dataKey={getFieldLabel(fieldId)}
                  fill={widget.config.colors?.[index] || `#${Math.floor(Math.random()*16777215).toString(16)}`}
                />
              ))}
            </AreaChart>
          );

        case 'pie':
          return (
            <PieChart width={400} height={300}>
              <Pie
                data={chartData}
                dataKey={getFieldLabel(widget.config.fields?.[1] || '')}
                nameKey={getFieldLabel(widget.config.fields?.[0] || '')}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              />
              <Tooltip />
              <Legend />
            </PieChart>
          );

        default:
          return null;
      }
    };

    return (
      <div className="h-full w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex items-center justify-center text-gray-500">
      Vista previa no disponible
    </div>
  );
};

export default DashboardWidgetPreview;