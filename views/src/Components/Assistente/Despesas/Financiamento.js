import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import VerFinanciamento from './verFinanciamento';
import { api } from '../../../services/axios';
import LoadingCadastroCandidato from '../../Loading/LoadingCadastroCandidato';

export default function Financiamento({candidate, id}) {
    const [financingsInstances, setFinancingsInstances] = useState([]);
    const [selectedFinancing, setSelectedFinancing] = useState(null);
    const [mostrarCadastro, setMostrarCadastro] = useState(false);

    useEffect(() => {
        async function pegarFinanciamentos() {
            const token = localStorage.getItem('token');
            try {
                const response = await api.get(`/candidates/expenses/financing/${id}`, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    }
                });
                console.log('====================================');
                console.log(response.data.financings);
                console.log('====================================');
                setFinancingsInstances(response.data.financings.map(financing => ({
                    value: financing.id,
                    label: financing.familyMemberName,
                    financing: financing
                })));
                if (response.data.financings.length > 0) {
                    setSelectedFinancing(response.data.financings[0]);
                }
            } catch (err) {
                alert(err);
            }
        }
        pegarFinanciamentos();
    }, [mostrarCadastro]);

    const handleSelectChange = selectedOption => {
        setSelectedFinancing(selectedOption.financing);
    };

    const toggleCadastro = () => {
        setMostrarCadastro(!mostrarCadastro);
    };

    return (
        <div>
            {financingsInstances && (
                <Select
                    options={financingsInstances}
                    onChange={handleSelectChange}
                    getOptionValue={option => option.value}
                    getOptionLabel={option => option.label}
                />
            )}
            {
                selectedFinancing ? <VerFinanciamento candidate={candidate} formData={selectedFinancing} id={id} />
                : <LoadingCadastroCandidato/>
            }

          
        </div>
    );
}
