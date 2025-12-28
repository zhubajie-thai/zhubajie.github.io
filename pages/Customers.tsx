import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Customer, Sale } from '../types';
import { 
  User, Award, Trash2, Edit2, Search, Plus, MapPin, Phone, Mail, 
  Calendar, DollarSign, ShoppingBag, ChevronRight, X, Save
} from 'lucide-react';

const Customers: React.FC = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer, sales, user } = useStore();
  
  // UI State
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<'All' | 'Gold' | 'Silver' | 'Bronze'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  // Form State
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '', phone: '', email: '', address: ''
  });

  // -- Derived Data --
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  
  const customerHistory = useMemo(() => {
    if (!selectedCustomerId) return [];
    return sales
      .filter(s => s.customerId === selectedCustomerId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [sales, selectedCustomerId]);

  const lastVisit = customerHistory.length > 0 
    ? new Date(customerHistory[0].timestamp).toLocaleDateString() 
    : 'Never';
    
  const avgOrderValue = customerHistory.length > 0 
    ? (selectedCustomer?.totalPurchases || 0) / customerHistory.length 
    : 0;

  // -- Logic --
  const getTier = (points: number) => {
    if (points >= 5000) return { name: 'Gold', color: 'text-amber-600 bg-amber-100', icon: '🏆', next: 10000, nextName: 'Platinum' };
    if (points >= 2500) return { name: 'Silver', color: 'text-slate-600 bg-slate-100', icon: '🥈', next: 5000, nextName: 'Gold' };
    return { name: 'Bronze', color: 'text-orange-700 bg-orange-100', icon: '🥉', next: 2500, nextName: 'Silver' };
  };

  const handleOpenAdd = () => {
    setModalMode('add');
    setFormData({ name: '', phone: '', email: '', address: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = () => {
    if (!selectedCustomer) return;
    setModalMode('edit');
    setFormData({
      name: selectedCustomer.name,
      phone: selectedCustomer.phone,
      email: selectedCustomer.email,
      address: selectedCustomer.address
    });
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    if (selectedCustomer && confirm(`Delete customer ${selectedCustomer.name}?`)) {
      deleteCustomer(selectedCustomer.id);
      setSelectedCustomerId(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const newId = Date.now();
      addCustomer({
        id: newId,
        name: formData.name!,
        phone: formData.phone!,
        email: formData.email,
        address: formData.address,
        points: 0,
        totalPurchases: 0,
        registeredDate: new Date().toLocaleDateString()
      });
      setSelectedCustomerId(newId);
    } else {
      if (selectedCustomer) {
        updateCustomer({
          ...selectedCustomer,
          name: formData.name!,
          phone: formData.phone!,
          email: formData.email,
          address: formData.address
        });
      }
    }
    setIsModalOpen(false);
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery);
    const tier = getTier(c.points).name;
    const matchesTier = filterTier === 'All' || tier === filterTier;
    return matchesSearch && matchesTier;
  });

  // -- Render --
  return (
    <div className="flex h-[calc(100vh-2rem)] gap-6 relative">
      
      {/* --- Left Column: List --- */}
      <div className="w-1/3 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 bg-white z-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Customers</h2>
            <button onClick={handleOpenAdd} className="bg-brand-600 hover:bg-brand-700 text-white p-2 rounded-lg transition-colors" title="Add Customer">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-500 text-sm"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {['All', 'Gold', 'Silver', 'Bronze'].map(tier => (
              <button
                key={tier}
                onClick={() => setFilterTier(tier as any)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  filterTier === tier 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filteredCustomers.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No customers found</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredCustomers.map(c => {
                const tier = getTier(c.points);
                const isSelected = selectedCustomerId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCustomerId(c.id)}
                    className={`w-full p-4 flex items-center text-left transition-all hover:bg-gray-50 ${isSelected ? 'bg-brand-50 border-l-4 border-brand-500' : 'border-l-4 border-transparent'}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold mr-3 shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className={`font-semibold truncate ${isSelected ? 'text-brand-900' : 'text-gray-800'}`}>{c.name}</h3>
                        <span className="text-xs text-gray-400">{new Date(c.registeredDate).toLocaleDateString(undefined, {month:'short', year:'2-digit'})}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-500 truncate">{c.phone}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${tier.color}`}>
                          {tier.name}
                        </span>
                      </div>
                    </div>
                    {isSelected && <ChevronRight className="w-4 h-4 text-brand-400 ml-2" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* --- Right Column: Details --- */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {selectedCustomer ? (
          <>
            {/* Header / Banner */}
            <div className="relative h-32 bg-gradient-to-r from-gray-800 to-gray-900">
               <div className="absolute -bottom-10 left-8">
                 <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center text-3xl font-bold text-gray-300">
                   {selectedCustomer.name.charAt(0)}
                 </div>
               </div>
               <div className="absolute top-4 right-4 flex gap-2">
                 <button onClick={handleOpenEdit} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors" title="Edit Profile">
                   <Edit2 className="w-4 h-4" />
                 </button>
                 <button onClick={handleDelete} className="p-2 bg-white/10 hover:bg-red-500/80 text-white rounded-lg backdrop-blur-sm transition-colors" title="Delete Profile">
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
            </div>

            {/* Main Content */}
            <div className="mt-12 px-8 pb-8 flex-1 overflow-y-auto">
              
              {/* Basic Info */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  {selectedCustomer.name}
                  <span className={`text-sm px-3 py-1 rounded-full font-medium ${getTier(selectedCustomer.points).color} flex items-center gap-1`}>
                    {getTier(selectedCustomer.points).icon} {getTier(selectedCustomer.points).name} Member
                  </span>
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" /> {selectedCustomer.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" /> {selectedCustomer.email || 'No email provided'}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" /> {selectedCustomer.address || 'No address provided'}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Spent</p>
                  <p className="text-xl font-bold text-gray-800">{user?.currency} {selectedCustomer.totalPurchases.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Avg Order Value</p>
                  <p className="text-xl font-bold text-gray-800">{user?.currency} {avgOrderValue.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Last Visit</p>
                  <p className="text-xl font-bold text-gray-800">{lastVisit}</p>
                </div>
              </div>

              {/* Loyalty Card */}
              <div className="bg-gradient-to-br from-brand-900 to-brand-700 rounded-xl p-6 text-white mb-8 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                <div className="relative z-10">
                   <div className="flex justify-between items-start mb-6">
                     <div>
                       <p className="text-brand-200 text-sm font-medium mb-1">Loyalty Points</p>
                       <p className="text-4xl font-bold">{selectedCustomer.points.toLocaleString()}</p>
                     </div>
                     <Award className="w-12 h-12 text-brand-300 opacity-80" />
                   </div>
                   
                   <div className="space-y-2">
                      <div className="flex justify-between text-xs text-brand-200">
                        <span>Current: {getTier(selectedCustomer.points).name}</span>
                        <span>Next: {getTier(selectedCustomer.points).nextName}</span>
                      </div>
                      <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-200 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(100, (selectedCustomer.points / getTier(selectedCustomer.points).next) * 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-right text-brand-200">
                        {getTier(selectedCustomer.points).next - selectedCustomer.points} points to upgrade
                      </p>
                   </div>
                </div>
              </div>

              {/* Transaction History */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-600" /> Purchase History
                </h3>
                {customerHistory.length === 0 ? (
                  <div className="p-8 text-center bg-gray-50 rounded-xl text-gray-500">
                    No purchase history available.
                  </div>
                ) : (
                  <div className="overflow-hidden border border-gray-100 rounded-xl">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                        <tr>
                          <th className="px-4 py-3">Order ID</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Items</th>
                          <th className="px-4 py-3 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {customerHistory.map(sale => (
                          <tr key={sale.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-mono text-gray-600">#{sale.id.slice(-6)}</td>
                            <td className="px-4 py-3 text-gray-600">{new Date(sale.timestamp).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-gray-600">{sale.items.length} items</td>
                            <td className="px-4 py-3 text-right font-medium text-gray-900">{user?.currency} {sale.total.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
            <User className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">Select a customer</p>
            <p className="text-sm">View details, loyalty status, and history</p>
          </div>
        )}
      </div>

      {/* --- Add/Edit Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-[popIn_0.2s_ease-out]">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {modalMode === 'add' ? 'Add New Customer' : 'Edit Customer'}
            </h3>
            <p className="text-sm text-gray-500 mb-6">Enter customer details below.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Full Name</label>
                <input 
                  required 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Phone Number</label>
                <input 
                  required 
                  type="tel" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all" 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="e.g. 0912 345 6789" 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="Optional" 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Address</label>
                <textarea 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all" 
                  rows={3}
                  value={formData.address} 
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  placeholder="Optional delivery address" 
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 shadow-lg hover:shadow-xl transition-all"
                >
                  {modalMode === 'add' ? 'Create Profile' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;