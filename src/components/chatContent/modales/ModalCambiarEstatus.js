import axios from 'axios'
import React, { useState, useEffect } from 'react'

function ModalCambiarEstatus({closeModal, idUsuario}) {
    const [listLeads, setListLeads] = useState([])
    const [listStages, setListStages] = useState([]);
    const [msgAlertValue, setMsgAlertValue] = useState(false);

    //Manejar estados de carga y errores
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
  
    useEffect(() => {
        (async () => {
            const postData = {
              idUsuario: idUsuario,
            };            
    
            try {
              //Obtener lista de leads
              const responseGetLeads = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/getLeadsByUser', postData);
              console.log('padrino', responseGetLeads.data)
              setListLeads(responseGetLeads.data);     
              
              //Obtener lista de estatus
              const responseGetStages = await axios.get("/getStages");
              setListStages(responseGetStages.data);

            } catch (error) {
              console.error("Ha ocurrido un error: ", error);
            }
          })();
    }, [idUsuario])

    //Guardar lead seleccionado
    const [lead, setLead] = useState("")

    const handleSelectLead = (e) => {
        setLead(e.target.value)
    }

    //Guardar estado seleccionado
    const [status, setStatus] = useState("")

    const handleSelectedStatus = (e) => {
        setStatus(e.target.value)
    }

    const changeStatus = async (e) => {
        e.preventDefault();
        setError(null)
        setLoading(true)
        if(lead === "" || status === ""){
          setMsgAlertValue(true);
          return null;
        }
        try {
            const data = {
                idLead: parseInt(lead),
                stage: parseInt(status),
            }
            const response = await axios.post(
                "https://backend-chatify-sjkbu6lfrq-uc.a.run.app/editLead",
                data
            )          
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
          <h2>Cambiar estatus</h2>
        </div>
        <div className='bnclus'>
          <button className='btnclomu' onClick={closeModal} ><i className="fas fa-times"></i></button>
        </div>
      </div>

      <div className='cls-s'>

         {/* Select para seleccionar lead */}
         <div>
            <p>Lista de leads</p>
            <select
            className='ipaduser'
            value={lead}
            onChange={handleSelectLead}
            required
            >
            <option value="">Seleccione un lead</option>
              {
                listLeads.map((lead) => (
                    <option key={lead.id} value={lead.id}>{lead.name}</option>   
                ))
            }
            </select>
          </div>
          
          {/* Select para seleccionar el estado */}
          <div>
            <p>Lista de estados</p>
            <select
            className='ipaduser'
            value={status}
            onChange={handleSelectedStatus}
            >
            <option value="0">Seleccione un estado</option>  
              {
                listStages.map((status) => (
                    <option key={status.id} value={status.id}>{status.name}</option>   
                ))
            }         
            </select>
          </div>
        
          { msgAlertValue && 
              <div>
                  <p name="registrar" className="txtaduserAlert">Es necesario seleccionar los elementos*</p>
              </div>
          }          
      </div>


      <div className='butoncont'>
        <button className='btngenerico' onClick={changeStatus} disabled={loading} >Cambiar estado</button>
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

export default ModalCambiarEstatus