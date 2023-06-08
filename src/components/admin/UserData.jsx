import React, { useContext, useState } from "react";
/* import { Button, Modal, Table } from "react-bootstrap";*/
import { authContext } from "../../context/authContext";

const UserData = ({ user, rowNum, setShowUserModal, setSelectedUser }) => {
  const { deleteUser } = useContext(authContext);

  const handleDelete = (id) => {
    deleteUser(id);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  return (
    <>
      <tbody>
        <tr>
          <td>{rowNum}</td>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>{user.admin}</td>
          <td>
            <Button
              variant="outline-danger"
              onClick={() => handleDelete(user.id)}
            >
              Delete User
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => handleView(user)}
            >
              View User
            </Button>
          </td>
        </tr>
      </tbody>
    </>
  );
};

export default UserData;
