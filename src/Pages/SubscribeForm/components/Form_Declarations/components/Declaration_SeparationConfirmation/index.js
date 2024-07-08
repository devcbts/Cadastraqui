import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss';
import { useRecoilState } from 'recoil';
import declarationAtom from '../../atoms/declarationAtom';

export default function Declaration_SeparationConfirmation({ onBack, onNext, userId }) {
    const { auth } = useAuth();
    const [confirmation, setConfirmation] = useState(null);
    const [separationDetails, setSeparationDetails] = useState(null);
    const [addressDetails, setAddressDetails] = useState(null);
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);
    const [error, setError] = useState('');

    useEffect(() => {
        if (declarationData.separationDetails) {
            setSeparationDetails(declarationData.separationDetails)
            setAddressDetails(declarationData.separationDetails.addressDetails ?? null)
        }
        // const savedSeparationDetails = localStorage.getItem('separationDetails');
        // if (savedSeparationDetails) {
        //     setSeparationDetails(JSON.parse(savedSeparationDetails));
        // }

        // const savedAddressDetails = localStorage.getItem('addressDetails');
        // if (savedAddressDetails) {
        //     setAddressDetails(JSON.parse(savedAddressDetails));
        // }

        // const savedDeclarationData = localStorage.getItem('declarationData');
        // if (savedDeclarationData) {
        //     setDeclarationData(JSON.parse(savedDeclarationData));
        // }
    }, []);

    const handleRegisterDeclaration = async () => {
        if (confirmation === false) {
            setError('Por favor, verifique os dados de cadastro.');
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

        if (!separationDetails || !addressDetails || !declarationData) {
            console.error('Os dados da separação, endereço ou declaração não estão disponíveis');
            return;
        }

        const text = `
            Me separei de ${separationDetails.personName}, inscrito(a) no CPF nº ${separationDetails.personCpf}, desde ${separationDetails.separationDate}.
            Meu(minha) ex-companheiro(a) reside na ${addressDetails.address}, nº ${addressDetails.number}, complemento ${addressDetails.complement}, CEP: ${addressDetails.cep}, bairro ${addressDetails.neighborhood}, cidade ${addressDetails.city}, UF ${addressDetails.uf}.
            Até o presente momento não formalizei o encerramento de nossa relação por meio de divórcio.
        `;

        const payload = {
            declarationExists: confirmation,
            ...(confirmation && { text })
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/candidates/declaration/NoAddressProof/${declarationData.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Erro: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Declaração registrada:', data);

            onNext(confirmation);
        } catch (error) {
            console.error('Erro ao registrar a declaração:', error);
        }
    };

    if (!separationDetails || !addressDetails || !declarationData) {
        return <p>Carregando...</p>;
    }

    const isSaveDisabled = confirmation === null;

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE SEPARAÇÃO DE FATO (NÃO JUDICIAL)</h2>
            <h3>{declarationData.name}</h3>
            <div className={commonStyles.declarationContent}>
                <p>
                    Me separei de <strong>{separationDetails.personName}</strong>, inscrito(a) no CPF nº <strong>{separationDetails.personCpf}</strong>, desde <strong>{separationDetails.separationDate}</strong>.
                    Meu(minha) ex-companheiro(a) reside na <strong>{addressDetails.address}</strong>, nº <strong>{addressDetails.number}</strong>, complemento <strong>{addressDetails.complement}</strong>, CEP: <strong>{addressDetails.cep}</strong>, bairro <strong>{addressDetails.neighborhood}</strong>, cidade <strong>{addressDetails.city}</strong>, UF <strong>{addressDetails.uf}</strong>.
                    Até o presente momento não formalizei o encerramento de nossa relação por meio de divórcio.
                </p>
                <p>Confirma a declaração?</p>
                <div className={commonStyles.radioGroup}>
                    <label>
                        <input
                            type="radio"
                            name="confirmation"
                            value="sim"
                            checked={confirmation}
                            onChange={() => setConfirmation(true)}
                        /> Sim
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="confirmation"
                            value="nao"
                            checked={confirmation === false}
                            onChange={() => setConfirmation(false)}
                        /> Não
                    </label>
                </div>
                {error && <div className={commonStyles.error} style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
            </div>
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleRegisterDeclaration}
                    disabled={isSaveDisabled}
                    style={{
                        borderColor: isSaveDisabled ? '#ccc' : '#1F4B73',
                        cursor: isSaveDisabled ? 'not-allowed' : 'pointer',
                        opacity: isSaveDisabled ? 0.6 : 1
                    }}
                />
            </div>
        </div>
    );
}
