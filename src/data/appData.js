// Static reference data for the app
export const CAMPAGNE = '2026-2027';
export const SITE = 'P.O MBG';
export const RESPONSABLE = 'TRAORE Abdoulaye';
export const DATE_DEBUT = '2026-04-01';

export const CULTURES = [
  { id: 'coton1', label: 'Coton 1', culture: 'Coton', precedent: 'Crotalaire retusa', icon: '🌿' },
  { id: 'coton2', label: 'Coton 2', culture: 'Coton', precedent: 'Crotalaire juncea', icon: '🌿' },
  { id: 'coton3', label: 'Coton 3', culture: 'Coton', precedent: 'Soja', icon: '🌿' },
  { id: 'coton4', label: 'Coton 4', culture: 'Coton', precedent: 'Spectabilis', icon: '🌿' },
  { id: 'coton5', label: 'Coton 5', culture: 'Coton', precedent: 'Panicum', icon: '🌿' },
  { id: 'coton6', label: 'Coton 6', culture: 'Coton', precedent: 'Bracharia-Sorgho', icon: '🌿' },
  { id: 'coton7', label: 'Coton 7', culture: 'Coton', precedent: 'Ochroleuca-Mungo', icon: '🌿' },
  { id: 'coton8', label: 'Coton 8', culture: 'Coton', precedent: 'Cajanus-Sesbania', icon: '🌿' },
  { id: 'mais1',  label: 'Maïs 1',  culture: 'Maïs', precedent: '', icon: '🌽' },
  { id: 'mais2',  label: 'Maïs 2',  culture: 'Maïs', precedent: '', icon: '🌽' },
  { id: 'mais3',  label: 'Maïs 3',  culture: 'Maïs', precedent: '', icon: '🌽' },
  { id: 'mais4',  label: 'Maïs 4',  culture: 'Maïs', precedent: '', icon: '🌽' },
  { id: 'mais5',  label: 'Maïs 5',  culture: 'Maïs', precedent: '', icon: '🌽' },
  { id: 'fourr1', label: 'Fourrage 1', culture: 'Fourrage', precedent: '', icon: '🌾' },
  { id: 'fourr2', label: 'Fourrage 2', culture: 'Fourrage', precedent: '', icon: '🌾' },
  { id: 'fourr3', label: 'Fourrage 3', culture: 'Fourrage', precedent: '', icon: '🌾' },
  { id: 'fourr4', label: 'Fourrage 4', culture: 'Fourrage', precedent: '', icon: '🌾' },
  { id: 'fourr5', label: 'Fourrage 5', culture: 'Fourrage', precedent: '', icon: '🌾' },
  { id: 'legu1',  label: 'Légum. 1',  culture: 'Légumineuse', precedent: '', icon: '🫘' },
  { id: 'legu2',  label: 'Légum. 2',  culture: 'Légumineuse', precedent: '', icon: '🫘' },
  { id: 'legu3',  label: 'Légum. 3',  culture: 'Légumineuse', precedent: '', icon: '🫘' },
  { id: 'legu4',  label: 'Légum. 4',  culture: 'Légumineuse', precedent: '', icon: '🫘' },
  { id: 'legu5',  label: 'Légum. 5',  culture: 'Légumineuse', precedent: '', icon: '🫘' },
  { id: 'legu6',  label: 'Légum. 6',  culture: 'Légumineuse', precedent: '', icon: '🫘' },
  { id: 'legu7',  label: 'Légum. 7',  culture: 'Légumineuse', precedent: '', icon: '🫘' },
  { id: 'legu8',  label: 'Légum. 8',  culture: 'Légumineuse', precedent: '', icon: '🫘' },
  { id: 'legu9',  label: 'Légum. 9',  culture: 'Légumineuse', precedent: '', icon: '🫘' },
  { id: 'legu10', label: 'Légum. 10', culture: 'Légumineuse', precedent: '', icon: '🫘' },
];

export const TYPES_OPERATION = [
  'Préparation du sol', 'Labour', 'Billonnage', 'Semis', 'Resemis',
  'Démariage', 'Fertilisation (urée)', 'Fertilisation (NPK)', 'Fertilisation (fond)',
  'Traitement insecticide', 'Traitement herbicide', 'Traitement fongicide',
  'Sarclage', 'Buttage', 'Irrigation', 'Récolte', 'Pesée récolte',
  'Comptage', 'Observation phytosanitaire', 'Autre',
];

export const STADES = [
  'Levée', 'V1-V3 (3 feuilles)', 'V4-V6', 'V7-V9', 'V10+',
  'Floraison', 'Fructification', 'Maturation', 'Récolte',
];

export const MOIS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

export const CATEGORIES_INTRANT = [
  'Semences', 'Engrais', 'Pesticide', 'Herbicide', 'Fongicide',
  'Insecticide', 'Matériel', 'Carburant', 'Autre',
];

// ─── localStorage helpers ─────────────────────────────────────────────────────
const KEY = (k) => `suivi_po_${k}`;

export function load(key) {
  try { return JSON.parse(localStorage.getItem(KEY(key))) ?? []; }
  catch { return []; }
}
export function save(key, data) {
  localStorage.setItem(KEY(key), JSON.stringify(data));
}
export function loadObj(key, def = {}) {
  try { return JSON.parse(localStorage.getItem(KEY(key))) ?? def; }
  catch { return def; }
}
export function saveObj(key, data) {
  localStorage.setItem(KEY(key), JSON.stringify(data));
}

// ─── Statut auto ─────────────────────────────────────────────────────────────
export function computeStatut(datePrevue, dateRealisee) {
  if (dateRealisee) return 'Réalisé';
  if (!datePrevue) return '';
  const today = new Date();
  const prev  = new Date(datePrevue);
  const diff  = Math.round((prev - today) / 86400000);
  if (diff < 0)  return 'EN RETARD';
  if (diff <= 3) return 'J-3';
  if (diff <= 7) return 'J-7';
  return 'Planifié';
}

export function statutColor(statut) {
  switch (statut) {
    case 'EN RETARD': return 'bg-red-100 text-red-800';
    case 'J-3':       return 'bg-orange-100 text-orange-800';
    case 'J-7':       return 'bg-yellow-100 text-yellow-800';
    case 'Réalisé':   return 'bg-green-100 text-green-800';
    default:          return 'bg-gray-100 text-gray-600';
  }
}
