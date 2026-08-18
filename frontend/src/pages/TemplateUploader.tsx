import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useTemplateStore } from '../store/useTemplateStore';

export default function TemplateUploader() {
  // Removed unused file state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setTemplateData = useTemplateStore(s => s.setTemplateData);

  const handleUpload = async (uploadFile: File) => {
    if (!uploadFile) return;
    setLoading(true);
    try {
      const res = await api.uploadTemplate(uploadFile);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleUpload(selectedFile);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-4">
        <div>
           <h2 className="text-3xl font-extrabold text-[#1c1950]">Import Template</h2>
           <p className="text-slate-500 mt-2 font-medium">Upload your official Meesho catalog Excel file to begin generating data.</p>
        </div>
      </div>

      <div className="glass-card p-12 flex flex-col items-center justify-center min-h-[400px] border-dashed border-2 border-slate-200">
        
        <div className="w-24 h-24 mb-6 rounded-full bg-indigo-50 flex items-center justify-center shadow-inner">
          <svg className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <div className="relative group cursor-pointer">
          <button 
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
          >
            {loading ? 'Analyzing Template...' : 'Select Excel File'}
          </button>
          <input 
            type="file" 
            accept=".xlsx,.xls" 
            onChange={handleFileUpload}
            disabled={loading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
        </div>
        
        <p className="mt-6 text-sm font-semibold text-slate-400 max-w-md text-center">
          Supported formats: .xlsx. The engine will automatically locate the "Fill This" sheet.
        </p>

      </div>
    </div>
  );
}
