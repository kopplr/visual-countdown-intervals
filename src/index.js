import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// function Square(props) {
//   return (
//     <button className="square" onClick={props.onClick}>
//       {props.value}
//     </button>
//   );
// }

// class Board extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       squares: Array(9).fill(null),
//       xIsNext: true,
//     };
//   }
//   handleClick(i) {
//     const squares = this.state.squares.slice();
//     if (calculateWinner(squares) || squares[i]) {
//       return;
//     }
//     squares[i] = this.state.xIsNext ? 'X' : 'O';
//     this.setState({
//       squares: squares,
//       xIsNext: !this.state.xIsNext,
//     });
//   }
//   renderSquare(i) {
//     return (
//       <Square
//         value={this.state.squares[i]}
//         onClick={() => this.handleClick(i)}
//       />
//     );
//   }

//   render() {
//     const winner = calculateWinner(this.state.squares);
//     let status;
//     if (winner) {
//       status = 'Winner: ' + winner;
//     } else {
//       status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
//     }

//     return (
//       <div>
//         <div className="status">{status}</div>
//         <div className="board-row">
//           {this.renderSquare(0)}
//           {this.renderSquare(1)}
//           {this.renderSquare(2)}
//         </div>
//         <div className="board-row">
//           {this.renderSquare(3)}
//           {this.renderSquare(4)}
//           {this.renderSquare(5)}
//         </div>
//         <div className="board-row">
//           {this.renderSquare(6)}
//           {this.renderSquare(7)}
//           {this.renderSquare(8)}
//         </div>
//       </div>
//     );
//   }
// }

// class Game extends React.Component {
//   render() {
//     return (
//       <div className="game">
//         <div className="game-board">
//           <Board />
//         </div>
//         <div className="game-info">
//           <div>{/* status */}</div>
//           <ol>{/* TODO */}</ol>
//         </div>
//       </div>
//     );
//   }
// }

// function calculateWinner(squares) {
//   const lines = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [2, 4, 6],
//   ];
//   for (let i = 0; i < lines.length; i++) {
//     const [a, b, c] = lines[i];
//     if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//       return squares[a];
//     }
//   }
//   return null;
// }
function VisualCountdown (props){
  
  return(
    <svg width="400" height="400">
      <path id="arc1" fill="none" stroke="#446688" strokeWidth="200" d={props.value} />
    </svg>
  );
}

class Example extends React.Component {
  constructor() {
    super();
    this.state = { time: {}, seconds: null, isStarted: false, countdownStatus: 'stopped'};
    this.timer = 0;
    this.handleTimer = this.handleTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.VisualCountdownInfo = "";
    this.originalTime = 600;
  }
  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    let angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  describeArc(x, y, radius, startAngle, endAngle){

    let start = this.polarToCartesian(x, y, radius, endAngle);
    let end = this.polarToCartesian(x, y, radius, startAngle);

    let largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    let d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;       
  }
  renderVisualCountdown(){
    console.log(this.originalTime*this.state.time.s);
    this.VisualCountdownInfo = this.describeArc(200, 200, 100, 0, this.state.time.s*6);//360.0/this.originalTime);
      return(
        <VisualCountdown
          value={this.VisualCountdownInfo}
        />
      );
    
  }
  secondsToTime(secs){
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  }

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
  }

  handleTimer() {
    if (!this.state.isStarted) { // Start has been pressed
      this.setState({seconds: this.state.time.h*3600+this.state.time.m*60+this.state.time.s});
      this.timer = setInterval(this.countDown, 1000);
      this.setState({isStarted: true});
      this.originalTime = this.state.seconds;
      // alert(this.state.seconds);
    }
    else { // Stop has been pressed
      clearInterval(this.timer);
      console.log(this.timer);
      this.setState({isStarted: false});
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });
    
    // Check if we're at zero.
    if (seconds === 0) { 
      this.setState({isStarted: false});
      clearInterval(this.timer);
    }
  }


  handleSecondChange(event) {
    const time = Object.assign({},this.state.time);
    time.s = Number(event.target.value);
    this.setState({time: time});
    // componentDidMount();

  }
  handleTimeChange(event) {
    const time = Object.assign({},this.state.time);
    (event.target.name === "hours") ? (time.h = Number(event.target.value)):(time.m = Number(event.target.value));
    this.setState({time: time});  
  }

  handleFocus(event){
    event.target.select();
  }

  render() {
    const status = (this.state.isStarted) ? 'Stop' : 'Start'
    return(
      <div>
        <div>
          <input type="text" name="hours" value = {this.state.time.h} onChange={this.handleTimeChange.bind(this)} onFocus={this.handleFocus.bind(this)}/>
          h
          <input type="text" name="minutes" value = {this.state.time.m} onChange={this.handleTimeChange.bind(this)} onFocus={this.handleFocus.bind(this)}/>
          min
          <button onClick={this.handleTimer.bind(this)}>{status}</button>
        </div>
        <div>
          {minTwoDigits(this.state.time.h)}:{minTwoDigits(this.state.time.m)}:{minTwoDigits(this.state.time.s)}
        </div>
        <div>
          {this.renderVisualCountdown()}
        </div>

      </div>
    );
  }
}

function minTwoDigits(n) {
  return (n < 10 ? '0' : '') + n;
}

// ========================================
ReactDOM.render(
  <Example />,
  document.getElementById('root')
);