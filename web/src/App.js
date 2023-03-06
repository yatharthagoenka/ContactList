import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Login from "./components/login";
import Register from "./components/register";
import Home from "./components/home";
import UserPage from "./components/userPage";

const eventBus = {
  on(event, callback) {
    document.addEventListener(event, (e) => callback(e.detail));
  },
  dispatch(event, data) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  },
  remove(event, callback) {
    document.removeEventListener(event, callback);
  },
};

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showUserBoard: false,
      showAdminPages: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.setState({
        showUserBoard: user.role.includes("user"),
        showAdminPages: user.role.includes("admin"),
        currentUser: user,
      });
      // console.log(user);
    }
    
    eventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    eventBus.remove("logout");
  }

  logOut() {
    localStorage.removeItem("user");
    this.setState({
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, showAdminPages } = this.state;
    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand mx-3">
            ContactList
          </Link>
          

          {currentUser ? (
            <div className="navbar-nav mr-auto">
              {showAdminPages ? (
                <li className="nav-item">
                  <Link to={"/register"} className="nav-link">
                    Add user
                  </Link>
                </li>
              ) : (<></>)}

              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  Logout
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;