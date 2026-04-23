import { useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { load, computeStatut, statutColor, CULTURES } from '../data/appData';

export default function Alertes() {
  const [filter, setFilter] = useState('all');

  const alertes = useMemo(() => {
    const result = [];
    CULTURES.forEach(({ id, label, culture }) => {
      const ops = load(`ops_${id}`);
      ops.forEach((op, i) => {
        if (!op.typeOp) return;
        const st = computeStatut(op.datePrevue, op.dateRealisee);
        if (['EN RETARD', 'J-3', 'J-7'].includes(st)) {
          result.push({ ...op, statut: st, feuille: label, culture, idx: i });
        }
      });
    });
    result.sort((a, b) => {
      const ord = { 'EN RETARD': 0, 'J-3': 1, 'J-7': 2 };
      return ord[a.statut] - ord[b.statut];
    });
    return result;
  }, []);

  const filtered = filter === 'all' ? alertes : alertes.filter(a => a.statut === filter);
  const counts   = { all: alertes.length, 'EN RETARD': 0, 'J-3': 0, 'J-7': 0 };
  alertes.forEach(a => counts[a.statut]++);

  return (
    <Layout title="⚠️ Alertes" onBack>
      {/* Filters */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto">
        {[
          { key: 'all',       label: `Toutes (${counts.all})` },
          { key: 'EN RETARD', label: `Retard (${counts['EN RETARD']})` },
          { key: 'J-3',       label: `J-3 (${counts['J-3']})` },
          { key: 'J-7',       label: `J-7 (${counts['J-7']})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors
              ${filter === key ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <span className="text-5xl mb-3">✅</span>
          <p className="text-sm">Aucune alerte active</p>
        </div>
      ) : (
        <div className="px-4 space-y-3 pb-4">
          {filtered.map((a, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className={`h-1.5 ${a.statut === 'EN RETARD' ? 'bg-red-500' : a.statut === 'J-3' ? 'bg-orange-400' : 'bg-yellow-400'}`} />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{a.typeOp}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{a.feuille} · {a.culture}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${statutColor(a.statut)}`}>
                    {a.statut}
                  </span>
                </div>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  {a.datePrevue && <span>📅 Prévu : {new Date(a.datePrevue).toLocaleDateString('fr-FR')}</span>}
                  {a.stade && <span>🌱 {a.stade}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
