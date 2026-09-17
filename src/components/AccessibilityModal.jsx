import React from 'react';
import { X, Eye, Type, Palette, Check } from 'lucide-react';

export default function AccessibilityModal({ config, setConfig, onClose }) {
  const updateConfig = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const themes = [
    { id: 'verde', name: 'Verde', color: 'bg-emerald-500' },
    { id: 'morado', name: 'Morado', color: 'bg-purple-600' },
    { id: 'rosa', name: 'Rosa', color: 'bg-pink-500' },
    { id: 'marino', name: 'Marino', color: 'bg-blue-800' },
    { id: 'calido', name: 'Cálido', color: 'bg-amber-600' },
    { id: 'neutro', name: 'Neutro', color: 'bg-slate-700' },
    { id: 'naranja', name: 'Naranja', color: 'bg-orange-500' },
    { id: 'turquesa', name: 'Turquesa', color: 'bg-teal-500' }
  ];

  return (
    <div 
      className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-800 dark:text-slate-200">
              <Eye className="w-5 h-5"/>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">Ajustes Visuales</h3>
              <p className="text-[11px] font-medium text-slate-400">Personaliza la lectura e interfaz</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4"/>
          </button>
        </div>

        {/* Tamaño Tipográfico */}
        <div className="space-y-2">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5"/> Escala de Texto
          </label>
          <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800">
            {[
              { id: 'normal', label: '100%' },
              { id: 'large', label: '115%' },
              { id: 'xlarge', label: '130%' }
            ].map((size) => (
              <button
                key={size.id}
                onClick={() => updateConfig('textSize', size.id)}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  config.textSize === size.id
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/80 dark:border-slate-700'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modos de Visión */}
        <div className="space-y-2">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Modo de Visión</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'claro', label: 'Modo Claro' },
              { id: 'oscuro', label: 'Modo Oscuro' },
              { id: 'grises', label: 'Escala Grises' },
              { id: 'altoContraste', label: 'Alto Contraste' },
              { id: 'daltonismo', label: 'Filtro Daltonismo' },
              { id: 'dislexia', label: 'Fuente OpenDyslexic' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => updateConfig('visionMode', mode.id)}
                className={`p-2.5 rounded-2xl text-xs font-bold text-left border transition-all ${
                  config.visionMode === mode.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-md'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Paleta de Color */}
        <div className="space-y-2">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5"/> Color Acento
          </label>
          <div className="grid grid-cols-4 gap-2">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => updateConfig('systemColor', t.id)}
                className={`p-2 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                  config.systemColor === t.id
                    ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800'
                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <span className={`w-4 h-4 rounded-full ${t.color} flex items-center justify-center text-white text-[8px]`}>
                  {config.systemColor === t.id && <Check className="w-3 h-3 stroke-[3]"/>}
                </span>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}