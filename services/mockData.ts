import { Product, Recipe, Employee, Settings } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'Fried Pork (kg)', category: 'Cooked', price: 450, stock: 50, unit: 'kg', icon: '🍖', barcode: '885001' },
  { id: 2, name: 'Grilled Pork (kg)', category: 'Cooked', price: 520, stock: 30, unit: 'kg', icon: '🔥', barcode: '885002' },
  { id: 3, name: 'Roasted Pork (kg)', category: 'Cooked', price: 580, stock: 25, unit: 'kg', icon: '🍗', barcode: '885003' },
  { id: 4, name: 'Pork Adobo (kg)', category: 'Cooked', price: 650, stock: 20, unit: 'kg', icon: '🥘', barcode: '885004' },
  { id: 5, name: 'Ground Pork (kg)', category: 'Fresh', price: 380, stock: 15, unit: 'kg', icon: '🌪️', barcode: '885005' },
  { id: 6, name: 'Pork Belly (kg)', category: 'Fresh', price: 420, stock: 12, unit: 'kg', icon: '🥩', barcode: '885006' },
  { id: 7, name: 'Pork Chops (kg)', category: 'Fresh', price: 480, stock: 8, unit: 'kg', icon: '🥩', barcode: '885007' },
  { id: 8, name: 'Chicken Breast (kg)', category: 'Fresh', price: 320, stock: 35, unit: 'kg', icon: '🐔', barcode: '885008' },
];

export const INITIAL_RECIPES: Recipe[] = [
  { id: 'no1', name: 'Recipe No 1', baseChicken: 20, basePork: 3, totalBase: 23, linkedProductId: 1 },
  { id: 'no2', name: 'Recipe No 2', baseChicken: 20, basePork: 5, totalBase: 25, linkedProductId: 2 },
  { id: 'no3', name: 'Recipe No 3', baseChicken: 20, basePork: 9, totalBase: 29, linkedProductId: 3 },
  { id: 'no4', name: 'Recipe No 4', baseChicken: 20, basePork: 14, totalBase: 34, linkedProductId: 4 },
];

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 1, name: 'Maria Santos', role: 'manager', salary: 15000, status: 'Active', hireDate: '2023-01-15' },
  { id: 2, name: 'Juan Dela Cruz', role: 'sales', salary: 12000, status: 'Active', hireDate: '2023-03-10' },
  { id: 3, name: 'Anna Garcia', role: 'chef', salary: 13000, status: 'On Leave', hireDate: '2023-06-20' },
];

export const INITIAL_SETTINGS: Settings = {
  businessName: 'Pork Shop Premium',
  currency: '฿',
  taxRate: 0.07, // 7% VAT
  lowStockLevel: 10,
  allowCrypto: false,
  currencies: ['฿', '$', '€', '£'],
};