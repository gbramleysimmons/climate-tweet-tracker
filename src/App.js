import React, { Component } from 'react';
import './css/App.css';
import HashtagContainer from "./HashtagContainer";
import Graph from "./Graph";
import TweetContainer from "./TweetContainer";
import io from 'socket.io-client';
import Login from './Login';
import Console from "./Console";
//import * as d3 from "d3";

const socket = io.connect('http://localhost:8000');

socket.emit('displayData');
/*socket.on('data', function(displayData){
    console.log(displayData);
    for (var t in displayData) {
        console.log("t:"+t);
    }
});
socket.on('incomingFreq', function(freqData) {
    let hashtags = freqData.hashtags; // returns a list of hashtags with certain length.
    let dates = freqData.dates;
    let now = freqData.now; // minute of now
    let start = freqData.start; // minute of start (where the data starts)
    let interval = freqData.interval; // one minute
    let minutes = freqData.minutes; // used to index into the array
    for (let hashtag in hashtags) {
        for (let minute in minutes) {
            //freqData.data[hashtag][minute]; // index into 2D array
        }
    }
});*/

socket.on('data', function(displayData){
    console.log(displayData);
    formatData(displayData);
});

function formatData(data) {
    let hashtags = [];
    for (let t in data) {
        if (hashtags.indexOf(data[t].hashtag) === -1)
          hashtags.push(data[t].hashtag);
    }
    let myData = "date";
    for (let x in hashtags) {
      myData = myData + " #" + hashtags[x];
    }
    myData += "\n";
    console.log(myData);
}

let tweets = [
    {
        image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        author: "Author 1",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
        image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        author: "Author 2",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec molestie vehicula ornare."
    },
    {
        image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        author: "Author 3",
        text: "Lorem ipsum."
    },
    {
        image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        author: "Author 4",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec molestie vehicula ornare. Nam ac sapien et sem viverra consectetur at vel lacus. Donec cursus commodo viverra."
    },
    {
        image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        author: "Author 5",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec molestie vehicula ornare."
    },
    {
        image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        author: "Author 6",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec molestie vehicula ornare. Nam ac sapien et sem viverra consectetur at vel lacus. Donec cursus commodo viverra."
    }
];

class App extends Component {
  constructor(props) {
      super(props);
      this.offsetW = 0;
      this.state = {
          login: false,
          authorized: false,
          user: "",
          console: false
      }
  }

  componentDidMount() {
      this.offsetW = document.getElementsByClassName('wrapper-left')[0].offsetWidth;
      console.log("this.offsetW in App.js:" + this.offsetW);
  }

  toggleLogin = () => {
      this.setState({login: !this.state.login});
  };
  authorize = (user) => {
      this.setState({authorized: true, user: user});
      this.toggleLogin();
  };

  toggleConsole = () => {
      this.setState({console: !this.state.console});

  };
  render() {
      console.log("svg:"+ document.getElementById('svg'));
      console.log("this.offsetW in after RENDER:" +this.offsetW);
    return (

      <div className="App">
          {this.state.console ? <Console/>: <div className={"App"}> {this.state.login ? <Login authorize={this.authorize} close={this.toggleLogin}/>: null}
              <div className={"login-link"}>{this.state.authorized ? <span onClick={this.toggleConsole}> Welcome, {this.state.user} </span> : <span onClick={this.toggleLogin}>Admin</span>}</div>
              <div className="wrapper-left">
                  <div className="title-block">
                      <div className="title-text">Climate #Hashtag Tracker</div>
                  </div>
                  <Graph data={[5,10,1,3]} width={this.offsetW} height={500} lines={document.getElementsByClassName('line')} svg={document.getElementById('svg')}/>
                  <HashtagContainer hashtags={["climate", "cats", "pizza", "hi"]}/>
              </div>
              <div className="wrapper-right">
                  <div className="branding-block">
                      <div className="school">Brown University</div>
                      <div className="lab">Climate Development Lab</div>
                  </div>
                  <TweetContainer tweets={tweets}/>
              </div>
          </div>}

      </div>
    );
  }
}
export default App;
export {socket};
