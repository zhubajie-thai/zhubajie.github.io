import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Mail, Lock, User, Phone, MapPin } from 'lucide-react';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { loginCustomer, registerCustomer } = useStore();
  const [isLogin, setIsLogin] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      const success = loginCustomer(formData.email, formData.password);
      if (success) {
        navigate('/shop');
      } else {
        alert('Invalid credentials');
      }
    } else {
      registerCustomer(formData);
      navigate('/shop');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side - Visual */}
        <div className="md:w-1/2 bg-stone-900 text-white p-12 flex flex-col justify-between relative overflow-hidden">
           <div className="relative z-10">
             <div className="text-4xl mb-4">🐷</div>
             <h2 className="text-3xl font-bold mb-4">Welcome to <br/>Premium Quality.</h2>
             <p className="text-stone-400 leading-relaxed">Join our community of food lovers. Get access to exclusive cuts, loyalty rewards, and express delivery.</p>
           </div>
           
           <div className="relative z-10 mt-12">
              <div className="flex items-center gap-4 text-sm font-medium text-stone-300">
                <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center">✓</div>
                <span>Earn points on every order</span>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium text-stone-300 mt-4">
                <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center">✓</div>
                <span>Fast & Secure Checkout</span>
              </div>
           </div>

           {/* Decorative Circles */}
           <div className="absolute -top-20 -right-20 w-80 h-80 bg-stone-800 rounded-full blur-3xl opacity-50"></div>
           <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-brand-900 rounded-full blur-3xl opacity-50"></div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-12">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-stone-900">{isLogin ? 'Sign In' : 'Create Account'}</h3>
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="text-sm font-bold text-brand-600 hover:underline"
              >
                {isLogin ? 'Create new account' : 'Already have an account?'}
              </button>
           </div>

           <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                   <div className="relative">
                     <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                     <input required type="text" placeholder="Full Name" className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                     />
                   </div>
                   <div className="relative">
                     <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                     <input type="text" placeholder="Phone Number" className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
                        value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                     />
                   </div>
                </div>
              )}
              
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input required type="email" placeholder="Email Address" className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input required type="password" placeholder="Password" className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>

              {!isLogin && (
                 <div className="relative animate-[fadeIn_0.3s_ease-out]">
                   <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                   <input type="text" placeholder="Delivery Address" className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
                      value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                   />
                 </div>
              )}

              <button type="submit" className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg mt-4 flex justify-center items-center gap-2">
                {isLogin ? 'Sign In' : 'Register Now'} <ArrowRight className="w-4 h-4" />
              </button>
           </form>
           
           <div className="mt-8 text-center text-xs text-stone-400">
             By continuing, you agree to our Terms of Service and Privacy Policy.
           </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;