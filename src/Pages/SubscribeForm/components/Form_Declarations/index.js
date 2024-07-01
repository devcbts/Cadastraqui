import React, { useState, useEffect, useCallback } from 'react';
import commonStyles from '../../styles.module.scss'; // Certifique-se de que o caminho está correto
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'; // Certifique-se de que o caminho está correto
import useAuth from 'hooks/useAuth';
import { api } from 'services/axios';
import DeclarationOverview from './components/Declaration_Status';
import Declaration_Pension from './components/Declaration_Pension';
import Declaration_ChildPension from './components/Declaration_ChildPension';
import Declaration_ChildSupport from './components/Declaration_ChildSupport';
import Declaration_ChildSupportDetails from './components/Declaration_ChildSupportDetails';
import Declaration_PensionConfirmation from './components/Declaration_PensionConfirmation';
import Declaration_AddressProof from './components/Declaration_AddressProof';
import Declaration_NoAddressProof from './components/Declaration_NoAddressProof';
import Declaration_RentedHouse from './components/Declaration_RentedHouse';
import Declaration_RentDetails from './components/Declaration_RentDetails';
import Declaration_RentConfirmation from './components/Declaration_RentConfirmation';
import Declaration_WorkCard from './components/Declaration_WorkCard';
import Declaration_WorkCardUpload from './components/Declaration_WorkCardUpload';
import Declaration_WorkCardConfirmation from './components/Declaration_WorkCardConfirmation';
import Declaration_ContributionStatement from './components/Declaration_ContributionStatement';
import Declaration_StableUnion from './components/Declaration_StableUnion';
import Declaration_StableUnionConfirmation from './components/Declaration_StableUnionConfirmation';
import Declaration_SingleStatus from './components/Declaration_SingleStatus';
import Declaration_SeparationStatus from './components/Declaration_SeparationStatus';
import Declaration_CurrentAddress from './components/Declaration_CurrentAddress';
import Declaration_SeparationConfirmation from './components/Declaration_SeparationConfirmation';
import Declaration_SeparationNoAddressConfirmation from './components/Declaration_SeparationNoAddressConfirmation';
import Declaration_IncomeTaxExemption from './components/Declaration_IncomeTaxExemption';
import Declaration_IncomeTaxExemptionConfirmation from './components/Declaration_IncomeTaxExemptionConfirmation';
import Declaration_Activity from './components/Declaration_Activity';
import Declaration_ActivitConfirmation from './components/Declaration_ActivitConfirmation';
import Declaration_MEI from './components/Declaration_MEI';
import Declaration_MEI_Confirmation from './components/Declaration_MEI_Confirmation';
import Declaration_RuralWorker from './components/Declaration_RuralWorker';
import Declaration_RuralWorkerConfirmation from './components/Declaration_RuralWorkerConfirmation';
import Declaration_Autonomo from './components/Declaration_Autonomo';
import Declaration_AutonomoConfirmation from './components/Declaration_AutonomoConfirmation';
import Declaration_Empresario from './components/Declaration_Empresario';
import Declaration_EmpresarioConfirmation from './components/Declaration_EmpresarioConfirmation';
import Declaration_InactiveCompany from './components/Declaration_InactiveCompany';
import Declaration_InactiveCompanyConfirmation from './components/Declaration_InactiveCompanyConfirmation';
import Declaration_RentIncome from './components/Declaration_RentIncome';
import Declaration_RentIncomeDetails from './components/Declaration_RentIncomeDetails';
import Declaration_Form from './components/Declaration_FormConfirmation';
import Declaration_VehicleOwnership from './components/Declaration_VehicleOwnership'; // Nova tela
import Declaration_FamilyIncomeChange from './components/Declaration_FamilyIncomeChange'; // Adicionando nova declaração
import Declaration_ResponsibilityConfirmation from './components/Declaration_ResponsibilityConfirmation'; // Adicionando nova declaração
import Declaration_Witnesses from './components/Declaration_Witnesses.js';
import Declaration_RentIncomeConfirmation from './components/Declaration_RentIncomeConfirmation';

