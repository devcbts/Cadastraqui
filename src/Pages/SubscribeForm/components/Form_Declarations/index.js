import React, { useState } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import DeclarationOverview from './components/Declaration_Status'; // Ajuste o caminho conforme necessário
import Declaration_Form from './components/Declaration_Form'; // Componente existente
import Declaration_Pension from './components/Declaration_Pension'; // Componente existente
import Declaration_ChildPension from './components/Declaration_ChildPension'; // Componente existente
import Declaration_ChildSupport from './components/Declaration_ChildSupport'; // Componente existente
import Declaration_ChildSupportDetails from './components/Declaration_ChildSupportDetails'; // Componente existente
import Declaration_Final from './components/Declaration_Final'; // Nova tela
import Declaration_AddressProof from './components/Declaration_AddressProof'; // Nova tela
import Declaration_NoAddressProof from './components/Declaration_NoAddressProof'; // Nova tela
import Declaration_RentedHouse from './components/Declaration_RentedHouse'; // Nova tela
import Declaration_RentDetails from './components/Declaration_RentDetails'; // Nova tela
import Declaration_RentConfirmation from './components/Declaration_RentConfirmation'; // Nova tela
import Declaration_WorkCard from './components/Declaration_WorkCard'; // Nova tela
import Declaration_WorkCardUpload from './components/Declaration_WorkCardUpload'; // Nova tela
import Declaration_WorkCardConfirmation from './components/Declaration_WorkCardConfirmation'; // Nova tela
import Declaration_ContributionStatement from './components/Declaration_ContributionStatement'; // Nova tela
import Declaration_StableUnion from './components/Declaration_StableUnion'; // Nova tela
import Declaration_StableUnionConfirmation from './components/Declaration_StableUnionConfirmation'; // Nova tela
import Declaration_SingleStatus from './components/Declaration_SingleStatus'; // Nova tela
import Declaration_IncomeTaxExemption from './components/Declaration_IncomeTaxExemption'; // Nova tela
import Declaration_IncomeTaxExemptionConfirmation from './components/Declaration_IncomeTaxExemptionConfirmation'; // Nova tela
import Declaration_Activity from './components/Declaration_Activity'; // Nova tela
import Declaration_MEI from './components/Declaration_MEI'; // Nova tela
import Declaration_MEI_Confirmation from './components/Declaration_MEI_Confirmation'; // Nova tela
import Declaration_RuralWorker from './components/Declaration_RuralWorker'; // Nova tela
import Declaration_RuralWorkerConfirmation from './components/Declaration_RuralWorkerConfirmation'; // Nova tela
import Declaration_Autonomo from './components/Declaration_Autonomo'; // Nova tela
import Declaration_AutonomoConfirmation from './components/Declaration_AutonomoConfirmation'; // Nova tela
import Declaration_Empresario from './components/Declaration_Empresario'; // Nova tela
import Declaration_EmpresarioConfirmation from './components/Declaration_EmpresarioConfirmation'; // Nova tela
import Declaration_InactiveCompany from './components/Declaration_InactiveCompany'; // Nova tela
import Declaration_InactiveCompanyConfirmation from './components/Declaration_InactiveCompanyConfirmation'; // Nova tela
import Declaration_RentIncome from './components/Declaration_RentIncome'; // Nova tela
import Declaration_RentIncomeDetails from './components/Declaration_RentIncomeDetails'; // Nova tela

const SCREENS = {
    OVERVIEW: 'overview',
    FORM: 'form',
    PENSION: 'pension',
    CHILD_PENSION: 'childPension',
    CHILD_SUPPORT: 'childSupport',
    CHILD_SUPPORT_DETAILS: 'childSupportDetails',
    FINAL: 'final',
    ADDRESS_PROOF: 'addressProof',
    NO_ADDRESS_PROOF: 'noAddressProof',
    RENTED_HOUSE: 'rentedHouse',
    RENT_DETAILS: 'rentDetails',
    RENT_CONFIRMATION: 'rentConfirmation',
    WORK_CARD: 'workCard',
    WORK_CARD_UPLOAD: 'workCardUpload',
    WORK_CARD_CONFIRMATION: 'workCardConfirmation',
    CONTRIBUTION_STATEMENT: 'contributionStatement',
    STABLE_UNION: 'stableUnion',
    STABLE_UNION_CONFIRMATION: 'stableUnionConfirmation',
    SINGLE_STATUS: 'singleStatus',
    INCOME_TAX_EXEMPTION: 'incomeTaxExemption',
    INCOME_TAX_EXEMPTION_CONFIRMATION: 'incomeTaxExemptionConfirmation',
    ACTIVITY: 'activity',
    MEI: 'mei',
    MEI_CONFIRMATION: 'meiConfirmation',
    RURAL_WORKER: 'ruralWorker',
    RURAL_WORKER_CONFIRMATION: 'ruralWorkerConfirmation',
    AUTONOMO: 'autonomo',
    AUTONOMO_CONFIRMATION: 'autonomoConfirmation',
    EMPRESARIO: 'empresario',
    EMPRESARIO_CONFIRMATION: 'empresarioConfirmation',
    INACTIVE_COMPANY: 'inactiveCompany',
    INACTIVE_COMPANY_CONFIRMATION: 'inactiveCompanyConfirmation',
    RENT_INCOME: 'rentIncome',
    RENT_INCOME_DETAILS: 'rentIncomeDetails',
};

