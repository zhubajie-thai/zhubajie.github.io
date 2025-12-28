import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Employee, Role } from '../types';
import { 
  Trash2, Edit2, Search, Plus, User, DollarSign, Briefcase, 
  Calendar, CheckCircle, XCircle, Clock, X, Phone, MapPin
} from 'lucide-react';

const Employees: React.FC = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee, user } = useStore();
  
  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  
  // Form State
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '', role: 'sales', salary: 0, status: 'Active', phone: '', address: ''
  });

  // -- Derived Data --
  const stats = useMemo(() => {
    return {
      total: employees.length,
      active: employees.filter(e => e.status === 'Active').length,
      payroll: employees.reduce((acc, e) => acc + (e.status === 'Active' ? e.salary : 0), 0),
      onLeave: employees.filter(e => e.status === 'On Leave').length
    };
  }, [employees]);

  const filteredEmployees = employees.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || e.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roles: Role[] = ['manager', 'sales', 'chef', 'cashier', 'delivery'];

  // -- Handlers --
  const handleOpenAdd = () => {
    setModalMode('add');
    setSelectedId(null);
    setFormData({ name: '', role: 'sales', salary: 0, status: 'Active', phone: '', address: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setModalMode('edit');
    setSelectedId(emp.id);
    setFormData({ ...emp });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to remove ${name}?`)) {
      deleteEmployee(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const empData: Employee = {
      id: selectedId || Date.now(),
      name: formData.name!,
      role: formData.role as Role,
      salary: Number(formData.salary),
      status: formData.status as any,
      hireDate: formData.hireDate || new Date().toLocaleDateString(),
      phone: formData.phone,
      address: formData.address
    };

    if (modalMode === 'add') {
      addEmployee(empData);
    } else {
      updateEmployee(empData);
    }
    setIsModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Inactive': return 'bg-red-100 text-red-700 border-red-200';
      case 'On Leave': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleIcon = (role: Role) => {
    switch(role) {
      case 'manager': return <Briefcase className="w-4 h-4" />;
      case 'chef': return <User className="w-4 h-4" />; // Could use Utensils if available
      case 'delivery': return <User className="w-4 h-4" />; // Could use Truck
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* --- Stats Header --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Staff</p>
             <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
           </div>
           <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
             <User className="w-6 h-6" />
           </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Active Now</p>
             <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.active}</p>
           </div>
           <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full">
             <CheckCircle className="w-6 h-6" />
           </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">On Leave</p>
             <p className="text-2xl font-bold text-amber-600 mt-1">{stats.onLeave}</p>
           </div>
           <div className="p-3 bg-amber-50 text-amber-600 rounded-full">
             <Clock className="w-6 h-6" />
           </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Payroll</p>
             <p className="text-2xl font-bold text-gray-800 mt-1">{user?.currency}{stats.payroll.toLocaleString()}</p>
           </div>
           <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full">
             <DollarSign className="w-6 h-6" />
           </div>
        </div>
      </div>

      {/* --- Toolbar --- */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search employees..." 
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-brand-500"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
          >
            <option value="All">All Roles</option>
            {roles.map(r => <option key={r} value={r} className="capitalize">{r}</option>)}
          </select>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="w-full md:w-auto flex items-center justify-center bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Employee
        </button>
      </div>

      {/* --- Employee Grid --- */}
      {filteredEmployees.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
           <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
           <p className="text-gray-500">No employees found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map(emp => (
            <div key={emp.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              <div className="p-6">
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center font-bold text-lg">
                         {emp.name.charAt(0)}
                       </div>
                       <div>
                         <h3 className="font-bold text-gray-900">{emp.name}</h3>
                         <div className="flex items-center gap-1 text-xs text-gray-500 capitalize">
                            {getRoleIcon(emp.role)} {emp.role}
                         </div>
                       </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(emp.status)}`}>
                      {emp.status}
                    </span>
                 </div>
                 
                 <div className="space-y-2 text-sm text-gray-600 mb-6">
                    <div className="flex items-center gap-2">
                       <DollarSign className="w-4 h-4 text-gray-400" />
                       <span>{user?.currency} {emp.salary.toLocaleString()} <span className="text-xs text-gray-400">/ month</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Calendar className="w-4 h-4 text-gray-400" />
                       <span>Hired {emp.hireDate}</span>
                    </div>
                    {emp.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{emp.phone}</span>
                      </div>
                    )}
                 </div>

                 <div className="flex gap-2 pt-4 border-t border-gray-50">
                    <button 
                      onClick={() => handleOpenEdit(emp)} 
                      className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      Edit Profile
                    </button>
                    <button 
                      onClick={() => handleDelete(emp.id, emp.name)} 
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Add/Edit Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative animate-[popIn_0.2s_ease-out]">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {modalMode === 'add' ? 'Add New Employee' : 'Edit Employee'}
            </h3>
            <p className="text-sm text-gray-500 mb-6">Manage employee details and access.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Full Name</label>
                  <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Maria Santos" />
                </div>
                
                <div>
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Role</label>
                   <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white" 
                     value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as any})}>
                     {roles.map(r => <option key={r} value={r} className="capitalize">{r}</option>)}
                   </select>
                </div>

                <div>
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Monthly Salary</label>
                   <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">{user?.currency}</span>
                      <input required type="number" className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
                        value={formData.salary} onChange={e => setFormData({...formData, salary: Number(e.target.value)})} />
                   </div>
                </div>

                <div>
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Status</label>
                   <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white" 
                     value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                     <option value="Active">Active</option>
                     <option value="Inactive">Inactive</option>
                     <option value="On Leave">On Leave</option>
                   </select>
                </div>
                 
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Phone (Optional)</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
                    value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="09XX..." />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Address (Optional)</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
                    value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Complete address..." />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 shadow-md">
                   {modalMode === 'add' ? 'Create Employee' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;