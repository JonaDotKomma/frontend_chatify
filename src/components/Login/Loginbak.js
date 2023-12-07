import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { gapi } from "gapi-script";
import Login from './Login';
import Routeschmpi from '../routes/Routes';
import { useNavigate } from 'react-router-dom';



function LoginBack() {
  const navigate = useNavigate();
  const clientID = "152246615921-plavoo3cte9rc53n7pdfn9p7lbgm2oa1.apps.googleusercontent.com";
  const storedLoggedIn = localStorage.getItem('loggedIn') === 'true'; // Recupera el estado de autenticación desde localStorage
  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(storedLoggedIn); // Establece el estado de autenticación inicial desde localStorage

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const onSuccess = (response) => {
    setUser(response.profileObj);
    googleoauth(response.profileObj.email, response.profileObj.imageUrl, response.profileObj.name)
    setLoggedIn(true);
    localStorage.clear();

    console.log('LA MAMALONA');
    console.log(response.profileObj.imageUrl)

    localStorage.setItem('user', JSON.stringify(response.profileObj));
    localStorage.setItem('nombreUsuario', response.profileObj.name); // Agrega esto
    // Redirige al usuario al Dashboard después de haber realizado todas las operaciones anteriores con éxito.
    navigate('/');

  }

  const onFailure = (response) => {
    console.log("Algo malio sal");
  }

  const googleoauth = async (correo, imagen, nombreAgent) => {
    const postData = {
      correo: correo,
      imagen: imagen,
      nombreagente: nombreAgent,
    };

    try {
      const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/googleoauth', postData);
      console.log(response.data);
      try {
        localStorage.setItem('idAgente', response.data.id_agente);
        localStorage.setItem('validado', response.data.validado);
      } catch {
        localStorage.setItem('validado', "0");
      }
      // Abre el modal
    } catch (error) {
      console.error('Error al obtener los datos de la API:', error);
    }
  };

  const handleLogout = async () => {
    const storedIdAgent = localStorage.getItem('idAgente');    
    setUser({});
    setLoggedIn(false);
    console.log('El id del agente es: ', storedIdAgent)  
    try {
      await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/logout', {idAgent: storedIdAgent})
      localStorage.removeItem('loggedIn'); // Elimina el estado de autenticación de localStorage
      localStorage.removeItem('user');
    } catch (error) {
      console.error(error)
    }  
  };

  const handleSubmit = async ({ username, password }) => {
    try {
      const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/login', { username, password });
      const token = response.data.token;
      const idAgente = response.data.data[0][0];
      const correoAgente = response.data.data[0][1];
      const nombreAgente = response.data.data[0][3];
      const imagenPerfil = response.data.data[0][5];
      const validado = response.data.data[0][7];
      const usertipo= response.data.data[0][8];

      console.log(correoAgente)
      localStorage.setItem('token', token);
      localStorage.setItem('nombre', nombreAgente);
      localStorage.setItem('idAgente', idAgente);
      localStorage.setItem('validado', validado);
      localStorage.setItem('imagenPerfil', imagenPerfil);
      localStorage.setItem('usertipo', usertipo);

      

      setUser({ ...user, nombre: nombreAgente });
      setLoggedIn(true);
      localStorage.setItem('loggedIn', 'true');

      // Actualiza también el nombre de usuario para el inicio de sesión con usuario y contraseña

      localStorage.setItem('nombreUsuario', nombreAgente); // Agrega esto
      navigate('/');
    } catch (error) {
      alert('Credenciales incorrectas');
      console.error(error);
      window.location.reload();
    }
  };
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientID,
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  const onLoginClick = async (username, password) => {
    try {
      const response = await handleSubmit({ username, password });
      console.log(response)
      // Realiza cualquier acción adicional que necesites después del inicio de sesión
    } catch (error) {
      alert('Credenciales incorrectas');
      console.error(error);
    }
  };

  return (
    <div className="center">
      <div className='btn'>
        {!loggedIn ? (
          <Login
            clientId={clientID}
            onSuccess={onSuccess}
            onFailure={onFailure}
            onLoginClick={onLoginClick}
          />
        ) : (
          <Routeschmpi user={user} onLogout={handleLogout} nombreUsuario={user.nombre} />
        )}
      </div>
    </div>
  );
}

export default LoginBack;
