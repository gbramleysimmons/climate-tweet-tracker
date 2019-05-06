import React, { Component } from 'react';
import './css/HashtagContainer.css';
import Hashtag from "./Hashtag";

/**
 * Wrapper for the hashtags
 * Expects one prop: hashtags, which is a list of hashtags
 * @author Grace
 */
class HashtagContainer extends Component {
	constructor(props) {
        super(props);
        this.state = {
            selectedHashtags: this.props.hashtags.reduce(
		    (hashtags, selected) => ({
		      ...hashtags,
		      [selected]: true
		    }),
		    {}
		  )
        }
    }

    toggleSelect = (hashtag, selected) => {
	  let hashtags = this.state.selectedHashtags;
	  hashtags[hashtag] = selected;
	  this.setState({selectedHashtags: hashtags});
	};

    render() {
        return (
            <div className="hashtags">
                {this.props.hashtags.map(ele => {
                    return <Hashtag hashtag={ele} toggleSelect={this.toggleSelect}/>;
                })}
            </div>
        );
    }
}

export default HashtagContainer;
