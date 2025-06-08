// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

const LEVELS = [
  "tilemap/Primer-Mapa.tmx",
  "tilemap/Segundo-Mapa.tmx",
  "tilemap/Tercer-Mapa.tmx",
];

export default class Game extends Phaser.Scene {
  constructor() {
    super("Game");
    this.currentLevel = 0;
    this.score = 0;
  }

  init(data) {
    
    this.currentLevel = data.level || 0;
    this.score = data.score || 0;
  }

  preload() {
    
    LEVELS.forEach((level, i) => {
      this.load.tilemapTiledJSON(`level${i}`, `assets/${level}`);
    });
    /
  }

  create() {
  
    const map = this.make.tilemap({ key: `level${this.currentLevel}` });

   
    const tileset = map.addTilesetImage("tileset", "tileset");

    
    const belowLayer = map.createLayer("Fondo", tileset, 0, 0);
    const platformLayer = map.createLayer("Plataformas", tileset, 0, 0);
    const objectsLayer = map.getObjectLayer("Objetos");

   
    const spawnPoint = map.findObject(
      "Objetos",
      (obj) => obj.name === "player"
    );
    console.log("spawnPoint", spawnPoint);

    this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "dude");

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    platformLayer.setCollisionByProperty({ esColisionable: true });
    this.physics.add.collider(this.player, platformLayer);

   
    this.stars = this.physics.add.group();

   
    objectsLayer.objects.forEach((objData) => {
      console.log(objData);
      const { x = 0, y = 0, name, type } = objData;
      switch (type) {
        case "star": {
         
          const star = this.stars.create(x, y, "star");
          star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
          break;
        }
      }
    });

  
    this.physics.add.collider(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );
    
    this.physics.add.collider(this.stars, platformLayer);

    this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
      fontSize: "32px",
      fill: "#000",
    });
  }

  update() {
   
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);

      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);

      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play("turn");
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-330);
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyR)) {
      console.log("Phaser.Input.Keyboard.JustDown(this.keyR)");
      this.scene.restart();
    }
  }

  collectStar(player, star) {
    star.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);

    if (this.stars.countActive(true) === 0) {
    
      this.stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });
    }
  }

  collectArtifact(player, artifact) {
    artifact.destroy();
    this.score += 10;
    if (this.artifacts.countActive(true) === 0) {
      this.nextLevel();
    }
  }

  nextLevel() {
    if (this.currentLevel < LEVELS.length - 1) {
      this.scene.restart({ level: this.currentLevel + 1, score: this.score });
    } else {
      
      this.scene.start("WinScene", { score: this.score });
    }
  }
}

export default class WinScene extends Phaser.Scene {
  constructor() {
    super("WinScene");
  }
  init(data) {
    this.score = data.score;
  }
  create() {
    this.add.text(100, 100, `¡Ganaste! Score: ${this.score}`, { fontSize: '32px', fill: '#fff' });
    this.input.once('pointerdown', () => {
      this.scene.start("Game", { level: 0, score: 0 });
    });
  }
}
