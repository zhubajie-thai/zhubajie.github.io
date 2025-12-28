import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Product, Customer, Employee, Recipe, Sale, Settings, User, ProductionPlan, ShopCartItem 
} from '../types';
import { 
  INITIAL_PRODUCTS, INITIAL_RECIPES, INITIAL_EMPLOYEES, INITIAL_SETTINGS 
} from '../services/mockData';

interface StoreContextType {
  user: User | null;
  login: (name: string, role: string, currency: string) => void;
  logout: () => void;
  customerUser: Customer | null;
  loginCustomer: (email: string, password: string) => boolean;
  registerCustomer: (c: Partial<Customer>) => void;
  logoutCustomer: () => void;
  shopCart: ShopCartItem[];
  addToShopCart: (p: Product) => void;
  removeFromShopCart: (id: number) => void;
  updateShopCartQty: (id: number, delta: number) => void;
  checkoutShop: () => void;
  products: Product[];
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: number) => void;
  customers: Customer[];
  addCustomer: (c: Customer) => void;
  updateCustomer: (c: Customer) => void;
  deleteCustomer: (id: number) => void;
  employees: Employee[];
  addEmployee: (e: Employee) => void;
  updateEmployee: (e: Employee) => void;
  deleteEmployee: (id: number) => void;
  recipes: Recipe[];
  updateRecipe: (r: Recipe) => void;
  sales: Sale[];
  addSale: (s: Sale) => void;
  settings: Settings;
  updateSettings: (s: Settings) => void;
  productionPlans: ProductionPlan[];
  saveProductionPlan: (plan: ProductionPlan) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);
  return [storedValue, setStoredValue];
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('pork_user', null);
  const [customerUser, setCustomerUser] = useLocalStorage<Customer | null>('pork_customer', null);
  const [shopCart, setShopCart] = useLocalStorage<ShopCartItem[]>('pork_cart', []);
  const [products, setProducts] = useLocalStorage<Product[]>('pork_products', INITIAL_PRODUCTS);
  const [customers, setCustomers] = useLocalStorage<Customer[]>('pork_customers', []);
  const [employees, setEmployees] = useLocalStorage<Employee[]>('pork_staff', INITIAL_EMPLOYEES);
  const [recipes, setRecipes] = useLocalStorage<Recipe[]>('pork_recipes', INITIAL_RECIPES);
  const [sales, setSales] = useLocalStorage<Sale[]>('pork_sales', []);
  const [settings, setSettings] = useLocalStorage<Settings>('pork_settings_obj', INITIAL_SETTINGS);
  const [productionPlans, setProductionPlans] = useLocalStorage<ProductionPlan[]>('pork_plans', []);

  const login = (name: string, role: string, currency: string) => setUser({ name, role: role as any, currency: currency || settings.currency, isLoggedIn: true });
  const logout = () => setUser(null);

  const registerCustomer = (c: Partial<Customer>) => {
    const nc: Customer = { id: Date.now(), name: c.name!, phone: c.phone || '', points: 0, totalPurchases: 0, registeredDate: new Date().toISOString(), ...c };
    setCustomers([...customers, nc]);
    setCustomerUser(nc);
  };

  const loginCustomer = (email: string, password: string) => {
    const found = customers.find(c => c.email === email && c.password === password);
    if (found) { setCustomerUser(found); return true; }
    return false;
  };

  const logoutCustomer = () => { setCustomerUser(null); setShopCart([]); };

  const addToShopCart = (p: Product) => {
    setShopCart(prev => {
      const exists = prev.find(x => x.id === p.id);
      if (exists) return prev.map(x => x.id === p.id ? { ...x, qty: x.qty + 1 } : x);
      return [...prev, { ...p, qty: 1 }];
    });
  };

  const removeFromShopCart = (id: number) => setShopCart(prev => prev.filter(x => x.id !== id));
  const updateShopCartQty = (id: number, delta: number) => setShopCart(prev => prev.map(x => x.id === id ? { ...x, qty: Math.max(0, x.qty + delta) } : x).filter(x => x.qty > 0));

  const checkoutShop = () => {
    if (shopCart.length === 0) return;
    const total = shopCart.reduce((a, b) => a + (b.price * b.qty), 0);
    const sale: Sale = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      customerName: customerUser?.name || 'Guest',
      customerId: customerUser?.id,
      items: shopCart,
      subtotal: total,
      tax: total * settings.taxRate,
      discount: 0,
      total: total * (1 + settings.taxRate),
      paymentMethod: 'card',
      orderType: 'delivery',
      currency: settings.currency
    };
    addSale(sale);
    setShopCart([]);
  };

  const addProduct = (p: Product) => setProducts([...products, p]);
  const updateProduct = (p: Product) => setProducts(products.map(x => x.id === p.id ? p : x));
  const deleteProduct = (id: number) => setProducts(products.filter(x => x.id !== id));
  const addCustomer = (c: Customer) => setCustomers([...customers, c]);
  const updateCustomer = (c: Customer) => setCustomers(customers.map(x => x.id === c.id ? c : x));
  const deleteCustomer = (id: number) => setCustomers(customers.filter(x => x.id !== id));
  const addEmployee = (e: Employee) => setEmployees([...employees, e]);
  const updateEmployee = (e: Employee) => setEmployees(employees.map(x => x.id === e.id ? e : x));
  const deleteEmployee = (id: number) => setEmployees(employees.filter(x => x.id !== id));
  const updateRecipe = (r: Recipe) => setRecipes(recipes.map(x => x.id === r.id ? r : x));
  const addSale = (s: Sale) => {
    setSales([...sales, s]);
    setProducts(prev => prev.map(p => {
      const item = s.items.find(i => i.id === p.id);
      return item ? { ...p, stock: p.stock - item.qty } : p;
    }));
  };
  const saveProductionPlan = (plan: ProductionPlan) => setProductionPlans([plan, ...productionPlans]);

  return (
    <StoreContext.Provider value={{
      user, login, logout, customerUser, loginCustomer, registerCustomer, logoutCustomer,
      shopCart, addToShopCart, removeFromShopCart, updateShopCartQty, checkoutShop,
      products, addProduct, updateProduct, deleteProduct, customers, addCustomer, updateCustomer, deleteCustomer,
      employees, addEmployee, updateEmployee, deleteEmployee, recipes, updateRecipe, sales, addSale,
      settings, updateSettings: setSettings, productionPlans, saveProductionPlan
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const c = useContext(StoreContext);
  if (!c) throw new Error('useStore error');
  return c;
};