import React from 'react';
import { useSettingsStore } from '../stores/settingsStore';

interface LogoProps {
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  invertColors?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className = "flex items-center", 
  imageClassName = "h-10",
  textClassName = "ml-3 text-xl font-semibold text-white",
  invertColors = false
}) => {
  const { settings } = useSettingsStore();
  
  return (
    <div className={className}>
      <img 
        src={settings.logo}
        alt={settings.name}
        className={`${imageClassName} ${invertColors ? 'brightness-0 invert' : ''}`}
        style={{ filter: invertColors ? 'brightness(0) invert(1)' : undefined }}
      />
      <span className={textClassName}>
        {settings.name}
      </span>
    </div>
  );
};

export default Logo;