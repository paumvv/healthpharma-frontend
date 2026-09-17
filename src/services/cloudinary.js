const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadImageToCloudinary = async (file) => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    console.warn('Cloudinary no configurado: define VITE_CLOUDINARY_CLOUD_NAME y VITE_CLOUDINARY_UPLOAD_PRESET en tu archivo .env');
    return null;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );
    if (!response.ok) throw new Error(`Cloudinary respondió ${response.status}`);
    const data = await response.json();
    return data.secure_url ?? null;
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    return null;
  }
};