import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import VerEmprestimo from './verEmprestimos.js'; // Certifique-se de que o nome está correto e é exportável
import { api } from '../../../services/axios.js';
import LoadingCadastroCandidato from '../../Loading/LoadingCadastroCandidato.js';

export default function Emprestimos({id, candidate}) {
    const [loansInstances, setLoansInstances] = useState([]);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [mostrarCadastro, setMostrarCadastro] = useState(false);

    useEffect(() => {
        async function pegarDespesas() {
            const token = localStorage.getItem('token');
            try {
                const response = await api.get(`/candidates/expenses/loan/${id}`, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    }
                });
                setLoansInstances(response.data.loans.map(loan => ({
                    value: loan.id,
                    label: loan.familyMemberName,
                    loan: loan
                })));
                if (response.data.loans.length > 0) {
                    setSelectedLoan(response.data.loans[0]);
                }
            } catch (err) {
                alert(err);
            }
        }
        pegarDespesas();
    }, [mostrarCadastro]);

    const handleSelectChange = selectedOption => {
        setSelectedLoan(selectedOption.loan);
    };

    const toggleCadastro = () => {
        setMostrarCadastro(!mostrarCadastro);
    };

    return (
        <div>
            {loansInstances && (
                <Select
                    options={loansInstances}
                    onChange={handleSelectChange}
                    getOptionValue={option => option.value}
                    getOptionLabel={option => option.label}
                />
            )}
            {
                selectedLoan ? <VerEmprestimo candidate={candidate} formData={selectedLoan} id={id}  />
            : <LoadingCadastroCandidato/>}

          
        </div>
    );
}
