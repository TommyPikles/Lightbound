// Game dimensions (portrait 9:16)
export const GAME_WIDTH = 540;
export const GAME_HEIGHT = 960;

// Lane positions (X coordinates — left, center, right)
export const LANES = [110, 270, 430] as const;
export const LANE_COUNT = LANES.length;

// Player
export const PLAYER_Y = 800; // near bottom of screen
export const PLAYER_WIDTH = 40;
export const PLAYER_HEIGHT = 60;
export const LANE_SWITCH_DURATION = 150; // ms

// World scroll (downward)
export const BASE_SCROLL_SPEED = 300;
export const SPEED_INCREMENT = 0.5; // per second of gameplay

// Spawning (from top)
export const SPAWN_INTERVAL_BASE = 1200; // ms
export const SPAWN_INTERVAL_MIN = 400;   // ms (fastest it gets)
export const SPAWN_Y = -50;              // spawn off-screen top

// Light orbs
export const ORB_SIZE = 20;
export const ORB_VALUES = [1, 2, 3] as const;

// Enemies
export const ENEMY_WIDTH = 36;
export const ENEMY_HEIGHT = 50;

// Obstacles
export const OBSTACLE_WIDTH = 50;
export const OBSTACLE_HEIGHT = 50;

// Corruption meter
export const CORRUPTION_DECAY_RATE = 2;   // per second
export const CORRUPTION_ORB_GAIN = 5;     // per orb collected
export const CORRUPTION_MAX = 100;

// Ascension
export const ASCENSION_CHARGE_PER_ORB = 8;
export const ASCENSION_DURATION = 6000;   // ms
export const ASCENSION_SCORE_MULTIPLIER = 2;

// Upgrades
export const UPGRADE_COSTS = [50, 150, 400, 800, 1500] as const;
export const UPGRADE_MAX_LEVEL = 5;

// Colors
export const COLORS = {
  PLAYER: 0x00ccff,
  PLAYER_ASCENDED: 0xffd700,
  ORB: 0xffd700,
  ENEMY: 0x8b00ff,
  OBSTACLE: 0x333333,
  CORRUPTION_DARK: 0x1a0a2e,
  CORRUPTION_LIGHT: 0x3d2a6e,
  PURIFIED: 0x2a1a0a,
  LANE_LINE: 0x333355,
  UI_TEXT: '#ffffff',
  UI_ACCENT: '#ffd700',
  UI_DANGER: '#ff4444',
} as const;
