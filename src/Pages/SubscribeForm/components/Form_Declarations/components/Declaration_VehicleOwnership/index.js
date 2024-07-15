import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss';
import { useRecoilState } from 'recoil';
import declarationAtom from '../../atoms/declarationAtom';
import findLabel from 'utils/enums/helpers/findLabel';
import VEHICLE_USAGE from 'utils/enums/vehicle-usage';
import VEHICLE_TYPE from 'utils/enums/vehicle-type';
import candidateService from 'services/candidate/candidateService';

export default function Declaration_VehicleOwnership({ onBack, onNext }) {
    const { auth } = useAuth();
    const [confirmation, setConfirmation] = useState(null);
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);

    // useEffect(() => {
    //     const savedData = localStorage.getItem('declarationData');
    //     if (savedData) {
    //         setDeclarationData(JSON.parse(savedData));
    //     }
    // }, []);

    const handleSave = async () => {
        if (confirmation === false) {
            return;
        }

        if (!auth?.uid) {
            console.error('UID não está definido');
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            console.error('Token não está definido');
            return;
        }

        if (!declarationData) {
            console.error('Os dados da declaração não estão disponíveis');
            return;
        }

        const text = declarationData?.Vehicle?.length === 0 ? `
            Eu, ${declarationData.name}, portador(a) do CPF nº ${declarationData.CPF}, declaro que não possuo veículo(s) registrado(s) em meu nome e nenhum membro do meu grupo familiar possui veículo(s) registrado(s) em seu nome.
        `
            :
            `Declaro que eu ou alguém do meu grupo familiar possui o(s) veículo(s) abaixo:
                ${declarationData.Vehicle.map((vehicle, index) => {
                return `${index + 1}. ${vehicle.modelAndBrand} para fins de ${findLabel(VEHICLE_USAGE, vehicle.usage)} sendo do tipo ${findLabel(VEHICLE_TYPE, vehicle.vehicleType)}`

            })}
            `


        const payload = {
            declarationExists: confirmation,
            ...(confirmation && { text })
        };

        try {
            await candidateService.registerDeclaration({ section: 'Status', id: declarationData.id, data: payload })

            // const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/declaration/Status/${declarationData.id}`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${token}`
            //     },
            //     body: JSON.stringify(payload)
            // });

            // if (!response.ok) {
            //     throw new Error(`Erro: ${response.statusText}`);
            // }

            // const data = await response.json();
            // ;

            // Redireciona para a próxima tela
            onNext(confirmation ? 'familyIncomeChange' : 'overview'); // ou a tela correta para "não"
        } catch (error) {
            console.error('Erro ao registrar a declaração:', error);
        }
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE PROPRIEDADE DE VEÍCULO AUTOMOTOR</h2>
            <h3>{declarationData.name}</h3>
            <p>
                {declarationData?.Vehicle?.length === 0 ?
                    'Não possuo veículo(s) registrado(s) em meu nome e nenhum membro do meu grupo familiar possui veículo(s) registrado(s) em seu nome.'
                    : <>
                        Declaro que eu ou alguém do meu grupo familiar possui o(s) veículo(s) abaixo:
                        {declarationData.Vehicle.map((vehicle, index) => {
                            return <p>
                                {index + 1}. {vehicle.modelAndBrand} para fins de {findLabel(VEHICLE_USAGE, vehicle.usage)} sendo do tipo {findLabel(VEHICLE_TYPE, vehicle.vehicleType)}
                            </p>
                        })}
                    </>
                }
            </p>
            <p>Confirma a declaração?</p>
            <div className={commonStyles.radioGroup}>
                <label>
                    <input
                        type="radio"
                        name="confirmation"
                        value="sim"
                        onChange={() => setConfirmation(true)}
                        checked={confirmation}
                    /> Sim
                </label>
                <label>
                    <input
                        type="radio"
                        name="confirmation"
                        value="nao"
                        onChange={() => setConfirmation(false)}
                        checked={confirmation === false}
                    /> Não
                </label>
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleSave}
                    disabled={confirmation === null}
                    style={{
                        borderColor: confirmation === null ? '#ccc' : '#1F4B73',
                        cursor: confirmation === null ? 'not-allowed' : 'pointer',
                        opacity: confirmation === null ? 0.6 : 1
                    }}
                />
            </div>
        </div>
    );
}
