import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import Loader from "Components/Loader";
import monthAtom from "Components/MonthSelection/atoms/month-atom";
import useStepFormHook from "Pages/SubscribeForm/hooks/useStepFormHook";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import candidateService from "services/candidate/candidateService";
import { NotificationService } from "services/notification";
import ExpenseSelection from "./ExpenseSelection";

export default function FormExpenses() {
    const [isLoading, setIsLoading] = useState(true)
    const [renderList, _] = useState([ExpenseSelection])
    const handleSaveExpenses = async (data) => {
        try {
            const expenses = await candidateService.registerExpenses(data)
            setData(expenses)
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
                        <Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} />
                    </ButtonBase>
                )}
                {activeStep !== max &&
                    <ButtonBase onClick={next}>
                        <Arrow width="30px" />
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