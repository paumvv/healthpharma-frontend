import { useState } from 'react';
import { X, Plus, Edit, Trash2, Save, Package, Search, SlidersHorizontal, ImageOff } from 'lucide-react';
import ImageUploader from './ImageUploader';
import StockAdjustModal from './StockAdjustModal';

const FORM_VACIO = {
  nombre: '', formula: '', categoria: 'Analgésicos', precio: '', cantidad: '',
  presentacion: '', dosis: '', descripcion: '', fechaCaducidad: '',
  codigoBarras: '', requiereReceta: false, imagen: ''
};

export default function AdminInventoryModal({ products = [], onClose, onSaveProduct, onDeleteProduct }) {
  const [vista, setVista] = useState('catalogo'); // 'catalogo' | 'alta'
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(FORM_VACIO);
  const [busqueda, setBusqueda] = useState('');
  const [productoAjuste, setProductoAjuste] = useState(null);

  const setCampo = (campo, valor) => setFormData((prev) => ({ ...prev, [campo]: valor }));

  const cambiarVista = (nuevaVista) => {
    setVista(nuevaVista);
    setEditingId(null);
    setFormData(FORM_VACIO);
  };

  const handleEdit = (prod) => {
    setEditingId(prod.id);
    setFormData({ ...FORM_VACIO, ...prod });
  };

  const cancelarEdicion = () => {
    setEditingId(null);
    setFormData(FORM_VACIO);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre || formData.precio === '' || formData.cantidad === '' || !formData.fechaCaducidad) {
      alert('Completa nombre, precio, cantidad y fecha de caducidad.');
      return;
    }
    onSaveProduct({
      ...formData,
      id: editingId ?? Date.now().toString(),
      precio: parseFloat(formData.precio) || 0,
      cantidad: parseInt(formData.cantidad, 10) || 0
    });
    if (editingId) {
      cancelarEdicion();
    } else {
      setFormData(FORM_VACIO);
      setVista('catalogo');
    }
  };

  const inputClass = "w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:border-emerald-500";
  const tabClass = (activa) =>
    `px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition ${
      activa ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
    }`;

  const productosFiltrados = products.filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));
  const mostrarFormulario = vista === 'alta' || editingId !== null;

  const formulario = (
    <form onSubmit={handleSubmit} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
      <div className="flex justify-between items-center border-b pb-3">
        <h3 className="font-bold text-slate-800 text-base">
          {editingId ? 'Editar Medicamento' : 'Agregar Nuevo Medicamento'}
        </h3>
        <span className="text-xs text-slate-500">* Campos obligatorios</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre comercial *</label>
          <input type="text" required value={formData.nombre} onChange={(e) => setCampo('nombre', e.target.value)} placeholder="Ej. Paracetamol Tempra 500mg" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Sustancia activa</label>
          <input type="text" value={formData.formula} onChange={(e) => setCampo('formula', e.target.value)} placeholder="Ej. Paracetamol" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Categoría *</label>
          <select value={formData.categoria} onChange={(e) => setCampo('categoria', e.target.value)} className={inputClass}>
            <option>Analgésicos</option>
            <option>Antiinflamatorios</option>
            <option>Antibióticos</option>
            <option>Antialérgicos</option>
            <option>Vitaminas</option>
            <option>Material de Curación</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Precio ($ MXN) *</label>
          <input type="number" step="0.01" min="0" required value={formData.precio} onChange={(e) => setCampo('precio', e.target.value)} placeholder="0.00" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Existencias *</label>
          <input type="number" min="0" required value={formData.cantidad} onChange={(e) => setCampo('cantidad', e.target.value)} placeholder="Ej. 50" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Fecha de caducidad *</label>
          <input type="date" required value={formData.fechaCaducidad} onChange={(e) => setCampo('fechaCaducidad', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Código de barras</label>
          <input type="text" value={formData.codigoBarras} onChange={(e) => setCampo('codigoBarras', e.target.value)} placeholder="Ej. 7501234500011" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Presentación</label>
          <input type="text" value={formData.presentacion} onChange={(e) => setCampo('presentacion', e.target.value)} placeholder="Caja con 20 tabletas" className={inputClass} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">Dosis sugerida</label>
          <input type="text" value={formData.dosis} onChange={(e) => setCampo('dosis', e.target.value)} placeholder="1 tableta cada 8 horas" className={inputClass} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción / Indicaciones</label>
          <textarea rows={2} value={formData.descripcion} onChange={(e) => setCampo('descripcion', e.target.value)} placeholder="Indicaciones terapéuticas..." className={inputClass} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">Foto del producto</label>
          <div className="flex items-center gap-3">
            {formData.imagen ? (
              <img src={formData.imagen} alt="Vista previa" className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-300 shrink-0">
                <ImageOff className="w-5 h-5" />
              </div>
            )}
            <ImageUploader onImageUploaded={(url) => setCampo('imagen', url)} />
          </div>
        </div>

        <label className="md:col-span-2 flex items-center gap-2 text-xs font-semibold text-slate-700">
          <input type="checkbox" checked={formData.requiereReceta} onChange={(e) => setCampo('requiereReceta', e.target.checked)} className="h-4 w-4" />
          Requiere receta médica
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={editingId ? cancelarEdicion : () => cambiarVista('catalogo')} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition">
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg transition flex items-center gap-1.5">
          <Save className="w-4 h-4" /> Guardar Producto
        </button>
      </div>
    </form>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-400" />
            <h2 className="text-lg font-bold">Administración de Inventario y Medicamentos</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pt-4 flex gap-2 border-b border-slate-200 bg-slate-50">
          <button onClick={() => cambiarVista('catalogo')} className={tabClass(vista === 'catalogo')}>
            <Package className="w-4 h-4" /> Catálogo ({products.length})
          </button>
          <button onClick={() => cambiarVista('alta')} className={tabClass(vista === 'alta')}>
            <Plus className="w-4 h-4" /> Dar de Alta
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {mostrarFormulario && formulario}

          {vista === 'catalogo' && (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar medicamento en el catálogo..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Producto</th>
                      <th className="p-3">Categoría</th>
                      <th className="p-3">Caducidad</th>
                      <th className="p-3">Precio</th>
                      <th className="p-3">Existencias</th>
                      <th className="p-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm bg-white">
                    {productosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-500">
                          {products.length === 0
                            ? 'No hay productos registrados en el inventario.'
                            : 'Ningún producto coincide con tu búsqueda.'}
                        </td>
                      </tr>
                    ) : (
                      productosFiltrados.map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-50 transition">
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              {prod.imagen ? (
                                <img src={prod.imagen} alt={prod.nombre} className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0" />
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300 shrink-0">
                                  <ImageOff className="w-4 h-4" />
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-slate-800">{prod.nombre}</p>
                                <p className="text-xs text-slate-400 line-clamp-1">{prod.formula || 'Sin sustancia activa registrada'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-xs text-slate-600 font-medium">{prod.categoria || 'General'}</td>
                          <td className="p-3 text-xs text-slate-600">{prod.fechaCaducidad || '—'}</td>
                          <td className="p-3 font-extrabold text-slate-900">${Number(prod.precio).toFixed(2)}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              prod.cantidad > 10 ? 'bg-emerald-100 text-emerald-800'
                              : prod.cantidad > 0 ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                            }`}>
                              {prod.cantidad} un.
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1">
                            <button onClick={() => setProductoAjuste(prod)} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition" title="Ajuste rápido de stock">
                              <SlidersHorizontal className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleEdit(prod)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Editar">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`¿Seguro que deseas eliminar ${prod.nombre}?`)) onDeleteProduct(prod.id);
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {productoAjuste && (
        <StockAdjustModal
          producto={productoAjuste}
          onClose={() => setProductoAjuste(null)}
          onAjustar={(id, nuevaCantidad) => onSaveProduct({ id, cantidad: nuevaCantidad })}
        />
      )}
    </div>
  );
}
