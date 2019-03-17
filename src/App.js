import React, { Component } from 'react';
import './css/App.css';
import HashtagContainer from "./HashtagContainer";
import Graph from "./Graph";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div class="wrapper">
          <Graph />
        <HashtagContainer hashtags={["Lorem", "Ipsum", "Sin", "Dolor"]}/>
        </div>
      </div>
    );
  }
}
export default App;
