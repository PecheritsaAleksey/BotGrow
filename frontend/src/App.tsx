import { Outlet } from 'react-router-dom';

import Navbar from '@/components/Navbar';

export default function App() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="py-8 px-4 md:px-6 max-w-5xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
