import React from 'react';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 rounded cursor-pointer"
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          pattern="^#[0-9A-Fa-f]{6}$"
          placeholder="#000000"
        />
      </div>
    </div>
  );
};

export default ColorPicker;