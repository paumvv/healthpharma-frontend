import { useState, useEffect, useRef, useMemo } from 'react';
import {
  MapPin, Navigation, ShoppingBag, Calendar, Filter, X, Camera,
  LogIn, UserPlus, User, Phone, Lock, AlertCircle, CheckCircle2
} from 'lucide-react';
import { BRANCH_LOCATION } from '../services/locationService';
import PickupDeadline from '../components/PickupDeadline';
import PasswordField from '../components/PasswordField.jsx';

// Los mensajes de confirmación se autodestruyen: no deben quedarse pegados en pantalla
const useMensajeTemporal = (mensaje, limpiar, ms = 5000) => {
  useEffect(() => {
    if (!mensaje) return;
    const timer = setTimeout(limpiar, ms);
    return () => clearTimeout(timer);
  }, [mensaje, limpiar, ms]);
};

export default function ProfileView({ usuario, esInvitado, onActualizarUsuario, onCambiarPassword, onOpenAuth, tickets = [], onVerTicket }) {
  const [isEditing, setIsEditing] = useState(false);
  const [nombre, setNombre] = useState(usuario?.nombre ?? '');
  const [telefono, setTelefono] = useState(usuario?.telefono ?? '');
  const [perfilError, setPerfilError] = useState('');
  const [perfilExito, setPerfilExito] = useState('');

  const [pwdActual, setPwdActual] = useState('');
  const [pwdNueva, setPwdNueva] = useState('');
  const [pwdConfirmar, setPwdConfirmar] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdExito, setPwdExito] = useState('');

  useMensajeTemporal(perfilExito, () => setPerfilExito(''));
  useMensajeTemporal(pwdExito, () => setPwdExito(''));

  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [ordersTab, setOrdersTab] = useState('recientes'); // 'recientes' | 'historial'
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [buscandoRuta, setBuscandoRuta] = useState(false);
  const fileRef = useRef(null);

  const categorias = useMemo(() => {
    const set = new Set();
    tickets.forEach((t) => t.items.forEach((i) => i.categoria && set.add(i.categoria)));
    return ['Todas', ...Array.from(set).sort()];
  }, [tickets]);

  const ticketsRecientes = useMemo(
    () =>
      tickets
        .filter((t) => t.estado === 'Pendiente de Recolección')
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)),
    [tickets]
  );

  const ticketsHistorialBase = useMemo(
    () => tickets.filter((t) => t.estado !== 'Pendiente de Recolección'),
    [tickets]
  );

  // ---- MODO INVITADO: solo tarjeta de bienvenida ----
  if (esInvitado) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center space-y-5">
          <div className="inline-flex p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-slate-900">Estás navegando como invitado</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Inicia sesión o crea tu cuenta para generar tickets de recolección, guardar tu perfil y consultar tu historial de pedidos.
            </p>
          </div>
          <div className="space-y-2.5">
            <button onClick={() => onOpenAuth('login')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition">
              <LogIn className="h-4 w-4" /> Iniciar Sesión
            </button>
            <button onClick={() => onOpenAuth('registro')} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition">
              <UserPlus className="h-4 w-4" /> Crear Cuenta
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- MODO AUTENTICADO ----
  const handleFoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      alert('La imagen no debe superar 1 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onActualizarUsuario({ foto: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setPerfilError('');
    setPerfilExito('');
    if (telefono && !/^[0-9]{10}$/.test(telefono)) {
      setPerfilError('El teléfono debe tener 10 dígitos, o déjalo vacío.');
      return;
    }
    onActualizarUsuario({ nombre: nombre.trim(), telefono: telefono.trim() });
    setPerfilExito('Datos actualizados correctamente.');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdError('');
    setPwdExito('');
    if (pwdNueva.length < 6) {
      setPwdError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (pwdNueva !== pwdConfirmar) {
      setPwdError('Las contraseñas nuevas no coinciden.');
      return;
    }
    const resultado = await onCambiarPassword?.(pwdActual, pwdNueva);
    if (!resultado?.ok) {
      setPwdError(resultado?.error ?? 'No fue posible actualizar la contraseña.');
      return;
    }
    setPwdExito('Contraseña actualizada correctamente.');
    setPwdActual('');
    setPwdNueva('');
    setPwdConfirmar('');
  };

  const { lat, lng } = BRANCH_LOCATION.coordenadas;

  const calcularRuta = () => {
    if (!('geolocation' in navigator)) {
      alert('Tu dispositivo no permite geolocalización. Se abrirá la ubicación de la sucursal.');
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank', 'noopener');
      return;
    }
    setBuscandoRuta(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setBuscandoRuta(false);
        const origen = `${pos.coords.latitude},${pos.coords.longitude}`;
        window.open(
          `https://www.google.com/maps/dir/?api=1&origin=${origen}&destination=${lat},${lng}&travelmode=driving`,
          '_blank', 'noopener'
        );
      },
      () => {
        setBuscandoRuta(false);
        alert('No concediste el permiso de ubicación. Se abrirá la sucursal sin trazar la ruta desde tu posición.');
        window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank', 'noopener');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // --- Filtro real de calendario: Desde / Hasta (solo aplica al Historial) ---
  const dentroDelRango = (fechaISO) => {
    const fecha = new Date(fechaISO);
    if (fechaDesde && fecha < new Date(fechaDesde)) return false;
    if (fechaHasta) {
      const limite = new Date(fechaHasta);
      limite.setHours(23, 59, 59, 999); // incluye todo el día "hasta"
      if (fecha > limite) return false;
    }
    return true;
  };

  const limpiarFiltros = () => {
    setFechaDesde('');
    setFechaHasta('');
    setCategoria('Todas');
  };

  const hayFiltrosActivos = fechaDesde || fechaHasta || categoria !== 'Todas';

  const ticketsHistorialFiltrados = ticketsHistorialBase.filter(
    (t) => dentroDelRango(t.fecha) && (categoria === 'Todas' || t.items.some((i) => i.categoria === categoria))
  );

  const listaVisible = ordersTab === 'recientes' ? ticketsRecientes : ticketsHistorialFiltrados;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200">
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 justify-between border-b pb-5 mb-5 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 px-4 sm:px-6 pt-5 rounded-t-3xl bg-slate-900 text-white">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              {usuario?.foto ? (
                <img src={usuario.foto} alt="Foto de perfil" className="w-16 h-16 rounded-2xl object-cover shadow-lg" />
              ) : (
                <div className="w-16 h-16 bg-clay-500 text-emerald-900 font-display font-semibold rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-black/20">
                  {usuario?.nombre?.[0]?.toUpperCase() ?? 'U'}
                </div>
              )}
              <button onClick={() => fileRef.current?.click()} className="absolute -bottom-1 -right-1 p-1.5 bg-white text-slate-900 rounded-full shadow-md hover:bg-slate-100 transition" title="Cambiar foto de perfil">
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFoto} />
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-lg sm:text-xl font-semibold truncate">{usuario?.nombre}</h2>
              <p className="text-xs sm:text-sm text-slate-300 truncate">{usuario?.correo}</p>
              <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 uppercase tracking-wide">
                Cliente Registrado
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setIsEditing(!isEditing);
              setPerfilError(''); setPerfilExito(''); setPwdError(''); setPwdExito('');
            }}
            className="px-4 py-2 border border-white/20 hover:bg-white/10 text-white font-bold text-sm rounded-2xl transition shrink-0"
          >
            {isEditing ? 'Cancelar' : 'Editar Perfil'}
          </button>
        </div>

        {isEditing && (
          <div className="mb-5 space-y-4">
            <form onSubmit={handleSaveProfile} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Datos Personales</h3>
              <div>
                <label htmlFor="perfil-nombre" className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo</label>
                <input id="perfil-nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" required />
              </div>
              <div>
                <label htmlFor="perfil-telefono" className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> Teléfono (+52)
                </label>
                <input
                  id="perfil-telefono" type="tel" inputMode="numeric" maxLength={10}
                  value={telefono} onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))}
                  placeholder="10 dígitos" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <p className="text-[11px] text-slate-500">Para cambiar tu foto, usa el botón de cámara sobre tu avatar.</p>
              {perfilError && (
                <p className="text-[11px] text-red-600 bg-red-50 border border-red-200 p-2 rounded-lg flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {perfilError}
                </p>
              )}
              {perfilExito && (
                <p className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> {perfilExito}
                </p>
              )}
              <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-semibold text-sm rounded-lg hover:bg-emerald-700 transition">
                Guardar Cambios
              </button>
            </form>

            <form onSubmit={handleChangePassword} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Cambiar Contraseña
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="pwd-actual" className="block text-xs font-bold text-slate-700 mb-1">Contraseña actual</label>
                  <PasswordField id="pwd-actual" autoComplete="current-password" value={pwdActual} onChange={(e) => setPwdActual(e.target.value)} required className="border-slate-300" />
                </div>
                <div>
                  <label htmlFor="pwd-nueva" className="block text-xs font-bold text-slate-700 mb-1">Nueva contraseña</label>
                  <PasswordField id="pwd-nueva" autoComplete="new-password" minLength={6} value={pwdNueva} onChange={(e) => setPwdNueva(e.target.value)} required className="border-slate-300" />
                </div>
                <div>
                  <label htmlFor="pwd-confirmar" className="block text-xs font-bold text-slate-700 mb-1">Confirmar nueva</label>
                  <PasswordField id="pwd-confirmar" autoComplete="new-password" minLength={6} value={pwdConfirmar} onChange={(e) => setPwdConfirmar(e.target.value)} required className="border-slate-300" />
                </div>
              </div>
              {pwdError && (
                <p className="text-[11px] text-red-600 bg-red-50 border border-red-200 p-2 rounded-lg flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {pwdError}
                </p>
              )}
              {pwdExito && (
                <p className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> {pwdExito}
                </p>
              )}
              <button type="submit" className="px-4 py-2 bg-slate-900 text-white font-semibold text-sm rounded-lg hover:bg-slate-800 transition">
                Actualizar Contraseña
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <button onClick={() => { setOrdersTab('recientes'); setShowOrdersModal(true); }} className="p-4 border border-slate-200 rounded-2xl hover:border-emerald-400 hover:bg-emerald-50/40 hover:shadow-sm transition text-left flex items-center gap-3">
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-slate-800 text-sm">Mis Pedidos ({tickets.length})</h4>
              <p className="text-xs text-slate-500">Pedidos recientes e historial completo</p>
            </div>
          </button>

          <div className="p-4 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-blue-100 text-blue-700 rounded-xl shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-800 text-sm">{BRANCH_LOCATION.nombre}</h4>
                <p className="text-xs text-slate-500">{BRANCH_LOCATION.direccion}</p>
              </div>
            </div>
            <button onClick={calcularRuta} disabled={buscandoRuta} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition">
              <Navigation className="w-3.5 h-3.5" />
              {buscandoRuta ? 'Solicitando ubicación...' : 'Calcular Ruta'}
            </button>
          </div>
        </div>
      </div>

      {showOrdersModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50" onClick={() => setShowOrdersModal(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-400" /> Mis Pedidos
              </h3>
              <button onClick={() => setShowOrdersModal(false)} className="p-1 hover:bg-slate-800 rounded-lg" aria-label="Cerrar">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="px-4 sm:px-5 pt-3 bg-slate-50 border-b border-slate-200 flex gap-2">
              <button
                onClick={() => setOrdersTab('recientes')}
                className={`px-3.5 py-2 rounded-t-lg text-xs font-bold transition ${
                  ordersTab === 'recientes' ? 'bg-white text-emerald-700 border border-b-0 border-slate-200' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Recientes ({ticketsRecientes.length})
              </button>
              <button
                onClick={() => setOrdersTab('historial')}
                className={`px-3.5 py-2 rounded-t-lg text-xs font-bold transition ${
                  ordersTab === 'historial' ? 'bg-white text-emerald-700 border border-b-0 border-slate-200' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Historial ({ticketsHistorialBase.length})
              </button>
            </div>

            {ordersTab === 'recientes' && (
              <p className="px-4 sm:px-5 py-2 text-[11px] text-slate-500 bg-slate-50 border-b border-slate-200">
                Pedidos pendientes de recolección. Recuerda que tienes 2 días desde que generas el ticket para pasar por él.
              </p>
            )}

            {ordersTab === 'historial' && (
              <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center gap-1 text-xs font-semibold text-slate-600 mb-1">
                      <Calendar className="w-3.5 h-3.5" /> Desde
                    </label>
                    <input
                      type="date"
                      value={fechaDesde}
                      max={fechaHasta || undefined}
                      onChange={(e) => setFechaDesde(e.target.value)}
                      className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1 text-xs font-semibold text-slate-600 mb-1">
                      <Calendar className="w-3.5 h-3.5" /> Hasta
                    </label>
                    <input
                      type="date"
                      value={fechaHasta}
                      min={fechaDesde || undefined}
                      onChange={(e) => setFechaHasta(e.target.value)}
                      className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="flex items-center gap-1 text-xs font-semibold text-slate-600 mb-1">
                      <Filter className="w-3.5 h-3.5" /> Categoría de medicamento
                    </label>
                    <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-white">
                      {categorias.map((c) => <option key={c} value={c}>{c === 'Todas' ? 'Todas las categorías' : c}</option>)}
                    </select>
                  </div>
                  {hayFiltrosActivos && (
                    <button onClick={limpiarFiltros} className="text-[11px] font-bold text-slate-500 hover:text-slate-700 px-3 py-2.5 border border-slate-300 rounded-lg bg-white shrink-0">
                      Limpiar
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {listaVisible.length === 0 ? (
                <p className="text-center py-10 text-sm text-slate-500">
                  {ordersTab === 'recientes'
                    ? 'No tienes pedidos pendientes de recolección.'
                    : 'No se encontraron pedidos con los filtros seleccionados.'}
                </p>
              ) : (
                listaVisible.map((t) => (
                  <button key={t.folio} onClick={() => { setShowOrdersModal(false); onVerTicket?.(t); }} className="w-full p-4 border border-slate-200 rounded-xl hover:border-emerald-400 transition bg-white space-y-2 text-left">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <span className="font-extrabold text-slate-900 text-sm">#{t.folio}</span>
                        <p className="text-xs text-slate-500">
                          {new Date(t.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold shrink-0 ${
                        t.estado === 'Entregado' ? 'bg-emerald-100 text-emerald-800'
                        : t.estado === 'Cancelado' ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-800'
                      }`}>
                        {t.estado}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {t.items.map((i) => `${i.cantidadSeleccionada}x ${i.nombre}`).join(' · ')}
                    </p>
                    {ordersTab === 'recientes' && <PickupDeadline fecha={t.fecha} />}
                    <div className="border-t pt-2 flex justify-between items-center text-xs">
                      <span className="text-slate-600">Total a pagar en sucursal:</span>
                      <strong className="text-sm font-bold text-emerald-600">${t.total.toFixed(2)} MXN</strong>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
