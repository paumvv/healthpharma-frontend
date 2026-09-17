import React, { useState } from 'react';
import { X, Send, Link, Check, Share2 } from 'lucide-react';
import { BRANCH_LOCATION } from '../services/locationService';

export default function ShareModal({ product, order, onClose }) {
  const [copied, setCopied] = useState(false);

  const generateShareMessage = () => {
    if (product) {
      return (
        `💊 *HEALTHPHARMA - FICHA DE MEDICAMENTO*\n` +
        `----------------------------------------\n` +
        `• *Producto:* ${product.nombre}\n` +
        `• *Categoría:* ${product.categoria}\n` +
        `• *Sustancia Activa:* ${product.formula}\n` +
        `• *Presentación:* ${product.presentacion}\n` +
        `• *Dosis Sugerida:* ${product.dosis}\n` +
        `• *Indicaciones:* ${product.descripcion}\n` +
        (product.contraindicaciones ? `• *Contraindicaciones:* ${product.contraindicaciones}\n` : '') +
        `• *Precio:* $${product.precio?.toFixed(2)} MXN\n\n` +
        `📍 *Sucursal de Atención (${BRANCH_LOCATION.id}):*\n` +
        `${BRANCH_LOCATION.direccion}\n` +
        `https://maps.google.com/?q=${BRANCH_LOCATION.coordenadas.lat},${BRANCH_LOCATION.coordenadas.lng}`
      );
    }

    if (order) {
      const itemsList = order.items
        .map(i => `  - ${i.nombre} (${i.cantidad}x) - $${(i.precio * i.cantidad).toFixed(2)} MXN`)
        .join('\n');

      return (
        `🛒 *HEALTHPHARMA - RESUMEN DE PEDIDO*\n` +
        `----------------------------------------\n` +
        `• *Folio:* #${order.id}\n` +
        `• *Fecha:* ${order.fecha}\n` +
        `• *Productos:\n${itemsList}\n` +
        `• *Total:* $${order.total?.toFixed(2)} MXN\n\n` +
        `📍 *Ubicación de Referencia (${BRANCH_LOCATION.id}):*\n` +
        `${BRANCH_LOCATION.direccion}\n` +
        `https://maps.google.com/?q=${BRANCH_LOCATION.coordenadas.lat},${BRANCH_LOCATION.coordenadas.lng}`
      );
    }

    return '';
  };

  const shareMessage = generateShareMessage();

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank');
  };

  const handleTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent('https://healthpharma.app')}&text=${encodeURIComponent(shareMessage)}`, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-all"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl">
              <Share2 className="w-5 h-5"/>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Compartir Ficha Técnica</h3>
              <p className="text-[11px] text-slate-500">Incluye detalles médicos y ubicación</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full">
            <X className="w-5 h-5"/>
          </button>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 max-h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed">
          {shareMessage}
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={handleWhatsApp}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md"
          >
            <Send className="w-4 h-4"/>
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleTelegram}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md"
          >
            <Send className="w-4 h-4"/>
            <span>Telegram</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-slate-900 text-white font-bold text-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400"/> : <Link className="w-4 h-4"/>}
            <span>{copied ? 'Copiado' : 'Copiar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}