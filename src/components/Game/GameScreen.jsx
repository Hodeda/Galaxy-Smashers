import React, { useEffect, useState } from 'react';
import Phaser from 'phaser';
import { SocketProvider, useSocket } from '../../services/socket';
import StartScene from './StartScreen';
import GameMode from './GameMode';
import Game from './Game';
import PlayerStats from './PlayerStats';
import { Chat } from './chat';

const GameScreen = () => {
  const [game, setGame] = useState(null);
  /*   const { socket } = useSocket();
  console.log(socket); */

  useEffect(() => {
    if (!game) {
      const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 0 },
          },
        },
        scene: [StartScene, GameMode, Game],
        parent: 'game-container',
      };

      setGame(new Phaser.Game(config));
    }

    return () => {
      if (game) {
        game.destroy();
      }
    };
  }, [game]);

  return (
    <>
      <SocketProvider>
        <div className="GameContainer">
          <PlayerStats />
          {{ game } && (
            <div style={{ textAlign: 'center' }} id="game-container" />
          )}
          <PlayerStats />
        </div>
        <Chat />
      </SocketProvider>
    </>
  );
};

export default GameScreen;
