/**
 * This service simulates a Node.js/Express backend API.
 * In a real application, these methods would use fetch() or axios to call your Node.js server.
 */

// The URL where your Node.js server will be hosted (e.g., on Render)
// @ts-ignore
const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';
const STORAGE_KEY = 'ruthy_backend_db';

export const backendService = {
  // Check Backend + Aiven Health
  checkConnection: async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      return await response.json();
    } catch (error) {
      return { status: 'offline' };
    }
  },

  // GET Data from Node.js -> Aiven
  getSiteData: async () => {
    try {
      const response = await fetch(`${API_URL}/data`);
      if (!response.ok) throw new Error('Backend not reached');
      return await response.json();
    } catch (error) {
      console.warn('Backend offline, using local storage fallback');
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    }
  },

  // POST Data to Node.js -> Aiven
  saveSiteData: async (data: any) => {
    try {
      const response = await fetch(`${API_URL}/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); // Keep local sync
      return await response.json();
    } catch (error) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return { success: true, localOnly: true };
    }
  },

  uploadImage: async (base64: string) => {
    // In a production app, you'd upload this to Cloudinary or S3 via Node.js
    return { url: base64 };
  }
};
