import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import Layout from '../components/Layout';
import { save, CULTURES } from '../data/appData';

// ─── Sheet parsers ────────────────────────────────────────────────────────────

function findHeaderRow(sheet, keywords) {
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1:A1');
  for (let r = range.s.r; r <= Math.min(range.e.r, 20); r++) {
    const rowVals = [];
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = sheet[XLSX.utils.encode_cell({ r, c })];
      if (cell) rowVals.push(String(cell.v || ''));
    }
    if (keywords.some(kw => rowVals.some(v => v.includes(kw)))) return r;
  }
  return 0;
}

function sheetToRows(sheet, headerRow) {
  const range  = XLSX.utils.decode_range(sheet['!ref'] || 'A1:A1');
  const headers = [];
  for (let c = range.s.c; c <= range.e.c; c++) {
    const cell = sheet[XLSX.utils.encode_cell({ r: headerRow, c })];
    headers.push(cell ? String(cell.v || '').trim() : `Col${c}`);
  }
  const rows = [];
  for (let r = headerRow + 1; r <= range.e.r; r++) {
    const obj = {};
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = sheet[XLSX.utils.encode_cell({ r, c })];
      obj[headers[c]] = cell ? cell.v : null;
    }
    if (Object.values(obj).some(v => v !== null && v !== '')) rows.push(obj);
  }
  return rows;
}

function excelDateToStr(v) {
  if (!v) return '';
  if (typeof v === 'number') {
    try {
      const d = XLSX.SSF.parse_date_code(v);
      return `${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`;
    } catch { return ''; }
  }
  if (v instanceof Date) {
    return v.toISOString().split('T')[0];
  }
  return String(v).split(' ')[0];
}

function parseIntrants(sheet) {
  const hr   = findHeaderRow(sheet, ['Date', 'Intrant', 'Produit', 'Quantité']);
  const rows = sheetToRows(sheet, hr);
  return rows
    .filter(r => r['Intrant / Produit'] || r['Intrant/Produit'] || r['Produit'])
    .map((r, i) => ({
      id: Date.now() + i,
      date:        excelDateToStr(r['Date Entrée'] || r['Date']),
      produit:     r['Intrant / Produit'] || r['Intrant/Produit'] || r['Produit'] || '',
      categorie:   r['Catégorie'] || r['Categorie'] || '',
      fournisseur: r['Fournisseur'] || '',
      quantite:    r['Quantité'] || r['Quantite'] || '',
      unite:       r['Unité'] || r['Unite'] || '',
      coutUnit:    r['Coût Unit. (FCFA)'] || r['Coût Unit'] || '',
      notes:       '',
    }));
}

function parsePluviometrie(sheet) {
  const range  = XLSX.utils.decode_range(sheet['!ref'] || 'A1:A1');
  const result = [];
  for (let r = range.s.r; r <= range.e.r; r++) {
    const row = [];
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = sheet[XLSX.utils.encode_cell({ r, c })];
      row.push(cell ? cell.v : null);
    }
    if (row.some(v => v !== null)) result.push(row);
  }
  return result;
}

function parseRecoltes(sheet) {
  const hr   = findHeaderRow(sheet, ['Culture', 'Campagne', 'Récolte', 'Qté', 'Rendement']);
  const rows = sheetToRows(sheet, hr);
  return rows
    .filter(r => r['Culture'] || r['Méthode'])
    .map((r, i) => ({
      id: Date.now() + i,
      culture:   r['Culture'] || '',
      feuille:   r['Feuille'] || '',
      methode:   r['Méthode'] || r['Methode'] || '',
      campagne:  r['Campagne'] || '2026-2027',
      parcelle:  r['Parcelle'] || 'P.O MBG',
      surface:   r['Surface (ha)'] || r['Surface'] || '',
      quantite:  r['Qté récoltée (kg)'] || r['Quantité'] || '',
      rendement: r['Rendement kg/ha'] || r['Rendement'] || '',
      qualite:   r['Qualité / Notes'] || r['Qualité'] || '',
      date:      excelDateToStr(r['Date'] || ''),
      notes:     '',
    }));
}

function parseManoeuvres(sheet) {
  const hr   = findHeaderRow(sheet, ['Nom', 'Tâche', 'Tache', 'Jours', 'Présence']);
  const rows = sheetToRows(sheet, hr);
  return rows
    .filter(r => r['Nom'] || r['Prénom'])
    .map((r, i) => ({
      id: Date.now() + i,
      nom:      r['Nom'] || '',
      prenom:   r['Prénom'] || r['Prenom'] || '',
      date:     excelDateToStr(r['Date'] || ''),
      tache:    r['Tâche'] || r['Tache'] || r['Activité'] || '',
      jours:    r['Jours'] || r['Nb jours'] || '',
      tauxJour: r['Taux/jour'] || r['Taux'] || '',
      notes:    r['Notes'] || r['Observations'] || '',
    }));
}

