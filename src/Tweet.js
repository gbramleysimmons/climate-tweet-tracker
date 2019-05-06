import React, { Component } from 'react';
import './css/Tweet.css';

/**
 * Models a tweet element for the live feed.
 * Takes one prop
 * @author Olivia
 */
class Tweet extends Component {
	constructor(props) {
        super(props);
        this.state = {
            image: null
        }
    }

    componentDidMount() {
    	if (this.props.image) {
    		this.setState({image: this.props.image});
    	}
    	else {
    		this.setState({image: "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"});
    	}
    }

    render() {
        return (
            <div className="tweet">
                <img className="tweet-image" src={this.state.image} alt="Tweet Author"/>
                <div className="tweet-author">{this.props.author}</div>
                <div className="tweet-text">{this.props.text}</div>
            </div>
        );
    }
}

export default Tweet;