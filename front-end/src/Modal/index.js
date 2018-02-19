import React from 'react';
import './Modal.css';

const Modal = ({modalStyle, closeClickHandler, header, signInHandler, ...rest}) => {
    return (
        <div id='myModal' className='modal' style={modalStyle}>
            <div className='modal-content'>
                <div className='modal-header bg-gray'>
                    <span className='close' onClick={closeClickHandler}>&times;</span>
                    { header }
                </div>
                <div className='modal-body center-text'>
                    {rest.children}
                </div>
            </div>
        </div>    
    )
}

export default Modal;