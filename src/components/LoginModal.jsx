import { useState } from 'react';
import { X, Mail, LogIn, AlertCircle } from 'lucide-react';
import PasswordField from './PasswordField.jsx';

export default function LoginModal({ onClose, onLogin, onOpenRegister, onOpenRecuperar }) {
  const [formData, setFormData] = useState({ correo: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const resultado = await onLogin(formData);
    if (!resultado?.ok) setError(resultado?.error ?? 'No fue posible iniciar sesión.');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-sm p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full" aria-label="Cerrar">
          <X className="w-4 h-4" />
        </button>

        <div>
          <h3 className="font-display text-lg font-semibold text-slate-900">Iniciar Sesión</h3>
          <p className="text-xs text-slate-400 mt-0.5">Accede a tu cuenta de HealthPharma</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-2.5 rounded-lg flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="login-correo" className="text-[10px] font-bold text-slate-400 uppercase">Correo Electrónico</label>
            <div className="relative mt-1">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input id="login-correo" type="email" name="correo" required autoComplete="email" value={formData.correo} onChange={handleChange} placeholder="correo@ejemplo.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500" />
            </div>
          </div>

          <div>
            <label htmlFor="login-pass" className="text-[10px] font-bold text-slate-400 uppercase">Contraseña</label>
            <PasswordField id="login-pass" name="password" required autoComplete="current-password" value={formData.password} onChange={handleChange} placeholder="Tu contraseña" />
          </div>

          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-3 rounded-xl shadow-md flex items-center justify-center gap-2 mt-4 transition-all">
            <LogIn className="w-4 h-4" />
            <span>Ingresar</span>
          </button>

          <button type="button" onClick={onOpenRecuperar} className="w-full text-center text-[11px] text-slate-400 hover:text-slate-600 hover:underline">
            ¿Olvidaste tu contraseña?
          </button>
        </form>

        <div className="text-center border-t border-slate-100 pt-3">
          <button type="button" onClick={onOpenRegister} className="text-xs text-emerald-600 font-semibold hover:underline">
            ¿No tienes cuenta? Crear cuenta
          </button>
        </div>
      </div>
    </div>
  );
}