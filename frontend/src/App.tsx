import Navbar from '@/components/Navbar';
import Dashboard from '@/pages/Dashboard';
import Bots from '@/pages/Bots';
import Settings from '@/pages/Settings';
import { useAppStore } from '@/store/appStore';

export default function App() {
  const currentPage = useAppStore((s) => s.currentPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-4">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'bots' && <Bots />}
        {currentPage === 'settings' && <Settings />}
      </main>
    </div>
  );
}
