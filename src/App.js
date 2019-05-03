import React, { Component } from 'react';
import './css/App.css';
import HashtagContainer from "./HashtagContainer";
import Graph from "./Graph";
import TweetContainer from "./TweetContainer";
import io from 'socket.io-client';
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

socket.on('incomingFreq', function(freqData){
    let dataString = formatData(freqData);
});

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
    console.log(dataToString(myData));
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
  }

  componentDidMount() {
      this.offsetW = document.getElementsByClassName('wrapper-left')[0].offsetWidth;
      console.log("this.offsetW in App.js:" +this.offsetW);
  }

  render() {
      console.log("svg:"+ document.getElementById('svg'));
      console.log("this.offsetW in after RENDER:" +this.offsetW);
    return (
      <div className="App">
        <div className="wrapper-left">
          <div className="title-block">
            <div className="title-text">Climate #Hashtag Tracker</div>
          </div>
          <Graph data={[5,10,1,3]} lines={document.getElementsByClassName('line')} svg={document.getElementById('svg')}/>
          <HashtagContainer hashtags={["climate", "cats", "hi"]}/>
        </div>
        <div className="wrapper-right">
          <div className="branding-block">
            <div className="school">Brown University</div>
            <div className="lab">Climate Development Lab</div>
          </div>
          <TweetContainer tweets={tweets}/>
        </div>
      </div>
    );
  }
}
export default App;
