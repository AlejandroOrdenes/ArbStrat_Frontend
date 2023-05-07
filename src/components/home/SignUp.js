import React, { useState, useEffect, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import styles from "./Login.module.css";
import "../home/NavMenu.module.css";
import { NavMenu } from "../home/NavMenu";
import axios from "axios";
import Toast from "react-bootstrap/Toast";
import { useNavigate } from "react-router-dom";


export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastHeader, setToastHeader] = useState("")
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("")
  const [isFormValid, setIsFormValid] = useState(false);

  const navigate = useNavigate();

  const hideToast = useCallback(() => {
    setShowToast(false);
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 2000);

      return () => {
        clearTimeout(timer);
        
      };
    }
  }, [showToast, hideToast, navigate]);

  const validateForm = useCallback(() => {
    if (!email || !username || !password || !repeatPassword) {
      return false;
    }
    if (password !== repeatPassword) {
      return false;
    }
    return true;
  }, [email, username, password, repeatPassword]);

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [validateForm]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isFormValid) {
      try {
        const response = await axios.post("http://127.0.0.1:8000/register/", {
          email: email,
          username: username,
          password: password,
          repeat_password: repeatPassword,
      }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

        console.log(response.data);
        setToastColor("rgb(159, 201, 76)")
        setToastHeader("Register")
        setToastMessage("Register Succesfull!!");
        setShowToast(true)
        setEmail("");
        setUsername("");
        setPassword("");
        setRepeatPassword("");
        

      } catch (error) {
        console.error("Error during registration:", error.response);
        console.error("Error details:", error.response.data);
      }
    } else {
      setToastColor('#ff4a4a')
      setToastMessage("Please fill out all fields and ensure passwords match.");
      setShowToast(true);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <NavMenu />
      <Toast
  show={showToast}
  onClose={() => setShowToast(false)}
  style={{
    position: "fixed",
    top: "20%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1000,
    opacity: 1, // Agregar esta línea para eliminar la opacidad
    backgroundColor: toastColor,
    color: "white",
    
     // Cambiar el color de fondo del header
  }} 
>
  <Toast.Header>
    <strong className="mr-auto">{toastHeader}</strong>
  </Toast.Header>
  <Toast.Body>{toastMessage}</Toast.Body>
</Toast>
      <div className={styles.formContainer}>
        <div className={styles.backForm}>
          <Form className={styles.form} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <h3>SignUp</h3>
              <hr></hr>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Repeat Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Repeat Password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={!isFormValid}>
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};
