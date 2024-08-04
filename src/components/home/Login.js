import { React, useState, useEffect, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import styles from "./Login.module.css";
import "./NavMenu.module.css";
import { NavMenu } from "../home/NavMenu";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/actions";
import Toast from "react-bootstrap/Toast";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);
  const isAuthenticated = useSelector((state) => state.auth.token !== null);
  const [showToast, setShowToast] = useState(false);
  const [toastHeader, setToastHeader] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    console.log('Login component mounted');
  }, []);

  const hideToast = useCallback(() => {
    setShowToast(false);
  }, []);

  const validateForm = useCallback(() => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    let emailIsValid = regex.test(email);

    if (!emailIsValid) {
      return false;
    }
    if (!email || !password) {
      return false;
    }

    return true;
  }, [email, password]);

  useEffect(() => {
    if (error) {
      setToastColor("#ff4a4a");
      setToastMessage("User doesn´t exist!");
      setShowToast(true);
      setEmail("");
      setPassword("");

      // Ocultar el Toast después de 2 segundos
      const timer = setTimeout(() => {
        hideToast();
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
    if (isAuthenticated) {
      // Si el usuario está autenticado, redirígelo a la ruta deseada
      navigate("/cointegration"); // Reemplaza '/cointegration' con la ruta a la que deseas redirigir
    }
  }, [error, isAuthenticated, navigate]);

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [showToast, validateForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(email, password)); // Llamar a la acción de inicio de sesión de Redux en lugar de hacer la petición directamente
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
              <h3>Login</h3>
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
              <Form.Label>Password</Form.Label>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <NavLink to="/recovery" className={styles.passwordRecovery}>
              Forgot your password?
            </NavLink>
            <hr></hr>
            <Button
              className={styles.buttonStart}
              variant="primary"
              type="submit"
              disabled={!isFormValid}
            >
              Submit
            </Button>
            {/* {error && <p>Error: {error}</p>}{" "} */}
            {/* Mostrar el mensaje de error si hay uno */}
          </Form>
        </div>
      </div>
    </div>
  );
};
