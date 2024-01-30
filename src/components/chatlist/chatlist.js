import React, { useEffect, useState,useRef } from 'react';
import io from 'socket.io-client';
import axios from "axios";
import './chatliststyle.css';
import ListItemWP from './ListItem';
import ModalAddUser from './modales/ModalAddUser';
import ListResultsSearch from './ListResultsSearch';
import { Link } from 'react-router-dom';


function Chatlist(props) {
  const idAgentesi = localStorage.getItem('idAgente');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const language = navigator.language;


  //filtro para la selecion de red social 
  const { tipochat } = props;
  const [localTipoChat] = useState(props.tipochat);
  const [searchTerm] = useState(""); // searchTerm se mantiene, setSearchTerm eliminado
  const [chatData, setChatData] = useState([]); // Estado para almacenar los datos del chat

  
  const [limit, setLimit] = useState(15);
  const [isLoading, setIsLoading] = useState(false); // Nuevo estado para rastrear la carga

  const chatListRef = useRef(null);

  // Filtra los chats basándote en el término de búsqueda y el tipo de chat
  const filteredChats = chatData.filter(chat =>
    chat[1].toLowerCase().includes(searchTerm.toLowerCase()) && chat[5] === tipochat
  );
  const [rol, setRol] = useState('')
  useEffect(() => {
    (async () => {
      const postData = {
        idAgente: idAgentesi
      }
      const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/getDataAgent', postData);
      setRol(response.data[0][10])
    })()
    // eslint-disable-next-line
  }, [])

  //Carfar la lista con el socket 
  useEffect(() => {
    // Conectar al servidor Socket.IO
    const socket = io('https://webhookwa-sjkbu6lfrq-uc.a.run.app');

    socket.on('notification', (data) => {
      console.log('Plataforma:', data.plataforma);
      listchat(idAgentesi, limit, data.plataforma);
    });

    // Llamar a listchat al montar el componente
    listchat(idAgentesi, limit);

    // Limpiar al desmontar el componente
    return () => {
      socket.disconnect();
    };
  }, [idAgentesi]); // Agregar idAgentesi como dependencia si su valor puede cambiar
  //llamar a
  const listchat = async (idUser, limit, localTipoChat) => {


    console.log('el limite es ', limit)

    try {
      const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/listuser', { idUser, limit });
      const jsonData = response.data;
      setChatData(jsonData); // Actualiza el estado con los nuevos datos

      console.log('Listdtos', jsonData, localTipoChat);
    } catch (error) {
      console.error("Error al obtener los datos de la API :(", error);
    }
  };

  const handleSelectChat = (idUser, numero, botestado, nameclient, idlinea, idOdoo, linea, estdoQr, issesionQr) => {
    setSelectedUserId(idUser);
    console.log(selectedUserId)
    if (props.onSelectChat) {
      props.onSelectChat(idUser, numero, botestado, nameclient, tipochat, idlinea, idOdoo, linea, estdoQr, issesionQr);
      listchat(idAgentesi);
    }
  };



  //Funciones para abrir modal flotante
  const openExternalModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  //busqeuda de mensajes 
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [localResults, setLocalResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (query.length === 0) {
        setResults([]);
        return;
      }

      const postData = {
        agenteAsignado: idAgentesi,
        mensaje: query, // Añade el query de búsqueda aquí
      };

      try {

        const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/buscarMensaje', postData);
        setResults(Array.isArray(response.data) ? response.data : []);
        console.log('Los datos son', response.data)


      } catch (error) {
        console.error('Error al realizar la búsqueda:', error);
      }
    };

    // Implementar un debounce para evitar llamadas excesivas a la API
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, idAgentesi]);


  useEffect(() => {
    if (query.length === 0) {
      setLocalResults([]);
    } else {
      const filtered = chatData.filter(chat =>
        (String(chat[0]).toLowerCase().includes(query.toLowerCase()) ||
          chat[1].toLowerCase().includes(query.toLowerCase())) &&
        chat[5] === localTipoChat
      );
      setLocalResults(filtered);
    }
  }, [query, chatData, localTipoChat]);


  //scroll chats
   // Función para manejar el evento scroll
  


  const newLimit = (newLimitValue) => {
    console.log("Nuevo limit:", newLimitValue);

    listchat(idAgentesi, newLimitValue);

    // Aquí puedes implementar la lógica para cargar más elementos en tu lista, por ejemplo
  };

 // Actualiza handleClick para incluir la lógica de actualización de limit
 const handleClick = async () => {
  if (!isLoading) { // Verifica si ya se está cargando
    setIsLoading(true); // Establece el estado de carga a true
    const newLimitValue = limit + 25;
    setLimit(newLimitValue); // Actualiza el estado con el nuevo valor
    await newLimit(newLimitValue); // Espera a que la carga de datos termine
    setIsLoading(false); // Establece el estado de carga a false
  }
};

const handleScroll = () => {
  if (isLoading) return; // No hace nada si está cargando

  const { scrollTop, scrollHeight, clientHeight } = chatListRef.current;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    handleClick();
  }
};

useEffect(() => {
  const chatListElement = chatListRef.current;
  if (chatListElement) {
    chatListElement.addEventListener('scroll', handleScroll);
  }

  return () => {
    if (chatListElement) {
      chatListElement.removeEventListener('scroll', handleScroll);
    }
  };
}, [limit, isLoading]); 

  return (
    <div className='contentlist'>
      <header className='cbaralist'>
        <div className='icnosmovileschampi'>
          <Link to="/" >
            <i className="fas fa-chevron-left inavchmapo"></i>
          </Link>

        </div>




      </header>

      <div className='caberaslist'>
        <div className='cberabarra'>
          <i className="fas fa-search"></i>
          <input
            className="serrachuser"
            type="text"
            placeholder={language === 'es-ES' || language === 'es-MX' ? "Buscar un chat" : "Search"}

            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className='ldofiltro'>
          <i className="fas fa-filter filtroi"></i>
        </div>
      </div>

      <button className="floating-button" onClick={openExternalModal}>
        <i className="fas fa-user-plus"></i>
      </button>

      <div className="chatlist__items" ref={chatListRef}>
        {
          query.length > 0 ? (
            // Cuando hay algo en el input de búsqueda, mostramos los resultados de la búsqueda
            <ListResultsSearch results={results} localResults={localResults} onSelectChat={handleSelectChat} />
          ) : (
            // Cuando el input de búsqueda está vacío, mostramos la lista de chats
            filteredChats.map((item, index) => (
              <ListItemWP
                name={item[1]}
                key={item[0]}
                animationDelay={index + 1}
                numero={item[2]}
                id_user={item[0]}
                id_odoo={item[6]}
                status={item[3]}
                linea={item[4]}
                fecha={item[13]}
                ultimomsj={item[12]}
                visto={item[7]}
                quientienchat={item[8]}
                id_linea={item[9]}
                estadoqr={item[10]}
                idsesionqr={item[11]}
                onSelectChat={handleSelectChat}
                rol={rol}
              />
            ))
          )
        }

      </div>

      <ModalAddUser
        idAgentec={idAgentesi}
        isOpen={isModalOpen}
        onClose={closeModal}
        onSelectChat={handleSelectChat}
      />

    </div>
  );

}

export default Chatlist;