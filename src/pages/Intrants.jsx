import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { load, save, CATEGORIES_INTRANT } from '../data/appData';

const EMPTY = { date: '', produit: '', categorie: '', fournisseur: '', quantite: '', unite: '', coutUnit: '', notes: '' };

export default function Intrants() {
  const [items, setItems]   = useState(() => load('intrants'));
  const [adding, setAdding] = useState(false);
  const [form, setForm]     = useState(EMPTY);
  const [search, setSearch] = useState('');

  useEffect(() => { save('intrants', items); }, [items]);

  const submit = () => {
    if (!form.produit) return;
    setItems(prev => [{ ...form, id: Date.now() }, ...prev]);
    setForm(EMPTY);
    setAdding(false);
  };

  const remove = (id) => {
    if (!confirm('Supprimer ?')) return;
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const filtered = items.filter(it =>
    it.produit?.toLowerCase().includes(search.toLowerCase()) ||
    it.categorie?.toLowerCase().includes(search.toLowerCase())
  );

  const totalCout = items.reduce((s, it) => {
    const q = parseFloat(it.quantite) || 0;
    const c = parseFloat(it.coutUnit) || 0;
    return s + q * c;
  }, 0);

  return (
    <Layout title="📦 Intrants & Stocks" onBack>
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 px-4 mt-3">
        <div className="bg-blue-50 rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-blue-700">{items.length}</p>
          <p className="text-xs text-blue-500">Entrées</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-3 text-center">
          <p className="text-lg font-bold text-green-700">{totalCout.toLocaleString('fr-FR')}</p>
          <p className="text-xs text-green-500">Total FCFA</p>
        </div>
      </div>

      {/* Search + Add */}
      <div className="flex gap-2 px-4 mt-3">
        <input
          type="search" placeholder="Rechercher..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm"
        />
        <button onClick={() => { setForm(EMPTY); setAdding(true); }}
          className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold active:scale-95">
          + Ajouter
        </button>
      </div>

      {/* List */}
      <div className="px-4 mt-3 space-y-2 pb-4">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">📦</p>
            <p className="text-sm">Aucun intrant enregistré</p>
          </div>
        )}
        {filtered.map((it) => (
          <div key={it.id} className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-sm text-gray-800">{it.produit}</p>
                <p className="text-xs text-gray-500">{it.categorie}{it.fournisseur ? ` · ${it.fournisseur}` : ''}</p>
                {it.date && <p className="text-xs text-gray-400 mt-0.5">📅 {new Date(it.date).toLocaleDateString('fr-FR')}</p>}
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-gray-700">{it.quantite} {it.unite}</p>
                {it.coutUnit && (
                  <p className="text-xs text-gray-500">
                    {((parseFloat(it.quantite) || 0) * (parseFloat(it.coutUnit) || 0)).toLocaleString('fr-FR')} FCFA
                  </p>
                )}
              </div>
            </div>
            <button onClick={() => remove(it.id)} className="mt-2 text-xs text-red-400 border border-red-100 rounded-full px-3 py-1">
              Supprimer
            </button>
          </div>
        ))}
      </div>

      {/* Drawer */}
      {adding && (
        <div className="fixed inset-0 z-30 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAdding(false)} />
          <div className="relative w-full bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto">
            <h3 className="text-base font-bold text-gray-800 mb-4">Nouvel intrant</h3>
            <div className="space-y-3">
              <label className="block">
                <span className="text-xs text-gray-500">Date d'entrée</span>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">Produit / Intrant *</span>
                <input type="text" value={form.produit} onChange={e => setForm(f => ({ ...f, produit: e.target.value }))}
                  placeholder="ex: Urée 46%" className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">Catégorie</span>
                <select value={form.categorie} onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white">
                  <option value="">— Choisir —</option>
                  {CATEGORIES_INTRANT.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">Fournisseur</span>
                <input type="text" value={form.fournisseur} onChange={e => setForm(f => ({ ...f, fournisseur: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs text-gray-500">Quantité</span>
                  <input type="number" value={form.quantite} onChange={e => setForm(f => ({ ...f, quantite: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-500">Unité</span>
                  <input type="text" value={form.unite} onChange={e => setForm(f => ({ ...f, unite: e.target.value }))}
                    placeholder="kg, L, sac..." className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
                </label>
              </div>
              <label className="block">
                <span className="text-xs text-gray-500">Coût unitaire (FCFA)</span>
                <input type="number" value={form.coutUnit} onChange={e => setForm(f => ({ ...f, coutUnit: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">Notes</span>
                <textarea rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none" />
              </label>
              <button onClick={submit} disabled={!form.produit}
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
