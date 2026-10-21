import { SavedRoastRecord } from '../types';

const VAULT_STORAGE_KEY = 'roast_thermodynamics_vault_v1';

export function getSavedRoasts(): SavedRoastRecord[] {
  try {
    const raw = localStorage.getItem(VAULT_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load saved roasts:', err);
    return [];
  }
}

export function saveRoastRecord(record: SavedRoastRecord): boolean {
  try {
    const current = getSavedRoasts();
    const existingIndex = current.findIndex((r) => r.id === record.id);
    if (existingIndex >= 0) {
      current[existingIndex] = record;
    } else {
      current.unshift(record);
    }
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(current));
    return true;
  } catch (err) {
    console.error('Failed to save roast record:', err);
    return false;
  }
}

export function deleteRoastRecord(id: string): boolean {
  try {
    const current = getSavedRoasts();
    const filtered = current.filter((r) => r.id !== id);
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('Failed to delete roast record:', err);
    return false;
  }
}
