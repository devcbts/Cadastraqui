import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import { useRecoilState } from 'recoil';
import declarationAtom from '../../atoms/declarationAtom';
import { formatCPF } from 'utils/format-cpf';

export default function Declaration_SeparationStatus({ onBack, onNext }) {
    const [confirmation, setConfirmation] = useState(null);
    const [personDetails, setPersonDetails] = useState({
        personName: '',
        personCpf: '',
        separationDate: '',
        knowsCurrentAddress: null,
    });
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);

    useEffect(() => {
        if (declarationData.separationDetails) {
            setPersonDetails(declarationData.separationDetails.personDetails)
            setConfirmation(declarationData.separationDetails.confirmation)
        }

    }, []);

    const handleSave = () => {
        setDeclarationData((prev) => ({
            ...prev,
            separationDetails: {
                confirmation, personDetails: confirmation ? personDetails : {
                    personName: '',
                    personCpf: '',
                    separationDate: '',
                    knowsCurrentAddress: null,
                }
            }
        }))
        if (confirmation !== null) {
            localStorage.setItem('separationDetails', JSON.stringify(personDetails));
            if (!confirmation) {
                onNext(false); // Navega para INCOME_TAX_EXEMPTION
            } else {
                onNext(confirmation && personDetails.knowsCurrentAddress);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPersonDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const isSaveDisabled = () => {
        if (confirmation) {
            return !personDetails.personName || !personDetails.personCpf || !personDetails.separationDate || personDetails.knowsCurrentAddress === null;
        }
        return confirmation === null;
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE SEPARAÇÃO DE FATO (NÃO JUDICIAL)</h2>
            <h3>{declarationData.name}</h3>
            <p>Você é separado de fato, porém ainda não formalizou o encerramento por meio do divórcio?</p>
            <div className={commonStyles.radioGroup}>
                <label>
                    <input type="radio" name="confirmation" value="sim" onChange={() => setConfirmation(true)} checked={confirmation} /> Sim
                </label>
                <label>
                    <input type="radio" name="confirmation" value="nao" onChange={() => setConfirmation(false)} checked={confirmation === false} /> Não
                </label>
            </div>
            {confirmation && (
                <div className={commonStyles.additionalFields}>
                    <div className={commonStyles.inputGroup}>
                        <label>Nome da pessoa</label>
                        <input
                            type="text"
                            name="personName"
                            value={personDetails.personName}
                            onChange={handleInputChange}
                            placeholder="Fulana de tal"
                        />
                    </div>
                    <div className={commonStyles.inputGroup}>
                        <label>CPF da pessoa</label>
                        <input
                            type="text"
                            name="personCpf"
                            value={personDetails.personCpf}
                            onChange={(e) => setPersonDetails((prev) => ({ ...prev, personCpf: formatCPF(e.target.value) }))}
                            placeholder="652.954.652-78"
                        />
                    </div>
                    <div className={commonStyles.inputGroup}>
                        <label>Data da separação</label>
                        <input
                            type="date"
                            name="separationDate"
                            value={personDetails.separationDate}
                            onChange={handleInputChange}
                        />
                    </div>
                    <p>Sabe onde essa pessoa mora atualmente?</p>
                    <div className={commonStyles.radioGroup}>
                        <label>
                            <input type="radio" name="knowsCurrentAddress" value="sim" onChange={() => setPersonDetails(prev => ({ ...prev, knowsCurrentAddress: true }))} checked={personDetails.knowsCurrentAddress} /> Sim
                        </label>
                        <label>
                            <input type="radio" name="knowsCurrentAddress" value="nao" onChange={() => setPersonDetails(prev => ({ ...prev, knowsCurrentAddress: false }))} checked={personDetails.knowsCurrentAddress === false} /> Não
                        </label>
                    </div>
                </div>
            )}
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleSave}
                    disabled={isSaveDisabled()}
                    style={{
                        borderColor: isSaveDisabled() ? '#ccc' : '#1F4B73',
                        cursor: isSaveDisabled() ? 'not-allowed' : 'pointer',
                        opacity: isSaveDisabled() ? 0.6 : 1
                    }}
                />
            </div>
        </div>
    );
}
