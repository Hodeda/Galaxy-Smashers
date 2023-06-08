import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import "../components/componentStyles/admin.css";
import UserData from "./UserData";
import UserModal from "./UserModal";
/* import { Button, Modal, Table } from "react-bootstrap"; */
import { authContext } from "../../context/authContext";
import "../../componentstyles/admin.css"
import newAxios from "../Axios";

const AdminDashboard = () => {
  const { users, setUsers, fetchUsers, userDetails } = useContext(authContext);
  const [close, setClose] = useState(true);
  const [currentRow, setCurrentRow] = useState(1);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);


  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [users]);

//   useEffect(() => {
//     if (!userDetails.admin) navigate("/home");
//   }, [userDetails.admin]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleUserUpdate = async (updatedUser) => {
    try {
      // Perform the update action here, e.g., make an API request
      const response = await newAxios.put(
        `/users/update/${updatedUser.id}`,
        updatedUser,
        { withCredentials: true }
      );

      // Update the users state with the updated user
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? response.data : user
        )
      );
    } catch (error) {
      console.log(error);
    }

    // Close the user modal
    setShowUserModal(false);
  };

  return (
    <div className="adminDashboard mr-5 ml-5">
      <h1>Welcome to the Admin Dashboard</h1>
      <p>
        This page displays a list of all users. Click on a user to see their
        details.
      </p>
      <h2>Users</h2>
      <Table striped bordered hover size="sm" className="usersList">
        <thead>
          <tr>
            <th>#</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Admin</th>
            <th></th>
          </tr>
        </thead>

        {users.map((user, index) => (
          <UserData
            key={user.id}
            user={user}
            rowNum={currentRow + index}
            setShowUserModal={setShowUserModal}
            setSelectedUser={setSelectedUser}
            onClick={() => handleUserClick(user)}
          />
        ))}
      </Table>

      <Modal show={showUserModal} onHide={() => setShowUserModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        {selectedUser && (
          <UserModal
            user={selectedUser}
            onUpdate={handleUserUpdate}
            setShowUserModal={setShowUserModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
