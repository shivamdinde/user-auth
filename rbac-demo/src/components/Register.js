import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard')
    }
  });

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER", // Default role selection
  });

  const [registerUser, { loading, error, data }] = useMutation(REGISTER_USER);




  // const handleSubmit = async (e) => {
  const handleSubmit = async (e) => {
    if(inputErrors.email !== "" || inputErrors.password !==""){
      return;
    } 

    e.preventDefault();
    // console.log("Submitting form data:", formData);
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
      navigate('/login')
      // console.log("Registration response:", response);
    } catch (err) {
      console.error("Error registering user:", err.message);
    }
  };

  const [inputErrors, setInputErrors] = useState({
    email: "",
    password: ""
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    validateField(e.target.name, e.target.value)
  }


  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "email":
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!emailRegex.test(value)) {
          setInputErrors({ ...inputErrors, email: "Invalid email address" });
        } else {
          setInputErrors({ ...inputErrors, email: "" });
        }
        break;
      case "password":
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (!passwordRegex.test(value)) {
          setInputErrors({ ...inputErrors, password: "Invalid password" });
        } else {
          setInputErrors({ ...inputErrors, password: "" });
        }
        break;
      default: ;
    }
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
          {inputErrors.email && <Typography color="error">{inputErrors.email}</Typography>}
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
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            value={formData.password}
            onChange={handleChange}
          />
          {inputErrors.password && <Typography color="error">{inputErrors.password}</Typography>}
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
            <MenuItem value="USER">USER</MenuItem>
            <MenuItem value="ADMIN">ADMIN</MenuItem>
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
