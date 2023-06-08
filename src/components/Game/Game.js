import Phaser from 'phaser';
import io from 'socket.io-client';
const socketServer = import.meta.env.VITE_SERVER;
const socket = io(socketServer);

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
    this.players = [];
    this.speed = 600;
    this.score = [0, 0];
    this.gameStarted = false;
    this.gameReset = false;
    this.ballSpeedX = 300;
    this.ballSpeedY = 300;
  }

  preload() {
    this.load.audio('rocky', 'src/assets/rocky.mp3');
    this.load.image('sky', 'src/assets/space-bag.jpg');
  }

  createSocketListeners() {
    socket.on('connect', () => {
      console.log('Connected to server');

      // Emit the 'joinGame' event to join a specific game room
      const gameId = '1234';
      socket.emit('joinGame', gameId);

      // Listen for other players joining the game
      socket.on('playerJoined', (playerId) => {
        // Add the new player to the game
        this.addPlayer(playerId);
        console.log(playerId);
      });

      // Listen for game updates
      socket.on('gameUpdate', (playerId, data) => {
        // Update the game state based on the received data
        /*         this.updateGameState(playerId, data);
         */ console.log(data);
      });

      // Listen for other players leaving the game
      socket.on('playerDisconnected', (playerId) => {
        // Remove the disconnected player from the game
        this.removePlayer(playerId);
      });
    });
  }

  addPlayer(playerId) {
    // Check if the player already exists
    const existingPlayer = this.players.find(
      (player) => player.id === playerId
    );
    if (existingPlayer) {
      return;
    }

    // Create a new player and add it to the game
    const { width, height } = this.game.canvas;
    const remotePlayerKeys = this.input.keyboard.createCursorKeys();
    const startPosition = { x: width - 50, y: height / 2 };
    const newPlayer = this.createPlayer(
      width - 50,
      height / 2,
      remotePlayerKeys,
      startPosition
    );
    newPlayer.id = playerId;
    this.players.push(newPlayer);

    // Emit the 'playerJoined' event to the game room
    const gameId = '1234';
    // socket.emit('playerJoined', gameId, playerId);
  }

  removePlayer(playerId) {
    // Find the index of the player to remove
    const index = this.players.findIndex((player) => player.id === playerId);
    if (index !== -1) {
      // Remove the player from the game
      this.players[index].destroy();
      this.players.splice(index, 1);
    }

    /*     // Check if the player exists
    if (this.players[playerId]) {
      // Remove the player from the game
      this.players[playerId].destroy();
      delete this.players[playerId];
    } */
  }

  /*   updateGameState(playerId, gameState) {
    // Update the game state based on the received data
    this.players.forEach((player) => {
      const playerState = gameState.players[player.id];
      if (playerState) {
        player.x = playerState.x;
        player.y = playerState.y;
      }
    });
  } */

  create() {
    const { width, height } = this.game.canvas;
    this.add.image(width / 2, height / 2, 'sky').setDisplaySize(width, height);
    this.sound.play('rocky', { loop: true });
    this.createSocketListeners();

    const localPlayerKeys = this.input.keyboard.createCursorKeys();

    // Create local player
    const localPlayer = this.createPlayer(50, height / 2, localPlayerKeys, {
      x: 50,
      y: height / 2,
    });
    this.players.push(localPlayer);

    const circle = this.add.circle(width / 2, height / 2, 15, 0xffffff);
    this.ball = this.physics.add.existing(circle, false);
    this.ball.body.setCircle(15);
    this.ball.body.setBounce(1);
    this.ball.body.setCollideWorldBounds(true);
    this.ball.body.setVelocity(this.ballSpeedX, this.ballSpeedY);

    this.players.forEach((player) => {
      this.physics.add.collider(player, this.ball);
    });

    this.scoreText = this.add.text(width / 2, 50, '0 | 0', {
      fontSize: '32px',
      fill: '#fff',
    });
    this.scoreText.setOrigin(0.5);
    this.startGame();
  }

  createPlayer(x, y, keys, startPosition) {
    const player = this.add.rectangle(x, y, 20, 100, 0xffffff);
    this.physics.world.enable(player);
    player.body.setImmovable(true);
    player.body.setCollideWorldBounds(true);
    player.controls = keys;
    player.startPosition = startPosition;
    player.id = socket.id;
    return player;
  }

  resetPlayerPositions() {
    this.players.forEach((player) => {
      player.x = player.startPosition.x;
      player.y = player.startPosition.y;
      player.body.setVelocity(0);
    });
  }

  updateScore(playerIndex) {
    this.score[playerIndex]++;
    this.scoreText.setText(`${this.score[0]} | ${this.score[1]}`);
  }

  startGame() {
    this.gameReset = true;
    const { width, height } = this.game.canvas;
    let timer = 2;
    const title = this.add.text(
      width / 2,
      height / 2 - 50,
      `Game Starting in ${timer}`
    );
    title.setOrigin(0.5);
    title.setScale(2);
    this.ball.body.setVelocity(0, 0);
    this.ball.setPosition(width / 2, height / 2);
    const countdown = setInterval(() => {
      timer -= 1;
      title.text = `Game Starting in ${timer}`;
      if (timer === 0) {
        clearInterval(countdown);
        this.ball.body.setVelocity(this.ballSpeedX, this.ballSpeedY);
        title.destroy();
        this.gameStarted = true;
        this.gameReset = false;
      }
    }, 1000);
  }

  update() {
    if (this.gameReset) {
      return;
    }
    this.players.forEach((player, index) => {
      if (this.gameStarted) {
        if (!player.controls) {
          // receive player movement from server
          socket.on('remote-player-movement', (playerId,direction) => {
            console.log('sssssssssssssss')
            if (direction === 'down') {
              player.body.setVelocityY(this.speed);
            } else if (direction === 'up') {
              player.body.setVelocityY(-this.speed);
            }
          });
        } else {
          //Player movements
          if (player.controls.up.isDown) {
            player.body.setVelocityY(-this.speed);
          } else if (player.controls.down.isDown) {
            player.body.setVelocityY(this.speed);
          } else {
            player.body.setVelocityY(0);
          }

          // Emit the player's movement to the server
          const direction = player.controls.up.isDown
            ? 'up'
            : player.controls.down.isDown
            ? 'down'
            : null;
          socket.emit('player-movement', direction);
        }
      }
    });

    const width = this.game.canvas.width;
    if (this.ball.x - 15 <= 0) {
      this.updateScore(1);
      this.resetPlayerPositions();
      this.startGame();
    } else if (this.ball.x + 15 >= width) {
      this.updateScore(0);
      this.resetPlayerPositions();
      this.startGame();
    }
  }
}

export default Game;
