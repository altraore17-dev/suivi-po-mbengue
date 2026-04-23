import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/',           icon: '🏠', label: 'Accueil' },
  { to: '/alertes',   icon: '⚠️',  label: 'Alertes' },
  { to: '/cultures',  icon: '🌿',  label: 'Cultures' },
  { to: '/intrants',  icon: '📦',  label: 'Intrants' },
  { to: '/plus',      icon: '⋯',   label: 'Plus' },
];

export default function BottomNav() {
  return (
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20 shadow-lg">
      <div className="flex">
        {LINKS.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 text-xs font-medium transition-colors
               ${isActive ? 'text-primary' : 'text-gray-500'}`
            }
          >
            <span className="text-xl leading-none mb-0.5">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
