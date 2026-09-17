import { useState, useEffect, useMemo } from 'react';
import { ShieldCheck, QrCode, PackagePlus, ShoppingCart, LogOut, Eye } from 'lucide-react';

import WelcomeScreen from './components/WelcomeScreen.jsx';
import Navbar from './components/Navbar.jsx';
import LoginModal from './components/LoginModal.jsx';
import RegisterModal from './components/RegisterModal.jsx';
import ForgotPasswordModal from './components/ForgotPasswordModal.jsx';
import TicketModal from './components/TicketModal.jsx';
import AdminScannerModal from './components/AdminScannerModal.jsx';
import AdminInventoryModal from './components/AdminInventoryModal.jsx';
import ProductCardModal from './components/ProductCardModal.jsx';
import AccessibilityModal from './components/AccessibilityModal.jsx';

import CatalogoClienteView from './views/CatalogoClienteView.jsx';
import CartView from './views/CartView.jsx';
import InventarioView from './views/InventarioView.jsx';
import PosView from './views/PosView.jsx';
import VentasView from './views/VentasView.jsx';
import AlertasView from './views/AlertasView.jsx';
import ProfileView from './views/ProfileView.jsx';

import { MEDICAMENTOS_REALES } from './data/medicamentos.js';
import { USUARIOS_SEMILLA } from './data/usuarios.js';
import {
  STORAGE_KEY, SALES_KEY, TICKETS_KEY, USER_KEY, USERS_KEY, ACCESIBILIDAD_KEY, CART_KEY,
  NOTIF_CADUCIDAD_KEY, NOTIF_RECOLECCION_KEY,
  DIAS_ALERTA_CADUCIDAD, HORAS_LIMITE_RECOLECCION,
  getStoredData, setStoredData, removeStoredData,
  registrarCambio, generarFolio, sinPassword
} from './services/api.js';
import { solicitarPermisoNotificaciones, enviarNotificacion } from './services/notifications.js';
import { hashPassword } from './services/crypto.js';
import { THEME_COLOR_OVERRIDES } from './utils/theme.js';

const CONFIG_ACCESIBILIDAD_INICIAL = { textSize: 'normal', visionMode: 'claro', systemColor: 'verde' };

