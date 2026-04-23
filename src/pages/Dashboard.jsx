import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { load, computeStatut, CULTURES } from '../data/appData';

export default function Dashboard() {
  const stats = useMemo(() => {
    let planned = 0, done = 0, late = 0, j3 = 0, j7 = 0;
    CULTURES.forEach(({ id }) => {
      const ops = load(`ops_${id}`);
      ops.forEach((op) => {
        if (!op.typeOp) return;
        planned++;
        const st = computeStatut(op.datePrevue, op.dateRealisee);
        if (st === 'Réalisé')   done++;
        if (st === 'EN RETARD') late++;
        if (st === 'J-3')       j3++;
        if (st === 'J-7')       j7++;
      });
    });
    const intrants = load('intrants');
    const pluie    = load('pluviometrie');
    return { planned, done, late, j3, j7, intrants: intrants.length, pluie: pluie.length };
  }, []);

  const shortcuts = [
    { to: '/alertes',     icon: '⚠️',  label: 'Alertes',       badge: stats.late + stats.j3 },
    { to: '/cultures',    icon: '🌿',  label: 'Cultures',       badge: 0 },
    { to: '/pluviometrie',icon: '🌧️',  label: 'Pluviométrie',   badge: 0 },
    { to: '/intrants',    icon: '📦',  label: 'Intrants',       badge: 0 },
    { to: '/recoltes',    icon: '🌾',  label: 'Récoltes',       badge: 0 },
    { to: '/manoeuvres',  icon: '👷',  label: 'Manœuvres',      badge: 0 },
    { to: '/phytosanitaire', icon: '🔬', label: 'Phytosanitaire', badge: 0 },
    { to: '/journal',     icon: '📓',  label: 'Journal',        badge: 0 },
  ];

  return (
    <Layout title="Tableau de bord">
      {/* Hero */}
      <div className="bg-primary text-white px-4 pb-6 pt-2">
        <p className="text-green-200 text-sm mb-4">Bonjour, TRAORE Abdoulaye 👋</p>
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Opérations planifiées" value={stats.planned} icon="📋"
            color="bg-white/20" textColor="text-white" />
          <StatCard label="Réalisées" value={stats.done} icon="✅"
            color="bg-white/20" textColor="text-white" />
        </div>
      </div>

      {/* Alert strip */}
      {(stats.late > 0 || stats.j3 > 0) && (
        <Link to="/alertes" className="flex items-center gap-3 mx-4 mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-red-800">
              {stats.late} en retard · {stats.j3} dans 3 jours
            </p>
            <p className="text-xs text-red-600">Appuyez pour voir les alertes</p>
          </div>
          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 px-4 mt-4">
        <StatCard label="En retard" value={stats.late} color="bg-red-50" textColor="text-red-700" />
        <StatCard label="J-3" value={stats.j3} color="bg-orange-50" textColor="text-orange-700" />
        <StatCard label="J-7" value={stats.j7} color="bg-yellow-50" textColor="text-yellow-700" />
      </div>

      {/* Quick access */}
      <div className="px-4 mt-5">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Accès rapide</h2>
        <div className="grid grid-cols-4 gap-3">
          {shortcuts.map(({ to, icon, label, badge }) => (
            <Link key={to} to={to} className="flex flex-col items-center gap-1.5 bg-white rounded-2xl py-4 shadow-sm active:scale-95 transition-transform relative">
              {badge > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
              <span className="text-2xl">{icon}</span>
              <span className="text-xs text-gray-600 text-center leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="mx-4 mt-5 mb-2 bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Informations</h3>
        <div className="space-y-1 text-xs text-gray-600">
          <p>📍 Site : P.O M'Bengue</p>
          <p>📅 Campagne : 2026-2027</p>
          <p>🌱 Cultures : 28 parcelles</p>
          <p>👤 Responsable : TRAORE Abdoulaye</p>
        </div>
      </div>
    </Layout>
  );
}
