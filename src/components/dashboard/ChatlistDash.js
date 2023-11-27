import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class ChatListRecient extends Component {
    state = {
        botestado: this.props.status
    };

    getUrlByTypeChat = () => {
        const { typeChat } = this.props;
        
        switch(typeChat) {
            case 'WA':
                return "/ChatWathsapp";
            case 'FB':
                return "/ChatFacebook";
            case 'GB':
                return "/ChatInstgram";
            case 'WEB':
              return "/ChatWeb";

            default:
                return "/";
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
        const typechat = this.props.typeChat;

        console.log("Primerpasoprr", idUser, numero, botestado, nameclient, linea, typechat);
        this.props.onSelectChat(idUser, numero, botestado, nameclient, typechat);
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
        return (
            <Link className="chat-list-item" to={this.getUrlByTypeChat()}>
                <div className="chat-list-item-name">
                    <p className="namelist">{this.props.numero}</p>
                </div>
                <div className="chat-list-item-details">
                    {this.props.typeChat === 'WA' && <i className="fab fa-whatsapp fa-lg" aria-hidden="true"></i>}
                    {this.props.typeChat === 'FB' && <i className="fab fa-facebook-messenger fa-lg" aria-hidden="true"></i>}
                    {this.props.typeChat === 'IG' && <i className="fab fa-instagram fa-lg" aria-hidden="true"></i>}
                    {this.props.typeChat === 'WEB' && <i className="fab fa-shopify fa-lg" aria-hidden="true"></i>}
                </div>
            </Link>
        );
    }
}
