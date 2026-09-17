import React from 'react';
import { Package, AlertTriangle } from 'lucide-react';

export default function HomeView({ inventario }) {
  const totalStock = inventario.reduce((acc, item) => acc + item.cantidad, 0);
  const caducados = inventario.filter(item => new Date(item.fechaCaducidad) < new Date()).length;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Panel Principal</h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <Package className="h-6 w-6 text-blue-600 mb-1" />
          <span className="text-xs text-slate-500 font-medium">Unidades Totales</span>
          <p className="text-2xl font-bold text-slate-800">{totalStock}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <AlertTriangle className="h-6 w-6 text-red-500 mb-1" />
          <span className="text-xs text-slate-500 font-medium">Productos Caducados</span>
          <p className="text-2xl font-bold text-red-600">{caducados}</p>
        </div>
      </div>
    </div>
  );
}