import { useNavigate } from 'react-router-dom';

export default function Header({ title, onBack }) {
  const nav = useNavigate();
  return (
    <header className="safe-top bg-primary text-white shadow-md z-10">
      <div className="flex items-center gap-3 px-4 py-3">
        {onBack && (
          <button onClick={() => nav(-1)} className="p-1 -ml-1 rounded-full active:bg-white/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold truncate">{title}</h1>
          <p className="text-xs text-green-200">P.O M'Bengue · Campagne 2026-27</p>
        </div>
        <div className="text-xs text-green-200 text-right">
          {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
        </div>
      </div>
    </header>
  );
}
