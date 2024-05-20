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
// quantity = months that user needs to fullfill in order to proceed saving information
const MonthSelection = forwardRef(({ data, render = [] }, ref) => {
    const { watch, setValue, getValues, trigger, formState: { errors } } = useControlForm({
        schema: monthSelectionSchema(data.quantity),
        defaultValues: {
            incomes: [],
            quantity: data.quantity
        },
        initialData: data
    }, ref)

    const getMonths = () => {
        return Array.from({ length: data.quantity }).map((_, index) => {
            const currentDate = new Date();
            currentDate.setDate(1)
            currentDate.setMonth(currentDate.getMonth() - (index + 1));
            return {
                getDate: currentDate,
                getDateString: currentDate.toLocaleString("pt-br", { month: "long", year: "numeric" })
            }
        })
    }
    useEffect(() => {
        // Get the current value (if API returns any) and prepend on the array
        const incomes = getValues("incomes") ?? []
        const quantity = data?.quantity
        const appendOn = quantity - incomes.length
        const newArray = Array.from({ length: quantity }).map((e, i) => {
            // Compare function to validate if specific month was already on the response, if it's true => set isUpdated to true (just to display error)
            const hasMonthInfo = (date) => {
                return !!incomes.find(e => ((new Date(e.date).getMonth() === new Date(date).getMonth()) && (new Date(e.date).getFullYear() === new Date(date).getFullYear())))
            }
            if (i >= appendOn) {
                const currObj = incomes[i - appendOn]
                return { ...currObj, isUpdated: hasMonthInfo(currObj.date), dateString: new Date(currObj.date).toLocaleString("pt-br", { month: "long", year: "numeric" }) }
            }
            const { getDate, getDateString } = getMonths()[i]
            return { ...e, date: getDate, isUpdated: hasMonthInfo(getDate), dateString: getDateString }
        })
        // set the current incomes value to the newArray created, do it only ONCE when this component is rendered
        setValue("incomes",
            newArray.sort((a, b) => {
                const dateA = new Date(a.date), dateB = new Date(b.date)
                return dateA < dateB
            })
        )
    }, [])
    const watchIncomes = watch("incomes")


    const [monthSelected, setMonthSelected] = useRecoilState(incomeAtom)

    const handleSave = (_, data) => {
        // Find the current month to be updated at "incomes" array, then update the entire array
        const monthsToUpdate = watchIncomes.map(e => {
            if (e.date === monthSelected.date) {
                return { ...monthSelected, ...data, isUpdated: true }
            }
            return e
        })
        setValue("incomes", monthsToUpdate)
        trigger()
        setMonthSelected(null)

    }
    const { Steps,
        state: { activeStep, setData, setActiveStep },
        pages: { previous, next },
        max,
    } = useStepFormHook({
        render,
        onSave: handleSave,
        showStepper: false
    })
    const handleSelectMonth = (month) => {
        setActiveStep(1)
        setMonthSelected(month)
        setData(month)
    }

    const handlePrevious = () => {
        if (activeStep === 1) {
            setMonthSelected(null)
        } else {
            previous()
        }
    }
    // Render the current selected month data based on what month user has clicked
    // If NO month is selected, then the field to be send to API ("incomes") will stay the same as it is
    // Else, the other pages will be responsible for changing the data, and THIS component will save the new data to the specified "incomes" array 
    // setMonth is responsible for keep tracking of which month is selected, it's using recoil so the component isn't remounted each data change,
    // not triggering useEffect many times (it'd result on every month having 'isUpdated:true')
    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Cadastrar Renda</h1>
            <p>{data?.member?.fullName} - {INCOME_SOURCE.find(e => data?.incomeSource === e.value)?.label}</p>
            {!monthSelected &&
                <>
                    <p className={styles.text}>Agora realize o cadastro de renda para cada um dos meses abaixo, inserindo as informações correspondentes.</p>
                    {
                        Array.from({ length: data.quantity }).map((_, index) => (
                            <>
                                <ButtonBase label={watchIncomes?.[index]?.dateString} onClick={() => handleSelectMonth(watchIncomes?.[index])} />
                                {errors?.incomes?.[index]?.isUpdated?.message && <p className={styles.error}>{watchIncomes?.[index]?.dateString} desatualizado</p>}
                            </>

                        ))
                    }
                </>
            }
            {
                monthSelected && (
                    <>
                        <span className={styles.month}>{monthSelected.dateString}</span>
                        <Steps />
                        {<div className={commonStyles.actions}>
                            <ButtonBase onClick={handlePrevious}>
                                <Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} />
                            </ButtonBase>
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
                    </>
                )
            }
        </div>
    )
})

export default MonthSelection