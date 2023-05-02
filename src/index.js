import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
class Square extends React.Component {
    render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
            game: 1,
            xWins: 0,
            oWins: 0,
            moveTracker: [],
            winner: false,
        };
    }
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
        return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({squares: squares, xIsNext: !this.state.xIsNext,});
    this.state.moveTracker.push(squares);
  }

  renderSquare(i) {
    return <Square value={this.state.squares[i]} onClick={() => this.handleClick(i)} />;
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let historicText = this.movesHistory();

    if (winner === 'O') {
        this.state.oWins += 1;
    } else if (winner === 'X') {
        this.state.xWins += 1;
    }

    let statistics = "X wins " + this.state.xWins + " O wins " + this.state.oWins;
    let status;
    let game = "Game " + this.state.game;
    if (winner) {
        status = 'Winner: ' + winner;
        this.state.winner = true;
    } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div>
        <div className="Game">{game}</div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
        <button className="restart" onClick={() => this.restart()}>
            Restart
        </button>
          <div className="statistics">{statistics}</div>
          <div className="moveTracker">{historicText}</div>
      </div>
    );
  }

    movesHistory() {
        let historic = this.state.moveTracker;
        let historicText = historic.map((move, index) => {
            const newMove = move.map(square => square === null ? '-' : square);
            return (
                <React.Fragment key={index}>
                    <button onClick={() => this.rollBack(index)}>Move {index}:</button> {newMove.join(', ')}
                    <br/>
                </React.Fragment>
            );
        });
        return historicText;
    }
    rollBack(index) {
      const moveTracker = this.state.moveTracker.slice(0, index + 1);
      const squares = moveTracker[index].slice();
      const xIsNext = index % 2 !== 0;

      if (this.state.winner === true) {
        return;
    }
    
      this.setState({
        squares: squares,
        xIsNext: xIsNext,
        moveTracker: moveTracker,
        game: index + 1,
      });
    }

    restart() {
      this.setState( {
          squares: Array(9).fill(null),
          xIsNext: true,
          game: this.state.game + 1,
          moveTracker: this.state.moveTracker = [],
          winner: false,
      });
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root'),
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

