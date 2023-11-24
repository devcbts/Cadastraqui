import React, { useState } from 'react';
import Select from 'react-select';
import DespesasMensais from './DespesasMensais.js';
import Emprestimos from './Emprestimos.js';
import Financiamento from './Financiamento.js'; // Assumindo que você tem um componente para isso
import CartaoCredito from './CartaoCredito.js'; // Assumindo que você tem um componente para isso
export default function DespesasTotaisAssistente({id}) {
    const [selectedDespesa, setSelectedDespesa] = useState('');

    const despesasOptions = [
        { value: 'despesasMensais', label: 'Despesas Mensais' },
        { value: 'emprestimos', label: 'Empréstimos' },
        { value: 'financiamento', label: 'Financiamento' },
        { value: 'cartaoCredito', label: 'Cartão de Crédito' },
    ];

    const handleChange = selectedOption => {
        setSelectedDespesa(selectedOption.value);
    };

    return (
        <div style={{marginBottom: "200px"}}>
            <h2>Selecione o tipo de Despesas</h2>
            <Select
                options={despesasOptions}
                onChange={handleChange}
                placeholder="Selecionar tipo de despesa"
            />

            {selectedDespesa === 'despesasMensais' && <DespesasMensais id={id} />}
            {selectedDespesa === 'emprestimos' && <Emprestimos id={id}/>}
            {selectedDespesa === 'financiamento' && <Financiamento id={id}/>}
            {selectedDespesa === 'cartaoCredito' && <CartaoCredito id={id}/>}
        </div>
    );
}