const SCREENS = {
    OVERVIEW: 'overview',
    FORM: 'form',
    PENSION: 'pension',
    CHILD_PENSION: 'childPension',
    CHILD_SUPPORT: 'childSupport',
    CHILD_SUPPORT_DETAILS: 'childSupportDetails',
    PENSION_CONFIRMATION: 'pensionConfirmation',
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
    SEPARATION_STATUS: 'separationStatus',
    CURRENT_ADDRESS: 'currentAddress',
    SEPARATION_CONFIRMATION: 'separationConfirmation',
    SEPARATION_NO_ADDRESS_CONFIRMATION: 'separationNoAddressConfirmation',
    INCOME_TAX_EXEMPTION: 'incomeTaxExemption',
    INCOME_TAX_EXEMPTION_CONFIRMATION: 'incomeTaxExemptionConfirmation',
    ACTIVITY: 'activity',
    ACTIVITY_CONFIRMATION: 'activityConfirmation',
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
    RENT_INCOME_CONFIRMATION: 'rentIncomeConfirmation',
    VEHICLE_OWNERSHIP: 'vehicleOwnership',
    FAMILY_INCOME_CHANGE: 'familyIncomeChange',
    RESPONSIBILITY_CONFIRMATION: 'responsibilityConfirmation',
    WITNESSES: 'witnesses'

};

