import React, { useState, useRef, useEffect } from 'react';
import './campomsjstyles.css'
import axios from 'axios';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import Modalsujerecnia from './modales/Modalsujerecnia';
import ModalPlatilla from './modales/Mandarplanmtila';




function CamposMjs({ numerselect, idagente, id_dlinea, onMensajeEnviado, selectedMessageId, selectedMsjUser, selectedTypeMsj, tipochat, fechaulmsjcliente }) {

    const [mensaje, setMensaje] = useState([]);
    const [lineas, setLineas] = useState(1);
    const textareaRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef(null);
    const [imageDetected, setImageDetected] = useState(false);

    const [imagePreview, setImagePreview] = useState([]); // Estado para previsualización de imágenes
    const [imagePreviewVisible, setImagePreviewVisible] = useState(false);

    //Variable modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [uploadProgress, setUploadProgress] = useState(0);


    useEffect(() => {
        setMensaje([]); // Restablece el estado 'mensaje' a una cadena vacía

    }, [numerselect]);


    useEffect(() => {
        // Función para detectar clics fuera del emoji picker.
        function handleClickOutside(event) {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        }

        // Añadir el detector de eventos al montar el componente.
        document.addEventListener("mousedown", handleClickOutside);
        // Limpiar y quitar el detector de eventos al desmontar el componente.
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const enviarMensaje = async () => {
        console.log('el msj es', mensaje)

        if (Array.isArray(mensaje) && mensaje.length > 0) {
            for (let item of mensaje) {
                console.log('elitem', item.type)
                if (item.type === 'image/jpeg' || item.type === 'image/png') {
                    // Enviar cada imagen
                    await sendImageToUser(item);
                } else if (item.type === 'application/pdf') {
                    // Enviar PDF
                    await sendPdfToUser(item);
                } else {
                    alert("Formato de archivo no válido. Solo se admiten imágenes (JPEG/PNG) y PDF.");
                }
            }
            setMensaje([]); // Limpiar el arreglo después de enviar los archivos

        } else if (typeof mensaje === "string" && mensaje.trim() !== "") {
            console.log('entre al if')
            const postData = {
                numero: numerselect,
                mensaje: mensaje,
                idAgente: idagente, // Poner el id del agente que lo envía
                linea: id_dlinea
            };

            try {
                const response = await axios.post('/sendmensaje', postData);
                console.log(response);

            } catch (error) {
                console.error('Error al enviar mensajes a la API:', error);
            }

        } else {
            alert("No se puede enviar un mensaje vacío.");
        }

        setMensaje([]);  // Limpiar el área de texto después de enviar
        onMensajeEnviado();
        setImagePreview([]);
        setImagePreviewVisible(false)
    };


    // Función para responder a un mensaje
    const responderMensaje = async () => {
        if (!mensaje.trim()) return;

        console.log('Entrando....')


        const postData = {
            numero: numerselect,
            mensaje: mensaje,
            idAgente: idagente, // Poner el id del agente que lo envía
            linea: id_dlinea,
            idMensajeResponse: selectedMessageId // Agrega idmsj a los datos de postData
        };


        try {
            const respuesta = await axios.post('/sendResponseWA', postData);

            console.log('Mensaje enviado:', respuesta.data);
            setMensaje([]);  // Limpiar el área de texto después de enviar
            onMensajeEnviado();
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            setMensaje("");
        }


    };
    const handleEmojiSelect = (emoji) => {
        const updatedMessage = mensaje + emoji.native;
        setMensaje(updatedMessage);
    };

    ///imagenes carga de imagenen ene l input o con el boton 

    const handleTextChange = (e) => {
        const inputValue = e.target.value;
        setMensaje(inputValue);

        // Verificar si el valor es una imagen o un PDF
        if (
            (inputValue instanceof File && inputValue.type.startsWith("image/")) ||
            (inputValue instanceof File && inputValue.type === "application/pdf")
        ) {
            setImageDetected(true);
            console.log('Esta una imagen mano', imageDetected);
        } else {
            setImageDetected(false);
        }

        const lineasActuales = e.target.value.split('\n').length;
        if (lineasActuales <= 4) {
            setLineas(lineasActuales);
        } else if (lineas < 4) {
            setLineas(4);
        }
    };


    

    const handleAddFilesClick = () => {
        document.getElementById('fileInput').click();
      };
      
      const handleFileChange = (files) => {
        const filteredFiles = Array.from(files).filter(file =>
          file.type.startsWith("image/") || file.type === "application/pdf"
        );
      
        if (filteredFiles.length > 0) {
          const newPreviews = filteredFiles.map(file => URL.createObjectURL(file));
      
          setMensaje(prevMensaje => [...prevMensaje, ...filteredFiles]);
          setImagePreview(prevPreview => [...prevPreview, ...newPreviews]);
          setImagePreviewVisible(true); // Controla la visibilidad de las previsualizaciones
        }
      };

    const handlePaste = (e) => {
        const clipboardData = e.clipboardData || window.clipboardData;
        const pastedItem = clipboardData.items[0];

        if (pastedItem && (pastedItem.type.startsWith("image/") || pastedItem.type === "application/pdf")) {
            const file = pastedItem.getAsFile();
            setMensaje(file);
            const fileURL = URL.createObjectURL(file);
            setImagePreview(fileURL);
            e.preventDefault();
            setImagePreviewVisible(true);

        }
    };

    const handleDrop = (e) => {
        e.preventDefault();

        // Suponiendo que quieres permitir múltiples archivos en un solo drop
        const files = Array.from(e.dataTransfer.files).filter(file =>
            file.type.startsWith("image/") || file.type === "application/pdf"
        );

        if (files.length > 0) {
            const newPreviews = files.map(file => URL.createObjectURL(file));

            setMensaje(prevMensaje => [...prevMensaje, ...files]);
            setImagePreview(prevPreview => [...prevPreview, ...newPreviews]);
            setImagePreviewVisible(true); // Asumiendo que esto controla la visibilidad de las previsualizaciones
        }
    };

    const sendImageToUser = async (image) => {

        console.log('la imagen es ', image)
        const formData = new FormData();
        formData.append('imagen', image);
        formData.append('idAgente', idagente);
        formData.append('linea', id_dlinea)
        formData.set('numero', numerselect);



        const config = {
            onUploadProgress: progressEvent => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
            }
        };


        try {
            const response = await axios.post('/send-image', formData, config);
            console.log(`Imagen enviada a ${numerselect}:`, response.data);
            console.log(image)

        } catch (error) {
            console.error(`Error al enviar la imagen a ${numerselect}:`, error);
        }

        setMensaje([]);  // Limpiar el área de texto después de enviar
        onMensajeEnviado();
        setImagePreview([]);
        setImagePreviewVisible(false)
    };

    const sendPdfToUser = async (image) => {


        const formData = new FormData();
        formData.append('pdf', image);
        formData.append('idAgente', idagente);
        formData.append('linea', id_dlinea)
        formData.set('numero', numerselect);



        console.log('kahkdsa', formData)
        try {
            const response = await axios.post('/send-pdf', formData);
            console.log(`PDF enviada o ${numerselect}:`, response.data);
        } catch (error) {
            console.error(`Error al enviar el PDf a ${numerselect}:`, error);
        }

        setMensaje([]);  // Limpiar el área de texto después de enviar
        onMensajeEnviado();
        setImagePreview([]);
        setImagePreviewVisible(false)
    };
    //modal sugerencia

    const manejarSeleccion = (mensaje) => {
        setIsModalOpen(false); // Esto cerrará el modal
        setMensaje(mensaje);
    };


    const senviopdf = () => {
        setIsModalOpen(false); // Esto cerrará el modal

        onMensajeEnviado();
    }

    let chatItemStyle;

    switch (tipochat) {
        case 'WA':
            chatItemStyle = 'stylewabarra';
            break;
        case 'FB':
            chatItemStyle = 'stylefbbarra';

            break;
        case 'IG':
            chatItemStyle = 'styleigbarra';

            break;
        case 'WEB':
            chatItemStyle = 'stylewebbarra';

            break;
        default:
            // En caso de que tipochat no coincida con ninguno de los valores anteriores
            chatItemStyle = ''; // Puedes establecer un valor por defecto o dejarlo en blanco
            break;
    }


    ///Audios padrino

    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const mediaRecorder = useRef(null);

    const startRecording = async () => {

        setAudioURL('')
        // Solicitar permiso al usuario para utilizar el micrófono
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const options = {
            mimeType: 'audio/webm; codecs=opus',
            audioBitsPerSecond: 40000 // 16 Kbps para una calidad de voz suficiente
        };

        // Crear una instancia de MediaRecorder
        mediaRecorder.current = new MediaRecorder(stream, options);
        // Empezar la grabación
        mediaRecorder.current.start();
        // Indicar en el estado que la grabación está en curso
        setIsRecording(true);

        // Al detener la grabación, obtener los datos del audio
        mediaRecorder.current.ondataavailable = (e) => {
            setAudioURL(URL.createObjectURL(e.data));
        };
    };

    const stopRecording = () => {
        // Detener la grabación
        mediaRecorder.current.stop();
        // Cerrar el stream del micrófono
        mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
        // Indicar en el estado que la grabación ha terminado
        setIsRecording(false);
    };


    const uploadAudio = async () => {
        const blob = await fetch(audioURL).then(r => r.blob());
        const audioFile = new File([blob], 'recording.webm', {
            type: 'audio/webm; codecs=opus', // el tipo MIME para mp3 es audio/mpeg
            lastModified: Date.now(), // establece la fecha de modificación actual
        });

        console.log('es este', audioFile)
        const formData = new FormData();

        formData.set('numero', numerselect);
        formData.append('audio', audioFile);
        formData.append('idAgente', idagente);
        formData.append('linea', id_dlinea)


        try {
            const response = await axios.post('/send-audio', formData);
            console.log(`audio enviada a ${numerselect}:`, response.data);
            console.log('Enviamos estto', formData)
            onMensajeEnviado();


        } catch (error) {
            console.error(`Error al enviar el audio a ${numerselect}:`, error);
        }
        setIsRecording(false)
        setAudioURL('')

    };

    const clearAudio = () => {
        setIsRecording(false);
        setAudioURL('');
    };


    const renderContentByType = (type) => {
        switch (type) {
            case 'image/jpeg':
            case 'image/webp':
                return <div className='conmsjres'>
                    <div className='divcongen'>
                        <div className='divlineares'></div>
                        <div className='msjrespueta'>
                            <i className="fas fa-image"></i>
                            <p>Imagen</p>
                        </div>
                    </div>
                </div>;

            case 'application/pdf':
                return <div className='conmsjres'>
                    <div className='divcongen'>
                        <div className='divlineares'></div>
                        <div className='msjrespueta'>
                            <i className="fas fa-file-alt"></i>
                            <p>Dumento pdf</p>
                        </div>
                    </div>
                </div>;
            case 'video/mp4':
                return <div className='conmsjres'>
                    <div className='divcongen'>
                        <div className='divlineares'></div>
                        <div className='msjrespueta'>
                            <i className="fas fa-file-video"></i>
                            <p>Video</p>
                        </div>
                    </div>
                </div>;
            case 'audio/ogg; codecs=opus':
                return <div className='conmsjres'>
                    <div className='divcongen'>
                        <div className='divlineares'></div>
                        <div className='msjrespueta'>
                            <i className="fas fa-microphone"></i>
                            <p>Audio</p>
                        </div>
                    </div>
                </div>;
            default:
                return <div className='conmsjres'>
                    <div className='divcongen'>
                        <div className='divlineares'></div>
                        <div className='msjrespueta'>
                            <p>
                                {selectedMsjUser.length > 50 ? `${selectedMsjUser.substring(0, 50)}...` : selectedMsjUser}
                            </p>                        </div>
                    </div>
                </div>;
        }
    };

    //next img
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNextImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === imagePreview.length - 1 ? 0 : prevIndex + 1
        );
    };

    const goToPreviousImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? imagePreview.length - 1 : prevIndex - 1
        );
    };
    const selectImage = (index) => {
        setCurrentIndex(index);
    };


    const fechaObjetoUTC = new Date(fechaulmsjcliente);



    const fechaActual = new Date();

    // Calcular la diferencia en milisegundos
    const diffMillis = fechaActual - fechaObjetoUTC;



    // Convertir la diferencia a unidades de tiempo
    const diffInSeconds = Math.floor(diffMillis / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);

    const isOver23Hours = diffInHours > 23;




    const [isModalOpenplntilla, setIsModalOpenplntilla] = useState(false);

    // Función para abrir el modal
    const abrirModal = () => {
        setIsModalOpenplntilla(true);
    };

    // Función para cerrar el modal
    const cerrarModal = () => {
        setIsModalOpenplntilla(false);
        onMensajeEnviado();
    };

 

    return (

        <div>
            {
                isOver23Hours ?
                    (
                        <div>

                            <button className='btncampanaschats' onClick={abrirModal}>
                                Enviar Campañas
                            </button>

                            {isModalOpenplntilla && <ModalPlatilla
                                isOpen={isModalOpenplntilla}
                                onClose={cerrarModal}
                                numroclitne={numerselect}
                                idAgentec={idagente}
                                idlinemsj={id_dlinea}

                            />}

                        </div>
                    ) :
                    (

                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onPaste={handlePaste}

                            className='contenidoenviarmsj  '>
                            {selectedMessageId && renderContentByType(selectedTypeMsj)}

                            {imagePreviewVisible && (
                                <div className='contenprev'>
                                    <button className="clearInput"
                                        onClick={() => {
                                            setMensaje([]);
                                            setImagePreview([]);
                                            setImagePreviewVisible(false);
                                            setCurrentIndex(0)
                                        }}>
                                        <i className="fa fa-times"></i>
                                    </button>

                                    {mensaje[currentIndex].name.endsWith('.pdf') ? (
                                        <div className='contepdf'>
                                            <iframe
                                                src={`${imagePreview[currentIndex]}#page=1`}
                                                width="100%"
                                                height="300px"
                                                title="PDF Viewer"
                                            ></iframe>

                                            <a href={imagePreview[currentIndex]} target="_blank" rel="noopener noreferrer">
                                                <i className="fa fa-file-pdf-o" aria-hidden="true"></i> Ver pantalla completa
                                            </a>
                                            <div className='butnosns'>
                                                <button className='btnprvs' onClick={goToPreviousImage}>Anterior</button>
                                                <button className='btnprvs' onClick={goToNextImage}>Siguiente</button>
                                            </div>

                                        </div>
                                    ) : (
                                        <div className='conteimg'>
                                            <img
                                                className='imgprev'
                                                src={imagePreview[currentIndex]}
                                                alt='Archivo previsualizado'
                                            />
                                            <div className='thumbnail-container'>
                                                {imagePreview.map((image, index) => (
                                                    <img
                                                        key={index}
                                                        src={image}
                                                        alt={`Miniatura ${index}`}
                                                        onClick={() => selectImage(index)}
                                                        className='imgmini'
                                                    />
                                                ))}
                                            </div>

                                        </div>
                                    )}
                                </div>
                            )}


                            {uploadProgress > 0 && uploadProgress < 100 && (
                                <div>Subiendo archivo: {uploadProgress}%</div>
                            )}
                            <div
                                className={showEmojiPicker ? "emoji-picker-container active" : "emoji-picker-container"}
                                ref={emojiPickerRef}
                            >
                                {showEmojiPicker && <Picker data={data} onEmojiSelect={handleEmojiSelect} />}
                            </div>

                            {/* Botones con íconos */}
                            <button className={`btnmsj ${chatItemStyle}`}   onClick={handleAddFilesClick}><span><i className="fas fa-paperclip"></i></span></button> {/* Reemplazar con <FontAwesomeIcon icon={faPaperclip} /> */}



                            {isRecording ? (
                                <button className={`btnmsj ${chatItemStyle}`} onClick={stopRecording}> <i className="fas fa-stop"></i></button>
                            ) : (
                                <button className={`btnmsj ${chatItemStyle}`} onClick={startRecording}><i className="fas fa-microphone"></i></button>
                            )}


                            <button className={`btnmsj ${chatItemStyle}`} onClick={() => setShowEmojiPicker(prevState => !prevState)}><span><i className="fas fa-smile-beam"></i></span></button>

                            <button className='btnmsjpdf' onClick={() => setIsModalOpen(true)}>
                                <span><i className="fas fa-sticky-note"></i></span>
                            </button>

                            {/* Textarea que se expande */}
                            <input
                                type="file"
                                id="fileInput"
                                style={{ display: 'none' }}
                                multiple // Permite seleccionar múltiples archivos
                                onChange={(e) => handleFileChange(e.target.files)}
                            />

                            {isRecording && (
                                <div className='contaudio'>
                                    Grabando...
                                    <button onClick={clearAudio} className={`btnmsj ${chatItemStyle}`} >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            )}


                            {audioURL && (
                                <div className='msjaudio'>
                                    <div className='divudio'>
                                        <audio src={audioURL} controls />
                                    </div>

                                    <div className='divbtnsenaduio'>
                                        <button className={`btnmsj ${chatItemStyle}`} onClick={clearAudio}><i className="fas fa-trash"></i></button>

                                        <button className={`btnmsj ${chatItemStyle}`} onClick={uploadAudio}><i className="fas fa-paper-plane"></i></button>

                                    </div>
                                </div>
                            )}


                            {!imagePreviewVisible ? (
                                (!isRecording && !audioURL) && (
                                    <textarea
                                        placeholder={selectedMessageId ? 'Responder mensaje...' : 'Escribe tu mensaje...'}
                                        ref={textareaRef}
                                        value={mensaje instanceof File ? mensaje.name : mensaje}
                                        onChange={handleTextChange}
                                        style={{ flex: 1, resize: 'none' }}
                                        rows={lineas}
                                    />
                                )
                            ) : (
                                <div className='divarchcarg'>
                                    <p>Archivo cargado</p>
                                </div>
                            )}

                            {!isRecording && !audioURL && (

                                <button className={`btnmsj ${chatItemStyle}`} onClick={selectedMessageId ? responderMensaje : enviarMensaje}>
                                    <span><i className="fas fa-paper-plane"></i></span>
                                </button>

                            )}

                            {isModalOpen &&
                                <Modalsujerecnia
                                    onClose={() => setIsModalOpen(false)}
                                    onSeleccion={manejarSeleccion}
                                    numerotel={numerselect}
                                    idagente={idagente}
                                    idlinea={id_dlinea}
                                    pdfsend={senviopdf}

                                />
                            }




                        </div>
                    )
            }



        </div>

    );
};

export default CamposMjs;
