import Phaser from 'phaser';
import { COLORS, GAME_WIDTH } from '../utils/Constants';
import { ScoreManager } from '../systems/ScoreManager';
import { CorruptionMeter } from '../systems/CorruptionMeter';
import { AscensionManager } from '../systems/AscensionManager';

export class HUD {
  private scoreText: Phaser.GameObjects.Text;
  private orbText: Phaser.GameObjects.Text;
  private healthText: Phaser.GameObjects.Text;
  private corruptionBar: Phaser.GameObjects.Graphics;
  private ascensionBar: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.scoreText = scene.add.text(16, 12, 'Score: 0', {
      fontSize: '18px',
      color: COLORS.UI_TEXT,
      fontFamily: 'monospace',
    }).setScrollFactor(0).setDepth(100);

    this.orbText = scene.add.text(16, 36, 'Orbs: 0', {
      fontSize: '14px',
      color: COLORS.UI_ACCENT,
      fontFamily: 'monospace',
    }).setScrollFactor(0).setDepth(100);

    this.healthText = scene.add.text(GAME_WIDTH - 16, 12, 'HP: 3', {
      fontSize: '18px',
      color: COLORS.UI_DANGER,
      fontFamily: 'monospace',
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

    // Corruption meter bar
    this.corruptionBar = scene.add.graphics().setScrollFactor(0).setDepth(100);

    // Ascension charge bar
    this.ascensionBar = scene.add.graphics().setScrollFactor(0).setDepth(100);
  }

  update(
    scoreManager: ScoreManager,
    health: number,
    corruption: CorruptionMeter,
    ascension: AscensionManager,
  ): void {
    this.scoreText.setText(`Score: ${scoreManager.score}`);
    this.orbText.setText(`Orbs: ${scoreManager.orbs}`);
    this.healthText.setText(`HP: ${'♥'.repeat(Math.max(0, health))}`);

    // Corruption bar (top center)
    const barW = 200;
    const barH = 8;
    const barX = GAME_WIDTH / 2 - barW / 2;
    const barY = 14;

    this.corruptionBar.clear();
    this.corruptionBar.fillStyle(0x222222, 1);
    this.corruptionBar.fillRect(barX, barY, barW, barH);
    this.corruptionBar.fillStyle(0xffd700, 1);
    this.corruptionBar.fillRect(barX, barY, barW * corruption.normalized, barH);

    // Ascension bar (below corruption)
    const ascBarY = barY + barH + 4;
    this.ascensionBar.clear();
    this.ascensionBar.fillStyle(0x222222, 1);
    this.ascensionBar.fillRect(barX, ascBarY, barW, barH);
    const ascColor = ascension.isActive ? 0xffffff : 0x00ccff;
    this.ascensionBar.fillStyle(ascColor, 1);
    this.ascensionBar.fillRect(barX, ascBarY, barW * (ascension.charge / 100), barH);
  }
}
