import React, { useState, useEffect } from 'react';
import './enviomasivostyle.css'; // Asegúrate de que el nombre del archivo CSS coincida
import Logomaisve from '../img/masivo.png'
import axios from "axios";


function Enviomasivo() {
    const idUser = localStorage.getItem('idAgente');


    // funciones apra cargar imagenes 
    const [selectedLine, setSelectedLine] = useState(''); // Estado para la línea seleccionada
    const [selectedTemplate, setSelectedTemplate] = useState(''); // Estado para la plantilla seleccionada


    //funciones para selelcionar categoria
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [allChats, setAllChats] = useState([]);
    const [message, setMessage] = useState('');


    useEffect(() => {
        // Realizar una solicitud GET a tu API
        axios.get('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/getcate') // Asegúrate de que la URL sea correcta
            .then((response) => {
                // Cuando se reciba una respuesta exitosa
                const data = response.data;
                setCategorias(data); // Actualiza el estado con los datos de la API
            })
            .catch((error) => {
                console.error('Error al obtener categorías:', error);
            });
    }, []);

    const handleCategoriaChange = (event) => {
        setCategoriaSeleccionada(event.target.value);
        listChatByCategory(2, event.target.value);

    };

    //Lista de lineas
    const [listLines, setListlines] = useState([])

    const handleSelectChange = (e) => {
        setSelectedLine(e.target.value);

    };

    useEffect(() => {
        (async () => {
            const postData = {
                idUser: idUser, // Poner el id del agente que lo envía
            };

            try {
                const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/listlines', postData);
                const jsonData = response.data;
                setListlines(jsonData);
            } catch (error) {
                console.error("Error al lineas", error);
            }
        })();     // eslint-disable-next-line   
    }, []);

    //Lista de Plantillas
    const [listPlantillas, setListPlantillas] = useState([])

    const plantillasMsj = async (lineuser) => {

        const postData = {
            idLinea: lineuser, // Poner el id del agente que lo envía
        };

        try {
            const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/getTemplate', postData);
            const jsonData = response.data;
            setListPlantillas(jsonData);
        } catch (error) {
            console.error("Error al lineas", error);
        }

    }

    const handleSelectTemplateChange = (e) => {
        setSelectedTemplate(e.target.value);

    };

    useEffect(() => {
        if (selectedLine) {
            plantillasMsj(selectedLine);
        }
    }, [selectedLine]);

    const listChatByCategory = async (idUser, category) => {
        if (category) {
            try {
                // let categoryInt = parseInt(category, 10);
                // console.log(categoryInt, "use", idUser)

                const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/listuserbycategory', { idUser, idCategoria: parseInt(category) });
                const jsonData = response.data;
                console.log(jsonData);
                setAllChats(jsonData);

            } catch (error) {
                console.error("Error al obtener los datos de la API (Mamo):", error);
            }
        } else {
            console.log('sin categoria')
        }

    };

    // const postData = {
    //     // Aquí puedes agregar los parámetros que espera tu API
    //     telefono: fullCustomerNumber,
    //     linea: selectedLine.toString(), // Convertir idlinea a string
    //     idAgente: parseInt(idAgentec), // Asegurar que idagente sea un entero
    //     nameTemplate: nameTemplate, //aqyui va el template.name_template seleccionado 
    //     bodyTemplate: bodyTemplate,///aqui av el template.body_template selecnionado 

    //   };

    const sendTemplates = async (allChats) => {

        // const formData = new FormData();
        // formData.append('imagen', image);
        // formData.append('idAgente', idUser);

        const [bodyTemplate, nameTemplate] = selectedTemplate.split('|');

        for (const chat of allChats) {
            const numero = chat[2];  // Extrae el número de teléfono del índice 2
            // const linea = chat[4]

            //Data
            const postData = {
                // Aquí puedes agregar los parámetros que espera tu API
                telefono: numero,
                linea: selectedLine.toString(), // Convertir idlinea a string
                idAgente: parseInt(idUser), // Asegurar que idagente sea un entero
                nameTemplate: nameTemplate, //aqyui va el template.name_template seleccionado 
                bodyTemplate: bodyTemplate,///aqui av el template.body_template selecnionado 

            };
            try {
                const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/initChat', postData);
                console.log(response)
                // console.log(`Mensaje enviado a ${numero}:`, response.data);
            } catch (error) {
                console.error(`Error al enviar la imagen a ${numero}:`, error);
            }
        }


        if (message.trim()) {

            // console.log('la linea es:', message)
            sendMessageToAPI(message, allChats);

        } else {
            // Limpia los datos
            console.log('hgfghfwghfhg')
            cleanupAfterSending();
        }
    };

    const sendMessageToAPI = async (messageContent, allChats) => {
        console.log("Enviando")
        for (const chat of allChats) {
            const numero = chat[2]; // Extrae el número de teléfono del índice 2
            const id_dlinea = chat[4]

            const postData = {
                numero: numero,
                mensaje: messageContent,
                idAgente: idUser,//poner el ide del agente que lo envia
                linea: id_dlinea

            };
            try {
                const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/sendmensaje', postData);
                console.log(response)
                // console.log(`Mensaje enviado a ${numero}:`, response.data);
                console.log("Mensaje enviado")
            } catch (error) {
                console.error(`Error al enviar el mensaje a ${numero}:`, error);
            }

            cleanupAfterSending();
        }


    };
    const cleanupAfterSending = () => {
        setSelectedLine("");
        setSelectedTemplate("");
        setCategoriaSeleccionada('');
        setMessage('');
    };

    return (
        <div className="envio-masivo">
            <header className="envio-masivo-header">
                <h1>Campañas de difusión</h1>
            </header>
            <div className="envio-masivo-content">
                <div className="envio-masivo-left">
                    <img src={Logomaisve} alt="Imagen Descriptiva" />
                </div>
                <div className="envio-masivo-right">
                    <form onSubmit={() => sendTemplates(allChats)}>

                        {/* Selecciona la linea */}

                        <div>
                            <p>Lista de lineas</p>
                            <select
                                className='ipaduser'
                                value={selectedLine}
                                onChange={handleSelectChange}
                                required
                            >
                                <option value="">Seleccione una linea</option>
                                {
                                    listLines.map((line) => (
                                        <option key={line[0]} value={line[0]}>{line[1]}</option>
                                    ))
                                }
                            </select>
                        </div>

                        {/* Select para plantillas  */}

                        <div>
                            <p>Lista de plantillas</p>
                            <select
                                className='ipaduser'
                                value={selectedTemplate}
                                onChange={handleSelectTemplateChange}
                                disabled={!selectedLine} // Desactivado si no se ha seleccionado una línea
                                required
                            >
                                <option value="">Seleccione una plantilla</option>
                                {listPlantillas.map((template) => (
                                    <option key={template.id_template_message} value={`${template.body_template}|${template.name_template}`}>
                                        {template.name_template}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Select para tipo de clientes  */}

                        <p>Selecciona el tipo de cliente al que quieres llegar</p>
                        <div>

                            <select value={categoriaSeleccionada} onChange={handleCategoriaChange} className="ipaduser" required>
                                <option value="">Selecciona una categoría</option>
                                {categorias.map((categoria) => (
                                    <option key={categoria.id_categoria} value={categoria.id_categoria}>
                                        {categoria.nombre_categoria}
                                    </option>
                                ))}

                            </select>

                        </div>

                        <button
                            type="submit"
                            className={`btncampana ${!selectedLine ? 'disabled' : ''}`}
                            disabled={!selectedLine}
                        >
                            Enviar Campaña Masiva
                        </button>
                    </form>
                </div>
            </div>



        </div>
    );
}


export default Enviomasivo;

