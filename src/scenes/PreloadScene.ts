import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../utils/Constants';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Preload' });
  }

  preload(): void {
    // Progress bar
    const barWidth = 400;
    const barHeight = 20;
    const barX = (GAME_WIDTH - barWidth) / 2;
    const barY = GAME_HEIGHT / 2 + 30;

    const bg = this.add.graphics();
    bg.fillStyle(0x222222, 1);
    bg.fillRect(barX, barY, barWidth, barHeight);

    const fill = this.add.graphics();

    this.load.on('progress', (value: number) => {
      fill.clear();
      fill.fillStyle(0xffd700, 1);
      fill.fillRect(barX, barY, barWidth * value, barHeight);
    });

    this.add.text(GAME_WIDTH / 2, barY - 20, 'Loading...', {
      fontSize: '16px',
      color: COLORS.UI_TEXT,
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // No assets to load yet — generate textures in create()
    // This placeholder ensures the progress bar shows briefly
    this.load.image('__placeholder', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQABNjN9GQAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAA0lEQVQI12P4z8BQDwAEgAF/QualzQAAAABJRU5ErkJggg==');
  }

  create(): void {
    this.generateTextures();
    this.scene.start('MainMenu');
  }

  private generateTextures(): void {
    // Player rectangle
    const playerGfx = this.make.graphics({ x: 0, y: 0 });
    playerGfx.fillStyle(COLORS.PLAYER, 1);
    playerGfx.fillRoundedRect(0, 0, 40, 60, 8);
    playerGfx.generateTexture('player', 40, 60);
    playerGfx.destroy();

    // Player ascended
    const ascendedGfx = this.make.graphics({ x: 0, y: 0 });
    ascendedGfx.fillStyle(COLORS.PLAYER_ASCENDED, 1);
    ascendedGfx.fillRoundedRect(0, 0, 40, 60, 8);
    ascendedGfx.generateTexture('player_ascended', 40, 60);
    ascendedGfx.destroy();

    // Light orb circle
    const orbGfx = this.make.graphics({ x: 0, y: 0 });
    orbGfx.fillStyle(COLORS.ORB, 1);
    orbGfx.fillCircle(10, 10, 10);
    orbGfx.generateTexture('orb', 20, 20);
    orbGfx.destroy();

    // Enemy
    const enemyGfx = this.make.graphics({ x: 0, y: 0 });
    enemyGfx.fillStyle(COLORS.ENEMY, 1);
    enemyGfx.fillTriangle(18, 0, 0, 50, 36, 50);
    enemyGfx.generateTexture('enemy', 36, 50);
    enemyGfx.destroy();

    // Obstacle
    const obstGfx = this.make.graphics({ x: 0, y: 0 });
    obstGfx.fillStyle(COLORS.OBSTACLE, 1);
    obstGfx.fillRect(0, 0, 50, 50);
    obstGfx.generateTexture('obstacle', 50, 50);
    obstGfx.destroy();
  }
}
