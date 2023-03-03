import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { withRouter } from "../services/common";
import axios from 'axios';

const API_URL = 'http://localhost:3000/';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      contacts: [],
      currentUser: { email: "" }
    };
  }

  componentDidMount() {
    const currentUser = JSON.parse(localStorage.getItem('user'));;

    if (!currentUser) this.setState({ redirect: "/login" });
    this.setState({ currentUser: currentUser, userReady: true })

    axios.get(API_URL + 'contact/all').then(
      response => {
        this.setState({
          contacts: response.data
        });
        console.log(response.data)
      },
      error => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    } 

    return (
      <div className="container">
        <h1>Home Page</h1>
        <p>{this.state.currentUser.email}</p>
      </div>
    );
  }
}

export default withRouter(Home);