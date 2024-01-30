import React, { useState, useEffect, useCallback } from 'react';
import './castorestyle.css'
import axios from 'axios';
import Select from 'react-select';
import Tooltip from './Tooltip';

import { useNavigate } from 'react-router-dom';


function Castores() {
    const navigate = useNavigate();

    const [datosGuia, setDatosGuia] = useState(null); // Inicializa el estado

    const [opcionSeleccionada, setOpcionSeleccionada] = useState([]);
    const [opcionSeleccionadaOcurrecurre, setOpcionSeleccionadaOcurre] = useState(null)

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
    const [listaOcurre, setListaOcurre] = useState([]);


    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

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

        const ocurresucursales = async () => {
            try {
                const response = await axios.get('https://api.castores.com.mx/catalogs/ocurreOffices');
                const jsonData = response.data.data.packaging;
                setListaOcurre(jsonData);
                console.log('La lista ocurre es:', response.data.data.packaging);

            } catch (error) {
                console.error("Error al obtener los productos:", error);
            }
        };

        obtenerProductos();
        ocurresucursales();
    }, []);


    //ocurre 
    const [isChecked, setIsChecked] = useState(false);

    const opcionesSelectocurre = listaOcurre.map(item => ({
        label: item.plaza, // Lo que se muestra al usuario
        value: item.idoficina // El valor interno que se usa
    }));

    const handleChange = () => {
        const newCheckedState = !isChecked;
        setIsChecked(newCheckedState);

        // Si después de cambiar, el checkbox no está seleccionado, establece opcionSeleccionadaOcurre a null
        if (!newCheckedState) {
            setOpcionSeleccionadaOcurre(null);
        }
        // No hay necesidad de un else aquí a menos que quieras hacer algo específico cuando se seleccione el checkbox
    };



    const handleChangeocurre = (opcionSeleccionadaOcurre) => {
        console.log('Opción seleccionada:', opcionSeleccionadaOcurre.value);
        const valueocurre = opcionSeleccionadaOcurre.value;
        setOpcionSeleccionadaOcurre(valueocurre);


    };


    //enviar datos a castores
    let productosSeleccionados = [];

    const handleFormSubmit = async () => {

        setLoading(true)
        setError(null)
        console.log('BOTON COTIZAR');

        let valorDeclaradoFinal = 0;

        opcionSeleccionada.forEach((seleccion, index) => {
            const [valorDeclarado, contenido, peso, largoCm, anchoCm, altoCm] = seleccion.split('|');
            valorDeclaradoFinal = valorDeclaradoFinal + parseFloat(valorDeclarado);
            const cantidadPiezas = parseInt(noPiezasPorProducto[index], 10) || 1; // Usa el valor del input o 1 por defecto

            const producto = {
                contenido: contenido,
                cantidad: cantidadPiezas, // Asumiendo que noPiezas es un número entero
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

            ...(opcionSeleccionadaOcurrecurre ? {
                ocurre: "true",
                idOffice: String(opcionSeleccionadaOcurrecurre)
            } : {}),

            cp: postalCode,
            valorDeclarado: valorDeclaradoFinal,
            paquetes: productosSeleccionados
        }

        console.log('la data es ', formData);

        setDatosGuia(formData)

        try {
            // Hacer la petición POST a tu API
            const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/cotEnvio', formData);
            console.log('Si paso mano', response.data);
            if (typeof response.data === 'string') {
                // Mostrar una alerta con el mensaje completo de solicitud fallida
                if (response.data === 'Error al buscar las ciudades y oficina') {
                    alert(response.data + '. Seleciona otro código postal o sucural');
                    resetearEstado()

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

    //limpiador
    const resetearEstado = () => {
        setOpcionSeleccionada([]);
        setNumeroDomicilio('');
        setAddress('');
        setPostalCode('');
        setCity('');
        setState('');
        setNeighborhood('');
        setNoPiezasPorProducto('');
        setColonias([])
        setIsColoniaSelectDisabled(true)
        setRespuestaApi(null);
        setOpcionSeleccionadaOcurre(null)
        setIsChecked(false)
    };


    //Datos del select 
    const selectOptions = listproductosdata.map(producto => ({
        value: `${producto.valor_declarado}|${producto.contenido}|${producto.peso}|${producto.largo_cm}|${producto.ancho_cm}|${producto.alto_cm}`,
        label: `${producto.sku} - ${producto.contenido}`
    }));

    // Actualizar el estado de opcionSeleccionada para que funcione con react-select
    const handleSelectChange = selectOptions => {
        const values = selectOptions.map(option => option.value);
        setOpcionSeleccionada(values);
    };

    const [noPiezasPorProducto, setNoPiezasPorProducto] = useState({});

    // Manejar cambios en los inputs de noPiezas
    const handleNoPiezasChange = (index, value) => {
        setNoPiezasPorProducto(prevState => ({
            ...prevState,
            [index]: value
        }));
    };

    const renderSelectedOptions = () => {
        return opcionSeleccionada.map((opcion, index) => {
            // Dividir la opción para obtener las partes individuales
            const [, nombreProducto] = opcion.split('|');

            return (
                <li className='panchilist' key={index}>
                    {nombreProducto} {/* Mostrar solo el nombre del producto */}
                    <input
                        type="number"
                        value={noPiezasPorProducto[index] || 1}
                        onChange={(e) => handleNoPiezasChange(index, e.target.value)}
                        placeholder="No. Piezas"
                    />
                </li>
            );
        });
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

    // Estado para manejar si el botón está activado
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    const validarCampos = useCallback(() => {
        // ... tu lógica de validación ...
        return postalCode !== '' && neighborhood !== '' && opcionSeleccionada.length > 0;
    }, [postalCode, neighborhood, opcionSeleccionada]); // Dependencias de la función

    useEffect(() => {
        setIsButtonEnabled(validarCampos());
    }, [validarCampos]); // Ahora validarCampos es una dependencia del efecto


    const gogenerarguia = () => {
        navigate('/GenerarGuia', { state: { datosGuia } });
    }
    

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


                    <div className='selected-options-list'>
                        <h3 className='titlepiezas'>N° de piezas por producto:</h3>
                        <ul className="scrollable-list">
                            {renderSelectedOptions()}
                        </ul>
                    </div>
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

                <div className='ocureediv'>

                    <div>
                        <label className='labelocurre'>
                            <input type="checkbox" className='inputcastores' checked={isChecked} onChange={handleChange} />
                            Ocurre                        </label>
                    </div>

                    <div>
                        <Tooltip text="Ocurre es una opción que sirve para entregar el pedido en la sucursal más cercana del estado, en caso de que no llegue la paquetería al domicilio.">

                            <i className="fas fa-question-circle"></i>
                        </Tooltip>
                    </div>

                </div>

                {isChecked &&
                    <div className='divselct'>
                        <p>Has seleccionado ocurre.</p>
                        <Select
                            options={opcionesSelectocurre}
                            onChange={handleChangeocurre}
                            isSearchable={true}
                            placeholder="Selecciona una opción"
                            menuPlacement="top" // Esto hará que el menú se despliegue hacia arriba
                        />


                    </div>

                }

                <div className='btncontent'>
                    <button disabled={!isButtonEnabled || loading} className='btncassend' onClick={handleFormSubmit}>
                        Cotizar
                    </button>
                </div>

                {loading && <div className="spinner-container">
                    <div className="spinner"></div>
                </div>}
                {error && <p className='messageAlert'>{error}</p>}
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

                        <button className='btncassend' onClick={gogenerarguia}>
                            Crar guia
                        </button>

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