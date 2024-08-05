import React, { useState, useEffect, useCallback } from "react";
import "./Profile.module.css";
import styles from "./Profile.module.css";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Toast from "react-bootstrap/Toast";
import { useSelector} from "react-redux";

export const Password = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const [showToast, setShowToast] = useState(false);
  const [toastHeader, setToastHeader] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("");
  const [currentPasswordPlaceHolder, setCurrentPasswordPlaceHolder] = useState(
    "Enter current password"
  );
  const [newPasswordPlaceHolder, setNewPasswordPlaceHolder] =
    useState("Enter new password");
  const [repeatNewPasswordPlaceHolder, setRepeatNewPasswordPlaceHolder] =
    useState("Repeat new password");

  const hideToast = () => {
    setShowToast(false);
  };

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
    if (!currentPassword || !newPassword || !repeatNewPassword) {
      return false;
    }
    if (newPassword !== repeatNewPassword) {
      return false;
    }
    return true;
  }, [currentPassword, newPassword, repeatNewPassword]);

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [validateForm]);

  const changeUserPassword = async (event) => {
    event.preventDefault();
    if (isFormValid) {
      try {
        const response = await axios.post(
          "https://arbstrat.aordenes.com/passUpdate/",
          {
            currentPassword: currentPassword,
            newPassword: newPassword,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setToastColor("rgb(159, 201, 76)");
        setToastHeader("Register");
        setToastMessage("Password Updated Succesfull!!");
        setShowToast(true);
        setCurrentPassword("");
        setNewPassword("");
        setRepeatNewPassword("");
      } catch (error) {
        console.error("Error during updated the password:", error.response);
        console.error("Error details:", error.response.data);
        setToastColor("#ff4a4a");
        setToastMessage("Password Incorrect!");
        setShowToast(true);
        setCurrentPassword("");
        setNewPassword("");
        setRepeatNewPassword("");
      }
    } else {
      setToastColor("#ff4a4a");
      setToastMessage("Please fill out all fields and ensure passwords match.");
      setShowToast(true);
    }
  };

  return (
    <div className={styles.cardContainer2}>
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
      <h3>Password</h3>
      <hr></hr>
      <Form className={styles.changeDataFormPass} onSubmit={changeUserPassword}>
        <Form.Group className="mb-3" controlId="formcurrentPassword">
          <Form.Label></Form.Label>
          <Form.Control
            type="password"
            placeholder={currentPasswordPlaceHolder}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="newPassword">
          <Form.Label></Form.Label>
          <Form.Control
            type="password"
            placeholder={newPasswordPlaceHolder}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="repeatNewPassword">
          <Form.Label></Form.Label>
          <Form.Control
            type="password"
            placeholder={repeatNewPasswordPlaceHolder}
            value={repeatNewPassword}
            onChange={(e) => setRepeatNewPassword(e.target.value)}
          />
        </Form.Group>

        <button className={styles.buttonPass} variant="primary" type="submit">
          Save Password
        </button>
      </Form>
    </div>
  );
};
