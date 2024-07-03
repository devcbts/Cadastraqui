import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; 
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss'; 

export default function Declaration_ChildSupportDetails({ onBack, onNext }) {
    const [declarationData, setDeclarationData] = useState(null);
    const [numberOfChildren, setNumberOfChildren] = useState(0);
    const [childrenData, setChildrenData] = useState([]);
    const [isSaveDisabled, setIsSaveDisabled] = useState(true);

    useEffect(() => {
        const savedData = localStorage.getItem('declarationData');
        if (savedData) {
            setDeclarationData(JSON.parse(savedData));
        }
        const savedChildrenData = localStorage.getItem('childrenData');
        if (savedChildrenData) {
            setChildrenData(JSON.parse(savedChildrenData));
        }
    }, []);

    useEffect(() => {
        const isFormValid = childrenData.length === numberOfChildren && childrenData.every(child => 
            child.childName && child.payerName && child.payerCpf && child.amount
        );
        setIsSaveDisabled(!isFormValid);
    }, [numberOfChildren, childrenData]);

    const handleChildrenDataChange = (index, field, value) => {
        const newChildrenData = [...childrenData];
        if (!newChildrenData[index]) {
            newChildrenData[index] = {};
        }
        newChildrenData[index][field] = value;
        setChildrenData(newChildrenData);
        localStorage.setItem('childrenData', JSON.stringify(newChildrenData));
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>RECEBIMENTO OU AUSÊNCIA DE RECEBIMENTO DE PENSÃO ALIMENTÍCIA</h2>
            <h3>{declarationData.fullName}</h3>
            <div className={commonStyles.declarationContent}>
                <label htmlFor="numberOfParents">C - De quantos?</label>
                <input
                    type="number"
                    id="numberOfParents"
                    name="numberOfParents"
                    placeholder="2"
                    value={numberOfChildren}
                    onChange={(e) => setNumberOfChildren(Number(e.target.value))}
                    className={commonStyles.inputField}
                />
            </div>
            {Array.from({ length: numberOfChildren }, (_, index) => (
                <div key={index} className={commonStyles.childForm}>
                    <h4>Filho {index + 1}</h4>
                    <div className={commonStyles.fieldGroup}>
                        <label htmlFor={`childName_${index}`}>Selecione todos que recebem pensão</label>
                        <input
                            type="text"
                            id={`childName_${index}`}
                            name={`childName_${index}`}
                            placeholder="Nome do Filho"
                            className={commonStyles.inputField}
                            onChange={(e) => handleChildrenDataChange(index, 'childName', e.target.value)}
                        />
                    </div>
                    <div className={commonStyles.fieldGroup}>
                        <label htmlFor={`payerName_${index}`}>Nome do Pagador da Pensão</label>
                        <input
                            type="text"
                            id={`payerName_${index}`}
                            name={`payerName_${index}`}
                            placeholder="Nome do Pagador"
                            className={commonStyles.inputField}
                            onChange={(e) => handleChildrenDataChange(index, 'payerName', e.target.value)}
                        />
                    </div>
                    <div className={commonStyles.fieldGroup}>
                        <label htmlFor={`payerCpf_${index}`}>CPF do Pagador da Pensão</label>
                        <input
                            type="text"
                            id={`payerCpf_${index}`}
                            name={`payerCpf_${index}`}
                            placeholder="CPF do Pagador"
                            className={commonStyles.inputField}
                            onChange={(e) => handleChildrenDataChange(index, 'payerCpf', e.target.value)}
                        />
                    </div>
                    <div className={commonStyles.fieldGroup}>
                        <label htmlFor={`amount_${index}`}>Valor</label>
                        <input
                            type="number"
                            id={`amount_${index}`}
                            name={`amount_${index}`}
                            placeholder="Valor da Pensão"
                            className={commonStyles.inputField}
                            onChange={(e) => handleChildrenDataChange(index, 'amount', e.target.value)}
                        />
                    </div>
                </div>
            ))}
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={onNext}
                    disabled={isSaveDisabled}
                    style={{
                        borderColor: isSaveDisabled ? '#ccc' : '#1F4B73',
                        cursor: isSaveDisabled ? 'not-allowed' : 'pointer',
                        opacity: isSaveDisabled ? 0.6 : 1
                    }}
                />
                <ButtonBase
                    onClick={onNext}
                    disabled={isSaveDisabled}
                    style={{
                        borderColor: isSaveDisabled ? '#ccc' : '#1F4B73',
                        cursor: isSaveDisabled ? 'not-allowed' : 'pointer',
                        opacity: isSaveDisabled ? 0.6 : 1
                    }}
                >
                    <Arrow width="40px" />
                </ButtonBase>
            </div>
        </div>
    );
}
