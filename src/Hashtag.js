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
        const possible_colors = [{main: "#3980c6", selected: "#3375b7"}, {main: "#238e57", selected: "#1d7c4c"},
            {main: "#1d787c", selected: "#18676b"}, {main: "#368e46", selected: "#368e46"}];
        return possible_colors[Math.floor(Math.random() * 4)];
    };


    /**
     * Records whether the hashtag is selected or not. Changes the current color based on whether or not the hashtag is
     * selected
     */
    on_click = () => {
        this.setState({selected: !this.state.selected});
        this.state.selected ? this.setState({curr_color: this.state.color.selected}):
            this.setState({curr_color: this.state.color.main})
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