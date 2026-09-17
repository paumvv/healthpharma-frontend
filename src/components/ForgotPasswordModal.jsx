import { useState } from 'react';
import { X, Mail, Phone, KeyRound, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import PasswordField from './PasswordField.jsx';

const PASOS = [
  { id: 1, titulo: 'Verificar identidad' },
  { id: 2, titulo: 'Nueva contraseña' },
];

export default function ForgotPasswordModal({ onClose, onVerificarCuenta, onRecuperar, onOpenLogin }) {
  const [paso, setPaso] = useState(1);
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [passwordConfirmar, setPasswordConfirmar] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const handleVerificar = (e) => {
    e.preventDefault();
    setError('');
    const resultado = onVerificarCuenta?.(correo, telefono);
    if (!resultado?.ok) return setError(resultado?.error ?? 'No fue posible verificar la cuenta.');
    setPaso(2);
  };

  const handleRestablecer = async (e) => {
    e.preventDefault();
    setError('');
    if (passwordNueva.length < 6) return setError('La nueva contraseña debe tener al menos 6 caracteres.');
    if (passwordNueva !== passwordConfirmar) return setError('Las contraseñas no coinciden.');
    const resultado = await onRecuperar(correo, telefono, passwordNueva);
    if (!resultado?.ok) return setError(resultado?.error ?? 'No fue posible restablecer la contraseña.');
    setExito(true);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-sm p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full" aria-label="Cerrar">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Recuperar Contraseña</h3>
            <p className="text-[11px] text-slate-400">Sin correo de verificación: confirmamos tu identidad con tus datos registrados.</p>
          </div>
        </div>

        {!exito && (
          <div className="flex items-center gap-2">
            {PASOS.map((p, idx) => (
              <div key={p.id} className="flex items-center gap-2 flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0 ${
                  paso >= p.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {p.id}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wide ${paso >= p.id ? 'text-slate-700' : 'text-slate-300'}`}>
                  {p.titulo}
                </span>
                {idx < PASOS.length - 1 && <div className={`h-0.5 flex-1 rounded ${paso > p.id ? 'bg-emerald-600' : 'bg-slate-100'}`} />}
              </div>
            ))}
          </div>
        )}

        {exito ? (
          <div className="space-y-4">
            <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 shrink-0" /> Contraseña actualizada. Ya puedes iniciar sesión.
            </p>
            <button onClick={onOpenLogin} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-3 rounded-xl shadow-md transition-all">
              Ir a Iniciar Sesión
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-2.5 rounded-lg flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {paso === 1 && (
              <form onSubmit={handleVerificar} className="space-y-3">
                <div>
                  <label htmlFor="recuperar-correo" className="text-[10px] font-bold text-slate-400 uppercase">Correo Electrónico</label>
                  <div className="relative mt-1">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input id="recuperar-correo" type="email" required value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="correo@ejemplo.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500" />
                  </div>
                </div>

                <div>
                  <label htmlFor="recuperar-telefono" className="text-[10px] font-bold text-slate-400 uppercase">Teléfono registrado</label>
                  <div className="relative mt-1">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input id="recuperar-telefono" type="tel" inputMode="numeric" maxLength={10} required value={telefono} onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))} placeholder="10 dígitos" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all">
                  Continuar <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {paso === 2 && (
              <form onSubmit={handleRestablecer} className="space-y-3">
                <button type="button" onClick={() => { setError(''); setPaso(1); }} className="text-[11px] font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Volver
                </button>

                <div>
                  <label htmlFor="recuperar-nueva" className="text-[10px] font-bold text-slate-400 uppercase">Nueva Contraseña</label>
                  <PasswordField id="recuperar-nueva" required minLength={6} value={passwordNueva} onChange={(e) => setPasswordNueva(e.target.value)} placeholder="Mínimo 6 caracteres" />
                </div>

                <div>
                  <label htmlFor="recuperar-confirmar" className="text-[10px] font-bold text-slate-400 uppercase">Confirmar Nueva Contraseña</label>
                  <PasswordField id="recuperar-confirmar" required minLength={6} value={passwordConfirmar} onChange={(e) => setPasswordConfirmar(e.target.value)} placeholder="Repite la contraseña" />
                </div>

                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-3 rounded-xl shadow-md transition-all">
                  Restablecer Contraseña
                </button>
              </form>
            )}
          </>
        )}

        <div className="text-center border-t border-slate-100 pt-3">
          <button type="button" onClick={onOpenLogin} className="text-xs text-emerald-600 font-semibold hover:underline">
            Volver a Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
