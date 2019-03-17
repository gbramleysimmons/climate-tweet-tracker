import React, { Component } from 'react';
import './css/HashtagContainer.css';
import Hashtag from "./Hashtag";

/**
 * Wrapper for the hashtags
 * Expects one prop: hashtags, which is a list of hashtags
 * @author Grace
 */
class HashtagContainer extends Component {
    render() {
        return (
            <div className="hashtags">
                {this.props.hashtags.map(ele => {
                    return <Hashtag hashtag={ele}/>;
                })}
            </div>
        );
    }
}

export default HashtagContainer;
