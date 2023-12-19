import React, { useState, useEffect } from "react";
import Chatlist from '../chatlist/chatlist'
import Chatcontent from '../chatContent/chatcontent';
import './chatbodystyle.css';
import { useLocation } from 'react-router-dom';
import ChatVacio from "../chatContent/Chatvacio";


function Chatbody({ chatType }) {

  const idUser = localStorage.getItem('idAgente');
  const nombreAgente = localStorage.getItem('nombre');

  const location = useLocation();

  const {
    idcliente: routerIdUser,
    numero: routerNumero,
    botestado: routerBotestado,
    nameclient: routerNameclient,
    typechat: routerTypechat,
    idlinea: routeridlinea,
    idodoo: routerOdo
  } = location.state || {};


  console.log('el dato del dash', location.state);

  const [selectedId, setSelectedId] = useState(routerIdUser || null);
  const [numerselect, setNumerselect] = useState(routerNumero || null);
  const [boottas, setBoottas] = useState(routerBotestado || null);
  const [nameclientf, setNameclientf] = useState(routerNameclient || null);
  const [tipechat, settipechat] = useState(routerTypechat || null);
  const [iddlinea, setIddlinea] = useState(routeridlinea || null)
  const [idOdoochat, setIdOdooChat] = useState(routerOdo || null)
  const [namlineaname, setLineaname] = useState(null)
  const [estadoqr, setEstadoQr] = useState(null)
  const [idsesionqr, setIdsesionQr] = useState(null)




  const handleSelectChat = (id, numero, botestado2, nameclient2, tipochat, idlinea, idOdoo, linea, estdoQr, issesionQr) => {
    setSelectedId(id);
    setNumerselect(numero);
    setBoottas(botestado2);
    setNameclientf(nameclient2);
    settipechat(tipochat)
    setIddlinea(idlinea)
    setIdOdooChat(idOdoo)
    setLineaname(linea)
    setEstadoQr(estdoQr)
    setIdsesionQr(issesionQr)
    console.log('LO QUE MANDO A CONTENT', id, numero, botestado2, nameclient2, tipochat, idlinea, idOdoo, 'dto',);
  };



  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function resetSelectedId() {
    setSelectedId(null);
  }

  // Renderización condicional
  return (
    <div className='contentchats'>
      <div className='prtechats'>
        {!isMobile || (isMobile && !selectedId) ? (
          <Chatlist tipochat={chatType} onSelectChat={handleSelectChat} />
        ) : null}
      </div>
      {isMobile && selectedId ? (
       <Chatcontent  resetSelectedId={resetSelectedId}  typeclient={tipechat} sendiduser={selectedId} numerselect={numerselect} boottas={boottas} nameclientf={nameclientf} idagente={idUser} nameagente={nombreAgente} id_dlinea={iddlinea} id_odoo={idOdoochat} namelineac={namlineaname} estadoqrseison={estadoqr} issesionqr={idsesionqr}/>  
      ) : (
        <div className="partechat">
          {selectedId ? <Chatcontent   resetSelectedId={resetSelectedId}  typeclient={tipechat} sendiduser={selectedId} numerselect={numerselect} boottas={boottas} nameclientf={nameclientf} idagente={idUser} nameagente={nombreAgente} id_dlinea={iddlinea} id_odoo={idOdoochat} namelineac={namlineaname} estadoqrseison={estadoqr} issesionqr={idsesionqr}/>   : <ChatVacio />}
        </div>
      )}
    </div>
  );
}

export default Chatbody;