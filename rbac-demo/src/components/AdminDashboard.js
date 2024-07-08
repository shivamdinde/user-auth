import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { UPDATE_USER_DETAILS, UPDATE_USER_ROLE } from "../graphql/mutations";
import { GET_ALL_USERS, GET_USER_PROFILE } from "../graphql/queries";
import {
  Container,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // const {token = localStorage.getItem('token')} = useParams();
  // const user = useQuery(GET_USER_PROFILE, {
  //   variables: {
  //     token
  //   },
  //   fetchPolicy: "network-only", // Ensure latest data is fetched

  // });
  useEffect(() => {
    // console.log(localStorage.getItem('role'))
    if (localStorage.getItem('role') !== "ADMIN") {
      navigate('/dashboard')
    }
    // console.log(userRole)
  });



  const [selectedRole, setSelectedRole] = useState("");
  const { loading, error, data } = useQuery(GET_ALL_USERS);
  const [updateUserDetails] = useMutation(UPDATE_USER_DETAILS);
  const [updateUserRole] = useMutation(UPDATE_USER_ROLE);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole({
        variables: {
          userId,
          newRole,
        },
      });
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleDetailsUpdate = async (userId, updatedDetails) => {
    try {
      await updateUserDetails({
        variables: {
          userId,
          updatedDetails,
        },
      });
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography>Error: {error.message}</Typography>;


  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.getAllUsers.map((user) => (
              (user.role !== "SUPER_ADMIN") ? (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <FormControl>
                      <InputLabel id={`role-label-${user.id}`}>Role</InputLabel>
                      <Select
                        labelId={`role-label-${user.id}`}
                        id={`role-select-${user.id}`}
                        value={selectedRole}
                        onChange={(e) => {
                          setSelectedRole(e.target.value);
                          handleRoleChange(user.id, e.target.value);
                        }}
                      >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        const updatedDetails = {
                          ...user,
                          role: selectedRole,
                        };
                        handleDetailsUpdate(user.id, updatedDetails);
                      }}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ) : null
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        // style={styles.logoutButton}
        variant="contained"
        color="primary"
        onClick={() => {
          navigate('/dashboard');
        }}
      >
        Dashboard
      </Button>
      <Button
        // style={styles.logoutButton}
        variant="contained"
        color="primary"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Container>
  );
};

export default AdminDashboard;
