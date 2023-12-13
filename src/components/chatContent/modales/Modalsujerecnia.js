import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Modalsujerecnia({ onClose, onSeleccion, numerotel, idagente, idlinea, pdfsend }) {
    const [contenido, setContenido] = useState([]);
    const [mostrar, setMostrar] = useState([]);
    const [vistaActiva, setVistaActiva] = useState(''); // New state for tracking active view




    useEffect(() => {
        const cargarMensajes = async () => {
            try {
                const response = await axios.get('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/showPredeterminateMessages');
                setContenido(response.data);
                console.log('traje esto paa', response.data)
            } catch (error) {
                console.error("Error al obtener los datos de la API:", error);
            }
        };

        cargarMensajes();
    }, []);

    const mostrarTextos = () => {
        setMostrar(contenido.filter(item => item.tipo_mensaje === "text"));
        setVistaActiva('textos'); // Set active view to textos

    };






    const enviarCatalogo = async (mensajePdf) => {




        const postData = {
            // Aquí puedes agregar los parámetros que espera tu API
            telefono: numerotel,
            mensaje: mensajePdf,
            tipo: "application/pdf",
            linea: idlinea.toString(), // Convertir idlinea a string
            idAgente: parseInt(idagente) // Asegurar que idagente sea un entero


        };


        console.log('estoyenviado', postData)
        try {


            const respuesta = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/initChat', postData);

            console.log('Catálogo enviado con éxito.', respuesta.data);
            pdfsend()
        } catch (error) {
            console.error("Error al enviar el catálogo:", error);
        }
    };


    // ... useEffect y otras funciones

    const mostrarPDFs = () => {
        setMostrar(contenido.filter(item => item.tipo_mensaje === "application/pdf"));


        setVistaActiva('pdfs'); // Set active view to pdfs

    };

    // Cuando el texto del buscador cambia, actualiza el estado y filtra los PDFs
    useEffect(() => {
        setMostrar(contenido.filter(item => item.tipo_mensaje === "application/pdf"));

    }, [ contenido]);


    const handleSeleccion = (mensaje) => {
        onSeleccion(mensaje); // Call onSeleccion with the selected message
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

                    <div className='dtoscontesuge'>
                        {vistaActiva === 'textos' && (
                            <div>

                                <ul className="listaSinPuntos">
                                    {mostrar.map((item, index) => (
                                        <li key={index} onClick={() => handleSeleccion(item.mensaje)} className='lielement'>
                                            {item.mensaje}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {vistaActiva === 'pdfs' && (
                            <div className="iframeContainer">

                                {mostrar.map((item, index) => (

                                    <div className='divpfd'>
                                        <iframe
                                            key={index}
                                            src={`${item.mensaje}#page=1`}
                                            style={{ width: '300px', height: '300px', marginRight: '10px' }}
                                            title={`iframe-${index}`}
                                        ></iframe>

                                        <div>
                                            <p className='txtpdf'>{item.nombre_del_archivo}</p>
                                            <button
                                                className='sendmsv'
                                                onClick={() => enviarCatalogo(item.mensaje)} // Llamar a enviarCatalogo con item.mensaje
                                            >
                                                Enviar
                                            </button>                                        </div>

                                    </div>

                                ))}

                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Modalsujerecnia;
