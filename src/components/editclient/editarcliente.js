import React, { useState, useEffect } from 'react'; // Importa useState
import axios from 'axios';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import "./stylesseditclient.css";
import { useLocation } from 'react-router-dom';

function EditClient({ user, onLogout, }) {
    const location = useLocation();
    const sendiduserclient = location.state?.sendiduser;
    console.log("Received sendiduser:", sendiduserclient);


    const handleAddressChange = address => {
        setAddress(address);
        console.log('Hello brow ' + address);
        geocodeByAddress(address)
            .then(results => {
                // Procesar los resultados para extraer los componentes deseados
                const addressComponents = results[0].address_components;
                let streetNumber = '';
                let route = '';
                let locality = '';
                let city = '';
                let neighborhood = '';
                let postalCode = '';

                addressComponents.forEach(component => {
                    if (component.types.includes('street_number')) {
                        streetNumber = component.long_name;
                        clientData.numstret = streetNumber;
                    }
                    if (component.types.includes('route')) {
                        route = component.long_name;
                        clientData.contact_address = route;
                        address = route
                    }
                    if (component.types.includes('locality')) {
                        locality = component.long_name;
                        clientData.state = locality
                    }
                    if (component.types.includes('administrative_area_level_1')) {
                        city = component.long_name;
                        clientData.city = city;
                    }
                    if (component.types.includes('neighborhood')) {
                        neighborhood = component.long_name;
                    }
                    if (component.types.includes('postal_code')) {
                        postalCode = component.long_name;
                        clientData.CP = postalCode
                    }
                });

                console.log(`Calle: ${route}, Número: ${streetNumber}, Localidad: ${locality}, Ciudad: ${city}, Colonia: ${neighborhood}`);
                // Aquí puedes actualizar tu estado o hacer lo que necesites con esta información
            })
            .catch(error => console.error('Error', error));
    };

    const handleSelect = address => {
        setAddress(address);
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => console.log('Success', latLng))
            .catch(error => console.error('Error', error));
    };



    function handleSubmit(event) {
        event.preventDefault();

        if (clientData.id_odoo) {
            updateClient(clientData);
        } else {
            createClient(clientData);
        }
    }


    //Enviar los datos al precionar boton
    async function updateClient(data) {
        const payload = {
            "idUser": sendiduserclient,
            "contact_id": data.id_odoo,
            "company_type": data.type,
            "phone": data.phone,
            "email": data.email,
            "city": data.city,
            "country_id": 156,
            "name": data.name,
            "website": data.website,
            "street": data.contact_address,
            "street_number": data.numstret,
            "zip": data.CP,
            "l10n_mx_edi_curp": data.curp,
            "vat": data.rfc,
            "l10n_mx_edi_fiscal_regime": data.regimen,
            "lang": "es_MX"
        };

        try {
            const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/editarUsuarioOdoo', payload);
            console.log("Cliente actualizado Que bonitos ojos tienes:", response.data);
            window.location.reload();
        } catch (error) {
            console.error('Error al actualizar el cliente Valio verga valio verga', error);
        }
    }

    async function createClient(data) {
        console.log('la data es', data)


        const payload = {
            "idUser": sendiduserclient,
            "company_type": data.type,
            "phone": data.phone,
            "email": data.email,
            "city": address,
            "country_id": 156,
            "name": data.name,
            "website": data.website,
            "street": data.contact_address,
            "street_number": data.numstret,
            "zip": data.CP,
            "l10n_mx_edi_curp": data.curp,
            "vat": data.rfc,
            "l10n_mx_edi_fiscal_regime": data.regimen,
            "lang": "es_MX",
        };
        console.log('holi lo dasos a enviar son', payload)


        try {
            const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/crearUsuario', payload);
            console.log("NUEVO CLIENTE CREADO :", response.data);
            window.location.reload();

        } catch (error) {
            console.error('No conecto:', error);
        }
    }



    //Funcion para ver datos del cliente
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
        type: ''
    });

    const [address, setAddress] = useState(clientData.contact_address);

    const fetchDatoscliente = async (sendiduserclient) => {
        setLoading(true);
        const postData = {
            idUser: sendiduserclient,
        };

        try {
            const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/getInfoUserOdoo', postData);

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

            }));
            setAddress(response.data.city)
            console.log("Datos de API 1", response.data);
            consultaodo(response.data.phone)

        } catch (error) {
            console.error('Error API ODO:', error);
        }

        setLoading(false);

    };



    useEffect(() => {
        if (sendiduserclient) {  // Comprobar que sendiduser no es undefined o null
            fetchDatoscliente(sendiduserclient);
        }
    }, [sendiduserclient]);


    useEffect(() => {
        if (clientData.name && clientData.phone) { // O cualquier otra condición que desees
            clienteodbynumber(clientData);
        }
    }, [clientData]);
    const [dataList, setDataList] = useState([]);

    const clienteodbynumber = async (data) => {

        console.log("Data received by clienteodbynumber:", data.phone);

        if (!data.id_odoo) { // Verifica si data.id_odoo es null, undefined, '', 0, o cualquier valor falsy
            try {


                const postData = {
                    number: data.phone,
                };
                const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/getInfoUserOdooForNumber', postData);
                console.log("datos de odddooo:", response.data);
                if (response.data && Array.isArray(response.data)) {
                    setDataList(response.data);
                } else {
                    setDataList([]); // asegúrate de que siempre es un array
                }

                // Si necesitas actualizar algún estado o realizar alguna otra operación con la respuesta, hazlo aquí.

            } catch (error) {
                console.error('Error al obtener datos de getInfoUserOdooForNumber:', error);
            }



        }
    };

    const [dataListCategoria, setDataListCategoria] = useState([]);
    const consultaodo = async (data) => {

        try {


            const postData = {
                number: data,
            };
            const response = await axios.post('http://192.168.100.41:8000/getCategoriesOdooForNumber', postData);
            console.log("datos de categoria:", response.data);
            if (response.data && Array.isArray(response.data)) {
                setDataListCategoria(response.data);
            } else {
                setDataListCategoria([]); // asegúrate de que siempre es un array
            }

            // Si necesitas actualizar algún estado o realizar alguna otra operación con la respuesta, hazlo aquí.

        } catch (error) {
            console.error('Error al obtener datos de getInfoUserOdooForNumber:', error);
        }

    }

    useEffect(() => {
        console.log('categoryData:', dataListCategoria);
        if (dataListCategoria && dataListCategoria.length > 0 && dataListCategoria[0].categories) {
            const options = dataListCategoria[0].categories.map(cat => ({
                value: cat.id,
                label: cat.name
            }));
            setDataListCategoria(options);
        }
    }, [dataListCategoria]);




    const [selectedItem, setSelectedItem] = useState(null);

    function handleSelectItem(item) {
        console.log('DATOS SELECIONADOS', item);  // Mostrará en consola los datos del elemento seleccionado
        setSelectedItem(item);
    }

    function handleImportData(event) {
        event.preventDefault();  // Evita la recarga de la página.

        if (selectedItem) {
            setClientData({
                ...clientData, // conservamos los datos que ya existían
                name: selectedItem.name || '',//S
                email: selectedItem.email || '',//S
                phone: selectedItem.phone || '',//S
                city: selectedItem.city || '',//S
                CP: selectedItem.CP || '',//S
                state: selectedItem.state || '',//S
                rfc: selectedItem.rfc || '',//S
                curp: selectedItem.curp || '',//S
                regimen: selectedItem.regimen || '',//S
                website: selectedItem.website || '',//S
                contact_address: selectedItem.contact_address || '',//S
                numstret: selectedItem.street_number || '',//S
                type: selectedItem.type || '',//S
                id_odoo: selectedItem.id_odoo || '', //S
                // y cualquier otro campo que necesites del elemento seleccionado
            });

            setAddress(selectedItem.contact_address)
        } else {
            console.warn("No se ha seleccionado ningún elemento para importar.");
        }
    }

    ///barra de carga jonas
    const [loading, setLoading] = useState(false);






    return (
        <div className="contformuuser">

            {loading ? (
                <div className="loader">
                    Cargando...
                </div>
            ) : null}


            <form onSubmit={handleSubmit}>

                <div className='contenformu'>


                    <div className='ldoizqformu'>
                        <div>
                            <p className='textp'>Nombre Completo </p>
                            <input
                                className='inpugrd'
                                type="text"
                                id="nameclient"
                                placeholder='Nombre...'
                                name="nameclient"
                                value={clientData.name}
                                required
                                onChange={(e) => setClientData(prevState => ({ ...prevState, name: e.target.value }))}

                            />

                        </div>

                        <div>
                            <p className='textp'>Número de Teléfono</p>
                            <input
                                className='inpugrd'
                                type="tel"
                                id="numtel"
                                name="numtel"
                                value={clientData.phone}

                                onChange={(e) => setClientData(prevState => ({ ...prevState, phone: e.target.value }))}
                            />
                        </div>
                        <div>
                            <p className='textp'>Email</p>
                            <input
                                className='inpugrd'
                                type="text"
                                value={clientData.email}
                                id="mail"
                                name="mail"

                                onChange={(e) => setClientData(prevState => ({ ...prevState, email: e.target.value }))}
                            />
                        </div>


                        <div>
                            <p className='textp'>Calle</p>
                            <PlacesAutocomplete
                                value={address}
                                onChange={handleAddressChange}
                                onSelect={handleSelect}
                            >
                                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                    <div>
                                        <input
                                            {...getInputProps({
                                                className: 'inpugrd',
                                                id: 'strett',
                                                name: 'strett',
                                                placeholder: 'Buscar dirección...',

                                            })}
                                            required
                                        />
                                        <div>
                                            {loading && <div>Cargando...</div>}
                                            {suggestions.map(suggestion => (
                                                <div
                                                    {...getSuggestionItemProps(suggestion)}
                                                    key={suggestion.placeId}
                                                >
                                                    <span>{suggestion.description}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </PlacesAutocomplete>

                        </div>

                        <div className='divmo'>
                            <div>
                                <p className='textp '>Número Domicilio</p>
                                <input
                                    className='ipuntchico'
                                    type="text"
                                    id="numstret"
                                    name="numstret"
                                    value={clientData.numstret}

                                    onChange={(e) => setClientData(prevState => ({ ...prevState, numstret: e.target.value }))}
                                />
                            </div>
                            <div>
                                <p className='textp der'>Colonia</p>
                                <input className='ipuntchico der' />
                            </div>


                        </div>
                        <div className='divmo'>
                            <div>
                                <p className='textp '>Localidad</p>
                                <input
                                    className='ipuntchico'

                                    type="text"
                                    id="state"
                                    name="state"
                                    value={clientData.state}

                                    onChange={(e) => setClientData(prevState => ({ ...prevState, state: e.target.value }))}

                                />
                            </div>
                            <div>
                                <p className='textp der'>Ciudad</p>
                                <input
                                    className='ipuntchico der'
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={clientData.city}

                                    onChange={(e) => setClientData(prevState => ({ ...prevState, city: e.target.value }))}

                                />
                            </div>


                        </div>

                        <div className='divmo'>
                            <div>
                                <p className='textp '>Codigo Postal</p>
                                <input
                                    className='ipuntchico'
                                    type="text"
                                    id="cp"
                                    name="cp"
                                    value={clientData.CP}

                                    onChange={(e) => setClientData(prevState => ({ ...prevState, CP: e.target.value }))}
                                />
                            </div>



                        </div>

                        <div className='btnsendformu'>
                            <button className='btnenvirformu' type="submit">
                                {clientData.id_odoo ? 'Actualizar Cliente' : 'Crear Cliente'}

                            </button>

                        </div>


                    </div>


                    <div className='ldoizqformu'>
                        <div>
                            <p className='textp'>Sitio Web</p>
                            <input
                                className='inpugrd'
                                placeholder='ejemplo.com'
                                type="text"
                                id="sitoweb"
                                name="sitoweb"
                                value={clientData.website}
                                onChange={(e) => setClientData(prevState => ({ ...prevState, website: e.target.value }))}

                            />

                        </div>

                        <p className='textp '>Fiscal</p>

                        <div className='divmo'>
                            <div>
                                <p className='textp '>RFC</p>
                                <input
                                    className='ipuntchico'
                                    type="text"
                                    id="rfc"
                                    name="rfc"
                                    value={clientData.rfc}

                                    onChange={(e) => setClientData(prevState => ({ ...prevState, rfc: e.target.value }))}
                                />
                            </div>
                            <div>
                                <p className='textp der'>CURP</p>
                                <input
                                    className='ipuntchico der'
                                    type="text"
                                    id="curp"
                                    name="curp"
                                    value={clientData.curp}

                                    onChange={(e) => setClientData(prevState => ({ ...prevState, curp: e.target.value }))}
                                />
                            </div>




                        </div>


                        <div className='pgtaldo'>
                            <p className='textp'>Regimen Fiscal</p>

                            <select
                                className='inpugrd'

                                id="regimenf"
                                name="regimenf"
                                value={clientData.regimen}
                                onChange={(e) => setClientData(prevState => ({ ...prevState, regimen: e.target.value }))}

                            >
                                <option value="">Selecciona...</option>
                                <option value="601">General de Ley Personas Morales</option>
                                <option value="603" >Personas Morales con Fines no Lucrativos</option>
                                <option value="605" >Sueldos y Salarios e Ingresos Asimilados a Salarios</option>
                                <option value="606" >Arrendamiento</option>
                                <option value="607" >Régimen de Enajenación o Adquisición de Bienes</option>
                                <option value="608">Demás ingresos</option>
                                <option value="609" >Consolidación</option>
                                <option value="610" >Residentes en el Extranjero sin Establecimiento Permanente en México</option>
                                <option value="611" >Ingresos por Dividendos (socios y accionistas)</option>
                                <option value="612" >Personas Físicas con Actividades Empresariales y Profesionales</option>
                                <option value="614" >Ingresos por intereses</option>
                                <option value="615" >Régimen de los ingresos por obtención de premios</option>
                                <option value="616" >Sin obligaciones fiscales</option>
                                <option value="620">Sociedades Cooperativas de Producción que optan por diferir sus ingresos</option>
                                <option value="621" >Incorporación Fiscal</option>
                                <option value="622" >Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras</option>
                                <option value="623" >Opcional para Grupos de Sociedades</option>
                                <option value="624" >Coordinados</option>
                                <option value="625" >Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas</option>
                                <option value="626" >Régimen Simplificado de Confianza - RESICO</option>
                                <option value="628" >Hidrocarburos</option>
                                <option value="629" >De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales</option>
                                <option value="630">Enajenación de acciones en bolsa de valores</option>
                            </select>
                        </div>

                        <div className='' role='radiogroup'>
                            <p>Tipo:</p>

                            <label>
                                Person
                            </label>
                            <input
                                aria-checked="true"
                                type="radio"
                                name="tipo"
                                value="person"
                                checked={clientData.type === "person"}
                                onChange={(e) => setClientData(prevState => ({ ...prevState, type: e.target.value }))}
                            />



                            <label>
                                Company
                            </label>
                            <input
                                type="radio"
                                name="tipo"
                                value="company"
                                checked={clientData.type === "company"}
                                onChange={(e) => setClientData(prevState => ({ ...prevState, type: e.target.value }))}
                            />


                        </div>





                        <p className='txtcategoria'> Categorias</p>
                        <div className='pgtaldo'>



                            <div className="horizontal-list">
                                {dataListCategoria.map((option, index) => (
                                    <div key={index} className="list-item">
                                        {option.label}
                                    </div>
                                ))}
                            </div>



                        </div>



                        {dataList && dataList.length > 0 && (
                            <div className='ldobtns'>
                                <div className="scrollableContainer">
                                    {dataList.map((item, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleSelectItem(item)}

                                            className={selectedItem === item ? 'selectedItem' : 'listaodo'}

                                        >
                                            <div className='contendivtitlo'>
                                                <h3>Dato {index + 1}</h3>

                                            </div>
                                            <div className='contendivodo'>
                                                <p className='titlediv'>Id Odoo:</p> <p>{item.id_odoo || 'N/A'} </p>
                                                <p className='titlediv'>Nombre:</p> <p> {item.name || 'N/A'}</p>
                                                <p className='titlediv'>Email:</p> <p> {item.email || 'N/A'}</p>

                                            </div>

                                            {/* Agrega otros campos si es necesario */}
                                        </div>
                                    ))}
                                </div>
                                <button className='btngenerico' onClick={handleImportData}>Importar datos</button>
                            </div>
                        )}

                    </div>



                </div>




            </form>


        </div>
    );
}

export default EditClient;