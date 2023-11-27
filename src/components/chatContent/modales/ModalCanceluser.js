import React, { useState } from 'react';

function ModalCancelUser({ isOpen, onClose }) {

    const [selectedOption, setSelectedOption] = useState('');

    const handleChange = (e) => {
        setSelectedOption(e.target.value);
    };
    return (


        <div className="modalOverlaysuge">
            <div className="modalContentsuge">
                <div className='headermodals'>
                    <p>Cierre de Cliente</p>
                    <button onClick={onClose}><i className="fas fa-times"></i></button>
                </div>
                <div className='contentBloqueo'>
                    <p>Selecciona Motivo de cierre</p>
                    <select className='textarea' value={selectedOption} onChange={handleChange}>
                        <option value="">Select an option</option>
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                </div>


                <div className='butoncont'>

                    <button className='btngenerico'>Generar Cierre</button>
                </div>
            </div>
        </div>

    );
};


export default ModalCancelUser;
