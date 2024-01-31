import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Logoo from '../img/Logo.png'


import './castorestyle.css'
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import QRCode from 'qrcode';


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


    //generar pdf 
    const [pdfUrl2, setPdfUrl2] = useState('');

    const generatePDF = async () => {
        const doc = new jsPDF();

        // Añadir texto "Hola Mundo" x1 y2
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);

        doc.text('Pickin Oder', 10, 20);
        doc.addImage(Logoo, 'PNG', 60, 7, 50, 15);
        doc.setLineWidth(0.8);

        doc.setFontSize(13);
        doc.text('S21376', 15, 35);//DATO1
        doc.text('/', 36, 35);
        doc.text('WHP/OUT/15765', 38, 35);//DATO2




        doc.setFontSize(12);
        doc.text('SALES TEAM:', 15, 40);
        doc.text('Venta directa 55', 45, 40);//dato3
        doc.setLineWidth(0.8); // Ajusta este valor para cambiar el grosor de la línea

        

        let yMedia = 32; // Promedio de las alturas 'y' de los textos DATO2 y SALES TEAM

        // Definir el tamaño y la posición del recuadro
        let xRecuadro1 = 85; // Ajusta esta posición 'x' según el ancho de tu documento
        let xRecuadro2 = xRecuadro1 + 10;
        let anchoRecuadro = 10; // Ancho del recuadro
        let altoRecuadro = 10; // Alto del recuadro
    
        // Dibujar el recuadro
        doc.rect(xRecuadro1, yMedia - 3, anchoRecuadro, altoRecuadro);

        // Dibujar el segundo recuadro para el "4"
        doc.rect(xRecuadro2, yMedia - 3, anchoRecuadro, altoRecuadro);
    
        // Añadir el número "14" dentro del recuadro
        // Ajusta el desplazamiento dentro del recuadro según el tamaño de la fuente y las dimensiones del recuadro
        doc.setFontSize(15); // Puedes ajustar el tamaño de la fuente si es necesario
        doc.text('1', xRecuadro1 + 3, yMedia + 4); // Ajusta estos valores para centrar el texto como desees
    

        doc.text('4', xRecuadro2 + 3, yMedia + 4); // Ajusta estos valores para centrar el texto como desees

        doc.line(10, 45, 110, 45); // Ajusta las coordenadas según necesites
        doc.setFontSize(12);

        doc.text('Producto a despachar', 20, 52);
        doc.setFontSize(10)
        doc.text('[KITCPUHTC] KIT CPU ALIENADORA CON TECLADO', 15, 57);

        doc.setLineWidth(0.8); // Ajusta este valor para cambiar el grosor de la línea

        doc.line(10, 62, 110, 62); // Ajusta las coordenadas según necesites
        doc.setFontSize(10)
        doc.text('Productos adicionales de la orden (SKU)', 13, 67);

        const productos = [
            { id: 1, sku: "SKU1" },
            { id: 1, sku: "SKU1" },
            { id: 1, sku: "SKU1" },
            { id: 1, sku: "SKU1" },
            { id: 1, sku: "SKU1" },
            { id: 1, sku: "SKU1" },
            { id: 1, sku: "SKU1" },
            // otros productos...
        ];

        const productosPorFila = 4;
        const filaAltura = 5; // Altura de cada fila de texto
        let y = 72; // Inicio de la primera fila de productos

        productos.forEach((producto, index) => {
            const x = 18 + (index % productosPorFila) * 25; // Calcular posición x basado en el índice
            if (index % productosPorFila === 0 && index !== 0) {
                y += filaAltura; // Mover a la siguiente fila después de cada 4 productos
            }

            // Dibujar un pequeño rectángulo para marcar, a la izquierda del SKU
            doc.rect(x - 5, y - 3, 3, 3, 'S'); // Ajusta las dimensiones según necesites

            // Escribir el SKU a la derecha del rectángulo
            doc.text(producto.sku, x, y);
        });

        // Ajustar el rectángulo para contener todos los productos
        const totalFilas = Math.ceil(productos.length / productosPorFila);
        const rectAltura = totalFilas * filaAltura + 10; // 10 es un pequeño margen adicional
        doc.rect(10, 25, 100, rectAltura + 40, 'S'); // +40 para ajustar contenido previo
        let yQRStart = y + 10; // Agrega un margen después de la última línea de productos

        // Generar código QR
        try {
            const qrDataURL = await QRCode.toDataURL('Tu texto o URL aquí', {
                width: 100,
                margin: 2,
            });

            // Añadir el código QR al PDF
            doc.addImage(qrDataURL, 'PNG', 10, yQRStart, 50, 50); // Ajusta según necesites

            const yQRStartfin = yQRStart + 50; // Agrega un margen después de la última línea de productos
        doc.setFontSize(5)
        doc.text('Nota: este documento es para uso esxlusivo', 13, yQRStartfin);

        doc.text('del equipo de logistica de HANTEC. SI usted es', 13, yQRStartfin+2);
        doc.text('cliente y ha recibido este documento por favor', 13, yQRStartfin+4);
        doc.text('haga caso omiso', 13, yQRStartfin + 6);



            if (doc.output('bloburi')) {
                const url = doc.output('bloburi');
                setPdfUrl2(url);
              }
        } catch (err) {
            console.error('Error al generar el código QR:', err);
        }


    };

    return (
        <div className='contencastores'>

            <div className='ldodercas'>
                <h1>
                    Generar guía para envió

                </h1>

                <div>
                    <p>
                        Ingresa los datos restantes para generar la guía.
                    </p>

                    <div>
                        <button onClick={generatePDF} className="btnpdjo p-2 bg-blue-500 text-white rounded mr-4">
                            Generar PDF
                        </button>
                        {pdfUrl2 && (
                            <a href={pdfUrl2} target="_blank" rel="noopener noreferrer" className="liodf ml-6  text-blue-600">
                                Abrir PDF
                            </a>
                        )}
                    </div>
                </div>


                <div className='formgene'>
                    <div className='divflexz'>
                        <div className='ipgneerar'>
                            <p>Nombre:</p>
                            <input className='inpchico' type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                        </div>
                        <div className='ipgneerar'>
                            <p>Teléfono:</p>
                            <input className='inpchico' type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                        </div>
                    </div>

                    <div className='divflexz'>
                        <div className='ipgneerar'>
                            <p>Email:</p>
                            <input className='inpchico' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className='ipgneerar'>
                            <p>Calle:</p>
                            <input className='inpchico' type="text" value={calle} onChange={(e) => setCalle(e.target.value)} />
                        </div>

                    </div>


                    <div className='divflexz'>
                        <div className='ipgneerar'>
                            <p>Numero interiro :</p>
                            <input className='inpchico' type="text" value={numInt} onChange={(e) => setNumInt(e.target.value)} />
                        </div>
                        <div className='ipgneerar'>
                            <p>Numero Exterior:</p>
                            <input className='inpchico' type="text" value={numExt} onChange={(e) => setNumExt(e.target.value)} />
                        </div>
                    </div>
                    <div className='divflexz'>

                        <div className='ipgneerar'>
                            <p>Colonia:</p>
                            <input className='inpchico' type="text" value={colonia} onChange={(e) => setColonia(e.target.value)} />
                        </div>
                        <div className='ipgneerar'>
                            <p>Ciudad:</p>
                            <input className='inpchico' type="text" value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
                        </div>
                    </div>

                    <div className='divflexz'>
                        <div className='ipgneerar'>
                            <p>Estado:</p>
                            <input className='inpchico' type="text" value={estado} onChange={(e) => setEstado(e.target.value)} />
                        </div >
                        <div className='ipgneerar' >
                            <p>C.P.:</p>
                            <input className='inpchico' type="text" value={cp} onChange={(e) => setCp(e.target.value)} />
                        </div>
                    </div>

                    <div className='contebutton'>
                        <button className='btncassendguia' onClick={handleSubmit}>Generar Guía</button>

                    </div>

                </div>
                {loading && <div className="spinner-container">
                    <div className="spinner"></div>
                </div>}

            </div>
            {pdfUrl && (
                <div className='ldoizqcasguia'>




                    <iframe
                        src={pdfUrl}
                        style={{ width: '80%', height: '75%', border: 'none' }}
                        frameBorder="0"
                        scrolling="auto"
                    >
                    </iframe>


                    <div>
                        <a href={pdfUrl} className='btncassendguiadow' download="NombreDelArchivo.pdf">
                            Descargar
                        </a>
                    </div>

                </div>
            )}


        </div>
    );
}

export default GenerarGuia;