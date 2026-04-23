export default function StatCard({ label, value, sub, color = 'bg-white', textColor = 'text-gray-800', icon }) {
  return (
    <div className={`${color} rounded-2xl p-4 shadow-sm flex flex-col gap-1`}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 font-medium">{label}</span>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <span className={`text-3xl font-bold ${textColor}`}>{value}</span>
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
    </div>
  );
}
