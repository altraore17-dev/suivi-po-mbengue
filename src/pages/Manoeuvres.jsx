import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { load, save } from '../data/appData';

const EMPTY = { nom: '', prenom: '', date: '', tache: '', jours: '', tauxJour: '', notes: '' };

export default function Manoeuvres() {
  const [items, setItems]   = useState(() => load('manoeuvres'));
  const [adding, setAdding] = useState(false);
  const [form, setForm]     = useState(EMPTY);

  useEffect(() => { save('manoeuvres', items); }, [items]);

  const submit = () => {
    if (!form.nom) return;
    setItems(prev => [{ ...form, id: Date.now() }, ...prev]);
    setForm(EMPTY);
    setAdding(false);
  };

  const totalPaye = items.reduce((s, it) => {
    return s + (parseFloat(it.jours) || 0) * (parseFloat(it.tauxJour) || 0);
  }, 0);

  return (
    <Layout title="👷 Suivi Manœuvres" onBack>
      <div className="grid grid-cols-2 gap-3 px-4 mt-3">
        <div className="bg-blue-50 rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-blue-700">{items.length}</p>
          <p className="text-xs text-blue-500">Entrées</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-3 text-center">
          <p className="text-lg font-bold text-green-700">{totalPaye.toLocaleString('fr-FR')}</p>
          <p className="text-xs text-green-500">Total FCFA</p>
        </div>
      </div>

      <div className="flex justify-end px-4 mt-3">
        <button onClick={() => { setForm(EMPTY); setAdding(true); }}
          className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold active:scale-95">
          + Enregistrer
        </button>
      </div>

      <div className="px-4 mt-3 space-y-2 pb-4">
        {items.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">👷</p>
            <p className="text-sm">Aucun manœuvre enregistré</p>
          </div>
        )}
        {items.map((it) => (
          <div key={it.id} className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-sm text-gray-800">{it.nom} {it.prenom}</p>
                <p className="text-xs text-gray-500">{it.tache}</p>
                {it.date && <p className="text-xs text-gray-400">📅 {new Date(it.date).toLocaleDateString('fr-FR')}</p>}
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-700">{it.jours} j</p>
                {it.tauxJour && (
                  <p className="text-xs text-green-600">
                    {((parseFloat(it.jours) || 0) * (parseFloat(it.tauxJour) || 0)).toLocaleString('fr-FR')} FCFA
                  </p>
                )}
              </div>
            </div>
            {it.notes && <p className="text-xs text-gray-400 italic mt-1">"{it.notes}"</p>}
          </div>
        ))}
      </div>

      {adding && (
        <div className="fixed inset-0 z-30 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAdding(false)} />
          <div className="relative w-full bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto">
            <h3 className="text-base font-bold text-gray-800 mb-4">Nouvel enregistrement</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs text-gray-500">Nom *</span>
                  <input type="text" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-500">Prénom</span>
                  <input type="text" value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
                </label>
              </div>
              <label className="block">
                <span className="text-xs text-gray-500">Date</span>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">Tâche effectuée</span>
                <input type="text" value={form.tache} onChange={e => setForm(f => ({ ...f, tache: e.target.value }))}
                  placeholder="ex: Sarclage, Semis..." className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs text-gray-500">Nb jours travaillés</span>
                  <input type="number" step="0.5" value={form.jours} onChange={e => setForm(f => ({ ...f, jours: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-500">Taux/jour (FCFA)</span>
                  <input type="number" value={form.tauxJour} onChange={e => setForm(f => ({ ...f, tauxJour: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
                </label>
              </div>
              <label className="block">
                <span className="text-xs text-gray-500">Notes</span>
                <textarea rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none" />
              </label>
              <button onClick={submit} disabled={!form.nom}
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
