import React, { useState, useEffect } from 'react';
import './castorestyle.css'
import axios from 'axios';
import Select from 'react-select';



function Castores() {

    const [opcionSeleccionada, setOpcionSeleccionada] = useState([]);

    // Estado para almacenar la respuesta de la API
    const [respuestaApi, setRespuestaApi] = useState(null);

    const [numeroDomicilio, setNumeroDomicilio] = useState(''); // Estado para almacenar el número


    //funcion formulario google 
    const [address, setAddress] = useState('');


    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [neighborhood, setNeighborhood] = useState('');





    //funcion para poder llamar a la api
    const [listproductosdata, setListproductosdata] = useState([]);


    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                const response = await axios.get('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/getProductos');
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
        console.log('Valor declarado: ' + valorDeclaradoFinal);

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
            const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/cotEnvio', formData);
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

        setColonias([])
        setIsColoniaSelectDisabled(true)
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


    //datos del cpdigo postal 
    const [colonias, setColonias] = useState([]);
    const [isColoniaSelectDisabled, setIsColoniaSelectDisabled] = useState(true);

    // ... tus otros métodos y estados

    const handlePostalCodeChange = async (e) => {
        const nuevoCodigoPostal = e.target.value;
        setPostalCode(nuevoCodigoPostal);
        const formData = {
            cp: nuevoCodigoPostal
        }
        console.log('los datos son', nuevoCodigoPostal)


        try {
            const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/getDistricts', formData);
            setColonias(response.data.data);
            setIsColoniaSelectDisabled(false);
            console.log('las colonias son', response.data.data)

        } catch (error) {
            console.error("Error al obtener las colonias:", error);
            // Opcionalmente manejar el estado para cuando no se encuentran colonias
        }

    };
    const selectOcolonias = colonias && colonias.map(colonias => ({
        value: `${colonias.text}`,
        label: `${colonias.text}`
    }));


    return (
        <div className='contencastores'>

            <div className='ldodercas'>
                <h1>Cotizador Castores</h1>

                <div className='divselct'>

                    <Select
                        isMulti
                        styles={customStyles}
                        options={selectOptions}
                        value={selectOptions.filter(option => opcionSeleccionada.includes(option.value))} // Asegura que el valor del Select coincida con el estado
                        onChange={handleSelectChange}
                        placeholder="Seleccione un Producto"
                        isSearchable
                    />



                </div>




                <div className='dosipt'>





                    <div className='dvuno'>
                        <p>Codigo Postal</p>
                        <input className='inpchico' value={postalCode}
                            onChange={handlePostalCodeChange} // Aquí se llama a la función
                        />
                    </div>

                    <div className='dvdos'>
                        <p>Colonia</p>
                        <Select
                            isDisabled={isColoniaSelectDisabled}
                            options={selectOcolonias}
                            value={selectOcolonias ? selectOcolonias.find(option => option.value === neighborhood) : ''}
                            onChange={(selectedOption) => setNeighborhood(selectedOption ? selectedOption.value : '')}
                            placeholder="Seleccione una Colonia"
                        />


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