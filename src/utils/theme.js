// Tailwind v4 expone cada color como variable CSS (--color-emerald-600, etc.), y toda
// la app usa la paleta "emerald" como acento. Sobreescribir esas variables en :root
// retiñe la app completa sin tocar cada componente. 'verde' no necesita overrides
// porque ya es el acento por defecto.
export const THEME_COLOR_OVERRIDES = {
  verde: null,
  morado: { 50: '#faf5ff', 100: '#f3e8ff', 400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7e22ce', 800: '#6b21a8' },
  rosa: { 50: '#fdf2f8', 100: '#fce7f3', 400: '#f472b6', 500: '#ec4899', 600: '#db2777', 700: '#be185d', 800: '#9d174d' },
  marino: { 50: '#eff6ff', 100: '#dbeafe', 400: '#60a5fa', 500: '#3b82f6', 600: '#1d4ed8', 700: '#1e40af', 800: '#1e3a8a' },
  calido: { 50: '#fffbeb', 100: '#fef3c7', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e' },
  neutro: { 50: '#f8fafc', 100: '#f1f5f9', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b' },
  naranja: { 50: '#fff7ed', 100: '#ffedd5', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412' },
  turquesa: { 50: '#f0fdfa', 100: '#ccfbf1', 400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59' }
};

export const SYSTEM_THEMES = {
  verde: { primary: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-600', hover: 'hover:bg-emerald-700', badge: 'bg-emerald-50 text-emerald-700', ring: 'ring-emerald-500' },
  morado: { primary: 'bg-purple-600', text: 'text-purple-600', border: 'border-purple-600', hover: 'hover:bg-purple-700', badge: 'bg-purple-50 text-purple-700', ring: 'ring-purple-500' },
  rosa: { primary: 'bg-pink-600', text: 'text-pink-600', border: 'border-pink-600', hover: 'hover:bg-pink-700', badge: 'bg-pink-50 text-pink-700', ring: 'ring-pink-500' },
  marino: { primary: 'bg-blue-800', text: 'text-blue-800', border: 'border-blue-800', hover: 'hover:bg-blue-900', badge: 'bg-blue-50 text-blue-800', ring: 'ring-blue-500' },
  calido: { primary: 'bg-amber-600', text: 'text-amber-600', border: 'border-amber-600', hover: 'hover:bg-amber-700', badge: 'bg-amber-50 text-amber-800', ring: 'ring-amber-500' },
  neutro: { primary: 'bg-slate-800', text: 'text-slate-800', border: 'border-slate-800', hover: 'hover:bg-slate-900', badge: 'bg-slate-100 text-slate-800', ring: 'ring-slate-500' },
  naranja: { primary: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500', hover: 'hover:bg-orange-600', badge: 'bg-orange-50 text-orange-700', ring: 'ring-orange-500' },
  turquesa: { primary: 'bg-teal-600', text: 'text-teal-600', border: 'border-teal-600', hover: 'hover:bg-teal-700', badge: 'bg-teal-50 text-teal-700', ring: 'ring-teal-500' }
};