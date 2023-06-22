import { render, screen } from '@testing-library/react';
import App from './App';
import { fireEvent } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});


jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

// Prueba para verificar si la aplicación se renderiza correctamente
test("renders app", () => {
  render(<App />);
});

// Prueba para verificar si los componentes se renderizan cuando un usuario está autenticado
test("renders authenticated routes when user is authenticated", () => {
  useSelector.mockImplementation(callback =>
    callback({ auth: { token: "fake-token" } })
  );
  const { getByText } = render(<App />);
  
  // Asegúrate de que los componentes de las rutas autenticadas se estén renderizando.
  // Reemplaza "Trades" y "Profile" con el texto exacto o aria-label que estás utilizando en tus componentes.
  expect(getByText("Trades")).toBeInTheDocument();
  expect(getByText("Profile")).toBeInTheDocument();
});

// Prueba para verificar la funcionalidad de cierre de sesión
test("logout dispatches action", () => {
  const mockDispatch = jest.fn();
  useDispatch.mockReturnValue(mockDispatch);
  useSelector.mockImplementation(callback =>
    callback({ auth: { token: "fake-token" } })
  );

  const { getByText } = render(<App />);
  
  // Haz click en el botón de cerrar sesión.
  // Reemplaza "Logout" con el texto exacto o aria-label que estás utilizando para tu botón de cierre de sesión.
  fireEvent.click(getByText("Logout"));
  
  // Verifica que se haya llamado a la acción de cierre de sesión
  expect(mockDispatch).toHaveBeenCalledWith(logout());
});