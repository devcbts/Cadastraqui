import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import { useRecoilState } from 'recoil';
import declarationAtom from '../../atoms/declarationAtom';
import { formatCPF } from 'utils/format-cpf';
import useControlForm from 'hooks/useControlForm';
import separationSchema from './separation-schema';
import FormCheckbox from 'Components/FormCheckbox';
import InputForm from 'Components/InputForm';
import candidateService from 'services/candidate/candidateService';

export default function Declaration_SeparationStatus({ onBack, onNext }) {
    // const [confirmation, setConfirmation] = useState(null);
    // const [personDetails, setPersonDetails] = useState({
    //     personName: '',
    //     personCpf: '',
    //     separationDate: '',
    //     knowsCurrentAddress: null,
    // });
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);
    const { control, watch, formState: { isValid, errors }, trigger, getValues, resetField } = useControlForm({
        schema: separationSchema,
        defaultValues: {
            confirmation: null,
            personDetails: {
                personName: '',
                personCpf: '',
                separationDate: '',
                knowsCurrentAddress: null,
            }
        },
        initialData: declarationData?.separationDetails
    })
    const confirmation = watch("confirmation")
    const personDetails = watch("personDetails")
    // useEffect(() => {
    //     if (declarationData.separationDetails) {
    //         setPersonDetails(declarationData.separationDetails.personDetails)
    //         setConfirmation(declarationData.separationDetails.confirmation)
    //     }

    // }, []);

    const handleSave = () => {
        console.log(errors)
        if (!isValid) {
            trigger()
            return
        }
        setDeclarationData((prev) => ({
            ...prev,
            separationDetails: getValues()
        }))
        if (confirmation !== null) {
            localStorage.setItem('separationDetails', JSON.stringify(personDetails));
            if (!confirmation) {
                candidateService.deleteDeclaration({ userId: declarationData?.id, type: 'NoAddressProof' }).catch(err => { })
                onNext(null); // Navega para INCOME_TAX_EXEMPTION
            } else {
                onNext(personDetails.knowsCurrentAddress);
            }
        }
    };

    // const handleInputChange = (e) => {
    // const { name, value } = e.target;
    // setPersonDetails((prevDetails) => ({
    // ...prevDetails,
    // [name]: value,
    // }));
    // };

    // const isSaveDisabled = () => {
    //     if (confirmation) {
    //         return !personDetails.personName || !personDetails.personCpf || !personDetails.separationDate || personDetails.knowsCurrentAddress === null;
    //     }
    //     return confirmation === null;
    // };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h1>
            <h2>DECLARAÇÃO DE SEPARAÇÃO DE FATO (NÃO JUDICIAL)</h2>
            <h3>{declarationData.name}</h3>
            <FormCheckbox
                control={control}
                label={'você é separado de fato, porém ainda não formalizou o encerramento por meio do divórcio?'}
                name="confirmation"
                value={confirmation}
            />

            {confirmation && (
                <div className={commonStyles.additionalFields}>
                    <InputForm label={'Nome da pessoa'} name={"personDetails.personName"} control={control} />
                    <InputForm label={'CPF da pessoa'} name={"personDetails.personCpf"} control={control} transform={(e) => formatCPF(e.target.value)} />
                    <InputForm label={'Data da separação'} name={"personDetails.separationDate"} control={control} type="date" />
                    {/* <div className={commonStyles.inputGroup}>
                        <label>Nome da pessoa</label>
                        <input
                            type="text"
                            name="personName"
                            value={personDetails.personName}
                            onChange={handleInputChange}
                            placeholder="Fulana de tal"
                        />
                    </div> */}
                    {/* <div className={commonStyles.inputGroup}>
                        <label>CPF da pessoa</label>
                        <input
                            type="text"
                            name="personCpf"
                            value={personDetails.personCpf}
                            onChange={(e) => setPersonDetails((prev) => ({ ...prev, personCpf: formatCPF(e.target.value) }))}
                            placeholder="652.954.652-78"
                        />
                    </div> */}
                    {/* <div className={commonStyles.inputGroup}>
                        <label>Data da separação</label>
                        <input
                            type="date"
                            name="separationDate"
                            value={personDetails.separationDate}
                            onChange={handleInputChange}
                        />
                    </div> */}
                    <FormCheckbox
                        control={control}
                        label={'Sabe onde essa pessoa mora atualmente?'}
                        name="personDetails.knowsCurrentAddress"
                        value={watch("personDetails.knowsCurrentAddress")}
                    />
                    {/* <p>Sabe onde essa pessoa mora atualmente?</p>
                    <div className={commonStyles.radioGroup}>
                        <label>
                            <input type="radio" name="knowsCurrentAddress" value="sim" onChange={() => setPersonDetails(prev => ({ ...prev, knowsCurrentAddress: true }))} checked={personDetails.knowsCurrentAddress} /> Sim
                        </label>
                        <label>
                            <input type="radio" name="knowsCurrentAddress" value="nao" onChange={() => setPersonDetails(prev => ({ ...prev, knowsCurrentAddress: false }))} checked={personDetails.knowsCurrentAddress === false} /> Não
                        </label>
                    </div> */}
                </div>
            )}
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleSave}

                />
            </div>
        </div>
    );
}
