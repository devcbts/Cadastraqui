import { useEffect, useState } from "react";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import candidateService from "services/candidate/candidateService";
import { NotificationService } from "services/notification";
import useStepFormHook from "Pages/SubscribeForm/hooks/useStepFormHook";
import IncomeList from "./IncomeList";
import IncomeSelection from "./IncomeSelection";
import MonthSelection from "./MonthSelection";
import { useRecoilState, useRecoilValue } from "recoil";
import incomeAtom from "./atoms/income-atom";
import UnemployedModel from "./Unemployed";
import IncomeFormModelA from "./ModelA";
import UnemployementInsurance from "./Unemployed/components/UnemployementInsurance";
import InformationModelA from "./ModelA/components/InformationModelA";
import InformationModelB from "./ModelB/components/InformationModelB";
import IncomeFormModelB from "./ModelB";
import IncomeFormModelC from "./ModelC";
import InformationModelD from "./ModelD/components/InformationModelC";
import IncomeFormModelD from "./ModelD";
import monthAtom from "Components/MonthSelection/atoms/month-atom";
import IncomeFile from "./IncomeFile";
import uploadService from "services/upload/uploadService";
import createFileForm from "utils/create-file-form";
import FinancialHelp from "./ModelD/components/FinancialHelp";
export default function FormIncome() {
    // Keep track of incomes created/updated by user
    const hasIncomeSelected = useRecoilValue(monthAtom)
    const handleEditInformation = async (data) => {
        try {
            await candidateService.updateIdentityInfo(data);
            NotificationService.success({ text: 'Informações alteradas' })
        } catch (err) {
            NotificationService.error({ text: err.response.data.message })

        }
    }
    const handleSaveInformation = async (data) => {
        const { member, incomeSource } = data
        // If we're selecting income source, move to the next page instead of execute onSave on first page
        if (activeStep === 1) {
            setActiveStep(2)
            return
        }
        // if data.id exists, the data is being updated
        try {
            let formData;
            const { incomeId, monthlyIncomesId } = await candidateService.updateIncome(member.id, data)
            // if incomes  ===  null or []
            // save to 'income' folder
            if (data.file_document) {
                formData = createFileForm(data)
                await uploadService.uploadBySectionAndId({ section: 'income', id: member.id, tableId: incomeId }, formData)
            } else {
                await Promise.all(data.incomes.map(async (e, index) => {
                    const formData = createFileForm(e)
                    return await uploadService.uploadBySectionAndId({ section: 'monthly-income', id: member.id, tableId: monthlyIncomesId[index] }, formData)
                }))
            }
            if (data.id) {
                NotificationService.success({ text: 'Informações de renda alteradas' })
                return
            }
            // if (data.incomes) {
            //     await candidateService.updateIncome(member.id, data)
            //     console.log(data)
            // }
            // first update income source list from user
            // await candidateService.updateIncomeSource({ id: member.id, incomeSource: [incomeSource] })
            // const id = await candidateService.registerEmploymentType(member.id, data)
            // await candidateService.registerMonthlyIncome(member.id, data)
            // const formData = createFileForm(data)
            // await uploadService.uploadBySectionAndId({ section: 'income', id: member.id, tableId: id }, formData)
            // then execute the rest of operation
            NotificationService.success({ text: 'Informações cadastradas' }).then(_ => {
                setData(null)
                setIsAdding(false)
                setActiveStep(1)
            })
        } catch (err) {
            console.log(err)
            NotificationService.error({ text: err?.response?.data?.message })

        }
    }

    const [renderItems, setRenderItems] = useState()
    const {
        Steps,
        pages: { previous, next },
        actions: { handleEdit },
        max,
        state: { activeStep, data, setData, setActiveStep }
    } = useStepFormHook({
        render: renderItems,
        onEdit: handleEditInformation,
        onSave: handleSaveInformation
    })
    useEffect(() => {
        const currentIncomeSource = data?.incomeSource
        if (currentIncomeSource === "Unemployed") {
            setRenderItems([IncomeSelection, UnemployementInsurance])
        } else if (['SelfEmployed', 'InformalWorker', 'RentalIncome', 'PrivatePension', 'LiberalProfessional', 'TemporaryRuralEmployee'].includes(currentIncomeSource)) {
            setRenderItems([IncomeSelection, InformationModelA, IncomeFormModelA])
        } else if (['IndividualEntrepreneur'].includes(currentIncomeSource)) {
            setRenderItems([IncomeSelection, InformationModelB, IncomeFormModelA])
        } else if (['PrivateEmployee', 'PublicEmployee', 'DomesticEmployee', 'Retired', 'Pensioner', 'Apprentice', 'TemporaryDisabilityBenefit'].includes(currentIncomeSource)) {
            setRenderItems([IncomeSelection, InformationModelB, IncomeFormModelB])
        } else if (['BusinessOwnerSimplifiedTax', 'BusinessOwner'].includes(currentIncomeSource)) {
            setRenderItems([IncomeSelection, InformationModelB, IncomeFormModelC])
        } else if (['Alimony'].includes(currentIncomeSource)) {
            setRenderItems([IncomeSelection, InformationModelD, IncomeFormModelD])
        } else if (['FinancialHelpFromOthers'].includes(currentIncomeSource)) {
            setRenderItems([IncomeSelection, InformationModelD, IncomeFormModelD, FinancialHelp])
        }
        else if (['Volunteer', 'Student'].includes(currentIncomeSource)) {
            setRenderItems([IncomeSelection, IncomeFile])
        } else {
            setRenderItems([IncomeSelection])
        }
    }, [data?.incomeSource])

    const [isAdding, setIsAdding] = useState(false)

    const hasSelectionOrIsAdding = () => {
        return data || isAdding
    }
    const handlePrevious = () => {
        if (activeStep === 1) {
            setData(null)
            setIsAdding(false)
            return
        }
        previous()
    }

    const handleSpecificSelection = ({ member, income, info }) => {
        const { income: { value }, list } = income
        setIsAdding(true)
        setData({ member, incomeSource: value, months: list, ...info })
    }

    const handleAdd = ({ member = null }) => {
        setIsAdding(true)
        setData({ member })
    }
    return (
        <div className={commonStyles.container}>
            {!hasSelectionOrIsAdding() && <IncomeList onSelect={handleSpecificSelection} onAdd={handleAdd} />}
            {hasSelectionOrIsAdding() && <>
                <Steps />
                {!hasIncomeSelected && <div className={commonStyles.actions}>
                    <ButtonBase onClick={handlePrevious}>
                        <Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} />
                    </ButtonBase>


                    {/* <ButtonBase onClick={handleEdit} label={"editar"} /> */}

                    {(activeStep !== max || activeStep === 1) &&
                        <ButtonBase onClick={next}>
                            <Arrow width="40px" />
                        </ButtonBase>
                    }
                    {
                        (activeStep === max && activeStep !== 1) && (
                            <ButtonBase onClick={next}>
                                Salvar
                            </ButtonBase>
                        )
                    }

                </div>}
            </>}



        </div >
    )
}