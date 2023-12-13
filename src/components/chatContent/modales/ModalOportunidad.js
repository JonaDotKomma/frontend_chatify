import axios from "axios";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

function ModalOportunidad({closeModal, idUsuario, nameLinea}) {
    const [valorEsperado, setValorEsperado] = useState(0);
    const [usuarioEncontrado, setUsuarioEncontrado] = useState(true);
    const [msgAlertValue, setMsgAlertValue] = useState(false);

    const handleValorEsperado = (e) => {
        setValorEsperado(e.target.value);
    }

    const crearLead = async (e) => {
        e.preventDefault();
        if(valorEsperado === 0) {
            setMsgAlertValue(true)
            return "Valor esperado";
        }
        try {
            const leadNombre = "Oportunidad Chatify linea "+nameLinea;
            console.log(leadNombre)
            const data = {
                idUsuario: idUsuario,
                nombreLead: leadNombre,
                valor_esperado: valorEsperado
            }
    
            const response = await axios.post(
                "https://backend-chatify-sjkbu6lfrq-uc.a.run.app/newLeadOdoo",
                data
            )
            
            if (response.data === "False") {
                setUsuarioEncontrado(false)
            } else {                
                setUsuarioEncontrado(true)
                closeModal();
            }
        } catch (error) {
            console.error(error)
        }        
    }        

    const navigate = useNavigate();
    const handleNavigation = () => {
        navigate("/EditarCliente", {
            state: {
                sendiduser: idUsuario,
            }
        });
    };

    return (
        <form className="modal-overlayuser">
      <div className="modal-containeruser-s">
        <div className='cbramodaluser'>
          <div className='tlmu'>
            <h2>Crear Oportunidad</h2>
          </div>
          <div className='bnclus'>
            <button className='btnclomu' onClick={closeModal}><i className="fas fa-times"></i></button>
          </div>
        </div>

        <div className='cls-s'>
          
          <div>
            <p className='txtaduser'>Valor esperado</p>
            <input
                type="number"
                className='ipaduser'
                value={valorEsperado}
                onChange={handleValorEsperado}
                required
            />
          </div>
            { !usuarioEncontrado && 
                <div>
                    <p name="registrar" className="txtaduserAlert">Es necesario completar los datos*</p>
                    {/* eslint-disable-next-line */}
                    <a className="btnAnchor txtaduserAlert" onClick={handleNavigation}>Registrarme</a>
                </div>
            }            

            { msgAlertValue && 
                <div>
                    <p name="msgAlertValue" className="txtaduserAlert">El valor es requerido*</p>
                </div>
            }
        </div>


        <div className='butoncont'>
          <button className='btngenerico' onClick={crearLead} >Crear oportunidad</button>
        </div>
      </div>
    </form>
    )
}

export default ModalOportunidad;