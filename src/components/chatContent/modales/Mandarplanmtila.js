import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ModalPlatilla({ isOpen, onClose,numroclitne, idAgentec, idlinemsj }) {
    const [listplantilla, setListplantilla] = useState([])
    const [selectedTemplate, setSelectedTemplate] = useState(''); // Estado para la plantilla seleccionada
    const [idrespuesta, setIdrespuesta] = useState('');
    const selectedLine=idlinemsj; // Estado para la línea seleccionada
    const customerNumber= numroclitne ; // Estado para el número del cliente

   




    useEffect(() => {
        if (selectedLine) {
            plantillasmsj(selectedLine);
        }
    }, [selectedLine]);


    useEffect(() => {
        if (idrespuesta) {
            console.log('el id de respuesta es', idrespuesta);
            setSelectedTemplate('');
            setIdrespuesta('');
            onClose();
        }
    }, [idrespuesta, onClose]); 
    
    //buscar plantillas 
    const plantillasmsj = async (lineuser) => {

        const postData = {
            idLinea: lineuser, // Poner el id del agente que lo envía
        };

        try {
            const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/getTemplate', postData);
            const jsonData = response.data;
            setListplantilla(jsonData);
            console.log('Platilla pa', jsonData);
        } catch (error) {
            console.error("Error al lineas", error);
        }

    }

   

    const handleSelectTemplateChange = (e) => {
        setSelectedTemplate(e.target.value);

    };

    if (!isOpen) return null;


    const enviarCatalogo = async () => {
        if (!customerNumber || !selectedLine) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        console.log('el', selectedTemplate)
        

        const [bodyTemplate, nameTemplate, tipo, link_media] = selectedTemplate.split('|');

        console.log('cuertpobody', bodyTemplate,customerNumber )


        const postData = {
            // Aquí puedes agregar los parámetros que espera tu API
            telefono: customerNumber,
            linea: selectedLine.toString(), // Convertir idlinea a string
            idAgente: parseInt(idAgentec), // Asegurar que idagente sea un entero
            nameTemplate: nameTemplate, //aqyui va el template.name_template seleccionado 
            bodyTemplate: bodyTemplate,///aqui av el template.body_template selecnionado 
            tipoTemplate: tipo ? tipo : '',
            urlMediaTemplate: link_media ? link_media : ''
        };


        console.log('estoyenviado', postData)
        try {


            const respuesta = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/initChat', postData);

            console.log('plantilla enviada con éxito.', respuesta.data);

            setIdrespuesta(respuesta.data)


        } catch (error) {
            console.error("Error al enviar plantilla:", error);
        }

        console.log('el id de respuesta es ', idrespuesta)

    };



    return (
        <div className="modal-overlayuser">
            <div className="modal-containeruser">


                <div className='cbramodaluser'>
                    <div className='tlmu'>
                        <h2>Iniciar Conversación </h2>
                    
                    </div>
                    <div className='bnclus'>
                        <button className='btnclomu' onClick={onClose}><i className="fas fa-times"></i></button>
                    </div>
                </div>
                <div className='containerMain'> 
                <div className='cls'>                            
                    <div>
                        <p>Plantilla mensaje</p>
                        <select
                            className='ipaduser'
                            value={selectedTemplate}
                            onChange={handleSelectTemplateChange}
                            disabled={!selectedLine} // Desactivado si no se ha seleccionado una línea
                        >

                            <option value="0">Seleccione una plantilla</option>
                            {listplantilla.map((template) => (
                                <option key={template.id_template_message} value={`${template.body_template}|${template.name_template}|${template.tipo}|${template.link_media}`}>
                                    {template.name_template}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>
                <div className='clr'>
                    <div className='titlePreview'>
                    Previsualización
                    </div>
                    
                    <div className='previewTemplate'>
                    {/* eslint-disable-next-line */}
                    {selectedTemplate.split('|')[2] == 'video' ?
                        <video
                            width="65%"
                            height="197.77"
                            controls
                        >
                            <source src={selectedTemplate.split('|')[3]} type="video/mp4" />
                            Tu navegador no admite el elemento de video.
                        </video> : <div> </div>                                          
                    }
                    <p>{selectedTemplate.split('|')[0]}</p>
                    </div>
                </div>

                </div>

                <div className='butoncont'>
                    <button className='btngenerico' onClick={enviarCatalogo}>Enviar datos</button>

                </div>
            </div>

            
        </div>
    );
}

export default ModalPlatilla;
