import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, LogIn, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const ShopLayout: React.FC = () => {
  const { customerUser, logoutCustomer, shopCart, settings } = useStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartTotal = shopCart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="min-h-screen bg-stone-50 font-sans selection:bg-brand-200 selection:text-brand-900">
      
      {/* --- Modern Navbar --- */}
      <nav className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-stone-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <div onClick={() => navigate('/')} className="flex items-center cursor-pointer group">
              <span className="text-3xl mr-2 transform group-hover:rotate-12 transition-transform duration-300">🐷</span>
              <div>
                <h1 className="text-xl font-bold text-stone-900 tracking-tight leading-none">{settings.businessName}</h1>
                <p className="text-[10px] text-brand-600 font-bold uppercase tracking-widest">Premium Cuts</p>
              </div>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink to="/" className={({isActive}) => `text-sm font-medium transition-colors hover:text-brand-600 ${isActive ? 'text-brand-600' : 'text-stone-500'}`}>Home</NavLink>
              <NavLink to="/shop" className={({isActive}) => `text-sm font-medium transition-colors hover:text-brand-600 ${isActive ? 'text-brand-600' : 'text-stone-500'}`}>Shop</NavLink>
              <div className="h-4 w-px bg-stone-200"></div>
              
              {/* Auth / Profile */}
              {customerUser ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-stone-800">Hi, {customerUser.name.split(' ')[0]}</span>
                  <button onClick={() => { logoutCustomer(); navigate('/'); }} className="text-xs text-stone-400 hover:text-stone-600">Logout</button>
                </div>
              ) : (
                <NavLink to="/auth" className="flex items-center gap-2 text-sm font-bold text-stone-800 hover:text-brand-600 transition-colors">
                  <User className="w-4 h-4" /> Account
                </NavLink>
              )}

              {/* Cart Trigger */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 bg-stone-100 rounded-full hover:bg-brand-100 hover:text-brand-600 transition-colors group"
              >
                <ShoppingBag className="w-5 h-5" />
                {shopCart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm">
                    {shopCart.length}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Btn */}
            <div className="md:hidden flex items-center gap-4">
              <button onClick={() => setIsCartOpen(true)} className="relative p-2">
                 <ShoppingBag className="w-6 h-6 text-stone-700" />
                 {shopCart.length > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-stone-700">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
           <div className="md:hidden bg-white border-t border-stone-100 absolute w-full px-4 py-6 shadow-xl flex flex-col gap-4">
              <NavLink to="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-stone-800">Home</NavLink>
              <NavLink to="/shop" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-stone-800">Browse Shop</NavLink>
              <div className="h-px bg-stone-100 w-full my-2"></div>
              {customerUser ? (
                 <button onClick={() => { logoutCustomer(); setIsMenuOpen(false); }} className="text-left text-stone-500">Sign Out</button>
              ) : (
                 <NavLink to="/auth" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-brand-600">Login / Register</NavLink>
              )}
           </div>
        )}
      </nav>

      {/* --- Main Content --- */}
      <div className="pt-20">
        <Outlet />
      </div>

      {/* --- Footer --- */}
      <footer className="bg-stone-900 text-stone-400 py-16 mt-24">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="text-2xl mb-4">🐷</div>
              <h3 className="text-white font-bold text-lg mb-2">{settings.businessName}</h3>
              <p className="text-sm leading-relaxed max-w-xs">Delivering the freshest, premium quality cuts directly from farm to your table. Experience the difference.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-white transition-colors">Fresh Meat</button></li>
                <li><button className="hover:text-white transition-colors">Marinated</button></li>
                <li><button className="hover:text-white transition-colors">Bundles</button></li>
                <li><button className="hover:text-white transition-colors">Recipes</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-white transition-colors">About Us</button></li>
                <li><button className="hover:text-white transition-colors">Contact</button></li>
                <li><button className="hover:text-white transition-colors">Sustainability</button></li>
                <li><NavLink to="/staff-login" className="hover:text-brand-400 transition-colors text-xs uppercase tracking-wide">Staff Portal</NavLink></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Newsletter</h4>
              <div className="flex bg-stone-800 rounded-lg p-1">
                 <input type="email" placeholder="Your email" className="bg-transparent px-4 py-2 w-full outline-none text-sm text-white" />
                 <button className="bg-brand-600 text-white px-4 py-2 rounded-md font-bold text-xs hover:bg-brand-500 transition-colors">JOIN</button>
              </div>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-stone-800 text-center text-xs text-stone-600">
           &copy; {new Date().getFullYear()} {settings.businessName}. All rights reserved.
         </div>
      </footer>

      {/* --- Cart Drawer --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-[slideInRight_0.3s_ease-out]">
             <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-white">
               <h2 className="text-xl font-bold text-stone-900">Your Cart ({shopCart.length})</h2>
               <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-stone-100 rounded-full"><X className="w-5 h-5"/></button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {shopCart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-stone-400">
                    <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                    <p>Your cart is empty.</p>
                    <button onClick={() => {setIsCartOpen(false); navigate('/shop');}} className="mt-4 text-brand-600 font-bold hover:underline">Start Shopping</button>
                  </div>
                ) : (
                  shopCart.map(item => (
                    <div key={item.id} className="flex gap-4">
                       <div className="w-20 h-20 bg-stone-50 rounded-xl flex items-center justify-center text-3xl border border-stone-100">
                         {item.icon}
                       </div>
                       <div className="flex-1">
                          <h4 className="font-bold text-stone-800">{item.name}</h4>
                          <p className="text-stone-500 text-sm">{settings.currency}{item.price} / {item.unit}</p>
                          <div className="flex justify-between items-center mt-3">
                             <div className="flex items-center gap-3 bg-stone-100 rounded-lg px-2 py-1">
                               <button className="text-stone-500 hover:text-stone-900" onClick={() => useStore().updateShopCartQty(item.id, -1)}>-</button>
                               <span className="text-sm font-semibold w-4 text-center">{item.qty}</span>
                               <button className="text-stone-500 hover:text-stone-900" onClick={() => useStore().updateShopCartQty(item.id, 1)}>+</button>
                             </div>
                             <span className="font-bold text-stone-900">{settings.currency}{(item.price * item.qty).toFixed(2)}</span>
                          </div>
                       </div>
                    </div>
                  ))
                )}
             </div>

             <div className="p-6 border-t border-stone-100 bg-stone-50">
               <div className="flex justify-between mb-4">
                 <span className="text-stone-500">Subtotal</span>
                 <span className="font-bold text-xl">{settings.currency}{cartTotal.toFixed(2)}</span>
               </div>
               <button 
                 onClick={() => {
                   if(shopCart.length > 0) {
                     if(!customerUser) { setIsCartOpen(false); navigate('/auth'); return; }
                     useStore().checkoutShop();
                     setIsCartOpen(false);
                     alert('Order placed successfully! 🚚');
                   }
                 }}
                 disabled={shopCart.length === 0}
                 className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
               >
                 Checkout Now <ChevronRight className="w-4 h-4" />
               </button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ShopLayout;