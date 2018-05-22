import React from 'react';
import ReactDOM from 'react-dom';
import Sound from 'react-sound';
import './index.css';
import Beep from './beep-sound.mp3';

function VisualCountdown (props){  
  return(
    <svg width="400" height="400">
      <path id="arc1" fill="none" stroke="#446688" strokeWidth="200" d={props.value} />
    </svg>
  );
}

class VisualCountdownIntervals extends React.Component {
  constructor(props) {
    super(props);
    this.state = { time: {}, seconds: null, isStarted: false, interval: 1, countdownStatus: 'stopped', playStatus: Sound.status.STOPPED}; // paused, started, stopped
    this.timer = 0;
    this.handleButtonTimer = this.handleButtonTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.renderVisualCountdown = this.renderVisualCountdown.bind(this);
    this.VisualCountdownInfo = "";
    this.originalTime = {time: {h:0, m:0, s:0}, seconds: null};
    this.totalIntervals = 1;
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
    let angle = this.state.seconds*360.0/this.originalTime.seconds;
    this.VisualCountdownInfo = (this.state.countdownStatus === 'stopped' || angle === 360) ? this.describeArc(200, 200, 100, 0, 359.99) : this.describeArc(200, 200, 100, 0, angle);
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
        let originalSeconds = this.originalTime.time.h*3600+this.originalTime.time.m*60+this.originalTime.time.s;
        if(originalSeconds) {
          this.setState({time: this.originalTime.time, seconds: originalSeconds});
          this.originalTime.seconds = originalSeconds;
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
    // let mySound = new Audio('../audio/beep-sound.mp3');
    // mySound.play();

    // document.getElementById('audioplayer').play();
    
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
        // this.setState({playStatus: Sound.status.PLAYING});
      }
      else { // More intervals to go
        document.getElementById('audioplayer').play();
        this.setState({seconds: this.originalTime.seconds}, this.componentDidMount());
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
    const time = Object.assign({},this.originalTime.time);
    switch (event.target.name) {
      case 'hours':
        time.h = Number(event.target.value);
        break;
      case 'minutes':
        time.m = Number(event.target.value);
        break;
      case 'seconds':
        time.s = Number(event.target.value)
    }

    this.originalTime.time = time;
    console.log(this.originalTime.time);
  }

  handleIntervalChange(event) {
    this.totalIntervals = Number(event.target.value);
    this.setState({interval:1});
  }
  handleFocus(event){
    event.target.select();
  }

  render() {
    const status = (this.state.countdownStatus === 'started') ? 'Pause' : 'Start';
    return(
      <div>

        <div>
          <div>
            <input type="number" min="0" name="hours" value = {this.originalTime.h} onChange={this.handleTimeChange.bind(this)} onFocus={this.handleFocus.bind(this)}/>
            :
            <input type="number" min="0" name="minutes" value = {this.originalTime.m} onChange={this.handleTimeChange.bind(this)} onFocus={this.handleFocus.bind(this)}/>
            :
            <input type="number" min="0" name="seconds" value = {this.originalTime.s} onChange={this.handleTimeChange.bind(this)} onFocus={this.handleFocus.bind(this)}/>
          </div>
          <div>
            <input type="number" min="1" name="intervals" value = {this.totalIntervals} onChange={this.handleIntervalChange.bind(this)} onFocus={this.handleFocus.bind(this)}/>
            intervals
          </div>
          <div>
            <button onClick={this.handleButtonTimer.bind(this)}>{status}</button>
          </div>
        </div>
       
        <div>
          {this.renderVisualCountdown()}
        </div>

        <div>
          <div>
            {this.state.countdownStatus === 'stopped' ? null : minTwoDigits(this.state.time.h) + ':' + minTwoDigits(this.state.time.m) + ':' + minTwoDigits(this.state.time.s)}
          </div>
          <div>
            {this.state.countdownStatus === 'stopped' ? null : this.state.interval + "/" + this.totalIntervals}
          </div>
        </div>

        <Sound
          url={Beep}
          playStatus={this.state.playStatus} 
          autoload='true'
        /> 
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