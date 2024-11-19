import React, { useState } from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import { DashboardWidget } from '../../types/dashboard';
import { useDashboardStore } from '../../stores/dashboardStore';
import { useFormStore } from '../../stores/formStore';

interface PivotTableWidgetProps {
  widget: DashboardWidget;
}

const PivotTableWidget: React.FC<PivotTableWidgetProps> = ({ widget }) => {
  const { getWidgetData } = useDashboardStore();
  const { forms } = useFormStore();
  const [pivotState, setPivotState] = useState({});

  const data = getWidgetData(widget);

  // Transformar los datos para la tabla dinámica
  const pivotData = data.map(row => {
    const transformedRow: any = {};
    widget.config.fields?.forEach(fieldId => {
      const field = forms
        .find(f => f.id === widget.config.formIds[0])
        ?.fields.find(f => f.id === fieldId);
      
      if (field) {
        transformedRow[field.label] = row.responses?.[fieldId] ?? row[fieldId];
      }
    });
    return transformedRow;
  });

  return (
    <div className="overflow-x-auto">
      <PivotTableUI
        data={pivotData}
        onChange={s => setPivotState(s)}
        {...pivotState}
        rendererOptions={{ table: { className: 'table-auto' } }}
      />
    </div>
  );
};

export default PivotTableWidget;