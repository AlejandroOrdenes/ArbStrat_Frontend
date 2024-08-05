import { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

export const Verify = (props) => {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    // Obtener el token de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    // Enviar el token al servidor para verificación
    axios.get(`https://arbstrat.aordenes.com/api/verify/?token=${token}`)
      .then(response => {
        // Si la verificación fue exitosa, actualiza el estado
        setVerified(true);
      })
      .catch(error => {
        console.error('Hubo un error durante la verificación', error);
      });
  }, []);

  // Si el usuario ha sido verificado, redirígelo a la página de inicio de sesión
  if (verified) {
    return <Navigate to="/login" />;
  }

  // Mientras la verificación está en proceso, puedes mostrar un spinner o algún otro indicador de carga
  return <div>The account has already been verified. <a><Navigate to="/login" /></a></div>;
}

