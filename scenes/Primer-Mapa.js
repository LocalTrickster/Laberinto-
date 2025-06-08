import Phaser from "phaser";

export default class PrimerMapa extends Phaser.Scene {
  constructor() {
    super("Primer-Mapa");
    this.score = 0;
    this.artifactsCollected = 0;
  }

  init(data) {
    this.score = data.score || 0;
  }

  preload() {
    this.load.tilemapTiledJSON("primerMapa", "assets/tilemap/Primer mapa.tmx");
    this.load.image("tiles", "assets/Tilemap/tilemap_packed.png");
    this.load.spritesheet("player", "assets/player.png", { frameWidth: 32, frameHeight: 32 });
    this.load.image("artifact", "assets/artifact.png");
  }

  create() {
   
    const map = this.make.tilemap({ key: "primerMapa" });
    const tileset = map.addTilesetImage("SampleA", "tiles"); 
    const ground = map.createLayer(0, tileset, 0, 0);

   
    this.player = this.physics.add.sprite(64, 64, "player");
    this.player.setCollideWorldBounds(true);

   
    this.artifacts = this.physics.add.group();
    for (let i = 0; i < 5; i++) {
    
      this.artifacts.create(128 + i * 64, 128, "artifact");
    }

  
    this.physics.add.overlap(this.player, this.artifacts, this.collectArtifact, null, this);

    this.cursors = this.input.keyboard.createCursorKeys();

  
    this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, { fontSize: "24px", fill: "#fff" });
  }

  update() {
 
    this.player.setVelocity(0);
    if (this.cursors.left.isDown) this.player.setVelocityX(-200);
    else if (this.cursors.right.isDown) this.player.setVelocityX(200);
    if (this.cursors.up.isDown) this.player.setVelocityY(-200);
    else if (this.cursors.down.isDown) this.player.setVelocityY(200);
  }

  collectArtifact(player, artifact) {
    artifact.disableBody(true, true);
    this.score += 10;
    this.artifactsCollected += 1;
    this.scoreText.setText(`Score: ${this.score}`);

    if (this.artifactsCollected >= 5) {
  
      this.scene.start("Segundo-Mapa", { score: this.score });
    }
  }
}