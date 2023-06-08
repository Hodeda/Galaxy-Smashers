import React, { useState } from 'react';
/* import { Modal, Button, Form } from "react-bootstrap"; */

const UserModal = ({ user, onUpdate, setShowUserModal }) => {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [admin, setAdmin] = useState(user.admin);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleUpdateClick = () => {
    // Perform the update action here, e.g., make an API request
    // with the updated user data
    const updatedUser = {
      ...user,
      name: name,
      email: email,
      admin: admin,
    };

    // Call the onUpdate callback with the updated user data
    onUpdate(updatedUser);

    // Exit edit mode and close the modal
    setEditMode(false);
  };

  return (
    <>
      <Modal.Body>
        {editMode ? (
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formAdmin">
              <Form.Label>admin</Form.Label>
              <Form.Control
                type="text"
                value={admin}
                onChange={(e) => setAdmin(e.target.value)}
              />
            </Form.Group>
          </Form>
        ) : (
          <>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Admin: {user.admin}</p>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {editMode ? (
          <Button variant="primary" onClick={handleUpdateClick}>
            Update
          </Button>
        ) : (
          <Button variant="primary" onClick={() => handleEditClick()}>
            Edit
          </Button>
        )}
        <Button variant="secondary" onClick={() => setShowUserModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </>
  );
};

export default UserModal;
