import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { Navigate } from "react-router-dom";
import { isEmail } from "validator";
import { withRouter } from '../services/common';
import axios from 'axios';
import { API_URL } from '../services/common.js';

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const email = value => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const role = value => {
  if (value!=="user" && value!=="admin") {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid role.
      </div>
    );
  }
};

const vpassword = value => {
  if (value.length < 3 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 3 and 40 characters.
      </div>
    );
  }
};

class Register extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeRole = this.onChangeRole.bind(this);

    this.state = {
      email: "",
      password: "",
      role: "",
      successful: false,
      message: "",
      redirect: "",
      showAdminPages: false,
      currentUser: undefined,
    };
  }

  register(email, password, role) {
    console.log(role)
    return axios.post(API_URL + "auth/register",
    {
      email,
      password,
      role
    }, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}` }
    })
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  onChangeRole(e) {
    this.setState({
      role: e.target.value
    });
  }

  handleRegister(e) {
    e.preventDefault();

    this.setState({
      message: "",
      successful: false
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      this.register(
        this.state.email,
        this.state.password,
        this.state.role
      ).then(
        (response) => {
          if (response.data.token) {
            // const user = {
            //   id: response.data.user._id
            // }
            // localStorage.setItem("user", JSON.stringify(user));
          }
          this.props.router.navigate("/");
          window.location.reload();
          return response.data;
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            successful: false,
            message: resMessage
          });
        }
      );
    }
  }

  componentDidMount() {
    if(!localStorage.getItem('user')) {this.setState({ redirect: "/" });}
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.setState({
        showAdminPages: user.role.includes("admin"),
        currentUser: user,
      });
      // console.log(user);
    }

    if (!user || user.role.includes("user")) this.setState({ redirect: "/" });
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }
    return (
      <div className="col-md-12">
        <div className="card card-container px-3 py-5">
          <h2>Register</h2>
          <br />

          <Form
            onSubmit={this.handleRegister}
            ref={c => {
              this.form = c;
            }}
          >
            {!this.state.successful && (
              <div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChangeEmail}
                    validations={[required, email]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Input
                    type="password"
                    className="form-control"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChangePassword}
                    validations={[required, vpassword]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="role"
                    value={this.state.role}
                    onChange={this.onChangeRole}
                    validations={[required, role]}
                  />
                </div>

                <div className="form-group">
                  <button className="btn btn-primary btn-block">Sign Up</button>
                </div>
              </div>
            )}

            {this.state.message && (
              <div className="form-group">
                <div
                  className={
                    this.state.successful
                      ? "alert alert-success"
                      : "alert alert-danger"
                  }
                  role="alert"
                >
                  {this.state.message}
                </div>
              </div>
            )}
            <CheckButton
              style={{ display: "none" }}
              ref={c => {
                this.checkBtn = c;
              }}
            />
          </Form>
        </div>
      </div>
    );
  }
}

export default withRouter(Register);
