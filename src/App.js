import React, { Component } from 'react';
import './css/App.css';
import HashtagContainer from "./HashtagContainer";
import Graph from "./Graph";
import TweetContainer from "./TweetContainer";
import io from 'socket.io-client';
import Login from './Login';
import Console from "./Console";

const socket = io.connect('http://localhost:8000');

function formatData(data) {
    let hashtags = [];
    for (let t in data) {
      if (hashtags.indexOf(data[t].hashtag) === -1)
        hashtags.push(data[t].hashtag);
    }
    let myData = [];
    let row1 = ["date"];
    for (let x in hashtags) {
      row1.push("#" + hashtags[x]);
    }
    myData.push(row1);
    let intervalSet = new Set();
    let count = 0;
    for (let t in data) {
      let dateString = parseDateString(data[t].date);
      if (!(intervalSet.has(dateString))) {
        intervalSet.add(dateString);
        let rowToAdd = [dateString];
        for (let i = 0; i < hashtags.length; i++) {
          rowToAdd.push(0);
        }
        myData.push(rowToAdd);
        count++;
        let index = hashtags.indexOf(data[t].hashtag);
        myData[count][index+1]++;
      }
      else {
        let index = hashtags.indexOf(data[t].hashtag);
        myData[count][index+1]++;
      }
    }
    return dataToString(myData);
}

function parseDateString(tweetDate) {
    let dateObj = new Date(tweetDate);
    let dateString = "";
    let year = dateObj.getFullYear();
    let month = ("0" + (dateObj.getMonth()+1)).slice(-2);
    let date = dateObj.getDate();
    let hour = ("0" + dateObj.getHours()).slice(-2);
    let minutes = dateObj.getMinutes();
    let minutesRounded = ("0" + roundMinutes(minutes)).slice(-2);
    dateString += year + month + date + hour + minutesRounded;
    return dateString;
}

function roundMinutes(minutes) {
    let roundedDate = Math.floor(minutes / 5) * 5;
    return roundedDate;
}

function dataToString(data) {
  let dataString = "";
  for (let i = 0; i < data.length; i++) {
    dataString += data[i].join(" ") + "\n";
  }
  return dataString;
}

function formatTweets(data) {
  let tweetList = [];
  for (let t in data) {
    let tweetObj = {};
    tweetObj["image"] = data[t].picture;
    tweetObj["author"] = data[t].author;
    tweetObj["text"] = data[t].contents;
    tweetList.push(tweetObj);
  }
  return tweetList;
}

class App extends Component {
  constructor(props) {
      super(props);
      this.offsetW = 0;
      this.state = {
          login: false,
          authorized: false,
          user: "",
          console: false,
          tweets: [],
          data: ""
      }
  }

  componentDidMount() {
      this.offsetW = document.getElementsByClassName('wrapper-left')[0].offsetWidth;
      console.log("this.offsetW in App.js:" + this.offsetW);
      socket.emit('updateFeed');
      socket.on('tweetsForFeed', (tweetData) => {
        let tweets = formatTweets(tweetData);
        this.setState({tweets: tweets});
      });
      socket.emit('displayData');
      socket.on('tweetsForGraph', (freqData) => {
          let dataString = formatData(freqData);
          this.setState({data: dataString});
          console.log(dataString);
      });
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
                  <Graph freq={this.state.data} data={[5,10,1,3]} width={this.offsetW} height={500} lines={document.getElementsByClassName('line')} svg={document.getElementById('svg')}/>
                  <HashtagContainer hashtags={["climate", "cats", "pizza", "hi"]}/>
              </div>
              <div className="wrapper-right">
                  <div className="branding-block">
                      <div className="school">Brown University</div>
                      <div className="lab">Climate Development Lab</div>
                  </div>
                  <TweetContainer tweets={this.state.tweets}/>
              </div>
          </div>}


      </div>
    );
  }
}
export default App;
export {socket};
