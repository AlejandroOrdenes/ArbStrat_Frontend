import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import styles from "./Login.module.css";
import "../home/NavMenu.module.css";
import { NavMenu } from "../home/NavMenu";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/actions";


export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);
  const isAuthenticated = useSelector((state) => state.auth.token !== null);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (isAuthenticated) {
      // Si el usuario está autenticado, redirígelo a la ruta deseada
      navigate("/cointegration"); // Reemplaza '/cointegration' con la ruta a la que deseas redirigir
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(email, password)); // Llamar a la acción de inicio de sesión de Redux en lugar de hacer la petición directamente
  };

  return (
    <div className={styles.loginContainer}>
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
            >
              Submit
            </Button>
            {error && <p>Error: {error}</p>}{" "}
            {/* Mostrar el mensaje de error si hay uno */}
          </Form>
        </div>
      </div>
    </div>
  );
};
