import React from 'react';
import { UilExclamationOctagon } from '@iconscout/react-unicons';
import './errorPopup.css'; // Certifique-se de criar um arquivo de estilos com este nome

const ErrorPopup = ({ message, onClose }) => {
  return (
    <div className="error-popup-overlay">
      <div className="error-popup">
        <div className='error-popup-body'>

        <div className="error-popup-header">
          <UilExclamationOctagon size="30" className="error-popup-icon" />
          <h2 id="error-popup-title">Erro!</h2>
        </div>
        <p className="error-popup-message">{message}</p>
        <button onClick={onClose} className="error-popup-close-btn">Fechar</button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPopup;