function parseBaseOps(sheet) {
  const hr   = findHeaderRow(sheet, ['Feuille', 'Culture', 'Opération', 'Operation']);
  const rows = sheetToRows(sheet, hr);
  const byFeuille = {};
  rows.forEach(r => {
    const feuille = r['Feuille'];
    const typeOp  = r['Type Opération'] || r['Type Operation'];
    if (!feuille || !typeOp || typeOp === 0) return;
    if (!byFeuille[feuille]) byFeuille[feuille] = [];
    byFeuille[feuille].push({
      typeOp:      String(typeOp),
      datePrevue:  excelDateToStr(r['Date Prévue'] || r['Date Prevue'] || ''),
      dateRealisee:excelDateToStr(r['Date Réalisée'] || r['Date Realisee'] || ''),
      stade:       r['Stade'] || r['Stade Phénologique'] || '',
      dose:        r['Dose / Quantité'] || '',
      unite:       r['Unité'] || '',
      surface:     r['Surface ha'] || '',
      observations:r['Observations'] || '',
    });
  });
  return byFeuille;
}

// ─── Sheet name matcher ───────────────────────────────────────────────────────
const KNOWN_SHEETS = {
  intrants:      s => /intrant/i.test(s),
  pluviometrie:  s => /pluvi/i.test(s),
  recoltes:      s => /r.colte/i.test(s) || /hist/i.test(s),
  manoeuvres:    s => /mano/i.test(s) || /man.uvre/i.test(s),
  baseops:       s => /base.?ops?/i.test(s) || /operations?/i.test(s),
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function ImportExcel() {
  const [status, setStatus]   = useState('idle'); // idle | parsing | preview | done | error
  const [preview, setPreview] = useState(null);
  const [error, setError]     = useState('');
  const [selected, setSelected] = useState({});
  const inputRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setStatus('parsing');
    setError('');

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'array', cellDates: true });
        const found = {};

        wb.SheetNames.forEach(name => {
          const sheet = wb.Sheets[name];
          if (KNOWN_SHEETS.intrants(name)) {
            const rows = parseIntrants(sheet);
            if (rows.length) found.intrants = rows;
          }
          if (KNOWN_SHEETS.pluviometrie(name)) {
            const rows = parsePluviometrie(sheet);
            if (rows.length) found.pluviometrie = rows;
          }
          if (KNOWN_SHEETS.recoltes(name)) {
            const rows = parseRecoltes(sheet);
            if (rows.length > 0) found.recoltes = rows;
          }
          if (KNOWN_SHEETS.manoeuvres(name)) {
            const rows = parseManoeuvres(sheet);
            if (rows.length) found.manoeuvres = rows;
          }
          if (KNOWN_SHEETS.baseops(name)) {
            const byFeuille = parseBaseOps(sheet);
            if (Object.keys(byFeuille).length) found.baseops = byFeuille;
          }
        });

        if (!Object.keys(found).length) {
          setError('Aucune donnée reconnue dans ce fichier. Vérifiez que c\'est bien un fichier de suivi P.O.');
          setStatus('error');
          return;
        }

        const sel = {};
        Object.keys(found).forEach(k => { sel[k] = true; });
        setSelected(sel);
        setPreview(found);
        setStatus('preview');
      } catch (err) {
        setError('Erreur de lecture : ' + err.message);
        setStatus('error');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const doImport = () => {
    let total = 0;
    if (selected.intrants && preview.intrants) {
      save('intrants', preview.intrants);
      total += preview.intrants.length;
    }
    if (selected.pluviometrie && preview.pluviometrie) {
      // store raw for reference
      save('pluv_import_raw', preview.pluviometrie);
      total++;
    }
    if (selected.recoltes && preview.recoltes) {
      save('recoltes', preview.recoltes);
      total += preview.recoltes.length;
    }
    if (selected.manoeuvres && preview.manoeuvres) {
      save('manoeuvres', preview.manoeuvres);
      total += preview.manoeuvres.length;
    }
    if (selected.baseops && preview.baseops) {
      Object.entries(preview.baseops).forEach(([feuille, ops]) => {
        const cult = CULTURES.find(c =>
          feuille.toLowerCase().includes(c.label.toLowerCase().split(' ')[0].toLowerCase()) ||
          c.label.toLowerCase() === feuille.toLowerCase()
        );
        if (cult) {
          save(`ops_${cult.id}`, ops);
          total += ops.length;
        }
      });
    }
    setStatus('done');
  };

  const LABELS = {
    intrants:     { icon: '📦', label: 'Intrants & Stocks' },
    pluviometrie: { icon: '🌧️', label: 'Pluviométrie' },
    recoltes:     { icon: '🌾', label: 'Récoltes' },
    manoeuvres:   { icon: '👷', label: 'Manœuvres' },
    baseops:      { icon: '📋', label: 'Opérations (Base Ops)' },
  };

  const count = (key) => {
    if (!preview || !preview[key]) return 0;
    if (key === 'baseops') return Object.values(preview[key]).flat().length;
    if (key === 'pluviometrie') return preview[key].length;
    return preview[key].length;
  };

  return (
    <Layout title="📥 Import Excel" onBack>
      {/* Intro */}
      <div className="mx-4 mt-3 bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">Importer depuis un fichier Excel</p>
        <p className="text-xs text-blue-600">
          Sélectionnez votre fichier <strong>Suivi_Observation_PO_*.xlsx</strong>.
          L'application reconnaîtra automatiquement les feuilles : Intrants, Pluviométrie, Récoltes, Manœuvres, Base Ops.
        </p>
      </div>

      {/* File picker */}
      {(status === 'idle' || status === 'error') && (
        <div className="mx-4 mt-4">
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.ods,.csv"
            onChange={handleFile}
            className="hidden"
          />
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full bg-primary text-white font-bold py-4 rounded-2xl flex flex-col items-center gap-2 active:scale-95 transition-transform"
          >
            <span className="text-3xl">📂</span>
            <span>Sélectionner un fichier Excel</span>
            <span className="text-xs text-green-200">.xlsx · .xls · .ods</span>
          </button>
          {error && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              ⚠️ {error}
            </div>
          )}
        </div>
      )}

      {/* Parsing */}
      {status === 'parsing' && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Lecture du fichier en cours…</p>
        </div>
      )}

      {/* Preview */}
      {status === 'preview' && preview && (
        <div className="px-4 mt-4 space-y-3">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
            Données détectées — Choisir ce à importer
          </h2>
          {Object.keys(preview).map(key => (
            <button
              key={key}
              onClick={() => setSelected(s => ({ ...s, [key]: !s[key] }))}
              className={`w-full flex items-center gap-4 rounded-2xl p-4 border-2 transition-colors text-left
                ${selected[key] ? 'bg-primary/5 border-primary' : 'bg-white border-gray-200'}`}
            >
              <span className="text-3xl">{LABELS[key]?.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-800">{LABELS[key]?.label}</p>
                <p className="text-xs text-gray-500">{count(key)} ligne{count(key) > 1 ? 's' : ''} détectée{count(key) > 1 ? 's' : ''}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0
                ${selected[key] ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                {selected[key] && <span className="text-white text-xs">✓</span>}
              </div>
            </button>
          ))}

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
            ⚠️ L'import <strong>remplacera</strong> les données existantes pour les catégories sélectionnées.
          </div>

          <button
            onClick={doImport}
            disabled={!Object.values(selected).some(Boolean)}
            className="w-full bg-primary text-white font-bold py-3.5 rounded-2xl mt-2 disabled:opacity-40 active:scale-95 transition-transform"
          >
            ✅ Importer les données sélectionnées
          </button>
          <button
            onClick={() => { setStatus('idle'); setPreview(null); }}
            className="w-full text-gray-500 text-sm py-2"
          >
            Annuler
          </button>
        </div>
      )}

      {/* Done */}
      {status === 'done' && (
        <div className="flex flex-col items-center justify-center py-16 gap-4 px-4">
          <span className="text-6xl">✅</span>
          <h2 className="text-xl font-bold text-gray-800 text-center">Import réussi !</h2>
          <p className="text-sm text-gray-500 text-center">
            Les données ont été importées et sont disponibles dans l'application.
          </p>
          <button
            onClick={() => { setStatus('idle'); setPreview(null); setSelected({}); inputRef.current && (inputRef.current.value = ''); }}
            className="bg-primary text-white font-bold px-8 py-3 rounded-2xl mt-2 active:scale-95"
          >
            Importer un autre fichier
          </button>
        </div>
      )}
    </Layout>
  );
}
