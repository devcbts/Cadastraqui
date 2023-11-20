import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import VerCartao from './verCartao.js'; // Certifique-se de que o nome está correto e é exportável
import { api } from '../../../services/axios.js';

export default function CartaoCredito({id}) {
    const [creditCardsInstances, setCreditCardsInstances] = useState([]);
    const [selectedCreditCard, setSelectedCreditCard] = useState(null);
    const [mostrarCadastro, setMostrarCadastro] = useState(false);

    useEffect(() => {
        async function pegarCartoes() {
            const token = localStorage.getItem('token');
            try {
                const response = await api.get(`/candidates/expenses/credit-card/${id}`, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    }
                });
                setCreditCardsInstances(response.data.creditCards.map(card => ({
                    value: card.id,
                    label: card.familyMemberName,
                    card: card
                })));
                if (response.data.creditCards.length > 0) {
                    setSelectedCreditCard(response.data.creditCards[0]);
                }
            } catch (err) {
                alert(err);
            }
        }
        pegarCartoes();
    }, [mostrarCadastro]);

    const handleSelectChange = selectedOption => {
        setSelectedCreditCard(selectedOption.card);
    };

    const toggleCadastro = () => {
        setMostrarCadastro(!mostrarCadastro);
    };

    return (
        <div>
            {creditCardsInstances && (
                <Select
                    options={creditCardsInstances}
                    onChange={handleSelectChange}
                    getOptionValue={option => option.value}
                    getOptionLabel={option => option.label}
                />
            )}
            
                {selectedCreditCard && <VerCartao formData={selectedCreditCard} id={id}/>}
            

            
        </div>
    );
}
