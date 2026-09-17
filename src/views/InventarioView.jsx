import React, { useState } from 'react';
import { Search } from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';

export default function InventarioView({ inventario = [] }) {
  const [busqueda, setBusqueda] = useState('');

  const filtrados = inventario.filter(item =>
    item.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="bg-white p-3 rounded-xl shadow border border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar medicamento..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 border-b">
            <tr>
              <th className="p-3">Producto</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Precio</th>
              <th className="p-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-slate-400 text-xs">
                  No hay medicamentos que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              filtrados.map(item => (
                <tr key={item.id}>
                  <td className="p-3 font-semibold">{item.nombre}</td>
                  <td className="p-3 font-bold">{item.cantidad}</td>
                  <td className="p-3">${item.precio.toFixed(2)}</td>
                  <td className="p-3"><CountdownTimer targetDate={item.fechaCaducidad} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}