import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  DollarSign, ShoppingBag, Users, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Package, ChevronRight, Activity, Zap
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { products, sales, customers, user, settings } = useStore();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('Today');

  const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);
  const totalOrders = sales.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  const revenueData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, i) => ({
      name: day,
      revenue: Math.floor(Math.random() * 2000) + 1000 + (i === 6 ? totalRevenue / 10 : 0),
    }));
  }, [totalRevenue]);

  const lowStockThreshold = settings?.lowStockLevel ?? 10;
  const lowStockItems = products.filter(p => p.stock <= lowStockThreshold);
  const recentSales = [...sales].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Dashboard <Zap className="w-8 h-8 text-brand-600 fill-brand-600" />
          </h1>
          <p className="text-gray-500 font-bold mt-1 uppercase text-[11px] tracking-widest">Operational Insights for {settings.businessName}</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl border border-gray-200 shadow-sm">
           {['Today', 'Week', 'Month'].map(range => (
             <button 
               key={range}
               onClick={() => setDateRange(range)}
               className={`px-6 py-2.5 text-xs font-black rounded-xl uppercase tracking-widest transition-all ${
                 dateRange === range 
                   ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20' 
                   : 'text-gray-400 hover:text-gray-900'
               }`}
             >
               {range}
             </button>
           ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Revenue" value={`${user?.currency || settings.currency}${totalRevenue.toLocaleString()}`} icon={<DollarSign />} trend="+12.5%" color="brand" />
        <MetricCard title="Total Sales" value={totalOrders.toString()} icon={<ShoppingBag />} trend="+5.2%" color="emerald" />
        <MetricCard title="Avg Transaction" value={`${user?.currency || settings.currency}${avgOrderValue.toFixed(2)}`} icon={<TrendingUp />} trend="-2.1%" trendDown color="amber" />
        <MetricCard title="Active Leads" value={customers.length.toString()} icon={<Users />} trend={`+${customers.length}`} color="indigo" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col h-[450px]">
           <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Revenue Forecast</h3>
              <Activity className="w-5 h-5 text-brand-300" />
           </div>
           <div className="flex-1">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#977669" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#977669" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 800}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 800}} />
                  <Tooltip 
                    cursor={{stroke: '#977669', strokeWidth: 2}}
                    contentStyle={{backgroundColor: '#1f2937', color: '#fff', borderRadius: '16px', border: 'none', padding: '12px'}}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#977669" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-gray-900 p-8 rounded-[2.5rem] shadow-2xl flex flex-col h-[450px] text-white">
           <div className="mb-8">
              <h3 className="font-black uppercase text-[10px] tracking-widest text-brand-400">Inventory Status</h3>
              <p className="text-2xl font-black mt-2">Low Stock Alerts</p>
           </div>
           
           <div className="flex-1 overflow-y-auto pr-2 space-y-4">
             {lowStockItems.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center opacity-30">
                 <Package className="w-12 h-12 mb-3" />
                 <p className="text-sm font-bold">All stock healthy</p>
               </div>
             ) : (
               lowStockItems.map(item => (
                 <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-colors">
                    <div className="text-3xl bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center">{item.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black truncate">{item.name}</p>
                      <p className="text-[10px] text-brand-500 font-black uppercase">{item.stock} {item.unit} Remaining</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
                 </div>
               ))
             )}
           </div>
           
           <button onClick={() => navigate('/admin')} className="mt-6 w-full py-4 bg-brand-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-brand-500 transition-colors shadow-xl shadow-brand-600/20">
             Open Inventory Manager
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
         <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <div>
              <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Transaction Log</h3>
              <p className="text-xs text-gray-400 font-bold mt-1">Showing latest 5 orders</p>
            </div>
            <button onClick={() => navigate('/pos')} className="text-[10px] bg-brand-600 text-white px-6 py-2.5 rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-brand-600/20">Launch Terminal</button>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-left">
             <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
               <tr>
                 <th className="px-10 py-5">Order ID</th>
                 <th className="px-10 py-5">Client</th>
                 <th className="px-10 py-5">Value</th>
                 <th className="px-10 py-5">Type</th>
                 <th className="px-10 py-5 text-right">Processed At</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
               {recentSales.map(sale => (
                 <tr key={sale.id} className="hover:bg-brand-50/20 transition-colors">
                   <td className="px-10 py-6 font-mono text-xs font-black text-brand-700">#SHP-{sale.id.slice(-6).toUpperCase()}</td>
                   <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-black text-xs text-gray-400">{sale.customerName[0]}</div>
                        <span className="text-sm font-black text-gray-900">{sale.customerName}</span>
                      </div>
                   </td>
                   <td className="px-10 py-6 text-sm font-black text-gray-900">{user?.currency || settings.currency}{sale.total.toFixed(2)}</td>
                   <td className="px-10 py-6">
                     <span className="px-3 py-1 bg-gray-100 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-500 border border-gray-200">{sale.orderType}</span>
                   </td>
                   <td className="px-10 py-6 text-[10px] font-black text-gray-400 text-right uppercase">
                     {new Date(sale.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{title: string, value: string, icon: React.ReactNode, trend: string, color: string, trendDown?: boolean}> = 
  ({title, value, icon, trend, color, trendDown}) => {
  const themes: Record<string, string> = {
    brand: 'bg-brand-50 text-brand-600 border-brand-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  };
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl border ${themes[color] || themes.brand} group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
          {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${trendDown ? 'text-red-600 bg-red-50 border border-red-100' : 'text-emerald-600 bg-emerald-50 border border-emerald-100'}`}>
          {trendDown ? <ArrowDownRight className="w-3 h-3"/> : <ArrowUpRight className="w-3 h-3"/>}
          {trend}
        </div>
      </div>
      <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</p>
      <h3 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h3>
    </div>
  );
};

export default Dashboard;