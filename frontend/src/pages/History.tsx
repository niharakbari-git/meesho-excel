import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useTemplateStore } from '../store/useTemplateStore';

export default function History() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.getHistory();
      if (res.success) {
        setFiles(res.files);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (id: number) => {
    api.downloadHistoryFile(id);
    
    // Optimistically update status
    setFiles(files.map(f => f.id === id ? { ...f, status: 'DOWNLOADED' } : f));
  };

  const navigate = useNavigate();
  const setTemplateData = useTemplateStore(s => s.setTemplateData);
  const setGenerationMode = useTemplateStore(s => s.setGenerationMode);

  const handleRestore = async (id: number) => {
    try {
      setLoading(true);
      const res = await api.getHistoryProfile(id);
      if (res.success && res.profile) {
        const p = res.profile;
        setGenerationMode(p.mode as any);
        setTemplateData({
          fields: p.fieldsConfig ? JSON.parse(p.fieldsConfig) : [],
          filePath: p.originalFilePath,
          sheetName: p.sheetName,
          headerRowIndex: p.headerRowIndex,
          dataRowStart: p.dataRowStart
        });
        navigate('/generator'); // We might want to pass globalSettings in state, but UI form resets. The user will be at least able to re-generate fields.
      } else {
        alert(res.message || 'Profile not found');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to restore configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-4">
        <div>
           <h2 className="text-3xl font-extrabold text-[#1c1950]">Files & History</h2>
           <p className="text-slate-500 mt-2 font-medium">View and download your previously generated Meesho catalogues.</p>
        </div>
        <button onClick={fetchHistory} className="mt-4 md:mt-0 px-4 py-2 bg-white text-indigo-600 font-semibold rounded-xl border border-indigo-100 shadow-sm hover:bg-indigo-50 transition">
          Refresh
        </button>
      </div>

      <div className="glass-card p-8 min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center p-20">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#1c1950] mb-2">No Generation History</h3>
            <p className="text-slate-500 font-medium max-w-sm">You haven't generated any catalogues yet. Upload a template to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-inner bg-slate-50">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="text-[#1c1950] bg-slate-100/90 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 font-bold border-b border-slate-200">File Name</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-200">Template / Category</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-200">Listings</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-200">Date</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-200">Status</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-200 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-indigo-50/40 transition-colors bg-white group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-indigo-900 truncate max-w-[200px]" title={file.generatedFilename}>
                        {file.generatedFilename}
                      </div>
                      <div className="text-xs text-slate-400 mt-1 truncate max-w-[200px]" title={file.originalFilename}>
                        From: {file.originalFilename}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">
                      {file.templateName || 'Unknown Sheet'}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg">
                        {file.generatedRows} rows
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {new Date(file.createdAt).toLocaleString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        file.status === 'DOWNLOADED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {file.status || 'GENERATED'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end space-x-2">
                      <button 
                        onClick={() => handleRestore(file.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl shadow-sm border border-slate-200"
                        title="Restore Configuration"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDownload(file.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl shadow-sm"
                        title="Download File"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
