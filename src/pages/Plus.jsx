import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const MENUS = [
  { to: '/import',         icon: '📥', label: 'Importer Excel',       desc: 'Charger données depuis .xlsx', highlight: true },
  { to: '/pluviometrie',   icon: '🌧️', label: 'Pluviométrie',        desc: 'Relevés journaliers de pluie' },
  { to: '/recoltes',       icon: '🌾', label: 'Récoltes',             desc: 'Historique et pesées' },
  { to: '/manoeuvres',     icon: '👷', label: 'Suivi Manœuvres',      desc: 'Main-d\'œuvre & paiements' },
  { to: '/phytosanitaire', icon: '🔬', label: 'Phytosanitaire',       desc: 'Relevés ravageurs & maladies' },
  { to: '/journal',        icon: '📓', label: 'Journal de Bord',      desc: 'Notes & planification' },
];

export default function Plus() {
  const exportData = () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('suivi_po_')) {
        try { data[key] = JSON.parse(localStorage.getItem(key)); }
        catch { data[key] = localStorage.getItem(key); }
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `suivi-po-mbengue-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout title="Plus">
      <div className="px-4 mt-3 space-y-2">
        {MENUS.map(({ to, icon, label, desc, highlight }) => (
          <Link key={to} to={to} className={`flex items-center gap-4 rounded-2xl shadow-sm p-4 active:scale-95 transition-transform ${highlight ? 'bg-primary text-white' : 'bg-white'}`}>
            <span className="text-3xl">{icon}</span>
            <div className="flex-1">
              <p className={`font-semibold text-sm ${highlight ? 'text-white' : 'text-gray-800'}`}>{label}</p>
              <p className={`text-xs ${highlight ? 'text-green-200' : 'text-gray-400'}`}>{desc}</p>
            </div>
            <svg className={`w-4 h-4 ${highlight ? 'text-green-200' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>

      {/* Export */}
      <div className="mx-4 mt-5 bg-white rounded-2xl shadow-sm p-4">
        <h3 className="text-sm font-bold text-gray-700 mb-1">Exporter les données</h3>
        <p className="text-xs text-gray-400 mb-3">Télécharger toutes les données en JSON</p>
        <button onClick={exportData} className="w-full bg-gray-800 text-white py-2.5 rounded-xl text-sm font-semibold active:scale-95">
          📥 Exporter JSON
        </button>
      </div>

      {/* App info */}
      <div className="mx-4 mt-4 mb-4 bg-primary/5 rounded-2xl p-4 text-center">
        <p className="text-xs text-gray-500 font-medium">🌿 Suivi P.O M'Bengue</p>
        <p className="text-xs text-gray-400 mt-1">Version 1.0.0 · Campagne 2026-2027</p>
        <p className="text-xs text-gray-400">LYNX Logistics / Poste d'Observation</p>
      </div>
    </Layout>
  );
}
