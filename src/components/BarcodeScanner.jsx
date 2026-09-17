import { useEffect, useRef, useState } from 'react';
import { Camera, Keyboard, X } from 'lucide-react';

export default function BarcodeScanner({ onScan, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [modoManual, setModoManual] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    let cancelado = false;
    let intervalo;

    const iniciar = async () => {
      if (!('BarcodeDetector' in window) || !navigator.mediaDevices?.getUserMedia) {
        setModoManual(true);
        setAviso('Este navegador no soporta lectura de códigos por cámara. Captura el código manualmente.');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (cancelado) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        const detector = new window.BarcodeDetector({
          formats: ['ean_13', 'ean_8', 'code_128', 'qr_code']
        });
        intervalo = setInterval(async () => {
          if (!videoRef.current) return;
          try {
            const codigos = await detector.detect(videoRef.current);
            if (codigos.length > 0) {
              clearInterval(intervalo);
              onScan(codigos[0].rawValue);
              onClose();
            }
          } catch {
            /* fotograma no legible: se reintenta en el siguiente ciclo */
          }
        }, 400);
      } catch {
        setModoManual(true);
        setAviso('No se pudo acceder a la cámara. Captura el código manualmente.');
      }
    };

    iniciar();

    return () => {
      cancelado = true;
      if (intervalo) clearInterval(intervalo);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [onScan, onClose]);

  const enviarManual = (e) => {
    e.preventDefault();
    if (!codigo.trim()) return;
    onScan(codigo.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-4 max-w-sm w-full space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <Camera className="h-4 w-4" /> Lector de Código de Barras
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        {!modoManual && (
          <video ref={videoRef} className="w-full rounded-lg bg-slate-900 aspect-video object-cover" muted playsInline />
        )}

        {aviso && <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded-lg">{aviso}</p>}

        <form onSubmit={enviarManual} className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
            <Keyboard className="h-3.5 w-3.5" /> Captura manual
          </label>
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Ej. 7501234500011"
            className="w-full border border-slate-200 p-2 rounded-lg text-sm"
          />
          <button type="submit" className="w-full bg-slate-800 text-white py-2 rounded-lg font-bold text-xs">
            Buscar producto
          </button>
        </form>
      </div>
    </div>
  );
}