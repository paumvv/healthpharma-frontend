import React, { useState } from 'react';
import { X, ZoomIn, ShieldAlert, ShoppingBag, Share2, TrendingUp } from 'lucide-react';
import ShareModal from './ShareModal';
import PillIcon from './PillIcon.jsx';

export default function ProductCardModal({ product, vecesComprado = 0, onClose, onAddToCart }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [showShare, setShowShare] = useState(false);

  if (!product) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-40 overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 my-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-full text-slate-400 hover:text-slate-600 shadow-sm"
          >
            <X className="w-4 h-4"/>
          </button>

          <div
            onClick={() => setIsZoomed(true)}
            className="relative w-full h-48 rounded-2xl bg-clay-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center cursor-pointer group overflow-hidden"
          >
            {product.imagen ? (
              <img src={product.imagen} alt={product.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            ) : (
              <PillIcon className="w-16 h-16 text-clay-400 group-hover:scale-110 transition-transform" />
            )}
            <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-md">
              <ZoomIn className="w-3 h-3"/> Ampliar Imagen
            </div>
          </div>

          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 px-2 py-0.5 rounded-md">
                  {product.categoria}
                </span>
                <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white mt-1 leading-tight">{product.nombre}</h2>
              </div>
              <button
                onClick={() => setShowShare(true)}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              >
                <Share2 className="w-4 h-4"/>
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Fórmula:</span> {product.formula}
            </p>
          </div>

          <div className="space-y-2.5 border-y border-slate-100 dark:border-slate-800 py-3.5 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Presentación Comercial</p>
              <p className="font-medium text-slate-800 dark:text-slate-200">{product.presentacion}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Posología Sugerida</p>
              <p className="font-medium text-slate-800 dark:text-slate-200">{product.dosis}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Indicaciones Terapéuticas</p>
              <p className="leading-relaxed">{product.descripcion}</p>
            </div>

            {product.contraindicaciones && (
              <div className="flex items-start gap-1.5 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-900/30">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5"/>
                <p className="text-[11px]"><span className="font-bold">Contraindicaciones:</span> {product.contraindicaciones}</p>
              </div>
            )}
          </div>

          {vecesComprado > 0 && (
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-3 py-2 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
              <TrendingUp className="w-4 h-4 shrink-0"/>
              <p className="text-[11px] font-semibold">
                Comprado {vecesComprado} {vecesComprado === 1 ? 'vez' : 'veces'} por nuestros clientes
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Precio Unitario</span>
              <p className="font-display text-xl font-semibold text-slate-900 dark:text-white">${product.precio?.toFixed(2)} <span className="font-sans text-xs font-semibold text-slate-400">MXN</span></p>
            </div>

            <button
              onClick={() => { onAddToCart(product); onClose(); }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4"/> Agregar
            </button>
          </div>
        </div>
      </div>

      {isZoomed && (
        <div
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-50 p-6"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-xs w-full bg-white dark:bg-slate-900 rounded-3xl p-8 flex flex-col items-center text-center space-y-4 shadow-2xl border border-slate-800">
            <button onClick={() => setIsZoomed(false)} className="absolute right-4 top-4 text-slate-400 hover:text-white">
              <X className="w-6 h-6"/>
            </button>
            {product.imagen ? (
              <img src={product.imagen} alt={product.nombre} className="w-full max-h-64 object-contain rounded-2xl" />
            ) : (
              <PillIcon className="w-20 h-20 py-4 text-clay-300" />
            )}
            <div>
              <h4 className="font-display font-semibold text-slate-900 dark:text-white text-base">{product.nombre}</h4>
              <p className="text-xs text-slate-400 mt-1">{product.presentacion}</p>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Pulsa en cualquier zona fuera para cerrar</p>
          </div>
        </div>
      )}

      {showShare && (
        <ShareModal onClose={() => setShowShare(false)} product={product} />
      )}
    </>
  );
}