import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { CULTURES, load, computeStatut } from '../data/appData';

const GROUPES = [
  { label: 'Coton',        filter: c => c.culture === 'Coton',        color: 'bg-green-50 border-green-200' },
  { label: 'Maïs',         filter: c => c.culture === 'Maïs',         color: 'bg-yellow-50 border-yellow-200' },
  { label: 'Fourrage',     filter: c => c.culture === 'Fourrage',     color: 'bg-lime-50 border-lime-200' },
  { label: 'Légumineuses', filter: c => c.culture === 'Légumineuse',  color: 'bg-purple-50 border-purple-200' },
];

function CultureCard({ culture }) {
  const ops = load(`ops_${culture.id}`);
  const filled = ops.filter(o => o.typeOp);
  const late   = filled.filter(o => computeStatut(o.datePrevue, o.dateRealisee) === 'EN RETARD').length;
  return (
    <Link
      to={`/cultures/${culture.id}`}
      className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3 active:scale-95 transition-transform"
    >
      <span className="text-2xl">{culture.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-800">{culture.label}</p>
        {culture.precedent && <p className="text-xs text-gray-400 truncate">Préc. : {culture.precedent}</p>}
        <p className="text-xs text-gray-500 mt-0.5">{filled.length} opération{filled.length > 1 ? 's' : ''}</p>
      </div>
      {late > 0 && (
        <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{late}</span>
      )}
      <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

export default function Cultures() {
  const [tab, setTab] = useState(0);
  const groupe = GROUPES[tab];
  const list   = CULTURES.filter(groupe.filter);

  return (
    <Layout title="🌿 Cultures">
      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 px-4 py-3 bg-white border-b border-gray-100">
        {GROUPES.map((g, i) => (
          <button
            key={i}
            onClick={() => setTab(i)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors
              ${tab === i ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            {g.label} ({CULTURES.filter(g.filter).length})
          </button>
        ))}
      </div>

      <div className="px-4 py-3 space-y-2">
        {list.map(c => <CultureCard key={c.id} culture={c} />)}
      </div>
    </Layout>
  );
}
