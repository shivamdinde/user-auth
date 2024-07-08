import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../graphql/mutations";
import { useNavigate, Link } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Paper,
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

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  useEffect(() => {
    if (localStorage.getItem('token')) {
      try{
      navigate('/dashboard')
      }catch(err){
        console.error(err);
      }
    }
  });

  const [loginUser, { loading, error }] = useMutation(LOGIN_USER);

  const handleSubmit = async (e) => {
    if(inputErrors.email !== "" || inputErrors.password !==""){
      return;
    } 
    e.preventDefault();
    try {
      const { data } = await loginUser({
        variables: {
          loginInput: {
            email: formData.email,
            password: formData.password,
          },
        },
      });

      // const role = data.loginUser.role; // Assuming role is returned from server
      localStorage.setItem('role', data.loginUser.role);
      localStorage.setItem('token', data.loginUser.token);

      navigate('/dashboard');
      // Redirect based on role
      // if (role === "ADMIN") {
      //   navigate("/admin");
      // } else {
      //   navigate("/dashboard");
      // }
    } catch (err) {
      console.error("Error logging in:", err.message);
    }
  };

  const [inputErrors, setInputErrors] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    validateField(e.target.name, e.target.value)
  };

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
      <Paper style={paperStyle} square={false} elevation={6}>
        <Typography variant="h5">LOGIN</Typography>
        <form style={formStyle} onSubmit={handleSubmit} >
          <TextField
            variant="outlined"
            // margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          {inputErrors.email && <Typography color="error">{inputErrors.email}</Typography> }
          <TextField
            variant="outlined"
            // margin="normal"
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
          {inputErrors.password && <Typography color="error">{inputErrors.password}</Typography> }
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={submitButtonStyle}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        {error && (
          <Typography color="error" justifyContent={"center"}>
            {error.message}
          </Typography>
        )}
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link to="/register" style={registerLinkStyle}>
              Not registered? Click here to register
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Login;
