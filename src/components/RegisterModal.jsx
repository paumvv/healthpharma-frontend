import { useState } from 'react';
import { X, User, Calendar, Phone, Mail, UserPlus, AlertCircle } from 'lucide-react';
import PasswordField from './PasswordField.jsx';

export default function RegisterModal({ onClose, onRegister, onOpenLogin }) {
  const [formData, setFormData] = useState({
    nombre: '', apellidoPaterno: '', apellidoMaterno: '',
    fechaNacimiento: '', telefono: '', correo: '',
    password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'telefono' ? value.replace(/\D/g, '') : value });
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    if (score <= 1) return { score: 25, label: 'Débil', color: 'bg-red-500' };
    if (score <= 3) return { score: 65, label: 'Media', color: 'bg-amber-500' };
    return { score: 100, label: 'Fuerte', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(formData.password);
  const coincide = formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!/^[0-9]{10}$/.test(formData.telefono)) return setError('Ingresa un teléfono válido de 10 dígitos.');
    if (formData.password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');
    if (formData.password !== formData.confirmPassword) return setError('Las contraseñas no coinciden.');

    const nombreCompleto = `${formData.nombre} ${formData.apellidoPaterno} ${formData.apellidoMaterno}`
      .replace(/\s+/g, ' ').trim();
    const { confirmPassword, ...datos } = formData;
    const resultado = await onRegister({ ...datos, nombre: nombreCompleto });
    if (!resultado?.ok) setError(resultado?.error ?? 'No fue posible completar el registro.');
  };

  const base = "w-full bg-slate-50 border rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500";
  const inputClass = `${base} border-slate-200`;
  const inputIcono = `${inputClass} pl-9`;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full bg-white" aria-label="Cerrar">
          <X className="w-4 h-4" />
        </button>

        <div>
          <h3 className="font-display text-lg font-semibold text-slate-900">Crear Cuenta</h3>
          <p className="text-xs text-slate-400 mt-0.5">Ingresa tus datos personales</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-2.5 rounded-lg flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nombre(s) *</label>
            <div className="relative mt-1">
              <User className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input type="text" name="nombre" required value={formData.nombre} onChange={handleChange} placeholder="Tus nombres" className={inputIcono} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Apellido Paterno *</label>
              <input type="text" name="apellidoPaterno" required value={formData.apellidoPaterno} onChange={handleChange} placeholder="Paterno" className={`${inputClass} mt-1`} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Apellido Materno *</label>
              <input type="text" name="apellidoMaterno" required value={formData.apellidoMaterno} onChange={handleChange} placeholder="Materno" className={`${inputClass} mt-1`} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Fecha Nacimiento *</label>
              <div className="relative mt-1">
                <Calendar className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                <input type="date" name="fechaNacimiento" required max={new Date().toISOString().split('T')[0]} value={formData.fechaNacimiento} onChange={handleChange} className={inputIcono} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Teléfono (+52) *</label>
              <div className="relative mt-1">
                <Phone className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                <input type="tel" name="telefono" required maxLength={10} inputMode="numeric" value={formData.telefono} onChange={handleChange} placeholder="10 dígitos" className={inputIcono} />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Correo Electrónico *</label>
            <div className="relative mt-1">
              <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input type="email" name="correo" required value={formData.correo} onChange={handleChange} placeholder="correo@ejemplo.com" className={inputIcono} />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Contraseña *</label>
            <PasswordField name="password" required minLength={6} autoComplete="new-password" value={formData.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" />
            {formData.password && (
              <div className="mt-1.5 space-y-1">
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${strength.color}`} style={{ width: `${strength.score}%` }} />
                </div>
                <p className="text-[10px] text-right font-bold text-slate-500">
                  Seguridad: <span className="text-slate-700">{strength.label}</span>
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Confirmar Contraseña *</label>
            <PasswordField
              name="confirmPassword" required autoComplete="new-password"
              value={formData.confirmPassword} onChange={handleChange} placeholder="Repite tu contraseña"
              className={
                formData.confirmPassword.length === 0 ? 'border-slate-200'
                : coincide ? 'border-emerald-400' : 'border-red-400'
              }
            />
            {formData.confirmPassword.length > 0 && (
              <p className={`text-[10px] mt-1 font-bold ${coincide ? 'text-emerald-600' : 'text-red-500'}`}>
                {coincide ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
              </p>
            )}
          </div>

          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-3 rounded-xl shadow-md flex items-center justify-center gap-2 mt-4 transition-all">
            <UserPlus className="w-4 h-4" />
            <span>Completar Registro</span>
          </button>
        </form>

        <div className="text-center border-t border-slate-100 pt-3">
          <button type="button" onClick={onOpenLogin} className="text-xs text-emerald-600 font-semibold hover:underline">
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
}