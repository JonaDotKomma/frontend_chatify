import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from "axios";
import './dasboardstyles.css';
import Menu from '../nav/Menu';
import ChatListRecient from './ChatlistDash';
function Dashboard({ user, onLogout, }, props) {

  const idAgentesi = localStorage.getItem('idAgente');

  const [elementoName, setElementoName] = useState("");
  const [linkImguser, setLinkImguser] = useState("");
  const [puestoUser, setPuestoUser] = useState("");


  //datos del prefil
  const [datosuser, setdatosuser] = useState([]);


  const fetchdatosuser = async (idagente) => {

    const postData = {
      idAgente: idagente,
    };

    try {
      const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/getDataAgent', postData);
      setdatosuser(response.data);
      const elementoName = response.data[0][0];
      const linkImguser = response.data[0][1];
      const puestodUser = response.data[0][3];

      setElementoName(elementoName);
      setLinkImguser(linkImguser);
      setPuestoUser(puestodUser)

      console.log('el name es ', elementoName)
      console.log('la imagen es ', linkImguser)
      console.log('el pass es ', puestodUser)

    } catch (error) {
      console.error('Error al obtener los datos de la API:', error);
    }
  };


  // Este efecto mostrará el valor actualizado de datosuser
  useEffect(() => {
    console.log("datosafente", datosuser);
  }, [datosuser]);


  useEffect(() => {
    // Llama a fetchdatosuser cuando el componente se monta
    fetchdatosuser(idAgentesi);
  }, [idAgentesi]); // Los corchetes vacíos significan que esto se ejecutará una vez cuando el componente se monte

  //datos de la lista de usuarios
  const [chatData, setChatData] = useState([]); // Estado para almacenar los datos del chat
  const [chatodoo, setChatOdoo] = useState([]);

  useEffect(() => {
    // Conectar al servidor Socket.IO
    const socket = io('https://webhookwa-sjkbu6lfrq-uc.a.run.app');

    socket.on('notification', (data) => {
      console.log('Plataforma:', data.plataforma);
      listchat(idAgentesi, data.plataforma);
    });

    // Llamar a listchat al montar el componente
    listchat(idAgentesi);

    // Limpiar al desmontar el componente
    return () => {
      socket.disconnect();
    };
  }, [idAgentesi]); // Agregar idAgentesi como dependencia si su valor puede cambiar

  const listchat = async (idUser) => {

    try {
      const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/listuser', { idUser });
      const jsonData = response.data;
      const filteredData = jsonData.filter(item => item[6] !== undefined && item[6] !== null);
      setChatOdoo(filteredData);
      setChatData(jsonData); // Actualiza el estado con los nuevos datos

      console.log('Listdtos', jsonData);
    } catch (error) {
      console.error("Error al obtener los datos de la API:", error);
    }
  };

  return (
    <div className="dashboard">
      <Menu onLogout={onLogout} />
      {/* Parte 1: Perfil */}
      <div className="perfil">
        <img src={linkImguser} alt="Perfil" className="imagen-perfil" />
        <div className="info-perfil">
          <h2>Bienvenido</h2>
          <p> {elementoName}</p>
          <p>{puestoUser}</p>
        </div>
      </div>

      {/* Parte 2: Chats Recientes */}
      <div className="chats-recientes">
        <h3>Chats Recientes</h3>
        <div className="lista-chats">

          {chatData.slice(-4).map((item, index) => (
            <ChatListRecient
              key={item[0]}
              name={item[2]} // Asumiendo que el nombre está en la posición 4
              animationDelay={index + 1}
              numero={item[1]} // Número de teléfono, posición 1
              id_user={item[0]} // ID del usuario, posición 0
              status={item[7]} // Estado, posición 7
              linea={item[4]} // Línea, posición 4
              typeChat={item[5]} // Tipo de chat, posición 5
              fecha={item[11]} // Fecha, posición 11
            />
          ))}

        </div>
      </div>

      {/* Parte 3: Chats Favoritos */}
      <div className="chats-favoritos">
        <h3>Chats Con Odoo</h3>
        <div className="lista-chats">

          {chatodoo.slice(-4).map((item, index) => (
            <ChatListRecient
              key={item[0]}
              name={item[2]} // Asumiendo que el nombre está en la posición 4
              animationDelay={index + 1}
              numero={item[1]} // Número de teléfono, posición 1
              id_user={item[0]} // ID del usuario, posición 0
              status={item[7]} // Estado, posición 7
              linea={item[4]} // Línea, posición 4
              typeChat={item[5]} // Tipo de chat, posición 5
              fecha={item[11]} // Fecha, posición 11
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
