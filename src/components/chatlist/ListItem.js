import React, { Component } from "react";
import axios from 'axios';


export default class ListItemWP extends Component {
    state = {
        botestado: this.props.status
    };

    seenApi(idUser, idAgente, nombreAgente) {

        const url = '/seen'; // Solo especifica el endpoint.
        console.log('CLIIIIIIIIIIIIIIIIIIIIIIIIIK BUEEEEEEEEEEEEEY JAJAJA');
        const data = {
            idUser: idUser,
            idAgente: idAgente,
            nombreAgente: nombreAgente
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('Hubo un error al enviar la petición:sdfrf', error);
            });
    }


    async asignarcliente(idUser, idAgnt) {
        const postData = {
            idAgente: idAgnt,
            idUser: idUser
        };

        try {
            const response = await axios.post('/agenteLibre', postData);
            console.log(response.data);

        } catch (error) {
            console.error('Hubo un error al enviar la petición:', error);
        }
    }

    async callApiAgenteLibre() {
        const idusaurio = this.props.id_user;
        const postData = {
            idAgente: 0,
            idUser: idusaurio
        };

        try {
            const response = await axios.post('/agenteLibre', postData);
            console.log(response.data);

        } catch (error) {
            console.error('Hubo un error al enviar la petición:', error);
        }
    }

    selectChat = (e) => {
        for (
            let index = 0;
            index < e.currentTarget.parentNode.children.length;
            index++
        ) {
            e.currentTarget.parentNode.children[index].classList.remove("active");
        }
        e.currentTarget.classList.add("active");
        const idUser = this.props.id_user;
        const numero = this.props.numero;
        const botestado = this.state.botestado;
        const nameclient = this.props.name;
        const linea = this.props.linea;
        const idAgnt = localStorage.getItem('idAgente');
        const nameAgnt = localStorage.getItem('nombreUsuario');
        const idlinea = this.props.id_linea
        const idOdoo=  this.props.id_odoo

        // const seen = this.props.visto;
        console.log("---PASO1", idUser, numero, botestado, nameclient, linea, idOdoo);
        this.props.onSelectChat(idUser, numero, botestado, nameclient, idlinea, idOdoo, linea); // Llama a la función onSelectChat
        this.seenApi(idUser, idAgnt, nameAgnt);

        if (this.props.quientienchat === 0) {
            this.asignarcliente(idUser, idAgnt);
        }
    };

    componentDidUpdate(prevProps) {
        if (
            prevProps.status !== this.props.status ||
            prevProps.name !== this.props.name
        ) {
            this.setState({ botestado: this.props.status });
            const idUser = this.props.id_user;
            const numero = this.props.numero;
            const botestado = this.props.status;
            const nameclient = this.props.name;

            console.log(idUser, numero, botestado, nameclient);
            this.props.onSelectChat(idUser, numero, botestado, nameclient);
        }
    }

    render() {
        const linea = this.props.linea;
        const dtosulmomsj = new Date(this.props.ultimomsj);
        const gmtDate = new Date(this.props.fecha);
        const diffMillis = new Date() - gmtDate;
        const diffInSeconds = Math.floor(diffMillis / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const isSameDate = dtosulmomsj.getTime() === gmtDate.getTime();
        const diihorasfin = isSameDate && diffInMinutes >= 5;
        const agia = this.props.quientienchat
        // Aquí es donde implementamos la lógica para la llamada a la API
        if (diihorasfin && !this.state.apiCalled) {
            this.callApiAgenteLibre();
            this.setState({ apiCalled: true });
        }

        const isOver23Hours = diffInHours > 23;
        const isOver48Hours = diffInHours > 48;
        const notSeen = this.props.visto !== 'seen';
        return (
            <div
                className={`chatlist ${agia === 0 ? 'chatlist-background-green' : ''} ${isOver23Hours && !isOver48Hours ? 'chatlist-background-locked' : ''}`}
                onClick={this.selectChat}
            >


                <div className="contenedor-circular">
                    <i className="fas fa-user icono-usuario"></i>

                    {
                        this.props.redsocial === 'WA' && (
                            <i className={`fab fa-whatsapp notificacion ${notSeen ? 'color-rojo' : 'color-gris'}`}></i>
                        )
                    }

                    {
                        this.props.redsocial === 'FB' && (
                            <i className={`fab fa-facebook-messenger notificacion ${notSeen ? 'color-rojo' : 'color-gris'}`}></i>

                        )
                    }

                    {
                        this.props.redsocial === 'IG' && (
                            <i className={`fab fa-instagram notificacion ${notSeen ? 'color-rojo' : 'color-gris'}`}></i>

                        )
                    }
                    {
                        this.props.redsocial === 'WEB' && (
                            <i className={`fab fa-shopify notificacion ${notSeen ? 'color-rojo' : 'color-gris'}`}></i>

                        )
                    }

                </div>

                <div className="dtoclilist">
                    <p >  {this.props.name} </p>
                    <span >{linea}</span>

                </div>
                <div className="contenedor-centrado">
                    {isOver23Hours && !isOver48Hours ? (
                        <i className="cdando fa fa-lock" aria-hidden="true"></i>
                    ) : (
                        <i className="cdando fa fa-unlock-alt" aria-hidden="true"></i>
                    )}

                    {notSeen ? (
                        <i className="noticircle fas fa-circle" aria-hidden="true"></i>
                    ) : null}

                </div>
            </div>
        );
    }
}
