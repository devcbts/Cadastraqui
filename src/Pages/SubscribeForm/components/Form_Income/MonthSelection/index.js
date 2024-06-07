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
// quantity = months that user needs to fullfill in order to proceed saving information
const IncomeMonthSelection = forwardRef(({ data, render = [] }, ref) => {

    return (
        <div className={[commonStyles.formcontainer, styles.container].join(' ')}>
            <h1 className={commonStyles.title}>Cadastrar Renda</h1>
            <p className={styles.user}>{data?.member?.fullName} - {INCOME_SOURCE.find(e => data?.incomeSource === e.value)?.label}</p>
            <MonthSelection
                ref={ref}
                render={render}
                data={data}
                schema={monthSelectionSchema(data.quantity)}
            />
        </div>
    )
})

export default IncomeMonthSelection