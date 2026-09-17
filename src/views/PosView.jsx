import { useState } from 'react';
import TicketModal from '../components/TicketModal';
import BarcodeScanner from '../components/BarcodeScanner';
import { Camera, AlertOctagon } from 'lucide-react';
import { apiProcesarVenta } from '../services/backend.js';

export default function PosView({
  inventario = [],
  onVentaRealizada = () => {},
  notificarStockBajo = () => {}
}) {
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [ultimoTicket, setUltimoTicket] = useState(null);
  const [recetaVerificada, setRecetaVerificada] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [procesando, setProcesando] = useState(false);

  const esCaducado = (fecha) => new Date(fecha) < new Date();
  const disponible = (producto) => producto.disponible ?? producto.cantidad;

  const agregarAlCarrito = (producto) => {
    if (esCaducado(producto.fechaCaducidad)) {
      alert(`¡BLOQUEO SANITARIO! ${producto.nombre} está CADUCADO y no puede venderse.`);
      return;
    }
    const disp = disponible(producto);
    if (disp <= 0) {
      alert(
        producto.cantidad > 0
          ? 'Sin existencias libres: el resto ya está reservado por pedidos en línea pendientes de recoger.'
          : 'Producto agotado.'
      );
      return;
    }
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        if (existe.cantidadSeleccionada >= disp) {
          alert('No hay más existencias libres de este medicamento.');
          return prev;
        }
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidadSeleccionada: item.cantidadSeleccionada + 1 }
            : item
        );
      }
      return [...prev, { ...producto, cantidadSeleccionada: 1 }];
    });
  };

  const requiereRecetaElCarrito = carrito.some((item) => item.requiereReceta);

  const buscarPorCodigo = (codigo) => {
    const encontrado = inventario.find((p) => p.codigoBarras === codigo.trim());
    if (encontrado) agregarAlCarrito(encontrado);
    else alert('Producto no encontrado por código de barras.');
  };

  const procesarVenta = async () => {
    if (carrito.length === 0) return;
    if (requiereRecetaElCarrito && !recetaVerificada) {
      alert('Hay medicamentos controlados en el carrito. Debe verificar la receta física antes de cobrar (RNF-09).');
      return;
    }

    setProcesando(true);
    const resultado = await apiProcesarVenta(carrito, requiereRecetaElCarrito);
    setProcesando(false);

    if (!resultado?.ok) {
      alert(resultado?.error ?? 'No se pudo procesar la venta.');
      return;
    }

    const totalVenta = carrito.reduce((acc, item) => acc + item.precio * item.cantidadSeleccionada, 0);
    carrito.forEach((item) => {
      const enInventario = inventario.find((p) => p.id === item.id);
      const restante = (enInventario?.cantidad ?? 0) - item.cantidadSeleccionada;
      if (restante <= 3) notificarStockBajo({ ...item, cantidad: restante });
    });

    setUltimoTicket({
      folio: resultado.id,
      cliente: 'Venta en mostrador',
      items: carrito,
      total: totalVenta,
      fecha: new Date().toISOString(),
      estado: 'Entregado'
    });
    setCarrito([]);
    setRecetaVerificada(false);
    onVentaRealizada();
  };

  const resultados = busqueda
    ? inventario.filter(
        (p) =>
          p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          p.codigoBarras?.includes(busqueda)
      )
    : [];

  return (
    <div className="bg-white p-4 rounded-2xl shadow border border-slate-200 space-y-4">
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="font-bold text-slate-700">Punto de Venta (Cobro Presencial)</h2>
        <button onClick={() => setShowScanner(true)} className="flex items-center gap-1 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg font-bold">
          <Camera className="h-4 w-4" /> Escanear Código
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre o código..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full border border-slate-200 p-2 rounded-lg text-sm"
      />

      {resultados.length > 0 && (
        <div className="border border-slate-200 rounded-lg bg-slate-50 max-h-40 overflow-y-auto divide-y">
          {resultados.map((p) => (
            <button
              key={p.id}
              onClick={() => { agregarAlCarrito(p); setBusqueda(''); }}
              className="w-full p-2 text-sm flex justify-between cursor-pointer hover:bg-emerald-50 text-left"
            >
              <span>
                {p.nombre} {p.requiereReceta && '(Receta)'}
                {esCaducado(p.fechaCaducidad) && <span className="text-red-600 font-bold"> · CADUCADO</span>}
              </span>
              <span className="font-bold">${p.precio.toFixed(2)}</span>
            </button>
          ))}
        </div>
      )}

      {carrito.length > 0 && (
        <div className="space-y-3 border-t pt-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase">Resumen de Venta</h3>
          {carrito.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.cantidadSeleccionada}x {item.nombre}</span>
              <span className="font-bold">${(item.precio * item.cantidadSeleccionada).toFixed(2)}</span>
            </div>
          ))}

          {requiereRecetaElCarrito && (
            <label className="bg-amber-50 border border-amber-300 p-2 rounded-lg flex items-center justify-between cursor-pointer">
              <span className="text-xs text-amber-800 font-semibold flex items-center gap-1">
                <AlertOctagon className="h-4 w-4 text-amber-600" /> Presentó receta física
              </span>
              <input type="checkbox" checked={recetaVerificada} onChange={(e) => setRecetaVerificada(e.target.checked)} className="h-4 w-4" />
            </label>
          )}

          <button onClick={procesarVenta} disabled={procesando} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-2 rounded-lg text-sm transition">
            {procesando ? 'Procesando...' : 'Completar y Generar Ticket'}
          </button>
        </div>
      )}

      {showScanner && (
        <BarcodeScanner onScan={buscarPorCodigo} onClose={() => setShowScanner(false)} />
      )}

      {ultimoTicket && (
        <TicketModal ticket={ultimoTicket} onClose={() => setUltimoTicket(null)} />
      )}
    </div>
  );
}