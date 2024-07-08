import React from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "../graphql/queries";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  CircularProgress,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const styles = {
  root: {
    marginTop: "50px",
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
  adminButton: {
    marginTop: "20px",
    marginLeft: "5px",
  },
};

const Dashboard = () => {
  const navigate = useNavigate();

  // Query to fetch user profile
  const { loading, error, data } = useQuery(GET_USER_PROFILE, {
    variables: {
      token: localStorage.getItem("token") || "", // Retrieve token from storage
    },
    fetchPolicy: "network-only", // Ensure latest data is fetched
  });

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) return <CircularProgress />; // Show loading indicator

  if (error) {
    console.error("Error fetching user profile:", error);
    return <Typography>Error fetching user profile</Typography>;
  }

  if (!data || !data.getUserProfile) {
    return <Typography>User profile not found</Typography>;
  }

  // Check user role here
  // For example, if role === "user", render user dashboard
  // Ensure to replace "user" with your actual role field from server response
  // if (data.getUserProfile.role !== "user") {
  //   // Redirect or show error for unauthorized access
  //   navigate("/"); // Redirect to home or login page
  //   return null; // Render nothing or a loading/error message
  // }

  const isAdmin = data.getUserProfile.role === "admin";
  return (
    <Container style={styles.root} component="main" maxWidth="md">
      {!isAdmin && (
        <Typography variant="h4" align="center" gutterBottom>
          Welcome to your Dashboard
        </Typography>
      )}
      {isAdmin && (
        <Typography variant="h4" align="center" gutterBottom>
          Welcome to your Profile Admin
        </Typography>
      )}
      <Paper style={styles.paper} elevation={3}>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Typography fontWeight="bold">Username: </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">
                    {data.getUserProfile.username}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Typography fontWeight="bold">Email: </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">
                    {data.getUserProfile.email}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          style={styles.logoutButton}
          variant="contained"
          color="primary"
          onClick={handleLogout}
        >
          Logout
        </Button>
        {isAdmin && (
          <Button
            style={styles.adminButton}
            variant="contained"
            color="secondary"
            onClick={() => navigate("/admin")}
          >
            Admin Dashboard
          </Button>
        )}
      </Paper>
    </Container>
  );
};

export default Dashboard;
