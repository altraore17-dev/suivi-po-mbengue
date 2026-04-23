import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { load, save, CULTURES } from '../data/appData';

const EMPTY = { culture: '', feuille: '', methode: 'Méth. A', campagne: '2026-2027', parcelle: 'P.O MBG', surface: '', quantite: '', rendement: '', qualite: '', date: '', notes: '' };

export default function Recoltes() {
  const [items, setItems]   = useState(() => load('recoltes'));
  const [adding, setAdding] = useState(false);
  const [form, setForm]     = useState(EMPTY);

  useEffect(() => { save('recoltes', items); }, [items]);

  const submit = () => {
    if (!form.culture) return;
    const q = parseFloat(form.quantite) || 0;
    const s = parseFloat(form.surface) || 0;
    const rend = s > 0 ? (q / s).toFixed(0) : '';
    setItems(prev => [{ ...form, rendement: rend, id: Date.now() }, ...prev]);
    setForm(EMPTY);
    setAdding(false);
  };

  const totalKg = items.reduce((s, it) => s + (parseFloat(it.quantite) || 0), 0);

  return (
    <Layout title="🌾 Récoltes" onBack>
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 px-4 mt-3">
        <div className="bg-amber-50 rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-amber-700">{items.length}</p>
          <p className="text-xs text-amber-600">Récoltes enregistrées</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-green-700">{totalKg.toLocaleString('fr-FR')}</p>
          <p className="text-xs text-green-600">Total (kg)</p>
        </div>
      </div>

      <div className="flex justify-end px-4 mt-3">
        <button onClick={() => { setForm(EMPTY); setAdding(true); }}
          className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold active:scale-95">
          + Nouvelle récolte
        </button>
      </div>

      <div className="px-4 mt-3 space-y-2 pb-4">
        {items.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">🌾</p>
            <p className="text-sm">Aucune récolte enregistrée</p>
          </div>
        )}
        {items.map((it) => (
          <div key={it.id} className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-sm text-gray-800">{it.culture} — {it.feuille}</p>
                <p className="text-xs text-gray-500">{it.methode} · {it.parcelle} · {it.campagne}</p>
                {it.date && <p className="text-xs text-gray-400">📅 {new Date(it.date).toLocaleDateString('fr-FR')}</p>}
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-700">{parseFloat(it.quantite || 0).toLocaleString('fr-FR')} kg</p>
                {it.rendement && <p className="text-xs text-green-600">{parseFloat(it.rendement).toLocaleString('fr-FR')} kg/ha</p>}
                {it.surface && <p className="text-xs text-gray-400">{it.surface} ha</p>}
              </div>
            </div>
            {it.qualite && <p className="text-xs text-gray-500 mt-1">Qualité : {it.qualite}</p>}
            {it.notes   && <p className="text-xs text-gray-400 italic mt-0.5">"{it.notes}"</p>}
          </div>
        ))}
      </div>

      {adding && (
        <div className="fixed inset-0 z-30 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAdding(false)} />
          <div className="relative w-full bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto">
            <h3 className="text-base font-bold text-gray-800 mb-4">Nouvelle récolte</h3>
            <div className="space-y-3">
              <label className="block">
                <span className="text-xs text-gray-500">Culture *</span>
                <select value={form.culture} onChange={e => setForm(f => ({ ...f, culture: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white">
                  <option value="">— Choisir —</option>
                  {['Coton', 'Maïs', 'Soja', 'Riz', 'Sésame', 'Manioc', 'Igname', 'Brachiaria', 'Stylosanthes', 'Pennisetum', 'Légumineuse'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">Feuille / Parcelle</span>
                <select value={form.feuille} onChange={e => setForm(f => ({ ...f, feuille: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white">
                  <option value="">— Choisir —</option>
                  {CULTURES.map(c => <option key={c.id} value={c.label}>{c.label}</option>)}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs text-gray-500">Méthode</span>
                  <select value={form.methode} onChange={e => setForm(f => ({ ...f, methode: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white">
                    <option>Méth. A</option>
                    <option>Méth. B</option>
                    <option>—</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs text-gray-500">Date récolte</span>
                  <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs text-gray-500">Surface (ha)</span>
                  <input type="number" step="0.01" value={form.surface} onChange={e => setForm(f => ({ ...f, surface: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-500">Quantité (kg)</span>
                  <input type="number" value={form.quantite} onChange={e => setForm(f => ({ ...f, quantite: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
                </label>
              </div>
              <label className="block">
                <span className="text-xs text-gray-500">Qualité / Notes</span>
                <textarea rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none" />
              </label>
              <button onClick={submit} disabled={!form.culture}
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
