import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { load, save, CULTURES } from '../data/appData';

const RAVAGEURS = ['Jassides', 'Pucerons', 'Aleurodes', 'Acariens', 'Chenilles', 'Capsides', 'Thrips', 'Autre'];
const INTENSITE = ['0 — Absent', '1 — Faible', '2 — Moyen', '3 — Fort (Traitement)'];
const EMPTY = { date: '', feuille: '', culture: '', ravageur: '', maladie: '', adventices: '', intensite: '', notes: '' };

export default function Phytosanitaire() {
  const [items, setItems]   = useState(() => load('phyto'));
  const [adding, setAdding] = useState(false);
  const [form, setForm]     = useState(EMPTY);

  useEffect(() => { save('phyto', items); }, [items]);

  const submit = () => {
    if (!form.date || !form.feuille) return;
    setItems(prev => [{ ...form, id: Date.now() }, ...prev]);
    setForm(EMPTY);
    setAdding(false);
  };

  return (
    <Layout title="🔬 Phytosanitaire" onBack>
      <div className="flex justify-between items-center px-4 mt-3">
        <p className="text-sm text-gray-500">{items.length} relevé{items.length > 1 ? 's' : ''}</p>
        <button onClick={() => { setForm(EMPTY); setAdding(true); }}
          className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold active:scale-95">
          + Nouveau relevé
        </button>
      </div>

      <div className="px-4 mt-3 space-y-2 pb-4">
        {items.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">🔬</p>
            <p className="text-sm">Aucun relevé phytosanitaire</p>
          </div>
        )}
        {items.map((it) => (
          <div key={it.id} className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-sm text-gray-800">{it.feuille} · {it.culture}</p>
                {it.date && <p className="text-xs text-gray-400">📅 {new Date(it.date).toLocaleDateString('fr-FR')}</p>}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full
                ${it.intensite?.startsWith('3') ? 'bg-red-100 text-red-700' :
                  it.intensite?.startsWith('2') ? 'bg-orange-100 text-orange-700' :
                  it.intensite?.startsWith('1') ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'}`}>
                {it.intensite?.split(' — ')[0] || '—'}
              </span>
            </div>
            <div className="mt-1 text-xs text-gray-500 space-y-0.5">
              {it.ravageur   && <p>🐛 Ravageur : {it.ravageur}</p>}
              {it.maladie    && <p>🦠 Maladie : {it.maladie}</p>}
              {it.adventices && <p>🌱 Adventices : {it.adventices}</p>}
              {it.notes      && <p className="italic">"{it.notes}"</p>}
            </div>
          </div>
        ))}
      </div>

      {adding && (
        <div className="fixed inset-0 z-30 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAdding(false)} />
          <div className="relative w-full bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto">
            <h3 className="text-base font-bold text-gray-800 mb-4">Relevé phytosanitaire</h3>
            <div className="space-y-3">
              <label className="block">
                <span className="text-xs text-gray-500">Date *</span>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">Parcelle *</span>
                <select value={form.feuille} onChange={e => {
                  const c = CULTURES.find(cu => cu.label === e.target.value);
                  setForm(f => ({ ...f, feuille: e.target.value, culture: c?.culture || '' }));
                }} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white">
                  <option value="">— Choisir —</option>
                  {CULTURES.map(c => <option key={c.id} value={c.label}>{c.label} ({c.culture})</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">Ravageur observé</span>
                <select value={form.ravageur} onChange={e => setForm(f => ({ ...f, ravageur: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white">
                  <option value="">— Choisir —</option>
                  {RAVAGEURS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">Maladie</span>
                <input type="text" value={form.maladie} onChange={e => setForm(f => ({ ...f, maladie: e.target.value }))}
                  placeholder="ex: Fusariose, Anthracnose..." className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">Adventices</span>
                <input type="text" value={form.adventices} onChange={e => setForm(f => ({ ...f, adventices: e.target.value }))}
                  placeholder="ex: Graminées, Cypéracées..." className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">Intensité</span>
                <select value={form.intensite} onChange={e => setForm(f => ({ ...f, intensite: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white">
                  <option value="">— Choisir —</option>
                  {INTENSITE.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">Notes / Recommandations</span>
                <textarea rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none" />
              </label>
              <button onClick={submit} disabled={!form.date || !form.feuille}
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
