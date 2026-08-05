import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-fuchsia-600">MeeshoGen</span>
          </div>
          <div className="flex space-x-4">
            <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-fuchsia-600 transition font-medium">Dashboard</Link>
            <Link to="/upload" className="text-slate-600 dark:text-slate-300 hover:text-fuchsia-600 transition font-medium">Import Template</Link>
            <Link to="/profile" className="text-slate-600 dark:text-slate-300 hover:text-fuchsia-600 transition font-medium">Business Profile</Link>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
