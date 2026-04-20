import Phaser from 'phaser';
import { GAME_WIDTH, COLORS } from '../utils/Constants';
import { loadSave } from '../utils/SaveData';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenu' });
  }

  create(): void {
    const save = loadSave();

    // Title
    this.add.text(GAME_WIDTH / 2, 120, 'LIGHTBOUND', {
      fontSize: '48px',
      color: COLORS.UI_ACCENT,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 170, 'Trials of the Guardian', {
      fontSize: '18px',
      color: COLORS.UI_TEXT,
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // High score
    if (save.highScore > 0) {
      this.add.text(GAME_WIDTH / 2, 210, `High Score: ${save.highScore}`, {
        fontSize: '14px',
        color: '#aaaaaa',
        fontFamily: 'monospace',
      }).setOrigin(0.5);
    }

    // Play button
    const playBtn = this.add.text(GAME_WIDTH / 2, 310, '[ PLAY ]', {
      fontSize: '28px',
      color: COLORS.UI_ACCENT,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    playBtn.on('pointerover', () => playBtn.setScale(1.1));
    playBtn.on('pointerout', () => playBtn.setScale(1));
    playBtn.on('pointerdown', () => {
      this.scene.start('Game');
    });

    // Upgrades button
    const upgradeBtn = this.add.text(GAME_WIDTH / 2, 370, '[ UPGRADES ]', {
      fontSize: '20px',
      color: COLORS.UI_TEXT,
      fontFamily: 'monospace',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    upgradeBtn.on('pointerover', () => upgradeBtn.setScale(1.1));
    upgradeBtn.on('pointerout', () => upgradeBtn.setScale(1));
    upgradeBtn.on('pointerdown', () => {
      this.scene.start('UpgradeShop');
    });

    // Controls hint
    this.add.text(GAME_WIDTH / 2, 460, 'Arrow Up/Down to switch lanes  |  Swipe on mobile', {
      fontSize: '12px',
      color: '#666666',
      fontFamily: 'monospace',
    }).setOrigin(0.5);
  }
}
