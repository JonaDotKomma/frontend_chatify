import React, { useState, useEffect } from 'react'; // Importa useState
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function DatosUser({ sendiduser, onClose }) {
    //funciondes para la navegacion



    const [isVisible, setIsVisible] = useState(true);


    const handleClose = () => {
        setIsVisible(false);
        console.log(isVisible)
        onClose();
    };


    const navigate = useNavigate();
    const handleNavigation = () => {
        navigate("/EditarCliente", {
            state: {
                sendiduser: sendiduser,
            }
        });
    };


    //cariables que contrendran los datos que recibimos de la consulta a la API
    const [clientData, setClientData] = useState({
        id_odoo: '',
        name: '',
        email: '',
        phone: '',
        city: '',
        CP: '',
        state: '',
        rfc: '',
        curp: '',
        regimen: '',
        website: '',
        contact_address: '',
        numstret: '',
        type: '',
        opportunities_count: '',
        sales_count: '',
        id_sales: ''
    });
    //fucnion para obtener los datos de oddo del cliente

    const [isLoading, setIsLoading] = useState(false); // Nuevo estado para la carga

    const fetchDatoscliente = async (sendiduser) => {
        setIsLoading(true); // Inicia la carga
        const postData = {
            idUser: sendiduser,
        };

        try {
            const response = await axios.post('https://apiservhtc-d76a501f67be.herokuapp.com//getInfoUserOdoo', postData);

            // Actualiza clientData con los valores de la respuesta o con una cadena vacía si no existen.
            setClientData(prevState => ({
                ...prevState,
                name: response.data.name || '',
                email: response.data.email || '',
                phone: response.data.phone || '',
                city: response.data.city || '',
                CP: response.data.CP || '',
                state: response.data.state || '',
                rfc: response.data.rfc || '',
                curp: response.data.curp || '',
                regimen: response.data.regimen || '',
                website: response.data.website || '',
                contact_address: response.data.contact_address || '',
                id_odoo: response.data.id_odoo || '',
                numstret: response.data.street_number || '',
                type: response.data.type || '',
                opportunities_count: response.data.opportunities_count || '',
                sales_count: response.data.sales_count || ''

            }));
            console.log("******Datos Obtenidos de Odoo", response.data);


        } catch (error) {
            console.error('Error al obtener los datos de la API :(', error);
        } finally {
            setIsLoading(false); // Finaliza la carga
        }

    };
    //useeffect que manda a llmarlo al inico de la vista
    useEffect(() => {
        if (sendiduser) {
            fetchDatoscliente(sendiduser);
        }
    }, [sendiduser]);



    return (

        <div className='didete' >

            {isLoading && <div className='loaderdatos'>Cargando...</div>}

            
            {!isLoading && (
                <div>
                    <div className='divunoconflex'>
                        <div className='divtituloinf'> <p>Info del Contacto</p>  </div>
                        <div className='btninfot'>  <button onClick={handleClose}><i class="fas fa-times"></i></button></div>
                    </div>

                    <div className='dtosimagenuser'>
                        <div className='circle-img'>
                            <img src='https://cdn-icons-png.flaticon.com/512/552/552721.png' alt='' />
                        </div>

                        <div className='dtonmaeedit'>
                            <p>{clientData.name}</p>

                            <button className='btneditclient' onClick={handleNavigation}>
                                <i className="fas fa-pen"></i>
                            </button>
                        </div>

                    </div>


                    <div className='deodeod'>

                        <div className='dtonmaeedit'>
                            <i className="fas fa-circle"></i>

                            <p>Activo</p>


                        </div>
                    </div>

                    <div>
                        <div className='datosinteres'>
                            <div className='datinte-label' >
                                <p>Tag</p>
                            </div>
                            <div className='datinte-value'>
                                <p>{clientData.type}</p>
                            </div>

                        </div>

                        <div className="datosinteres">
                            <div className="datinte-label">
                                <p>Email</p>
                            </div>
                            <div className="datinte-value">
                                <p>{clientData.email}</p>
                            </div>
                        </div>


                        <div className='datosinteres'>
                            <div className='datinte-label' >
                                <p>Whatsapp</p>
                            </div>
                            <div className='datinte-value'>
                                <p>{clientData.phone}</p>
                            </div>

                        </div>
                        <div className='datosinteres'>
                            <div className='datinte-label' >
                                <p>Regimen</p>
                            </div>
                            <div className='datinte-value'>
                                <p>{clientData.regimen}</p>
                            </div>

                        </div>
                    </div>
                </div>

            )}
        </div>


    );

}

export default DatosUser;
