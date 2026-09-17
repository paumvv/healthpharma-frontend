import { Store, Package, ShoppingCart, Bell, Receipt, User } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentRole }) {
  const menuConfig = [
    { id: 'catalogo',   label: 'Catálogo',  icon: Store,        roles: ['invitado', 'cliente', 'admin'] },
    { id: 'carrito',    label: 'Carrito',   icon: ShoppingCart, roles: ['invitado', 'cliente'] },
    { id: 'perfil',     label: 'Mi Perfil', icon: User,         roles: ['invitado', 'cliente'] },
    { id: 'inventario', label: 'Stock',     icon: Package,      roles: ['admin'] },
    { id: 'pos',        label: 'Venta',     icon: ShoppingCart, roles: ['admin'] },
    { id: 'ventas',     label: 'Historial', icon: Receipt,      roles: ['admin'] },
    { id: 'alertas',    label: 'Alertas',   icon: Bell,         roles: ['admin'] }
  ];

  const visibleItems = menuConfig.filter((item) => item.roles.includes(currentRole));

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] z-40">
      <div className="max-w-3xl mx-auto flex justify-around gap-1 p-2 overflow-x-auto">
        {visibleItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`relative flex flex-col items-center shrink-0 min-w-[60px] sm:min-w-[72px] py-2 rounded-2xl transition-all ${
              activeTab === id ? 'text-emerald-700 bg-emerald-50 font-bold scale-105' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Icon className="h-5 w-5" strokeWidth={activeTab === id ? 2.5 : 2} />
            <span className="text-[10px] mt-1 whitespace-nowrap font-semibold">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}