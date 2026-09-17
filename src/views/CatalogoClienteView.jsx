import { useState, useMemo } from 'react';
import { Search, ShoppingBag, AlertCircle, Eye, TrendingUp, ShieldCheck } from 'lucide-react';

export default function CatalogoClienteView({ inventario = [], vecesCompradoPorProducto = {}, onAgregar, onVerDetalle }) {
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todas');

  const categorias = useMemo(
    () => ['Todas', ...Array.from(new Set(inventario.map((p) => p.categoria).filter(Boolean))).sort()],
    [inventario]
  );

  const hoy = new Date();
  const productosDisponibles = inventario.filter(
    (p) =>
      p.cantidad > 0 &&
      new Date(p.fechaCaducidad) >= hoy &&
      (categoria === 'Todas' || p.categoria === categoria) &&
      p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white p-5 sm:p-7 rounded-3xl shadow-lg shadow-emerald-900/10">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -right-2 bottom-0 text-7xl opacity-10 select-none">💊</div>
        <div className="relative space-y-1.5">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-100 bg-white/10 px-2.5 py-1 rounded-full">
            <ShieldCheck className="h-3 w-3" /> Sucursal 044
          </span>
          <h2 className="font-black text-xl sm:text-2xl tracking-tight">Catálogo HealthPharma</h2>
          <p className="text-sm text-emerald-100/90">Explora y aparta tus medicamentos para recoger en sucursal.</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar medicamento o producto..."
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-3 px-3 sm:mx-0 sm:px-0">
        {categorias.map((c) => (
          <button
            key={c}
            onClick={() => setCategoria(c)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition ${
              categoria === c
                ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/10'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {productosDisponibles.length === 0 ? (
        <p className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-xs font-bold text-slate-500">
          No hay medicamentos disponibles con ese criterio.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {productosDisponibles.map((prod) => (
            <div key={prod.id} className="group bg-white p-4 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 flex flex-col justify-between gap-3 hover:border-emerald-300 transition-all">
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  {prod.imagen ? (
                    <img src={prod.imagen} alt={prod.nombre} className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-xl shrink-0">💊</div>
                  )}
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">{prod.categoria}</span>
                    <p className="font-bold text-slate-800 text-sm leading-tight group-hover:text-emerald-700 transition-colors">{prod.nombre}</p>
                    <p className="text-[11px] text-slate-500">{prod.presentacion}</p>
                  </div>
                </div>
                <button onClick={() => onVerDetalle?.(prod)} className="p-2 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 text-slate-500 rounded-xl shrink-0 transition" title="Ver ficha técnica">
                  <Eye className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {prod.requiereReceta && (
                  <span className="inline-flex w-fit items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-1 rounded-full font-semibold">
                    <AlertCircle className="h-3 w-3" /> Requiere Receta
                  </span>
                )}
                {vecesCompradoPorProducto[prod.id] > 0 && (
                  <span className="inline-flex w-fit items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full font-semibold">
                    <TrendingUp className="h-3 w-3" /> Comprado {vecesCompradoPorProducto[prod.id]}x
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wide">Precio</span>
                  <span className="text-lg font-extrabold text-slate-900">${prod.precio.toFixed(2)}</span>
                </div>
                <button onClick={() => onAgregar?.(prod)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition">
                  <ShoppingBag className="h-4 w-4" /> Agregar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
