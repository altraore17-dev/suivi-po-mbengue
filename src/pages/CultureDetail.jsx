import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  CULTURES, TYPES_OPERATION, STADES,
  load, save, computeStatut, statutColor,
  CAMPAGNE, SITE
} from '../data/appData';

const EMPTY_OP = { typeOp: '', datePrevue: '', dateRealisee: '', stade: '', dose: '', unite: '', surface: '', observations: '' };

export default function CultureDetail() {
  const { id } = useParams();
  const culture = CULTURES.find(c => c.id === id);
  const [ops, setOps]         = useState(() => load(`ops_${id}`));
  const [adding, setAdding]   = useState(false);
  const [editing, setEditing] = useState(null); // index
  const [form, setForm]       = useState(EMPTY_OP);

  useEffect(() => { save(`ops_${id}`, ops); }, [ops, id]);

  const openAdd = () => { setForm(EMPTY_OP); setEditing(null); setAdding(true); };
  const openEdit = (i) => { setForm({ ...EMPTY_OP, ...ops[i] }); setEditing(i); setAdding(true); };

  const submit = useCallback(() => {
    if (!form.typeOp) return;
    const updated = [...ops];
    if (editing !== null) updated[editing] = form;
    else updated.push(form);
    setOps(updated);
    setAdding(false);
    setEditing(null);
  }, [form, ops, editing]);

  const remove = (i) => {
    if (!confirm('Supprimer cette opération ?')) return;
    setOps(ops.filter((_, j) => j !== i));
  };

  if (!culture) return <Layout title="Culture introuvable" onBack><p className="p-4 text-gray-500">Culture non trouvée.</p></Layout>;

  return (
    <Layout title={`${culture.icon} ${culture.label}`} onBack>
      {/* Info card */}
      <div className="mx-4 mt-3 bg-primary/5 border border-primary/20 rounded-2xl p-4 text-sm text-gray-700 space-y-1">
        <p>🌱 Culture : <strong>{culture.culture}</strong></p>
        {culture.precedent && <p>⬅️ Précédent : <strong>{culture.precedent}</strong></p>}
        <p>📍 Site : <strong>{SITE}</strong> · Campagne <strong>{CAMPAGNE}</strong></p>
      </div>

      {/* Ops header */}
      <div className="flex items-center justify-between px-4 mt-4 mb-2">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
          Opérations ({ops.filter(o => o.typeOp).length})
        </h2>
        <button onClick={openAdd} className="bg-primary text-white text-sm font-semibold px-4 py-1.5 rounded-full active:scale-95 transition-transform">
          + Ajouter
        </button>
      </div>

      {/* Ops list */}
      <div className="px-4 space-y-2 pb-4">
        {ops.filter(o => o.typeOp).length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">📋</p>
            <p className="text-sm">Aucune opération. Appuyez sur + Ajouter.</p>
          </div>
        )}
        {ops.map((op, i) => {
          if (!op.typeOp) return null;
          const st = computeStatut(op.datePrevue, op.dateRealisee);
          return (
            <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className={`h-1 ${st === 'EN RETARD' ? 'bg-red-500' : st === 'J-3' ? 'bg-orange-400' : st === 'Réalisé' ? 'bg-green-500' : 'bg-gray-200'}`} />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-800">{op.typeOp}</p>
                    <div className="flex flex-wrap gap-x-3 mt-1 text-xs text-gray-500">
                      {op.datePrevue   && <span>📅 Prévu : {new Date(op.datePrevue).toLocaleDateString('fr-FR')}</span>}
                      {op.dateRealisee && <span>✅ Réalisé : {new Date(op.dateRealisee).toLocaleDateString('fr-FR')}</span>}
                      {op.stade        && <span>🌱 {op.stade}</span>}
                      {op.dose         && <span>💊 {op.dose} {op.unite}</span>}
                      {op.surface      && <span>📐 {op.surface} ha</span>}
                    </div>
                    {op.observations && <p className="text-xs text-gray-400 mt-1 italic">"{op.observations}"</p>}
                  </div>
                  <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded-full ${statutColor(st)}`}>{st || '—'}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openEdit(i)} className="flex-1 text-xs text-primary border border-primary/30 rounded-full py-1.5">Modifier</button>
                  <button onClick={() => remove(i)} className="flex-1 text-xs text-red-500 border border-red-200 rounded-full py-1.5">Supprimer</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drawer */}
      {adding && (
        <div className="fixed inset-0 z-30 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAdding(false)} />
          <div className="relative w-full bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto">
            <h3 className="text-base font-bold text-gray-800 mb-4">
              {editing !== null ? 'Modifier opération' : 'Nouvelle opération'}
            </h3>
            <div className="space-y-3">
              <label className="block">
                <span className="text-xs text-gray-500 font-medium">Type d'opération *</span>
                <select value={form.typeOp} onChange={e => setForm(f => ({ ...f, typeOp: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white">
                  <option value="">— Choisir —</option>
                  {TYPES_OPERATION.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs text-gray-500 font-medium">Date prévue</span>
                  <input type="date" value={form.datePrevue} onChange={e => setForm(f => ({ ...f, datePrevue: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-500 font-medium">Date réalisée</span>
                  <input type="date" value={form.dateRealisee} onChange={e => setForm(f => ({ ...f, dateRealisee: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
                </label>
              </div>
              <label className="block">
                <span className="text-xs text-gray-500 font-medium">Stade phénologique</span>
                <select value={form.stade} onChange={e => setForm(f => ({ ...f, stade: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white">
                  <option value="">— Choisir —</option>
                  {STADES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs text-gray-500 font-medium">Dose / Quantité</span>
                  <input type="text" value={form.dose} onChange={e => setForm(f => ({ ...f, dose: e.target.value }))}
                    placeholder="ex: 150" className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-500 font-medium">Unité</span>
                  <input type="text" value={form.unite} onChange={e => setForm(f => ({ ...f, unite: e.target.value }))}
                    placeholder="ex: kg/ha" className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
                </label>
              </div>
              <label className="block">
                <span className="text-xs text-gray-500 font-medium">Surface (ha)</span>
                <input type="number" step="0.01" value={form.surface} onChange={e => setForm(f => ({ ...f, surface: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" />
              </label>
              <label className="block">
                <span className="text-xs text-gray-500 font-medium">Observations</span>
                <textarea rows={2} value={form.observations} onChange={e => setForm(f => ({ ...f, observations: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none" />
              </label>
              <button onClick={submit} disabled={!form.typeOp}
                className="w-full bg-primary text-white font-bold py-3 rounded-2xl mt-2 disabled:opacity-40 active:scale-95 transition-transform">
                {editing !== null ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
