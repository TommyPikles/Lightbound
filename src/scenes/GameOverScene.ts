import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../utils/Constants';
import { loadSave, writeSave } from '../utils/SaveData';

interface GameOverData {
  score: number;
  distance: number;
  orbs: number;
}

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOver' });
  }

  create(data: GameOverData): void {
    const score = data.score ?? 0;
    const distance = data.distance ?? 0;
    const orbs = data.orbs ?? 0;

    // Save results
    const save = loadSave();
    save.totalOrbs += orbs;
    save.totalRuns += 1;
    const isNewHighScore = score > save.highScore;
    if (isNewHighScore) save.highScore = score;
    writeSave(save);

    const cx = GAME_WIDTH / 2;

    // Overlay
    this.add.rectangle(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.7);

    // Title
    this.add.text(cx, 140, 'TRIAL ENDED', {
      fontSize: '36px',
      color: COLORS.UI_DANGER,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    if (isNewHighScore) {
      this.add.text(cx, 185, 'NEW HIGH SCORE!', {
        fontSize: '16px',
        color: COLORS.UI_ACCENT,
        fontFamily: 'monospace',
      }).setOrigin(0.5);
    }

    // Stats
    const statsY = 260;
    const stats = [
      `Score: ${score}`,
      `Distance: ${Math.floor(distance)}m`,
      `Orbs Collected: ${orbs}`,
      `Total Orbs: ${save.totalOrbs}`,
      `Runs: ${save.totalRuns}`,
    ];

    stats.forEach((line, i) => {
      this.add.text(cx, statsY + i * 36, line, {
        fontSize: '18px',
        color: COLORS.UI_TEXT,
        fontFamily: 'monospace',
      }).setOrigin(0.5);
    });

    // Buttons
    const btnY = 560;

    const retryBtn = this.add.text(cx, btnY, '[ RETRY ]', {
      fontSize: '28px',
      color: COLORS.UI_ACCENT,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    retryBtn.on('pointerover', () => retryBtn.setScale(1.1));
    retryBtn.on('pointerout', () => retryBtn.setScale(1));
    retryBtn.on('pointerdown', () => this.scene.start('Game'));

    const shopBtn = this.add.text(cx, btnY + 60, '[ UPGRADES ]', {
      fontSize: '20px',
      color: COLORS.UI_TEXT,
      fontFamily: 'monospace',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    shopBtn.on('pointerover', () => shopBtn.setScale(1.1));
    shopBtn.on('pointerout', () => shopBtn.setScale(1));
    shopBtn.on('pointerdown', () => this.scene.start('UpgradeShop'));

    const menuBtn = this.add.text(cx, btnY + 115, '[ MENU ]', {
      fontSize: '18px',
      color: '#888888',
      fontFamily: 'monospace',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    menuBtn.on('pointerover', () => menuBtn.setScale(1.1));
    menuBtn.on('pointerout', () => menuBtn.setScale(1));
    menuBtn.on('pointerdown', () => this.scene.start('MainMenu'));
  }
}
