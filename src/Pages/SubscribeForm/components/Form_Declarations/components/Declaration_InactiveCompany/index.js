import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import AddressData from 'Pages/SubscribeForm/components/AddressData';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import candidateService from 'services/candidate/candidateService';
import declarationAtom from '../../atoms/declarationAtom';
import commonStyles from '../../styles.module.scss';
import InputForm from 'Components/InputForm';
import useControlForm from 'hooks/useControlForm';
import { z } from 'zod';
import { formatCNPJ } from 'utils/format-cnpj';

export default function Declaration_InactiveCompany({ onBack, onSave }) {
    const [hasInactiveCompany, setHasInactiveCompany] = useState(null);
    const [companyDetails, setCompanyDetails] = useState({
        socialReason: '',
        CNPJ: '',
        CEP: '',
        address: '',
        neighborhood: '',
        addressNumber: '',
        city: '',
        UF: '',
        complement: '',
    });
    const { control, formState: { isValid }, trigger, getValues } = useControlForm({
        schema: z.object({
            socialReason: z.string().refine((v) => !hasInactiveCompany ? true : v, 'Razão social obrigatória'),
            CNPJ: z.string().refine((v) => !hasInactiveCompany ? true : v, 'CNPJ obrigatório'),
        }),
        defaultValues: {
            socialReason: '',
            CNPJ: ''
        },
        initialData: {
            socialReason: companyDetails.socialReason,
            CNPJ: companyDetails.CNPJ
        }
    })
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);

    useEffect(() => {
        if (declarationData.inactiveCompanyDetails) {
            const inactiveCompanyDetails = declarationData.inactiveCompanyDetails
            setCompanyDetails(inactiveCompanyDetails.companyDetails)
            setHasInactiveCompany(inactiveCompanyDetails.hasInactiveCompany)
        }

    }, []);

    const handleSave = () => {
        if (!hasInactiveCompany) {
            candidateService.deleteDeclaration({
                userId: declarationData.id, type: 'InactiveCompany',
                text: `
                Eu, ${declarationData.name}, inscrito(a) no CPF ${declarationData.CPF}, declaro não possuir qualquer empresa inativa.
                `
            })
        }
        if (!addressRef.current?.validate() && addressRef.current && !isValid) {
            trigger()
            return
        }
        const values = addressRef.current?.values()
        setDeclarationData((prev) => ({
            ...prev,
            inactiveCompanyDetails: {
                hasInactiveCompany,
                companyDetails: hasInactiveCompany ? { ...values, ...getValues() } : {
                    CEP: '',
                    address: '',
                    neighborhood: '',
                    addressNumber: '',
                    city: '',
                    UF: '',
                    complement: '',
                }
            }
        }))
        if (hasInactiveCompany !== null) {
            localStorage.setItem('inactiveCompanyDetails', JSON.stringify({ hasInactiveCompany, companyDetails }));
            onSave(hasInactiveCompany);
        }
    };

    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setCompanyDetails((prevDetails) => ({
    //         ...prevDetails,
    //         [name]: value,
    //     }));
    // };

    // const isSaveDisabled = () => {
    //     if (hasInactiveCompany) {
    //         return !companyDetails.cep || !companyDetails.address || !companyDetails.neighborhood || !companyDetails.number || !companyDetails.city || !companyDetails.uf;
    //     }
    //     return hasInactiveCompany === null;
    // };

    const addressRef = useRef(null)
    if (!declarationData) {
        return <p>Carregando...</p>;
    }
    return (
        <div className={commonStyles.declarationForm}>
            <h2 className={commonStyles.declarationFormTitle}>DECLARAÇÕES PARA FINS DE PROCESSO SELETIVO CEBAS</h2>
            <h3 className={commonStyles.declarationFormSubTitle}>DECLARAÇÃO DE EMPRESA INATIVA</h3>
            <h3 className={commonStyles.declarationFormNameTitle}>{declarationData.name}</h3>
            <p className={commonStyles.declarationConfirm}>Você possui alguma empresa inativa?</p>
            <div className={commonStyles.radioGroupInput}>
                <label>
                    <input type="radio" name="hasInactiveCompany" value="sim" onChange={() => setHasInactiveCompany(true)} checked={hasInactiveCompany} /> Sim
                </label>
                <label>
                    <input type="radio" name="hasInactiveCompany" value="nao" onChange={() => setHasInactiveCompany(false)} checked={hasInactiveCompany === false} /> Não
                </label>
            </div>
            {hasInactiveCompany && (
                <div className={commonStyles.additionalFields}>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
                        <InputForm label={'razão social'} control={control} name="socialReason" />
                        <InputForm label={'CNPJ'} control={control} name="CNPJ" transform={(e) => formatCNPJ(e.target.value)} />
                    </div>
                    <AddressData ref={addressRef} data={companyDetails} />
                    {/* <div className={commonStyles.inputGroup}>
                        <label htmlFor="cep">CEP</label>
                        <input
                            type="text"
                            id="cep"
                            name="cep"
                            value={companyDetails.cep}
                            onChange={(e) => setCompanyDetails((prev) => ({ ...prev, cep: formatCEP(e.target.value) }))}
                            placeholder="78910-111"
                        />
                    </div>
                    <div className={commonStyles.inputGroup}>
                        <label htmlFor="address">Endereço</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={companyDetails.address}
                            onChange={handleInputChange}
                            placeholder="Rua das Flores"
                        />
                    </div>
                    <div className={commonStyles.inputGroup}>
                        <label htmlFor="neighborhood">Bairro</label>
                        <input
                            type="text"
                            id="neighborhood"
                            name="neighborhood"
                            value={companyDetails.neighborhood}
                            onChange={handleInputChange}
                            placeholder="Jardim Primavera"
                        />
                    </div>
                    <div className={commonStyles.inputGroup}>
                        <label htmlFor="number">Número</label>
                        <input
                            type="text"
                            id="number"
                            name="number"
                            value={companyDetails.number}
                            onChange={handleInputChange}
                            placeholder="123"
                        />
                    </div>
                    <div className={commonStyles.inputGroup}>
                        <label htmlFor="city">Cidade</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={companyDetails.city}
                            onChange={handleInputChange}
                            placeholder="Rio de Janeiro"
                        />
                    </div>
                    <div className={commonStyles.inputGroup}>
                        <label htmlFor="uf">UF</label>
                        <input
                            type="text"
                            id="uf"
                            name="uf"
                            value={companyDetails.uf}
                            onChange={handleInputChange}
                            placeholder="RJ"
                        />
                    </div>
                    <div className={commonStyles.inputGroup}>
                        <label htmlFor="complement">Complemento</label>
                        <input
                            type="text"
                            id="complement"
                            name="complement"
                            value={companyDetails.complement}
                            onChange={handleInputChange}
                            placeholder="Sala 456"
                        />
                    </div> */}
                </div>
            )}
            <div className={commonStyles.navigationButtons}>
                <ButtonBase onClick={onBack}><Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                <ButtonBase
                    label="Salvar"
                    onClick={handleSave}

                />
            </div>
        </div>
    );
}
