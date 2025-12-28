import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, Search, Filter } from 'lucide-react';

const ShopCatalog: React.FC = () => {
  const { products, addToShopCart, settings } = useStore();
  const [category, setCategory] = useState('All');
  
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filtered = products.filter(p => category === 'All' || p.category === category);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
       
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-stone-900 mb-2">Our Products</h1>
            <p className="text-stone-500">Fresh cuts, marinated meats, and pantry essentials.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-stone-200 overflow-x-auto">
             {categories.map(cat => (
               <button 
                 key={cat}
                 onClick={() => setCategory(cat)}
                 className={`px-6 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${category === cat ? 'bg-brand-600 text-white shadow-md' : 'text-stone-500 hover:bg-stone-50'}`}
               >
                 {cat}
               </button>
             ))}
          </div>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col">
               <div className="aspect-square bg-stone-100 relative flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-500">
                  {product.icon}
               </div>
               <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-stone-900 text-lg mb-1">{product.name}</h3>
                  <p className="text-stone-500 text-sm mb-4">Perfect for grilling or roasting.</p>
                  <div className="flex-1"></div>
                  <div className="flex items-center justify-between">
                     <div className="flex flex-col">
                        <span className="text-xs text-stone-400 font-medium">Price per {product.unit}</span>
                        <span className="text-xl font-bold text-stone-900">{settings.currency}{product.price}</span>
                     </div>
                     <button 
                       onClick={() => addToShopCart(product)}
                       className="bg-stone-100 text-stone-900 px-4 py-2 rounded-lg hover:bg-stone-900 hover:text-white transition-all font-bold text-sm"
                     >
                       Add to Cart
                     </button>
                  </div>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
};

export default ShopCatalog;