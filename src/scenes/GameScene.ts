import Phaser from 'phaser';
import {
  GAME_WIDTH, GAME_HEIGHT, LANES, BASE_SCROLL_SPEED, SPEED_INCREMENT,
  COLORS,
} from '../utils/Constants';
import { loadSave } from '../utils/SaveData';
import { Player } from '../entities/Player';
import { LightOrb } from '../entities/LightOrb';
import { ShadowEnemy } from '../entities/ShadowEnemy';
import { Obstacle } from '../entities/Obstacle';
import { SpawnManager } from '../systems/SpawnManager';
import { ScoreManager } from '../systems/ScoreManager';
import { CorruptionMeter } from '../systems/CorruptionMeter';
import { AscensionManager } from '../systems/AscensionManager';
import { HUD } from '../ui/HUD';
import { TouchControls } from '../ui/TouchControls';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private orbGroup!: Phaser.Physics.Arcade.Group;
  private enemyGroup!: Phaser.Physics.Arcade.Group;
  private obstacleGroup!: Phaser.Physics.Arcade.Group;
  private spawnManager!: SpawnManager;
  private scoreManager!: ScoreManager;
  private corruptionMeter!: CorruptionMeter;
  private ascensionManager!: AscensionManager;
  private hud!: HUD;
  private bg1!: Phaser.GameObjects.TileSprite;
  private bg2!: Phaser.GameObjects.TileSprite;
  private scrollSpeed = BASE_SCROLL_SPEED;
  private elapsedTime = 0;
  private isGameOver = false;
  private keyLeft!: Phaser.Input.Keyboard.Key;
  private keyRight!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'Game' });
  }

  create(): void {
    this.isGameOver = false;
    this.elapsedTime = 0;
    this.scrollSpeed = BASE_SCROLL_SPEED;

    const save = loadSave();

    // Speed upgrade increases base scroll (= more distance per second)
    this.scrollSpeed += save.upgrades.speed * 20;

    // --- Background layers (scroll vertically) ---
    this.createBackground();

    // --- Lane indicators (vertical lines) ---
    this.drawLaneLines();

    // --- Player ---
    this.player = new Player(this);
    this.player.setMaxHealth(3 + save.upgrades.shield);

    // --- Object groups (pooled) ---
    this.orbGroup = this.physics.add.group({
      classType: LightOrb,
      maxSize: 30,
      runChildUpdate: false,
    });

    this.enemyGroup = this.physics.add.group({
      classType: ShadowEnemy,
      maxSize: 20,
      runChildUpdate: false,
    });

    this.obstacleGroup = this.physics.add.group({
      classType: Obstacle,
      maxSize: 15,
      runChildUpdate: false,
    });

    // --- Systems ---
    this.scoreManager = new ScoreManager();
    this.corruptionMeter = new CorruptionMeter(save.upgrades.purification);
    this.ascensionManager = new AscensionManager(this, this.player, this.scoreManager);
    this.spawnManager = new SpawnManager(this, this.orbGroup, this.enemyGroup, this.obstacleGroup);
    this.spawnManager.start(this.scrollSpeed);

    // --- Physics collisions ---
    this.physics.add.overlap(this.player, this.orbGroup, this.collectOrb, undefined, this);
    this.physics.add.overlap(this.player, this.enemyGroup, this.hitEnemy, undefined, this);
    this.physics.add.overlap(this.player, this.obstacleGroup, this.hitObstacle, undefined, this);

    // --- HUD ---
    this.hud = new HUD(this);

    // --- Input: keyboard (desktop) ---
    if (this.input.keyboard) {
      this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
      this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    // --- Input: touch swipe (mobile) ---
    const touch = new TouchControls(this);
    touch.onSwipeLeft = () => this.player.switchLane(-1);
    touch.onSwipeRight = () => this.player.switchLane(1);
  }

  update(_time: number, delta: number): void {
    if (this.isGameOver) return;

    this.elapsedTime += delta / 1000;

    // Increase difficulty
    this.scrollSpeed = BASE_SCROLL_SPEED + this.elapsedTime * SPEED_INCREMENT * 60;
    this.spawnManager.updateSpeed(this.scrollSpeed, this.elapsedTime);

    // Scroll backgrounds downward
    this.bg1.tilePositionY -= (this.scrollSpeed * 0.3 * delta) / 1000;
    this.bg2.tilePositionY -= (this.scrollSpeed * 0.6 * delta) / 1000;

    // Update systems
    this.scoreManager.updateDistance(delta, this.scrollSpeed);
    this.corruptionMeter.update(delta);

    // Apply corruption tint to bg
    const tint = this.corruptionMeter.getTint();
    this.bg1.setTint(tint);

    // HUD
    this.hud.update(this.scoreManager, this.player.health, this.corruptionMeter, this.ascensionManager);

    // Keyboard input (desktop)
    if (this.input.keyboard) {
      if (Phaser.Input.Keyboard.JustDown(this.keyLeft)) {
        this.player.switchLane(-1);
      }
      if (Phaser.Input.Keyboard.JustDown(this.keyRight)) {
        this.player.switchLane(1);
      }
    }

    // Clean up off-screen objects (past bottom of screen)
    this.cleanOffscreen(this.orbGroup);
    this.cleanOffscreen(this.enemyGroup);
    this.cleanOffscreen(this.obstacleGroup);
  }

  private createBackground(): void {
    // Generate vertical-scrolling background textures
    const bgGfx1 = this.make.graphics({ x: 0, y: 0 });
    bgGfx1.fillStyle(0x0d0520, 1);
    bgGfx1.fillRect(0, 0, GAME_WIDTH, 256);
    // Subtle star dots
    bgGfx1.fillStyle(0x333366, 1);
    for (let i = 0; i < 30; i++) {
      const sx = Math.random() * GAME_WIDTH;
      const sy = Math.random() * 256;
      bgGfx1.fillCircle(sx, sy, 1);
    }
    bgGfx1.generateTexture('bg1', GAME_WIDTH, 256);
    bgGfx1.destroy();

    const bgGfx2 = this.make.graphics({ x: 0, y: 0 });
    bgGfx2.fillStyle(0x150a30, 0.5);
    bgGfx2.fillRect(0, 0, GAME_WIDTH, 256);
    bgGfx2.fillStyle(0x221144, 0.3);
    for (let i = 0; i < 10; i++) {
      const sx = Math.random() * GAME_WIDTH;
      const sy = Math.random() * 256;
      bgGfx2.fillCircle(sx, sy, Math.random() * 20 + 5);
    }
    bgGfx2.generateTexture('bg2', GAME_WIDTH, 256);
    bgGfx2.destroy();

    this.bg1 = this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'bg1')
      .setOrigin(0, 0).setDepth(0);
    this.bg2 = this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'bg2')
      .setOrigin(0, 0).setDepth(1);
  }

  private drawLaneLines(): void {
    const gfx = this.add.graphics().setDepth(2);
    gfx.lineStyle(1, COLORS.LANE_LINE, 0.3);
    // Vertical lines between lanes
    const midX1 = (LANES[0] + LANES[1]) / 2;
    const midX2 = (LANES[1] + LANES[2]) / 2;
    gfx.lineBetween(midX1, 0, midX1, GAME_HEIGHT);
    gfx.lineBetween(midX2, 0, midX2, GAME_HEIGHT);
  }

  private collectOrb(_player: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Phaser.Tilemaps.Tile, orbObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Phaser.Tilemaps.Tile): void {
    const orb = orbObj as unknown as LightOrb;
    if (!orb.active) return;

    this.scoreManager.addOrbs(orb.value);
    this.corruptionMeter.addLight();
    this.ascensionManager.addCharge();
    orb.collect();
  }

  private hitEnemy(_player: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Phaser.Tilemaps.Tile, enemyObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Phaser.Tilemaps.Tile): void {
    const enemy = enemyObj as unknown as ShadowEnemy;
    if (!enemy.active) return;

    if (this.player.isAscended) {
      enemy.kill();
      this.scoreManager.addOrbs(1);
      return;
    }

    enemy.kill();
    const dead = this.player.takeDamage();
    if (dead) this.gameOver();
    else this.cameras.main.shake(100, 0.01);
  }

  private hitObstacle(_player: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Phaser.Tilemaps.Tile, obstObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Phaser.Tilemaps.Tile): void {
    const obstacle = obstObj as unknown as Obstacle;
    if (!obstacle.active) return;

    obstacle.deactivate();
    const dead = this.player.takeDamage();
    if (dead) this.gameOver();
    else this.cameras.main.shake(100, 0.01);
  }

  private cleanOffscreen(group: Phaser.Physics.Arcade.Group): void {
    group.getChildren().forEach((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (sprite.active && sprite.y > GAME_HEIGHT + 60) {
        sprite.setActive(false).setVisible(false);
        const body = sprite.body as Phaser.Physics.Arcade.Body;
        if (body) {
          body.enable = false;
          body.setVelocity(0);
        }
      }
    });
  }

  private gameOver(): void {
    this.isGameOver = true;
    this.spawnManager.stop();
    this.physics.pause();

    this.cameras.main.shake(200, 0.02);
    this.cameras.main.fade(800, 0, 0, 0);

    this.time.delayedCall(1000, () => {
      this.scene.start('GameOver', {
        score: this.scoreManager.score,
        distance: this.scoreManager.distance,
        orbs: this.scoreManager.orbs,
      });
    });
  }
}
