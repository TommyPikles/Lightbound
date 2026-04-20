import Phaser from 'phaser';

export class TouchControls {
  private startY = 0;
  private swipeThreshold = 40;
  onSwipeUp: (() => void) | null = null;
  onSwipeDown: (() => void) | null = null;

  constructor(scene: Phaser.Scene) {
    scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.startY = pointer.y;
    });

    scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      const dy = pointer.y - this.startY;
      if (Math.abs(dy) < this.swipeThreshold) return;

      if (dy < 0 && this.onSwipeUp) {
        this.onSwipeUp();
      } else if (dy > 0 && this.onSwipeDown) {
        this.onSwipeDown();
      }
    });
  }
}
