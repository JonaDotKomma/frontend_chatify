import React, { useState, useEffect } from 'react';
import './castorestyle.css'
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete';
import axios from 'axios';
import Select from 'react-select';



function Castores() {

    const [opcionSeleccionada, setOpcionSeleccionada] = useState([]);

    // Estado para almacenar la respuesta de la API
    const [respuestaApi, setRespuestaApi] = useState(null);

    const [numeroDomicilio, setNumeroDomicilio] = useState(''); // Estado para almacenar el número

    // Función para actualizar el estado cuando cambia el valor del input
    const manejarCambioNumero = (e) => {
        setNumeroDomicilio(e.target.value);
    };

    //funcion formulario google 
    const [address, setAddress] = useState('');


    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [neighborhood, setNeighborhood] = useState('');


    const handleSelect = async value => {
        const results = await geocodeByAddress(value);
        setAddress(value);

        const addressComponents = results[0].address_components;

        let updatedPostalCode = '';
        let updatedCity = '';
        let updatedState = '';
        let updatedNeighborhood = '';

        addressComponents.forEach(component => {
            if (component.types.includes("postal_code")) {
                updatedPostalCode = component.long_name;
            }
            if (component.types.includes("locality")) {
                updatedCity = component.long_name;
            }
            if (component.types.includes("administrative_area_level_1")) {
                updatedState = component.long_name;
            }
            if (component.types.includes("sublocality_level_1") || component.types.includes("neighborhood")) {
                updatedNeighborhood = component.long_name;
            }
        });

        // Actualiza el estado con los nuevos valores
        setPostalCode(updatedPostalCode);
        setCity(updatedCity);
        setState(updatedState);
        setNeighborhood(updatedNeighborhood);
    };


    //funcion para poder llamar a la api
    const [listproductosdata, setListproductosdata] = useState([]);


    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                const response = await axios.get('/getProductos');
                const jsonData = response.data;
                setListproductosdata(jsonData);
                console.log(response.data);

            } catch (error) {
                console.error("Error al obtener los productos:", error);
            }
        };

        obtenerProductos();
    }, []);


    //enviar datos a castores
    let productosSeleccionados = [];
    const handleFormSubmit = async () => {
        console.log('BOTON COTIZAR');
        let valorDeclaradoFinal = 0;
        opcionSeleccionada.forEach(seleccion => {
            const [valorDeclarado, contenido, noPiezas, peso, largoCm, anchoCm, altoCm] = seleccion.split('|');
            valorDeclaradoFinal = valorDeclaradoFinal + parseFloat(valorDeclarado);
            const producto = {
                contenido: contenido,
                cantidad: parseInt(noPiezas, 10), // Asumiendo que noPiezas es un número entero
                peso: parseFloat(peso), // Asumiendo que peso es un número decimal
                largo: parseFloat(largoCm), // Asumiendo que largoCm es un número decimal
                ancho: parseFloat(anchoCm), // Asumiendo que anchoCm es un número decimal
                alto: parseFloat(altoCm) // Asumiendo que altoCm es un número decimal
            };
        
            productosSeleccionados.push(producto);
        });
        
        // Ahora productosSeleccionados es un arreglo con los detalles de cada producto seleccionado
        console.log(productosSeleccionados);
        console.log('Valor declarado: '+valorDeclaradoFinal);

        const formData = {
            calle: address,
            noExterior: numeroDomicilio,
            colonia: neighborhood,
            ciudad: city,
            estado: state,
            cp: postalCode,
            valorDeclarado: valorDeclaradoFinal,
            paquetes: productosSeleccionados
        }

         console.log('la data es ', formData);
         try {
            // Hacer la petición POST a tu API
            const response = await axios.post('/cotEnvio', formData);
            console.log('Si paso mano', response.data);
            setRespuestaApi(response.data); // Actualiza el estado con la respuesta


            // Manejar la respuesta de la API
        } catch (error) {
            console.error("Error al enviar los datos:", error);
        }
        
    };




    //limpiador
    const resetearEstado = () => {
        setOpcionSeleccionada([]);
        setNumeroDomicilio('');
        setAddress('');
        setPostalCode('');
        setCity('');
        setState('');
        setNeighborhood('');

        setRespuestaApi(null);
    };


    //Datos del select 
    const selectOptions = listproductosdata.map(producto => ({
        value: `${producto.valor_declarado}|${producto.contenido}|${producto.no_piezas}|${producto.peso}|${producto.largo_cm}|${producto.ancho_cm}|${producto.alto_cm}`,
        label: `${producto.sku} - ${producto.contenido}`
    }));

    // Actualizar el estado de opcionSeleccionada para que funcione con react-select
    const handleSelectChange = selectOptions => {
        const values = selectOptions.map(option => option.value);
        setOpcionSeleccionada(values);
    };


    //estiulos del select
    const customStyles = {
        control: (styles, { isFocused }) => ({
            ...styles,
            backgroundColor: 'white',
            color: '#8c8c8c',
            borderColor: isFocused ? '#8c8c8c' : '#8c8c8c',
            boxShadow: isFocused ? '0px 2px 6px rgba(0,0,0,0.16)' : '0px 2px 6px rgba(0,0,0,0.16)',
            '&:hover': {
                borderColor: isFocused ? '#8c8c8c' : '#8c8c8c'
            },
        }),
        option: (styles, { isFocused, isSelected }) => {
            return {
                ...styles,
                backgroundColor: isSelected
                    ? '#8c8c8c'
                    : isFocused
                        ? '#e9ecef'
                        : null,
                color: isSelected
                    ? 'white'
                    : '#8c8c8c',
                cursor: 'pointer',
                ':active': {
                    ...styles[':active'],
                    backgroundColor: isSelected ? '#0056b3' : '#e9ecef',
                },
            };
        },
        // Puedes agregar más personalizaciones a otros componentes si lo deseas
    };




    return (
        <div className='contencastores'>

        <div className='ldodercas'>
            <h1>Cotizador Castores</h1>

            <div className='divselct'>


                <Select
                    isMulti
                    styles={customStyles}
                    options={selectOptions}
                    onChange={handleSelectChange}
                    placeholder="Seleccione un Producto"
                    isSearchable
                />


            </div>

            <div>
                <p className='txtformu'>Calle</p>
                <PlacesAutocomplete
                    value={address}
                    onChange={setAddress}
                    onSelect={handleSelect}
                >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div>
                            <input
                                {...getInputProps({
                                    placeholder: 'Buscar dirección...',
                                    className: 'inpgrde',
                                })}
                            />
                            <div>
                                {loading && <div>Cargando...</div>}
                                {suggestions.map(suggestion => {
                                    const style = suggestion.active
                                        ? { backgroundColor: '#a8a8a8', cursor: 'pointer' }
                                        : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                    return (
                                        <div {...getSuggestionItemProps(suggestion, { style })}>
                                            {suggestion.description}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}


                </PlacesAutocomplete>
            </div>


            <div className='dosipt'>

                <div className='dvuno'>
                    <p>Número Domicilio</p>
                    <input
                        className='inpchico'
                        value={numeroDomicilio}
                        onChange={manejarCambioNumero}

                    />
                </div>

                <div className='dvdos'>
                    <p>Colonia</p>
                    <input className='inpchico' value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
                </div>

            </div>


            <div className='dosipt'>

                <div className='dvuno'>
                    <p>Codigo Postal</p>
                    <input className='inpchico' value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                </div>

                <div className='dvdos'>
                    <p>Ciudad</p>
                    <input className='inpchico' value={city} onChange={(e) => setCity(e.target.value)} />
                </div>

            </div>


            <div className='dosipt'>

                <div className='dvuno'>
                    <p>Estado</p>
                    <input className='inpchico' value={state} onChange={(e) => setState(e.target.value)} />


                </div>

            </div>

            <div className='btncontent'>
                <button className='btncassend' onClick={handleFormSubmit}>
                    Cotizar
                </button>
            </div>
        </div>




        {respuestaApi && (
            <div className='ldoizqcas'>
                <h2>Cotización</h2>
                <div className='contedtos'>

                    <div className='divder'>
                        <p>Flete</p>
                    </div>

                    <div className='divizq'>
                        <p>{respuestaApi.FLETE}</p>

                    </div>


                </div>
                <div className='contedtos'>

                    <div className='divder'>
                        <p>Seguro</p>
                    </div>

                    <div className='divizq'>
                        <p>{respuestaApi.SEGURO}</p>

                    </div>


                </div>
                <div className='contedtos'>

                    <div className='divder'>
                        <p>Entrega</p>
                    </div>

                    <div className='divizq'>
                        <p>{respuestaApi.ENTREGA}</p>

                    </div>


                </div>
                <div className='contedtos'>

                    <div className='divder'>
                        <p>Maniobras</p>
                    </div>

                    <div className='divizq'>
                        <p>{respuestaApi.MANIOBRAS}</p>

                    </div>


                </div>
                <div className='contedtos'>

                    <div className='divder'>
                        <p>CDP</p>
                    </div>

                    <div className='divizq'>
                        <p>{respuestaApi.CDP}</p>

                    </div>


                </div>
                <div className='contedtos'>

                    <div className='divder'>
                        <p>Admón. Fin</p>
                    </div>

                    <div className='divizq'>
                        <p>{respuestaApi.ADMON_FIN}</p>

                    </div>


                </div>

                <div className='divrallaz'>

                    <div className='contedtos'>

                        <div className='divder'>
                            <p>Subtotal</p>
                        </div>

                        <div className='divizq'>
                            <p>{respuestaApi.SUBTOTAL}</p>

                        </div>


                    </div>
                    <div className='contedtos'>

                        <div className='divder'>
                            <p>IVA</p>
                        </div>

                        <div className='divizq'>
                            <p>{respuestaApi.IVA}</p>

                        </div>


                    </div>

                    <div className='contedtos'>

                        <div className='divder'>
                            <p>Retención de IVA</p>
                        </div>

                        <div className='divizq'>
                            <p>{respuestaApi.RETENCION_DE_IVA}</p>

                        </div>


                    </div>

                </div>

                <div className='contedtos'>

                    <div className='divder'>
                        <p>TOTAL</p>
                    </div>

                    <div className='divizq'>
                        <p>{respuestaApi.TOTAL}</p>

                    </div>


                </div>





                <div className='btncontent'>

                    <button className='btncassend' onClick={resetearEstado}>
                        Generar Nueva Cotización
                    </button>
                </div>
            </div>
        )}


    </div>
    );
}

export default Castores;