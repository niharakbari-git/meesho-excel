const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = {
  getProfile: async () => {
    const res = await fetch(`${BASE_URL}/profile`);
    return res.json();
  },
  saveProfile: async (data: any) => {
    const res = await fetch(`${BASE_URL}/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  uploadTemplate: async (file: File) => {
    const formData = new FormData();
    formData.append('template', file);
    const res = await fetch(`${BASE_URL}/template/upload`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  },
  generateListings: async (payload: any) => {
    const res = await fetch(`${BASE_URL}/generator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  exportListings: async (payload: any) => {
    const res = await fetch(`${BASE_URL}/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  getHistory: async () => {
    const res = await fetch(`${BASE_URL}/history`);
    return res.json();
  },
  getHistoryProfile: async (id: number) => {
    const res = await fetch(`${BASE_URL}/history/profile/${id}`);
    return res.json();
  },
  downloadHistoryFile: (id: number) => {
    window.location.href = `${BASE_URL}/history/download/${id}`;
  },
  saveConfig: async (payload: { name: string; configData: any }) => {
    const res = await fetch(`${BASE_URL}/configs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  getConfigs: async () => {
    const res = await fetch(`${BASE_URL}/configs`);
    return res.json();
  },
  getConfigByName: async (name: string) => {
    const res = await fetch(`${BASE_URL}/configs/${encodeURIComponent(name)}`);
    return res.json();
  },
  getPresets: async () => {
    const res = await fetch(`${BASE_URL}/presets`);
    return res.json();
  },
  savePreset: async (payload: { fieldName: string; fieldValue: string }) => {
    const res = await fetch(`${BASE_URL}/presets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  }
};
