import {
  CORRUPTION_DECAY_RATE, CORRUPTION_ORB_GAIN, CORRUPTION_MAX,
} from '../utils/Constants';

export class CorruptionMeter {
  value = 0; // 0 = fully corrupt, 100 = fully purified
  private decayRate: number;

  constructor(purificationLevel: number) {
    // Higher purification upgrade = slower decay
    this.decayRate = CORRUPTION_DECAY_RATE * (1 - purificationLevel * 0.12);
  }

  update(delta: number): void {
    this.value = Math.max(0, this.value - this.decayRate * delta / 1000);
  }

  addLight(amount: number = CORRUPTION_ORB_GAIN): void {
    this.value = Math.min(CORRUPTION_MAX, this.value + amount);
  }

  /** Returns 0-1 representing purification progress */
  get normalized(): number {
    return this.value / CORRUPTION_MAX;
  }

  /** Returns interpolated tint color from corrupt (purple-dark) to purified (golden) */
  getTint(): number {
    const t = this.normalized;
    // Interpolate from deep purple (0x1a0a2e) toward warm gold (0x3d2a1a)
    const r = Math.floor(0x1a + (0x3d - 0x1a) * t);
    const g = Math.floor(0x0a + (0x2a - 0x0a) * t);
    const b = Math.floor(0x2e + (0x1a - 0x2e) * t);
    return (r << 16) | (g << 8) | b;
  }
}
