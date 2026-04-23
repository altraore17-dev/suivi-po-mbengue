import BottomNav from './BottomNav';
import Header from './Header';

export default function Layout({ title, children, onBack }) {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header title={title} onBack={onBack} />
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
