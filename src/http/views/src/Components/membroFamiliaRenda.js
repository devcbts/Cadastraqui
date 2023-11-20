import React, { useState } from 'react';
import { CadastroRenda } from './cadastro-renda';

const FamilyMember = ({ member }) => {
  const [showIncomeForm, setShowIncomeForm] = useState(false);

  const toggleIncomeForm = () => {
    setShowIncomeForm(!showIncomeForm);
  };

  return (
    <div>
      <div>
        <h2>{member.fullName}</h2>
        <p>Relação: {member.relationship}</p>
        {/* Outras informações do membro da família aqui */}
      </div>
      <button onClick={toggleIncomeForm}>Registrar Renda</button>
      {showIncomeForm && (
        // Renderize o formulário de registro de renda aqui
        <CadastroRenda member={member} />
      )}
    </div>
  );
};

export default FamilyMember;
