import { useMemo, useState } from 'react';
import { Calendar, TrendingUp, Package, Filter } from 'lucide-react';

const inicioDeHoy = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export default function VentasView({ ventas = [] }) {
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const ventasHoy = useMemo(() => {
    const hoy = inicioDeHoy();
    return ventas.filter((v) => new Date(v.fecha) >= hoy);
  }, [ventas]);

  const totalHoy = ventasHoy.reduce((acc, v) => acc + v.total, 0);

  const ventasFiltradas = useMemo(() => {
    return ventas.filter((v) => {
      const fecha = new Date(v.fecha);
      if (fechaDesde && fecha < new Date(fechaDesde)) return false;
      if (fechaHasta) {
        const limite = new Date(fechaHasta);
        limite.setHours(23, 59, 59, 999);
        if (fecha > limite) return false;
      }
      return true;
    });
  }, [ventas, fechaDesde, fechaHasta]);

  const totalFiltrado = ventasFiltradas.reduce((acc, v) => acc + v.total, 0);

  const topProductos = useMemo(() => {
    const conteo = {};
    ventasFiltradas.forEach((v) =>
      (v.items || []).forEach((i) => {
        if (!conteo[i.nombre]) conteo[i.nombre] = { nombre: i.nombre, unidades: 0, total: 0 };
        conteo[i.nombre].unidades += i.cantidadSeleccionada;
        conteo[i.nombre].total += i.precio * i.cantidadSeleccionada;
      })
    );
    return Object.values(conteo).sort((a, b) => b.unidades - a.unidades).slice(0, 5);
  }, [ventasFiltradas]);

  const limpiarFiltros = () => { setFechaDesde(''); setFechaHasta(''); };
  const hayFiltros = fechaDesde || fechaHasta;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-blue-900 text-white p-4 rounded-xl shadow-sm">
          <span className="text-xs text-blue-200">Corte de Caja de Hoy ({ventasHoy.length} ventas)</span>
          <p className="text-2xl font-bold">${totalHoy.toFixed(2)}</p>
        </div>
        <div className="bg-emerald-700 text-white p-4 rounded-xl shadow-sm">
          <span className="text-xs text-emerald-100">Total Histórico Registrado</span>
          <p className="text-2xl font-bold">${ventas.reduce((acc, v) => acc + v.total, 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
          <Filter className="w-3.5 h-3.5" /> Filtrar reporte por rango de fechas
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div>
            <label className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 mb-1">
              <Calendar className="w-3 h-3" /> Desde
            </label>
            <input type="date" value={fechaDesde} max={fechaHasta || undefined} onChange={(e) => setFechaDesde(e.target.value)} className="w-full p-2 text-xs border border-slate-300 rounded-lg" />
          </div>
          <div>
            <label className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 mb-1">
              <Calendar className="w-3 h-3" /> Hasta
            </label>
            <input type="date" value={fechaHasta} min={fechaDesde || undefined} onChange={(e) => setFechaHasta(e.target.value)} className="w-full p-2 text-xs border border-slate-300 rounded-lg" />
          </div>
          {hayFiltros && (
            <button onClick={limpiarFiltros} className="text-[11px] font-bold text-slate-500 hover:text-slate-700 px-3 py-2 border border-slate-300 rounded-lg self-end">
              Limpiar filtro
            </button>
          )}
        </div>
        {hayFiltros && (
          <p className="text-xs text-slate-600 font-semibold pt-1">
            {ventasFiltradas.length} ventas en el rango · Total: <span className="text-emerald-700">${totalFiltrado.toFixed(2)}</span>
          </p>
        )}
      </div>

      {topProductos.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 space-y-2">
          <h3 className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Productos más vendidos {hayFiltros ? 'en el rango' : '(histórico)'}
          </h3>
          <div className="divide-y divide-slate-100">
            {topProductos.map((p) => (
              <div key={p.nombre} className="py-1.5 flex justify-between items-center text-xs">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Package className="w-3.5 h-3.5 text-slate-400" /> {p.nombre}
                </span>
                <span className="font-bold text-slate-800">{p.unidades} un. · ${p.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y">
        {ventasFiltradas.length === 0 ? (
          <p className="p-4 text-xs text-slate-400 text-center">No hay ventas registradas en este rango.</p>
        ) : (
          ventasFiltradas.map((v) => (
            <div key={v.id} className="p-3 flex justify-between items-center text-sm">
              <div>
                <p className="font-bold text-slate-700">Ticket #{v.id}</p>
                <p className="text-xs text-slate-400">
                  {new Date(v.fecha).toLocaleString('es-MX')} {v.origen ? `· ${v.origen}` : ''}
                </p>
              </div>
              <span className="font-extrabold text-emerald-600">${v.total.toFixed(2)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
