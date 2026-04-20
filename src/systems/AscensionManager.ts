import {
  ASCENSION_CHARGE_PER_ORB, ASCENSION_DURATION, ASCENSION_SCORE_MULTIPLIER,
} from '../utils/Constants';
import { Player } from '../entities/Player';
import { ScoreManager } from './ScoreManager';

export class AscensionManager {
  charge = 0;
  isActive = false;
  private player: Player;
  private scoreManager: ScoreManager;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, player: Player, scoreManager: ScoreManager) {
    this.scene = scene;
    this.player = player;
    this.scoreManager = scoreManager;
  }

  addCharge(amount: number = ASCENSION_CHARGE_PER_ORB): void {
    if (this.isActive) return;
    this.charge = Math.min(100, this.charge + amount);

    if (this.charge >= 100) {
      this.activate();
    }
  }

  private activate(): void {
    this.isActive = true;
    this.charge = 100;
    this.player.activateAscension();
    this.scoreManager.setMultiplier(ASCENSION_SCORE_MULTIPLIER);

    // Camera flash
    this.scene.cameras.main.flash(300, 255, 215, 0);

    this.scene.time.delayedCall(ASCENSION_DURATION, () => {
      this.deactivate();
    });
  }

  private deactivate(): void {
    this.isActive = false;
    this.charge = 0;
    this.player.deactivateAscension();
    this.scoreManager.setMultiplier(1);
  }

  destroy(): void {
    if (this.timer) clearTimeout(this.timer);
  }
}
