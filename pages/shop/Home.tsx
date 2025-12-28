import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Star, ShieldCheck, Truck, Clock, ShoppingBag } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { products, addToShopCart, settings } = useStore();
  
  const featuredProducts = products.slice(0, 4); 

  return (
    <div className="animate-fadeIn overflow-x-hidden">
      
      {/* --- Hero Section --- */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 bg-[#FDFBF7]">
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-100 rounded-full blur-[100px] opacity-40 translate-x-1/3 -translate-y-1/3"></div>
           <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-100 rounded-full blur-[100px] opacity-40 -translate-x-1/3 translate-y-1/3"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10 items-center">
           <div className="space-y-8 lg:pr-12">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm border border-brand-200 rounded-full text-xs font-bold uppercase tracking-widest text-brand-800 animate-slideUp">
               <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
               Farm to Table Freshness
             </div>
             
             <h1 className="text-6xl md:text-8xl font-extrabold text-stone-900 leading-[0.9] tracking-tight animate-slideUp" style={{animationDelay: '0.1s'}}>
               Premium <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-orange-500">
                  Cuts Only.
               </span>
             </h1>
             
             <p className="text-xl text-stone-600 max-w-lg leading-relaxed font-medium animate-slideUp" style={{animationDelay: '0.2s'}}>
               Experience the finest quality pork, ethically raised and expertly butchered. Delivered fresh to your doorstep within 24 hours.
             </p>
             
             <div className="flex flex-wrap gap-4 pt-4 animate-slideUp" style={{animationDelay: '0.3s'}}>
               <button onClick={() => navigate('/shop')} className="px-10 py-5 bg-stone-900 text-white rounded-full font-bold text-sm hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center group">
                 Start Shopping <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </button>
               <button className="px-10 py-5 bg-white text-stone-900 border border-stone-200 rounded-full font-bold text-sm hover:bg-stone-50 transition-all hover:-translate-y-1">
                 Our Story
               </button>
             </div>
             
             <div className="flex items-center gap-8 pt-10 border-t border-stone-200/60 animate-slideUp" style={{animationDelay: '0.4s'}}>
                <div>
                   <div className="flex text-yellow-400 mb-1"><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/></div>
                   <span className="font-bold text-stone-800">5,000+ Reviews</span>
                </div>
                <div className="h-10 w-px bg-stone-200"></div>
                <div>
                   <div className="text-2xl font-black text-stone-800">24hr</div>
                   <span className="text-sm font-medium text-stone-500">Delivery Guarantee</span>
                </div>
             </div>
           </div>

           {/* Hero Image / Graphic */}
           <div className="relative hidden lg:block animate-float">
              <div className="relative w-full aspect-square max-w-xl mx-auto">
                 <div className="absolute inset-0 bg-stone-900 rounded-[3rem] rotate-6 opacity-5 transform scale-95"></div>
                 <div className="absolute inset-0 bg-white shadow-2xl rounded-[3rem] flex items-center justify-center overflow-hidden border border-white/50">
                    <div className="text-[200px] drop-shadow-2xl filter transform hover:scale-110 transition-transform duration-700 cursor-default select-none">🥩</div>
                    
                    {/* Floating Cards */}
                    <div className="absolute bottom-12 left-12 bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-stone-100 shadow-xl flex items-center gap-4 animate-float" style={{animationDelay: '1s'}}>
                       <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">🌿</div>
                       <div>
                         <p className="font-bold text-stone-900">100% Organic</p>
                         <p className="text-xs text-stone-500">Certified Farms</p>
                       </div>
                    </div>
                    
                    <div className="absolute top-12 right-12 bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-stone-100 shadow-xl text-center animate-float" style={{animationDelay: '2s'}}>
                       <p className="text-xs text-stone-500 uppercase font-bold tracking-wider mb-1">Weekly Special</p>
                       <p className="text-2xl font-black text-brand-600">{settings.currency}420</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* --- Features --- */}
      <section className="py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { icon: ShieldCheck, title: "Quality Guarantee", desc: "If you aren't satisfied, we replace it instantly. No questions asked." },
               { icon: Truck, title: "Express Cold Chain", desc: "Delivered in temperature-controlled vehicles to maintain peak freshness." },
               { icon: Clock, title: "Cut to Order", desc: "We don't pre-cut. Your meat is butchered only after your order is confirmed." }
             ].map((feature, idx) => (
               <div key={idx} className="p-8 rounded-3xl bg-stone-50 border border-stone-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-3">{feature.title}</h3>
                  <p className="text-stone-500 leading-relaxed font-medium">{feature.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* --- Featured Products --- */}
      <section className="py-24 bg-[#FDFBF7]">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-16">
               <div>
                 <span className="text-brand-600 font-bold uppercase tracking-widest text-xs">Shop Selection</span>
                 <h2 className="text-4xl font-black text-stone-900 mt-2">Weekly Favorites</h2>
               </div>
               <button onClick={() => navigate('/shop')} className="group flex items-center font-bold text-stone-900 hover:text-brand-600 transition-colors">
                 View Full Catalog 
                 <span className="w-8 h-8 rounded-full bg-stone-200 group-hover:bg-brand-100 ml-3 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"/>
                 </span>
               </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {featuredProducts.map(product => (
                 <div key={product.id} className="bg-white rounded-[2rem] p-4 shadow-sm border border-stone-100 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col">
                    <div className="aspect-[4/5] bg-stone-50 rounded-[1.5rem] relative flex items-center justify-center text-7xl group-hover:scale-[1.02] transition-transform duration-500 overflow-hidden mb-4">
                       <div className="z-10 transition-transform duration-500 group-hover:scale-110">{product.icon}</div>
                       {product.stock < 10 && <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide text-red-500 shadow-sm z-20">Low Stock</span>}
                       <button 
                         onClick={(e) => { e.stopPropagation(); addToShopCart(product); }}
                         className="absolute bottom-4 right-4 w-12 h-12 bg-stone-900 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-brand-600 z-20"
                       >
                         <ShoppingBag className="w-5 h-5" />
                       </button>
                    </div>
                    <div className="px-2 pb-2 flex flex-col flex-1">
                       <p className="text-xs text-stone-400 font-bold uppercase tracking-wide mb-1">{product.category}</p>
                       <h3 className="font-bold text-stone-900 text-lg leading-tight mb-4 group-hover:text-brand-700 transition-colors">{product.name}</h3>
                       <div className="mt-auto flex items-baseline gap-1">
                          <span className="text-2xl font-black text-stone-900">{settings.currency}{product.price}</span>
                          <span className="text-xs text-stone-400 font-medium">/ {product.unit}</span>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl font-black mb-6">Join the Meat Club</h2>
          <p className="text-xl text-stone-400 mb-10 max-w-2xl mx-auto">Sign up today to get 10% off your first order, plus exclusive access to limited-edition cuts and seasonal bundles.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input type="email" placeholder="Enter your email address" className="px-6 py-4 rounded-full text-stone-900 outline-none focus:ring-4 focus:ring-brand-500/50 min-w-[300px]" />
            <button className="px-8 py-4 bg-brand-600 rounded-full font-bold hover:bg-brand-500 transition-colors shadow-lg shadow-brand-900/50">Subscribe Now</button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;