import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Modalsujerecnia({ onClose, onSeleccion, numerotel, idagente, idlinea, pdfsend }) {
    const [contenido, setContenido] = useState([]);
    const [mostrar, setMostrar] = useState([]);
    const [urlPdfSeleccionado, setUrlPdfSeleccionado] = useState('');



    useEffect(() => {
        const cargarMensajes = async () => {
            try {
                const response = await axios.get('https://apiservhtc-d76a501f67be.herokuapp.com//showPredeterminateMessages');
                setContenido(response.data);
            } catch (error) {
                console.error("Error al obtener los datos de la API:", error);
            }
        };

        cargarMensajes();
    }, []);

    const mostrarTextos = () => {
        setMostrar(contenido.filter(item => item.tipo_mensaje === "text"));
        setUrlPdfSeleccionado(''); // Limpiar el PDF seleccionado cuando se muestran los textos
    };

    const mostrarPDFs = () => {
        setMostrar(contenido.filter(item => item.tipo_mensaje === "application/pdf"));
    };

    const seleccionarPdf = (url) => {
        setUrlPdfSeleccionado(url);
    };


    const enviarCatalogo = async () => {
        if (!urlPdfSeleccionado) {
            console.error("No hay un catálogo seleccionado para enviar.");
            return;
        }


         
        const postData = {
            // Aquí puedes agregar los parámetros que espera tu API
            telefono: numerotel,
            mensaje: urlPdfSeleccionado,
            tipo: "application/pdf",
            linea: idlinea.toString(), // Convertir idlinea a string
            idAgente: parseInt(idagente) // Asegurar que idagente sea un entero
     

        };


        console.log('estoyenviado', postData)
        try {
           

            const respuesta = await axios.post('https://apiservhtc-d76a501f67be.herokuapp.com//initChat', postData);

            console.log('Catálogo enviado con éxito.', respuesta.data);
            pdfsend()
        } catch (error) {
            console.error("Error al enviar el catálogo:", error);
        }
    };


    return (
        <div className="modalOverlaysuge">
            <div className="modalContentsuge">
                <div className='headermodals'>
                    <p>Plantillas de mensaje</p>
                    <button onClick={onClose}><i className="fas fa-times"></i></button>
                </div>

                <div className='contentsuge' style={{ display: 'flex' }}> {/* Usando flex para dividir en columnas */}
                    <div className='dtospasug'> {/* Columna de botones */}
                        <button
                            className="buttonSuge"
                            onClick={mostrarTextos}
                        >
                            Saludo
                        </button>
                        <button
                            className="buttonSuge"
                            onClick={mostrarPDFs}
                        >
                            Catálogo interactivo
                        </button>
                    </div>

                    <div className='dtoscontesuge'> {/* Columna de lista */}
                        <div className='dtolista'>
                            <ul className="listaSinPuntos">
                                {mostrar.map((item, index) => (
                                    <li
                                        className='lielement'
                                        key={index}
                                        onClick={() => item.tipo_mensaje === "text" ? onSeleccion(item.mensaje) : seleccionarPdf(item.mensaje)}
                                    >
                                        {item.tipo_mensaje === "text" ? item.mensaje : item.nombre_del_archivo}
                                    </li>
                                ))}
                            </ul>
                        </div>


                        {urlPdfSeleccionado && (
                            <div className="pdfViewer"> {/* Columna del visor de PDF */}
                                <iframe
                                    src={urlPdfSeleccionado}
                                    frameBorder="0"
                                    width="300px" // Ajusta el ancho como necesites
                                    height="80%" // Ajusta la altura como necesites
                                    allow="fullscreen"
                                    title='pdfsend'
                                ></iframe>
                                <button className='btncatalogo' onClick={enviarCatalogo}>
                                    Enviar Catálogo
                                </button>


                            </div>
                        )}
                    </div>


                </div>
            </div>
        </div>
    );
}

export default Modalsujerecnia;
