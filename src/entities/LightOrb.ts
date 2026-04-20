import Phaser from 'phaser';

export class LightOrb extends Phaser.Physics.Arcade.Sprite {
  value = 1;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'orb');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5);
  }

  spawn(x: number, y: number, speed: number, value: number): void {
    this.setPosition(x, y);
    this.setActive(true).setVisible(true);
    this.value = value;
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.enable = true;
    body.setVelocityX(-speed);

    // Subtle bob
    this.scene.tweens.add({
      targets: this,
      y: y - 8,
      duration: 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  collect(): void {
    this.scene.tweens.killTweensOf(this);
    this.setActive(false).setVisible(false);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.enable = false;
    body.setVelocity(0);
  }
}
