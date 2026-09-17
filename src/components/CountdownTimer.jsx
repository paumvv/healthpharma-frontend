import { useState, useEffect } from 'react';

const MS_POR_DIA = 1000 * 60 * 60 * 24;

export default function CountdownTimer({ targetDate }) {
  const calcular = () => {
    const limite = new Date(targetDate);
    if (Number.isNaN(limite.getTime())) return null;
    return Math.ceil((limite - new Date()) / MS_POR_DIA);
  };

  const [diasRestantes, setDiasRestantes] = useState(calcular);

  useEffect(() => {
    setDiasRestantes(calcular());
    const intervalo = setInterval(() => setDiasRestantes(calcular()), 1000 * 60 * 60);
    return () => clearInterval(intervalo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  if (diasRestantes === null) {
    return <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-500">Sin fecha</span>;
  }

  const estilo =
    diasRestantes < 0 ? 'bg-red-100 text-red-700'
    : diasRestantes <= 30 ? 'bg-amber-100 text-amber-700'
    : 'bg-emerald-100 text-emerald-700';

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${estilo}`}>
      {diasRestantes < 0 ? 'Caducado' : `${diasRestantes} días rest.`}
    </span>
  );
}