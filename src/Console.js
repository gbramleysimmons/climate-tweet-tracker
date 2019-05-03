import React, { Component } from 'react';


class Console extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayHashtags: ["displat"],
            trackHashtags: ["test"]
        }
    }



    render() {
        return (
            <div className="Console">
                <div className={"current"}>
                    Current Hashtags Being Tracked:
                    {this.state.trackHashtags.map(ele => {
                        return <span>#{ele}</span>
                    })}
                    <button id={"edit-button"}> Edit</button>
                </div>
                <div className={"display"}>
                    Current Hashtags Being Tracked:
                    {this.state.displayHashtags.map(ele => {
                        return <span>#{ele}</span>
                    })}
                    <button id={"edit-button"}> Edit</button>
                </div>
                <button className={"csv-download"}>Export database to a CSV file</button>

            </div>
        );
    }


}
export default Console;