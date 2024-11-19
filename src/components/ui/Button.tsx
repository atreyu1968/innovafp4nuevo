import React from 'react';
import { useSettingsStore } from '../../stores/settingsStore';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '',
  ...props 
}) => {
  const { settings } = useSettingsStore();

  const baseStyles = "inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";
  
  const variantStyles = {
    primary: {
      backgroundColor: settings.colors.primary,
      color: 'white',
      borderColor: 'transparent',
      hoverBg: settings.colors.secondary,
    },
    secondary: {
      backgroundColor: settings.colors.secondary,
      color: 'white',
      borderColor: 'transparent',
      hoverBg: settings.colors.primary,
    },
    outline: {
      backgroundColor: 'transparent',
      color: settings.colors.primary,
      borderColor: settings.colors.primary,
      hoverBg: settings.colors.primary + '10',
    },
  };

  const style = variantStyles[variant];

  return (
    <button
      className={`${baseStyles} ${className}`}
      style={{
        backgroundColor: style.backgroundColor,
        color: style.color,
        borderColor: style.borderColor,
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;