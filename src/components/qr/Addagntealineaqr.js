import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import './codigoqrstyle.css';

function AddAgenteAlinear() {
    const location = useLocation();


    const [opciones, setOpciones] = useState([]); // Para almacenar los datos de la API
    const [seleccionados, setSeleccionados] = useState([]); // Para almacenar los datos seleccionados

    // Cargar datos de la API
    useEffect(() => {
        listaAgentes()
    }, []); // El array vacío asegura que se ejecute solo una vez




    const listaAgentes = async () => {
        const formData ={
            idLinea:5
        }

        try {
            const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/listAgentesQr',formData);
            const jsonData = response.data;


            setOpciones(jsonData); // Actualiza el estado con los nuevos datos

            const opcionesFormateadas = response.data.map((item) => ({
                value: item[0], // El valor que se utilizará al seleccionar
                label: item[1]  // El texto que se mostrará en la opción
            }));
            setOpciones(opcionesFormateadas);

            console.log('listaAgentes', jsonData);
        } catch (error) {
            console.error("Error al obtener los datos de la API :(", error);
        }
    };

    const handleChange = (selectedOptions) => {
        setSeleccionados(selectedOptions);
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
        <div>
            <p>Número de línea recibido: {location.state?.numeroDeLinea}</p>
            <p>Otro dato: {location.state?.otroDato}</p>

            <div className='contadagentesline'>


                <div className='ladoselct'>
                    <Select
                        isMulti
                        styles={customStyles}

                        name="usuarios"
                        options={opciones}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={handleChange}
                    />
                </div>

                <div className='ladoagregado'>
                    <h3>Contactos:</h3>
                    <ul>
                        {seleccionados.map((seleccion, index) => (
                            <li key={index}>{seleccion.label}</li>
                        ))}
                    </ul>
                </div>

            </div>

        </div>
    );
}

export default AddAgenteAlinear;