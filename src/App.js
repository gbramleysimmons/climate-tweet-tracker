import React, { Component } from 'react';
import './css/App.css';
import HashtagContainer from "./HashtagContainer";
import Graph from "./Graph";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="wrapper-left">
          <div className="title-block">
            <div className="title-text">Climate #Hashtag Tracker</div>
          </div>
          <Graph />
          <HashtagContainer hashtags={["Lorem", "Ipsum", "Sin", "Dolor"]}/>
        </div>
        <div className="wrapper-right">
          <div className="branding-block">
            <div className="school">Brown University</div>
            <div className="lab">Climate Development Lab</div>
          </div>
          <div className="Update"> {/* @Olivia: this div classNameshould be converted to a React Component */}
          </div>
        </div>
      </div>
    );
  }
}
export default App;
