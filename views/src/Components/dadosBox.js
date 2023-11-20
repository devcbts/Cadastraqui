import React from 'react';
import './dadosBox.css';

function DadosBox({text, value }) {
    return (
        <div className="dados-box">
            <span className="label">{text}</span>
            <span className="value">{value}</span>
        </div>
    );
}

export default DadosBox;