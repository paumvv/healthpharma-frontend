import { QRCodeSVG } from 'qrcode.react';
import { X } from 'lucide-react';
import PickupDeadline from './PickupDeadline';

const ESTILO_ESTADO = {
  'Pendiente de Recolección': 'bg-amber-100 text-amber-800',
  'Entregado': 'bg-emerald-100 text-emerald-800',
  'Cancelado': 'bg-red-100 text-red-700'
};

export default function TicketModal({ ticket, onClose, onCancelTicket }) {
  if (!ticket) return null;

  const cancelable = ticket.estado === 'Pendiente de Recolección' && typeof onCancelTicket === 'function';
  const contenidoQR = JSON.stringify({ folio: ticket.folio, total: ticket.total, sucursal: '044' });

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 relative print-area" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full" aria-label="Cerrar">
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-1.5">
          <h3 className="font-display font-semibold text-base text-slate-900">Ticket de Recolección</h3>
          <p className="text-[10px] font-bold text-emerald-600">Folio: #{ticket.folio}</p>
          <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full ${ESTILO_ESTADO[ticket.estado] ?? 'bg-slate-100 text-slate-600'}`}>
            {ticket.estado}
          </span>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center border border-slate-200">
          <QRCodeSVG value={contenidoQR} size={128} level="M" includeMargin />
          <p className="text-[9px] text-slate-400 mt-2 text-center">
            Presenta este código en la Sucursal 044 para verificar y recibir tus productos
          </p>
          {ticket.estado === 'Pendiente de Recolección' && (
            <div className="mt-2">
              <PickupDeadline fecha={ticket.fecha} />
            </div>
          )}
        </div>

        {/* La lista de medicamentos se muestra siempre, sin importar el estado */}
        <div className="space-y-1.5 border-t border-b py-2 text-xs">
          {ticket.items.map((i) => (
            <div key={i.id} className="flex justify-between">
              <span className="text-slate-700">{i.cantidadSeleccionada}x {i.nombre}</span>
              <span className="font-bold">${(i.precio * i.cantidadSeleccionada).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-slate-900 border-t pt-1">
            <span>Total:</span>
            <span className="font-display font-semibold">${ticket.total.toFixed(2)} MXN</span>
          </div>
        </div>

        {ticket.estado === 'Cancelado' && (
          <p className="text-[11px] text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-xl text-center leading-relaxed">
            Este ticket fue cancelado. No se descontó ningún medicamento del inventario.
          </p>
        )}

        {cancelable && (
          <button
            onClick={() => onCancelTicket(ticket.folio)}
            className="w-full bg-red-50 text-red-600 font-bold text-xs py-2.5 rounded-xl border border-red-200 hover:bg-red-100 transition"
          >
            Cancelar Ticket
          </button>
        )}
      </div>
    </div>
  );
}