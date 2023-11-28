import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import { miFuenteNormalBase64, miFuenteBoldBase64, miFuenteMasBoldBase64 } from '../fuentespdf/fuentes';
import Logoo from '../../img/Logo.png'
import BackgroundImage from '../../img/BackgroundPDF-min.png';
import Imgbancos from '../../img/BancosBW.png'

function ModalPDF({ isOpen, onClose, numerselect, idagente, id_dlinea }) {
    const [orden, setOrden] = useState('');

    const [respuesta, setRespuesta] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setOrden('');
            setRespuesta([]);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isValidData(respuesta)) {
            generatePDF();
        }
    });
    

    
    function formatearNumeroConComas(numero) {
        return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const handleGenerarOrden = async () => {

        const postData = {
            idSale: orden,  // Enviando el número de orden como parámetro
        };
        try {
            const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/getpdf', postData);

            // Verificar si la respuesta es un array o un string
            if (Array.isArray(response.data)) {
                console.log('es array', response.data)
                setRespuesta(response.data);
            } else {
                console.log('es strin', response.data)
                setRespuesta(response.data);
            }

        } catch (error) {
            console.error('Error al enviar la solicitud a la API:', error);
            setRespuesta('Ocurrió un error al buscar la orden');

        }
    };
    const formatDate = (originalDate) => {
        const parts = originalDate.split(' ')[0].split('-'); // Separamos por espacio y luego por guión
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    //fuentes 
    function initFonts(doc) {
        doc.addFileToVFS('Montserrat-Regular.ttf', miFuenteNormalBase64);
        doc.addFont('Montserrat-Regular.ttf', 'MiFuente', 'normal');
        doc.addFileToVFS('Montserrat-SemiBold.ttf', miFuenteBoldBase64);
        doc.addFont('Montserrat-SemiBold.ttf', 'monboldetoi', 'bold');
        doc.addFileToVFS('Montserrat-Regular.ttf', miFuenteNormalBase64);
        doc.addFont('Montserrat-Regular.ttf', 'Montnormal', 'normal');
        doc.addFileToVFS('Montserrat-Bold.ttf', miFuenteMasBoldBase64);
        doc.addFont('Montserrat-Bold.ttf', 'MontBold', 'bold');
    }

    //cabecera de documento 
    const addHeader = (doc) => {
        doc.addImage(Logoo, 'PNG', 10, 7, 50, 15);
        const textX = 65;
        let textY = 10;

        doc.setFontSize(9);
        doc.setFont("monboldetoi", 'bold');
        doc.text('C&O Projects And Solutions', textX, textY);
        doc.setFont("MiFuente", 'normal');
        textY += 4;
        doc.text('Cuauhtemoc 604 42040 Pachuca, Hidalgo', textX, textY);
        textY += 4;
        doc.text('México', textX, textY);
        textY += 4;
        doc.text('RFC:CPS1111102U5', textX, textY);
        textY += 3; // Añadir un poco de espacio antes de la línea

        doc.setDrawColor(200, 200, 200); // RGB para gris claro
        doc.line(10, textY, 200, textY); // Línea desde el margen izquierdo (10mm) hasta casi el margen derecho (200mm)


    };


    const datoClient = (doc) => {

        const midPage = 105;


        // Establecer el color del texto a #012A45
        doc.setTextColor(1, 42, 69);
        doc.setFont("MontBold", "bold");
        doc.setFontSize(18);
        doc.text('Ficha de depósito', 12, 35);
        doc.setFontSize(13);
        doc.text(orden, 12, 42);

        // Restablecer el color del texto a negro para el resto del documento
        doc.setTextColor(0, 0, 0);

        const nombreCliente = respuesta[0]?.cliente[1];

        doc.setFontSize(10);
        doc.setFont("MontBold", "bold");
        doc.text('Fecha de la orden:', 12, 50);
        doc.setFont("Montnormal", "normal");
        const fechaOrder = formatDate(respuesta[0]?.fecha);
        doc.text(fechaOrder, 12, 55);

        doc.setFont("MontBold", "bold");
        doc.text('Cliente', midPage, 35);
        doc.setFont("Montnormal", "normal");
        doc.text(nombreCliente, midPage, 40);

        doc.setFontSize(10);
        doc.setFont("MontBold", "bold");
        doc.text('Vendedor:', midPage, 50);
        doc.setFont("Montnormal", "normal");




        const vendedor = respuesta[0]?.vendedor[1]

        if (vendedor) {
            doc.text(vendedor, midPage, 55);
        } else {
            doc.text('N/A', midPage, 55);
        };
    }

    const imgFondo = (doc) => {
        doc.addImage(BackgroundImage, 'PNG', 30, 85, 150, 180 - 30);

    }
    
    function isValidData() {
        return respuesta && respuesta.length > 0 && respuesta[0].cliente && respuesta[0].cliente.length >= 2;
    }

    function generateRows() {

        return respuesta.map(item => [

            item.description[1],
            item.cantidad + " Unidades",
            "$" +formatearNumeroConComas(parseFloat(item.precio_unitario).toFixed(2)),
            "IVA(16%)",
            "MX$" +  formatearNumeroConComas(parseFloat(item.subtotal).toFixed(2))
        ]);
    }
    function calculateTotals() {
        return {
            totalUnitario: respuesta.reduce((sum, item) => sum + item.subtotal, 0),
            ivatotal: respuesta.reduce((sum, item) => sum + item.iba_cantidad, 0),
            totalmiva: respuesta.reduce((sum, item) => sum + item.total, 0)
        };
    }

    function drawTable(doc, columns, rows) {
        return doc.autoTable(columns, rows, {
            startY: 65,
            startX: 12,
            didDrawPage: () => {
                addHeader(doc);
                datoClient(doc);
                imgFondo(doc)
            },
            styles: {
                font: 'MiFuente', // Aquí especificas el nombre de la fuente que registraste.
                textColor: 0,
            },
            columnStyles: {
                0: { fillColor: false },
                1: { fillColor: false },
                2: { fillColor: false },
                3: { fillColor: false },
                4: { fillColor: false }
            },
            headStyles: {
                font: 'monboldetoi',
                fillColor: false,
                textColor: 0,
            },
            alternateRowStyles: {
                fillColor: [200, 200, 200],
            },

            didDrawCell: function (data) {
                if (data.section === 'head') {
                    doc.setDrawColor(200, 200, 200);
                    doc.line(data.cell.x, data.cell.y, data.cell.x + data.cell.width, data.cell.y); // Dibuja la línea superior para cada celda de la cabecera
                }
            }

        });
    }


    function displayTotals(doc, totalUnitario, ivatotal, totalmiva, fontSize) {
        doc.setFontSize(fontSize);
        const startY = doc.autoTable.previous.finalY + 5;
        doc.setFontSize(9);
        doc.setDrawColor(200, 200, 200); // Color gris
        doc.line(140, startY - 4, 200, startY - 4); // Coordenadas para la línea
        doc.setFont("MiFuente", 'normal');
        doc.text('Importe sin', 140, startY);
        doc.text('impuestos', 140, startY + 3);
        doc.setFont("MiFuente", 'normal');
        doc.text('MX $' + formatearNumeroConComas(parseFloat(totalUnitario).toFixed(2)), 170, startY);
        doc.setFont("MiFuente", 'normal');
        doc.text('IVA 16%:', 140, startY + 8);
        doc.setFont("MiFuente", 'normal');
        doc.text('MX $' +formatearNumeroConComas(parseFloat(ivatotal).toFixed(2)), 170, startY + 8);
        doc.setFont("MiFuente", 'normal');
        doc.setDrawColor(200, 200, 200); // Color gris
        doc.line(140, startY + 11, 200, startY + 11); // Coordenadas para la línea    
        doc.text('Total', 140, startY + 15);
        doc.setFont("MiFuente", 'normal');
        doc.text('MX $' +  formatearNumeroConComas(parseFloat(totalmiva).toFixed(2)), 170, startY + 15);
    }

    function addFooter(doc ) {
        const pageWidth = 210;  // Asumiendo que estás usando formato A4.
        const margin = 15;  // Margen a la izquierda y derecha.
        const imageWidth = pageWidth - 2 * margin;
        let totales = calculateTotals();
        let totalmiva = totales.totalmiva;
    

        doc.setFont("monboldetoi", 'bold');
        doc.text('C&O Projects And Solutions', 15, 230, );
        doc.setFont("MiFuente", 'normal');
        doc.text('Referencia: '+orden, 15, 235,);
        doc.text('Monto: '+formatearNumeroConComas(parseFloat(totalmiva).toFixed(2)), 15, 240, );

        

        doc.addImage(Imgbancos, 'PNG', margin, 250, imageWidth, 10);

        const startX = 35;
        const startX2 = 83;
        let startY2 = 265;  // Posición inicial después de la imagen. Puedes ajustar según necesites.



        let startY = 265;  // Posición inicial después de la imagen. Puedes ajustar según necesites.
        const lineHeight = 3;  // Espacio vertical entre líneas. Ajusta según prefieras.

        doc.setFontSize(8);

        doc.setFont("monboldetoi", 'bold');
        doc.text('CITIBANAMEX', startX, startY, 'center');
        startY += lineHeight;

        doc.setFont("MiFuente", 'normal');
        doc.text("Cheques", startX, startY, 'center');
        startY += lineHeight;
        doc.setFont("monboldetoi", 'bold');
        doc.text("7010908377", startX, startY, 'center');
        startY += lineHeight;
        doc.setFont("MiFuente", 'normal');
        doc.text("Clabe", startX, startY, 'center');
        startY += lineHeight;
        doc.setFont("monboldetoi", 'bold');

        doc.text("220970009083775", startX, startY, 'center');

        doc.setFontSize(8);//sandander

        doc.setFont("monboldetoi", 'bold');
        doc.text('SANTANDER', startX2, startY2, 'center');
        startY2 += lineHeight;

        doc.setFont("MiFuente", 'normal');
        doc.text("Cuenta", startX2, startY2, 'center');
        startY2 += lineHeight;

        doc.setFont("monboldetoi", 'bold');
        doc.text("6550776258-1", startX2, startY2, 'center');
        startY2 += lineHeight;

        doc.setFont("MiFuente", 'normal');
        doc.text("Clabe", startX2, startY2, 'center');
        startY2 += lineHeight;

        doc.setFont("monboldetoi", 'bold');
        doc.text("01431255507625819", startX2, startY2, 'center');
        const startX3 = 128;
        let startY3 = 265;

        doc.setFontSize(8);//Inbursa


        doc.setFont("monboldetoi", 'bold');
        doc.text('INBURSA', startX3, startY3, 'center');
        startY3 += lineHeight;

        doc.setFont("MiFuente", 'normal');
        doc.text("Cuenta", startX3, startY3, 'center');
        startY3 += lineHeight;

        doc.setFont("monboldetoi", 'bold');
        doc.text("50066472511", startX3, startY3, 'center');
        startY3 += lineHeight;

        doc.setFont("MiFuente", 'normal');
        doc.text("Clabe", startX3, startY3, 'center');
        startY3 += lineHeight;

        doc.setFont("monboldetoi", 'bold');
        doc.text("036134500664725116", startX3, startY3, 'center');
        const startX4 = 175;
        let startY4 = 265;

        doc.setFontSize(8);//VARIOS


        doc.setFont("monboldetoi", 'bold');
        doc.text('OTROS MÉTODOS', startX4, startY4, 'center');
        startY4 += lineHeight;

        doc.setFont("MiFuente", 'normal');
        doc.text("Banco INBURSA", startX4, startY4, 'center');
        startY4 += lineHeight;

        doc.text("Cuenta de cheques", startX4, startY4, 'center');
        startY4 += lineHeight;

        doc.text("TARJETA DEBITO", startX4, startY4, 'center');
        startY4 += lineHeight;

        doc.setFont("monboldetoi", 'bold');
        doc.text("4658 2858 0054 9812", startX4, startY4, 'center');

    }


    const generatePDF = () => {
        if (!isValidData()) {
            console.error("Datos no válidos o insuficientes para generar el PDF");
            return;
        }

        const doc = new jsPDF();
        initFonts(doc);
        const columns = ["Descripción", "Cantidad", "Precio Unitario", "Impuestos", "Importe"];
        const rows = generateRows();
        const { totalUnitario, ivatotal, totalmiva } = calculateTotals();

        drawTable(doc, columns, rows);

        displayTotals(doc, totalUnitario, ivatotal, totalmiva, 10);

        addFooter(doc);

        const pdfBase64 = doc.output('datauristring');

        setRespuesta(null);
        onPdfGenerated(pdfBase64);
    };

    const filename = "miPDF.pdf"; // Nombre de archivo deseado
    const mimeType = "application/pdf"; // Tipo MIME del PDF
    const [pdfUrl, setPdfUrl] = useState(null);
    const [pdfconte, setPdfConte] = useState([]);


    const onPdfGenerated = (data) => {
        // Aquí recibes los datos del PDF y puedes hacer lo que necesites con ellos
        const base64String = data

        const pdfFile = base64toFile(base64String, filename, mimeType);
        console.log('ajkdbjkeb', pdfFile)
        const url = URL.createObjectURL(pdfFile);
        setPdfUrl(url);
        setPdfConte(pdfFile)

    };

    function base64toFile(base64, filename, mimeType) {
        // Dividir la cadena base64 en encabezado y contenido
        const [header, body] = base64.split(',');

        // Obtener el contenido en formato binario
        console.log(header)
        const binaryData = atob(body);

        // Crear un array de bytes
        const arrayBuffer = new ArrayBuffer(binaryData.length);
        const byteArray = new Uint8Array(arrayBuffer);
        for (let i = 0; i < binaryData.length; i++) {
            byteArray[i] = binaryData.charCodeAt(i);
        }

        // Crear un objeto Blob
        const blob = new Blob([arrayBuffer], { type: mimeType });

        // Crear un objeto File
        const file = new File([blob], filename, { type: mimeType });

        return file;
    }

    //enviar pdf 


    const sendPdfToUser = async () => {


        const formData = new FormData();
        formData.append('pdf', pdfconte);
        formData.append('idAgente', idagente);
        formData.append('linea', id_dlinea)
        formData.set('numero', numerselect);



        try {
            const response = await axios.post('https://backend-chatify-sjkbu6lfrq-uc.a.run.app/send-pdf', formData);
            console.log(`PDF enviada o:`, response.data);
        } catch (error) {
            console.error(`Error al enviar el PDF`, error);
        }

        onClose()



    };

    return (
        <div className="modalOverlaysuge">
            <div className="modalContentsuge">
                <div className='headermodals'>
                    <p>Generar ficha de depósito </p>
                    <button onClick={onClose}><i className="fas fa-times"></i></button>
                </div>

                <div className='contenpdfmodal'>

                    <div className='ladoder'>
                        <div>
                            <input
                                type="text"
                                value={orden}
                                onChange={(e) => setOrden(e.target.value)}
                                placeholder="Ingrese folio de ficha de depósito"
                                className='inpordn'
                            />
                        </div>


                        <button className='btnordetn' onClick={handleGenerarOrden}>Generar PDF</button>
                    </div>

                    <div className='ladodelpdf'>

                        {respuesta && (
                            typeof respuesta === 'string' ?
                                <p>{respuesta}</p> :
                                <p></p>


                        )}

                        {pdfUrl && (
                            <div className='ladopfd'>

                                <div className='pdfor20'>
                                    <iframe title='orden' src={pdfUrl} width="90%" height="360px"></iframe>

                                </div>
                                <div className='btnsedord'>

                                    {numerselect
                                        ? <button className='btnordetn20' onClick={sendPdfToUser}>Enviar Orden</button>
                                        : <a href={pdfUrl} download={`Ficha-${orden}.pdf`} className='btnordetn20'>Descargar PDF</a>
                                    }



                                </div>
                            </div>
                        )}
                    </div>


                </div>



            </div>
        </div>
    );
};

export default ModalPDF;
