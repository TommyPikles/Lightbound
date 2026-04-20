import Phaser from 'phaser';
import { GAME_WIDTH, COLORS, UPGRADE_COSTS, UPGRADE_MAX_LEVEL } from '../utils/Constants';
import { loadSave, writeSave, type Upgrades } from '../utils/SaveData';

interface UpgradeInfo {
  key: keyof Upgrades;
  label: string;
  icon: string;
  description: string;
}

const UPGRADES: UpgradeInfo[] = [
  { key: 'speed', label: 'Swift Light', icon: '⚡', description: 'Increases score gain rate' },
  { key: 'shield', label: 'Divine Shield', icon: '🛡️', description: '+1 starting health per level' },
  { key: 'purification', label: 'Purify Aura', icon: '✨', description: 'Slows corruption decay' },
  { key: 'magnetism', label: 'Light Magnet', icon: '🔥', description: 'Increases orb pickup radius' },
];

export class UpgradeShopScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UpgradeShop' });
  }

  create(): void {
    const save = loadSave();

    this.add.text(GAME_WIDTH / 2, 40, 'UPGRADES', {
      fontSize: '32px',
      color: COLORS.UI_ACCENT,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 75, `Light Orbs: ${save.totalOrbs}`, {
      fontSize: '16px',
      color: COLORS.UI_TEXT,
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    const startY = 120;
    const rowHeight = 90;

    UPGRADES.forEach((upg, i) => {
      const y = startY + i * rowHeight;
      const level = save.upgrades[upg.key];
      const maxed = level >= UPGRADE_MAX_LEVEL;
      const cost = maxed ? 0 : UPGRADE_COSTS[level];
      const canAfford = save.totalOrbs >= cost;

      // Label
      this.add.text(100, y, `${upg.icon} ${upg.label}`, {
        fontSize: '20px',
        color: COLORS.UI_TEXT,
        fontFamily: 'monospace',
      });

      this.add.text(100, y + 25, upg.description, {
        fontSize: '12px',
        color: '#888888',
        fontFamily: 'monospace',
      });

      // Level pips
      for (let p = 0; p < UPGRADE_MAX_LEVEL; p++) {
        const pipColor = p < level ? 0xffd700 : 0x333333;
        this.add.rectangle(550 + p * 25, y + 12, 18, 18, pipColor).setStrokeStyle(1, 0x555555);
      }

      // Buy button
      if (!maxed) {
        const btnText = canAfford ? `[ ${cost} orbs ]` : `${cost} orbs`;
        const btnColor = canAfford ? COLORS.UI_ACCENT : '#555555';

        const btn = this.add.text(780, y + 8, btnText, {
          fontSize: '16px',
          color: btnColor,
          fontFamily: 'monospace',
        }).setOrigin(0.5);

        if (canAfford) {
          btn.setInteractive({ useHandCursor: true });
          btn.on('pointerover', () => btn.setScale(1.1));
          btn.on('pointerout', () => btn.setScale(1));
          btn.on('pointerdown', () => {
            save.totalOrbs -= cost;
            save.upgrades[upg.key] += 1;
            writeSave(save);
            this.scene.restart();
          });
        }
      } else {
        this.add.text(780, y + 8, 'MAX', {
          fontSize: '16px',
          color: COLORS.UI_ACCENT,
          fontFamily: 'monospace',
          fontStyle: 'bold',
        }).setOrigin(0.5);
      }
    });

    // Back button
    const backBtn = this.add.text(GAME_WIDTH / 2, 490, '[ BACK ]', {
      fontSize: '20px',
      color: COLORS.UI_TEXT,
      fontFamily: 'monospace',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    backBtn.on('pointerover', () => backBtn.setScale(1.1));
    backBtn.on('pointerout', () => backBtn.setScale(1));
    backBtn.on('pointerdown', () => this.scene.start('MainMenu'));
  }
}
