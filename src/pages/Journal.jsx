import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { load, save } from '../data/appData';

const EMPTY = { date: '', titre: '', contenu: '', type: 'Observation' };
const TYPES = ['Observation', 'Planification', 'Incident', 'Météo', 'Réunion', 'Autre'];

export default function Journal() {
  const [items, setItems]   = useState(() => load('journal'));
  const [adding, setAdding] = useState(false);
  const [form, setForm]     = useState(EMPTY);

  useEffect(() => { save('journal', items); }, [items]);

  const submit = () => {
    if (!form.titre) return;
    setItems(prev => [{ ...form, id: Date.now() }, ...prev]);
    setForm(EMPTY);
    setAdding(false);
  };

  const typeColor = (t) => {
    const map = { Observation: 'bg-blue-100 text-blue-700', Planification: 'bg-purple-100 text-purple-700',
      Incident: 'bg-red-100 text-red-700', Météo: 'bg-sky-100 text-sky-700',
      Réunion: 'bg-green-100 text-green-700', Autre: 'bg-gray-100 text-gray-700' };
    return map[t] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Layout title="📓 Journal de Bord" onBack>
      <div className="flex justify-end px-4 mt-3">
        <button onClick={() => { setForm({ ...EMPTY, date: new Date().toISOString().split('T')[0] }); setAdding(true); }}
          className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold active:scale-95">
          + Nouvelle entrée
        </button>
      </div>

      <div className="px-4 mt-3 space-y-2 pb-4">
        {items.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">📓</p>
            <p className="text-sm">Journal de bord vide</p>
          </div>
        )}
        {items.map((it) => (
          <div key={it.id} className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-800">{it.titre}</p>
                {it.date && <p className="text-xs text-gray-400">📅 {new Date(it.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>}
                {it.contenu && <p className="text-sm text-gray-600 mt-1">{it.contenu}</p>}
              </div>
              <span className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${typeColor(it.type)}`}>{it.type}</span>
            </div>
          </div>
        ))}
      </div>

      {adding && (
        <div className="fixed inset-0 z-30 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAdding(false)} />
          <div className="relative w-full bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto">
            <h3 className="text-base font-bold text-gray-800 mb-4">Nouvelle entrée journal</h3>
            <div className="space-y-3">
              <label className="block">
                <span className="text-xs text-gray-500">Date</span>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">Type</span>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white">
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">Titre *</span>
                <input type="text" value={form.titre} onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">Contenu</span>
                <textarea rows={4} value={form.contenu} onChange={e => setForm(f => ({ ...f, contenu: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none" />
              </label>
              <button onClick={submit} disabled={!form.titre}
                className="w-full bg-primary text-white font-bold py-3 rounded-2xl disabled:opacity-40 active:scale-95">
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
