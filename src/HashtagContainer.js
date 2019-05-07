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
		      [selected]: false
		    }),
		    {}
		  )
        }
    }

    toggleSelect = (hashtag, selected) => {
	  let hashtags = this.state.selectedHashtags;
	  hashtags[hashtag] = selected;
	  this.setState(
          {selectedHashtags: hashtags},
          this.props.callbackFromParent(hashtags)
          );
	  //console.log("HASHTAGS: "+Object.keys(hashtags));
	};

    render() {
        return (
            <div className="hashtags">
                {this.props.hashtags.map((ele, i) => {
                    return <Hashtag hashtag={ele} number={i} toggleSelect={this.toggleSelect}/>;
                })}
            </div>
        );
    }
}

export default HashtagContainer;
