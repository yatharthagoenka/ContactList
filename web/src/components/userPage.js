import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { withRouter } from "../services/common";

class UserPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      currentUser: { email: "" }
    };
  }


  componentDidMount() {
    const currentUser = JSON.parse(localStorage.getItem('user'));;
    this.setState({ 
      currentUser: currentUser
    })

    if (!currentUser) this.setState({ redirect: "/login" });
  }
  
  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }
    return (
        <div className="container">
            <h2>User Index Page</h2>
            <p>Login through an admin account to visit application</p>
        </div>
    );
  }
}

export default withRouter(UserPage);