import React, { useEffect, useState } from 'react';
import VerVeiculo from './verVeiculo.js';
import Select from 'react-select';
import { api } from '../../services/axios.js';
import CadastroVeiculo from './cadastroVeiculo.js'
import LoadingCadastroCandidato from '../Loading/LoadingCadastroCandidato.js';

export default function Veiculos({candidato}) {
    const [veiculos, setVeiculos] = useState([]);
    const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);
    const [mostrarCadastro, setMostrarCadastro] = useState(false);


    const toggleCadastro = () => {
        setMostrarCadastro(!mostrarCadastro);
    };

    const [len, setLen] = useState(2);
    useEffect(() => {
        async function pegarVeiculos() {
            const token = localStorage.getItem('token');
            try {
                const response = await api.get("/candidates/vehicle-info", {
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
                setLen(response.data.vehicleInfoResults.length)
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

            {mostrarCadastro && <CadastroVeiculo candidate={candidato}/>}

            {veiculos.length > 0 && (
                <DropdownVeiculos
                    veiculos={veiculos}
                    onSelect={selecionarVeiculo}
                />
            )}
            {!mostrarCadastro && veiculoSelecionado ? (
                <VerVeiculo formData={veiculoSelecionado} candidate={candidato}/>
            ) : <div>
                
            {len > 0 &&
                <LoadingCadastroCandidato/>}
                </div>}
            <button onClick={toggleCadastro}>
                {mostrarCadastro ? 'Fechar Cadastro' : 'Adicionar Veiculo'}
            </button>
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
