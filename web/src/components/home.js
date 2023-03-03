import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { withRouter } from "../services/common";
import axios from 'axios';
import ReactPaginate from "https://cdn.skypack.dev/react-paginate@7.1.3";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const API_URL = 'http://localhost:3000/';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      itemsPerPage: 3,
      pageCount: 0,
      itemOffset: 0,
      contacts: [],
      currentItems: [],
      currentUser: { email: "" },
      newContact: {name: "", phone: ""},
    };
  }

  createContact = (event) => {
    const userID = JSON.parse(localStorage.getItem("user")).id;
    const name = document.getElementById("newContactName").value;
    const phone = parseInt(document.getElementById("newContactPhone").value);
    const newContact = {user: userID, name: name, phone: phone}
    console.log(newContact)
    axios.post(API_URL + 'contact/add', newContact, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}` }
    })
    .then(res => {
        this.setState(prevState => ({
          contacts: [...prevState.contacts, newContact]
        })).then(() => {
          // this.setState({currentItems: this.state.contacts.slice(newOffset, newOffset + this.state.itemsPerPage)});
        })
        console.log(res)
    }).catch(err => { 
       console.log(err)
    })
  }

  deleteContact = (id) => {
    console.log(id)
    axios.delete(API_URL + 'contact/delete',{
        params: {contactID: id},
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}` }
      }
    )
    .then(res => {  
        console.log(res)
    }).catch(err => { 
       console.log(err)
    })
  }

  handlePageClick = (event) => {
    const newOffset = event.selected * this.state.itemsPerPage % this.state.contacts.length;
    this.setState({itemOffset: newOffset});
    this.setState({currentItems: this.state.contacts.slice(newOffset, newOffset + this.state.itemsPerPage)});
  };

  componentDidMount() {
    const currentUser = JSON.parse(localStorage.getItem('user'));;

    if (!currentUser) this.setState({ redirect: "/login" });
    this.setState({ currentUser: currentUser, userReady: true })

    const endOffset = this.state.itemOffset + this.state.itemsPerPage;
    
    axios.get(API_URL + 'contact/userContacts',{
      params: {userID: JSON.parse(localStorage.getItem('user')).id},
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}` }
    })
    .then(
      response => {
        this.setState({
          contacts: response.data,
          currentItems: response.data.slice(this.state.itemOffset, endOffset),
          pageCount: Math.ceil(response.data.length / this.state.itemsPerPage)
        });
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
        <Form className="mb-4 square border border-success p-3 w-50">
          <Form.Group className="mb-3" controlId="newContactName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="name" placeholder="Enter name" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="newContactPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="phone" placeholder="Mobile number" />
          </Form.Group>
          <Button variant="primary" onClick={(e)=>this.createContact(e)}>
            Create
          </Button>
        </Form>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {this.state.currentItems && this.state.currentItems.map((item) => (
            <tr>
              <td>{item.name}</td>
              <td>{item.phone}</td>
              <td className="d-flex justify-content-around"><Button variant="warning">Edit</Button> <Button variant="danger" onClick={()=>this.deleteContact(item._id)}>Delete</Button></td>
            </tr>
          ))}
          </tbody>
        </Table>
        <ReactPaginate
          nextLabel="next >"
          onPageChange={this.handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={this.state.pageCount}
          previousLabel="< previous"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />
      </div>
    );
  }
}

export default withRouter(Home);