export default function FormDeclarations() {
    const [currentScreen, setCurrentScreen] = useState(SCREENS.OVERVIEW);
    const [partnerName, setPartnerName] = useState('');
    const [unionStartDate, setUnionStartDate] = useState('');
    const [activity, setActivity] = useState('');

    const navigateToScreen = (screen) => {
        console.log(`Navigating to ${screen}`);
        setCurrentScreen(screen);
    };

    return (
        <div className={commonStyles.container}>
            {currentScreen === SCREENS.OVERVIEW && (
                <>
                    <h1>Declarações para fins de processo seletivo CEAS</h1>
                    <div className={commonStyles.declarationSection}>
                        <div className={commonStyles.declarationItem}>
                            <label>João da Silva - Usuário do Cadastro Familiar</label>
                            <ButtonBase label="Declaração" onClick={() => navigateToScreen(SCREENS.FORM)} />
                        </div>
                        <div className={commonStyles.declarationItem}>
                            <label>Maria de Souza - Integrante do Grupo Familiar</label>
                            <ButtonBase label="Declaração" />
                        </div>
                        <div className={commonStyles.declarationItem}>
                            <label>Carlos Lima - Integrante do Grupo Familiar</label>
                            <ButtonBase label="Declaração" />
                        </div>
                    </div>
                    <div className={commonStyles.navigationButtons}>
                        <ButtonBase onClick={() => navigateToScreen(SCREENS.OVERVIEW)}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                        <ButtonBase onClick={() => navigateToScreen(SCREENS.FORM)}><Arrow width="40px" /></ButtonBase>
                    </div>
                </>
            )}
            {currentScreen === SCREENS.FORM && (
                <Declaration_Form onBack={() => navigateToScreen(SCREENS.OVERVIEW)} onEdit={() => navigateToScreen(SCREENS.PENSION)} />
            )}
            {currentScreen === SCREENS.PENSION && (
                <Declaration_Pension onBack={() => navigateToScreen(SCREENS.OVERVIEW)} onNext={() => navigateToScreen(SCREENS.CHILD_PENSION)} />
            )}
            {currentScreen === SCREENS.CHILD_PENSION && (
                <Declaration_ChildPension onBack={() => navigateToScreen(SCREENS.OVERVIEW)} onNext={() => navigateToScreen(SCREENS.CHILD_SUPPORT)} />
            )}
            {currentScreen === SCREENS.CHILD_SUPPORT && (
                <Declaration_ChildSupport onBack={() => navigateToScreen(SCREENS.OVERVIEW)} onNext={() => navigateToScreen(SCREENS.CHILD_SUPPORT_DETAILS)} />
            )}
            {currentScreen === SCREENS.CHILD_SUPPORT_DETAILS && (
                <Declaration_ChildSupportDetails onBack={() => navigateToScreen(SCREENS.OVERVIEW)} onNext={() => navigateToScreen(SCREENS.FINAL)} />
            )}
            {currentScreen === SCREENS.FINAL && (
                <Declaration_Final onBack={() => navigateToScreen(SCREENS.CHILD_SUPPORT_DETAILS)} onNext={(hasAddressProof) => navigateToScreen(hasAddressProof ? SCREENS.ADDRESS_PROOF : SCREENS.FINAL)} />
            )}
            {currentScreen === SCREENS.ADDRESS_PROOF && (
                <Declaration_AddressProof onBack={() => navigateToScreen(SCREENS.FINAL)} onNext={(hasAddressProof) => navigateToScreen(hasAddressProof ? SCREENS.RENTED_HOUSE : SCREENS.NO_ADDRESS_PROOF)} />
            )}
            {currentScreen === SCREENS.NO_ADDRESS_PROOF && (
                <Declaration_NoAddressProof onBack={() => navigateToScreen(SCREENS.ADDRESS_PROOF)} />
            )}
            {currentScreen === SCREENS.RENTED_HOUSE && (
                <Declaration_RentedHouse onBack={() => navigateToScreen(SCREENS.ADDRESS_PROOF)} onNext={(rentedHouse) => navigateToScreen(rentedHouse ? SCREENS.RENT_DETAILS : SCREENS.WORK_CARD)} />
            )}
            {currentScreen === SCREENS.RENT_DETAILS && (
                <Declaration_RentDetails onBack={() => navigateToScreen(SCREENS.RENTED_HOUSE)} onSave={() => navigateToScreen(SCREENS.RENT_CONFIRMATION)} />
            )}
            {currentScreen === SCREENS.RENT_CONFIRMATION && (
                <Declaration_RentConfirmation onBack={() => navigateToScreen(SCREENS.RENT_DETAILS)} />
            )}
            {currentScreen === SCREENS.WORK_CARD && (
                <Declaration_WorkCard onBack={() => navigateToScreen(SCREENS.RENTED_HOUSE)} onNext={(hasWorkCard) => navigateToScreen(hasWorkCard ? SCREENS.WORK_CARD_UPLOAD : SCREENS.WORK_CARD)} />
            )}
            {currentScreen === SCREENS.WORK_CARD_UPLOAD && (
                <Declaration_WorkCardUpload onBack={() => navigateToScreen(SCREENS.WORK_CARD)} onSave={() => navigateToScreen(SCREENS.WORK_CARD_CONFIRMATION)} />
            )}
            {currentScreen === SCREENS.WORK_CARD_CONFIRMATION && (
                <Declaration_WorkCardConfirmation onBack={() => navigateToScreen(SCREENS.WORK_CARD_UPLOAD)} onNext={(confirmed) => navigateToScreen(confirmed ? SCREENS.CONTRIBUTION_STATEMENT : SCREENS.WORK_CARD_CONFIRMATION)} />
            )}
            {currentScreen === SCREENS.CONTRIBUTION_STATEMENT && (
                <Declaration_ContributionStatement onBack={() => navigateToScreen(SCREENS.WORK_CARD_CONFIRMATION)} onSave={() => navigateToScreen(SCREENS.STABLE_UNION)} />
            )}
            {currentScreen === SCREENS.STABLE_UNION && (
                <Declaration_StableUnion
                    onBack={() => navigateToScreen(SCREENS.CONTRIBUTION_STATEMENT)}
                    onSave={(partnerName, unionStartDate) => {
                        if (partnerName && unionStartDate) {
                            setPartnerName(partnerName);
                            setUnionStartDate(unionStartDate);
                            navigateToScreen(SCREENS.STABLE_UNION_CONFIRMATION);
                        } else {
                            navigateToScreen(SCREENS.SINGLE_STATUS);
                        }
                    }}
                />
            )}
            {currentScreen === SCREENS.STABLE_UNION_CONFIRMATION && (
                <Declaration_StableUnionConfirmation
                    onBack={() => navigateToScreen(SCREENS.STABLE_UNION)}
                    partnerName={partnerName}
                    unionStartDate={unionStartDate}
                    onSave={() => navigateToScreen(SCREENS.SINGLE_STATUS)}
                />
            )}
            {currentScreen === SCREENS.SINGLE_STATUS && (
                <Declaration_SingleStatus
                    onBack={() => navigateToScreen(SCREENS.STABLE_UNION)}
                    onNext={(isSingle) => navigateToScreen(isSingle ? SCREENS.INCOME_TAX_EXEMPTION : SCREENS.SINGLE_STATUS)}
                />
            )}
            {currentScreen === SCREENS.INCOME_TAX_EXEMPTION && (
                <Declaration_IncomeTaxExemption
                    onBack={() => navigateToScreen(SCREENS.SINGLE_STATUS)}
                    onSave={() => navigateToScreen(SCREENS.INCOME_TAX_EXEMPTION_CONFIRMATION)}
                />
            )}
            {currentScreen === SCREENS.INCOME_TAX_EXEMPTION_CONFIRMATION && (
                <Declaration_IncomeTaxExemptionConfirmation
                    onBack={() => navigateToScreen(SCREENS.INCOME_TAX_EXEMPTION)}
                    onNext={() => navigateToScreen(SCREENS.ACTIVITY)}
                />
            )}
            {currentScreen === SCREENS.ACTIVITY && (
                <Declaration_Activity
                    onBack={() => navigateToScreen(SCREENS.INCOME_TAX_EXEMPTION_CONFIRMATION)}
                    onNext={(activity) => navigateToScreen(activity === 'sim' ? SCREENS.MEI : SCREENS.RURAL_WORKER)}
                />
            )}
            {currentScreen === SCREENS.MEI && (
                <Declaration_MEI
                    onBack={() => navigateToScreen(SCREENS.ACTIVITY)}
                    onNext={(mei) => navigateToScreen(mei === 'sim' ? SCREENS.MEI_CONFIRMATION : SCREENS.RURAL_WORKER)}
                />
            )}
            {currentScreen === SCREENS.MEI_CONFIRMATION && (
                <Declaration_MEI_Confirmation
                    onBack={() => navigateToScreen(SCREENS.MEI)}
                    onNext={(confirmation) => navigateToScreen(confirmation === 'sim' ? SCREENS.RURAL_WORKER : SCREENS.RURAL_WORKER)}
                />
            )}
            {currentScreen === SCREENS.RURAL_WORKER && (
                <Declaration_RuralWorker
                    onBack={() => navigateToScreen(SCREENS.MEI_CONFIRMATION)}
                    onNext={(ruralWorker, activity) => {
                        setActivity(activity);
                        navigateToScreen(SCREENS.RURAL_WORKER_CONFIRMATION);
                    }}
                />
            )}
            {currentScreen === SCREENS.RURAL_WORKER_CONFIRMATION && (
                <Declaration_RuralWorkerConfirmation
                    onBack={() => navigateToScreen(SCREENS.RURAL_WORKER)}
                    activity={activity}
                    onSave={(confirmation) => navigateToScreen(SCREENS.AUTONOMO)}
                />
            )}
            {currentScreen === SCREENS.AUTONOMO && (
                <Declaration_Autonomo
                    onBack={() => navigateToScreen(SCREENS.RURAL_WORKER_CONFIRMATION)}
                    onSave={(informalWork, activity) => navigateToScreen(informalWork === 'sim' ? SCREENS.AUTONOMO_CONFIRMATION : SCREENS.EMPRESARIO)}
                />
            )}
            {currentScreen === SCREENS.AUTONOMO_CONFIRMATION && (
                <Declaration_AutonomoConfirmation
                    onBack={() => navigateToScreen(SCREENS.AUTONOMO)}
                    activity={activity}
                    onSave={(confirmation) => navigateToScreen(confirmation === 'sim' ? SCREENS.EMPRESARIO : SCREENS.EMPRESARIO)}
                />
            )}
            {currentScreen === SCREENS.EMPRESARIO && (
                <Declaration_Empresario
                    onBack={() => navigateToScreen(SCREENS.AUTONOMO_CONFIRMATION)}
                    onSave={(isPartner, activity) => {
                        setActivity(activity);
                        navigateToScreen(isPartner === 'sim' ? SCREENS.EMPRESARIO_CONFIRMATION : SCREENS.INACTIVE_COMPANY);
                    }}
                />
            )}
            {currentScreen === SCREENS.EMPRESARIO_CONFIRMATION && (
                <Declaration_EmpresarioConfirmation
                    onBack={() => navigateToScreen(SCREENS.EMPRESARIO)}
                    activity={activity}
                    onSave={(confirmation) => navigateToScreen(confirmation === 'sim' ? SCREENS.INACTIVE_COMPANY : SCREENS.INACTIVE_COMPANY)}
                />
            )}
            {currentScreen === SCREENS.INACTIVE_COMPANY && (
                <Declaration_InactiveCompany
                    onBack={() => navigateToScreen(SCREENS.EMPRESARIO_CONFIRMATION)}
                    onSave={(hasInactiveCompany, activity) => {
                        setActivity(activity);
                        navigateToScreen(hasInactiveCompany === 'sim' ? SCREENS.INACTIVE_COMPANY_CONFIRMATION : SCREENS.RENT_INCOME);
                    }}
                />
            )}
            {currentScreen === SCREENS.INACTIVE_COMPANY_CONFIRMATION && (
                <Declaration_InactiveCompanyConfirmation
                    onBack={() => navigateToScreen(SCREENS.INACTIVE_COMPANY)}
                    activity={activity}
                    onSave={(confirmation) => navigateToScreen(confirmation === 'sim' ? SCREENS.RENT_INCOME : SCREENS.RENT_INCOME)}
                />
            )}
            {currentScreen === SCREENS.RENT_INCOME && (
                <Declaration_RentIncome
                    onBack={() => navigateToScreen(SCREENS.INACTIVE_COMPANY_CONFIRMATION)}
                    onNext={(receivesRent) => navigateToScreen(receivesRent ? SCREENS.RENT_INCOME_DETAILS : SCREENS.RENT_INCOME)}
                />
            )}
            {currentScreen === SCREENS.RENT_INCOME_DETAILS && (
                <Declaration_RentIncomeDetails
                    onBack={() => navigateToScreen(SCREENS.RENT_INCOME)}
                    onSave={() => navigateToScreen(SCREENS.OVERVIEW)}
                />
            )}
        </div>
    );
}
