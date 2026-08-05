import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useTemplateStore } from '../store/useTemplateStore';

export default function TemplateUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setTemplateData = useTemplateStore(s => s.setTemplateData);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await api.uploadTemplate(file);
      if (res.success) {
        setTemplateData(res.data);
        navigate('/generator');
      } else {
        alert('Upload failed: ' + res.message);
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 mt-10">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
        <div className="w-16 h-16 bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Import Meesho Template</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">Upload the official Meesho Bulk Upload Excel file. Our smart engine will automatically map all compulsory and optional fields.</p>
        
        <div className="flex flex-col items-center space-y-4">
          <input 
            type="file" 
            accept=".xlsx" 
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full max-w-sm text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-fuchsia-50 file:text-fuchsia-700 hover:file:bg-fuchsia-100 dark:file:bg-slate-800 dark:file:text-fuchsia-400"
          />
          <button 
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full max-w-sm bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-medium py-3 px-6 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Analyzing Template...' : 'Upload & Proceed'}
          </button>
        </div>
      </div>
    </div>
  );
}
