import React, { Component } from 'react';
import './css/App.css';
import HashtagContainer from "./HashtagContainer";
import Graph from "./Graph";
import TweetContainer from "./TweetContainer";
import io from 'socket.io-client';
import Login from './Login';
import Console from "./Console";
import ReactLoading from 'react-loading';
import logo from './img/cdllogo2.png';


let host = new URL(window.location.href);
host.port = 8000;//deployed
console.log(host.toString());
const socket = io.connect(host.toString());

class App extends Component {
  constructor(props) {
      super(props);
      this.offsetW = 0;
      this.state = {
          isLoading: true,
          login: false,
          authorized: false,
          user: "",
          console: false,
          tweets: [],
          data: "",
          tracking: [],
          displaying: [],
          hashtags: {}
      }
  }

  componentDidMount() {
      setTimeout(() => this.setState({ isLoading: false }), 800);
      //this.offsetW = document.getElementsByClassName('wrapper-left')[0].offsetWidth;
      console.log("this.offsetW in App.js:" + this.offsetW);
      socket.on("updateHashtags", (received) => {
          const data = JSON.parse(received);
          this.setState({tracking: data.tracked, displaying: data.displayed})
          this.updateFeed(data.displayed);
          this.updateGraph(data.displayed);
          /*let hashtagMap = data.displayed.reduce(
            (hashtags, selected) => ({
              ...hashtags,
              [selected]: true
            }),
            {}
          )
          this.setState({hashtags: hashtagMap});*/
      });
  }

  updateFeed = (hashtags) => {
      socket.emit('updateFeed', hashtags);
      socket.on('tweetsForFeed', (tweetData) => {
        let tweets = this.formatTweets(tweetData);
        this.setState({tweets: tweets});
      });
  };

  updateGraph = (hashtags) => {
      socket.emit('displayData', hashtags);
      socket.on('tweetsForGraph', (freqData) => {
          let dataString = this.formatData(freqData);
          this.setState({data: dataString});
      });
  };

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

  myCallback = (hashtags) => {
    console.log("hashtags from App.js line 129: "+hashtags);
    this.setState( {hashtags: hashtags} );
  };

  formatData = (data) => {
    let hashtags = this.state.displaying;
    let myData = [];
    let row1 = ["date"];
    for (let x in hashtags) {
      row1.push("#" + hashtags[x]);
    }
    myData.push(row1);
    let intervalSet = new Set();
    let count = 0;
    for (let t in data) {
      let dateString = this.parseDateString(data[t].date);
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
    console.log(myData);
    return this.dataToString(myData);
  };

  parseDateString = (tweetDate) => {
    let dateObj = new Date(tweetDate);
    let dateString = "";
    let year = dateObj.getFullYear();
    let month = ("0" + (dateObj.getMonth()+1)).slice(-2);
    let date = ("0" + (dateObj.getDate()+1)).slice(-2);
    let hour = ("0" + dateObj.getHours()).slice(-2);
    let minutes = dateObj.getMinutes();
    let minutesRounded = ("0" + this.roundMinutes(minutes)).slice(-2);
    dateString += year + month + date + hour + minutesRounded;
    return dateString;
  };

  roundMinutes = (minutes) => {
    let roundedDate = Math.floor(minutes / 5) * 5;
    return roundedDate;
  };

  dataToString = (data) => {
    let dataString = "";
    for (let i = 0; i < data.length; i++) {
      dataString += data[i].join("\t") + "\n";
    }
    return dataString;
  };

  formatTweets = (data) => {
    let tweetList = [];
    for (let t in data) {
      let tweetObj = {};
      tweetObj["image"] = data[t].picture;
      tweetObj["author"] = data[t].author;
      tweetObj["text"] = data[t].contents;
      tweetList.push(tweetObj);
    }
    return tweetList;
  };

  render() {
    if((!this.state.data) || this.state.isLoading) {
      return <ReactLoading className={"loading-icon"} type={'spinningBubbles'} color={'white'} height='20%' width='20%'/>; // render the loading component
    }
    return (
      <div className="App">
          {this.state.console ? <Console close={this.toggleConsole} tracking={this.state.tracking} displaying={this.state.displaying}/>: <div className={"App"}> {this.state.login ? <Login authorize={this.authorize} close={this.toggleLogin}/>: null}
              <div className={"login-link"}>{this.state.authorized ? <span onClick={this.toggleConsole}> Welcome, {this.state.user} </span> : <span onClick={this.toggleLogin}>Admin</span>}</div>
              <div className="wrapper-left">
                  <div className="title-block">
                      <div className="title-text">Climate #Hashtag Tracker</div>
                  </div>
                  <Graph freq={this.state.data} width={this.offsetW} height={500} lines={document.getElementsByClassName('line')} svg={document.getElementById('svg')} hashtags={this.state.hashtags}/>
                  <HashtagContainer hashtags={this.state.displaying} callbackFromParent={this.myCallback}/>
              </div>
              <div className="wrapper-right">
                  <div className="branding-wrapper">
                    <div className="logo"><img className="logo-img" src={logo}></img></div>
                    <div className="branding-block">
                        <div className="school">Brown University</div>
                        <div className="lab">Climate Development Lab</div>
                    </div>
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
