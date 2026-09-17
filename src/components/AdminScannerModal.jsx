import { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, XCircle, Search, Camera } from 'lucide-react';

export default function AdminScannerModal({ tickets = [], onClose, onConfirmDelivery, onCancelDelivery }) {
  const [folio, setFolio] = useState('');
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');
  const [escaneando, setEscaneando] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const buscarPorFolio = (valor) => {
    setError('');
    const limpio = valor.trim().toUpperCase();
    const encontrado = tickets.find((t) => t.folio.toUpperCase() === limpio);
    if (!encontrado) {
      setTicket(null);
      setError('No existe un ticket con ese folio.');
      return;
    }
    setTicket(encontrado);
    if (encontrado.estado !== 'Pendiente de Recolección') {
      setError(`Este ticket ya está marcado como "${encontrado.estado}".`);
    }
  };

  useEffect(() => {
    if (!escaneando) return;
    let intervalo;
    let cancelado = false;

    const iniciar = async () => {
      if (!('BarcodeDetector' in window) || !navigator.mediaDevices?.getUserMedia) {
        setEscaneando(false);
        setError('Este navegador no soporta lectura por cámara. Captura el folio manualmente.');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (cancelado) return stream.getTracks().forEach((t) => t.stop());
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
        intervalo = setInterval(async () => {
          if (!videoRef.current) return;
          try {
            const codigos = await detector.detect(videoRef.current);
            if (codigos.length > 0) {
              clearInterval(intervalo);
              let valor = codigos[0].rawValue;
              try { valor = JSON.parse(valor).folio ?? valor; } catch { /* QR de texto plano */ }
              setFolio(valor);
              buscarPorFolio(valor);
              setEscaneando(false);
            }
          } catch { /* fotograma ilegible */ }
        }, 400);
      } catch {
        setEscaneando(false);
        setError('No se pudo acceder a la cámara. Captura el folio manualmente.');
      }
    };

    iniciar();
    return () => {
      cancelado = true;
      if (intervalo) clearInterval(intervalo);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [escaneando]);

  const puedeEntregar = ticket?.estado === 'Pendiente de Recolección';

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-5 sm:p-6 shadow-2xl space-y-4 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600" aria-label="Cerrar">
          <X className="w-5 h-5" />
        </button>

        <div className="border-b pb-2">
          <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Panel de Administrador</span>
          <h3 className="font-extrabold text-sm text-slate-900 mt-1">Verificación de Pedido</h3>
        </div>

        {escaneando ? (
          <div className="space-y-2">
            <video ref={videoRef} className="w-full rounded-2xl bg-slate-900 aspect-video object-cover" muted playsInline />
            <button onClick={() => setEscaneando(false)} className="w-full bg-slate-200 text-slate-700 py-2 rounded-xl font-bold text-xs">
              Detener cámara
            </button>
          </div>
        ) : (
          <button onClick={() => { setError(''); setEscaneando(true); }} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2">
            <Camera className="w-4 h-4" /> Escanear código QR del cliente
          </button>
        )}

        <form onSubmit={(e) => { e.preventDefault(); buscarPorFolio(folio); }} className="flex gap-2">
          <input
            type="text" value={folio} onChange={(e) => setFolio(e.target.value)}
            placeholder="O captura el folio (ej. TK-A1B2C3)"
            className="flex-1 min-w-0 border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
            required
          />
          <button type="submit" className="bg-slate-900 text-white px-3.5 rounded-xl shrink-0" title="Buscar">
            <Search className="w-4 h-4" />
          </button>
        </form>

        {error && <p className="text-[11px] text-red-600 font-semibold">{error}</p>}

        {ticket && (
          <div className="space-y-2 text-xs">
            <div className="bg-slate-900 text-white p-3 rounded-xl">
              <p className="font-extrabold text-sm">Folio #{ticket.folio}</p>
              <p className="text-slate-300 text-[11px]">{ticket.cliente}</p>
              {ticket.telefono && <p className="text-slate-400 text-[10px]">Tel. {ticket.telefono}</p>}
              <p className="text-slate-400 text-[10px]">
                {new Date(ticket.fecha).toLocaleString('es-MX')}
              </p>
            </div>

            <p className="font-bold text-slate-700 pt-1">Medicamentos solicitados:</p>
            <div className="bg-slate-50 p-3 rounded-xl space-y-1 max-h-48 overflow-y-auto">
              {ticket.items.map((item) => (
                <div key={item.id} className="flex justify-between gap-2 border-b border-slate-100 pb-1 last:border-0">
                  <span className="min-w-0 truncate">
                    {item.nombre}
                    {item.requiereReceta && <span className="text-amber-600 font-bold"> · Receta</span>}
                  </span>
                  <span className="font-bold shrink-0">x{item.cantidadSeleccionada}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-extrabold text-slate-900 pt-1">
              <span>Total a Cobrar:</span>
              <span className="text-emerald-600">${ticket.total.toFixed(2)} MXN</span>
            </div>
          </div>
        )}

        {puedeEntregar && (
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button onClick={() => onCancelDelivery(ticket.folio)} className="bg-red-50 text-red-600 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1 hover:bg-red-100 transition">
              <XCircle className="w-4 h-4" /> Cancelar Pedido
            </button>
            <button onClick={() => onConfirmDelivery(ticket)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1 shadow-md transition">
              <CheckCircle className="w-4 h-4" /> Confirmar Entrega
            </button>
          </div>
        )}

        {ticket && (
          <p className="text-[10px] text-slate-400 leading-tight border-t pt-2">
            El inventario se descuenta únicamente al confirmar la entrega. Si cancelas, el stock permanece intacto.
          </p>
        )}
      </div>
    </div>
  );
}