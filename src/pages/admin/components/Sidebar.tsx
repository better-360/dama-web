import { NavItem } from '../types/navigation';
import { LayoutDashboard, Users, Calendar, ClipboardList, Settings } from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isOpen: boolean;
  user: { email: string } | null;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
  { name: 'Başvurular', path: '/applications', icon: 'ClipboardList' },
  { name: 'Müvekkiller', path: '/clients', icon: 'Users' },
  { name: 'Randevular', path: '/appointments', icon: 'Calendar' },
  { name: 'Ayarlar', path: '/settings', icon: 'Settings' },
];

const iconMap = {
  LayoutDashboard,
  ClipboardList,
  Users,
  Calendar,
  Settings,
};

export default function Sidebar({ currentPath, onNavigate, isOpen, user }: SidebarProps) {
  return (
    <div className={`
      fixed top-0 left-0 h-screen bg-[#292A2D] text-white
      transform transition-transform duration-300 ease-in-out z-50
      w-64 flex flex-col
      lg:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      {/* Logo Section */}
      <div className="p-6 flex-shrink-0">
        <h1 className="text-2xl font-bold text-[#E2E0D6]">DAMA Advisors</h1>
      </div>
      
      {/* Navigation Section */}
      <nav className="flex-1 px-4 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive = currentPath === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 mb-2 rounded-lg transition-all ${
                isActive 
                  ? 'bg-[#E2E0D6] text-[#292A2D]' 
                  : 'hover:bg-white/10'
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>
      
      {/* Admin User Section - Now at the bottom */}
      <div className="mt-auto p-6 border-t border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#E2E0D6]"></div>
          <div>
            <p className="font-medium">Admin User</p>
            <p className="text-sm text-white/60">{user?.email || 'admin@dama.com'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}