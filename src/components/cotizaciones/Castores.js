import "./cotizador.css"
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { SearchIcon, QuestionIcon, LoadingIcon } from "./icons"

let PRODUCTOS_DISPONIBLES = []

// Utilidad para calcular el valor declarado total
const calculateDeclaredValue = (products) =>
    products.reduce((total, product) => total + product.valorDeclarado, 0);

// Construye el payload para Castores
const buildCastoresPayload = (address, products, colony, postalCode, ocurre, selectedAddressOcurre, valorDeclaradoFinal) => ({
    calle: '',
    noExterior: '',
    colonia: colony,
    ciudad: '',
    estado: '',
    ...(ocurre && {
        ocurre: "true",
        idOffice: String(selectedAddressOcurre)
    }),
    cp: postalCode,
    cpOrigen: address.postalCodeOrigin,
    coloniaOrigen: address.colonyOrigin,
    valorDeclarado: valorDeclaradoFinal,
    paquetes: products
});

// Construye el payload para Paquetexpress
const buildPaquetexpressPayload = (address, products, colony, postalCode, valorDeclaradoFinal) => ({
    shipmentData: {
        originZipCode: address.postalCodeOrigin,
        originColonyName: address.colonyOrigin,
        destinyZipCode: postalCode,
        destinyColonyName: colony,
        totlDeclVlue: valorDeclaradoFinal,
        shipment_data: "1",
        invType: "A"
    },
    products: products.map((product) => ({
        sequence: 1,
        quantity: product.cantidad,
        shpCode: "27",
        weight: product.peso,
        longShip: product.largo,
        widthShip: product.ancho,
        highShip: product.alto
    }))
});


