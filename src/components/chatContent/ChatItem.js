import React, { useState } from 'react';

export default function ChatItem({ data, openImageModal, responseMessage, responseMessageType, onResponder, isSelected, tipochat }) {


    let chatItemStyle;

    switch (tipochat) {
        case 'WA':
            chatItemStyle = 'stylewa';
            break;
        case 'FB':
            chatItemStyle = 'stylefb';

            break;
        case 'IG':
            chatItemStyle = 'styleig';

            break;
        case 'WEB':
            chatItemStyle = 'styleweb';

            break;
        default:
            // En caso de que tipochat no coincida con ninguno de los valores anteriores
            chatItemStyle = ''; // Puedes establecer un valor por defecto o dejarlo en blanco
            break;
    }


    const gmtDate = new Date(data.fecha);
    const mexicoTimeZone = "America/Mexico_City";
    const options = { timeZone: mexicoTimeZone, hour12: true, hour: "2-digit", minute: "2-digit" };
    const mexicoTime = gmtDate.toLocaleTimeString("en-US", options);
    const [clickedImageUrl, setClickedImageUrl] = useState("");

    const handleImageClick = (imageUrl) => {
        setClickedImageUrl(imageUrl);
        openImageModal(imageUrl);
        console.log(clickedImageUrl)
    };

    let content;

    if (data.type === 'image/jpeg') {
        content = (
            <div className="videochatr">
                <img className="imgchat" src={data.mensaje} alt="" onClick={() => handleImageClick(data.mensaje)} />
                <div>{data.caption}</div>
            </div>
        );
    } else if (data.type === 'video/mp4') {
        content = (
            <div className="videochatr">
                <video
                    width="300"
                    height="197.77"
                    controls
                >
                    <source src={data.mensaje} type="video/mp4" />
                    Tu navegador no admite el elemento de video.
                </video>
                <div>{data.caption}</div>
            </div>
        );
    }
    else if (data.type === 'audio/ogg; codecs=opus' || data.type === 'audio/mpeg') {
        content = (
            <div className='audiocon'>
                <audio controls className='auimsj'>
                    <source src={data.mensaje} type="audio/ogg" className="audios" style={{ backgroundColor: 'blue', padding: '10px' }} />
                </audio>
            </div>
        );
    }
    else if (data.type === 'image/webp') {
        content = (
            <div className="stikce">
                <img className="mediasticker" src={data.mensaje} alt="" onClick={() => handleImageClick(data.mensaje)} />
                <div>{data.caption}</div>
            </div>
        );

    }
    else if (data.type === 'application/pdf') {
        content = (
            <div>
                <iframe
                    src={data.mensaje}
                    width="90%"
                    height="300px"
                    title="PDF Viewer"
                ></iframe>
                <a className={`chat__item ${data.id_agente === 0 ? "enlacepdfw" : "enlacepdfb"}`} href={data.mensaje} target="_blank" rel="noopener noreferrer">
                    <i class="fa fa-file-pdf-o" aria-hidden="true"></i>  Ver pantalla completa
                </a>

                <div>{data.caption}</div>
            </div>
        );
    }
    else {
        if(data.anuncio){

            content = (
                <div className="chat__msg" style={{ wordWrap: "break-word" }}> <a rel="noreferrer" target="_blank" href={data.anuncio}><img className="imgchat" src={data.media_anuncio} alt="" /><br></br></a>{data.mensaje}</div>
              );
        }else{
            
            content = (
                <div className="chat__msg" style={{ wordWrap: "break-word" }}>{data.mensaje}</div>
            );
        }
    }

    ///respondidos mensjaes
    const [duration, setDuration] = useState(0);
    const handleMetadata = (e) => {
        setDuration(e.target.duration);
    };


    let responseInnerContent;

    if (responseMessageType === 'image/jpeg') {
        responseInnerContent = (
            <div className="div-img-rpta">
                <div className="txtoimg">
                    <i className="fas fa-camera-retro"></i>
                    <p>Foto</p>
                </div>
                <div>
                    <img src={responseMessage} alt="Respuesta" />
                </div>
            </div>
        );
    } else if (responseMessageType === 'application/pdf') {
        responseInnerContent = (
            <div className="divtxtrpta">
                <div className="div-img-rpta">
                    <div className="txtoimg">
                        <i className="fas fa-file-alt"></i>
                        <p>Doc</p>
                    </div>
                    <div>
                        <a className={`chat__item ${data.id_agente === 0 ? "enlacepdfw" : "enlacepdfb"}`} href={responseMessage} target="_blank" rel="noopener noreferrer">
                            Ver pantalla completa
                        </a>

                    </div>
                </div>
            </div>
        );
    } else if (responseMessageType === 'image/webp') {
        responseInnerContent = (
            <div className="divtxtrpta">
                <img className="mediastickerespo" src={responseMessage} alt="Respuesta" />
            </div>
        );
    }
    else if (responseMessageType === 'video/mp4') {
        responseInnerContent = (
            <div className="div-img-rpta">
                <div className="txtoimg">
                    <i className="fas fa-video"></i>
                    <p>Video</p>
                </div>
                <div>
                    <video
                        width="150"
                        height="80"
                        controls
                        poster="url_de_tu_imagen.jpg"  // Reemplaza con la URL de tu imagen
                    >
                        <source src={responseMessage} type="video/mp4" />
                        Tu navegador no admite el elemento de video.
                    </video>      </div>
            </div>
        );
    }
    else if (responseMessageType === 'audio/ogg; codecs=opus') {
        responseInnerContent = (


            <div className="audio-response">
                <div className="audio-wrapper">
                    <div className="audio-icon">
                        <i className="fas fa-microphone"></i>
                    </div>
                    <div className="audio-duration">
                        <audio
                            onLoadedMetadata={handleMetadata}
                            preload="metadata"
                            style={{ display: "none"}}
                        >
                            <source src={responseMessage} type="audio/ogg" />
                        </audio>
                        {duration > 0 && <p>{duration.toFixed(2)}</p>}
                    </div>
                </div>
            </div>


        );
    } else {
        responseInnerContent = (
            <div className="divtxtrpta">

                <p className='txztres'>
                    {responseMessage && responseMessage.length > 50
                        ? `${responseMessage.substring(0, 50)}...`
                        : responseMessage}
                </p>

            </div>
        );
    }

    const responseContent = responseMessage ? (

        <div className={`response-content ${data.status === 'recived' ? "recibed" : ""}`}>
            <div className="divclor"></div>
            <div className="divtxtrpta">
                <h2 className='tiloresp'>{data.nickname}</h2>
                {responseInnerContent}


            </div>
        </div>
    ) : null;

    const [showMenu, setShowMenu] = useState(false);

    const [showCheckmark, setShowCheckmark] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleResponderClick = () => {
        // Llama a la función onResponder con el valor de idmsj


        onResponder(data.id_mensaje, data.mensaje, data.type);

        setShowMenu(false);

        // Muestra el ícono de la palomitaN
        setShowCheckmark(true);
        console.log(showCheckmark)
    };


    return (
        <div className={`chat__item ${data.status === 'recived' ? "recibed" : ""}`}>

            {showMenu && (
                <ul className="listop">
                    <li onClick={handleResponderClick}>Responder</li>

                </ul>
            )}



            <div>
                {isSelected && (
                    <div className="checkmark-icon">
                        <i className="fas fa-reply"></i>
                    </div>
                )}
                <button onClick={toggleMenu} className="btnopmsj"><i className="fas fa-ellipsis-v"></i></button>

            </div>


            <div className={`chat__item__content ${chatItemStyle}`} style={{ wordWrap: "break-word" }}>
                {responseContent}
                {content}
                <div className="chat__meta">

                    <span> {mexicoTime}  {data.id_agente !== 0 && data.nickname} </span>
                </div>

            </div>



        </div>
    );
}
