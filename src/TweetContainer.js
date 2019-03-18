import React, { Component } from 'react';
import './css/TweetContainer.css';
import Tweet from "./Tweet";

/**
 * Wrapper for the tweet
 * Expects one prop: tweets, which is a list of tweets with content and authors
 * @author Olivia
 */
class TweetContainer extends Component {
    render() {
        return (
            <div className="tweet-feed">
            	<div className="header">Real-Time</div>
            	<div className="tweets">
	            	{this.props.tweets.map(ele => {
	                    return <Tweet image={ele.image} author={ele.author} text={ele.text}/>;
	                })}
	            </div>
            </div>
        );
    }
}

export default TweetContainer;