import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useTemplateStore, type AnalyzedField } from '../store/useTemplateStore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FieldConfigDialog } from '../components/FieldConfigDialog';

export default function CatalogueGenerator() {
  const fields = useTemplateStore(s => s.fields);
  const filePath = useTemplateStore(s => s.filePath);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [activeConfigField, setActiveConfigField] = useState<AnalyzedField | null>(null);

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      count: 10
    }
  });

  const count = watch('count') || 0;

  const mutation = useMutation({
    mutationFn: api.generateListings,
    onSuccess: (res) => {
      navigate('/preview', { state: { rows: res.data, filePath, fields } });
    }
  });

  if (fields.length === 0) {
    return <div className="text-center p-10 text-slate-500">No template loaded. Go to Import Template first.</div>;
  }

  const formatModeName = (mode: string) => {
    const map: any = {
      'FIXED': 'Fixed Value',
      'RANDOMIZE': 'Random Around Value',
      'VALUE_POOL': 'Comma Separated Values',
      'WORD_COMBO': 'Word Combination Generator',
      'AUTO_INCREMENT': 'Auto Increment',
      'AI': 'AI Generation',
      'CUSTOM': 'Custom Generator',
    };
    return map[mode] || mode;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div>
           <h2 className="text-xl font-bold text-slate-800 dark:text-white">Field Configuration</h2>
           <p className="text-sm text-slate-500">Configure how each field should be generated.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        
        <form onSubmit={handleSubmit((d) => mutation.mutate({ fields, count: d.count }))} className="space-y-8">
          
          <div className="p-6 bg-fuchsia-50 dark:bg-fuchsia-900/10 rounded-xl border border-fuchsia-100 dark:border-fuchsia-800/30">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-xl font-bold text-fuchsia-900 dark:text-fuchsia-100">Global Settings</h3>
                <p className="text-fuchsia-700 dark:text-fuchsia-400 font-medium mt-1">
                  {count > 0 ? `${count} product rows will be generated.` : 'Enter number of rows to generate.'}
                </p>
              </div>
              <div className="flex flex-col">
                 <label className="text-xs font-bold text-fuchsia-800 dark:text-fuchsia-300 mb-1 uppercase tracking-wider">Number of Listings</label>
                 <input type="number" {...register('count', { valueAsNumber: true })} className="w-32 px-4 py-2 border-2 border-fuchsia-300 dark:border-fuchsia-600 rounded-lg bg-white dark:bg-slate-900 font-bold outline-none text-slate-900 dark:text-white focus:border-fuchsia-500" />
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Field Generators</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map(field => (
                 <div key={field.colNumber} className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between hover:shadow-md transition">
                   <div>
                     <div className="flex justify-between items-start mb-2">
                       <h4 className="font-bold text-slate-800 dark:text-white truncate" title={field.header}>
                         {field.header}
                         {field.required && <span className="text-red-500 ml-1">*</span>}
                       </h4>
                       <button 
                         type="button" 
                         onClick={() => setActiveConfigField(field)}
                         className="text-fuchsia-600 hover:text-fuchsia-800 dark:text-fuchsia-400 dark:hover:text-fuchsia-300 bg-fuchsia-100 dark:bg-fuchsia-900/30 p-1.5 rounded-md transition"
                         title="Configure"
                       >
                         ⚙️
                       </button>
                     </div>
                     <div className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                       Mode: <span className="font-semibold text-slate-700 dark:text-slate-300">{formatModeName(field.generationMode || 'FIXED')}</span>
                     </div>
                   </div>
                 </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-8 border-t border-slate-200 dark:border-slate-800 mt-8">
            <button type="submit" disabled={mutation.isPending} className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-fuchsia-500/30 transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none">
              {mutation.isPending ? 'Generating Dataset...' : 'Generate Listings'}
            </button>
          </div>
        </form>
      </div>

      {activeConfigField && (
        <FieldConfigDialog 
          field={activeConfigField} 
          onClose={() => setActiveConfigField(null)} 
        />
      )}
    </div>
  );
}
