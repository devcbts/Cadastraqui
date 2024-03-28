import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import DespesasMensais from './DespesasMensais.js';
import Emprestimos from './Emprestimos.js';
import Financiamento from './Financiamento.js'; // Assumindo que você tem um componente para isso
import CartaoCredito from './CartaoCredito.js'; // Assumindo que você tem um componente para isso
import { api } from '../../../services/axios.js';
export default function DespesasTotaisAssistente({ id }) {
    const [registerInfo, setRegisterInfo] = useState(null);

    useEffect(() => {
       
        async function pegarBasicInfo() {
            const token = localStorage.getItem('token');

            try {

                const response = await api.get(`/candidates/basic-info/${id}`, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    }
                })


                console.log(response.data)
                const dadosBasico = response.data.candidate


                setRegisterInfo(dadosBasico)

                console.log(dadosBasico)

            }
            catch (err) {
                alert(err)
            }
        } if (id) {
            pegarBasicInfo()
            
        }
    }, []);
    
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
        <div style={{ marginBottom: "200px" }}>
            <h2>Selecione o tipo de Despesas</h2>
            <Select
                options={despesasOptions}
                onChange={handleChange}
                placeholder="Selecionar tipo de despesa"
            />

            {registerInfo && selectedDespesa === 'despesasMensais' && <DespesasMensais id={id} />}
            {registerInfo && selectedDespesa === 'emprestimos' && <Emprestimos candidate={registerInfo} id={id} />}
            {registerInfo && selectedDespesa === 'financiamento' && <Financiamento candidate={registerInfo} id={id} />}
            {registerInfo && selectedDespesa === 'cartaoCredito' && <CartaoCredito candidate={registerInfo} id={id} />}
        </div>
    );
}
