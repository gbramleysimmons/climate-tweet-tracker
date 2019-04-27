import React, { Component } from 'react';


class Console extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="Console">
                <div className={"current"}>
                    Current Hashtags Being Tracked:
                    <button id={"edit-button"}> Edit</button>
                </div>
                <form className={"hashtag-form"}>
                   Add Hashtags to Track: <input type={"text"} id={"hashtag-input"}/>
                </form>
                <button className={"csv-download"}>Export database to a CSV file</button>

            </div>
        );
    }


}
export default Console;