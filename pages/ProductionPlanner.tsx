import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Save, RotateCcw, Download, Link as LinkIcon, Calculator } from 'lucide-react';

const ProductionPlanner: React.FC = () => {
  const { recipes, saveProductionPlan, products, updateRecipe, sales } = useStore();
  
  // State to hold order input for each recipe
  const [inputs, setInputs] = useState<Record<string, number>>({});

  const handleInputChange = (id: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      [id]: parseFloat(value) || 0
    }));
  };

  const handleProductLink = (recipeId: string, productId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (recipe) {
      updateRecipe({ ...recipe, linkedProductId: Number(productId) });
    }
  };

  const handleImportSales = () => {
    const today = new Date().toLocaleDateString();
    let importedCount = 0;
    const newInputs = { ...inputs };

    recipes.forEach(r => {
      if (r.linkedProductId) {
        const totalSold = sales
          .filter(s => new Date(s.timestamp).toLocaleDateString() === today)
          .reduce((acc, sale) => {
             const item = sale.items.find(i => i.id === r.linkedProductId);
             return acc + (item ? item.qty : 0);
          }, 0);
        
        if (totalSold > 0) {
          newInputs[r.id] = totalSold;
          importedCount++;
        }
      }
    });

    setInputs(newInputs);
    
    if (importedCount > 0) {
      alert(`Successfully imported sales data for ${importedCount} recipes.`);
    } else {
      alert("No matching sales found for today.");
    }
  };

  const calculateRow = (recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return { batches: 0, chicken: 0, pork: 0 };
    
    const order = inputs[recipeId] || 0;
    const batches = recipe.totalBase > 0 ? order / recipe.totalBase : 0;
    
    return {
      batches,
      chicken: Math.ceil(recipe.baseChicken * batches),
      pork: Math.ceil(recipe.basePork * batches)
    };
  };

  const totals = recipes.reduce((acc, r) => {
    const row = calculateRow(r.id);
    const order = inputs[r.id] || 0;
    return {
      orders: acc.orders + order,
      batches: acc.batches + row.batches,
      chicken: acc.chicken + row.chicken,
      pork: acc.pork + row.pork
    };
  }, { orders: 0, batches: 0, chicken: 0, pork: 0 });

  const handleSave = () => {
    if (totals.orders === 0) return alert('No orders entered.');

    const plan = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      items: recipes.map(r => {
        const row = calculateRow(r.id);
        return {
          recipeId: r.id,
          orderQty: inputs[r.id] || 0,
          batches: row.batches,
          chickenNeeded: row.chicken,
          porkNeeded: row.pork
        };
      }),
      totals
    };

    saveProductionPlan(plan);
    alert('Production Plan Saved Successfully! ✅');
  };

  const handleReset = () => {
    if (confirm('Clear all inputs?')) {
      setInputs({});
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Production Planner</h2>
          <p className="text-gray-500 mt-2 flex items-center gap-2">
            <Calculator className="w-4 h-4" /> Calculate daily ingredient requirements
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleImportSales}
            className="flex items-center px-5 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 font-bold transition-colors text-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Import Today's Sales
          </button>
          <button 
            onClick={handleReset}
            className="flex items-center px-5 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-bold text-sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 font-bold transition-colors text-sm"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Plan
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Recipe Name</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-64">Linked Product</th>
                <th className="px-4 py-5 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Base Mix (kg)</th>
                <th className="px-4 py-5 text-center text-xs font-bold text-brand-700 uppercase tracking-wider bg-brand-50/50 border-x border-brand-100/50 w-40">Order Qty</th>
                <th className="px-4 py-5 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Batches</th>
                <th className="px-8 py-5 text-center text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50/30">Req. Chicken</th>
                <th className="px-8 py-5 text-center text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50/30">Req. Pork</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recipes.map((recipe) => {
                const results = calculateRow(recipe.id);
                const hasInput = (inputs[recipe.id] || 0) > 0;
                
                return (
                  <tr key={recipe.id} className={`transition-colors ${hasInput ? 'bg-brand-50/10' : 'hover:bg-gray-50'}`}>
                    <td className="px-8 py-4 whitespace-nowrap">
                       <span className="text-sm font-bold text-gray-900">{recipe.name}</span>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap">
                       <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200">
                         <LinkIcon className="w-3 h-3 text-gray-400"/>
                         <select 
                           className="bg-transparent text-xs font-medium text-gray-700 outline-none w-full cursor-pointer"
                           value={recipe.linkedProductId || ''}
                           onChange={(e) => handleProductLink(recipe.id, e.target.value)}
                         >
                           <option value="">Link to Product...</option>
                           {products.map(p => (
                             <option key={p.id} value={p.id}>{p.name}</option>
                           ))}
                         </select>
                       </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-500 font-mono">
                       <span title="Chicken">{recipe.baseChicken}</span> / <span title="Pork">{recipe.basePork}</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center bg-brand-50/30 border-x border-brand-50">
                      <input 
                        type="number"
                        min="0"
                        className={`w-24 px-3 py-2 text-center border-2 rounded-xl focus:ring-0 outline-none font-bold text-gray-800 transition-all ${hasInput ? 'border-brand-400 bg-white shadow-sm' : 'border-gray-200 bg-gray-50'}`}
                        value={inputs[recipe.id] || ''}
                        onChange={(e) => handleInputChange(recipe.id, e.target.value)}
                        placeholder="0"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${results.batches > 0 ? 'bg-red-100 text-red-700' : 'text-gray-300'}`}>
                        {results.batches > 0 ? results.batches.toFixed(1) : '-'}
                      </span>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-center bg-emerald-50/10">
                      <span className={`text-sm font-bold ${results.chicken > 0 ? 'text-emerald-700' : 'text-gray-300'}`}>
                        {results.chicken > 0 ? results.chicken : '-'}
                      </span>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-center bg-emerald-50/10">
                      <span className={`text-sm font-bold ${results.pork > 0 ? 'text-emerald-700' : 'text-gray-300'}`}>
                        {results.pork > 0 ? results.pork : '-'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-900 text-white">
              <tr>
                <td colSpan={3} className="px-8 py-6 text-right font-bold uppercase tracking-wider text-xs text-gray-400">Total Requirements</td>
                <td className="px-4 py-6 text-center font-black text-xl">{totals.orders > 0 ? totals.orders : '-'}</td>
                <td className="px-4 py-6 text-center font-bold text-gray-300">{totals.batches > 0 ? totals.batches.toFixed(1) : '-'}</td>
                <td className="px-8 py-6 text-center font-black text-emerald-400 text-lg">{totals.chicken > 0 ? totals.chicken + ' kg' : '-'}</td>
                <td className="px-8 py-6 text-center font-black text-emerald-400 text-lg">{totals.pork > 0 ? totals.pork + ' kg' : '-'}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductionPlanner;