import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../utils/Constants';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' });
  }

  create(): void {
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'LIGHTBOUND', {
      fontSize: '32px',
      color: COLORS.UI_ACCENT,
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.time.delayedCall(500, () => {
      this.scene.start('Preload');
    });
  }
}
