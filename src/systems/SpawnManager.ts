import Phaser from 'phaser';
import { LightOrb } from '../entities/LightOrb';
import { ShadowEnemy } from '../entities/ShadowEnemy';
import { Obstacle } from '../entities/Obstacle';
import {
  SPAWN_X, SPAWN_INTERVAL_BASE, SPAWN_INTERVAL_MIN,
} from '../utils/Constants';
import { getRandomLane, getLaneY } from './LaneManager';

export class SpawnManager {
  private scene: Phaser.Scene;
  private orbGroup: Phaser.Physics.Arcade.Group;
  private enemyGroup: Phaser.Physics.Arcade.Group;
  private obstacleGroup: Phaser.Physics.Arcade.Group;
  private timer: Phaser.Time.TimerEvent | null = null;
  private currentSpeed = 300;
  private elapsedTime = 0;

  constructor(
    scene: Phaser.Scene,
    orbGroup: Phaser.Physics.Arcade.Group,
    enemyGroup: Phaser.Physics.Arcade.Group,
    obstacleGroup: Phaser.Physics.Arcade.Group,
  ) {
    this.scene = scene;
    this.orbGroup = orbGroup;
    this.enemyGroup = enemyGroup;
    this.obstacleGroup = obstacleGroup;
  }

  start(speed: number): void {
    this.currentSpeed = speed;
    this.elapsedTime = 0;
    this.scheduleNext();
  }

  stop(): void {
    if (this.timer) {
      this.timer.remove();
      this.timer = null;
    }
  }

  updateSpeed(speed: number, elapsed: number): void {
    this.currentSpeed = speed;
    this.elapsedTime = elapsed;
  }

  private scheduleNext(): void {
    const interval = Math.max(
      SPAWN_INTERVAL_MIN,
      SPAWN_INTERVAL_BASE - this.elapsedTime * 8,
    );

    this.timer = this.scene.time.delayedCall(interval, () => {
      this.spawnWave();
      this.scheduleNext();
    });
  }

  private spawnWave(): void {
    const roll = Math.random();
    const lane = getRandomLane();
    const y = getLaneY(lane);

    if (roll < 0.45) {
      this.spawnOrb(SPAWN_X, y);
    } else if (roll < 0.70) {
      this.spawnEnemy(SPAWN_X, y);
    } else if (roll < 0.90) {
      this.spawnObstacle(SPAWN_X, y);
    } else {
      // Orb cluster — 3 orbs in a row
      for (let i = 0; i < 3; i++) {
        this.spawnOrb(SPAWN_X + i * 40, y);
      }
    }
  }

  private spawnOrb(x: number, y: number): void {
    const orb = this.orbGroup.get(x, y) as LightOrb | null;
    if (orb) {
      const value = Math.random() < 0.8 ? 1 : Math.random() < 0.5 ? 2 : 3;
      orb.spawn(x, y, this.currentSpeed, value);
    }
  }

  private spawnEnemy(x: number, y: number): void {
    const enemy = this.enemyGroup.get(x, y) as ShadowEnemy | null;
    if (enemy) {
      enemy.spawn(x, y, this.currentSpeed + 50);
    }
  }

  private spawnObstacle(x: number, y: number): void {
    const obstacle = this.obstacleGroup.get(x, y) as Obstacle | null;
    if (obstacle) {
      obstacle.spawn(x, y, this.currentSpeed);
    }
  }
}
