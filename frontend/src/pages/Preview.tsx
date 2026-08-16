import { useLocation, useNavigate } from 'react-router-dom';
import { useTemplateStore } from '../store/useTemplateStore';
import { api } from '../services/api';
import { useState, useRef } from 'react';

export default function Preview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { rows, validation, profile, filePath, fields } = location.state || {};
  const sheetName = useTemplateStore(s => s.sheetName);
  const headerRowIndex = useTemplateStore(s => s.headerRowIndex);
  const dataRowStart = useTemplateStore(s => s.dataRowStart);
  const originalFilename = useTemplateStore(s => s.filePath?.split(/[\\/]/).pop());
  const [loading, setLoading] = useState(false);
  const [customFilename, setCustomFilename] = useState(`Meesho_Bulk_Catalogue_${rows?.length || 10}_Listings`);

  const cellRefs = useRef<{[key: string]: HTMLTableCellElement | null}>({});

  if (!rows) {
    return <div className="p-20 text-center text-slate-500 font-medium text-lg">No data generated. Go back and generate again.</div>;
  }

  const errors = (validation?.errors || []).filter((e: any) => e.severity === 'error');
  const warnings = (validation?.errors || []).filter((e: any) => e.severity === 'warning');
  const isValid = errors.length === 0;

  const scrollToCell = (row: number, col: number) => {
    const key = `${row}-${col}`;
    const el = cellRefs.current[key];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      el.classList.add('ring-4', 'ring-rose-400', 'animate-pulse');
      setTimeout(() => el.classList.remove('ring-4', 'ring-rose-400', 'animate-pulse'), 2000);
    }
  };

  const handleExport = async () => {
    if (!isValid) {
      const confirmExport = window.confirm("Warning: Your catalogue has validation errors. This file may be rejected by Meesho. Do you want to download it anyway?");
      if (!confirmExport) return;
    }
    
    setLoading(true);
    try {
      const res = await api.exportListings({ 
        rows, 
        filePath, 
        sheetName, 
        headerRowIndex, 
        dataRowStart,
        customFilename,
        originalFilename,
        profile,
        fields,
        globalSettings: location.state?.globalSettings
      });
      if (res.success && res.fileId) {
        api.downloadHistoryFile(res.fileId);
      } else {
        alert('Export failed: ' + res.message);
      }
    } catch (err) {
      alert('Export failed');
    } finally {
      setLoading(false);
    }
  };

  const getCellError = (rowIndex: number, colNumber: number) => {
    return validation?.errors.find((e: any) => e.row === rowIndex && (e.colNumber === colNumber || e.colNumber === -1));
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Validation Dashboard */}
      {validation && (
        <div className={`glass-card p-6 border-l-8 ${isValid ? 'border-emerald-500' : 'border-rose-500'}`}>
          <div className="flex justify-between items-start">
             <div>
               <h3 className="text-xl font-extrabold text-[#1c1950] flex items-center">
                 {isValid ? (
                   <><svg className="w-6 h-6 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Generation Valid</>
                 ) : (
                   <><svg className="w-6 h-6 mr-2 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> Validation Failed</>
                 )}
               </h3>
               <p className="text-sm font-medium text-slate-500 mt-2">
                 {rows.length - errors.length} / {rows.length} rows valid.
               </p>
               {profile && (
                 <div className="mt-2 text-xs font-semibold text-indigo-600 bg-indigo-50 inline-block px-3 py-1 rounded-md">
                   Strategy: {profile.mode.replace('_', ' ')} (Version 1.0)
                 </div>
               )}
             </div>
             <div className="flex space-x-4">
               <div className="bg-rose-50 px-4 py-3 rounded-xl border border-rose-100 flex flex-col items-center">
                 <span className="text-2xl font-black text-rose-600">{errors.length}</span>
                 <span className="text-xs font-bold text-rose-800 uppercase">Errors</span>
               </div>
               <div className="bg-amber-50 px-4 py-3 rounded-xl border border-amber-100 flex flex-col items-center">
                 <span className="text-2xl font-black text-amber-600">{warnings.length}</span>
                 <span className="text-xs font-bold text-amber-800 uppercase">Warnings</span>
               </div>
             </div>
          </div>
          
          {errors.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-100">
               <h4 className="text-sm font-bold text-rose-900 mb-3 uppercase tracking-wider">Detected Errors (May cause upload failure)</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                 {errors.map((e: any, i: number) => (
                   <div key={i} onClick={() => scrollToCell(e.row, e.colNumber)} className="bg-white border border-rose-200 p-3 rounded-lg cursor-pointer hover:bg-rose-50 hover:border-rose-300 transition shadow-sm flex items-start">
                     <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-1 rounded mr-3">Row {e.row + 1}</span>
                     <div>
                       <div className="text-xs font-bold text-rose-900">{e.field}</div>
                       <div className="text-xs font-medium text-rose-600 mt-0.5">{e.message}</div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>
      )}

      <div className="glass-card p-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-[#1c1950]">Preview Listings</h2>
            <p className="text-slate-500 font-medium mt-1">Review your catalogue before exporting to Excel.</p>
          </div>
          <div className="flex items-center space-x-4 bg-slate-50 p-2 rounded-2xl border border-slate-100 shadow-sm w-full md:w-auto">
            <div className="flex flex-col px-3 w-full md:w-64">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Save As</label>
               <input 
                 type="text" 
                 value={customFilename} 
                 onChange={e => setCustomFilename(e.target.value)} 
                 placeholder="Enter file name"
                 className="bg-transparent outline-none text-[#1c1950] font-semibold text-sm w-full"
               />
            </div>
            <button onClick={() => navigate('/generator')} className="text-slate-600 hover:text-[#1c1950] font-medium px-4 transition border-l border-slate-200">
              Edit Strategy
            </button>
            <button 
              onClick={handleExport} 
              disabled={loading} 
              className={`${!isValid ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white shadow-md shadow-indigo-600/20 font-bold py-2.5 px-6 rounded-xl transition whitespace-nowrap`}
              title={!isValid ? "Export with Errors" : "Export Excel"}
            >
              {loading ? 'Exporting...' : (!isValid ? 'Export with Errors' : 'Export Excel')}
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto max-h-[60vh] rounded-2xl border border-slate-100 shadow-inner bg-slate-50 relative">
          <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
            <thead className="text-[#1c1950] sticky top-0 bg-slate-100/90 backdrop-blur-md z-10">
              <tr>
                <th className="px-6 py-4 font-bold border-b border-slate-200">Row</th>
                {fields.map((f: any) => (
                  <th key={f.colNumber} className="px-6 py-4 font-bold border-b border-slate-200">{f.header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row: any, idx: number) => (
                <tr key={idx} className="hover:bg-indigo-50/40 transition-colors bg-white">
                  <td className="px-6 py-4 font-semibold text-indigo-900 bg-slate-50/50">{idx + 1}</td>
                  {fields.map((f: any) => {
                    const cellError = getCellError(idx, f.colNumber);
                    return (
                      <td 
                        key={f.colNumber} 
                        ref={el => { cellRefs.current[`${idx}-${f.colNumber}`] = el; }}
                        className={`px-6 py-4 max-w-[250px] truncate font-medium transition-all ${
                          cellError?.severity === 'error' ? 'bg-rose-50 text-rose-800 font-bold border-x border-rose-200' : 
                          cellError?.severity === 'warning' ? 'bg-amber-50 text-amber-800 border-x border-amber-200' : ''
                        }`} 
                        title={cellError ? cellError.message : row[f.colNumber]}
                      >
                        {cellError && (
                          <span className="mr-2 inline-block">
                            {cellError.severity === 'error' ? '🚫' : '⚠️'}
                          </span>
                        )}
                        {row[f.colNumber]}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
