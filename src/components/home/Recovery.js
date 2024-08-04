import React, { useState, useEffect, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import styles from "./Login.module.css";
import "./NavMenu.module.css";
import { NavMenu } from "../home/NavMenu";
import axios from "axios";
import Toast from "react-bootstrap/Toast";

export const Recovery = () => {
  const [email, setEmail] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastHeader, setToastHeader] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const hideToast = useCallback(() => {
    setShowToast(false);
  }, []);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [showToast, hideToast, useCallback]);

  const validateForm = useCallback(() => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    let emailIsValid = regex.test(email);
    
    if (!emailIsValid) {
      return false
    }
    if (!email) {
      return false;
    }

    return true;
  }, [email]);

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [validateForm]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isFormValid) {
      try {
        
        const response = await axios.post(
          "http://127.0.0.1:8000/recoveryPassword/",
          {
            email: email,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        
        setToastColor("rgb(159, 201, 76)");
        setToastHeader("Recovery");
        setToastMessage("Password recovery email sended!!");
        setShowToast(true);
        setEmail("");
      } catch (error) {
        console.error("Error during registration:", error.response);
        console.error("Error details:", error.response.data);
        setToastColor("#ff4a4a");
        setToastMessage("Please fill out all fields and ensure email exist.");
        setShowToast(true);
      }
    } else {
      setToastColor("#ff4a4a");
      setToastMessage("Please fill out all fields and ensure email exist.");
      setShowToast(true);
    }
  };

  return (
    <div className={styles.loginContainer}>
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
      <NavMenu />
      <div className={styles.formContainer}>
        <div className={styles.backForm}>
          <Form className={styles.form} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <h3>Recovery Account</h3>
              <hr></hr>
              <Form.Label className={styles.recoverText}>Enter your email address for recovery your password</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>
            
            
            <hr></hr>
            <Button className={styles.sendEmailRecover} variant="primary" type="submit" disabled={!isFormValid}>
              Send
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};
