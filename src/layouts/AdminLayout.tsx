import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  LogOut,
  Bell, 
  Search,
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  Settings
} from 'lucide-react';
import { useAppSelector } from '../store/hooks';
import { removeTokens } from '../utils/storage';

// Types
interface NavItem {
  name: string;
  path: string;
  icon: string;
  description?: string;
}


const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userdata=useAppSelector(state=>state.user.userData);
  
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    removeTokens();
    navigate('/login');
  };

  const navigation: NavItem[] = [
    { name: 'Dashboard', path: '/admin/', icon: 'LayoutDashboard', description: 'Genel bakış ve istatistikler' },
    { name: 'Başvurular', path: '/admin/applications', icon: 'ClipboardList', description: 'Başvurular ve yanıtları' },
    { name: 'Müvekkiller', path: '/admin/clients', icon: 'Users', description: 'Müvekkil bilgileri' },
    { name: 'Randevular', path: '/admin/appointments', icon: 'Calendar', description: 'Randevu takibi ve planlaması' },
    { name: 'Ayarlar', path: '/admin/settings', icon: 'Settings', description: 'Sistem ayarları' },
  ];

  const iconMap = {
    LayoutDashboard,
    ClipboardList,
    Users,
    Calendar,
    Settings,
  };

  const getPageTitle = () => {
    const currentItem = navigation.find(item => 
      location.pathname === item.path || 
      (item.path !== '/admin/' && location.pathname.startsWith(item.path))
    );
    return currentItem?.name || 'Dashboard';
  };
  
  return (
    <div className="min-h-screen bg-[#E2E0D6]/10">
      {/* Floating Menu Button (Mobile Only) */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-6 right-6 z-50 lg:hidden bg-[#292A2D] text-white p-3 rounded-full shadow-lg hover:bg-[#292A2D]/90 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen bg-[#292A2D] text-white
        transform transition-transform duration-300 ease-in-out z-50
        w-64 flex flex-col
        lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Section */}
        <div className="p-6 flex-shrink-0">
          <Link to="/" className="text-2xl font-bold text-[#E2E0D6]">DAMA Advisors</Link>
        </div>
        
        {/* Navigation Section */}
        <nav className="flex-1 px-4 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const isActive = location.pathname === item.path || 
                            (item.path !== '/admin/' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center space-x-3 px-4 py-3 mb-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#E2E0D6] text-[#292A2D]'
                    : 'hover:bg-white/10'
                }`}
              >
                <Icon size={20} />
                <div>
                  <span>{item.name}</span>
                  {item.description && (
                    <div className="text-xs opacity-70">{item.description}</div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
        
        {/* Admin User Section */}
        <div className="mt-auto p-6 border-t border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#E2E0D6]"></div>
            <div>
              <p className="font-medium">Admin User</p>
              <p className="text-sm text-white/60">{userdata?.email || 'admin@dama.com'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-gray-200 bg-white">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
          </div>
          
           
           <div className="flex items-center space-x-4">
           {/*  <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Ara..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#292A2D] focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
            Mobile Search Button
            {/* Notifications *
            <div className="relative">
              <button
                className="relative p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900">Bildirimler</h3>
                    <div className="mt-2 space-y-2">
                      <a href="#" className="block px-4 py-3 rounded-lg hover:bg-gray-50">
                        <p className="text-sm font-medium text-gray-900">Yeni başvuru</p>
                        <p className="text-sm text-gray-500">Yeni bir iş başvurusu alındı</p>
                        <p className="text-xs text-gray-400 mt-1">5 dakika önce</p>
                      </a>
                      <a href="#" className="block px-4 py-3 rounded-lg hover:bg-gray-50">
                        <p className="text-sm font-medium text-gray-900">Yeni randevu talebi</p>
                        <p className="text-sm text-gray-500">Yarın 14:00 için randevu talebi</p>
                        <p className="text-xs text-gray-400 mt-1">1 saat önce</p>
                      </a>
                    </div>
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <a href="#" className="block text-center text-sm font-medium text-[#292A2D] hover:text-[#292A2D]/80">
                        Tüm bildirimleri görüntüle
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div> */}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-[#292A2D] hover:bg-[#292A2D]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#292A2D]"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Çıkış
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;