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