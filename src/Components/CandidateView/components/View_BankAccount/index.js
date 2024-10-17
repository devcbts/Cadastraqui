import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import ButtonBase from "Components/ButtonBase"
import monthAtom from "Components/MonthSelection/atoms/month-atom"
import BankAccount from "Pages/SubscribeForm/components/Form_BankAccount/components/BankAccount"
import BankMonthSelection from "Pages/SubscribeForm/components/Form_BankAccount/components/BankMonthSelection"
import useStepFormHook from "Pages/SubscribeForm/hooks/useStepFormHook"
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import MemberBankAccount from "./components/MemberBankAccount"
export default function ViewBankAccount({ id, applicationId, onBack }) {
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
            {!data && <MemberBankAccount id={id} onSelect={handleSelectAccount} applicationId={applicationId} onBack={onBack} />}
            {data && <>
                <Steps />
                {!hasMonthSelected && <div className={commonStyles.actions}>
                    <ButtonBase onClick={handlePrevious}>
                        <Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} />
                    </ButtonBase>



                    {activeStep !== max &&
                        <ButtonBase onClick={next}>
                            <Arrow width="30px" />
                        </ButtonBase>
                    }


                </div>}
            </>}
        </ >
    )
}