export default function App() {
  const [usuarios, setUsuarios] = useState(() => getStoredData(USERS_KEY, USUARIOS_SEMILLA));
  const [usuario, setUsuario] = useState(() => getStoredData(USER_KEY, null));
  const [activeTab, setActiveTab] = useState('catalogo');

  const [inventario, setInventario] = useState(() => getStoredData(STORAGE_KEY, MEDICAMENTOS_REALES));
  const [ventas, setVentas] = useState(() => getStoredData(SALES_KEY, []));
  const [tickets, setTickets] = useState(() => getStoredData(TICKETS_KEY, []));
  const [carrito, setCarrito] = useState(() => getStoredData(CART_KEY, []));

  // null | 'login' | 'registro'
  const [authModal, setAuthModal] = useState(null);
  const [showAdminInventory, setShowAdminInventory] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [ticketActivo, setTicketActivo] = useState(null);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [accesibilidad, setAccesibilidad] = useState(() => getStoredData(ACCESIBILIDAD_KEY, CONFIG_ACCESIBILIDAD_INICIAL));

  useEffect(() => { setStoredData(STORAGE_KEY, inventario); }, [inventario]);
  useEffect(() => { setStoredData(SALES_KEY, ventas); }, [ventas]);
  useEffect(() => { setStoredData(TICKETS_KEY, tickets); }, [tickets]);
  useEffect(() => { setStoredData(USERS_KEY, usuarios); }, [usuarios]);
  useEffect(() => { setStoredData(ACCESIBILIDAD_KEY, accesibilidad); }, [accesibilidad]);
  // El carrito sobrevive a recargas de página y actualizaciones del Service Worker (PWA)
  useEffect(() => { setStoredData(CART_KEY, carrito); }, [carrito]);

  // --- Aplicar accesibilidad globalmente: tamaño de texto (rem) y color de acento
  // (Tailwind v4 expone cada color como variable CSS, así que sobreescribirla retiñe toda la app) ---
  useEffect(() => {
    const escalas = { normal: '100%', large: '115%', xlarge: '130%' };
    document.documentElement.style.fontSize = escalas[accesibilidad.textSize] ?? '100%';

    const overrides = THEME_COLOR_OVERRIDES[accesibilidad.systemColor];
    const root = document.documentElement.style;
    [50, 100, 400, 500, 600, 700, 800].forEach((tono) => {
      const variable = `--color-emerald-${tono}`;
      if (overrides?.[tono]) root.setProperty(variable, overrides[tono]);
      else root.removeProperty(variable);
    });
  }, [accesibilidad.textSize, accesibilidad.systemColor]);

  const claseAccesibilidad = accesibilidad.visionMode !== 'claro' ? `a11y-${accesibilidad.visionMode}` : '';

  const rol = usuario?.rol ?? null;
  const esInvitado = !usuario || rol === 'invitado';

  // --- Autenticación ------------------------------------------------------
  const autenticar = async ({ correo, password }) => {
    const hash = await hashPassword(password);
    const encontrado = usuarios.find(
      (u) => u.correo.toLowerCase() === correo.trim().toLowerCase() && u.password === hash
    );
    if (!encontrado) return { ok: false, error: 'Correo o contraseña incorrectos.' };
    const sesion = sinPassword(encontrado);
    setUsuario(sesion);
    setStoredData(USER_KEY, sesion);
    setAuthModal(null);
    setActiveTab('catalogo');
    return { ok: true };
  };

  const registrar = async (datos) => {
    const correo = datos.correo.trim().toLowerCase();
    if (usuarios.some((u) => u.correo.toLowerCase() === correo)) {
      return { ok: false, error: 'Ya existe una cuenta registrada con ese correo.' };
    }
    const passwordHash = await hashPassword(datos.password);
    const nuevo = { ...datos, correo, password: passwordHash, id: `u-${Date.now()}`, rol: 'cliente', foto: '' };
    setUsuarios((prev) => [...prev, nuevo]);
    const sesion = sinPassword(nuevo);
    setUsuario(sesion);
    setStoredData(USER_KEY, sesion);
    setAuthModal(null);
    setActiveTab('catalogo');
    registrarCambio('USUARIO_REGISTRADO', { correo });
    return { ok: true };
  };

  const entrarComoInvitado = () => {
    setUsuario({ nombre: 'Invitado', correo: '', rol: 'invitado', foto: '' });
    setActiveTab('catalogo');
  };

  const cerrarSesion = () => {
    setUsuario(null);
    removeStoredData(USER_KEY);
    setCarrito([]);
    setActiveTab('catalogo');
  };

  const actualizarUsuario = (cambios) => {
    const actualizado = { ...usuario, ...cambios };
    setUsuario(actualizado);
    setStoredData(USER_KEY, actualizado);
    setUsuarios((prev) =>
      prev.map((u) => (u.correo === actualizado.correo ? { ...u, ...cambios } : u))
    );
  };

  const cambiarPassword = async (passwordActual, passwordNueva) => {
    const cuenta = usuarios.find((u) => u.correo === usuario?.correo);
    const hashActual = await hashPassword(passwordActual);
    if (!cuenta || cuenta.password !== hashActual) {
      return { ok: false, error: 'La contraseña actual no es correcta.' };
    }
    const hashNueva = await hashPassword(passwordNueva);
    setUsuarios((prev) =>
      prev.map((u) => (u.correo === usuario.correo ? { ...u, password: hashNueva } : u))
    );
    registrarCambio('PASSWORD_ACTUALIZADA', { correo: usuario.correo });
    return { ok: true };
  };

  // Paso 1 del flujo de recuperación: solo confirma que correo + teléfono coincidan,
  // sin tocar la contraseña todavía (permite un wizard de 2 pasos en el modal).
  const verificarCuentaRecuperacion = (correo, telefono) => {
    const correoNorm = correo.trim().toLowerCase();
    const existe = usuarios.some(
      (u) => u.correo.toLowerCase() === correoNorm && u.telefono === telefono.trim()
    );
    if (!existe) return { ok: false, error: 'No encontramos una cuenta con ese correo y teléfono.' };
    return { ok: true };
  };

  // Recuperación sin backend: no hay correo real, se verifica identidad por correo + teléfono.
  const recuperarPassword = async (correo, telefono, passwordNueva) => {
    const correoNorm = correo.trim().toLowerCase();
    const cuenta = usuarios.find(
      (u) => u.correo.toLowerCase() === correoNorm && u.telefono === telefono.trim()
    );
    if (!cuenta) return { ok: false, error: 'No encontramos una cuenta con ese correo y teléfono.' };
    const hash = await hashPassword(passwordNueva);
    setUsuarios((prev) => prev.map((u) => (u.correo.toLowerCase() === correoNorm ? { ...u, password: hash } : u)));
    registrarCambio('PASSWORD_RECUPERADA', { correo: correoNorm });
    return { ok: true };
  };

  // --- Notificaciones locales (sin backend: solo mientras la app está abierta) ----
  useEffect(() => {
    if (rol !== 'admin') return;
    const hoy = new Date();
    const porCaducar = inventario.filter((p) => {
      const dias = Math.ceil((new Date(p.fechaCaducidad) - hoy) / (1000 * 60 * 60 * 24));
      return dias >= 0 && dias <= DIAS_ALERTA_CADUCIDAD;
    });
    if (porCaducar.length === 0) return;

    const hoyStr = hoy.toISOString().slice(0, 10);
    const registro = getStoredData(NOTIF_CADUCIDAD_KEY, { fecha: '', ids: [] });
    const idsYaAvisados = registro.fecha === hoyStr ? registro.ids : [];
    const idsPorAvisar = porCaducar.map((p) => p.id).filter((id) => !idsYaAvisados.includes(id));
    if (idsPorAvisar.length === 0) return;

    let cancelado = false;
    solicitarPermisoNotificaciones().then((concedido) => {
      if (cancelado || !concedido) return;
      enviarNotificacion(
        porCaducar.length === 1 ? 'Un medicamento está por caducar' : `${porCaducar.length} medicamentos están por caducar`,
        {
          body: porCaducar.slice(0, 5).map((p) => `${p.nombre} (${p.fechaCaducidad})`).join('\n'),
          tag: 'healthpharma-caducidad'
        }
      );
      setStoredData(NOTIF_CADUCIDAD_KEY, { fecha: hoyStr, ids: [...idsYaAvisados, ...idsPorAvisar] });
    });
    return () => { cancelado = true; };
  }, [inventario, rol]);

  useEffect(() => {
    if (rol !== 'cliente' || !usuario?.correo) return;
    const ahora = new Date();
    const pendientes = tickets.filter((t) => t.correo === usuario.correo && t.estado === 'Pendiente de Recolección');
    const conUnDiaOMas = pendientes.filter((t) => ahora - new Date(t.fecha) >= 24 * 60 * 60 * 1000);
    if (conUnDiaOMas.length === 0) return;

    const hoyStr = ahora.toISOString().slice(0, 10);
    const registro = getStoredData(NOTIF_RECOLECCION_KEY, { fecha: '', folios: [] });
    const foliosYaAvisados = registro.fecha === hoyStr ? registro.folios : [];
    const foliosPorAvisar = conUnDiaOMas.map((t) => t.folio).filter((f) => !foliosYaAvisados.includes(f));
    if (foliosPorAvisar.length === 0) return;

    let cancelado = false;
    solicitarPermisoNotificaciones().then((concedido) => {
      if (cancelado || !concedido) return;
      conUnDiaOMas
        .filter((t) => foliosPorAvisar.includes(t.folio))
        .forEach((t) => {
          const limite = new Date(new Date(t.fecha).getTime() + HORAS_LIMITE_RECOLECCION * 60 * 60 * 1000);
          const horasRestantes = Math.max(0, Math.round((limite - ahora) / (1000 * 60 * 60)));
          enviarNotificacion('Tienes un pedido pendiente de recoger', {
            body: `Folio #${t.folio}: te quedan ${horasRestantes}h para recogerlo en Sucursal 044 antes de que se cancele.`,
            tag: `healthpharma-recoleccion-${t.folio}`
          });
        });
      setStoredData(NOTIF_RECOLECCION_KEY, { fecha: hoyStr, folios: [...foliosYaAvisados, ...foliosPorAvisar] });
    });
    return () => { cancelado = true; };
  }, [tickets, rol, usuario?.correo]);

  // Cancela automáticamente los tickets que llevan más de HORAS_LIMITE_RECOLECCION
  // pendientes: revisa al montar y cada 15 min (no depende de que algo más re-renderice).
  useEffect(() => {
    const revisarVencidos = () => {
      setTickets((prev) => {
        const ahora = Date.now();
        const vencidos = prev.filter(
          (t) =>
            t.estado === 'Pendiente de Recolección' &&
            ahora - new Date(t.fecha).getTime() >= HORAS_LIMITE_RECOLECCION * 60 * 60 * 1000
        );
        if (vencidos.length === 0) return prev;
        vencidos.forEach((t) => registrarCambio('TICKET_VENCIDO_AUTOCANCELADO', { folio: t.folio }));
        const foliosVencidos = new Set(vencidos.map((t) => t.folio));
        return prev.map((t) => (foliosVencidos.has(t.folio) ? { ...t, estado: 'Cancelado' } : t));
      });
    };
    revisarVencidos();
    const intervalo = setInterval(revisarVencidos, 15 * 60 * 1000);
    return () => clearInterval(intervalo);
  }, []);

  // --- Disponibilidad real (evita sobreventa): la cantidad "libre" es el stock
  // menos lo ya reservado por tickets pendientes de recolección (que aún no se
  // descuentan del inventario real hasta que se confirma la entrega) ----------
  const reservasPorProducto = useMemo(() => {
    const mapa = {};
    tickets
      .filter((t) => t.estado === 'Pendiente de Recolección')
      .forEach((t) => t.items.forEach((i) => { mapa[i.id] = (mapa[i.id] ?? 0) + i.cantidadSeleccionada; }));
    return mapa;
  }, [tickets]);

  const disponible = (producto) => Math.max(0, producto.cantidad - (reservasPorProducto[producto.id] ?? 0));

  const inventarioParaCliente = useMemo(
    () => inventario.map((p) => ({ ...p, cantidad: Math.max(0, p.cantidad - (reservasPorProducto[p.id] ?? 0)) })),
    [inventario, reservasPorProducto]
  );

  // Cuántas unidades se han vendido de cada producto (histórico de ventas confirmadas)
  const vecesCompradoPorProducto = useMemo(() => {
    const mapa = {};
    ventas.forEach((v) => v.items.forEach((i) => { mapa[i.id] = (mapa[i.id] ?? 0) + i.cantidadSeleccionada; }));
    return mapa;
  }, [ventas]);

  // --- Carrito ------------------------------------------------------------
  const agregarAlCarrito = (producto) => {
    const enInventario = inventario.find((p) => p.id === producto.id);
    const disp = enInventario ? disponible(enInventario) : 0;
    if (!enInventario || disp <= 0) {
      alert('Producto agotado.');
      return;
    }
    setCarrito((prev) => {
      const existente = prev.find((i) => i.id === producto.id);
      if (existente) {
        if (existente.cantidadSeleccionada >= disp) {
          alert('No hay más stock disponible de este medicamento.');
          return prev;
        }
        return prev.map((i) =>
          i.id === producto.id ? { ...i, cantidadSeleccionada: i.cantidadSeleccionada + 1 } : i
        );
      }
      return [...prev, { ...enInventario, cantidadSeleccionada: 1 }];
    });
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    const prod = inventario.find((p) => p.id === id);
    const tope = prod ? disponible(prod) : 1;
    setCarrito((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, cantidadSeleccionada: Math.min(Math.max(1, nuevaCantidad), tope) } : i
      )
    );
  };

  const eliminarDelCarrito = (id) => setCarrito((prev) => prev.filter((i) => i.id !== id));

  // --- Tickets: se genera el QR SIN descontar inventario -------------------
  const generarTicket = () => {
    if (carrito.length === 0) return;
    const total = carrito.reduce((acc, i) => acc + i.precio * i.cantidadSeleccionada, 0);
    const nuevoTicket = {
      folio: generarFolio(),
      cliente: usuario?.nombre ?? 'Cliente',
      correo: usuario?.correo ?? '',
      telefono: usuario?.telefono ?? '',
      items: carrito,
      total,
      fecha: new Date().toISOString(),
      estado: 'Pendiente de Recolección'
    };
    setTickets((prev) => [nuevoTicket, ...prev]);
    registrarCambio('TICKET_GENERADO_SIN_DESCUENTO', { folio: nuevoTicket.folio });
    setTicketActivo(nuevoTicket);
    setCarrito([]);
  };

  const cancelarTicket = (folio) => {
    // El stock se mantiene intacto: nunca se descontó al generar el ticket
    setTickets((prev) => prev.map((t) => (t.folio === folio ? { ...t, estado: 'Cancelado' } : t)));
    // Si es el ticket que está abierto en el modal, lo refrescamos sin cerrarlo
    setTicketActivo((prev) => (prev && prev.folio === folio ? { ...prev, estado: 'Cancelado' } : prev));
    registrarCambio('TICKET_CANCELADO', { folio });
  };

  // El descuento real de inventario ocurre SOLO aquí, cuando el admin verifica en sucursal
  const confirmarEntrega = (ticket) => {
    setInventario((prev) =>
      prev.map((p) => {
        const item = ticket.items.find((i) => i.id === p.id);
        if (!item) return p;
        const restante = Math.max(0, p.cantidad - item.cantidadSeleccionada);
        return { ...p, cantidad: restante, estado: restante > 0 ? 'disponible' : 'agotado' };
      })
    );
    setTickets((prev) =>
      prev.map((t) => (t.folio === ticket.folio ? { ...t, estado: 'Entregado' } : t))
    );
    setVentas((prev) => [
      ...prev,
      { id: ticket.folio, items: ticket.items, total: ticket.total, fecha: new Date().toISOString(), origen: 'Ticket en línea' }
    ]);
    registrarCambio('ENTREGA_CONFIRMADA_STOCK_DESCONTADO', { folio: ticket.folio });
    setShowScanner(false);
  };

  const rechazarEntrega = (folio) => {
    cancelarTicket(folio);
    setShowScanner(false);
  };

  // --- Inventario (admin) -------------------------------------------------
  const guardarProducto = (datos) => {
    setInventario((prev) =>
      prev.some((p) => p.id === datos.id)
        ? prev.map((p) => (p.id === datos.id ? { ...p, ...datos } : p))
        : [...prev, datos]
    );
    registrarCambio('PRODUCTO_GUARDADO', datos);
  };

  const eliminarProducto = (id) => {
    setInventario((prev) => prev.filter((p) => p.id !== id));
    registrarCambio('PRODUCTO_ELIMINADO', { id });
  };

  const notificarStockBajo = (producto) =>
    console.warn(`Stock bajo: ${producto.nombre} (${producto.cantidad} unidades)`);

  const ticketsDelUsuario = useMemo(
    () => (usuario?.correo ? tickets.filter((t) => t.correo === usuario.correo) : []),
    [tickets, usuario]
  );

  const unidadesEnCarrito = carrito.reduce((acc, i) => acc + i.cantidadSeleccionada, 0);

  const modalesAuth = (
    <>
      {authModal === 'login' && (
        <LoginModal
          onClose={() => setAuthModal(null)}
          onLogin={autenticar}
          onOpenRegister={() => setAuthModal('registro')}
          onOpenRecuperar={() => setAuthModal('recuperar')}
        />
      )}
      {authModal === 'registro' && (
        <RegisterModal
          onClose={() => setAuthModal(null)}
          onRegister={registrar}
          onOpenLogin={() => setAuthModal('login')}
        />
      )}
      {authModal === 'recuperar' && (
        <ForgotPasswordModal
          onClose={() => setAuthModal(null)}
          onVerificarCuenta={verificarCuentaRecuperacion}
          onRecuperar={recuperarPassword}
          onOpenLogin={() => setAuthModal('login')}
        />
      )}
    </>
  );

  // --- Pantalla de bienvenida (sin sesión) --------------------------------
  if (!usuario) {
    return (
      <div className={claseAccesibilidad}>
        <WelcomeScreen
          onSelectOption={(opcion) => {
            if (opcion === 'login') setAuthModal('login');
            else if (opcion === 'registro') setAuthModal('registro');
            else entrarComoInvitado();
          }}
        />
        {modalesAuth}
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans pb-24 ${claseAccesibilidad}`}>
      <header className="bg-slate-950 text-white sticky top-0 z-40 shadow-lg border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3.5 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-2.5 rounded-2xl shrink-0 shadow-lg shadow-emerald-600/20">
              <ShieldCheck className="w-5 h-5 text-slate-900" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-black tracking-tight leading-none truncate">HealthPharma</h1>
              <span className="text-[10px] text-emerald-400/90 font-bold uppercase tracking-wider">Sucursal 044</span>
            </div>
          </div>

          {/* --- Zona exclusiva de administrador: inventario, escáner y su nombre --- */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {rol === 'admin' && (
              <>
                <button onClick={() => setShowAdminInventory(true)} className="px-2.5 sm:px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-2xl font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition" title="Gestión de inventario">
                  <PackagePlus className="w-4 h-4" />
                  <span className="hidden md:inline">Inventario</span>
                </button>
                <button onClick={() => setShowScanner(true)} className="px-2.5 sm:px-3.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition" title="Escanear QR del cliente">
                  <QrCode className="w-4 h-4" />
                  <span className="hidden md:inline">Escanear QR</span>
                </button>
                <span className="hidden sm:inline text-xs font-semibold text-slate-300 px-1">
                  {usuario?.nombre}
                </span>
              </>
            )}

            {/* --- Zona exclusiva de cliente/invitado: carrito --- */}
            {rol !== 'admin' && (
              <button onClick={() => setActiveTab('carrito')} className="relative p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl transition" title="Carrito">
                <ShoppingCart className="w-5 h-5" />
                {unidadesEnCarrito > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-slate-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                    {unidadesEnCarrito}
                  </span>
                )}
              </button>
            )}

            <button onClick={() => setShowAccessibility(true)} className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl transition" title="Ajustes de accesibilidad">
              <Eye className="w-5 h-5" />
            </button>

            <button onClick={cerrarSesion} className="p-2.5 bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 hover:border-red-600 rounded-2xl transition" title="Cerrar sesión">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 w-full">
        {activeTab === 'catalogo' && (
          <CatalogoClienteView
            inventario={inventarioParaCliente}
            vecesCompradoPorProducto={vecesCompradoPorProducto}
            onAgregar={agregarAlCarrito}
            onVerDetalle={setProductoSeleccionado}
          />
        )}

        {/* --- Vistas exclusivas de cliente/invitado --- */}
        {activeTab === 'carrito' && rol !== 'admin' && (
          <CartView
            cart={carrito}
            esInvitado={esInvitado}
            onUpdateQuantity={actualizarCantidad}
            onRemoveItem={eliminarDelCarrito}
            onGenerateTicket={generarTicket}
            onSelectProduct={setProductoSeleccionado}
            onOpenAuth={(modo) => setAuthModal(modo ?? 'login')}
          />
        )}

        {activeTab === 'perfil' && rol !== 'admin' && (
          <ProfileView
            usuario={usuario}
            esInvitado={esInvitado}
            onActualizarUsuario={actualizarUsuario}
            onCambiarPassword={cambiarPassword}
            onOpenAuth={(modo) => setAuthModal(modo)}
            tickets={ticketsDelUsuario}
            onVerTicket={setTicketActivo}
          />
        )}

        {/* --- Vistas exclusivas de administrador --- */}
        {activeTab === 'inventario' && rol === 'admin' && <InventarioView inventario={inventario} />}

        {activeTab === 'pos' && rol === 'admin' && (
          <PosView
            inventario={inventario}
            setInventario={setInventario}
            reservasPorProducto={reservasPorProducto}
            ventas={ventas}
            setVentas={setVentas}
            registrarCambio={registrarCambio}
            notificarStockBajo={notificarStockBajo}
          />
        )}

        {activeTab === 'ventas' && rol === 'admin' && <VentasView ventas={ventas} />}
        {activeTab === 'alertas' && rol === 'admin' && <AlertasView inventario={inventario} />}
      </main>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} currentRole={rol} />

      {productoSeleccionado && (
        <ProductCardModal
          product={productoSeleccionado}
          vecesComprado={vecesCompradoPorProducto[productoSeleccionado.id] ?? 0}
          onClose={() => setProductoSeleccionado(null)}
          onAddToCart={agregarAlCarrito}
        />
      )}

      {ticketActivo && (
        <TicketModal ticket={ticketActivo} onClose={() => setTicketActivo(null)} onCancelTicket={cancelarTicket} />
      )}

      {showScanner && rol === 'admin' && (
        <AdminScannerModal tickets={tickets} onClose={() => setShowScanner(false)} onConfirmDelivery={confirmarEntrega} onCancelDelivery={rechazarEntrega} />
      )}

      {showAdminInventory && rol === 'admin' && (
        <AdminInventoryModal products={inventario} onClose={() => setShowAdminInventory(false)} onSaveProduct={guardarProducto} onDeleteProduct={eliminarProducto} />
      )}

      {showAccessibility && (
        <AccessibilityModal config={accesibilidad} setConfig={setAccesibilidad} onClose={() => setShowAccessibility(false)} />
      )}

      {modalesAuth}
    </div>
  );
}