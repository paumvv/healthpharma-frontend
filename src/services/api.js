export const STORAGE_KEY = 'FARMACIA_INVENTARIO_V1';
export const SALES_KEY = 'FARMACIA_VENTAS_V1';
export const TICKETS_KEY = 'FARMACIA_TICKETS_V1';
export const USER_KEY = 'FARMACIA_USUARIO_V1';
export const USERS_KEY = 'FARMACIA_USUARIOS_V1';
export const CART_KEY = 'FARMACIA_CARRITO_V1';
export const SYNC_QUEUE_KEY = 'FARMACIA_SYNC_QUEUE_V1';
export const NOTIF_CADUCIDAD_KEY = 'FARMACIA_NOTIF_CADUCIDAD_V1';
export const NOTIF_RECOLECCION_KEY = 'FARMACIA_NOTIF_RECOLECCION_V1';
export const ACCESIBILIDAD_KEY = 'FARMACIA_ACCESIBILIDAD_V1';

// Plazo máximo para recoger un ticket antes de que se considere vencido
export const HORAS_LIMITE_RECOLECCION = 48;
// Ventana de aviso de caducidad próxima (días)
export const DIAS_ALERTA_CADUCIDAD = 30;

export const calcularLimiteRecoleccion = (fechaTicket) =>
  new Date(new Date(fechaTicket).getTime() + HORAS_LIMITE_RECOLECCION * 60 * 60 * 1000);

export const getStoredData = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    console.error(`Error leyendo ${key} de localStorage`, error);
    return fallback;
  }
};

export const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error guardando ${key} en localStorage`, error);
  }
};

export const removeStoredData = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error eliminando ${key} de localStorage`, error);
  }
};

export const registrarCambio = (tipo, payload) => {
  const cola = getStoredData(SYNC_QUEUE_KEY, []);
  cola.push({ tipo, payload, fecha: new Date().toISOString() });
  setStoredData(SYNC_QUEUE_KEY, cola.slice(-200));
};

export const generarFolio = () =>
  `TK-${Date.now().toString(36).toUpperCase().slice(-6)}`;

// Nunca propagamos la contraseña hacia el estado de sesión
export const sinPassword = ({ password, ...resto }) => resto;