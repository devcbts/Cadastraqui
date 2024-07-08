import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from 'react';
import commonStyles from '../../styles.module.scss';
import { useRecoilState } from 'recoil';
import declarationAtom from '../../atoms/declarationAtom';
import { formatCEP } from 'utils/format-cep';

export default function Declaration_InactiveCompany({ onBack, onSave }) {
    const [hasInactiveCompany, setHasInactiveCompany] = useState(null);
    const [companyDetails, setCompanyDetails] = useState({
        cep: '',
        address: '',
        neighborhood: '',
        number: '',
        city: '',
        uf: '',
        complement: '',
    });
    const [declarationData, setDeclarationData] = useRecoilState(declarationAtom);

    useEffect(() => {
        if (declarationData.inactiveCompanyDetails) {
            const inactiveCompanyDetails = declarationData.inactiveCompanyDetails
            setCompanyDetails(inactiveCompanyDetails.companyDetails)
            setHasInactiveCompany(inactiveCompanyDetails.hasInactiveCompany)
        }

    }, []);

    const handleSave = () => {
        setDeclarationData((prev) => ({
            ...prev,
            inactiveCompanyDetails: {
                hasInactiveCompany,
                companyDetails: hasInactiveCompany ? companyDetails : {
                    cep: '',
                    address: '',
                    neighborhood: '',
                    number: '',
                    city: '',
                    uf: '',
                    complement: '',
                }
            }
        }))
        if (hasInactiveCompany !== null) {
            localStorage.setItem('inactiveCompanyDetails', JSON.stringify({ hasInactiveCompany, companyDetails }));
            onSave(hasInactiveCompany);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCompanyDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const isSaveDisabled = () => {
        if (hasInactiveCompany) {
            return !companyDetails.cep || !companyDetails.address || !companyDetails.neighborhood || !companyDetails.number || !companyDetails.city || !companyDetails.uf;
        }
        return hasInactiveCompany === null;
    };

    if (!declarationData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={commonStyles.declarationForm}>
            <h1>DECLARAÇÃO DE EMPRESA INATIVA</h1>
            <h2>{declarationData.name}</h2>
            <p>Você possui alguma empresa inativa?</p>
            <div className={commonStyles.radioGroup}>
                <label>
                    <input type="radio" name="hasInactiveCompany" value="sim" onChange={() => setHasInactiveCompany(true)} checked={hasInactiveCompany} /> Sim
                </label>
                <label>
                    <input type="radio" name="hasInactiveCompany" value="nao" onChange={() => setHasInactiveCompany(false)} checked={hasInactiveCompany === false} /> Não
                </label>
            </div>
            {hasInactiveCompany && (
                <div className={commonStyles.additionalFields}>
                    <div className={commonStyles.inputGroup}>
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
