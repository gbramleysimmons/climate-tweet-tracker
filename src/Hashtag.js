import React, { Component } from 'react';
import './css/Hashtag.css';

/**
 * Models a hashtag element for the bottom hashtag bar.
 * Takes one prop
 * @author Grace
 */
class Hashtag extends Component {

    constructor(props) {
        super(props);
        const color = this.generate_color();
        this.state = {
            selected: false,
            color: color,
            curr_color: color.main
        }
    }

    /**
     * Generates a random pair of main and selected colors from a fixed list.
     * @returns {{main, selected}|*}
     */
    generate_color = () => {
        if (this.props.number === 0) {
            return {main: "#808080", selected: "#2E76AE"};
        }
        else if (this.props.number === 1) {
            return {main: "#808080", selected: "#FA802D"};
        }
        else if (this.props.number === 2) {
            return {main: "#808080", selected: "#3C9E2C"};
        }
        else if (this.props.number === 3) {
            return {main: "#808080", selected: "#D52B1E"};
        }
        else {
            return {main: "#808080", selected: "black"};
        }
    };


    /**
     * Records whether the hashtag is selected or not. Changes the current color based on whether or not the hashtag is
     * selected
     */
    on_click = () => {
        if (!this.state.selected)  {
            this.setState({selected: true, curr_color: this.state.color.selected});
            this.props.toggleSelect(this.props.hashtag, true);

        } else {
            this.setState({selected: false, curr_color: this.state.color.main});
            this.props.toggleSelect(this.props.hashtag, false);

        }


    };


    render() {
        //determines the correct class name based on whether or not the hashtag is currently selected
        let class_name = this.state.selected ? "selected": "unselected";
        class_name = "Hashtag " + class_name;
        return (
            <div className={class_name} onClick={this.on_click} style={{background: this.state.curr_color}}>
                #{this.props.hashtag}
            </div>
        );
    }
}

export default Hashtag;
