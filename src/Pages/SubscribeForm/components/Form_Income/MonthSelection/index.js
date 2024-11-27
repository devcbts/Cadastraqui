import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import ButtonBase from "Components/ButtonBase";
import { zodResolver } from "@hookform/resolvers/zod";
import monthSelectionSchema from "./schemas/month-selection-schema";
import { useRecoilState } from "recoil";
import incomeAtom from "../atoms/income-atom";
import useStepFormHook from "Pages/SubscribeForm/hooks/useStepFormHook";
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import styles from './styles.module.scss'
import INCOME_SOURCE from "utils/enums/income-source";
import useControlForm from "hooks/useControlForm";
import MonthSelection from "Components/MonthSelection";
import useTutorial from "hooks/useTutorial";
import INCOME_TUTORIALS from "utils/enums/tutorials/income";
import { ReactComponent as Help } from 'Assets/icons/question-mark.svg'
import Tooltip from "Components/Tooltip";
import moneyInputMask from "Components/MoneyFormInput/money-input-mask";
// quantity = months that user needs to fullfill in order to proceed saving information
const IncomeMonthSelection = forwardRef(({ data, render = [], viewMode }, ref) => {
    useTutorial(INCOME_TUTORIALS.MONTHS[data?.incomeSource])
    return (
        <div className={[commonStyles.formcontainer, styles.container].join(' ')}>
            <h1 className={commonStyles.title}>Cadastrar Renda</h1>
            <p className={styles.user}>{data?.member?.fullName} - {INCOME_SOURCE.find(e => data?.incomeSource === e.value)?.label}</p>
            <MonthSelection
                ref={ref}
                render={render}
                data={data}
                viewMode={viewMode}
                schema={monthSelectionSchema(data.quantity, data.incomeSource)}
                sideInfo={viewMode ? (month) => {
                    return <Tooltip tooltip={'Renda obtida para fins do processo seletivo'} Icon={Help}><strong>{moneyInputMask(month?.liquidAmount)}</strong></Tooltip>
                } : null}
                checkRegister={true}
            />
        </div>
    )
})

export default IncomeMonthSelection