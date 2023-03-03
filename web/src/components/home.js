import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { withRouter } from "../services/common";
import axios from 'axios';
import ReactPaginate from "https://cdn.skypack.dev/react-paginate@7.1.3";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Modal } from 'react-bootstrap';

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
      newContact: {id:"", name: "", phone: ""},
      contactToEdit: {id: "", name: "", phone: ""},
      showEditModal: false,
      showCreateModal: false,
    };
  }

  createContact = (event) => {
    const userID = JSON.parse(localStorage.getItem("user")).id;
    const name = document.getElementById("newContactName").value;
    const phone = parseInt(document.getElementById("newContactPhone").value);
    const newContact = {user: userID, name: name, phone: phone}
    // console.log(newContact)
    axios.post(API_URL + 'contact/add', newContact, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}` }
    })
    .then(res => {
        this.setState(prevState => ({
          contacts: [...prevState.contacts, newContact],
          pageCount: Math.ceil((prevState.contacts.length + 1) / this.state.itemsPerPage)
        }), () => {
          this.handlePageClick({selected: Math.floor((this.state.contacts.length + 1) / this.state.itemsPerPage)});
        });
    }).catch(err => { 
       console.log(err)
    })
  }

  openCreateModal = () => {
    this.setState({ showCreateModal: true });
  }
  
  openEditModal = (contact) => {
    // console.log(contact._id)
    this.setState({ contactToEdit: {id: contact._id, name: contact.name, phone: contact.phone} });
    this.setState({ showEditModal: true });
  }

  closeEditModal = () => {
    this.setState({ contactToEdit: {name: "", phone: ""} });
    this.setState({ showEditModal: false });
  }

  closeCreateModal = () => {
    this.setState({ showCreateModal: false });
  }

  updateContact = () => {
    const updatedContact = {
      user: JSON.parse(localStorage.getItem("user")).id,
      name: document.getElementById("editContactName").value,
      phone: document.getElementById("editContactPhone").value
    };
    axios.put(API_URL + 'contact/edit', updatedContact, {
      params: {contactID: this.state.contactToEdit.id},
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}` }
    })
    .then(res => {
      const updatedContacts = [...this.state.contacts];
      const index = updatedContacts.findIndex(c => c.id === updatedContact.id);
      updatedContacts[index] = updatedContact;
      this.setState({ contacts: updatedContacts });
      this.closeEditModal();
    })
    .catch(err => { 
      console.log(err)
    });
  }

  deleteContact = (id) => {
    console.log(id)
    axios.delete(API_URL + 'contact/delete',{
        params: {contactID: id},
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}` }
      }
    )
    .then(res => {  
        const updatedContacts = this.state.contacts.filter(contact => contact._id !== id);
        this.setState({
          contacts: updatedContacts,
          currentItems: updatedContacts.slice(this.state.itemOffset, this.state.itemOffset + this.state.itemsPerPage),
          pageCount: Math.ceil(updatedContacts.length / this.state.itemsPerPage)
        });
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
        <Modal show={this.state.showCreateModal} onHide={this.closeCreateModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Contact</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="newContactName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" defaultValue={this.state.newContact.name} />
              </Form.Group>
              <Form.Group controlId="newContactPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control type="text" defaultValue={this.state.newContact.phone} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeCreateModal}>Close</Button>
            <Button variant="primary"onClick={(e)=>this.createContact(e)}>Create new</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.showEditModal} onHide={this.closeEditModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Contact</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="editContactName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" defaultValue={this.state.contactToEdit.name} />
              </Form.Group>
              <Form.Group controlId="editContactPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control type="text" defaultValue={this.state.contactToEdit.phone} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeEditModal}>Close</Button>
            <Button variant="primary" onClick={this.updateContact}>Save changes</Button>
          </Modal.Footer>
        </Modal>

        <h1>Home Page</h1>
        <Button variant="success my-3" onClick={() => this.openCreateModal()}>Add +</Button>
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
              <td className="d-flex justify-content-around"><Button variant="warning" onClick={() => this.openEditModal(item)}>Edit</Button> <Button variant="danger" onClick={()=>this.deleteContact(item._id)}>Delete</Button></td>
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