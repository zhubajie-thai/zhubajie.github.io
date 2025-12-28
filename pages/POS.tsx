import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, SaleItem, Customer, OrderType } from '../types';
import { 
  Search, Trash2, Plus, Minus, ScanBarcode, X, Utensils, 
  ShoppingBag, Truck, PauseCircle, Check, Users, Box, Zap, CreditCard, Banknote
} from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const POS: React.FC = () => {
  const { products, customers, user, addSale, settings } = useStore();
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [orderType, setOrderType] = useState<OrderType>('takeout');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const taxAmount = subtotal * settings.taxRate;
  const grandTotal = subtotal + taxAmount;

  const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category))], [products]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
  }, []);

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item).filter(i => i.qty > 0));
  };

  const finalizeSale = () => {
    const saleData = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in',
      customerId: selectedCustomer?.id,
      items: cart,
      subtotal,
      tax: taxAmount,
      total: grandTotal,
      paymentMethod,
      orderType,
      currency: user?.currency || settings.currency,
      discount: 0
    };
    addSale(saleData);
    setCart([]);
    setIsPaymentModalOpen(false);
    alert('Transaction Successful! 🖨️ Receipt Printing...');
  };

  useEffect(() => {
    if (isScannerOpen) {
      const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
      scanner.render((text) => {
        const p = products.find(p => p.barcode === text);
        if (p) { addToCart(p); setIsScannerOpen(false); }
      }, console.warn);
      return () => { scanner.clear().catch(() => {}); };
    }
  }, [isScannerOpen, products, addToCart]);

  return (
    <div className="flex h-[calc(100vh-10rem)] gap-8 animate-fadeIn">
      {/* Product Catalog Area */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex gap-4">
           <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
            <input 
              type="text" placeholder="Lookup products by name or code..." 
              className="w-full pl-14 pr-6 py-4 bg-gray-50/50 rounded-2xl outline-none focus:ring-4 focus:ring-brand-500/10 border border-transparent focus:border-brand-200 transition-all font-bold text-sm"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button onClick={() => setIsScannerOpen(true)} className="p-4 bg-gray-900 text-white rounded-2xl flex items-center gap-3 px-8 font-black uppercase text-[10px] tracking-widest hover:bg-black transition-colors shadow-lg shadow-gray-200">
            <ScanBarcode className="w-5 h-5" /> Barcode
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeCategory === cat ? 'bg-brand-600 text-white border-brand-600 shadow-xl shadow-brand-600/20 scale-105' : 'bg-white text-gray-400 border-gray-100 hover:border-brand-200 hover:text-gray-900'}`}>{cat}</button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
           {filteredProducts.map(p => (
             <button key={p.id} onClick={() => addToCart(p)} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl hover:scale-[1.02] hover:border-brand-200 transition-all text-left flex flex-col items-center group relative overflow-hidden">
                <div className="absolute top-4 right-4 text-[10px] font-black text-brand-300 opacity-0 group-hover:opacity-100 transition-opacity">ADD TO CART</div>
                <div className="text-6xl mb-6 bg-gray-50 w-24 h-24 rounded-3xl flex items-center justify-center group-hover:bg-brand-50 transition-colors">{p.icon}</div>
                <h3 className="font-black text-xs text-gray-900 text-center uppercase tracking-wider mb-2">{p.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-brand-600 font-black text-lg">{user?.currency || settings.currency}{p.price}</span>
                  <span className="text-[10px] font-black text-gray-300 uppercase">/ {p.unit}</span>
                </div>
             </button>
           ))}
        </div>
      </div>

      {/* Cart Area */}
      <div className="w-[420px] flex flex-col bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
         <div className="p-8 bg-gray-900 text-white">
            <div className="flex justify-between items-center">
               <div>
                  <h2 className="text-2xl font-black tracking-tight">Current Cart</h2>
                  <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest mt-1">{cart.length} items staged</p>
               </div>
               <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                  <ShoppingBag className="w-6 h-6 text-brand-400" />
               </div>
            </div>
         </div>

         <div className="grid grid-cols-3 bg-gray-50 p-1 border-b border-gray-100">
           {['dine-in', 'takeout', 'delivery'].map(type => (
             <button key={type} onClick={() => setOrderType(type as any)} className={`py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${orderType === type ? 'bg-white shadow-xl text-brand-700 scale-105' : 'text-gray-400 hover:text-gray-900'}`}>{type}</button>
           ))}
         </div>

         <div className="flex-1 overflow-y-auto p-8 space-y-6">
           {cart.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-20">
               <Box className="w-20 h-20 mb-4" />
               <p className="font-black uppercase tracking-widest text-xs">Awaiting Selections</p>
             </div>
           ) : (
             cart.map(item => (
               <div key={item.id} className="bg-gray-50/50 p-4 rounded-3xl flex items-center gap-5 border border-transparent hover:border-gray-200 transition-all group">
                  <div className="text-3xl bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-gray-900 uppercase tracking-wider truncate">{item.name}</p>
                    <p className="text-[10px] font-black text-brand-500 uppercase">{item.qty} x {item.price}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                    <button onClick={() => updateQty(item.id, -1)} className="p-1.5 bg-gray-50 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors"><Minus className="w-3.5 h-3.5"/></button>
                    <span className="text-sm font-black w-6 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="p-1.5 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-50 rounded-xl transition-colors"><Plus className="w-3.5 h-3.5"/></button>
                  </div>
               </div>
             ))
           )}
         </div>

         <div className="p-8 bg-gray-50/80 border-t border-gray-100 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest"><span>Subtotal</span><span>{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest"><span>Tax ({settings.taxRate * 100}%)</span><span>{taxAmount.toFixed(2)}</span></div>
              <div className="h-px bg-gray-200 my-2"></div>
              <div className="flex justify-between items-end">
                <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Grand Total</span>
                <span className="text-4xl font-black text-brand-700 tracking-tighter">{grandTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsPaymentModalOpen(true)} 
              disabled={cart.length === 0} 
              className="w-full bg-brand-600 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] mt-6 shadow-2xl shadow-brand-600/30 disabled:opacity-30 disabled:shadow-none hover:bg-brand-500 hover:scale-[1.02] transition-all flex justify-center gap-3 items-center"
            >
              Checkout Session <Zap className="w-4 h-4 fill-white" />
            </button>
         </div>
      </div>

      {/* Payment Selection Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-2xl flex items-center justify-center p-8">
           <div className="bg-white rounded-[3rem] p-12 w-full max-w-xl shadow-2xl animate-popIn text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-brand-600"></div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Complete Transaction</h2>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-10">Select Payment Method</p>
              
              <div className="grid grid-cols-2 gap-6 mb-12">
                 <button onClick={() => setPaymentMethod('cash')} className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 ${paymentMethod === 'cash' ? 'border-brand-600 bg-brand-50' : 'border-gray-100 hover:border-brand-200'}`}>
                    <Banknote className={`w-12 h-12 ${paymentMethod === 'cash' ? 'text-brand-600' : 'text-gray-300'}`} />
                    <span className="text-sm font-black uppercase tracking-widest">Cash</span>
                 </button>
                 <button onClick={() => setPaymentMethod('card')} className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 ${paymentMethod === 'card' ? 'border-brand-600 bg-brand-50' : 'border-gray-100 hover:border-brand-200'}`}>
                    <CreditCard className={`w-12 h-12 ${paymentMethod === 'card' ? 'text-brand-600' : 'text-gray-300'}`} />
                    <span className="text-sm font-black uppercase tracking-widest">Card</span>
                 </button>
              </div>

              <div className="bg-gray-50 p-8 rounded-[2rem] mb-10">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Amount Due</p>
                 <div className="text-6xl font-black text-brand-700 tracking-tighter">{grandTotal.toFixed(2)}</div>
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setIsPaymentModalOpen(false)} className="flex-1 py-5 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:text-gray-900">Cancel</button>
                 <button onClick={finalizeSale} className="flex-[2] bg-brand-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-brand-600/30 hover:bg-brand-500">Confirm & Print</button>
              </div>
           </div>
        </div>
      )}

      {isScannerOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-8">
           <div className="bg-white rounded-[3rem] p-8 w-full max-w-lg relative">
              <button onClick={() => setIsScannerOpen(false)} className="absolute -top-4 -right-4 p-4 bg-red-500 text-white rounded-full shadow-2xl"><X /></button>
              <div id="reader" className="overflow-hidden rounded-2xl"></div>
              <div className="mt-8 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Position Barcode inside the frame</div>
           </div>
        </div>
      )}
    </div>
  );
};

export default POS;