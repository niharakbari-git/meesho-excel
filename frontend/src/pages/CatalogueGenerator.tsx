import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { useTemplateStore, type AnalyzedField } from '../store/useTemplateStore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FieldConfigDialog } from '../components/FieldConfigDialog';

export default function CatalogueGenerator() {
  const fields = useTemplateStore(s => s.fields);
  const filePath = useTemplateStore(s => s.filePath);
  const generationMode = useTemplateStore(s => s.generationMode);
  const setGenerationMode = useTemplateStore(s => s.setGenerationMode);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const applySavedProfile = useTemplateStore(s => s.applySavedProfile);
  
  const { data: configsData } = useQuery({
    queryKey: ['configs'],
    queryFn: api.getConfigs
  });
  const configs = configsData?.data || [];
  
  const [activeConfigField, setActiveConfigField] = useState<AnalyzedField | null>(null);

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      count: 10,
      skuPrefix: '',
      startSku: 1,
      basePrice: 0,
      priceVariation: 0,
      keywords: '',
      imageUrls: '',
      adjectivePool: ''
    }
  });

  // Removed unused count variable
  const imageUrlsStr = watch('imageUrls') || '';
  const parsedImageUrls = imageUrlsStr.split(',').map(s => s.trim()).filter(Boolean);

  const handleSaveProfile = async () => {
    const name = window.prompt("Enter a name for this Settings Profile:");
    if (!name) return;
    
    const configData = {
      profile: {
        mode: generationMode,
        identityStrategy: 'UNIQUE_NAME',
        adjectivePool: (watch('adjectivePool') || '').split(',').map((s: string) => s.trim()).filter(Boolean)
      },
      fields: fields,
      globalSettings: watch()
    };
    
    try {
      const res = await api.saveConfig({ name, configData });
      if (res.success) {
        alert("Profile saved successfully!");
        queryClient.invalidateQueries({ queryKey: ['configs'] });
      } else {
        alert("Failed to save profile: " + res.message);
      }
    } catch(e: any) {
      alert("Error: " + e.message);
    }
  };

  const handleLoadProfile = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    if (!name) return;
    
    try {
      const res = await api.getConfigByName(name);
      if (res.success && res.data) {
        const data = res.data;
        if (data.globalSettings) {
           Object.keys(data.globalSettings).forEach(k => {
             setValue(k as any, data.globalSettings[k]);
           });
        }
        if (data.profile?.mode) {
           applySavedProfile(data.fields || [], data.profile.mode);
        }
        alert("Profile loaded successfully!");
      }
    } catch(e: any) {
      alert("Error loading profile: " + e.message);
    }
    e.target.value = '';
  };

  const mutation = useMutation({
    mutationFn: (data: any) => api.generateListings({ 
      fields, 
      count: data.count, 
      globalSettings: data,
      profile: {
        mode: generationMode,
        identityStrategy: 'UNIQUE_NAME',
        adjectivePool: (data.adjectivePool || '').split(',').map((s: string) => s.trim()).filter(Boolean)
      }
    }),
    onSuccess: (res, variables) => {
      navigate('/preview', { state: { rows: res.data, validation: res.validation, profile: res.profile, filePath, fields, globalSettings: variables } });
    }
  });

  if (fields.length === 0) {
    return <div className="text-center p-20 text-slate-500 font-medium text-lg">No template loaded. Go to Import Template first.</div>;
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

  const isConfigured = (field: AnalyzedField) => {
    return field.isCustomConfig === true;
  };

  const renderConfigSummary = (field: AnalyzedField) => {
    if (!isConfigured(field)) {
      return (
        <div className="mt-4 pt-4 border-t border-slate-100">
           <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-50 text-slate-500 text-xs font-semibold">
             <span className="w-2 h-2 rounded-full bg-slate-300"></span>
             <span>Uses Global/Default</span>
           </div>
        </div>
      );
    }
    
    const c = field.configuration;
    let summary = '';
    switch (field.generationMode) {
      case 'FIXED': summary = `Value: ${c.value}`; break;
      case 'RANDOMIZE': summary = `Base: ${c.mainValue} (±${c.variation})`; break;
      case 'VALUE_POOL': summary = `Pool: ${c.pool?.substring(0, 25)}${c.pool?.length > 25 ? '...' : ''}`; break;
      case 'WORD_COMBO': summary = `Words: ${c.words?.substring(0, 25)}${c.words?.length > 25 ? '...' : ''}`; break;
      case 'AUTO_INCREMENT': summary = `Starts at: ${c.prefix}${c.startNumber}`; break;
      case 'AI': summary = `Sample: ${c.sample?.substring(0, 25)}${c.sample?.length > 25 ? '...' : ''}`; break;
      default: summary = 'Configured';
    }
  
    return (
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          <span>Configured</span>
        </div>
        <p className="text-sm text-slate-600 font-medium truncate" title={summary}>
          {summary}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-20">
      
      <div className="flex flex-col md:flex-row justify-between items-end mb-4">
        <div>
           <h2 className="text-3xl font-extrabold text-[#1c1950]">Catalogue Strategy & Generation</h2>
           <p className="text-slate-500 mt-2 font-medium">Configure generation modes, global settings, and generate controlled test batches.</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
           <select 
             className="bg-white border border-slate-200 text-slate-700 rounded-xl px-4 py-2 font-medium focus:outline-none focus:border-indigo-500 shadow-sm"
             onChange={handleLoadProfile}
             defaultValue=""
           >
             <option value="" disabled>Load Saved Profile...</option>
             {configs.map((c: any) => (
               <option key={c.id} value={c.name}>{c.name}</option>
             ))}
           </select>
           
           <button 
             type="button" 
             onClick={handleSaveProfile}
             className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2.5 px-5 rounded-xl border border-indigo-200 transition shadow-sm whitespace-nowrap"
           >
             Save Profile As...
           </button>
        </div>
      </div>

      <form className="space-y-10">
        
        {/* Strategy Profile Selection */}
        <div className="glass-card p-8 bg-gradient-to-br from-indigo-50/50 to-white border-indigo-100">
          <h3 className="text-xl font-bold text-[#1c1950] mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            Generation Mode Profile
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button 
              type="button"
              onClick={() => setGenerationMode('INDEPENDENT_LISTING')}
              className={`p-5 rounded-2xl border-2 text-left transition ${generationMode === 'INDEPENDENT_LISTING' ? 'border-indigo-600 bg-indigo-50/80 shadow-md shadow-indigo-600/10' : 'border-slate-200 bg-white hover:border-indigo-300'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className={`font-bold text-lg ${generationMode === 'INDEPENDENT_LISTING' ? 'text-indigo-900' : 'text-slate-700'}`}>Independent Listings</h4>
                {generationMode === 'INDEPENDENT_LISTING' && <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center"><svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>}
              </div>
              <p className="text-sm font-medium text-slate-500">Every row is treated as a completely separate product. Unique names are enforced using the Adjective Pool.</p>
            </button>
            
            <button 
              type="button"
              onClick={() => setGenerationMode('VARIATION_MODE')}
              className={`p-5 rounded-2xl border-2 text-left transition ${generationMode === 'VARIATION_MODE' ? 'border-indigo-600 bg-indigo-50/80 shadow-md shadow-indigo-600/10' : 'border-slate-200 bg-white hover:border-indigo-300'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className={`font-bold text-lg ${generationMode === 'VARIATION_MODE' ? 'text-indigo-900' : 'text-slate-700'}`}>Variation Mode</h4>
                {generationMode === 'VARIATION_MODE' && <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center"><svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>}
              </div>
              <p className="text-sm font-medium text-slate-500">All rows are variations of the FIRST row. Names, descriptions, and images will be identical across rows.</p>
            </button>
          </div>
          
          {generationMode === 'INDEPENDENT_LISTING' && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
              <label className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 block">Identity Strategy: Unique Adjective Pool</label>
              <p className="text-xs font-medium text-slate-500 mb-3">These words will be prepended to the Product Name to ensure Meesho treats each row as a distinct product.</p>
              <textarea rows={2} {...register('adjectivePool')} placeholder="e.g. Traditional, Classic, Premium..." className="w-full px-4 py-3 border-2 border-indigo-100 rounded-xl bg-white outline-none text-[#1c1950] font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-none" />
            </div>
          )}
        </div>

        {/* Global Settings Block */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold text-[#1c1950] mb-6">Global Defaults & Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Rows</label>
               <input type="number" {...register('count', { valueAsNumber: true })} className="px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 outline-none text-[#1c1950] font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
            </div>
            
            <div className="flex flex-col">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">SKU Prefix</label>
               <input type="text" {...register('skuPrefix')} placeholder="e.g. MS-JEWEL-" className="px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 outline-none text-[#1c1950] font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
            </div>

            <div className="flex flex-col">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Starting SKU Num</label>
               <input type="number" {...register('startSku', { valueAsNumber: true })} className="px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 outline-none text-[#1c1950] font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
            </div>

            <div className="flex flex-col">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Base Price (₹)</label>
               <input type="number" {...register('basePrice', { valueAsNumber: true })} className="px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 outline-none text-[#1c1950] font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
            </div>

            <div className="flex flex-col">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Price Variation (±₹)</label>
               <input type="number" {...register('priceVariation', { valueAsNumber: true })} className="px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 outline-none text-[#1c1950] font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
            </div>

            <div className="flex flex-col lg:col-span-3">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Keywords (Word Combo)</label>
               <input type="text" {...register('keywords')} placeholder="e.g. Elegant, Traditional, Modern, Gold, Silver" className="px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 outline-none text-[#1c1950] font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
            </div>
          </div>
          
          <div className="mt-6">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Image URLs (Comma Separated)</label>
             <textarea rows={3} {...register('imageUrls')} placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg..." className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 outline-none text-[#1c1950] font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-none" />
          </div>
        </div>

        {/* Image Preview Gallery */}
        {parsedImageUrls.length > 0 && (
          <div className="glass-card p-8 bg-indigo-50/30">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-[#1c1950]">Image URL Preview</h3>
               <span className="text-sm font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">{parsedImageUrls.length} images provided</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {parsedImageUrls.map((url, i) => (
                <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                   <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x400/f8f7fb/64748b?text=Invalid+Image')} />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <span className="text-xs font-bold text-white bg-black/50 px-2 py-1 rounded-lg backdrop-blur-md">URL {i+1}</span>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Field Generators */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold text-[#1c1950] mb-8">Field Specific Configurations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map(field => {
               const configured = isConfigured(field);
               return (
               <div key={field.colNumber} className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${configured ? 'border-indigo-200 bg-indigo-50/10 shadow-[0_4px_20px_rgb(99,102,241,0.05)]' : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'}`}>
                 <div>
                   <div className="flex justify-between items-start mb-3">
                     <h4 className="font-extrabold text-[#1c1950] text-lg leading-tight truncate pr-2" title={field.header}>
                       {field.header}
                       {field.required && <span className="text-rose-500 ml-1 text-base">*</span>}
                     </h4>
                     <button 
                       type="button" 
                       onClick={() => setActiveConfigField(field)}
                       className={`p-2.5 rounded-xl transition-all shadow-sm flex-shrink-0 border-2 ${configured ? 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200 border-indigo-200 hover:border-indigo-300 shadow-indigo-100/50' : 'text-slate-400 bg-slate-50 hover:bg-white hover:text-indigo-600 border-slate-100 hover:border-indigo-100 hover:shadow-md'}`}
                       title="Configure field"
                     >
                       <svg className="w-5 h-5" fill={configured ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={configured ? 1.5 : 2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={configured ? 1.5 : 2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                       </svg>
                     </button>
                   </div>
                   <div className="text-sm font-medium text-slate-500 flex items-center">
                     <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded mr-2">{field.fieldType}</span>
                     {formatModeName(field.generationMode || 'FIXED')}
                   </div>
                   {renderConfigSummary(field)}
                 </div>
               </div>
            )})}
          </div>
        </div>

        <div className="flex justify-end pt-4 sticky bottom-6 z-10">
          <div className="bg-white/80 backdrop-blur-xl p-4 rounded-3xl shadow-[0_10px_40px_rgb(0,0,0,0.08)] border border-white flex space-x-4">
            
            <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase px-2">Test Batch:</span>
              {[5, 10, 20].map(size => (
                <button 
                  key={size}
                  type="button" 
                  disabled={mutation.isPending}
                  onClick={handleSubmit((d) => {
                     d.count = size; // Override count for test batch
                     setValue('count', size);
                     mutation.mutate(d);
                  })}
                  className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-2 px-4 rounded-xl transition-all disabled:opacity-50"
                  title={`Run exactly same pipeline for ${size} rows`}
                >
                  {size} Rows
                </button>
              ))}
            </div>

            <button 
              type="button" 
              onClick={handleSubmit((d) => mutation.mutate(d))}
              disabled={mutation.isPending} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-2xl shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none flex items-center space-x-2"
            >
              <span>{mutation.isPending ? 'Validating...' : `Generate Full Catalogue`}</span>
              {!mutation.isPending && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
            </button>
          </div>
        </div>
      </form>

      {activeConfigField && (
        <FieldConfigDialog 
          field={activeConfigField} 
          onClose={() => setActiveConfigField(null)} 
        />
      )}
    </div>
  );
}
