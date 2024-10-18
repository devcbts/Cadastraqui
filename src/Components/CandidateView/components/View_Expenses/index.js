import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg';
import ButtonBase from "Components/ButtonBase";
import Loader from "Components/Loader";
import monthAtom from "Components/MonthSelection/atoms/month-atom";
import ExpenseSelection from "Pages/SubscribeForm/components/Form_Expenses/ExpenseSelection";
import useStepFormHook from "Pages/SubscribeForm/hooks/useStepFormHook";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import applicationService from 'services/application/applicationService';
import socialAssistantService from "services/socialAssistant/socialAssistantService";
export default function ViewExpenses({ applicationId }) {
    const hasSelectedMonth = useRecoilValue(monthAtom)
    const [renderList, _] = useState([ExpenseSelection])
    const [isLoading, setIsLoading] = useState(true)
    const {
        Steps,
        state: { activeStep, data, setData },
        pages: { previous, next },
        max
    } = useStepFormHook({
        render: renderList,
        showStepper: false,
        viewMode: true
    })
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const information = await applicationService.getExpenses(applicationId)
                setData(information)
            } catch (err) { }
            setIsLoading(false)
        }
        fetchData()
    }, [applicationId])
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
            </div>}
        </div >
    )
}