import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="space-y-10 pb-20">
      
      <div className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 rounded-3xl p-10 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-4">Welcome to MeeshoGen</h1>
          <p className="text-indigo-100 text-lg max-w-2xl font-medium mb-8">
            The ultimate AI-powered bulk listing generator for Meesho. Upload your official template, configure smart generators, and export perfect catalogues in seconds.
          </p>
          <div className="flex space-x-4">
            <Link to="/upload" className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold py-3.5 px-8 rounded-xl transition shadow-lg transform hover:-translate-y-1">
              Start New Catalogue
            </Link>
            <Link to="/history" className="bg-indigo-900/40 hover:bg-indigo-900/60 backdrop-blur-md text-white font-bold py-3.5 px-8 rounded-xl transition border border-indigo-400/30">
              View History
            </Link>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-40 w-60 h-60 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glass-card p-8 group">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#1c1950] mb-3">1. Upload Template</h3>
          <p className="text-slate-500 font-medium leading-relaxed">
            Upload the official Meesho Excel template. We dynamically parse all fields, mandatory columns, and descriptions.
          </p>
        </div>

        <div className="glass-card p-8 group">
          <div className="w-14 h-14 bg-fuchsia-50 text-fuchsia-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#1c1950] mb-3">2. Configure Logic</h3>
          <p className="text-slate-500 font-medium leading-relaxed">
            Set up intelligent generation logic for SKUs, prices, titles, and image pools using global settings or field-level overrides.
          </p>
        </div>

        <div className="glass-card p-8 group">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#1c1950] mb-3">3. Export & Download</h3>
          <p className="text-slate-500 font-medium leading-relaxed">
            Generate thousands of rows instantly. Your file history is saved locally for future reference and fast redownloads.
          </p>
        </div>

      </div>

      <div className="mt-8 border-t border-slate-200 pt-10">
        <h2 className="text-2xl font-extrabold text-[#1c1950] mb-6">Pro Tips & Prompts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 shadow-sm transition hover:shadow-md">
             <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                AI Prompt for Product Attributes
             </h3>
             <p className="text-sm text-indigo-800 mb-4 font-medium leading-relaxed">
               When configuring a field using "Comma Separated Values" (like Colors, Materials, Sizes, or Highlights), use this prompt in ChatGPT to quickly generate a list of unique values:
             </p>
             <div className="bg-white p-4 rounded-xl border border-indigo-100 text-sm text-slate-700 font-mono select-all shadow-sm">
               Act as an e-commerce expert. I am listing [Product Type]. Generate a comma-separated list of 20 unique [Field Name] for these products. Do not include quotes, bullet points, or newlines. Just the comma-separated text.
             </div>
          </div>
          
          <div className="bg-fuchsia-50/50 p-6 rounded-3xl border border-fuchsia-100 shadow-sm transition hover:shadow-md">
             <h3 className="text-lg font-bold text-fuchsia-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-fuchsia-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                Unique Random Numbers
             </h3>
             <p className="text-sm text-fuchsia-800 font-medium leading-relaxed">
               Need completely unique numbers (like Barcodes or Serial Numbers) without any duplicates? 
               <br/><br/>
               Select the <strong>"Random Around Value"</strong> mode and check the <strong>"Generate Unique Numbers"</strong> box. MeeshoGen will automatically track generated values and re-roll to guarantee uniqueness across thousands of rows.
             </p>
          </div>
        </div>
      </div>

    </div>
  );
}
