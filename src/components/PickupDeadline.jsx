import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { calcularLimiteRecoleccion } from '../services/api';

export default function PickupDeadline({ fecha }) {
  const calcular = () => {
    const limite = calcularLimiteRecoleccion(fecha);
    const restanteMs = limite.getTime() - Date.now();
    return { limite, vencido: restanteMs <= 0, horas: Math.max(0, Math.floor(restanteMs / (1000 * 60 * 60))) };
  };

  const [estado, setEstado] = useState(calcular);

  useEffect(() => {
    setEstado(calcular());
    const intervalo = setInterval(() => setEstado(calcular()), 1000 * 60 * 5);
    return () => clearInterval(intervalo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fecha]);

  const urgente = !estado.vencido && estado.horas < 24;
  const estilo = estado.vencido
    ? 'bg-red-100 text-red-700'
    : urgente
    ? 'bg-amber-100 text-amber-700'
    : 'bg-blue-100 text-blue-700';

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${estilo}`}>
      <Clock className="w-3 h-3" />
      {estado.vencido
        ? 'Plazo de recolección vencido'
        : `Recoge antes del ${estado.limite.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}, ${estado.limite.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} · ${estado.horas}h`}
    </span>
  );
}
