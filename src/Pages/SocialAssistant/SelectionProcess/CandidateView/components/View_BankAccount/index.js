import ButtonBase from "Components/ButtonBase"
import monthAtom from "Components/MonthSelection/atoms/month-atom"
import useStepFormHook from "Pages/SubscribeForm/hooks/useStepFormHook"
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import MemberBankAccount from "./components/MemberBankAccount"
import BankAccount from "Pages/SubscribeForm/components/Form_BankAccount/components/BankAccount"
import BankMonthSelection from "Pages/SubscribeForm/components/Form_BankAccount/components/BankMonthSelection"
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
export default function ViewBankAccount({ id, applicationId }) {
    const [renderList, setRenderList] = useState([])
    useEffect(() => {
        setRenderList([
            BankAccount,
            BankMonthSelection
        ])
    }, [])
    const {
        Steps,
        state: { data, activeStep, setData },
        max,
        pages: { previous, next },
    } = useStepFormHook({
        render: renderList,
        viewMode: true

    })
    const hasMonthSelected = useRecoilValue(monthAtom)
    const handlePrevious = () => {
        if (activeStep === 1) {
            setData(null)
            return
        }
        previous()
    }
    const handleSelectAccount = (account) => {
        setData(account)
    }
    return (
        <>
            {!data && <MemberBankAccount id={id} onSelect={handleSelectAccount} applicationId={applicationId} />}
            {data && <>
                <Steps />
                {!hasMonthSelected && <div className={commonStyles.actions}>
                    <ButtonBase onClick={handlePrevious}>
                        <Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} />
                    </ButtonBase>



                    {activeStep !== max &&
                        <ButtonBase onClick={next}>
                            <Arrow width="40px" />
                        </ButtonBase>
                    }


                </div>}
            </>}
        </ >
    )
}