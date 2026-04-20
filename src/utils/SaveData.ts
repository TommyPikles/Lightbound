export interface Upgrades {
  speed: number;
  shield: number;
  purification: number;
  magnetism: number;
}

export interface SaveData {
  totalOrbs: number;
  upgrades: Upgrades;
  highScore: number;
  totalRuns: number;
}

const SAVE_KEY = 'lightbound_save';

const DEFAULT_SAVE: SaveData = {
  totalOrbs: 0,
  upgrades: { speed: 0, shield: 0, purification: 0, magnetism: 0 },
  highScore: 0,
  totalRuns: 0,
};

export function loadSave(): SaveData {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return { ...DEFAULT_SAVE, upgrades: { ...DEFAULT_SAVE.upgrades } };
  try {
    return JSON.parse(raw) as SaveData;
  } catch {
    return { ...DEFAULT_SAVE, upgrades: { ...DEFAULT_SAVE.upgrades } };
  }
}

export function writeSave(data: SaveData): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}
