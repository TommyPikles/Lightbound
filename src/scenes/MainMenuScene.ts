import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../utils/Constants';
import { loadSave } from '../utils/SaveData';
import { TouchControls } from '../ui/TouchControls';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenu' });
  }

  create(): void {
    const save = loadSave();
    const cx = GAME_WIDTH / 2;
    const isMobile = TouchControls.isMobile();

    // Title
    this.add.text(cx, 200, 'LIGHTBOUND', {
      fontSize: '42px',
      color: COLORS.UI_ACCENT,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(cx, 252, 'Trials of the Guardian', {
      fontSize: '16px',
      color: COLORS.UI_TEXT,
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // High score
    if (save.highScore > 0) {
      this.add.text(cx, 300, `High Score: ${save.highScore}`, {
        fontSize: '14px',
        color: '#aaaaaa',
        fontFamily: 'monospace',
      }).setOrigin(0.5);
    }

    // Play button
    const playBtn = this.add.text(cx, 440, '[ PLAY ]', {
      fontSize: '32px',
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
    const upgradeBtn = this.add.text(cx, 520, '[ UPGRADES ]', {
      fontSize: '22px',
      color: COLORS.UI_TEXT,
      fontFamily: 'monospace',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    upgradeBtn.on('pointerover', () => upgradeBtn.setScale(1.1));
    upgradeBtn.on('pointerout', () => upgradeBtn.setScale(1));
    upgradeBtn.on('pointerdown', () => {
      this.scene.start('UpgradeShop');
    });

    // Controls hint — different for mobile vs desktop
    const hint = isMobile
      ? 'Swipe left/right to switch lanes'
      : 'Arrow Left/Right to switch lanes';

    this.add.text(cx, GAME_HEIGHT - 60, hint, {
      fontSize: '13px',
      color: '#666666',
      fontFamily: 'monospace',
    }).setOrigin(0.5);
  }
}
