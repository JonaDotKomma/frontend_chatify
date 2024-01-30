import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';


import './castorestyle.css'
import axios from 'axios';




function GenerarGuia() {

    const [loading, setLoading] = useState(false)

    const [respuestaApi, setRespuestaApi] = useState(null);

    // Campos del formulario
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [calle, setCalle] = useState('');
    const [colonia, setColonia] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [estado, setEstado] = useState('');
    const [cp, setCp] = useState('');
    const [numInt, setNumInt] = useState('');
    const [numExt, setNumExt] = useState('');


    const [datosGuia, setDatosGuia] = useState(null); // Inicializa el estado
    const location = useLocation(); // Usa useLocation para acceder al estado pasado
    const [error, setError] = useState(null)



    useEffect(() => {
        // Verifica si hay estado pasado y si contiene formData
        if (location.state && location.state.datosGuia) {
            setDatosGuia(location.state.datosGuia); // Asigna formData a datosGuia

            console.log('Los datos parala guia :', location.state.datosGuia)


        }
    }, [location.state]);

    useEffect(() => {
        // Asegúrate de que datosGuia no sea null
        if (datosGuia) {
            // Establece los valores de cp y colonia si existen dentro de datosGuia
            if (datosGuia.cp) setCp(datosGuia.cp);
            if (datosGuia.colonia) setColonia(datosGuia.colonia);
        }
    }, [datosGuia]); // Dependencia a datosGuia







    const handleSubmit = async () => {

        setLoading(true)
        setError(null)
        console.log('BOTON Generar guia');

        const formData = {
            calle: calle,
            noExterior: numExt,
            colonia: colonia,
            ciudad: ciudad,
            estado: estado,
            telefonoDestino: telefono,
            nombreDestino: nombre,
            email: email,
            cp: cp,
            valorDeclarado: datosGuia.valorDeclarado,
            paquetes: datosGuia.paquetes
        }

        console.log('la data es ', formData);


        try {
            // Hacer la petición POST a tu API
            const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/generarGuia', formData);
            console.log('Si paso mano', response.data);
            if (typeof response.data === 'string') {
                // Mostrar una alerta con el mensaje completo de solicitud fallida
                if (response.data === 'Error al buscar las ciudades y oficina') {
                    alert(response.data + '. Seleciona otro código postal o sucural');


                } else {
                    alert(response.data);

                }

                // Opcional: Cambiar el estado para sugerir la selección de un Ocurre
            } else {
                // Procesar la respuesta exitosa de la API
                setRespuestaApi(response.data); // Actualiza el estado con la respuesta
            }



            // Manejar la respuesta de la API
        } catch (error) {
            console.error("Error al enviar los datos:", error);
            setError('Ha ocurrido un error, vuelve a intentarlo');
        } finally {
            setLoading(false)
        }


    };


    const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    if (respuestaApi && respuestaApi.src && respuestaApi.src[0]) {
      // Decodifica la cadena Base64 a un arreglo de bytes
      const pdfData = atob(respuestaApi.src[0]);
      const byteNumbers = new Array(pdfData.length);
      for (let i = 0; i < pdfData.length; i++) {
        byteNumbers[i] = pdfData.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Crea un Blob con el tipo MIME para PDF
      const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });

      // Crea una URL para el Blob
      const blobUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(blobUrl);

      // Limpieza: revoca la URL del objeto cuando el componente se desmonte
      return () => {
        URL.revokeObjectURL(blobUrl);
      };
    }
  }, [respuestaApi]); // Dependencia a respuestaApi

    return (
        <div className='contencastores'>

            <div className='ldodercas'>
                <h1>Generar guia para envio</h1>

                <div>
                    <p>
                        Ingresa los datos restantes para generar la guia.
                    </p>
                </div>


                <div >
                    <div className='divflexz'>
                        <div className='ipgneerar'>
                            <label>Nombre:</label>
                            <input className='inpchico' type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                        </div>
                        <div className='ipgneerar'>
                            <label>Teléfono:</label>
                            <input className='inpchico' type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                        </div>
                    </div>

                    <div className='divflexz'>
                        <div className='ipgneerar'>
                            <label>Email:</label>
                            <input className='inpchico' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className='ipgneerar'>
                            <label>Calle:</label>
                            <input className='inpchico' type="text" value={calle} onChange={(e) => setCalle(e.target.value)} />
                        </div>

                    </div>


                    <div className='divflexz'>
                        <div className='ipgneerar'>
                            <label>Numero interiro :</label>
                            <input className='inpchico' type="text" value={numInt} onChange={(e) => setNumInt(e.target.value)} />
                        </div>
                        <div className='ipgneerar'>
                            <label>Numero Exterior:</label>
                            <input className='inpchico' type="text" value={numExt} onChange={(e) => setNumExt(e.target.value)} />
                        </div>
                    </div>
                    <div className='divflexz'>

                        <div className='ipgneerar'>
                            <label>Colonia:</label>
                            <input className='inpchico' type="text" value={colonia} onChange={(e) => setColonia(e.target.value)} />
                        </div>
                        <div className='ipgneerar'>
                            <label>Ciudad:</label>
                            <input className='inpchico' type="text" value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
                        </div>
                    </div>

                    <div className='divflexz'>
                        <div className='ipgneerar'>
                            <label>Estado:</label>
                            <input className='inpchico' type="text" value={estado} onChange={(e) => setEstado(e.target.value)} />
                        </div >
                        <div className='ipgneerar' >
                            <label>C.P.:</label>
                            <input className='inpchico' type="text" value={cp} onChange={(e) => setCp(e.target.value)} />
                        </div>
                    </div>

                    <button onClick={handleSubmit}>Enviar</button>
                </div>
                {loading && <div className="spinner-container">
                    <div className="spinner"></div>
                </div>}

            </div>
            {pdfUrl  && (
                <div className='ldoizqcas'>

                    <iframe
                        src={pdfUrl }
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        frameBorder="0"
                        scrolling="auto"
                    >
                    </iframe>

                </div>
            )}


        </div>
    );
}

export default GenerarGuia;