import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';

interface MenuItem {
  icon: LucideIcon;
  text: string;
  path: string;
}

interface SidebarProps {
  menuItems: MenuItem[];
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems, className = '' }) => {
  const location = useLocation();
  const { settings } = useSettingsStore();

  return (
    <aside className={className} style={{ backgroundColor: settings.colors.sidebar }}>
      <nav className="h-full">
        <div className="px-2 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.text}
                to={item.path}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-600 hover:bg-opacity-75 hover:text-gray-900'
                }`}
                style={{
                  backgroundColor: isActive ? settings.colors.primary : 'transparent',
                }}
              >
                <Icon
                  className={`mr-3 h-5 w-5 ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.text}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;