function Castores() {
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showTooltip, setShowTooltip] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState("")
    const [selectedAddressOcurre, setSelectedAddressOcurre] = useState("")
    const [products, setProducts] = useState([])
    const [postalCode, setPostalCode] = useState("")
    const [colonies, setColonies] = useState([])
    const [colony, setColony] = useState("")
    const [ocurreOffices, setOcurreOffices] = useState([])
    const [ocurre, setOcurre] = useState(false)
    const tooltipRef = useRef(null)

    const [showProductsList, setShowProductsList] = useState(false)

    const [filteredProducts, setFilteredProducts] = useState(PRODUCTOS_DISPONIBLES)
    const searchContainerRef = useRef(null)

    // Datos de cotización simulados
    const [quotes, setQuotes] = useState({
        castores: {
            total: 0,
        },
        paquetexpress: [],
    })

    const [activeQuote, setActiveQuote] = useState("castores")
    const [selectedPaquetexpressQuote, setSelectedPaquetexpressQuote] = useState(0)
    const addresses = [
        {
            "id": 1,
            "addressName": "Pachuca",
            "address": {
                "postalCodeOrigin": "42088",
                "colonyOrigin": "El palmar"
            }
        },
        {
            "id": 2,
            "addressName": "Guadalajara",
            "address": {
                "postalCodeOrigin": "45145",
                "colonyOrigin": "Belenes Norte"
            }
        },
    ]

    // Petición para obtener los productos de la API
    // Request to get products from API
    const fetchProducts = async () => {
        try {
            const response = await axios.get('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/getProductos');
            setFilteredProducts(response.data)
            PRODUCTOS_DISPONIBLES = response.data
        } catch (error) {
            alert("Error al obtener los productos")
        }
    }

    const fetchOcurreCastores = async () => {
        try {
            const response = await axios.get('https://api.castores.com.mx/catalogs/ocurreOffices');
            setOcurreOffices(response.data.data.packaging)
        } catch (error) {
            alert("Error al obtener las sucursales de ocurre castores")
        }
    }

    const fetchDistrictsCastores = async (interPostalCode) => {
        try {
            const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/getDistricts', { "cp": interPostalCode });
            setColonies(response.data.data);
        } catch (error) {
            console.error("Error al obtener las colonias:", error)
        }
    }

    const reqQuotationCastores = async (payload) => {
        try {
            const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/cotEnvio', payload);
            return response.data
        } catch (error) {
            alert("Ha ocurrido un error al cotizar el envío en Castores")
            return null
        }
    }

    const reqQuotationPaqExpress = async (payload) => {
        try {
            const response = await axios.post('https://servicehantececommerce-168873968061.us-central1.run.app/api/v1/getQuotationExpress', payload)
            console.log("Response pa express")
            console.log(response.data)
            return response.data.success
        } catch (error) {
            if (error.response.data.error) {
                alert(error.response.data.error)
            }
            return null
        }
    }

    const handleCleanData = () => {
        setQuotes({
            castores: {
                total: 0,
            },
            paquetexpress: [],
        })
        setSearchTerm("")
        setSelectedAddress("")
        setSelectedAddressOcurre("")
        setProducts([])
        setPostalCode("")
        setColonies([])
        setColony("")
        setOcurreOffices([])
        setOcurre(false)
        setShowProductsList(false)
        setFilteredProducts(PRODUCTOS_DISPONIBLES)
        setActiveQuote("castores")
        setSelectedPaquetexpressQuote(1)
    }

    // Maneja la cotización de Castores
    const handleCastoresQuotation = async (payload) => {
        const response = await reqQuotationCastores(payload);
        if (typeof response === 'string') {
            alert("No se pudo cotizar con la información proporcionada");
            return null;
        }
        return { total: response.TOTAL };
    };

    // Maneja la cotización de Paquetexpress
    const handlePaquetexpressQuotation = async (payload) => {
        const response = await reqQuotationPaqExpress(payload);
        if (!response) {
            return []
        }
        return response.quotations.map((quotation, i) => ({
            id: i,
            name: quotation.serviceName,
            total: quotation.amount.totalAmnt,
            tiempoEntrega: quotation.serviceInfoDescr,
            nota: quotation.serviceInfoDescrLong
        }));
    };

    // Función principal optimizada
    const handleQuotationShipping = async () => {
        try {
            setIsLoading(true);
            console.log("Direccion envio");

            const dataAddress = addresses.find((add) => add.id == selectedAddress)?.address;
            console.log(dataAddress)
            if (!dataAddress) {
                alert("No se encontró la dirección seleccionada");
                return;
            }

            const valorDeclaradoFinal = calculateDeclaredValue(products);

            // Cotización Castores
            const castoresPayload = buildCastoresPayload(dataAddress, products, colony, postalCode, ocurre, selectedAddressOcurre, valorDeclaradoFinal);
            const castoresQuote = await handleCastoresQuotation(castoresPayload);

            if (castoresQuote) {
                setQuotes((prevQuotes) => ({
                    ...prevQuotes,
                    castores: castoresQuote
                }));
            } else {
                setQuotes((prevQuotes) => ({
                    ...prevQuotes,
                    castores: {
                        total: 0,
                    }
                }));
            }

            // Cotización Paquetexpress
            if (!ocurre) {
                const paquetexpressPayload = buildPaquetexpressPayload(dataAddress, products, colony, postalCode, valorDeclaradoFinal);
                const paquetexpressQuotes = await handlePaquetexpressQuotation(paquetexpressPayload);

                setQuotes((prevQuotes) => ({
                    ...prevQuotes,
                    paquetexpress: paquetexpressQuotes
                }));
            } else {
                setQuotes((prevQuotes) => ({
                    ...prevQuotes,
                    paquetexpress: []
                }));
            }

        } catch (error) {
            console.error(error);
            alert("Ha ocurrido un error al cotizar. Comunícate con el administrador");
        } finally {
            setIsLoading(false);
        }
    };

    // Efecto para cerrar la lista de productos al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowProductsList(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])



    useEffect(() => {
        fetchProducts()
    }, [])

    // Efecto para filtrar productos cuando cambia el término de búsqueda
    useEffect(() => {
        if (searchTerm === "") {
            setFilteredProducts(PRODUCTOS_DISPONIBLES)
        } else {
            const normalizedSearchTerm = searchTerm.toLowerCase().trim()
            const filtered = PRODUCTOS_DISPONIBLES.filter((product) =>
                product.contenido.toLowerCase().includes(normalizedSearchTerm),
            )
            setFilteredProducts(filtered)
        }
    }, [searchTerm])

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        setShowProductsList(true)
    }

    const handleFocusSearch = () => {
        setShowProductsList(true)
    }

    const handleSelectProduct = (product) => {
        // Verificar si el producto ya está en la lista
        const productExists = products.some((p) => p.contenido === product.contenido)

        if (!productExists) {
            const newProduct = {
                id: Date.now(), // Usar timestamp como ID único
                sku: product.sku,
                contenido: product.contenido,
                cantidad: 1,
                valorDeclarado: product.valor_declarado,
                peso: product.peso,
                largo: product.largo_cm,
                ancho: product.ancho_cm,
                alto: product.alto_cm,
            }

            setProducts([...products, newProduct])
        }

        setSearchTerm("")
        setShowProductsList(false)
    }

    const handleRemoveProduct = (id) => {
        setProducts(products.filter((product) => product.id !== id))
    }

    const handleQuantityChange = (sku, value) => {
        const newQuantity = Number.parseInt(value) || 1
        setProducts(products.map((product) => (product.sku === sku ? { ...product, cantidad: newQuantity } : product)))
    }

    const handlePostalCode = (e) => {
        console.log(e.target.value)
        setPostalCode(e.target.value)
        if (e.target.value.length === 5) {
            fetchDistrictsCastores(e.target.value)
        }
    }

    return (
        <div className="cotizador-container">
            <div className="cotizador-header">
                <h1>Cotizador</h1>
            </div>

            <div className="cotizador-content">
                <div className="cotizador-form">

                    <div className="search-container" ref={searchContainerRef}>
                        <div className="search-input-container">
                            <input
                                type="text"
                                placeholder="Seleccione un Producto"
                                value={searchTerm}
                                onChange={handleSearch}
                                onFocus={handleFocusSearch}
                                className="search-input"
                            />
                            <button className="search-button">
                                <SearchIcon />
                            </button>
                        </div>

                        {showProductsList && (
                            <div className="products-dropdown">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <div key={product.sku} className="product-option" onClick={() => handleSelectProduct(product)}>
                                            {product.sku} - {product.contenido}
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-products">No se encontraron productos</div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="products-list">
                        {products.map((product) => (
                            <div key={product.id} className="product-item">
                                <div className="product-info">
                                    <span className="product-name">{product.sku} - {product.contenido}</span>
                                    <button className="remove-button" onClick={() => handleRemoveProduct(product.id)}>
                                        ×
                                    </button>
                                </div>
                                <div className="product-quantity">
                                    <label>N° de piezas:</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={product.cantidad}
                                        onChange={(e) => handleQuantityChange(product.sku, e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="address-section">
                        <div className="address-select">
                            <label>Dirección de envío:</label>
                            <select value={selectedAddress} onChange={(e) => setSelectedAddress(e.target.value)}>
                                <option value="">Seleccionar dirección</option>
                                {addresses.map((address, index) => (
                                    <option key={index} value={address.id}>
                                        {address.addressName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="postal-info">
                            <div className="postal-code">
                                <label>Código Postal (dirección de entrega)</label>
                                <input
                                    type="text"
                                    value={postalCode}
                                    onChange={handlePostalCode}
                                    placeholder="Código Postal"
                                />
                            </div>

                            <div className="colony">
                                <label>Colonia (dirección de entrega)</label>
                                <div className="select-container">
                                    <select value={colony} onChange={(e) => setColony(e.target.value)}>
                                        {colonies?.map((individualColony, i) => (
                                            <option key={i} value={individualColony.text}>
                                                {individualColony.text}
                                            </option>
                                        ))

                                        }
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="ocurre-container">
                            <label className="ocurre-label">
                                <input type="checkbox" disabled={postalCode < 5} checked={ocurre} onChange={() => { setOcurre(!ocurre); fetchOcurreCastores() }} />
                                <span>Ocurre Castores</span>
                            </label>
                            <div
                                className="question-icon"
                                onMouseEnter={() => setShowTooltip(true)}
                                onMouseLeave={() => setShowTooltip(false)}
                                ref={tooltipRef}
                            >
                                <QuestionIcon />
                                {showTooltip && (
                                    <div className="tooltip">
                                        Ocurre es una opción que sirve para entregar el pedido en la sucursal más cercana del estado, en
                                        caso de que no llegue la paquetería al domicilio.
                                    </div>
                                )}
                            </div>
                        </div>

                        {ocurre && (
                            <div className="address-select">
                                <label>Selecciona la dirección ocurre de castores:</label>
                                <select value={selectedAddressOcurre} onChange={(e) => setSelectedAddressOcurre(e.target.value)}>
                                    <option value="">Seleccionar ocurre</option>
                                    {ocurreOffices.map((address, index) => (
                                        <option key={index} value={address.idoficina}>
                                            {address.plaza}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="actions">
                        <button className="cotizar-button" onClick={handleQuotationShipping} disabled={isLoading || products.length === 0 || postalCode === ""}>
                            {isLoading ? <LoadingIcon /> : "Cotizar"}
                        </button>
                        {/* 
                        <button className="nueva-cotizacion-button" onClick={handleNuevaCotizacion}>
                            Generar Nueva Cotización
                        </button> */}
                    </div>
                </div>

                <div className="cotizador-results">
                    <div className="quote-tabs">
                        <button
                            className={`tab-button ${activeQuote === "castores" ? "active" : ""}`}
                            onClick={() => setActiveQuote("castores")}
                        >
                            Cotización Castores
                        </button>
                        <button
                            className={`tab-button ${activeQuote === "paquetexpress" ? "active" : ""}`}
                            onClick={() => setActiveQuote("paquetexpress")}
                        >
                            Cotización Paquetexpress
                        </button>
                    </div>

                    <div className="quote-details">
                        <h2>Cotización {activeQuote}</h2>

                        {activeQuote === "paquetexpress" && (
                            <div className="paquetexpress-options">
                                {quotes.paquetexpress.length === 0 ? (
                                    <div className="single-option-message">No se encontraron opciones de envío disponible</div>
                                ) : (
                                    <div className="options-count">Se encontraron {quotes.paquetexpress.length} opcion(es) de envío</div>
                                )}
                                <div className="options-container">
                                    {quotes.paquetexpress.map((quote) => (
                                        <div
                                            key={quote.id}
                                            className={`paquetexpress-option ${selectedPaquetexpressQuote === quote.id ? "selected" : ""}`}
                                            onClick={() => setSelectedPaquetexpressQuote(quote.id)}
                                        >
                                            <div className="option-name">{quote.name}</div>
                                            <div className="option-delivery">{quote.tiempoEntrega}</div>
                                            <div className="option-delivery">{quote.nota}</div>
                                            <div className="option-price">${quote.total.toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeQuote === "castores" && (
                            <div
                                className={`paquetexpress-option selected`}
                            >
                                <div className="option-name">Standard</div>
                                <div className="option-delivery">Entrega de 1 a 7 hábiles</div>
                                <div className="option-price">${quotes.castores.total}</div>
                            </div>
                        )

                        }

                        <div className="quote-item total">
                            <span>TOTAL</span>
                            <span>
                                $
                                {activeQuote === "castores"
                                    ? quotes.castores.total.toFixed(2)
                                    : quotes.paquetexpress.find((q) => q.id === selectedPaquetexpressQuote)?.total?.toFixed(2) || 0.00}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Castores;