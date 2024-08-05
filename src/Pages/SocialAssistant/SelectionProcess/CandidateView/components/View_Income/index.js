
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import ButtonBase from "Components/ButtonBase"
import monthAtom from "Components/MonthSelection/atoms/month-atom"
import IncomeFile from "Pages/SubscribeForm/components/Form_Income/IncomeFile"
import IncomeSelection from "Pages/SubscribeForm/components/Form_Income/IncomeSelection"
import IncomeFormModelA from "Pages/SubscribeForm/components/Form_Income/ModelA"
import InformationModelA from "Pages/SubscribeForm/components/Form_Income/ModelA/components/InformationModelA"
import IncomeFormModelB from "Pages/SubscribeForm/components/Form_Income/ModelB"
import InformationModelB from "Pages/SubscribeForm/components/Form_Income/ModelB/components/InformationModelB"
import IncomeFormModelC from "Pages/SubscribeForm/components/Form_Income/ModelC"
import IncomeFormModelD from "Pages/SubscribeForm/components/Form_Income/ModelD"
import InformationModelD from "Pages/SubscribeForm/components/Form_Income/ModelD/components/InformationModelC"
import UnemployementInsurance from "Pages/SubscribeForm/components/Form_Income/Unemployed/components/UnemployementInsurance"
import useStepFormHook from "Pages/SubscribeForm/hooks/useStepFormHook"
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import IncomeList from "./components/IncomeList"

export default function ViewIncome({ candidateId, applicationId }) {
    const [renderItems, setRenderItems] = useState()
    const hasIncomeSelected = useRecoilValue(monthAtom)

    const {
        Steps,
        pages: { previous, next },
        max,
        state: { activeStep, data, setData, setActiveStep }
    } = useStepFormHook({
        render: renderItems,
        viewMode: true
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
        } else if (['Alimony', 'FinancialHelpFromOthers'].includes(currentIncomeSource)) {
            setRenderItems([IncomeSelection, InformationModelD, IncomeFormModelD])
        } else if (['Volunteer', 'Student'].includes(currentIncomeSource)) {
            setRenderItems([IncomeSelection
                , <IncomeFile
                    label={currentIncomeSource === "Student" ? "declaração que comprove frequência escolar" : null}
                />
            ])
        }

        else {
            setRenderItems([IncomeSelection])
        }
    }, [data?.incomeSource])
    const handlePrevious = () => {
        if (activeStep === 1) {
            setData(null)
            return
        }
        previous()
    }
    const handleSpecificSelection = ({ member, income, info }) => {
        const { income: { value }, list } = income
        setData({ member, incomeSource: value, months: list, ...info })
    }
    return (
        <div className={commonStyles.container}>

            {!data && <IncomeList applicationId={applicationId} onSelect={handleSpecificSelection} />}
            {data && <>
                <Steps />
                {!hasIncomeSelected && <div className={commonStyles.actions}>
                    <ButtonBase onClick={handlePrevious}>
                        <Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} />
                    </ButtonBase>

                    {(activeStep !== max || activeStep === 1) &&
                        <ButtonBase onClick={next}>
                            <Arrow width="30px" />
                        </ButtonBase>
                    }

                </div>}
            </>}



        </div >
    )
}