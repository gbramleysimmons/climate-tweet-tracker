import React, { Component } from 'react';
import "./css/Console.css";


class Console extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayHashtags: ["display"],
            trackHashtags: ["test"],
            editingTracking: false,
            editingDisplay: false,
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
    };


    addSubmitDisplay = (event)=> {
        event.preventDefault();
        this.addToDisplay(event.target[0].value);
    };


    render() {
        return (
            <div className="Console">
                <div className={"current"}>
                    <h3> Current Hashtags Being Tracked: </h3>
                    {this.state.editingTracking ?
                        <div>
                            {this.state.trackHashtags.map(ele => {
                                return <div className={"hashtag-curr"} >#{ele}
                                <button onClick={() => this.removeFromTracking(ele)}
                                        className={"remove-button"}>X</button> </div>
                            })}
                            <form onSubmit={this.addSubmitTracking}>
                                <input id={"tracking-input"} type={"text"} placeholder={"Add hashtags to track"}/>
                                <input type={"submit"} value={"Add"}/>
                            </form>
                        </div> :<div>
                            {this.state.trackHashtags.map(ele => {
                                return <div className={"hashtag-curr"} >#{ele}</div>
                            })}
                            <button className={"admin-button"} onClick={this.toggleTracking} id={"edit-button"}>Edit</button>
                        </div>

                            }

                </div>

                <div className={"display"}>
                    <h3>  Current Hashtags Being Displayed: </h3>
                    {this.state.editingDisplay ?
                        <div>
                            {this.state.displayHashtags.map(ele => {
                                return <div className={"hashtag-curr"} >#{ele}
                                    <button onClick={() => this.removeFromDisplay(ele)}
                                            className={"remove-button"}>X</button> </div>
                            })}
                            <form onSubmit={this.addSubmitDisplay}>
                                <input id={"display-input"} type={"text"} placeholder={"Add hashtags to track"}/>
                                <input type={"submit"} value={"Add"}/>
                            </form>
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