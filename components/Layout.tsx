import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingCart, Calculator, 
  Users, Briefcase, Package, LogOut, Store, Menu, Activity
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Layout: React.FC = () => {
  const { user, logout, settings } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  if (!user) return null;

  const isManager = user.role === 'manager';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar - Enhanced Dark Theme */}
      <aside className="w-72 bg-[#141110] text-white flex flex-col shadow-2xl z-20 border-r border-white/5">
        <div className="p-8 pb-10">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="text-3xl bg-brand-600/20 w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-md border border-brand-600/30 group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-brand-900/40">🐷</div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white leading-tight uppercase">{settings.businessName.split(' ')[0]}</h1>
              <p className="text-[10px] text-brand-400 uppercase tracking-[0.2em] font-black">Staff Terminal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 space-y-8">
          <div>
            <p className="text-[10px] font-black text-brand-500 uppercase tracking-[0.3em] mb-4 opacity-50">Main Ops</p>
            <div className="space-y-1">
              <SidebarLink to="/dashboard" icon={<LayoutDashboard />} label="Performance" />
              <SidebarLink to="/pos" icon={<ShoppingCart />} label="Cashier (POS)" />
            </div>
          </div>

          {isManager && (
            <div>
              <p className="text-[10px] font-black text-brand-500 uppercase tracking-[0.3em] mb-4 opacity-50">Management</p>
              <div className="space-y-1">
                <SidebarLink to="/production" icon={<Calculator />} label="Production" />
                <SidebarLink to="/customers" icon={<Users />} label="Client Base" />
                <SidebarLink to="/employees" icon={<Briefcase />} label="Personnel" />
                <SidebarLink to="/admin" icon={<Package />} label="Stock Control" />
              </div>
            </div>
          )}

          <div className="pt-4 mt-4 border-t border-white/5">
             <NavLink to="/" target="_blank" className="flex items-center px-4 py-3 rounded-xl text-sm font-bold text-brand-300 hover:text-white hover:bg-white/5 transition-all group">
                <Store className="w-5 h-5 mr-4 group-hover:scale-110 transition-transform" />
                Public Shop
             </NavLink>
          </div>
        </nav>

        {/* User Card */}
        <div className="p-6">
          <div className="p-4 bg-brand-800/20 rounded-2xl border border-white/5 backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-600 border border-brand-500 flex items-center justify-center text-sm font-black text-white mr-3 shadow-lg">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-black text-white truncate">{user.name}</p>
                <p className="text-[10px] text-brand-400 uppercase font-black">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center w-full px-4 py-2.5 text-xs font-black text-brand-200 bg-white/5 hover:bg-red-500/20 hover:text-red-100 rounded-xl transition-all duration-300 group"
            >
              <LogOut className="w-3.5 h-3.5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Exit Session
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 relative">
        <header className="h-20 border-b border-gray-200/60 bg-white/80 backdrop-blur-xl flex items-center justify-between px-10 sticky top-0 z-10">
           <div className="flex items-center gap-4">
              <button className="md:hidden p-2 text-gray-500"><Menu /></button>
              <div className="hidden md:block">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Terminal</p>
                 <h2 className="text-sm font-black text-gray-900">Station 01-A</h2>
              </div>
           </div>
           <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Local Time</p>
                <p className="text-xs font-black text-gray-900">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full border border-emerald-100 shadow-sm shadow-emerald-100/50">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">System Online</span>
              </div>
           </div>
        </header>
        <div className="p-10 max-w-[1800px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const SidebarLink: React.FC<{to: string, icon: React.ReactNode, label: string}> = ({to, icon, label}) => (
  <NavLink to={to} className={({ isActive }) => 
    `flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 group ${
      isActive 
        ? 'bg-brand-600 text-white shadow-xl shadow-brand-600/20 scale-[1.02]' 
        : 'text-brand-300/60 hover:bg-white/5 hover:text-white'
    }`
  }>
    <span className="w-6 h-6 mr-4 opacity-70 group-hover:opacity-100 transition-opacity">
      {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
    </span>
    {label}
  </NavLink>
);

export default Layout;