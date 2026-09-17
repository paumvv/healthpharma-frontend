import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function StockAdjustModal({ producto, onClose, onAjustar }) {
  const [nuevaCantidad, setNuevaCantidad] = useState(producto?.cantidad || 0);

  if (!producto) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-sm w-full p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold">Ajustar Stock: {producto.nombre}</h3>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <input 
          type="number" 
          value={nuevaCantidad} 
          onChange={e => setNuevaCantidad(Number(e.target.value))} 
          className="w-full border p-2 rounded text-sm"
        />
        <button 
          onClick={() => { onAjustar(producto.id, nuevaCantidad); onClose(); }} 
          className="w-full bg-blue-600 text-white py-2 rounded font-bold text-sm"
        >
          Confirmar Cambio
        </button>
      </div>
    </div>
  );
}