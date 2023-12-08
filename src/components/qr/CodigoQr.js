import React, { useState, useEffect, useRef } from 'react';
import './codigoqrstyle.css';
//import Qrimg from "../img/frameqr.png";
import Recarga from "../img/recarga.png";
import io from 'socket.io-client';
import axios from "axios";

function CodigoQr() {
    const [showQr, setShowQr] = useState(true);
    const timerRef = useRef(null);
    const idAgentesi = localStorage.getItem('idAgente');
    const hasFetched = useRef(false);
    const [qr64, setQR64] = useState('');

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

    useEffect(() => {
        if (!hasFetched.current) {
            getQR64(idAgentesi);
            hasFetched.current = true;
        }
    }, [idAgentesi]);

    useEffect(() => {
        const socket = io('https://socialcenterhtc-5d6f4ba539de.herokuapp.com', {
            transports: ['polling', 'websocket']
        });

        socket.on('validado', (data) => {
            console.log('Se valida');
            console.log(data.message);
             console.log(data.agent);
        });
        return () => {
            socket.disconnect();
        };
    });

    const resetQr = () => {
        setShowQr(true);
        resetTimer();
        getQR64(idAgentesi);
    };

    const getQR64 = async (idAgente) => {
        try {
            const response = await axios.post('http://localhost:8080/getQR', { idAgente });
            const jsonData = response.data;
            console.log(jsonData.qr);
            setQR64(jsonData.qr);
          } catch (error) {
            console.error("Error al obtener los datos de la API para el QR:", error);
          }
    }
    

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
                        <img src={qr64} alt='Escanea el QR' />
                    ) : (
                        <div>
                            <div className='container-qr'>
                                <img src={Recarga} alt='recarga' />
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
