import React, { useState, useEffect } from 'react';
import { useTemplateStore, type AnalyzedField } from '../store/useTemplateStore';
import { api } from '../services/api';

interface FieldConfigDialogProps {
  field: AnalyzedField;
  onClose: () => void;
}

const MODES = [
  { id: 'FIXED', label: 'Fixed Value', description: 'Use exactly the same value in every generated row.' },
  { id: 'RANDOMIZE', label: 'Randomize Around Value', description: 'Generate numeric values around a center value.' },
  { id: 'VALUE_POOL', label: 'Comma Separated Value Pool', description: 'Randomly choose one value from a list.' },
  { id: 'WORD_COMBO', label: 'Word Combination Generator', description: 'Randomly combine words from a list.' },
  { id: 'AUTO_INCREMENT', label: 'Auto Increment', description: 'Sequential numbers with a prefix.' },
  { id: 'AI', label: 'AI Generation', description: 'Use AI to generate content (Coming Soon).' },
  { id: 'CUSTOM', label: 'Custom Generator', description: 'Custom logic plugin (Coming Soon).' },
];

export const FieldConfigDialog: React.FC<FieldConfigDialogProps> = ({ field, onClose }) => {
  const updateFieldConfig = useTemplateStore(s => s.updateFieldConfig);
  
  const [mode, setMode] = useState(field.generationMode || 'FIXED');
  const [config, setConfig] = useState<any>(field.configuration || {});
  const [saveGlobalPreset, setSaveGlobalPreset] = useState(false);

  // Reset config when mode changes
  const handleModeChange = (newMode: string) => {
    setMode(newMode);
    switch (newMode) {
      case 'FIXED': setConfig({ value: '' }); break;
      case 'RANDOMIZE': setConfig({ mainValue: 100, variation: 20, allowDecimal: false }); break;
      case 'VALUE_POOL': setConfig({ pool: '' }); break;
      case 'WORD_COMBO': setConfig({ words: '', minWords: 1, maxWords: 3 }); break;
      case 'AUTO_INCREMENT': setConfig({ prefix: '', startNumber: 1 }); break;
      case 'AI': setConfig({ sample: '', instructions: '' }); break;
      case 'CUSTOM': setConfig({}); break;
      default: setConfig({});
    }
  };

  const handleSave = async () => {
    updateFieldConfig(field.colNumber, mode, config);
    
    if (mode === 'FIXED' && saveGlobalPreset && config.value) {
      try {
        await api.savePreset({ fieldName: field.header, fieldValue: config.value });
      } catch (err) {
        console.error('Failed to save global preset', err);
      }
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c1950]/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-extrabold text-[#1c1950]">Configure Field</h2>
            <p className="text-indigo-600 font-semibold">{field.header}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition bg-white p-2 rounded-xl shadow-sm border border-slate-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto flex-1 space-y-8">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Generation Mode</label>
            <select 
              value={mode} 
              onChange={(e) => handleModeChange(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-[#1c1950] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-semibold transition cursor-pointer"
            >
              {MODES.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
            <p className="text-sm font-medium text-slate-500 mt-2 ml-1">{MODES.find(m => m.id === mode)?.description}</p>
          </div>

          <div className="bg-[#f8f7fb] p-6 rounded-2xl border border-slate-100 space-y-5">
            
            {mode === 'FIXED' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fixed Value</label>
                  <input 
                    type="text" 
                    value={config.value || ''} 
                    onChange={e => setConfig({ ...config, value: e.target.value })}
                    placeholder="e.g. XYZ Brand"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-[#1c1950] font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" 
                  />
                </div>
                <div className="flex items-center bg-white p-4 rounded-xl border border-slate-200">
                  <input 
                    type="checkbox" 
                    id="saveGlobalPreset"
                    checked={saveGlobalPreset} 
                    onChange={e => setSaveGlobalPreset(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 bg-slate-100 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer" 
                  />
                  <div className="ml-3">
                    <label htmlFor="saveGlobalPreset" className="text-sm font-semibold text-[#1c1950] cursor-pointer block">Save as default for future imports</label>
                    <span className="text-xs text-slate-500">This exact value will be automatically applied whenever you import a column named "{field.header}".</span>
                  </div>
                </div>
              </div>
            )}

            {mode === 'RANDOMIZE' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Main Value</label>
                  <input 
                    type="number" 
                    value={config.mainValue || 0} 
                    onChange={e => setConfig({ ...config, mainValue: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-[#1c1950] font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Allowed Variation (±)</label>
                  <input 
                    type="number" 
                    value={config.variation || 0} 
                    onChange={e => setConfig({ ...config, variation: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-[#1c1950] font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" 
                  />
                </div>
                <div className="col-span-2 flex flex-col space-y-3 mt-2 bg-white p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="allowDecimal"
                      checked={!!config.allowDecimal} 
                      onChange={e => setConfig({ ...config, allowDecimal: e.target.checked })}
                      className="w-5 h-5 text-indigo-600 bg-slate-100 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer" 
                    />
                    <label htmlFor="allowDecimal" className="ml-3 text-sm font-semibold text-[#1c1950] cursor-pointer">Allow Decimals (e.g. 301.25)</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="uniqueRandom"
                      checked={!!config.unique} 
                      onChange={e => setConfig({ ...config, unique: e.target.checked })}
                      className="w-5 h-5 text-indigo-600 bg-slate-100 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer" 
                    />
                    <label htmlFor="uniqueRandom" className="ml-3 text-sm font-semibold text-[#1c1950] cursor-pointer">Generate Unique Numbers (No Repetitions)</label>
                  </div>
                </div>
              </div>
            )}

            {mode === 'VALUE_POOL' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Comma Separated Values</label>
                  <textarea 
                    rows={4}
                    value={config.pool || ''} 
                    onChange={e => setConfig({ ...config, pool: e.target.value })}
                    placeholder="e.g. Black, Blue, Green, Red, White"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-[#1c1950] font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-none" 
                  />
                </div>
                <div className="flex items-center bg-white p-4 rounded-xl border border-slate-200">
                  <input 
                    type="checkbox" 
                    id="uniquePool"
                    checked={!!config.unique} 
                    onChange={e => setConfig({ ...config, unique: e.target.checked })}
                    className="w-5 h-5 text-indigo-600 bg-slate-100 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer" 
                  />
                  <div className="ml-3">
                    <label htmlFor="uniquePool" className="text-sm font-semibold text-[#1c1950] cursor-pointer block">Without Repetition</label>
                    <span className="text-xs text-slate-500">Pick items sequentially without repeating them randomly.</span>
                  </div>
                </div>
                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                  <h4 className="text-sm font-bold text-indigo-900 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Need help generating product details?
                  </h4>
                  <p className="text-xs text-indigo-800 mb-2 font-medium">Use this prompt in ChatGPT to quickly generate a comma-separated list of details:</p>
                  <div className="bg-white p-3 rounded-lg border border-indigo-100 text-xs text-slate-700 font-mono select-all">
                    Act as an e-commerce expert. I am listing [Product Type]. Generate a comma-separated list of 20 unique [Field Name] for these products. Do not include quotes, bullet points, or newlines. Just the comma-separated text.
                  </div>
                </div>
              </div>
            )}

            {mode === 'WORD_COMBO' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Word List (Comma Separated)</label>
                  <textarea 
                    rows={3}
                    value={config.words || ''} 
                    onChange={e => setConfig({ ...config, words: e.target.value })}
                    placeholder="e.g. Traditional, Temple, Oxidised, Necklace"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-[#1c1950] font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-none" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Min Words</label>
                    <input 
                      type="number" min={1}
                      value={config.minWords || 1} 
                      onChange={e => setConfig({ ...config, minWords: Number(e.target.value) })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-[#1c1950] font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Max Words</label>
                    <input 
                      type="number" min={1}
                      value={config.maxWords || 3} 
                      onChange={e => setConfig({ ...config, maxWords: Number(e.target.value) })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-[#1c1950] font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" 
                    />
                  </div>
                </div>
              </div>
            )}

            {mode === 'AUTO_INCREMENT' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Prefix</label>
                  <input 
                    type="text" 
                    value={config.prefix || ''} 
                    onChange={e => setConfig({ ...config, prefix: e.target.value })}
                    placeholder="e.g. SKU-"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-[#1c1950] font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Starting Number</label>
                  <input 
                    type="number" 
                    value={config.startNumber || 1} 
                    onChange={e => setConfig({ ...config, startNumber: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-[#1c1950] font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" 
                  />
                </div>
              </div>
            )}

            {mode === 'AI' && (
              <div className="space-y-4">
                <div className="p-4 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100">
                  <p className="font-bold text-sm flex items-center mb-1">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Future Implementation
                  </p>
                  <p className="text-xs font-medium">This module is architected for LLM integration. Data generation will currently return placeholder stubs.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sample / Base Text</label>
                  <textarea 
                    rows={2}
                    value={config.sample || ''} 
                    onChange={e => setConfig({ ...config, sample: e.target.value })}
                    placeholder="e.g. Premium Cotton Round Neck T-Shirt"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-[#1c1950] font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Instructions</label>
                  <input 
                    type="text" 
                    value={config.instructions || ''} 
                    onChange={e => setConfig({ ...config, instructions: e.target.value })}
                    placeholder="e.g. Preserve meaning, focus, tone"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-[#1c1950] font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" 
                  />
                </div>
              </div>
            )}

            {mode === 'CUSTOM' && (
               <div className="p-4 bg-amber-50 text-amber-700 rounded-xl border border-amber-200 text-center font-semibold text-sm">
                 Custom plugins and generators will be available here in the future.
               </div>
            )}

          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-white flex justify-end space-x-4">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:text-[#1c1950] hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl font-bold shadow-md shadow-indigo-600/20 transition transform hover:-translate-y-0.5"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
