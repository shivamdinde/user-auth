import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { UPDATE_USER_DETAILS } from "../graphql/mutations";
import { GET_ALL_USERS } from "../graphql/queries";
import { useNavigate } from "react-router-dom";
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
  Snackbar,
} from "@mui/material";

const styles = {
  root: {
    marginTop: "100px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paper: {
    padding: "16px",
    maxWidth: "600px",
    margin: "auto",
    marginTop: "20px",
  },
  logoutButton: {
    marginTop: "20px",
  },

  tableHeadCell: {
    fontWeight: "bold",
  },
  selectControl: {
    minWidth: "120px",
  },
  logoutbutton: {
    marginTop: "20px",
  },
  adminButton: {
    marginTop: "20px",
    marginLeft: "5px",
  },
  snackbar: {
    marginBottom: "20px",
  },
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedRoles, setSelectedRoles] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { loading, error, data } = useQuery(GET_ALL_USERS);
  const [updateUserDetails] = useMutation(UPDATE_USER_DETAILS);

  const handleRoleChange = (userId, newRole) => {
    setSelectedRoles((prev) => ({
      ...prev,
      [userId]: newRole,
    }));
  };

  const handleDetailsUpdate = async (user) => {
    try {
      const updatedDetails = {
        email: user.email,
        role: selectedRoles[user.id] || user.role,
      };

      await updateUserDetails({
        variables: {
          updatedDetails,
        },
      });

      setSnackbarMessage(`${user.username} updated successfully!`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography>Error: {error.message}</Typography>;

  return (
    <Container style={styles.root}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={styles.tableHeadCell}>Username</TableCell>
              <TableCell style={styles.tableHeadCell}>Email</TableCell>
              <TableCell style={styles.tableHeadCell}>Role</TableCell>
              <TableCell style={styles.tableHeadCell}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.getAllUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <FormControl style={styles.selectControl}>
                    <Select
                      labelId={`role-label-${user.id}`}
                      id={`role-select-${user.id}`}
                      value={selectedRoles[user.id] || user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      variant="standard"
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
                    style={styles.button}
                    onClick={() => handleDetailsUpdate(user)}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          style={styles.logoutButton}
          variant="contained"
          color="primary"
          onClick={handleLogout}
        >
          Logout
        </Button>
        <Button
          style={styles.adminButton}
          variant="contained"
          color="secondary"
          onClick={() => navigate("/dashboard")}
        >
          Your Profile
        </Button>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          style={styles.snackbar}
        />
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
