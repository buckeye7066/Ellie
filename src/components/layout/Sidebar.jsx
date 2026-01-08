import { NavLink } from 'react-router-dom';
import { Sparkles, Home, Brain, BookOpen, Upload, Settings, User } from 'lucide-react';
import { cn } from '../../lib/utils';

const Sidebar = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/memories', icon: Brain, label: 'Memories' },
    { to: '/study', icon: BookOpen, label: 'Study' },
    { to: '/import', icon: Upload, label: 'Import' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex flex-col h-screen w-64 bg-gradient-to-b from-purple-600 to-pink-600 text-white shadow-xl">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-yellow-300" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
            Ellie
          </h1>
        </div>
        <p className="text-sm text-white/80 mt-1">Your AI Assistant</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-white/20 shadow-lg"
                  : "hover:bg-white/10"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Status Footer */}
      <div className="p-4 border-t border-white/20">
        <div className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-pink-300 flex items-center justify-center">
            <User className="w-6 h-6 text-purple-700" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">User</p>
            <p className="text-xs text-white/70">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
