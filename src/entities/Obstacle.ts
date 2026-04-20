import Phaser from 'phaser';

export class Obstacle extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'obstacle');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5);
  }

  spawn(x: number, y: number, speed: number): void {
    this.setPosition(x, y);
    this.setActive(true).setVisible(true);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.enable = true;
    body.setVelocityX(-speed);
  }

  deactivate(): void {
    this.setActive(false).setVisible(false);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.enable = false;
    body.setVelocity(0);
  }
}
