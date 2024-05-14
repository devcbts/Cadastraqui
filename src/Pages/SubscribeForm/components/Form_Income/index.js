import { useEffect, useState } from "react";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'

import candidateService from "services/candidate/candidateService";
import { NotificationService } from "services/notification";
import useStepFormHook from "Pages/SubscribeForm/hooks/useStepFormHook";
import IncomeList from "./IncomeList";
import MemberSelection from "./MemberSelection";
import IncomeSelection from "./IncomeSelection";
export default function FormIncome() {

    const handleEditInformation = async (data) => {
        try {
            await candidateService.updateIdentityInfo(data);
            NotificationService.success({ text: 'Informações alteradas' })
        } catch (err) {
            NotificationService.error({ text: err.response.data.message })

        }
    }
    const handleSaveInformation = async (data) => {
        const { id, incomeSource } = data
        try {
            // first update income source list from user
            await candidateService.updateIncomeSource({ id, incomeSource: [incomeSource] })
            NotificationService.success({ text: 'Informações cadastradas' })
        } catch (err) {
            NotificationService.error({ text: err.response.data.message })

        }
    }
    // Keep track if member is selected to render first screen (member selection)
    // const [memberHasIncome, setMemberHasIncome] = useState(false)
    // const [renderItems, setRenderItems] = useState([IncomeSelection])
    // useEffect(() => {
    //     console.log(!!memberHasIncome)
    //     if (!!memberHasIncome) {
    //         setRenderItems([IncomeSelection])
    //     } else {
    //         setRenderItems([MemberSelection, IncomeSelection])
    //     }
    // }, [memberHasIncome])
    const {
        Steps,
        pages: { previous, next },
        actions: { handleEdit },
        max,
        state: { activeStep, data, setData }
    } = useStepFormHook({
        render: [IncomeSelection],
        onEdit: handleEditInformation,
        onSave: handleSaveInformation
    })


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

    const handleSpecificSelection = ({ member, income }) => {
        const { id } = member
        const { income: { value }, list } = income
        setIsAdding(true)
        setData({ member, incomeSource: value, })
    }

    const handleAdd = ({ member = null }) => {
        // Here we're checking if user is updating or creating a new income 
        setIsAdding(true)
        setData({ member })
        // if (!member?.id) {
        //     setData(null)
        // } else {
        //     setData({ member: member })
        // }

    }
    return (
        <div className={commonStyles.container}>
            {!hasSelectionOrIsAdding() && <IncomeList onSelect={handleSpecificSelection} onAdd={handleAdd} />}
            {hasSelectionOrIsAdding() && <>
                <Steps />
                <div className={commonStyles.actions}>
                    <ButtonBase onClick={handlePrevious}>
                        <Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} />
                    </ButtonBase>


                    <ButtonBase onClick={handleEdit} label={"editar"} />

                    {activeStep !== max &&
                        <ButtonBase onClick={next}>
                            <Arrow width="40px" />
                        </ButtonBase>
                    }
                    {
                        (activeStep === max && isAdding) && (
                            <ButtonBase onClick={next}>
                                Salvar
                            </ButtonBase>
                        )
                    }

                </div>
            </>}



        </div >
    )
}