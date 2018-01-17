import Board from "./board/board";
import AI from "./AI/ai";

class jChess {
  constructor() {
    this.board = new Board();
    this.ai = new AI(this.board, "black");
    // this.ai.letThereBeTree();
    window.board = this.board;

    this.turn = "white";
    this.opponent = {};
    this.opponent["black"] = "white";
    this.opponent["white"] = "black";

    $('#game-status').html("White's Turn");
    this.board.setGame(this);
    this.board.setTurn(this.turn);
  }

  getBoard() {
    return this.board;
  }

  changeTurns() {

    this.turn = this.opponent[this.turn];
    this.board.setTurn(this.turn);
    this.evaluateGameStatus();

  }

  evaluateGameStatus() {
    if (this.board.isInCheckMate(this.turn)){
      const winner = this.opponent[this.turn].charAt(0).toUpperCase() +
        this.opponent[this.turn].slice(1);
      $('#game-status').html(`Checkmate! ${winner} wins!`);
    } else if (this.board.isInCheck(this.turn)) {
      $('#game-status').html("Check!");
    } else {
      const player = this.turn.charAt(0).toUpperCase() +
        this.turn.slice(1);
      $('#game-status').html(`${player}'s turn'`);
    }
  }


}

export default jChess;
