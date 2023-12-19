import React, { useState, useEffect } from "react";
import axios from "axios";
import './perfiluserstyles.css';
import Menu from "../nav/Menu";

function PerfilUser({ user, onLogout, nombreUsuario }) {

    const language = navigator.language;
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
            const elementoName = response.data[0][3];
            const linkImguser = response.data[0][5];
            const puestodUser = response.data[0][8];

            setElementoName(elementoName);
            setLinkImguser(linkImguser);
            setPuestoUser(puestodUser)

            console.log('el name es ', elementoName)
            console.log('la imagen es ', linkImguser)
            console.log('el pass es ', puestodUser)

        } catch (error) {
            console.error('Error al obtener los datos de la API:', error);
        }
    };


    // Este efecto mostrará el valor actualizado de datosuser
    useEffect(() => {
        console.log("datosafente", datosuser);
    }, [datosuser]);


    useEffect(() => {
        // Llama a fetchdatosuser cuando el componente se monta
        fetchdatosuser(idUser);
    }, [idUser]); // Los corchetes vacíos significan que esto se ejecutará una vez cuando el componente se monte


    return (
        <div>
            <Menu onLogout={onLogout} />
            <div className="perfil">
                <img src={linkImguser} alt="Perfil" className="imagen-perfil" />
                <div className="info-perfil">
                    <h2>Hola</h2>
                    <p> {elementoName}</p>
                    <p>{puestoUser}</p>
                </div>
            </div>

            {language==='es-ES' || language==='es-MX'?
            <div>
                <div className='contentstat'>
                    <h3>Stats</h3>
                </div>
                <div className='statuser'>
                    <div className='contmsjs'>
                        <div className='iconstats'>
                            <i class="fa fa-check" aria-hidden="true"></i>
                        </div>
                        <div className='txtstats'>
                            <p className='titlestat2'>Mensajes enviados</p>
                            <p className='conteostats'>
                                20
                            </p>
                        </div>
                    </div>

                    <div className='contmsjs'>
                        <div className='iconstats'>
                            <i class="fa fa-hourglass-end" aria-hidden="true"></i>

                        </div>
                        <div className='txtstats'>
                            <p className='titlestat2'>Tiempo Promedio Respuesta</p>
                            <p className='conteostats'>
                                56 min
                            </p>
                        </div>
                    </div>





                </div>
            </div>
            : <div>TEST USER</div>}{language==='es-ES' || language==='es-MX'?
            <div>
                <div className='contentstat'>
                    <h3>Medallas</h3>
                </div>
                <div className='medallasconten'>
                    <div className='medallaitem'>
                        <div className='medallaicon'>
                            <i className="fa fa-hourglass-end" aria-hidden="true"></i>
                        </div>
                        <div className='medalaldatos'>
                            <h2>Contesta 100 mensajes</h2>
                            <progress
                                className='barraprogres'
                                value="20"
                                max="100"

                            ></progress>
                            <p>Mantén una racha de 3 días</p>
                        </div>
                    </div>


                </div>
            </div>
            : <div></div>}
        </div>
    );
}

export default PerfilUser;
