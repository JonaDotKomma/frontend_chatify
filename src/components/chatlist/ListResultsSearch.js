import React, { useState } from "react";

function ListResultsSearch({ results, localResults, onSelectChat }) {
    // Estado para el elemento seleccionado y de qué lista proviene
    const [selectedItem, setSelectedItem] = useState({ item: null, listType: null });

    const handleSelectItem = (item, listType) => {
        setSelectedItem({ item, listType });

        // Supongamos que los elementos locales y globales tienen diferentes estructuras de datos

        if (listType === 'local') {
            // Extrae los datos necesarios para un chat local

            const idUser = item[0];
            const numero = item[2];
            const botestado = item[3];
            const nameclient = item[1];

            const idlinea = item[9];

            onSelectChat(idUser, numero, botestado, nameclient, idlinea);

        } else if (listType === 'global') {
            // Extrae los datos necesarios para un chat global

            const idUser = item.id_usuario;
            const numero = item.telefono;
            const botestado = item.bot_status;
            const nameclient = item.nombre;

            const idlinea = item.linea_id; /// Asegúrate de que esta propiedad exista en el objeto 'item'
            onSelectChat(idUser, numero, botestado, nameclient, idlinea);
        }

        // Llama a onSelectChat con los datos recopilados

    };

    return (
        <div className="chatlistSarch">
            <div>
                <p className="titlesearch">Chats</p>
                {localResults.length > 0 ? (
                    localResults.map((localResult, index) => (
                        <div
                            key={index}
                            className={`chatlist ${selectedItem.item === localResult ? "selected" : ""}`}
                            onClick={() => handleSelectItem(localResult, 'local')}
                        >
                            <div className="contenedor-circular">
                                <i className="fas fa-user icono-usuario"></i>
                            </div>
                            <div className="dtoclilist">
                                <p className="nameuser"> {localResult[1]} </p>
                                <span className="nametipo">linea {localResult[4]}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No se encontraron chats</p>
                )}
            </div>

            <div>
                <p className="titlesearch">Mensajes</p>
                {results.length > 0 ? (
                    results.map((result, index) => (
                        <div
                            key={index}
                            className={`chatlist ${selectedItem.item === result && selectedItem.listType === 'global' ? "selected" : ""}`}
                            onClick={() => handleSelectItem(result, 'global')}
                        >
                            <div className="avatar">
                                <i className="fas fa-user-circle" aria-hidden="true"></i>
                            </div>
                            <div className="namecliente">
                                <p className="nameuser"> {result.nombre} </p>
                                <span className="nametipo">Mensaje: {result.mensaje}</span>
                            </div>

                        </div>
                    ))
                ) : (
                    <p>No se encontraron mensajes</p>
                )}
            </div>
        </div>
    );
}

export default ListResultsSearch;
