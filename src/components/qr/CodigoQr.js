import React, { useState, useEffect, useRef } from 'react';
import './codigoqrstyle.css';
import Qrimg from "../img/frameqr.png";

function CodigoQr() {
    const [showQr, setShowQr] = useState(true);
    const timerRef = useRef(null);

    const resetTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            setShowQr(false);
        }, 15000);
    };

    useEffect(() => {
        resetTimer();

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const resetQr = () => {
        setShowQr(true);
        resetTimer();
    };

    return (
        <div className='conteqr'>
            <div className='cbcra'></div>
            <div className='cardqr'>
                <div className='ladotxto'>
                    <h2>Vincula WhatsApp a Chatify</h2>
                    <p>1. Abre WhatsApp en tu teléfono.</p>
                    <p>2. Preciona Menu o ajustes y seleciona Dispositivos Vinculados.</p>
                    <p>3. Toca Vincular Dispositivo.</p>
                    <p>4. Apunta tu teléfono hacia la pantalla para escanear el código QR.</p>
                </div>

                <div className='ladoqr'>
                    {showQr ? (
                        <img src={Qrimg} alt='Escanea el QR' />
                    ) : (
                        <div>
                            <div className='container-qr'>
                                <img src={Qrimg} alt='Escanea el QR' />
                                <div className='bloqueoqr'>
                                    <p>La imagen caducó</p>

                                </div>

                            </div>
                            <div className='contebtnqr'>
                                <button className='btnqr' onClick={resetQr}>Reiniciar código</button>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CodigoQr;
