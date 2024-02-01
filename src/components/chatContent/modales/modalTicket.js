import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import QRCode from 'qrcode';
import Logoo from '../../img/Logo.png'

function ModalTicket({ isOpen, onClose, nombreAgente }) {

    const [idSale, setIdSale] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pdfUrl2, setPdfUrl2] = useState('');
    const [pickingName, setPickingName] = useState('');
    const [salesTeam, setSalesTeam] = useState('');
    const [marketPlaceReference, setMarketPlaceReference] = useState('');
    const [productos, setProductos] = useState([]);
    const [productoDespachar, setProductoDespachar] = useState('');
    const [skus, setSkus] = useState([]);
    const [qrContent, setQrContent]= useState('');

    const uploadToDrive = async (link, name) => {
        fetch(link)
        .then(response => response.blob()) // Obtiene el Blob del response
        .then(blob => {
            // Convertir el Blob en un objeto File
            const file = new File([blob], "nombreArchivo.pdf", { type: "application/pdf" });
            // Ahora tienes el archivo, y puedes enviarlo a tu endpoint
            const formData = new FormData();
            formData.append("file", file, file.name); // "file" es el nombre del campo en tu servidor
            formData.append("name", name);
            // Reemplaza 'tu-endpoint.com/subirArchivo' con tu URL real
            fetch('http://127.0.0.1:8000/uploadToDrive', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json()) // Asume que tu servidor responde con JSON
            .then(data => {
                console.log('Archivo subido con éxito:', data);
                
            })
            .catch(error => {
                console.error(error);
                alert('Error al subir el archivo');
            });
        })
        .catch(error => console.error('Error al recuperar el Blob:', error));
        
      };

    const generatePDF = async (idSale, pickingName, salesTeam, marketPlaceReference, productoDespachar, productos, qrContent, totalProductos, contador) => {
        console.log(productoDespachar);
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [102, 203]
        });
        // Añadir texto "Hola Mundo" x1 y2
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);

        doc.text('Picking Oder', 3, 15);
        doc.addImage(Logoo, 'PNG', 50, 7, 50, 15);
        doc.setLineWidth(0.8);

        doc.setFontSize(13);
        doc.text(idSale, 5, 35);//DATO1
        doc.text('/', 21, 35);
        doc.text(pickingName, 23, 35);//DATO2

        doc.setFontSize(12);
        doc.text('SALES TEAM:', 5, 40);
        doc.text(salesTeam, 35, 40);//dato3
        doc.setLineWidth(0.8); // Ajusta este valor para cambiar el grosor de la líne
    

        let yMedia = 32; // Promedio de las alturas 'y' de los textos DATO2 y SALES TEAM

        // Definir el tamaño y la posición del recuadro
        let xRecuadro1 = 75; // Ajusta esta posición 'x' según el ancho de tu documento
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
        doc.text(contador, xRecuadro1 + 3, yMedia + 4); // Ajusta estos valores para centrar el texto como desees
    

        doc.text(totalProductos, xRecuadro2 + 3, yMedia + 4); // Ajusta estos valores para centrar el texto como desees
        doc.setFontSize(12);

        doc.text('Marketplace Reference', 5, 45);



        doc.line(3.5, 47, 98, 47); // Ajusta las coordenadas según necesites
        doc.setFontSize(12);

        doc.text('Producto a despachar', 6, 52);
        doc.setFontSize(7)
        doc.text(productoDespachar, 6, 57);

        doc.setLineWidth(0.8); // Ajusta este valor para cambiar el grosor de la línea

        doc.line(3.5, 60, 98, 60); // Ajusta las coordenadas según necesites
        doc.setFontSize(10)
        doc.text('Productos adicionales de la orden (SKU)', 6, 64);
        


        const productosPorFila = 3;
        const filaAltura = 5; // Altura de cada fila de texto
        let y = 72; // Inicio de la primera fila de productos

        productos.forEach((producto, index) => {
            const x = 15 + (index % productosPorFila) * 32; // Calcular posición x basado en el índice
            if (index % productosPorFila === 0 && index !== 0) {
                y += filaAltura; // Mover a la siguiente fila después de cada 4 productos
            }

            // Dibujar un pequeño rectángulo para marcar, a la izquierda del SKU
            doc.rect(x - 5, y - 3, 3, 3, 'S'); // Ajusta las dimensiones según necesites

            // Escribir el SKU a la derecha del rectángulo
            doc.setFontSize(10)
            doc.text(producto.sku, x, y);
        });

        // Ajustar el rectángulo para contener todos los productos
        const totalFilas = Math.ceil(productos.length / productosPorFila);
        const rectAltura = totalFilas * filaAltura + 10; // 10 es un pequeño margen adicional
        doc.rect(3.5, 25, 95, rectAltura + 40, 'S'); // +40 para ajustar contenido previo
        let yQRStart = y + 10; // Agrega un margen después de la última línea de productos

        // Generar código QR
        try {
            const qrDataURL = await QRCode.toDataURL(qrContent, {
                width: 100,
                margin: 2,
            });

            // Añadir el código QR al PDF
            doc.addImage(qrDataURL, 'PNG', 2, yQRStart, 50, 50); // Ajusta según necesites

            const yQRStartfin = yQRStart + 55; // Agrega un margen después de la última línea de productos
        doc.setFontSize(8)
        doc.text('Nota: este documento es para uso exclusivo', 3, yQRStartfin);

        doc.text('del equipo de logistica de HANTEC. SI usted es', 3, yQRStartfin+3);
        doc.text('cliente y ha recibido este documento por favor', 3, yQRStartfin+6);
        doc.text('haga caso omiso', 3, yQRStartfin + 9);



            if (doc.output('bloburi')) {
                const url = doc.output('bloburi');
                setPdfUrl2(url);
              }
        return doc.output('bloburi');   
        } catch (err) {
            console.error('Error al generar el código QR:', err);
        }


    };
    const nambeAgent = localStorage.getItem('nombreUsuario');
    const ticket = async () =>{

        const formData = {
            "idSale": idSale,
            "agente": nambeAgent
        };
        try {
            // Hacer la petición POST a tu API
            const response = await axios.post('http://127.0.0.1:8000/ticket', formData);
            

            setPickingName(response.data.pickingName.toString());
            setSalesTeam(response.data.salesTeam.toString());
            setMarketPlaceReference(response.data.marketPlaceReference.toString())
            setProductos(response.data.products);
            setQrContent(response.data.marketPlaceReference.toString())
            setSkus(response.data.skus);
            let contador = 1;
            
            console.log(productos.length.toString());
            productos.forEach((producto) => {
                setProductoDespachar(producto.name.toString());
                generarTicket(producto.name.toString(), contador.toString(), response.data.saleOrderName.toString());
                
                contador += 1;
                
            });
            

            // Manejar la respuesta de la API
        } catch (error) {
            console.error("Error al enviar los datos:", error);
            setError('Ha ocurrido un error, vuelve a intentarlo');
        }finally{
            setIdSale('')
            alert('Archivos subidos a Drive');
        }
    }

    

    const generarTicket = async (prod, cont, nameTick) =>{
        const nombreTick = "Ticket-"+nameTick.toString()
        try {
            setLoading(true);
            const pdfUrl = await generatePDF(idSale.toString(), pickingName.toString(), salesTeam.toString(), marketPlaceReference.toString(), prod.toString(), skus, qrContent, productos.length.toString(), cont.toString());
            await uploadToDrive(pdfUrl, nombreTick);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setError(error);
            setLoading(false);
        }
    };

    return (
        <div className="modalOverlaysuge">
            <div className="modalContentsuge">
                <div className='headermodals'>
                    <p>Generar Ticket</p>
                    <button onClick={onClose}><i className="fas fa-times"></i></button>
                </div>

                <div className='contenpdfmodal'>

                    <div className='centro'>
                        <div>
                            <input
                                type="text"
                                value={idSale}
                                onChange={(e) => setIdSale(e.target.value)}
                                placeholder="EJ. S19306"
                                className='inpordn'
                            />
                        </div>


                        <button className='btnordetn' onClick={ticket} disabled={loading}>Generar Ticket</button>
                        {pdfUrl2 && (
                            <a href={pdfUrl2} className='btncassendguiadow' download="Andale.pdf">
                            Descargar
                        </a>
                        )}
                        {loading && <div className="spinner-container">
                                        <div className="spinner"></div>
                                    </div>}
                        {error && <p className='messageAlert'>Error</p>}                        
                    </div>

                   
                </div>



            </div>
        </div>
    );

}

export default ModalTicket;