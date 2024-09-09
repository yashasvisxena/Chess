import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  public board: Chess;
  public moves: string[];
  public startTime: Date;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.moves = [];
    this.startTime = new Date();
    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        color: "white",
      })
    );
    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        color: "black",
      })
    );
  }

  makeMove(socket: WebSocket, move: { from: string, to: string }) {
    //validation the type of move using zod
    if (this.board.moves.length % 2 === 0 && socket != this.player1) {
      return;
    }
    if (this.board.moves.length % 2 === 1 && socket != this.player2) {
      return;
    }

    //make the move
    try {
      this.board.move(move);
    } catch (e) {
      console.log(e);
      return;
    }
    //check if the game is over

    if (this.board.isGameOver()) {
      //send the game over message to both the players
      this.player1.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      );
      this.player2.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "b" ? "black" : "white",
          },
        })
      );
    }

    if (this.board.moves.length % 2 === 0) {
      this.player2.send(JSON.stringify({ type: MOVE, payload: move }));
    } else {
      this.player1.send(JSON.stringify({ type: MOVE, payload: move }));
    }
  }
}
