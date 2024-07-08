import React from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "../graphql/queries";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  CircularProgress,
  Button,
  Paper,
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
};

const Dashboard = () => {
  const navigate = useNavigate();

  // Query to fetch user profile
  const { token = localStorage.getItem('token') } = useParams();
  const { loading, error, data } = useQuery(GET_USER_PROFILE, {
    variables: {
      token
    },
    fetchPolicy: "network-only", // Ensure latest data is fetched
  });


  const handleButtonClick = () => {
    try{
      navigate('/admin');
    }catch(e){
      console.error(e);
    }
  }

  // Logout
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


  // if (data.getUserProfile.role !== "USER") {
  //   // Redirect or show error for unauthorized access
  //   navigate("/"); // Redirect to home or login page
  //   return null; // Render nothing or a loading/error message
  // }

  return (
    <>
      <Container style={styles.root} component="main" maxWidth="md">
        <Paper style={styles.paper} elevation={3}>
          <Typography variant="h4" align="center" gutterBottom>
            Welcome to your Dashboard
          </Typography>
          <Typography variant="h6" gutterBottom>
            Username: {data.getUserProfile.username}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Email: {data.getUserProfile.email}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Role: {data.getUserProfile.role}
          </Typography>
          {localStorage.getItem('role') === "ADMIN" || localStorage.getItem('role') === 'SUPER_ADMIN' ? (
            <Button
              style={styles.logoutButton}
              variant="contained"
              color="primary"
              onClick={handleButtonClick}
            >
              Admin Page
            </Button>
          ) : null}
          <Button
            style={styles.logoutButton}
            variant="contained"
            color="primary"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Paper>
      </Container>

    </>
  );
};

export default Dashboard;
