import { useAppStore } from '@/store/appStore';

export default function Navbar() {
  const { currentPage, setPage } = useAppStore();

  const linkClass = (page: typeof currentPage) =>
    currentPage === page ? 'font-semibold text-blue-600' : 'text-gray-600';

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-2 flex gap-4">
        <button
          className={linkClass('dashboard')}
          onClick={() => setPage('dashboard')}
        >
          Dashboard
        </button>
        <button className={linkClass('bots')} onClick={() => setPage('bots')}>
          Bots
        </button>
        <button
          className={linkClass('settings')}
          onClick={() => setPage('settings')}
        >
          Settings
        </button>
      </div>
    </nav>
  );
}
