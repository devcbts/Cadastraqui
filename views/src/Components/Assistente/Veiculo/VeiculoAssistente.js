import React, { useEffect, useState } from 'react';
import VerVeiculoAssistente from './verVeiculoAssistente.js';
import Select from 'react-select';
import { api } from '../../../services/axios.js';
import LoadingCadastroCandidato from '../../Loading/LoadingCadastroCandidato.js';

export default function VeiculosAssistente({id}) {
    const [veiculos, setVeiculos] = useState([]);
    const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);
    const [mostrarCadastro, setMostrarCadastro] = useState(false);


    const toggleCadastro = () => {
        setMostrarCadastro(!mostrarCadastro);
    };
    useEffect(() => {
        async function pegarVeiculos() {
            const token = localStorage.getItem('token');
            try {
                const response = await api.get(`/candidates/vehicle-info/${id}`, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    }
                });
                setVeiculos(response.data.vehicleInfoResults);
                console.log('====================================');
                console.log(response.data.vehicleInfoResults[0]);
                console.log('====================================');
                if (response.data.vehicleInfoResults.length > 0) {
                    setVeiculoSelecionado(response.data.vehicleInfoResults[0]);
                }
            } catch (err) {
                alert(err);
            }
        }
        pegarVeiculos();
    }, []);

    const selecionarVeiculo = (veiculo) => {
        setVeiculoSelecionado(veiculo);
    };

    return (
        <div>

           

            {veiculos.length > 0 && (
                <DropdownVeiculos
                    veiculos={veiculos}
                    onSelect={selecionarVeiculo}
                />
            )}
            {!mostrarCadastro && veiculoSelecionado ? 
                <VerVeiculoAssistente formData={veiculoSelecionado} id={id} />
                : <LoadingCadastroCandidato/>
            }
            
        </div>
    );
}

const DropdownVeiculos = ({ veiculos, onSelect }) => {
    const handleChange = (selectedOption) => {
        onSelect(selectedOption.value);
        console.log('====================================');
        console.log(selectedOption.value);
        console.log('====================================');
    };

    const options = veiculos.map(veiculo => ({
        value: veiculo,
        label: `${veiculo.modelAndBrand} (${veiculo.ownerNames.join(', ')})`
    }));

    return (
        <Select
            options={options}
            onChange={handleChange}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value.id}
        />
    );
};
