import React, { Component } from 'react';
import "./css/Console.css";
import {socket} from "./App.js";


class Console extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayHashtags: this.props.displaying,
            trackHashtags: this.props.tracking,
            editingTracking: false,
            editingDisplay: false,
            displayError: ""
        }
    }

    removeFromTracking = (toRemove) => {

        let hashtags = this.state.trackHashtags.filter(ele => (ele !== toRemove));
        this.setState({trackHashtags: hashtags});

    };

    removeFromDisplay = (toRemove) => {

        let hashtags = this.state.displayHashtags.filter(ele => (ele !== toRemove));
        this.setState({displayHashtags: hashtags});

    };

    addToTracking = (ele) => {

        let hashtags = this.state.trackHashtags;
        hashtags.push(ele);
        this.setState({trackHashtags: hashtags});

    };

    addToDisplay = (ele) => {
        let hashtags = this.state.displayHashtags;
        hashtags.push(ele);
        this.setState({displayHashtags: hashtags});

    };

    toggleTracking = () => {
        this.setState({editingTracking: !this.state.editingTracking});
    };

    toggleDisplay = () => {
        this.setState({editingDisplay: !this.state.editingDisplay});

    };

    addSubmitTracking = (event)=> {
        event.preventDefault();
        this.addToTracking(event.target[0].value);
        event.target.reset();

    };


    addSubmitDisplay = (event)=> {
        event.preventDefault();

        console.log(this.state.trackHashtags);
        console.log(event.target[0].value in this.state.trackHashtags);
        if (this.state.trackHashtags.includes(event.target[0].value)) {
            this.setState({displayError: ""});
            this.addToDisplay(event.target[0].value);


        } else {
            this.setState({displayError: "Error: hashtag not currently being tracked"});
            return;

        }
        event.target.reset();

    };


    confirmDisplay = () => {
        this.toggleDisplay();
        console.log("confirm!!" + this.state.displayHashtags);
        socket.emit("setDisplayed", this.state.displayHashtags);

    };

    confirmTracking = () => {
        this.toggleTracking();
        socket.emit("setTracked", this.state.trackHashtags);

    };


    render() {
        console.log(this.props);
        return (
            <div className="Console">
                <h1>Admin Console</h1>
                <div className={"back-button"} onClick={this.props.close}>Back to dashboard</div>
                <div className={"current track"}>
                    <h3> Current Hashtags Being Tracked: </h3>
                    {this.state.editingTracking ?
                        <div>
                            {this.state.trackHashtags.map(ele => {
                                return <div className={"hashtag-curr"} ><button onClick={() => this.removeFromTracking(ele)}
                                                                                className={"remove-button"}>X</button>  #{ele}
                                </div>
                            })}
                            <form className={"submit-form"} onSubmit={this.addSubmitTracking}>

                                <input id={"tracking-input"} type={"text"} placeholder={"Add hashtags to track"}/>
                                <input type={"submit"} value={"Add"}/>
                            </form>

                            <button className={"admin-button"} onClick={this.confirmTracking}>Confirm</button>

                        </div> :<div>
                            {this.state.trackHashtags.map(ele => {
                                return <div className={"hashtag-curr"} >#{ele}</div>
                            })}
                            <button className={"admin-button"} onClick={this.toggleTracking} id={"edit-button"}>Edit</button>
                        </div>

                            }

                </div>

                <div className={"current display"}>
                    <h3>  Current Hashtags Being Displayed: </h3>
                    {this.state.editingDisplay ?
                        <div>
                            {this.state.displayHashtags.map(ele => {
                                return <div className={"hashtag-curr"} > <button onClick={() => this.removeFromDisplay(ele)}
                                                                                 className={"remove-button"}>X</button> #{ele}
                                    </div>
                            })}
                            <form onSubmit={this.addSubmitDisplay} className={"submit-form"}>
                                <input id={"display-input"} type={"text"} placeholder={"Add hashtags to track"}/>
                                <input type={"submit"} value={"Add"}/>
                            </form>
                            <div className={"display-error"}> {this.state.displayError} </div>
                            <button className={"admin-button"}onClick={this.confirmDisplay}>Confirm</button>
                        </div> :<div>
                            {this.state.displayHashtags.map(ele => {
                                return <div className={"hashtag-curr"} >#{ele}</div>
                            })}
                            <button className={"admin-button"} onClick={this.toggleDisplay} id={"edit-button"}>Edit</button>

                        </div>

                    }
            </div>
            </div>
        );
    }


}
export default Console;