// Notificaciones locales del navegador (Notification API).
// LIMITACIÓN: sin backend no hay push real (servidor -> dispositivo con la app cerrada);
// estas notificaciones solo se disparan mientras la pestaña está abierta.

export const solicitarPermisoNotificaciones = async () => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  try {
    const resultado = await Notification.requestPermission();
    return resultado === 'granted';
  } catch {
    return false;
  }
};

export const enviarNotificacion = (titulo, opciones = {}) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    new Notification(titulo, opciones);
  } catch (error) {
    console.error('No se pudo mostrar la notificación:', error);
  }
};
