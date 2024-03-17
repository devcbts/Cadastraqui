import React from 'react';

// Definindo o componente InputCheckbox
const InputCheckbox = ({ name, value, onChange, id , disabled}) => {
  return (
    <p className='onoff'>
      <input
        type="checkbox"
        name={name}
        checked={value} // Utilizamos checked ao invés de value para checkboxes
        onChange={onChange}
        id={id}
        className="survey-control" // Classe padrão, pode ser substituída/extendida por className
        disabled={disabled}
      />
      <label htmlFor={id} id='yesno'></label>
    </p>
  );
};

export default InputCheckbox;