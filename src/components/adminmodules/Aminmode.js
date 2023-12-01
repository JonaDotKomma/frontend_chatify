import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import './adminmodestyle.css';
import Menu from '../nav/Menu';


function AdminView({ user, onLogout, nombreUsuario }) {
    const [showMessageForm, setShowMessageForm] = useState(false);
    const [showPdfForm, setShowPdfForm] = useState(false);
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);

    const [pdfPreview, setPdfPreview] = useState(null);


    const removeSelectedFile = () => {
        setFile(null);
        setPdfPreview(null);
    };


    const handleTextChange = (e) => {
        setMessage(e.target.value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPdfPreview(URL.createObjectURL(file));
            setFile(file);
        }
    };


    const handleSubmitMessage = async (e) => {
        e.preventDefault();

        console.log('Mensaje:', message);


        const formData = new FormData();
        formData.append('mensaje', message);
        formData.append('tipo', 'text');


        try {
            const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/listuser/newPredeterminate', formData);
            console.log(`Mensjae texto guardado padrino XD`, response.data);

        } catch (error) {
            console.error(`Mamo hasta pareces del Cenihes`, error);
        }

        setMessage(null)
        setShowPdfForm(false);
        setShowMessageForm(false);


    };

    const handleSubmitPdf = async (e) => {
        e.preventDefault();


        if (!file) {
            console.error('No se ha seleccionado ningún archivo');
            return;
        }

        console.log('Archivo:', file);
        console.log('nombre:', file.name);



        const formData = new FormData();
        formData.append('nombrea', file.name);
        formData.append('tipo', 'application/pdf');
        formData.append('pdf', file)


        try {
            const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/listuser/newPredeterminate', formData);
            console.log(`Mensjae guardado padrino XD`, response.data);

        } catch (error) {
            console.error(`Mamo hasta pareces del Cenihes`, error);
        }

        setFile(null)
        setShowPdfForm(false);
        setShowMessageForm(false)


    };

    const toggleMessageForm = () => {
        setShowMessageForm(true);
        setShowPdfForm(false);
    };

    const togglePdfForm = () => {
        setShowMessageForm(false);
        setShowPdfForm(true);
    };


    const inputFileRef = useRef(null);

    const handleButtonClick = () => {
        inputFileRef.current.click();
    };



    //datos del adrminstrador 

    const idUser = localStorage.getItem('idAgente');
    const [elementoName, setElementoName] = useState("");
    const [linkImguser, setLinkImguser] = useState("");
    const [puestoUser, setPuestoUser] = useState("");
    //datos del prefil
    const [datosuser, setdatosuser] = useState([]);

    const fetchdatosuser = async (idagente) => {

        const postData = {
            idAgente: idagente,
        };

        try {
            const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/getDataAgent', postData);
            setdatosuser(response.data);
            const elementoName = response.data[0][0];
            const linkImguser = response.data[0][1];
            const puestodUser = response.data[0][3];

            setElementoName(elementoName);
            setLinkImguser(linkImguser);
            setPuestoUser(puestodUser)

            console.log('el name es ', elementoName)
            console.log('la imagen es ', linkImguser)
            console.log('el pass es ', datosuser)

        } catch (error) {
            console.error('Error al obtener los datos de la API:', error);
        }
    };



    useEffect(() => {
        // Llama a fetchdatosuser cuando el componente se monta
        fetchdatosuser(idUser);
    }); // Los corchetes vacíos significan que esto se ejecutará una vez cuando el componente se monte



    return (
        <div className='conadmin'>
            <Menu onLogout={onLogout} />

            <div className="conadmbody">

                <div className='headeradmin'>
                    <div>
                        <img src={linkImguser} alt="Perfil" className="imagen-perfil" />
                    </div>
                    <div>
                        <h1>Hola  {elementoName}</h1>

                        <p>{puestoUser}</p>
                    </div>
                </div>

                <div className="btndadmin">

                    <button className='sendmsv' onClick={toggleMessageForm}>Crear Mensaje Predeterminado</button>
                    <button className='sendmsv' onClick={togglePdfForm}>Crear Catálogo PDF</button>
                </div>


                {showMessageForm && (
                    <form onSubmit={handleSubmitMessage}>
                        <div className="prmsj">
                            <p>
                                Mensaje:
                            </p>
                            <textarea className="txtmsjpr" placeholder="Hola soy un agente Hantec...." type="text" value={message} onChange={handleTextChange} />


                            <div>
                                <button className='sendmsv' type="submit">Guardar Mensaje</button>


                            </div>
                        </div>
                    </form>
                )}


                {showPdfForm && (
                    <form onSubmit={handleSubmitPdf}>
                        <div className="prmsj">


                            <div className="btn20">
                                <button className='sendmsv' onClick={handleButtonClick}>Cargar documento</button>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    ref={inputFileRef}
                                    className="ipn"

                                />


                            </div>


                            {pdfPreview && (
                                <div className="contenpdfpr">
                                    <embed src={pdfPreview} type="application/pdf" width="300" height="350" />

                                    <div className="btnpdfpr">
                                        <button className='sendmsv' type="button" onClick={removeSelectedFile}>Eliminar Archivo</button>
                                    </div>


                                    <div className="btnpdfpr">
                                        <button className='sendmsv' type="submit">Guardar Catálogo</button>

                                    </div>
                                </div>


                            )}


                        </div>
                    </form>
                )}


            </div>



        </div>
    );
}

export default AdminView;
