import React, { Component } from 'react';
import './css/Tweet.css';

/**
 * Models a tweet element for the live feed.
 * Takes one prop
 * @author Olivia
 */
class Tweet extends Component {
    render() {
        return (
            <div className="tweet">
                <img className="tweet-image" src={this.props.image} alt="Tweet Author"/>
                <div className="tweet-author">{this.props.author}</div>
                <div className="tweet-text">{this.props.text}</div>
            </div>
        );
    }
}

export default Tweet;