import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { 
  Package, Settings as SettingsIcon, ClipboardList, Trash2, Edit2, 
  Search, Plus, Save, DollarSign, AlertCircle, Barcode, Tag, X
} from 'lucide-react';

const Admin: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, settings, updateSettings, productionPlans } = useStore();
  const [activeTab, setActiveTab] = useState<'inventory' | 'history' | 'settings'>('inventory');

  // -- Inventory State --
  const [searchQuery, setSearchQuery] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productModalMode, setProductModalMode] = useState<'add' | 'edit'>('add');
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '', category: 'Fresh', price: 0, stock: 0, unit: 'kg', icon: '📦', barcode: ''
  });

  // -- Settings State --
  const [settingsForm, setSettingsForm] = useState(settings);

  // -- Inventory Handlers --
  const handleOpenAddProduct = () => {
    setProductModalMode('add');
    setProductForm({ name: '', category: 'Fresh', price: 0, stock: 0, unit: 'kg', icon: '📦', barcode: '' });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setProductModalMode('edit');
    setProductForm({ ...p });
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = productForm as Product;
    if (productModalMode === 'add') {
      addProduct({ ...p, id: Date.now() });
    } else {
      updateProduct(p);
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('Delete this product permanently?')) {
      deleteProduct(id);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // -- Settings Handlers --
  const handleSaveSettings = () => {
    updateSettings(settingsForm);
    alert('System settings updated successfully.');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Console</h1>
          <p className="text-gray-500 font-medium mt-1">Manage inventory, reports, and system configuration.</p>
        </div>
        
        <div className="bg-gray-100/50 p-1.5 rounded-xl flex gap-1 border border-gray-200">
           {[
             { id: 'inventory', icon: Package, label: 'Inventory' },
             { id: 'history', icon: ClipboardList, label: 'Logs' },
             { id: 'settings', icon: SettingsIcon, label: 'Settings' }
           ].map((tab) => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                 activeTab === tab.id 
                 ? 'bg-white text-gray-900 shadow-sm' 
                 : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
               }`}
             >
               <tab.icon className="w-4 h-4 mr-2" /> {tab.label}
             </button>
           ))}
        </div>
      </div>

      {/* --- Tab Content --- */}
      
      {/* 1. Inventory Management */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-[600px] animate-slideUp">
          <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
             <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
             </div>
             <button 
               onClick={handleOpenAddProduct}
               className="bg-gray-900 hover:bg-black text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center shadow-lg transition-all"
             >
               <Plus className="w-4 h-4 mr-2" /> New Product
             </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-8 py-5">Product Name</th>
                  <th className="px-8 py-5">Category</th>
                  <th className="px-8 py-5">Price</th>
                  <th className="px-8 py-5">Stock</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        <span className="w-10 h-10 flex items-center justify-center text-2xl bg-gray-50 rounded-lg mr-4 border border-gray-100">{p.icon}</span>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{p.name}</p>
                          {p.barcode && <p className="text-xs text-gray-400 font-mono mt-0.5">{p.barcode}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wide border border-gray-200">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-gray-800">
                      {settings.currency} {p.price.toFixed(2)} <span className="text-gray-400 font-normal text-xs ml-1">/ {p.unit}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${p.stock <= settings.lowStockLevel ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                        <span className={`text-sm font-bold ${p.stock <= settings.lowStockLevel ? 'text-red-600' : 'text-gray-700'}`}>
                          {p.stock} {p.unit}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenEditProduct(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Production Logs */}
      {activeTab === 'history' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slideUp">
          <div className="lg:col-span-2 space-y-4">
             {productionPlans.length === 0 ? (
               <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-gray-200 text-center text-gray-400 flex flex-col items-center">
                 <ClipboardList className="w-16 h-16 mb-4 opacity-20" />
                 <p className="font-medium">No production history found.</p>
               </div>
             ) : (
               productionPlans.map((plan, idx) => (
                 <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-6">
                       <div>
                         <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">ID: #{plan.id.slice(-6)}</span>
                         <h3 className="text-lg font-bold text-gray-800">{plan.timestamp}</h3>
                       </div>
                       <span className="bg-brand-50 text-brand-700 px-4 py-1.5 rounded-full text-xs font-bold border border-brand-100">
                         {plan.totals.batches.toFixed(1)} Batches
                       </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                       <div className="text-center p-2 bg-gray-50 rounded-xl">
                         <p className="text-xs text-gray-400 font-bold uppercase">Orders</p>
                         <p className="font-black text-gray-800 text-lg">{plan.totals.orders}</p>
                       </div>
                       <div className="text-center p-2 bg-emerald-50 rounded-xl">
                         <p className="text-xs text-emerald-600 font-bold uppercase">Chicken</p>
                         <p className="font-black text-emerald-700 text-lg">{plan.totals.chicken}kg</p>
                       </div>
                       <div className="text-center p-2 bg-emerald-50 rounded-xl">
                         <p className="text-xs text-emerald-600 font-bold uppercase">Pork</p>
                         <p className="font-black text-emerald-700 text-lg">{plan.totals.pork}kg</p>
                       </div>
                    </div>
                 </div>
               ))
             )}
          </div>
          
          <div className="bg-gray-900 rounded-3xl p-8 text-white h-fit shadow-xl">
             <h3 className="font-bold text-xl mb-2">Production Summary</h3>
             <p className="text-gray-400 text-sm mb-8">Aggregated stats from all time.</p>
             
             <div className="space-y-6">
               <div className="flex justify-between items-center">
                 <span className="text-gray-400 font-medium">Total Plans</span>
                 <span className="text-2xl font-bold">{productionPlans.length}</span>
               </div>
               <div className="h-px bg-gray-700"></div>
               <div className="flex justify-between items-center">
                 <span className="text-gray-400 font-medium">Total Batches</span>
                 <span className="text-2xl font-bold">{productionPlans.reduce((acc, p) => acc + p.totals.batches, 0).toFixed(1)}</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-gray-400 font-medium">Chicken Usage</span>
                 <span className="text-2xl font-bold text-emerald-400">{productionPlans.reduce((acc, p) => acc + p.totals.chicken, 0)} kg</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-gray-400 font-medium">Pork Usage</span>
                 <span className="text-2xl font-bold text-emerald-400">{productionPlans.reduce((acc, p) => acc + p.totals.pork, 0)} kg</span>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* 3. Settings */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slideUp">
          {/* General Config */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <div className="p-2 bg-brand-50 text-brand-600 rounded-lg mr-3"><Tag className="w-5 h-5" /></div>
              General Configuration
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Business Name</label>
                <input 
                  type="text"
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all font-medium"
                  value={settingsForm.businessName}
                  onChange={e => setSettingsForm({...settingsForm, businessName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Base Currency</label>
                <select 
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white font-medium"
                  value={settingsForm.currency}
                  onChange={e => setSettingsForm({...settingsForm, currency: e.target.value})}
                >
                  {settingsForm.currencies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Rules & Limits */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <div className="p-2 bg-red-50 text-red-500 rounded-lg mr-3"><AlertCircle className="w-5 h-5" /></div>
              Thresholds & Rules
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Low Stock Alert Level</label>
                <div className="relative">
                  <input 
                    type="number"
                    className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all font-medium"
                    value={settingsForm.lowStockLevel}
                    onChange={e => setSettingsForm({...settingsForm, lowStockLevel: parseInt(e.target.value)})}
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-bold">units</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Tax Rate (VAT)</label>
                <div className="relative">
                  <input 
                    type="number" step="0.01"
                    className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all font-medium"
                    value={settingsForm.taxRate}
                    onChange={e => setSettingsForm({...settingsForm, taxRate: parseFloat(e.target.value)})}
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-bold">% (Decimal)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg mr-3"><DollarSign className="w-5 h-5" /></div>
              Payment Options
            </h3>
            <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-200">
               <div>
                 <p className="font-bold text-gray-900">Cryptocurrency Support</p>
                 <p className="text-xs text-gray-500 mt-1">Enable Bitcoin/Crypto checkout option in POS.</p>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settingsForm.allowCrypto}
                    onChange={e => setSettingsForm({...settingsForm, allowCrypto: e.target.checked})}
                  />
                  <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-600"></div>
                </label>
            </div>
          </div>

          {/* Save Action */}
          <div className="md:col-span-2 flex justify-end">
            <button 
              onClick={handleSaveSettings}
              className="bg-brand-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-brand-700 shadow-xl shadow-brand-200 transition-all flex items-center transform hover:-translate-y-1"
            >
              <Save className="w-5 h-5 mr-3" /> Save Changes
            </button>
          </div>
        </div>
      )}

      {/* --- Product Modal --- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative animate-popIn">
             <button onClick={() => setIsProductModalOpen(false)} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
               <X className="w-5 h-5 text-gray-600" />
             </button>
             
             <h3 className="text-2xl font-black text-gray-900 mb-8">
               {productModalMode === 'add' ? 'Create Product' : 'Edit Product'}
             </h3>
             
             <form onSubmit={handleProductSubmit} className="space-y-5">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Icon</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-2xl focus:ring-2 focus:ring-brand-500 outline-none" 
                      value={productForm.icon} 
                      onChange={e => setProductForm({...productForm, icon: e.target.value})}
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Product Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-medium" 
                      value={productForm.name} 
                      onChange={e => setProductForm({...productForm, name: e.target.value})}
                      placeholder="e.g. Pork Belly"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Category</label>
                     <select 
                       className="w-full px-5 py-3 border border-gray-200 rounded-xl bg-white font-medium outline-none"
                       value={productForm.category}
                       onChange={e => setProductForm({...productForm, category: e.target.value})}
                     >
                       <option value="Fresh">Fresh</option>
                       <option value="Cooked">Cooked</option>
                       <option value="Frozen">Frozen</option>
                       <option value="Beverage">Beverage</option>
                       <option value="Other">Other</option>
                     </select>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Unit</label>
                     <input 
                       type="text" 
                       className="w-full px-5 py-3 border border-gray-200 rounded-xl font-medium outline-none" 
                       value={productForm.unit} 
                       onChange={e => setProductForm({...productForm, unit: e.target.value})}
                     />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Price</label>
                     <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">{settings.currency}</span>
                       <input 
                        required
                        type="number" step="0.01"
                        className="w-full pl-10 pr-5 py-3 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none" 
                        value={productForm.price} 
                        onChange={e => setProductForm({...productForm, price: parseFloat(e.target.value)})}
                       />
                     </div>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Current Stock</label>
                     <input 
                        required
                        type="number"
                        className="w-full px-5 py-3 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none" 
                        value={productForm.stock} 
                        onChange={e => setProductForm({...productForm, stock: parseInt(e.target.value)})}
                     />
                   </div>
                </div>

                <div>
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Barcode (Optional)</label>
                   <div className="relative">
                      <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        className="w-full pl-10 pr-5 py-3 border border-gray-200 rounded-xl font-mono text-sm outline-none" 
                        value={productForm.barcode || ''} 
                        onChange={e => setProductForm({...productForm, barcode: e.target.value})}
                        placeholder="Scan or enter code"
                      />
                   </div>
                </div>

                <div className="pt-6 flex gap-3">
                  <button type="button" onClick={() => setIsProductModalOpen(false)} className="flex-1 py-4 text-gray-600 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-4 text-white bg-gray-900 rounded-xl font-bold hover:bg-black shadow-lg transition-colors">
                    {productModalMode === 'add' ? 'Add to Inventory' : 'Save Changes'}
                  </button>
                </div>
             </form>
           </div>
        </div>
      )}

    </div>
  );
};

export default Admin;