import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from "axios";
import ChatItem from './ChatItem';
import ModalImagen from './modalImg';
import CamposMjs from './Campomsj';
import './chatcontentstyle.css';

import DatosUser from './modales/Datosuser';

import ModalCancelUser from './modales/ModalCanceluser';

import ModalOportunidad from './modales/ModalOportunidad';
import ModalCambiarEstatus from './modales/ModalCambiarEstatus';
import ModalPDF from './modales/ModalPDF';

function Chatcontent(props) {

  const { sendiduser, numerselect, nameclientf, idagente, typeclient, id_dlinea, id_odoo, namelineac } = props;
  const messagesContainerRef = useRef(null);
  const [numberOfMessages, setNumberOfMessages] = useState(0);

  const [mensajes, setMensajes] = useState([]);
  const [ultimoMensajeRecibido, setUltimoMensajeRecibido] = useState(null);

  const [contador, setContador] = useState(0);
  const [mostrarBotonScroll, setMostrarBotonScroll] = useState(false);
  const [mensajesAgrupados, setMensajesAgrupados] = useState([]);


  useEffect(() => {
    const agruparPorFecha = mensajes.reduce((acc, mensaje) => {
      // Asumiendo que `mensaje` tiene una propiedad de fecha que puedes convertir a un objeto Date
      const fecha = new Date(mensaje.fecha);
      const fechaFormato = fecha.toLocaleDateString('es', { day: '2-digit', month: '2-digit', year: '2-digit' });

      if (!acc[fechaFormato]) {
        acc[fechaFormato] = [];
      }
      acc[fechaFormato].push(mensaje);
      return acc;
    }, {});

    setMensajesAgrupados(agruparPorFecha);
  }, [mensajes]);


  useEffect(() => {
    // Conectar al servidor Socket.IO
    const socket = io('https://socialcenterhtc-5d6f4ba539de.herokuapp.com');

    socket.on('notification', (data) => {

      // Aquí puedes hacer lo que necesites con los datos recibidos
      listMensajes(sendiduser);
    });

    // Llamar a listchat al montar el componente
    listMensajes(sendiduser);
    setHoliVisible(false)
    setSelectedMsjUser(null)
    setSelectedMessageId(null)


    // Limpiar al desmontar el componente
    return () => {
      socket.disconnect();
    };
  }, [sendiduser]);


  const [chatItms, setChatItms] = useState([]);

  const filteredChatItems = chatItms.filter((itm) =>
    itm.mensaje.toLowerCase()
  );


  const listMensajes = async (sendiduser) => {
    const postData = {
      idUser: sendiduser,
    };

    try {
      const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/getmensajes', postData);
      const jsonData = response.data;
      setMensajes(jsonData);
      setChatItms(response.data);
      // Desplazar el scroll hacia abajo

      // Filtrar los mensajes para encontrar el último con estado "received"
      const ultimoRecibido = jsonData.filter(mensaje => mensaje.status === 'recived').pop();
      setUltimoMensajeRecibido(ultimoRecibido); // Actualizar la variable de estado

      if (ultimoRecibido) {
        console.log('Último mensaje recibido:', ultimoRecibido);
        // Aquí puedes realizar las acciones que necesites con este mensaje
      } else {
        console.log('No se encontraron mensajes con estado "received"');
      }

      console.log('MENSAJES BROOOOOOOO', jsonData);
    } catch (error) {
      console.error("Error al obtener los datos de la API Chiale:", error);
    }
  };
  //modal imagen
  const [isModalOpenimg, setIsModalOpenimg] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");


  const openImageModal = (imageUrl) => {
    console.log('holas', imageUrl)

    setIsModalOpenimg(true);
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setIsModalOpenimg(false);
    setSelectedImage("");
  };

  //Modal cambiar lead
  const [isModalEstatus, setIsModalEstatus] = useState(false);
  const toggleModalEstatus = () => {
    setIsModalEstatus(!isModalEstatus);
  }

  //Modal crear opotunidad

  const [isModalOpenOportunidad, setIsModalOpenOportunidad] = useState(false);

  const openModalOportunidad = () => {
    setIsModalOpenOportunidad(true);
  }

  const closeModalOportunidad = () => {
    setIsModalOpenOportunidad(false);
  }

  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [selectedMsjUser, setSelectedMsjUser] = useState(null);
  const [selectedTypeMsj, setSelectedTypeMsj] = useState(null);

  const handleResponderClick = (idmsj, mensaje, typemsj) => {
    setSelectedMessageId(idmsj);
    setSelectedMsjUser(mensaje)
    setSelectedTypeMsj(typemsj)
    // Aquí puedes acceder a idmsj y hacer lo que necesites con él
    console.log(`Se hizo clic en Responder para el mensaje con id: ${idmsj} ${mensaje} ${typemsj}`);
    console.log("Valor actual de selectedMessageId en Chatcontent:", selectedMessageId);

    // Realiza la lógica para responder al mensaje aquí
  };


  //actulizar despues del envio de mensaje
  const actualizarMensajes = () => {
    setSelectedMessageId(null)
    listMensajes(sendiduser);
  };

  useEffect(() => {
    console.log("Valor actualizado de selectedMessageId en Chatcontent:", selectedMessageId);


  }, [selectedMessageId]); // Este useEffect se ejecutará cada vez que selectedMessageId cambie


  //ver dtos del cliente 
  // Paso 1: Agregar estado para controlar la visibilidad del div
  const [holiVisible, setHoliVisible] = useState(false);

  // Paso 2: Definir una función para mostrar u ocultar el div
  const toggleHoliVisibility = () => {
    setHoliVisible(!holiVisible);
  };



  let chatItemStyle;

  switch (typeclient) {
    case 'WA':
      chatItemStyle = 'stylewabg';
      break;
    case 'Fb':
      chatItemStyle = 'stylefbbg';
      break;
    case 'IG':
      chatItemStyle = 'styleigbg';
      break;
    case 'WEB':
      chatItemStyle = 'stylewebbg';
      break;
    default:
      // En caso de que tipochat no coincida con ninguno de los valores anteriores
      chatItemStyle = ''; // Puedes establecer un valor por defecto o dejarlo en blanco
      break;
  }


  useEffect(() => {
    const totalMessages = Object.values(mensajesAgrupados).flat().length;
    if (totalMessages > numberOfMessages) {

      // messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;

      const scrollPos = messagesContainerRef.current.scrollTop;
      const maxScroll = messagesContainerRef.current.scrollHeight - messagesContainerRef.current.clientHeight;

      const umbral = 500;
      if (scrollPos < maxScroll - umbral) {
        if (contador === 0) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
          setContador(1);
        } else {
          setMostrarBotonScroll(true);
        }

      } else {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
      setNumberOfMessages(totalMessages);
    }
  }, [mensajesAgrupados, numberOfMessages, contador, mostrarBotonScroll]);

  const hacerScrollHaciaAbajo = () => {
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    setMostrarBotonScroll(false);
  };

  //funciones par abloquear usuario
  const [ismodalBloqueo, setModalBloqueo] = useState(false);


  // Función para abrir el modal
  const abrirModalBloqueo = () => {
    setModalBloqueo(true)
  }
  // Función para cerrar el modal
  const cerrarModalBloqueo = () => {
    setModalBloqueo(false);
  };

  //btn ir a leads
  const redirectToLink = () => {
    window.location.href = `https://hantec-15-0-hr-account-luist-10483968.dev.odoo.com/web#menu_id=370&cids=1&action=613&active_id=${id_odoo}&model=crm.lead&view_type=kanban`;

  };


  //funciones par abloquear usuario
  const [ismodalpdf, setModalPdf] = useState(false);


  // Función para abrir el modal
  const abrirModalpdf = () => {
    setModalPdf(true)
  }
  // Función para cerrar el modal
  const cerrarModalpdf = () => {
    setModalPdf(false);
    actualizarMensajes()
  };

//Generar Pdf




  return (
    <div className={typeclient === 'WA' ? 'contenidchar' : 'contenidcharwhite'}>


      <div className={`contechatcuerpo ${holiVisible ? 'contechatcuerpo-wide' : ''} ${chatItemStyle}`}>
        <header className='cbrachats' >
          <p className='nmcecleint' onClick={toggleHoliVisibility}>
            {nameclientf} 
          </p>



          {
            id_odoo === null || id_odoo === '' ?
              <div className="divVacio">
                {/* Contenido a mostrar si id_odoo es null o vacío */}
              </div>
              :
              <div className='btnopCliente'>
                <button className='btnopclien' onClick={toggleModalEstatus}><i className="fas fa-filter"></i></button>
                <button className='btnopclien' onClick={openModalOportunidad}><i className="fas fa-star"></i></button>
                <button className='btnopclien' onClick={abrirModalpdf}><i className="fas fa-file-invoice-dollar"></i></button>
                <button className='btnopclien' onClick={abrirModalBloqueo}><i className="fas fa-ban"></i></button>
              </div>
          }






          {
            id_odoo === null || id_odoo === '' ?
              <div className="divVacio">
                {/* Contenido a mostrar si id_odoo es null o vacío */}
              </div>
              :
              <div className='btnsodofuncios2'>
                <button className='btniconodoo2'>

                  <i className="fas fa-dollar-sign"></i>
                </button>

                <button className='btniconodoo2' onClick={redirectToLink}>

                  <i className="fas fa-star"></i>
                </button>

              </div>
          }





        </header>

        <div className='content__body' ref={messagesContainerRef}>
          {Object.keys(mensajesAgrupados).map((fecha) => (
            <React.Fragment key={fecha}>



              <div className='divfechaprincipal'>
                <div className='divfecha'>
                  <p className="message-date">{fecha}</p>
                </div>
              </div>
              {mensajesAgrupados[fecha].map((msg, index) => (
                <ChatItem
                  key={index} data={msg}
                  openImageModal={openImageModal}
                  responseMessage={msg.id_response_message
                    ? filteredChatItems.find(m => m.id_mensaje === msg.id_response_message)?.mensaje
                    : null
                  }
                  responseMessageType={msg.id_response_message
                    ? filteredChatItems.find(m => m.id_mensaje === msg.id_response_message)?.type
                    : null
                  }

                  onResponder={handleResponderClick} // Pasa la función handleResponderClick como prop
                  isSelected={msg.id_mensaje === selectedMessageId}
                  tipochat={typeclient}

                />
              ))}
            </React.Fragment>
          ))}
          {mostrarBotonScroll && (
            <button onClick={hacerScrollHaciaAbajo} className="botonNuevoMensaje">
              ⬇️
            </button>
          )}
        </div>

        <div className='footerChat'>
          {ultimoMensajeRecibido && (
            <CamposMjs
              numerselect={numerselect}
              idagente={idagente}
              id_dlinea={id_dlinea}
              onMensajeEnviado={actualizarMensajes}
              selectedMessageId={selectedMessageId}
              selectedMsjUser={selectedMsjUser}
              selectedTypeMsj={selectedTypeMsj}
              tipochat={typeclient}
              fechaulmsjcliente={ultimoMensajeRecibido.fecha}
            />
          )}

        </div>
      </div>

      {holiVisible && (

        <div className='conttdtosuser'>
          <DatosUser sendiduser={sendiduser} nombrecliente={nameclientf} onClose={toggleHoliVisibility} />



        </div>

      )}


      {isModalOpenimg && (
        <ModalImagen
          isOpen={isModalOpenimg}
          closeModal={closeImageModal}
  

          imageUrl={selectedImage}

        />
      )}


      {ismodalBloqueo && <ModalCancelUser
        isOpen={ismodalBloqueo}
        onClose={cerrarModalBloqueo}


      />}



      {ismodalpdf && <ModalPDF
        isOpen={ismodalpdf}
        onClose={cerrarModalpdf}
        numerselect={numerselect}
        idagente={idagente}
        id_dlinea={id_dlinea}

      />}


      {isModalOpenOportunidad && (
        <ModalOportunidad
          closeModal={closeModalOportunidad}
          idUsuario={sendiduser}
          nameLinea={namelineac}
        />
      )}

      {
        isModalEstatus && (
          <ModalCambiarEstatus
            closeModal={toggleModalEstatus}
            idUsuario={sendiduser}
          />
        )
      }


    </div>
  );
}

export default Chatcontent;