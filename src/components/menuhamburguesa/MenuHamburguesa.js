import React, { useState } from 'react';
import './menuHamburguesastyle.css'; // Asegúrate de actualizar este archivo con el nombre correcto para los estilos

const MenuHamburguesa = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="menu-hamburguesa-container">
            <div className="hamburger" onClick={toggleMenu}>
                ☰
            </div>
            <div className="logo">
                LOGO
            </div>
            {isOpen && (
                <div className="menu-list">
                    <ul>
                        <li>Inicio</li>
                        <li>Servicios</li>
                        <li>Contacto</li>
                        {/* Agrega más elementos de lista según sea necesario */}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MenuHamburguesa;
