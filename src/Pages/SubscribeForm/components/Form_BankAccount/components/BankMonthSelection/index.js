import { forwardRef, useEffect, useImperativeHandle, useMemo } from "react";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import ButtonBase from "Components/ButtonBase";
import { useRecoilState } from "recoil";
import useStepFormHook from "Pages/SubscribeForm/hooks/useStepFormHook";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import styles from './styles.module.scss'
import useControlForm from "hooks/useControlForm";
import bankMonthSelectionSchema from "./schemas/bank-month-selection-schema";
import incomeAtom from "Pages/SubscribeForm/components/Form_Income/atoms/income-atom";
import MonthSelection from "Components/MonthSelection";
import Statement from "../Statement";
// quantity = months that user needs to fullfill in order to proceed saving information
const BankMonthSelection = forwardRef(({ data }, ref) => {
    console.log('renderizei bankmonthselection')
    useEffect(() => {
        console.log('ref changed')
    }, [ref])
    return (
        <div className={[commonStyles.formcontainer, styles.container].join(' ')}>
            <h1 className={commonStyles.title}>Cadastrar Extrato</h1>
            <MonthSelection
                ref={ref}
                data={{ ...data, quantity: 3 }}
                schema={bankMonthSelectionSchema}
                render={[
                    Statement
                ]}
            />
        </div>
    )
})

export default BankMonthSelection