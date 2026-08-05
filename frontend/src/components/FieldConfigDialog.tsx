import React, { useState, useEffect } from 'react';
import { useTemplateStore, type AnalyzedField } from '../store/useTemplateStore';

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

  const handleSave = () => {
    updateFieldConfig(field.colNumber, mode, config);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Configure Field</h2>
            <p className="text-fuchsia-600 dark:text-fuchsia-400 font-medium">{field.header}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Generation Mode</label>
            <select 
              value={mode} 
              onChange={(e) => handleModeChange(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-fuchsia-500 font-medium shadow-sm"
            >
              {MODES.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
            <p className="text-sm text-slate-500 mt-2">{MODES.find(m => m.id === mode)?.description}</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/30 p-6 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
            
            {mode === 'FIXED' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fixed Value</label>
                <input 
                  type="text" 
                  value={config.value || ''} 
                  onChange={e => setConfig({ ...config, value: e.target.value })}
                  placeholder="e.g. XYZ Brand"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-fuchsia-500" 
                />
              </div>
            )}

            {mode === 'RANDOMIZE' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Main Value</label>
                  <input 
                    type="number" 
                    value={config.mainValue || 0} 
                    onChange={e => setConfig({ ...config, mainValue: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-fuchsia-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Allowed Variation (±)</label>
                  <input 
                    type="number" 
                    value={config.variation || 0} 
                    onChange={e => setConfig({ ...config, variation: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-fuchsia-500" 
                  />
                </div>
                <div className="col-span-2 flex items-center mt-2">
                  <input 
                    type="checkbox" 
                    id="allowDecimal"
                    checked={!!config.allowDecimal} 
                    onChange={e => setConfig({ ...config, allowDecimal: e.target.checked })}
                    className="w-4 h-4 text-fuchsia-600 bg-slate-100 border-slate-300 rounded focus:ring-fuchsia-500" 
                  />
                  <label htmlFor="allowDecimal" className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">Allow Decimals (e.g. 301.25)</label>
                </div>
              </div>
            )}

            {mode === 'VALUE_POOL' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Comma Separated Values</label>
                <textarea 
                  rows={4}
                  value={config.pool || ''} 
                  onChange={e => setConfig({ ...config, pool: e.target.value })}
                  placeholder="e.g. Black, Blue, Green, Red, White"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-fuchsia-500 resize-none" 
                />
              </div>
            )}

            {mode === 'WORD_COMBO' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Word List (Comma Separated)</label>
                  <textarea 
                    rows={3}
                    value={config.words || ''} 
                    onChange={e => setConfig({ ...config, words: e.target.value })}
                    placeholder="e.g. Traditional, Temple, Oxidised, Necklace"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-fuchsia-500 resize-none" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Min Words</label>
                    <input 
                      type="number" min={1}
                      value={config.minWords || 1} 
                      onChange={e => setConfig({ ...config, minWords: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-fuchsia-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Max Words</label>
                    <input 
                      type="number" min={1}
                      value={config.maxWords || 3} 
                      onChange={e => setConfig({ ...config, maxWords: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-fuchsia-500" 
                    />
                  </div>
                </div>
              </div>
            )}

            {mode === 'AUTO_INCREMENT' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Prefix</label>
                  <input 
                    type="text" 
                    value={config.prefix || ''} 
                    onChange={e => setConfig({ ...config, prefix: e.target.value })}
                    placeholder="e.g. SKU-"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-fuchsia-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Starting Number</label>
                  <input 
                    type="number" 
                    value={config.startNumber || 1} 
                    onChange={e => setConfig({ ...config, startNumber: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-fuchsia-500" 
                  />
                </div>
              </div>
            )}

            {mode === 'AI' && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="font-semibold text-sm flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Future Implementation
                  </p>
                  <p className="text-xs mt-1">This module is architected for LLM integration. Data generation will currently return placeholder stubs.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sample / Base Text</label>
                  <textarea 
                    rows={2}
                    value={config.sample || ''} 
                    onChange={e => setConfig({ ...config, sample: e.target.value })}
                    placeholder="e.g. Premium Cotton Round Neck T-Shirt"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-fuchsia-500 resize-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Instructions</label>
                  <input 
                    type="text" 
                    value={config.instructions || ''} 
                    onChange={e => setConfig({ ...config, instructions: e.target.value })}
                    placeholder="e.g. Preserve meaning, focus, tone"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-fuchsia-500" 
                  />
                </div>
              </div>
            )}

            {mode === 'CUSTOM' && (
               <div className="p-4 bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 rounded-lg border border-orange-200 dark:border-orange-800 text-center">
                 Custom plugins and generators will be available here in the future.
               </div>
            )}

          </div>
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
