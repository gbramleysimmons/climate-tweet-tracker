import React, { Component } from 'react';
import {socket} from "./App";
import "./css/Login.css";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
        error: "",
        authorized: false,

        }
    }




    login = (event) => {
        console.log("here");
        event.preventDefault();

        const username = event.target[0].value;
        const password = event.target[1].value;

        const toSend = {
            username: username,
            password: password
        };

       socket.emit("authorize", username, password, (res) => {
           const response = JSON.parse(res);
           console.log(response);
           if (response.hasOwnProperty("error")) {
               this.setState({error: response.error});
           } else {
               this.setState({authorized: response.validated})
               if (response.validated) {
                   this.props.authorize(username);
               }
           }

       })

    };

    render() {
        return (
            <div className="Login">
                <h1>Login</h1>
                <form className={"login-form"} onSubmit={this.login}>
                    {/*<button className={"close-button"} onClick={this.props.close}>X </button>*/}
                    <input type={"text"} className={"login-input"} placeholder={"Username"} autoComplete={"off"} />
                    <input type={"password"} className={"login-input"} placeholder={"Password"} />
                    <input type={"submit"} value={"Login"}/>
                </form>
                <div className={"error"}>{this.state.error}</div>
            </div>

        );
    }
}
export default Login;