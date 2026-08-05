import { useLocation, useNavigate } from 'react-router-dom';
import { useTemplateStore } from '../store/useTemplateStore';
import { api } from '../services/api';
import { useState } from 'react';

export default function Preview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { rows, filePath, fields } = location.state || {};
  const sheetName = useTemplateStore(s => s.sheetName);
  const headerRowIndex = useTemplateStore(s => s.headerRowIndex);
  const dataRowStart = useTemplateStore(s => s.dataRowStart);
  const [loading, setLoading] = useState(false);

  if (!rows) {
    return <div className="p-10 text-center text-slate-500">No data generated. Go back and generate again.</div>;
  }

  const handleExport = async () => {
    setLoading(true);
    try {
      await api.exportListings({ rows, filePath, sheetName, headerRowIndex, dataRowStart });
    } catch (err) {
      alert('Export failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Preview Listings ({rows.length})</h2>
          <div className="space-x-4">
            <button onClick={() => navigate('/generator')} className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-medium py-2 px-6 rounded-lg transition">
              Back
            </button>
            <button onClick={handleExport} disabled={loading} className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50">
              {loading ? 'Exporting...' : 'Export Excel'}
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto max-h-[60vh]">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 sticky top-0">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">Row</th>
                {fields.map((f: any) => (
                  <th key={f.colNumber} className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">{f.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row: any, idx: number) => (
                <tr key={idx} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{idx + 1}</td>
                  {fields.map((f: any) => (
                    <td key={f.colNumber} className="px-4 py-3 max-w-[200px] truncate" title={row[f.colNumber]}>
                      {row[f.colNumber]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
