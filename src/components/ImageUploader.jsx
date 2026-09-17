import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { uploadImageToCloudinary } from '../services/cloudinary';

export default function ImageUploader({ onImageUploaded }) {
  const [cargando, setCargando] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCargando(true);
    const url = await uploadImageToCloudinary(file);
    setCargando(false);

    if (url) {
      onImageUploaded(url);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-1 bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-200">
        <Camera className="h-4 w-4 text-slate-600" />
        <span>{cargando ? 'Subiendo...' : 'Subir Foto'}</span>
        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </label>
    </div>
  );
}