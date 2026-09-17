import { AlertTriangle, Package, BellRing } from 'lucide-react';
import { DIAS_ALERTA_CADUCIDAD } from '../services/api';

export default function AlertasView({ inventario = [] }) {
  const hoy = new Date();
  const caducados = inventario.filter((item) => new Date(item.fechaCaducidad) < hoy);
  const porCaducar = inventario.filter((item) => {
    const dias = Math.ceil((new Date(item.fechaCaducidad) - hoy) / (1000 * 60 * 60 * 24));
    return dias >= 0 && dias <= DIAS_ALERTA_CADUCIDAD;
  });
  const stockBajo = inventario.filter((item) => item.cantidad <= 3);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Centro de Alertas</h2>

      <div className="bg-white p-4 rounded-xl border-l-4 border-red-500 shadow-sm space-y-2">
        <h3 className="font-bold text-red-600 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" /> Caducados ({caducados.length})
        </h3>
        <div className="divide-y text-sm">
          {caducados.length === 0 ? (
            <p className="text-xs text-slate-400 py-1">Sin medicamentos caducados.</p>
          ) : (
            caducados.map((i) => (
              <div key={i.id} className="py-1 flex justify-between">
                <span>{i.nombre}</span>
                <span className="font-bold text-red-600">{i.fechaCaducidad}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border-l-4 border-amber-500 shadow-sm space-y-2">
        <h3 className="font-bold text-amber-600 flex items-center gap-2">
          <BellRing className="h-5 w-5" /> Por caducar en {DIAS_ALERTA_CADUCIDAD} días o menos ({porCaducar.length})
        </h3>
        <p className="text-[11px] text-slate-400">
          Estos son los productos por los que recibes notificación en el navegador.
        </p>
        <div className="divide-y text-sm">
          {porCaducar.length === 0 ? (
            <p className="text-xs text-slate-400 py-1">Ningún producto está próximo a caducar.</p>
          ) : (
            porCaducar.map((i) => (
              <div key={i.id} className="py-1 flex justify-between">
                <span>{i.nombre}</span>
                <span className="font-bold text-amber-600">{i.fechaCaducidad}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border-l-4 border-blue-500 shadow-sm space-y-2">
        <h3 className="font-bold text-blue-600 flex items-center gap-2">
          <Package className="h-5 w-5" /> Stock Bajo ({stockBajo.length})
        </h3>
        <div className="divide-y text-sm">
          {stockBajo.length === 0 ? (
            <p className="text-xs text-slate-400 py-1">Todos los productos tienen existencias suficientes.</p>
          ) : (
            stockBajo.map((i) => (
              <div key={i.id} className="py-1 flex justify-between">
                <span>{i.nombre}</span>
                <span className="font-bold text-slate-700">{i.cantidad} uds.</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}