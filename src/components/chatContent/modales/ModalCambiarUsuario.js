import axios from 'axios'
import React, { useState, useEffect } from 'react'

function ModalCambiarUsuario({closeModal, idUsuario}) {
    const [listAgents, setListAgents] = useState([])
    //Manejar estados de carga y errores
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    //Guardar lead seleccionado
    const [agente, setAgente] = useState("")

    const handleSelectAgente = (e) => {
        setAgente(e.target.value)
    }
  
    useEffect(() => {
        (async () => {      
    
            try {
              //Obtener lista de leads
              const response = await axios.get('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/listAgentes');
            //   console.log('padrino', response.data)
              setListAgents(response.data)
            } catch (error) {
              console.error("Ha ocurrido un error: ", error);
            }
          })();
    }, [idUsuario])

    const changeStatus = async (e) => {
        e.preventDefault();
        setError(null)
        setLoading(true)
        try {
            const data = {
                idAgente: agente,
                idUser: idUsuario
            }
            const response = await axios.post(
                "https://backend-chatify-sjkbu6lfrq-uc.a.run.app/asignarAgente",
                data
            )          
            console.log('Data que se enviara: ',data)
            closeModal();
            return response.data
        } catch (error) {
            console.error(error)
            setError('Ha ocurrido un error, vuelve a intentarlo.')
        } finally {
          setLoading(false)
        }     
    }        

  return (
    <form className="modal-overlayuser">
    <div className="modal-containeruser-s">
      <div className='cbramodaluser'>
        <div className='tlmu'>
          <h2>Cambiar usuario a otro agente</h2>
        </div>
        <div className='bnclus'>
          <button className='btnclomu' onClick={closeModal} ><i className="fas fa-times"></i></button>
        </div>
      </div>

      <div className='cls-s'>

         {/* Select para seleccionar agente */}
         <div>
            <p>Lista de agentes</p>
            <select
            className='ipaduser'
            value={agente}
            onChange={handleSelectAgente}
            required
            >
            <option value="">Seleccione un agente</option>
              {
                listAgents.map((agente) => (
                    <option key={agente[0]} value={agente[0]}>{agente[3]}</option>   
                ))
            }
            </select>
          </div>                
        </div>


      <div className='butoncont'>
        <button className='btngenerico' onClick={changeStatus} disabled={loading || agente===''} >Cambiar agente</button>
      </div>
      {loading && 
      <div className="spinner-container">
              <div className="spinner"></div>
          </div>}
      {error && <p className='messageAlert'>{error}</p>}
    </div>
  </form>
  )
}

export default ModalCambiarUsuario