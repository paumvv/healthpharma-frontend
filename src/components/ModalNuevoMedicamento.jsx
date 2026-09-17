import { useState } from 'react';
import { X } from 'lucide-react';

export default function ModalNuevoMedicamento({ onClose, onGuardar }) {
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precio, setPrecio] = useState('');
  const [fechaCaducidad, setFechaCaducidad] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const cantidadNum = Number(cantidad);
    onGuardar({
      id: Date.now().toString(),
      nombre,
      cantidad: cantidadNum,
      precio: Number(precio),
      fechaCaducidad,
      estado: cantidadNum > 0 ? 'disponible' : 'agotado'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl max-w-sm w-full p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Agregar Producto</h3>
          <button type="button" onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <input type="text" placeholder="Nombre" required value={nombre} className="w-full border p-2 rounded text-sm" onChange={(e) => setNombre(e.target.value)} />
        <input type="number" min="0" placeholder="Existencias" required value={cantidad} className="w-full border p-2 rounded text-sm" onChange={(e) => setCantidad(e.target.value)} />
        <input type="number" step="0.01" min="0" placeholder="Precio" required value={precio} className="w-full border p-2 rounded text-sm" onChange={(e) => setPrecio(e.target.value)} />
        <input type="date" required value={fechaCaducidad} className="w-full border p-2 rounded text-sm" onChange={(e) => setFechaCaducidad(e.target.value)} />
        <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded font-bold text-sm">Guardar</button>
      </form>
    </div>
  );
}