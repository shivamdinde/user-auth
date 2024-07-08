import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "../graphql/mutations";
import {
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Paper,
  Select,
  MenuItem,
} from "@mui/material";

const paperStyle = {
  marginTop: "50px",
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const formStyle = {
  width: "100%",
  marginTop: "10px",
};

const submitButtonStyle = {
  margin: "25px 0 20px",
};

const registerLinkStyle = {
  textDecoration: "none",
  color: "#1976d2",
};

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user", // Default role selection
  });

  const [registerUser, { loading, error, data }] = useMutation(REGISTER_USER);

  // const handleSubmit = async (e) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    try {
      const response = await registerUser({
        variables: {
          registerInput: {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: formData.role,
          },
        },
      });
      console.log("Registration response:", response);
    } catch (err) {
      console.error("Error registering user:", err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper style={paperStyle} elevation={3}>
        <Typography component="h2" variant="h5">
          REGISTER
        </Typography>
        <form style={formStyle} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Select
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="role"
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={submitButtonStyle}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
        {error && <Typography color="error">Error: {error.message}</Typography>}
        {data && data.registerUser && (
          <Typography variant="body1">User registered successfully!</Typography>
        )}
        <Grid container justifyContent="flex-end">
          <Grid item>
            <a href="/login" style={registerLinkStyle}>
              Already registered? Click here to login
            </a>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Register;
