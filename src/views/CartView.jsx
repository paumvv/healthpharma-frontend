import { useState } from 'react';
import { ShoppingBag, Trash2, ArrowRight, ExternalLink, Lock, AlertOctagon } from 'lucide-react';

export default function CartView({
  cart = [], esInvitado,
  onUpdateQuantity, onRemoveItem, onGenerateTicket, onSelectProduct, onOpenAuth
}) {
  const [recetaConfirmada, setRecetaConfirmada] = useState(false);

  const total = cart.reduce(
    (acc, item) => acc + (item.precio ?? 0) * (item.cantidadSeleccionada || 1), 0
  );

  const requiereRecetaElCarrito = cart.some((item) => item.requiereReceta);

  const handleGenerateClick = () => {
    if (esInvitado) {
      onOpenAuth?.('login');
      return;
    }
    if (requiereRecetaElCarrito && !recetaConfirmada) return;
    onGenerateTicket?.();
    setRecetaConfirmada(false);
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div>
        <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Mi Carrito</h2>
        <p className="text-xs text-slate-500 mt-0.5">Revisa tus productos antes de solicitar la recolección</p>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-2">
          <div className="inline-flex p-4 bg-slate-50 rounded-2xl">
            <ShoppingBag className="w-7 h-7 text-slate-300" />
          </div>
          <p className="text-sm font-bold text-slate-600">No hay medicamentos en tu carrito</p>
          <p className="text-xs text-slate-400">Explora el catálogo y agrega lo que necesites.</p>
        </div>
      ) : (
        <>
          <div className="space-y-2.5">
            {cart.map((item) => {
              const cantidad = item.cantidadSeleccionada || 1;
              const subtotal = item.precio * cantidad;
              return (
                <div key={item.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-2 sm:gap-3 hover:border-emerald-200 transition-colors">
                  <button type="button" onClick={() => onSelectProduct?.(item)} className="flex-1 min-w-0 text-left group">
                    <div className="flex items-center gap-1">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors truncate">{item.nombre}</h4>
                      <ExternalLink className="w-3 h-3 text-slate-400 shrink-0 opacity-0 group-hover:opacity-100" />
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">{item.formula}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      ${item.precio.toFixed(2)} c/u · Subtotal <span className="font-bold text-emerald-600">${subtotal.toFixed(2)}</span>
                    </p>
                  </button>

                  <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl shrink-0">
                    <button onClick={() => onUpdateQuantity?.(item.id, cantidad - 1)} className="text-sm font-bold text-slate-600 hover:text-emerald-600 w-5" aria-label="Disminuir">−</button>
                    <span className="text-xs font-black text-slate-900 w-5 text-center">{cantidad}</span>
                    <button onClick={() => onUpdateQuantity?.(item.id, cantidad + 1)} className="text-sm font-bold text-slate-600 hover:text-emerald-600 w-5" aria-label="Aumentar">+</button>
                  </div>

                  <button onClick={() => onRemoveItem?.(item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl shrink-0 transition" aria-label="Eliminar">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3.5 sticky bottom-24">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total a pagar en tienda</span>
              <span className="text-xl font-black text-slate-900">${total.toFixed(2)} MXN</span>
            </div>

            {esInvitado && (
              <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                Necesitas una cuenta para generar tu ticket de recolección.
              </p>
            )}

            {!esInvitado && requiereRecetaElCarrito && (
              <label className="bg-amber-50 border border-amber-300 p-3 rounded-2xl flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={recetaConfirmada} onChange={(e) => setRecetaConfirmada(e.target.checked)} className="h-4 w-4 mt-0.5 shrink-0" />
                <span className="text-[11px] text-amber-800 font-semibold flex items-start gap-1.5">
                  <AlertOctagon className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  Tu pedido incluye medicamentos que requieren receta médica. Confirmo que presentaré la receta física al recogerlo en sucursal.
                </span>
              </label>
            )}

            <button
              onClick={handleGenerateClick}
              disabled={!esInvitado && requiereRecetaElCarrito && !recetaConfirmada}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm py-3.5 rounded-2xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
            >
              <span>{esInvitado ? 'Iniciar sesión para continuar' : 'Generar Ticket de Recolección'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
