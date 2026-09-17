// Hash de contraseñas con Web Crypto (SHA-256).
// LIMITACIÓN: sin backend no hay salteo por servidor ni secreto real;
// esto solo evita que la contraseña quede en texto plano dentro de localStorage.

export const hashPassword = async (texto) => {
  const datos = new TextEncoder().encode(texto);
  const buffer = await crypto.subtle.digest('SHA-256', datos);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};
