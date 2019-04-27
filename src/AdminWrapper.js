import React, { Component } from 'react';
import Login from "./Login";
import Console from "./Console.js";

class AdminWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: false
        }
    }
    authenticate = () => {
        this.setState({authenticated: true});
    };

    render() {
        return (
            <div className="AdminWrapper">
                {this.state.authenticated ? <Console/>: <Login/>}
            </div>

        );
    }
}
export default AdminWrapper;