export default function FormDeclarations() {
    const { auth } = useAuth();
    const [currentScreen, setCurrentScreen] = useState(SCREENS.OVERVIEW);
    const [userId, setUserId] = useState(null);
    const [partnerName, setPartnerName] = useState('');
    const [unionStartDate, setUnionStartDate] = useState('');
    const [activity, setActivity] = useState('');
    const [declarationData, setDeclarationData] = useState(null);

    useEffect(() => {
        if (auth?.uid) {
            const fetchDeclaration = async () => {
                try {
                    const response = await api.get(`/candidates/declaration/Form/${auth.uid}`);
                    const data = response.data;
                    setDeclarationData(data.infoDetails);
                    setUserId(auth.uid);
                    console.log('Form Declaration:', data.infoDetails);
                    localStorage.setItem('declarationData', JSON.stringify(data.infoDetails));
                } catch (error) {
                    console.error('Erro ao buscar a declaração:', error);
                }
            };
            fetchDeclaration();
        }
    }, [auth]);

    const navigateToScreen = useCallback((screen, id = null) => {
        if (id) {
            setUserId(id);
        }
        setCurrentScreen(screen);
    }, []);

    const handleNavigate = useCallback((screen) => {
        if (userId) {
            navigateToScreen(screen, userId);
        }
    }, [userId, navigateToScreen]);

    const handleNavigateToForm = useCallback(() => {
        if (declarationData) {
            setUserId(declarationData.fullName);
            navigateToScreen(SCREENS.FORM, declarationData.fullName);
        }
    }, [declarationData, navigateToScreen]);

    const handleNavigateToRentedHouse = useCallback(() => {
        navigateToScreen(SCREENS.RENTED_HOUSE);
    }, [navigateToScreen]);

    const handleNavigateToRentDetails = useCallback(() => {
        navigateToScreen(SCREENS.RENT_DETAILS);
    }, [navigateToScreen]);

    const handleNavigateToRentConfirmation = useCallback(() => {
        navigateToScreen(SCREENS.RENT_CONFIRMATION);
    }, [navigateToScreen]);

    const handleNavigateToWorkCard = useCallback(() => {
        navigateToScreen(SCREENS.WORK_CARD);
    }, [navigateToScreen]);

    const handleNavigateToSingleStatus = useCallback(() => {
        navigateToScreen(SCREENS.SINGLE_STATUS);
    }, [navigateToScreen]);

    const handleNavigateToSeparationStatus = useCallback(() => {
        navigateToScreen(SCREENS.SEPARATION_STATUS);
    }, [navigateToScreen]);

    const handleNavigateToCurrentAddress = useCallback(() => {
        navigateToScreen(SCREENS.CURRENT_ADDRESS);
    }, [navigateToScreen]);

    const handleNavigateToSeparationConfirmation = useCallback(() => {
        navigateToScreen(SCREENS.SEPARATION_CONFIRMATION);
    }, [navigateToScreen]);

    const handleNavigateToSeparationNoAddressConfirmation = useCallback(() => {
        navigateToScreen(SCREENS.SEPARATION_NO_ADDRESS_CONFIRMATION);
    }, [navigateToScreen]);

    const handleNavigateToActivity = useCallback(() => {
        navigateToScreen(SCREENS.ACTIVITY);
    }, [navigateToScreen]);

    const handleNavigateToMEI = useCallback(() => {
        navigateToScreen(SCREENS.MEI);
    }, [navigateToScreen]);

    const handleNavigateToMEIConfirmation = useCallback(() => {
        navigateToScreen(SCREENS.MEI_CONFIRMATION);
    }, [navigateToScreen]);

    const handleNavigateToRuralWorker = useCallback(() => {
        navigateToScreen(SCREENS.RURAL_WORKER);
    }, [navigateToScreen]);

    const handleNavigateToRuralWorkerConfirmation = useCallback(() => {
        navigateToScreen(SCREENS.RURAL_WORKER_CONFIRMATION);
    }, [navigateToScreen]);

    const handleNavigateToAutonomo = useCallback(() => {
        navigateToScreen(SCREENS.AUTONOMO);
    }, [navigateToScreen]);

    const handleNavigateToAutonomoConfirmation = useCallback(() => {
        navigateToScreen(SCREENS.AUTONOMO_CONFIRMATION);
    }, [navigateToScreen]);

    const handleNavigateToEmpresario = useCallback(() => {
        navigateToScreen(SCREENS.EMPRESARIO);
    }, [navigateToScreen]);

    const handleNavigateToEmpresarioConfirmation = useCallback(() => {
        navigateToScreen(SCREENS.EMPRESARIO_CONFIRMATION);
    }, [navigateToScreen]);

    const handleNavigateToInactiveCompany = useCallback(() => {
        navigateToScreen(SCREENS.INACTIVE_COMPANY);
    }, [navigateToScreen]);

    const handleNavigateToInactiveCompanyConfirmation = useCallback(() => {
        navigateToScreen(SCREENS.INACTIVE_COMPANY_CONFIRMATION);
    }, [navigateToScreen]);

    const handleNavigateToRentIncome = useCallback(() => {
        navigateToScreen(SCREENS.RENT_INCOME);
    }, [navigateToScreen]);

    const handleNavigateToRentIncomeDetails = useCallback(() => {
        navigateToScreen(SCREENS.RENT_INCOME_DETAILS);
    }, [navigateToScreen]);

    const handleNavigateToVehicleOwnership = useCallback(() => {
        navigateToScreen(SCREENS.VEHICLE_OWNERSHIP);
    }, [navigateToScreen]);

    const handleNavigateToFamilyIncomeChange = useCallback(() => {
        navigateToScreen(SCREENS.FAMILY_INCOME_CHANGE);
    }, [navigateToScreen]);

    const handleNavigateToResponsibilityConfirmation = useCallback(() => {
        navigateToScreen(SCREENS.RESPONSIBILITY_CONFIRMATION);
    }, [navigateToScreen]);

    const handleNavigateToWitnesses = useCallback(() => {
        navigateToScreen(SCREENS.WITNESSES);
    }, [navigateToScreen]);

    const handleNavigateToRentIncomeConfirmation = useCallback(() => {
        navigateToScreen(SCREENS.RENT_INCOME_CONFIRMATION);
    }, [navigateToScreen]);

    return (
        <div className={commonStyles.container}>
            {currentScreen === SCREENS.OVERVIEW && (
                <>
                    <h1>Declarações para fins de processo seletivo CEBAS</h1>
                    <div className={commonStyles.declarationSection}>
                        <div className={commonStyles.declarationItem}>
                            {declarationData ? (
                                <>
                                    <label>{declarationData.fullName}</label>
                                    <ButtonBase label="Declaração" onClick={handleNavigateToForm} />
                                </>
                            ) : (
                                <p>Carregando...</p>
                            )}
                        </div>
                    </div>
                    <div className={commonStyles.navigationButtons}>
                        <ButtonBase onClick={() => navigateToScreen(SCREENS.OVERVIEW)}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                        <ButtonBase onClick={handleNavigateToForm}><Arrow width="40px" /></ButtonBase>
                    </div>
                </>
            )}
            {currentScreen === SCREENS.FORM && userId && (
                <Declaration_Form
                    userId={userId}
                    onBack={() => navigateToScreen(SCREENS.OVERVIEW)}
                    onEdit={() => handleNavigate(SCREENS.PENSION)}
                    declarationData={declarationData}
                />
            )}
            {currentScreen === SCREENS.PENSION && (
                <Declaration_Pension onBack={() => handleNavigate(SCREENS.FORM)} onNext={() => handleNavigate(SCREENS.CHILD_PENSION)} />
            )}
            {currentScreen === SCREENS.CHILD_PENSION && (
                <Declaration_ChildPension onBack={() => handleNavigate(SCREENS.PENSION)} onNext={() => handleNavigate(SCREENS.CHILD_SUPPORT)} onNoPension={() => handleNavigate(SCREENS.ADDRESS_PROOF)} />
            )}
            {currentScreen === SCREENS.CHILD_SUPPORT && (
                <Declaration_ChildSupport
                    onBack={() => handleNavigate(SCREENS.CHILD_PENSION)}
                    onNext={() => handleNavigate(SCREENS.CHILD_SUPPORT_DETAILS)}
                    onNoPension={() => handleNavigate(SCREENS.ADDRESS_PROOF)}
                />
            )}
            {currentScreen === SCREENS.CHILD_SUPPORT_DETAILS && (
                <Declaration_ChildSupportDetails onBack={() => handleNavigate(SCREENS.CHILD_SUPPORT)} onNext={() => handleNavigate(SCREENS.PENSION_CONFIRMATION)} />
            )}
            {currentScreen === SCREENS.PENSION_CONFIRMATION && (
                <Declaration_PensionConfirmation onBack={() => handleNavigate(SCREENS.CHILD_SUPPORT_DETAILS)} onNext={(hasAddressProof) => handleNavigate(hasAddressProof ? SCREENS.ADDRESS_PROOF : SCREENS.PENSION_CONFIRMATION)} />
            )}
            {currentScreen === SCREENS.ADDRESS_PROOF && (
                <Declaration_AddressProof onBack={() => handleNavigate(SCREENS.PENSION)} onNext={(hasAddressProof) => handleNavigate(hasAddressProof ? SCREENS.RENTED_HOUSE : SCREENS.NO_ADDRESS_PROOF)} />
            )}
            {currentScreen === SCREENS.NO_ADDRESS_PROOF && (
                <Declaration_NoAddressProof
                    onBack={() => handleNavigate(SCREENS.ADDRESS_PROOF)}
                    onNext={handleNavigateToRentedHouse}
                />
            )}
            {currentScreen === SCREENS.RENTED_HOUSE && (
                <Declaration_RentedHouse
                    onBack={() => handleNavigate(SCREENS.ADDRESS_PROOF)}
                    onNext={(rentedHouse) => handleNavigate(rentedHouse ? SCREENS.RENT_DETAILS : SCREENS.WORK_CARD)}
                />
            )}
            {currentScreen === SCREENS.RENT_DETAILS && (
                <Declaration_RentDetails
                    onBack={() => handleNavigate(SCREENS.RENTED_HOUSE)}
                    onSave={handleNavigateToRentConfirmation}
                />
            )}
            {currentScreen === SCREENS.RENT_CONFIRMATION && (
                <Declaration_RentConfirmation
                    onBack={() => handleNavigate(SCREENS.RENT_DETAILS)}
                    onNext={handleNavigateToWorkCard}
                />
            )}
            {currentScreen === SCREENS.WORK_CARD && (
                <Declaration_WorkCard
                    onBack={() => handleNavigate(SCREENS.RENTED_HOUSE)}
                    onNext={(hasWorkCard) => handleNavigate(hasWorkCard ? SCREENS.WORK_CARD_UPLOAD : SCREENS.CONTRIBUTION_STATEMENT)}
                />
            )}
            {currentScreen === SCREENS.WORK_CARD_UPLOAD && (
                <Declaration_WorkCardUpload onBack={() => handleNavigate(SCREENS.WORK_CARD)} onSave={() => handleNavigate(SCREENS.WORK_CARD_CONFIRMATION)} />
            )}
            {currentScreen === SCREENS.WORK_CARD_CONFIRMATION && (
                <Declaration_WorkCardConfirmation
                    onBack={() => handleNavigate(SCREENS.WORK_CARD_UPLOAD)}
                    onNext={(confirmed) => handleNavigate(confirmed ? SCREENS.CONTRIBUTION_STATEMENT : SCREENS.WORK_CARD_CONFIRMATION)}
                    fullName={declarationData?.fullName}
                />
            )}
            {currentScreen === SCREENS.CONTRIBUTION_STATEMENT && (
                <Declaration_ContributionStatement onBack={() => handleNavigate(SCREENS.WORK_CARD_CONFIRMATION)} onSave={() => handleNavigate(SCREENS.STABLE_UNION)} />
            )}
            {currentScreen === SCREENS.STABLE_UNION && (
                <Declaration_StableUnion
                    onBack={() => handleNavigate(SCREENS.CONTRIBUTION_STATEMENT)}
                    onSave={(partnerName, unionStartDate) => {
                        if (partnerName && unionStartDate) {
                            setPartnerName(partnerName);
                            setUnionStartDate(unionStartDate);
                            handleNavigate(SCREENS.STABLE_UNION_CONFIRMATION);
                        } else {
                            handleNavigate(SCREENS.SINGLE_STATUS);
                        }
                    }}
                />
            )}
            {currentScreen === SCREENS.STABLE_UNION_CONFIRMATION && (
                <Declaration_StableUnionConfirmation
                    onBack={() => handleNavigate(SCREENS.STABLE_UNION)}
                    partnerName={partnerName}
                    unionStartDate={unionStartDate}
                    onNext={handleNavigateToSingleStatus}
                />
            )}
            {currentScreen === SCREENS.SINGLE_STATUS && (
                <Declaration_SingleStatus
                    onBack={() => handleNavigate(SCREENS.STABLE_UNION)}
                    onNext={handleNavigateToSeparationStatus}
                />
            )}
            {currentScreen === SCREENS.SEPARATION_STATUS && (
                <Declaration_SeparationStatus
                    onBack={() => handleNavigate(SCREENS.SINGLE_STATUS)}
                    onNext={(knowsCurrentAddress) => handleNavigate(knowsCurrentAddress ? SCREENS.CURRENT_ADDRESS : SCREENS.INCOME_TAX_EXEMPTION)}
                />
            )}
            {currentScreen === SCREENS.CURRENT_ADDRESS && (
                <Declaration_CurrentAddress
                    onBack={() => handleNavigate(SCREENS.SEPARATION_STATUS)}
                    onNext={handleNavigateToSeparationConfirmation}
                />
            )}
            {currentScreen === SCREENS.SEPARATION_NO_ADDRESS_CONFIRMATION && (
                <Declaration_SeparationNoAddressConfirmation
                    onBack={() => handleNavigate(SCREENS.SEPARATION_STATUS)}
                    onNext={() => handleNavigate(SCREENS.INCOME_TAX_EXEMPTION)}
                />
            )}
            {currentScreen === SCREENS.SEPARATION_CONFIRMATION && (
                <Declaration_SeparationConfirmation
                    onBack={() => handleNavigate(SCREENS.CURRENT_ADDRESS)}
                    onNext={() => handleNavigate(SCREENS.INCOME_TAX_EXEMPTION)}
                />
            )}
            {currentScreen === SCREENS.INCOME_TAX_EXEMPTION && (
                <Declaration_IncomeTaxExemption
                    onBack={() => handleNavigate(SCREENS.SEPARATION_CONFIRMATION)}
                    onSave={(confirmation) => handleNavigate(confirmation === 'sim' ? SCREENS.ACTIVITY : SCREENS.INCOME_TAX_EXEMPTION_CONFIRMATION)}
                />
            )}
            {currentScreen === SCREENS.INCOME_TAX_EXEMPTION_CONFIRMATION && (
                <Declaration_IncomeTaxExemptionConfirmation
                    onBack={() => handleNavigate(SCREENS.INCOME_TAX_EXEMPTION)}
                    onNext={() => handleNavigate(SCREENS.ACTIVITY)}
                />
            )}
            {currentScreen === SCREENS.ACTIVITY && (
                <Declaration_Activity
                    onBack={() => handleNavigate(SCREENS.INCOME_TAX_EXEMPTION_CONFIRMATION)}
                    onNext={(activity) => handleNavigate(activity === 'sim' ? SCREENS.MEI : SCREENS.ACTIVITY_CONFIRMATION)}
                />
            )}
            {currentScreen === SCREENS.ACTIVITY_CONFIRMATION && (
                <Declaration_ActivitConfirmation
                    onBack={() => handleNavigate(SCREENS.ACTIVITY)}
                    onNext={() => handleNavigate(SCREENS.MEI)}
                />
            )}
            {currentScreen === SCREENS.MEI && (
                <Declaration_MEI
                    onBack={() => handleNavigate(SCREENS.ACTIVITY)}
                    onNext={(mei) => handleNavigate(mei === 'sim' ? SCREENS.MEI_CONFIRMATION : SCREENS.RURAL_WORKER)}
                />
            )}
            {currentScreen === SCREENS.MEI_CONFIRMATION && (
                <Declaration_MEI_Confirmation
                    onBack={() => handleNavigate(SCREENS.MEI)}
                    onNext={() => handleNavigate(SCREENS.RURAL_WORKER)}
                />
            )}
            {currentScreen === SCREENS.RURAL_WORKER && (
                <Declaration_RuralWorker
                    onBack={() => handleNavigate(SCREENS.MEI_CONFIRMATION)}
                    onNext={(isRuralWorker, activity) => {
                        if (!isRuralWorker) {
                            handleNavigate(SCREENS.AUTONOMO);
                        } else {
                            setActivity(activity);
                            handleNavigate(SCREENS.RURAL_WORKER_CONFIRMATION);
                        }
                    }}
                />
            )}
            {currentScreen === SCREENS.RURAL_WORKER_CONFIRMATION && (
                <Declaration_RuralWorkerConfirmation
                    onBack={() => handleNavigate(SCREENS.RURAL_WORKER)}
                    activity={activity}
                    onSave={(confirmation) => handleNavigate(SCREENS.AUTONOMO)}
                />
            )}
            {currentScreen === SCREENS.AUTONOMO && (
                <Declaration_Autonomo
                    onBack={() => handleNavigate(SCREENS.RURAL_WORKER_CONFIRMATION)}
                    onSave={(informalWork, activity) => handleNavigate(informalWork === 'sim' ? SCREENS.AUTONOMO_CONFIRMATION : SCREENS.EMPRESARIO)}
                />
            )}
            {currentScreen === SCREENS.AUTONOMO_CONFIRMATION && (
                <Declaration_AutonomoConfirmation
                    onBack={() => handleNavigate(SCREENS.AUTONOMO)}
                    activity={activity}
                    onSave={(confirmation) => handleNavigate(confirmation === 'sim' ? SCREENS.EMPRESARIO : SCREENS.EMPRESARIO)}
                />
            )}
            {currentScreen === SCREENS.EMPRESARIO && (
                <Declaration_Empresario
                    onBack={() => handleNavigate(SCREENS.AUTONOMO_CONFIRMATION)}
                    onSave={(isPartner, activity) => {
                        setActivity(activity);
                        handleNavigate(isPartner === 'sim' ? SCREENS.EMPRESARIO_CONFIRMATION : SCREENS.INACTIVE_COMPANY);
                    }}
                />
            )}
            {currentScreen === SCREENS.EMPRESARIO_CONFIRMATION && (
                <Declaration_EmpresarioConfirmation
                    onBack={() => handleNavigate(SCREENS.EMPRESARIO)}
                    activity={activity}
                    onSave={(confirmation) => handleNavigate(confirmation === 'sim' ? SCREENS.INACTIVE_COMPANY : SCREENS.INACTIVE_COMPANY)}
                />
            )}
            {currentScreen === SCREENS.INACTIVE_COMPANY && (
                <Declaration_InactiveCompany
                    onBack={() => handleNavigate(SCREENS.EMPRESARIO_CONFIRMATION)}
                    onSave={(hasInactiveCompany, activity) => {
                        setActivity(activity);
                        handleNavigate(hasInactiveCompany === 'sim' ? SCREENS.INACTIVE_COMPANY_CONFIRMATION : SCREENS.RENT_INCOME);
                    }}
                />
            )}
            {currentScreen === SCREENS.INACTIVE_COMPANY_CONFIRMATION && (
                <Declaration_InactiveCompanyConfirmation
                    onBack={() => handleNavigate(SCREENS.INACTIVE_COMPANY)}
                    activity={activity}
                    onSave={(confirmation) => handleNavigate(confirmation === 'sim' ? SCREENS.RENT_INCOME : SCREENS.RENT_INCOME)}
                />
            )}
            {currentScreen === SCREENS.RENT_INCOME && (
                <Declaration_RentIncome
                    onBack={() => handleNavigate(SCREENS.INACTIVE_COMPANY_CONFIRMATION)}
                    onNext={(receivesRent) => handleNavigate(receivesRent ? SCREENS.RENT_INCOME_DETAILS : SCREENS.VEHICLE_OWNERSHIP)}
                />
            )}
            {currentScreen === SCREENS.RENT_INCOME_DETAILS && (
                <Declaration_RentIncomeDetails
                    onBack={() => handleNavigate(SCREENS.RENT_INCOME)}
                    onSave={handleNavigateToRentIncomeConfirmation}
                />
            )}
            {currentScreen === SCREENS.VEHICLE_OWNERSHIP && (
                <Declaration_VehicleOwnership
                    onBack={() => handleNavigate(SCREENS.RENT_INCOME)}
                    onNext={(confirmation) => handleNavigate(confirmation === 'sim' ? SCREENS.FAMILY_INCOME_CHANGE : SCREENS.FAMILY_INCOME_CHANGE)}
                />
            )}
            {currentScreen === SCREENS.FAMILY_INCOME_CHANGE && (
                <Declaration_FamilyIncomeChange
                    onBack={() => handleNavigate(SCREENS.RENT_INCOME)}
                    onResponsibilityConfirmation={handleNavigateToResponsibilityConfirmation}
                />
            )}
            {currentScreen === SCREENS.RESPONSIBILITY_CONFIRMATION && (
                <Declaration_ResponsibilityConfirmation
                    onBack={() => handleNavigate(SCREENS.FAMILY_INCOME_CHANGE)}
                    onNext={handleNavigateToWitnesses}
                />
            )}
            {currentScreen === SCREENS.WITNESSES && (
                <Declaration_Witnesses
                    onBack={() => handleNavigate(SCREENS.RESPONSIBILITY_CONFIRMATION)}
                    onNext={() => handleNavigate(SCREENS.OVERVIEW)}
                />
            )}
            {currentScreen === SCREENS.RENT_INCOME_CONFIRMATION && (
                <Declaration_RentIncomeConfirmation
                    onBack={() => handleNavigate(SCREENS.RENT_INCOME_DETAILS)}
                    onNext={() => handleNavigate(SCREENS.VEHICLE_OWNERSHIP)}
                />
            )}
        </div>
    );
}
