import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, LogOut, User, Shield, UserCog, ChevronDown, ChevronUp, Calendar, Bell } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useMessageStore } from '../stores/messageStore';
import { useAcademicYearStore } from '../stores/academicYearStore';
import Logo from './Logo';
import UserProfileModal from './profile/UserProfileModal';
import NotificationsPopup from './notifications/NotificationsPopup';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const { user, isAuthenticated, logout, activeRole, setActiveRole } = useAuthStore();
  const { settings } = useSettingsStore();
  const { activeYear } = useAcademicYearStore();
  const { getUnreadCount } = useMessageStore();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = getUnreadCount();

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'gestor':
        return 'Gestor';
      case 'coordinador_subred':
        return 'Coordinador de Subred';
      case 'coordinador_general':
        return activeRole === 'admin' ? 'Administrador' : 'Coordinador General';
      default:
        return role;
    }
  };

  return (
    <nav className={`h-16 ${className}`} style={{ backgroundColor: settings.colors.navbar.from }}>
      <div className="h-full flex items-center px-4">
        <Link to="/" className="flex items-center">
          <Logo 
            imageClassName="h-12 py-1" 
            textClassName="ml-3 text-xl font-semibold text-white"
            invertColors={true}
          />
        </Link>
        
        {activeYear && (
          <div className="ml-8 flex items-center text-white/90">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">{activeYear.year}</span>
          </div>
        )}
        
        <div className="flex-1 flex justify-end items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="flex flex-col items-end text-white">
                <div className="flex items-center">
                  {user?.role === 'coordinador_general' && (
                    <div className="relative mr-4">
                      <button
                        onClick={() => setShowRoleMenu(!showRoleMenu)}
                        className="flex items-center px-3 py-1 text-sm bg-white/10 rounded hover:bg-white/20 transition-colors"
                      >
                        {activeRole === 'admin' ? (
                          <Shield className="h-4 w-4 mr-2" />
                        ) : (
                          <UserCog className="h-4 w-4 mr-2" />
                        )}
                        <span>{activeRole === 'admin' ? 'Administrador' : 'Coordinador'}</span>
                        {showRoleMenu ? (
                          <ChevronUp className="h-4 w-4 ml-2" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-2" />
                        )}
                      </button>
                      {showRoleMenu && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                          <button
                            onClick={() => {
                              setActiveRole('admin');
                              setShowRoleMenu(false);
                            }}
                            className={`w-full flex items-center px-4 py-2 text-sm ${
                              activeRole === 'admin'
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Administrador
                          </button>
                          <button
                            onClick={() => {
                              setActiveRole('coordinator');
                              setShowRoleMenu(false);
                            }}
                            className={`w-full flex items-center px-4 py-2 text-sm ${
                              activeRole === 'coordinator'
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <UserCog className="h-4 w-4 mr-2" />
                            Coordinador
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="mr-4 text-white hover:text-white/80 transition-colors relative"
                    >
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    {showNotifications && (
                      <NotificationsPopup onClose={() => setShowNotifications(false)} />
                    )}
                  </div>

                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="flex items-center hover:bg-white/10 rounded-full p-1 transition-colors"
                  >
                    {user?.photo ? (
                      <img
                        src={user.photo}
                        alt={user.nombre}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 mr-2" />
                    )}
                    <span className="text-sm font-medium ml-2">{user?.nombre}</span>
                  </button>
                </div>
                <div className="text-xs mt-0.5 text-white/80">
                  <span>{getRoleLabel(user?.role || '')}</span>
                  {user?.role === 'coordinador_subred' && user?.subred && (
                    <span> · {user.subred}</span>
                  )}
                  {user?.role === 'gestor' && user?.centro && (
                    <span> · {user.centro}</span>
                  )}
                </div>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-900 focus:ring-white transition-all"
                style={{ color: settings.colors.navbar.from }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-900 focus:ring-white transition-all"
              style={{ color: settings.colors.navbar.from }}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>

      {showProfileModal && <UserProfileModal onClose={() => setShowProfileModal(false)} />}
    </nav>
  );
};

export default Navbar;