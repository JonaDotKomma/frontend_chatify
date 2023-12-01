import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Modalsujerecnia({ onClose, onSeleccion, numerotel, idagente, idlinea, pdfsend }) {
    const [contenido, setContenido] = useState([]);
    const [mostrar, setMostrar] = useState([]);
    const [urlPdfSeleccionado, setUrlPdfSeleccionado] = useState('');



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
        setUrlPdfSeleccionado(''); // Limpiar el PDF seleccionado cuando se muestran los textos
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


            const respuesta = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/initChat', postData);

            console.log('Catálogo enviado con éxito.', respuesta.data);
            pdfsend()
        } catch (error) {
            console.error("Error al enviar el catálogo:", error);
        }
    };


    //campos para busqueda

    const [textoBuscador, setTextoBuscador] = useState('');

    // ... useEffect y otras funciones

    const mostrarPDFs = () => {
        setMostrar(contenido.filter(item =>
            item.tipo_mensaje === "application/pdf" &&
            item.nombre_del_archivo.toLowerCase().includes(textoBuscador.toLowerCase())
        ));
    };

    // Cuando el texto del buscador cambia, actualiza el estado y filtra los PDFs
    useEffect(() => {
        setMostrar(contenido.filter(item =>
            item.tipo_mensaje === "application/pdf" &&
            item.nombre_del_archivo.toLowerCase().includes(textoBuscador.toLowerCase())
        ));
    }, [textoBuscador, contenido]);

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
                            <div>
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre del archivo..."
                                    value={textoBuscador}
                                    onChange={(e) => setTextoBuscador(e.target.value)}
                                    className='inputBusqueda'
                                />
                            </div>


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
                                    width="280px" // Ajusta el ancho como necesites
                                    height="500px" // Ajusta la altura como necesites
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
