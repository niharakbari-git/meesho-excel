import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  const navLinkClass = (path: string) => 
    `transition font-medium px-4 py-2 rounded-full ${
      location.pathname === path 
        ? 'bg-indigo-50 text-indigo-700' 
        : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50'
    }`;

  return (
    <div className="min-h-screen bg-[#f8f7fb] flex flex-col font-sans">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
               <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold text-[#1c1950]">MeeshoGen</span>
          </div>
          <div className="flex space-x-2 items-center">
            <Link to="/" className={navLinkClass('/')}>Dashboard</Link>
            <Link to="/upload" className={navLinkClass('/upload')}>Import Template</Link>
            <Link to="/generator" className={navLinkClass('/generator')}>Generator</Link>
            <Link to="/history" className={navLinkClass('/history')}>Files & History</Link>
            <Link to="/profile" className={navLinkClass('/profile')}>Business Profile</Link>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
