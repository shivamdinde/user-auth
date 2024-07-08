import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { UPDATE_USER_DETAILS, UPDATE_USER_ROLE } from "../graphql/mutations";
import { GET_ALL_USERS } from "../graphql/queries";
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

const AdminDashboard = () => {
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminDashboard;
