export class ScoreManager {
  distance = 0;
  orbs = 0;
  private scoreMultiplier = 1;

  get score(): number {
    return Math.floor(this.distance) + this.orbs * 10;
  }

  updateDistance(delta: number, speed: number): void {
    this.distance += (speed * delta / 1000) * 0.1 * this.scoreMultiplier;
  }

  addOrbs(value: number): void {
    this.orbs += value;
  }

  setMultiplier(mult: number): void {
    this.scoreMultiplier = mult;
  }

  reset(): void {
    this.distance = 0;
    this.orbs = 0;
    this.scoreMultiplier = 1;
  }
}
