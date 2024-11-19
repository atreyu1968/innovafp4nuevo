import React, { useState } from 'react';
import { Settings, X, Move, ChevronUp, ChevronDown } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DashboardWidget } from '../../types/dashboard';
import DashboardWidgetSettings from './DashboardWidgetSettings';
import DashboardWidgetPreview from './DashboardWidgetPreview';

interface DashboardWidgetBuilderProps {
  widget: DashboardWidget;
  onUpdate: (updates: Partial<DashboardWidget>) => void;
  onDelete: () => void;
}

const DashboardWidgetBuilder: React.FC<DashboardWidgetBuilderProps> = ({
  widget,
  onUpdate,
  onDelete,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    gridColumn: `span ${widget.width}`,
    gridRow: `span ${widget.height}`,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border rounded-lg shadow-sm relative group"
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-medium">{widget.title}</h3>
        <div className="flex items-center space-x-2">
          <button
            {...attributes}
            {...listeners}
            className="p-1 text-gray-400 hover:text-gray-500 cursor-move"
            title="Mover widget"
          >
            <Move className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-1 text-gray-400 hover:text-gray-500"
            title="Configuración"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 text-gray-400 hover:text-gray-500"
            title={isCollapsed ? "Expandir" : "Contraer"}
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-gray-500"
            title="Eliminar widget"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4">
          <DashboardWidgetPreview widget={widget} />
        </div>
      )}

      {showSettings && (
        <DashboardWidgetSettings
          widget={widget}
          onUpdate={(updates) => {
            onUpdate(updates);
            setShowSettings(false);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default DashboardWidgetBuilder;