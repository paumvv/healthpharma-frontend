// Conexión con el backend real (Express + MySQL en Railway). En desarrollo local
// apunta a localhost:3000; en producción se define VITE_API_URL al desplegar.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const solicitar = async (ruta, opciones = {}) => {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opciones
  });
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok && datos.ok === undefined) {
    return { ok: false, error: 'No se pudo conectar con el servidor.' };
  }
  return datos;
};

// --- Auth ---
export const apiLogin = (correo, password) =>
  solicitar('/api/auth/login', { method: 'POST', body: JSON.stringify({ correo, password }) });

export const apiRegistrar = (datos) =>
  solicitar('/api/auth/register', { method: 'POST', body: JSON.stringify(datos) });

export const apiVerificarRecuperacion = (correo, telefono) =>
  solicitar('/api/auth/verificar-recuperacion', { method: 'POST', body: JSON.stringify({ correo, telefono }) });

export const apiRecuperarPassword = (correo, telefono, passwordNueva) =>
  solicitar('/api/auth/recuperar-password', { method: 'POST', body: JSON.stringify({ correo, telefono, passwordNueva }) });

export const apiActualizarUsuario = (id, cambios) =>
  solicitar(`/api/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(cambios) });

export const apiCambiarPassword = (id, passwordActual, passwordNueva) =>
  solicitar(`/api/usuarios/${id}/password`, { method: 'PUT', body: JSON.stringify({ passwordActual, passwordNueva }) });

// --- Medicamentos ---
export const apiGetMedicamentos = () => solicitar('/api/medicamentos');

export const apiGuardarMedicamento = (producto) =>
  solicitar('/api/medicamentos', { method: 'POST', body: JSON.stringify(producto) });

export const apiEliminarMedicamento = (id) =>
  solicitar(`/api/medicamentos/${id}`, { method: 'DELETE' });

// --- Tickets ---
export const apiGetTickets = (correo) =>
  solicitar(correo ? `/api/tickets?correo=${encodeURIComponent(correo)}` : '/api/tickets');

export const apiGenerarTicket = (datos) =>
  solicitar('/api/tickets', { method: 'POST', body: JSON.stringify(datos) });

export const apiCancelarTicket = (folio) =>
  solicitar(`/api/tickets/${folio}/cancelar`, { method: 'PUT' });

export const apiConfirmarEntrega = (folio) =>
  solicitar(`/api/tickets/${folio}/confirmar-entrega`, { method: 'PUT' });

// --- Ventas ---
export const apiGetVentas = () => solicitar('/api/ventas');

export const apiProcesarVenta = (items, recetaVerificada) =>
  solicitar('/api/ventas', { method: 'POST', body: JSON.stringify({ items, recetaVerificada }) });
