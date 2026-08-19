import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PromptGenerator } from '../services/promptGenerator';

interface RestrictedWordsConfig {
  baseWords: string[];
  userWords: string[];
}

const DEFAULT_BASE_WORDS = ['Elegant', 'Care', 'Essentials', 'Honey', 'Everyday', 'Simple'];

export default function Prompts() {
  const [config, setConfig] = useState<RestrictedWordsConfig>({
    baseWords: DEFAULT_BASE_WORDS,
    userWords: []
  });
  const [newWord, setNewWord] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDescription, setCopiedDescription] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await api.getConfigByName('restricted_words');
      
      // If config exists, use it. Otherwise, save default.
      if (res.success && res.data) {
        setConfig(res.data);
      } else {
        await saveConfig({ baseWords: DEFAULT_BASE_WORDS, userWords: [] });
      }
    } catch (error: any) {
      // If not found or error, initialize it
      await saveConfig({ baseWords: DEFAULT_BASE_WORDS, userWords: [] });
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (newConfig: RestrictedWordsConfig) => {
    try {
      await api.saveConfig({ name: 'restricted_words', configData: newConfig });
      setConfig(newConfig);
    } catch (error) {
      console.error('Failed to save config', error);
    }
  };

  const normalizeWord = (word: string) => word.trim().toLowerCase();

  const handleAddWord = async () => {
    if (!newWord.trim()) return;
    
    const normalizedNew = normalizeWord(newWord);
    
    // Prevent duplicates (case-insensitive)
    const isDuplicate = [...config.baseWords, ...config.userWords]
      .some(w => normalizeWord(w) === normalizedNew);
      
    if (!isDuplicate) {
      const updatedConfig = {
        ...config,
        userWords: [...config.userWords, newWord.trim()]
      };
      await saveConfig(updatedConfig);
    }
    
    setNewWord('');
  };

  const handleRemoveWord = async (wordToRemove: string) => {
    const updatedConfig = {
      ...config,
      userWords: config.userWords.filter(w => w !== wordToRemove)
    };
    await saveConfig(updatedConfig);
  };

  const combinedWords = [...config.baseWords, ...config.userWords];
  
  const titlePrompt = PromptGenerator.generateTitlePrompt({ restrictedWords: combinedWords });
  const descriptionPrompt = PromptGenerator.generateDescriptionPrompt({ restrictedWords: combinedWords });

  const copyToClipboard = (text: string, type: 'title' | 'description') => {
    navigator.clipboard.writeText(text);
    if (type === 'title') {
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    } else {
      setCopiedDescription(true);
      setTimeout(() => setCopiedDescription(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-[#1c1950]">AI Prompts Hub</h1>
        <p className="text-slate-500 mt-2">Generate perfect, marketplace-compliant prompts for your AI workflows.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-[#1c1950] mb-4">Restricted Words Configuration</h2>
        <p className="text-sm text-slate-500 mb-6">
          Words listed here will be dynamically injected into your AI prompts to ensure complete compliance. 
          Base words are locked, but you can add dynamic words below.
        </p>

        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddWord()}
              placeholder="Add restricted word..."
              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
            />
            <button
              onClick={handleAddWord}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Add Word
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Base Words (Locked) */}
          {config.baseWords.map((word, index) => (
            <div key={`base-${index}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full border border-slate-200 text-sm font-medium">
              <span>{word}</span>
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          ))}

          {/* User Words */}
          {config.userWords.map((word, index) => (
            <div key={`user-${index}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-full border border-rose-200 text-sm font-medium">
              <span>{word}</span>
              <button 
                onClick={() => handleRemoveWord(word)}
                className="hover:bg-rose-200 rounded-full p-0.5 transition-colors"
                title="Remove word"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title Prompt Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#1c1950]">Title Prompt</h2>
            <button
              onClick={() => copyToClipboard(titlePrompt, 'title')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                copiedTitle 
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100'
              }`}
            >
              {copiedTitle ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy Prompt
                </>
              )}
            </button>
          </div>
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-y-auto max-h-80">
            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">
              {titlePrompt}
            </pre>
          </div>
        </div>

        {/* Description Prompt Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#1c1950]">Description Prompt</h2>
            <button
              onClick={() => copyToClipboard(descriptionPrompt, 'description')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                copiedDescription 
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100'
              }`}
            >
              {copiedDescription ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy Prompt
                </>
              )}
            </button>
          </div>
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-y-auto max-h-80">
            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">
              {descriptionPrompt}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
