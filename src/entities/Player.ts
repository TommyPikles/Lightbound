import Phaser from 'phaser';
import {
  LANES, LANE_COUNT, PLAYER_Y, LANE_SWITCH_DURATION,
} from '../utils/Constants';

export class Player extends Phaser.Physics.Arcade.Sprite {
  currentLane = 1; // Start in middle lane
  health = 3;
  maxHealth = 3;
  isInvincible = false;
  isAscended = false;
  private switching = false;

  constructor(scene: Phaser.Scene) {
    super(scene, LANES[1], PLAYER_Y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0.5);
    this.setDepth(10);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
  }

  switchLane(direction: -1 | 1): void {
    if (this.switching) return;
    const newLane = this.currentLane + direction;
    if (newLane < 0 || newLane >= LANE_COUNT) return;

    this.switching = true;
    this.currentLane = newLane;

    this.scene.tweens.add({
      targets: this,
      x: LANES[this.currentLane],
      duration: LANE_SWITCH_DURATION,
      ease: 'Power2',
      onComplete: () => {
        this.switching = false;
      },
    });
  }

  takeDamage(): boolean {
    if (this.isInvincible || this.isAscended) return false;

    this.health -= 1;
    this.isInvincible = true;

    // Flash effect
    this.scene.tweens.add({
      targets: this,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 5,
      onComplete: () => {
        this.alpha = 1;
        this.isInvincible = false;
      },
    });

    return this.health <= 0;
  }

  activateAscension(): void {
    this.isAscended = true;
    this.setTexture('player_ascended');
  }

  deactivateAscension(): void {
    this.isAscended = false;
    this.setTexture('player');
  }

  setMaxHealth(max: number): void {
    this.maxHealth = max;
    this.health = max;
  }
}
