import { useState } from 'react';
import Layout from '../components/Layout';
import { load, save, MOIS } from '../data/appData';

const YEAR = 2026;
const DAYS = (m) => new Date(YEAR, m + 1, 0).getDate();

export default function Pluviometrie() {
  const [mois, setMois] = useState(new Date().getMonth());
  const key = `pluv_${YEAR}_${mois}`;
  const [data, setData] = useState(() => {
    const saved = load(key);
    const days = DAYS(mois);
    const arr = Array.from({ length: days }, (_, i) => ({ day: i + 1, mm: '' }));
    if (Array.isArray(saved) && saved.length === days) return saved;
    return arr;
  });

  const handleMois = (m) => {
    setMois(m);
    const k = `pluv_${YEAR}_${m}`;
    const saved = load(k);
    const days = DAYS(m);
    const arr = Array.from({ length: days }, (_, i) => ({ day: i + 1, mm: '' }));
    setData(Array.isArray(saved) && saved.length === days ? saved : arr);
  };

  const update = (i, val) => {
    const nd = [...data];
    nd[i] = { ...nd[i], mm: val };
    setData(nd);
    save(key, nd);
  };

  const total = data.reduce((s, d) => s + (parseFloat(d.mm) || 0), 0);
  const nbJours = data.filter(d => parseFloat(d.mm) > 0).length;

  return (
    <Layout title="🌧️ Pluviométrie" onBack>
      {/* Month selector */}
      <div className="flex overflow-x-auto gap-2 px-4 py-3 bg-white border-b">
        {MOIS.map((m, i) => (
          <button key={i} onClick={() => handleMois(i)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors
              ${mois === i ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
            {m.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 px-4 mt-3">
        <div className="bg-blue-50 rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-blue-700">{total.toFixed(1)}</p>
          <p className="text-xs text-blue-500">Total (mm)</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-green-700">{nbJours}</p>
          <p className="text-xs text-green-500">Jours de pluie</p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-gray-700">{nbJours ? (total / nbJours).toFixed(1) : '—'}</p>
          <p className="text-xs text-gray-500">Moy/jour (mm)</p>
        </div>
      </div>

      {/* Daily grid */}
      <div className="px-4 mt-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">{MOIS[mois]} {YEAR}</h3>
        <div className="grid grid-cols-5 gap-2">
          {data.map((d, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-2 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-400 font-medium">{d.day}</span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={d.mm}
                onChange={e => update(i, e.target.value)}
                placeholder="0"
                className={`w-full text-center text-sm font-bold rounded-lg px-1 py-1 border
                  ${parseFloat(d.mm) > 0 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-100 text-gray-400'}`}
              />
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center mt-3 mb-4">Valeurs en mm · Sauvegardé automatiquement</p>
    </Layout>
  );
}
