import Game from "./scenes/Game.js";
import PrimerMapa from "./scenes/Primer-Mapa.js";
import SegundoMapa from "./scenes/Segundo-Mapa.js";
import TercerMapa from "./scenes/Tercer-Mapa.js";
import WinScene from "./scenes/WinScene.js";

// Create a new Phaser config object
const config = {
  type: Phaser.AUTO,
  width: 720,
  height: 720,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600,
    },
    max: {
      width: 1600,
      height: 1200,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
      debug: true,
    },
  },
  
  scene: [Game, PrimerMapa, SegundoMapa, TercerMapa, WinScene],
};


window.game = new Phaser.Game(config);
