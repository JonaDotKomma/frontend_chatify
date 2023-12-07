import React, { useState, useEffect } from 'react';
import './navstyles.css';
import Logo from "../img/HChatify.png"
import { Link } from "react-router-dom";
import io from 'socket.io-client';
import audioNoti from '../../media/notiWa.mp3'
import ModalPDF from '../chatContent/modales/ModalPDF';


function Nav() {
    const idAgentesi = localStorage.getItem('idAgente');

    const [notificationsAllowed, setNotificationsAllowed] = useState(false);
    const initialWebCount = parseInt(localStorage.getItem('webNotificationCount') || "0");
    const initialFbCount = parseInt(localStorage.getItem('fbNotificationCount') || "0");
    const initialWACount = parseInt(localStorage.getItem('watsNotificationCount') || "0");
    const [webNotificationCount, setWebNotificationCount] = useState(initialWebCount);
    const [watsNotificationCount, setWatsNotificationCount] = useState(initialWACount);
    const [fbNotificationCount, setFbNotificationCount] = useState(initialFbCount);


    const usertipo = localStorage.getItem('usertipo');


    useEffect(() => {
        Notification.requestPermission()
            .then(permission => {
                if (permission === "granted") {
                    setNotificationsAllowed(true);
                }
            });
    }, []);

    useEffect(() => {
        const socket = io('https://socialcenterhtc-5d6f4ba539de.herokuapp.com', {
            transports: ['polling', 'websocket']
        });

        socket.on('notification', (data) => {


            if (data.agente === parseFloat(idAgentesi)) {
                console.log('SI ME LLEGA PORQUE SI ES MI AGENTE MANO')
                if (notificationsAllowed) {
                    const notification = new Notification("Tienes una nueva notificación!", {
                        body: data.message
                    });
                    console.log(notification)
                }

                const audio = new Audio(audioNoti);
                audio.play();

                if (data.plataforma === "WA") {
                    const newCount = watsNotificationCount + 1;
                    setWatsNotificationCount(newCount);
                    localStorage.setItem('watsNotificationCount', newCount.toString());

                }
                if (data.plataforma === "WEB") {
                    const newCount = webNotificationCount + 1;
                    setWebNotificationCount(newCount);
                    localStorage.setItem('webNotificationCount', newCount.toString());

                }
                if (data.plataforma === "FB") {
                    const newCount = fbNotificationCount + 1;
                    setFbNotificationCount(newCount);
                    localStorage.setItem('fbNotificationCount', newCount.toString());

                }
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [notificationsAllowed, watsNotificationCount, webNotificationCount, fbNotificationCount, idAgentesi]);

    const handleWALinkClick = () => {
        setWatsNotificationCount(0);
        localStorage.setItem('watsNotificationCount', "0");
    };


    //funciones para orden
    const [ismodalpdf, setModalPdf] = useState(false);


    // Función para abrir el modal
    const abrirModalpdf = () => {
        setModalPdf(true)
    }
    // Función para cerrar el modal
    const cerrarModalpdf = () => {
        setModalPdf(false);

    };

    return (
        <div className="menu-lateral">
            <header className="menu-superior">
                <Link to="/">
                    <img src={Logo} alt="Logo" />
                </Link>
                <div className='inocnconte'>
                    <Link className="btnnav" to="/ChatWathsapp" onClick={handleWALinkClick} >
                        <i className="fab fa-whatsapp inav"></i>
                        {watsNotificationCount > 0 &&


                            <div class="notificaciones">
                                <span class="numero-notificaciones">{watsNotificationCount}</span>
                            </div>

                        }
                    </Link>

                    <Link className="btnnav" to="/ChatFacebook" >
                        <i className="fab fa-facebook-messenger inav"></i>
                        {fbNotificationCount > 0 && <span className="notification-badge"> {fbNotificationCount}</span>}
                    </Link>

                    <Link className="btnnav" to="/ChatInstgram" >
                        <i className="fab fa-instagram inav"></i>
                    </Link>
                    <Link className="btnnav" to="/ChatWeb" >
                        <i class="fab fa-shopify inav" ></i>
                        {webNotificationCount > 0 && <span className="notification-badge"> {webNotificationCount}</span>}
                    </Link>


                </div>
            </header>
            <footer className="menu-inferior">




                {
                    usertipo === "Administrador" ? (
                        <Link className="btnnav" to="/CodigoQr" >

                            <i className="fas fa-qrcode inav"></i>

                        </Link>
                    ) : (
                   null
                    )
                }
                <button onClick={abrirModalpdf} className="btnnav"> <i className="fas fa-file-invoice-dollar inav"></i></button>



                <Link className="btnnav" to="/Castores" >

                    <i className="fas fa-truck inav"></i>

                </Link>
                <Link className="btnnav" to="/CampanaMasiva" >
                    <i className="fa fa-bullhorn inav" ></i>
                </Link>

                {
                    usertipo === "Administrador" ? (
                        <Link className="btnnav" to="/Adminmodule" >
                            <i className="fas fa-user-cog inav"></i>
                        </Link>
                    ) : (
                        <Link className="btnnav" to="/PerfilUser" >
                            <i className="fas fa-user inav"></i>
                        </Link>
                    )
                }
            </footer>


            {ismodalpdf && <ModalPDF
                isOpen={ismodalpdf}
                onClose={cerrarModalpdf}


            />}
        </div>
    );
}

export default Nav;
