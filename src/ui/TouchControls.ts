import Phaser from 'phaser';

export class TouchControls {
  private startX = 0;
  private startY = 0;
  private swipeThreshold = 40;
  onSwipeLeft: (() => void) | null = null;
  onSwipeRight: (() => void) | null = null;

  /** True if the device supports touch input */
  static isMobile(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  constructor(scene: Phaser.Scene) {
    scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.startX = pointer.x;
      this.startY = pointer.y;
    });

    scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      const dx = pointer.x - this.startX;
      const dy = pointer.y - this.startY;

      // Only register horizontal swipes (ignore vertical drags)
      if (Math.abs(dx) < this.swipeThreshold) return;
      if (Math.abs(dy) > Math.abs(dx)) return; // more vertical than horizontal — ignore

      if (dx < 0 && this.onSwipeLeft) {
        this.onSwipeLeft();
      } else if (dx > 0 && this.onSwipeRight) {
        this.onSwipeRight();
      }
    });
  }
}
