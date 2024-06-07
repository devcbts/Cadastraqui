import ButtonBase from "Components/ButtonBase";
import useStepFormHook from "Pages/SubscribeForm/hooks/useStepFormHook";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import Loader from "Components/Loader";
import { useEffect, useState } from "react";
import ExpenseSelection from "./ExpenseSelection";
import candidateService from "services/candidate/candidateService";
import { NotificationService } from "services/notification";
import { useRecoilState, useRecoilValue } from "recoil";
import monthAtom from "Components/MonthSelection/atoms/month-atom";

export default function FormExpenses() {
    const [isLoading, setIsLoading] = useState(true)
    const [renderList, _] = useState([ExpenseSelection])
    const handleSaveExpenses = async (data) => {
        try {
            await candidateService.registerExpenses(data)
            NotificationService.success({ text: 'Despesas cadastradas com sucesso' })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }
    const {
        Steps,
        state: { activeStep, data, setData },
        pages: { previous, next },
        max
    } = useStepFormHook({
        render: renderList,
        onSave: handleSaveExpenses,
        showStepper: false
    })
    const [hasSelectedMonth, setHasSelectedMonth] = useRecoilState(monthAtom)
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                setIsLoading(true)
                const information = await candidateService.getExpenses()
                setData(information)
            } catch (err) {

            }
            setIsLoading(false)
        }
        fetchExpenses()
        return () => {
            setHasSelectedMonth(null)
        }
    }, [])

    return (
        <div className={commonStyles.container}>
            <Loader loading={isLoading} />
            <Steps />
            {!hasSelectedMonth && <div className={commonStyles.actions}>
                {activeStep !== 1 && (
                    <ButtonBase onClick={previous}>
                        <Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} />
                    </ButtonBase>
                )}
                {activeStep !== max &&
                    <ButtonBase onClick={next}>
                        <Arrow width="40px" />
                    </ButtonBase>
                }
                {
                    activeStep === max && (
                        <ButtonBase onClick={next}>
                            Salvar
                        </ButtonBase>
                    )
                }
            </div>}
        </div >
    )
}