import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import io from 'socket.io-client';
import audioNoti from '../../media/cartoon014.mp3'



function Menu({ onLogout }) {
    const [showSearch, setShowSearch] = useState(false);
    
    const idAgentesi = localStorage.getItem('idAgente');

    const [notificationsAllowed, setNotificationsAllowed] = useState(false);
    const initialWebCount = parseInt(localStorage.getItem('webNotificationCount') || "0");
    const initialFbCount = parseInt(localStorage.getItem('fbNotificationCount') || "0");
    const initialWACount = parseInt(localStorage.getItem('watsNotificationCount') || "0");
    const [webNotificationCount, setWebNotificationCount] = useState(initialWebCount);
    const [watsNotificationCount, setWatsNotificationCount] = useState(initialWACount);
    const [fbNotificationCount, setFbNotificationCount] = useState(initialFbCount);



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














    const toggleSearch = () => {
        setShowSearch(!showSearch);
    };


    const handleLogoutClick = () => {
        onLogout();
        // cualquier otra lógica adicional aquí
    };

    return (
        <div className="menu">
            <div className="menu-item">
                <div className="dropdown">
                    <div className='dato1'>   <i className="fas fa-bell menuicon"></i></div>
                    <div className="dropdown-content dropdown-content-right">
                        <Link className="btnnav" to="/ChatWathsapp" onClick={handleWALinkClick} >
                            <i className="fab fa-whatsapp"></i>
                            {watsNotificationCount > 0 && <span className="notification-badge"> Mensajes {watsNotificationCount}</span>}
                        </Link>

                        <Link className="btnnav" to="/ChatFacebook" >
                            <i className="fab fa-facebook-messenger"></i>
                            {fbNotificationCount > 0 && <span className="notification-badge"> Mensajes {fbNotificationCount}</span>}
                        </Link>

                        <Link className="btnnav" to="/ChatWeb" >
                            <i class="fab fa-shopify" ></i>
                            {webNotificationCount > 0 && <span > Mensajes {webNotificationCount}</span>}
                        </Link>


                    </div>
                </div>
            </div>

            {showSearch ? (
                <div className="menu-item">
                    <input type="text" placeholder="Buscar..." autoFocus />
                    <button className='bteb' onClick={toggleSearch}> <i className="fas fa-times-circle menuicon"></i></button>
                </div>
            ) : (
                <div className="menu-item">
                    <button className='bteb' onClick={toggleSearch}><i className="fas fa-search menuicon"></i></button>
                </div>
            )}

            <div className="menu-item">
                <div className="dropdown">
                    <div className='dato1'><i className="fas fa-user menuicon"></i></div>
                    <div className="dropdown-content dropdown-content-right">
                        <button onClick={handleLogoutClick}>Cesar sesion</button>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Menu;