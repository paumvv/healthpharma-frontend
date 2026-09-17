import React from 'react';
import Logo from './Logo';
import { UserCheck, UserPlus, LogIn, ShieldCheck } from 'lucide-react';

export default function WelcomeScreen({ onSelectOption }) {
  return (
    <div className="min-h-screen bg-emerald-700 flex items-center justify-center p-4 font-sans">
      <div className="max-w-xs w-full bg-white rounded-3xl p-7 shadow-2xl border border-slate-100 text-center space-y-7">
        <div className="flex flex-col items-center space-y-3">
          <div className="p-3 bg-emerald-50 rounded-2xl">
            <Logo className="h-12 w-12" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold text-slate-900 tracking-tight">HealthPharma</h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Catálogo Farmacéutico · Sucursal 044</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            <ShieldCheck className="h-3 w-3" /> Farmacia verificada
          </span>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={() => onSelectOption('login')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-lg shadow-slate-900/10 transition"
          >
            <LogIn className="h-4 w-4" /> Iniciar Sesión
          </button>

          <button
            onClick={() => onSelectOption('registro')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-lg shadow-emerald-600/20 transition"
          >
            <UserPlus className="h-4 w-4" /> Crear Cuenta Nueva
          </button>

          <button
            onClick={() => onSelectOption('invitado')}
            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 border border-slate-200 transition"
          >
            <UserCheck className="h-4 w-4 text-slate-500" /> Continuar como Invitado
          </button>
        </div>
      </div>
    </div>
  );
}