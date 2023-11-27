import React, { useState, useEffect } from 'react';
import { GoogleLogin } from 'react-google-login';

import './login.css';
import Imglogin from '../img/imgpalogin.png'

function Login({ clientId, onSuccess, onFailure, onLoginClick }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Utiliza useEffect para actualizar los campos de entrada cuando los valores cambian
    useEffect(() => {
        setEmail(email);
        setPassword(password);
    }, [email, password]);

    const handleUsernameChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleLoginClick = () => {
        onLoginClick(email, password);
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <img src={Imglogin} alt="Your Brand" className="login-image" />
                <h1 className='txtprincipal'>Chatify</h1>
                <p>Todas tus plataformas de venta en un solo lugar</p>
                <div className='socilalinks'>
                    <i class="socilion fab  fa-whatsapp fa-2x" aria-hidden="true"></i>
                    <i class="socilion fab fa-facebook-messenger fa-2x" aria-hidden="true"></i>
                    <i class="socilion fab fa-instagram fa-2x" aria-hidden="true"></i>
                </div>
            </div>
            <div className="login-right">
                <p className="login-logo-text">Chatify</p> {/* Texto del logo añadido */}
                <p className="login-logo-subtext">by Dot&Komma</p>
                <div className='divslogin'>
                    <h2 > Log in</h2>
                </div>
                <div className='divslogin'>
                    <p>E-mail *</p>
                    <input
                        type="email"
                        placeholder="email@emali.com"
                        value={email}
                        onChange={handleUsernameChange}
                    />

                </div>

                <div className='divslogin'>
                    <p>Password *</p>
                    <input
                        type="password"
                        placeholder="Contraseña"
                        onChange={handlePasswordChange}
                        value={password}
                    />
                </div>

                <button className='btnligins' onClick={handleLoginClick}>Iniciar sesión</button>
                <div className="texto-con-lineas">
                    <span>or</span>
                </div>
                <GoogleLogin
                className='btnliging'
                  clientId={clientId}
                  onSuccess={onSuccess}
                  onFailure={onFailure}
                  buttonText="Google"
                  cookiePolicy={"single_host_origin"}
                />


                <p className='holi'>Todas tus plataformas de venta en un solo lugar</p>
                <div className='socilalinks'>
                    <i class="socilion fab  fa-whatsapp fa-2x" aria-hidden="true"></i>
                    <i class="socilion fab fa-facebook-messenger fa-2x" aria-hidden="true"></i>
                    <i class="socilion fab fa-instagram fa-2x" aria-hidden="true"></i>
                </div>
            </div>
        </div>
    );
}

export default Login;
