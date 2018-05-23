import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Beep from './beep-sound.mp3';
import IntervalImg from './intervals.svg';

function VisualCountdown (props){  
  return(
    <svg width="315" height="315">
      <path id="arc1" fill="none" stroke="#FF4136" strokeWidth="157.5" d={props.value} />
    </svg>
  );
}

class VisualCountdownIntervals extends React.Component {
  constructor(props) {
    super(props);
    this.state = { time: {}, seconds: null, isStarted: false, interval: 1, countdownStatus: 'stopped', originalTime: {time: {h:0, m:0, s:0}, seconds: null}}; // paused, started, stopped
    this.timer = 0;
    this.handleButtonTimer = this.handleButtonTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.renderVisualCountdown = this.renderVisualCountdown.bind(this);
    this.VisualCountdownInfo = "";
    // this.state.originalTime: {time: {h:0, m:0, s:0}, seconds: null};
    this.totalIntervals = 1;
    this.intervalText = "interval";
    this.intervalsText = "intervals";
  }

  // Functions for visual circle graphic
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
    let angle = this.state.seconds*360.0/this.state.originalTime.seconds;
    this.VisualCountdownInfo = (this.state.countdownStatus === 'stopped' || angle === 360) ? this.describeArc(157.5, 157.5, 78.75, 0, 359.99) : this.describeArc(157.5, 157.5, 78.75, 0, angle);
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

  handleButtonTimer() {
    switch (this.state.countdownStatus) {

      case 'stopped':
        let originalSeconds = this.state.originalTime.time.h*3600+this.state.originalTime.time.m*60+this.state.originalTime.time.s;
        if(originalSeconds) {
          let originalTime = Object.assign({}, this.state.originalTime);
          originalTime.seconds = originalSeconds;
          this.setState({time: this.state.originalTime.time, seconds: originalSeconds});
          this.setState({originalTime: originalTime});
          this.setState({interval:1});
          this.timer = setInterval(this.countDown, 1000);
          this.setState({countdownStatus: 'started'});
        }
        
        break;

      case 'paused':
        this.timer = setInterval(this.countDown, 1000);
        this.setState({countdownStatus: 'started'});
        break;

      case 'started':
        clearInterval(this.timer);
        this.setState({countdownStatus: 'paused'});
        
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
      if (this.state.interval === this.totalIntervals) { // Intervals over
        document.getElementById('audioplayer').play();
        this.setState({countdownStatus: 'stopped'});
        clearInterval(this.timer);
        this.setState({interval: 1});        
      }
      else { // More intervals to go
        document.getElementById('audioplayer').play();
        this.setState({seconds: this.state.originalTime.seconds}, this.componentDidMount());
        this.addInterval();

      }
    }
  }

  addInterval = () =>{
    this.setState(prevState => {
       return {interval: prevState.interval + 1}
    })
  }

  handleTimeChange(event) {
    const originalTime = Object.assign({},this.state.originalTime);
    switch (event.target.name) {
      case 'hours':
        originalTime.time.h = Number(event.target.value);
        break;
      case 'minutes':
        originalTime.time.m = Number(event.target.value);
        break;
      case 'seconds':
        originalTime.time.s = Number(event.target.value)
    }

    this.setState({originalTime: originalTime});
    console.log(this.state.originalTime);
  }

  handleIntervalChange(event) {
    this.totalIntervals = Math.max(Number(event.target.value),1);
  }
  // handleFocus(event){
  //   event.target.select();
  // }
  // onFocus={this.handleFocus.bind(this)}

  render() {
    const status = (this.state.countdownStatus === 'started') ? 'PAUSE' : 'START';
    return(
      <div id="container">
        
        <div id="information">
          <div id="title">
            VISUAL COUNTDOWN +INTERVALS
          </div>
          <div id="userInput">
            <div id="inputTime">
              <i className="far fa-clock"></i>
              <input type="number" min="0" name="hours" placeholder="h" spellCheck="false" autoComplete="off" onChange={this.handleTimeChange.bind(this)}/> 
              :
              <input type="number" min="0" name="minutes" placeholder="m" spellCheck="false" autoComplete="off" onChange={this.handleTimeChange.bind(this)}/>
              :
              <input type="number" min="0" name="seconds" placeholder="s" spellCheck="false" autoComplete="off" onChange={this.handleTimeChange.bind(this)}/>
            </div>
            <div id="inputInterval">
              <img src={IntervalImg} width="25px" height="25px" alt="interval-icon"></img>
              <input type="number" min="1" name="intervals" placeholder="1" spellCheck="false" autoComplete="off" onChange={this.handleIntervalChange.bind(this)}/>
              {this.totalIntervals > 1 ? this.intervalsText : this.intervalText}
            </div>
          </div>
          <div id="startButton">
            <button onClick={this.handleButtonTimer.bind(this)}>{this.state.countdownStatus === 'stopped' ||  this.state.countdownStatus === 'paused'? <i className="far fa-play-circle"></i> : <i className="far fa-pause-circle"></i>}{status}</button>
          </div>
          <div id="countdownInfo">
            <div id="countdownTimer">
              {this.state.countdownStatus === 'stopped' ? null : minTwoDigits(this.state.time.h) + ':' + minTwoDigits(this.state.time.m) + ':' + minTwoDigits(this.state.time.s)}
            </div>
            <div id="countdownInterval">
              {this.state.countdownStatus === 'stopped' ? null : this.state.interval + "/" + this.totalIntervals}
            </div>
          </div>
        </div>
       
        <div id="visualCountdown">
          {this.renderVisualCountdown()}
        </div>

        <audio id='audioplayer' src={Beep} ></audio>

      </div>
    );
  }
}

function minTwoDigits(n) {
  return (n < 10 ? '0' : '') + n;
}

// ========================================
ReactDOM.render(
  <VisualCountdownIntervals />,
  document.getElementById('root')
);