// Padrón de usuarios semilla. Sin backend, las credenciales viven en localStorage.
// LIMITACIÓN CONOCIDA: el hash es SHA-256 sin backend ni sal por servidor (ver services/crypto.js).
// Contraseñas de prueba en claro (para documentación, NO se guardan así):
//   admin@healthpharma.mx    -> Admin123!
//   cliente@healthpharma.mx  -> Cliente123!
export const USUARIOS_SEMILLA = [
  {
    id: 'u-admin',
    nombre: 'Administrador HealthPharma',
    correo: 'admin@healthpharma.mx',
    password: '3eb3fe66b31e3b4d10fa70b5cad49c7112294af6ae4e476a1c405155d45aa121',
    telefono: '7221234567',
    rol: 'admin',
    foto: ''
  },
  {
    id: 'u-cliente',
    nombre: 'Paulina Mora Varela',
    correo: 'cliente@healthpharma.mx',
    password: '519f24a823b10612516c33f438f12967a179ab77d6e7d2af68f3b9f2631345a7',
    telefono: '7229876543',
    rol: 'cliente',
    foto: ''
  }
];